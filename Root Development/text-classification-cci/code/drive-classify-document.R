library(tidyverse)
# get our functions from classify document
source("code/classify-document.R")

prettyPrintResult = function(filename, result)
{
  print(paste("Filename:",filename,"yielded:",result))
}
TEST_GET_LETTER_GRADE = TRUE
TEST_SIMILAR_VENDOR = TRUE
AVOID_MODEL_BIAS = TRUE
RETURN_DNA_DF = FALSE

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



# put them in vectors
tos_filelist = c(whoop_filename_tos, fitbit_filename_tos, cellartracker_filename_tos, google_nest_filename_tos)
privacy_filelist = c(whoop_filename_privacy, fitbit_filename_privacy, cellartracker_filename_privacy, google_nest_filename_privacy)

# get a random tos file
random_tos_file = tos_filelist %>% sample(1)
# get a random privacy file
random_privacy_file = privacy_filelist %>% sample(1)
# get a random file - could be either tos or privacy - for testing "infer"
random_file = c(tos_filelist, privacy_filelist) %>% sample(1)

if (TEST_GET_LETTER_GRADE)
{
  letter_grade_for_tos_vendor = get_grade_for_txt_file(txt_filename = random_tos_file, filetype="TOS")
  prettyPrintResult(random_tos_file, letter_grade_for_tos_vendor)
  letter_grade_for_privacy_vendor = get_grade_for_txt_file(txt_filename = random_privacy_file, filetype="PRIVACY")
  prettyPrintResult(random_privacy_file, letter_grade_for_privacy_vendor)
  letter_grade_for_inferred_vendor = get_grade_for_txt_file(txt_filename = random_file) # same as filetype = "INFER"
  prettyPrintResult(random_file, letter_grade_for_inferred_vendor)
}

if (TEST_SIMILAR_VENDOR)
{
  similar_tos_vendor = get_most_similar_vendor_for_txt_file(txt_filename = random_tos_file, filetype="TOS", 
                                                            avoid_model_bias = AVOID_MODEL_BIAS,
                                                            return_dna_df = RETURN_DNA_DF)
  prettyPrintResult(random_tos_file, similar_tos_vendor)
  similar_privacy_vendor = get_most_similar_vendor_for_txt_file(txt_filename = random_privacy_file, filetype="PRIVACY", 
                                                                avoid_model_bias = AVOID_MODEL_BIAS,
                                                                return_dna_df = RETURN_DNA_DF)
  prettyPrintResult(random_privacy_file, similar_privacy_vendor)
  similar_inferred_vendor = get_most_similar_vendor_for_txt_file(txt_filename = random_file, 
                                                                 avoid_model_bias = AVOID_MODEL_BIAS,
                                                                 return_dna_df = RETURN_DNA_DF) # same as filetype = "INFER"
  prettyPrintResult(random_file, similar_inferred_vendor)
}