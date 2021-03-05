#install.packages("caret", dependencies=TRUE, repos='http://cran.rstudio.com/')
library(caret)
library(tidyverse)
library(tm)
library(tidytext)
source("code/text-classification-api.R")

tos_model = readRDS("models/terms-of-service/tos_rf.RDS")
privacy_model = readRDS("models/privacy-policy/privacy_rf.RDS")

vendor_grades = read_csv("data/vendor-grade-dictionary/vendor_grades.csv")
grade_values = read_csv("data/vendor-grade-dictionary/grade_values.csv")

gradebook = vendor_grades %>% inner_join(grade_values, by="grade") %>% select(-ID)

INFER_FILETYPE = "INFER"
TOS_FILETYPE = "TOS"
PRIVACY_FILETYPE = "PRIVACY"

tos_keyword = "terms"
privacy_keyword = "privacy"

VERBOSE = FALSE

get_letter_grade_from_number = function(score)
{
  a_df = grade_values %>% filter(grade == "A")
  a_score = a_df$score[1]
  
  b_df = grade_values %>% filter(grade == "B")
  b_score = b_df$score[1]
  
  c_df = grade_values %>% filter(grade == "C")
  c_score = c_df$score[1]
  
  d_df = grade_values %>% filter(grade == "D")
  d_score = d_df$score[1]
  
  e_df = grade_values %>% filter(grade == "D")
  e_score = d_df$score[1]
  
  if (score >= a_score)
  {
    return("A")
  }
  if (score < a_score & score >= b_score)
  {
    return("B")
  }
  if (score < b_score & score >= c_score)
  {
    return("C")
  }
  if (score < c_score & score >= d_score)
  {
    return("D")
  }
  return ("E")
}

get_grade_for_txt_file = function(txt_filename, filetype="INFER", avoid_model_bias=TRUE)
{
  
  vendor_dna_df = get_most_similar_vendor_for_txt_file(txt_filename, filetype, avoid_model_bias, TRUE)
  vendor_dna_df = vendor_dna_df %>% inner_join(gradebook, by="Vendor")
  vendor_dna_df = vendor_dna_df %>% mutate(score_contribution = score*VendorProbability)
  total_score = vendor_dna_df$score_contribution %>% sum()
  txt_file_letter_grade = get_letter_grade_from_number(total_score)
  return(txt_file_letter_grade)
}


get_most_similar_vendor_for_txt_file = function(txt_filename, filetype="INFER", avoid_model_bias, return_dna_df)
{
  
  filename_of_txt_document_to_classify = txt_filename
  document_to_classify_as_tbl = read_txt_file_into_tibble(filename_of_txt_document_to_classify)
  if (VERBOSE) print(paste("Read in ", txt_filename))
  
  # unnest all the tokens
  tokens = document_to_classify_as_tbl %>% unnest_tokens(output = word, input = Text)
  # filter out any text that contains a digit anywhere or is not of length 5
  tokens = tokens %>% filter(str_detect(word, "^\\D+$") & str_detect(word, "\\w{5,}"))
  # tokens = filter(tokens, str_detect(word, "^\\D+$") & str_detect(word, "\\w{5,}"))
  tokens = tokens %>% anti_join(stop_words, by="word")
  tokens = tokens %>% mutate(word = SnowballC::wordStem(word))
  
  model = NULL
  if (filetype == TOS_FILETYPE)
  {
    model = tos_model
    if (VERBOSE) print("Using TOS model")
  }
  if (filetype == PRIVACY_FILETYPE)
  {
    model = privacy_model
    if (VERBOSE) print("Using PRIVACY model")
  }
  if (filetype == INFER_FILETYPE)
  {
    tos_count = document_to_classify_as_tbl %>% filter(Text %>% str_detect(tos_keyword)) %>% nrow()
    privacy_count = document_to_classify_as_tbl %>% filter(Text %>% str_detect(privacy_keyword)) %>% nrow()
    if (tos_count >= privacy_count)
    {
      model = tos_model
      if (VERBOSE) print("Using TOS model")
    }
    if (privacy_count > tos_count)
    {
      model = privacy_model
      if (VERBOSE) print("Using PRIVACY model")
    }
  }
 
  # model variables 
  model_vars = colnames(model$trainingData)
  model_vars = model_vars[2:length(model_vars)]
  
  
  # tweets with entries we can classify are
  rows_we_can_classify = tokens$ID %>% unique()
  document_to_classify_as_tbl_for_classification = document_to_classify_as_tbl[rows_we_can_classify,]
  
  # create a document-term matrix with all features and tf weighting
  # you can ignore the warning
  dtm = count(tokens, ID, word)
  dtm = cast_dtm(dtm, document = ID, term = word, value = n)
  
  
  
  # remove any tokens that are missing from more than 99% of the documents in the corpus	   
  dtm = removeSparseTerms(dtm, sparse = .99)
  model_data = cbind.data.frame(as.matrix(dtm))
  
  
  needed_names = setdiff(model_vars, tokens$word)
  needed_names = c(needed_names, setdiff(model_vars, colnames(model_data)))
  needed_names = needed_names %>% unique()
  
  for (i in 1:length(needed_names))
  {
    colnames_of_interest = needed_names[i]
    model_data[,colnames_of_interest] = 0
  }
  model_data = model_data[,model_vars]
  
  classifications_for_document = predict(model, model_data)
  document_to_classify_as_tbl_for_classification$Vendor = classifications_for_document
  document_summary = document_to_classify_as_tbl_for_classification %>% group_by(Vendor) %>% summarise(VendorProbability = n()) %>% arrange(desc(VendorProbability))
  document_summary = document_summary %>% mutate(VendorProbability = VendorProbability / sum(VendorProbability))
  if (VERBOSE) print(document_summary)
  plurality_classification = document_summary$Vendor[1]
  if (avoid_model_bias)
  {
    removed_row = document_summary[1,]
    probability_to_add_back_in = removed_row$VendorProbability[1]
    plurality_classification = document_summary$Vendor[2]
    
    document_summary = document_summary[2:nrow(document_summary),]
    remaining_rows = document_summary %>% nrow()
    per_row_addition = probability_to_add_back_in/remaining_rows
    document_summary = document_summary %>% mutate(VendorProbability = VendorProbability + per_row_addition)
  }
  if (return_dna_df==FALSE)
  {
    return(plurality_classification)
  }
  if (return_dna_df)
  {
    return(document_summary)
  }
}

