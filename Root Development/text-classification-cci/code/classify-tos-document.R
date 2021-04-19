library(tidyverse)
library(tm)
library(caret)
library(tidytext)
source("code/text-classification-api.R")

tos_model = readRDS("models/terms-of-service/tos_rf.RDS")
privacy_model = readRDS("models/privacy-policy/privacy_rf.RDS")

# example tos files
whoop_filename_tos = "input/terms-of-service/whoop-tos.txt"
fitbit_filename_tos = "input/terms-of-service/fitbit-tos.txt"
cellartracker_filename_tos = "input/terms-of-service/cellartracker-tos.txt"
google_nest_filename_tos = "input/terms-of-service/google-nest-tos.txt"
# example privacy files
whoop_filename_privacy = "input/privacy-policy/whoop-privacy.txt"
fitbit_filename_privacy = "input/privacy-policy/fitbit-privacy.txt"
cellartracker_filename_privacy = "input/privacy-policy/cellartracker-privacy.txt"
google_nest_filename_privacy = "input/privacy-policy/google-nest-privacy.txt"

#specify filename_of_tos_txt_document_to_classify
filename_of_tos_txt_document_to_classify = cellartracker_filename_tos
tos_document_to_classify_as_tbl = read_txt_file_into_tibble(filename_of_tos_txt_document_to_classify)


# unnest all the tokens
tos_tokens = tos_document_to_classify_as_tbl %>% unnest_tokens(output = word, input = Text)
# filter out any text that contains a digit anywhere or is not of length 5
tos_tokens = tos_tokens %>% filter(str_detect(word, "^\\D+$") & str_detect(word, "\\w{5,}"))
# tos_tokens = filter(tos_tokens, str_detect(word, "^\\D+$") & str_detect(word, "\\w{5,}"))
tos_tokens = tos_tokens %>% anti_join(stop_words, by="word")
tos_tokens = tos_tokens %>% mutate(word = SnowballC::wordStem(word))


# model variables 
model_vars = colnames(tos_model$trainingData)
model_vars = model_vars[2:length(model_vars)]


# tweets with entries we can classify are
rows_we_can_classify = tos_tokens$ID %>% unique()
tos_document_to_classify_as_tbl_for_classification = tos_document_to_classify_as_tbl[rows_we_can_classify,]

# create a document-term matrix with all features and tf weighting
# you can ignore the warning
tos_dtm = count(tos_tokens, ID, word)
tos_dtm = cast_dtm(tos_dtm, document = ID, term = word, value = n)



# remove any tokens that are missing from more than 99% of the documents in the corpus	   
tos_dtm = removeSparseTerms(tos_dtm, sparse = .99)
model_data = cbind.data.frame(as.matrix(tos_dtm))


needed_names = setdiff(model_vars, tos_tokens$word)
needed_names = c(needed_names, setdiff(model_vars, colnames(model_data)))
needed_names = needed_names %>% unique()

for (i in 1:length(needed_names))
{
  colnames_of_interest = needed_names[i]
  model_data[,colnames_of_interest] = 0
}
model_data = model_data[,model_vars]

classifications_for_tos_document = predict(tos_model, model_data)
tos_document_to_classify_as_tbl_for_classification$Vendor = classifications_for_tos_document
tos_document_summary = tos_document_to_classify_as_tbl_for_classification %>% group_by(Vendor) %>% summarise(VendorProbability = n()) %>% arrange(desc(VendorProbability))
tos_document_summary = tos_document_summary %>% mutate(VendorProbability = VendorProbability / sum(VendorProbability))
tos_plurality_classification = tos_document_summary$Vendor[1]
print(paste("The plurality vendor match for this document is:", tos_plurality_classification))
print("The detailed breakdown of its vendor DNA is:")
print(tos_document_summary)
