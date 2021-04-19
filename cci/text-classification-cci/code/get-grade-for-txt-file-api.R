#* Return the sum of two numbers
#* @param txtFilename The name of the txt file to analyze
#* @param fileType The type of file to analyze ["TOS", "PRIVACY", or "INFER"] (optional, INFER used if not specified)
#* @param avoidModelBias TRUE if the method should avoid a possible dominant top choice for similar vendors (optional, TRUE used if not specified)
#* @get /getGradeForTxtFile
getGradeForTxtFile <- function(txtFilename, fileType="INFER", avoidModelBias=TRUE)
{
  avoidModelBias = avoidModelBias %>% as.character() %>% as.logical()
  return(get_grade_for_txt_file(txtFilename, fileType, avoidModelBias))
}

#* Return the sum of two numbers
#* @param txtFilename The name of the txt file to analyze
#* @param fileType The type of file to analyze ["TOS", "PRIVACY", or "INFER"] (optional, INFER used if not specified)
#* @param avoidModelBias TRUE if the method should avoid a possible dominant top choice for similar vendors (optional, TRUE used if not specified)
#* @get /getMostSimilarVendorForTxtFile
getMostSimilarVendorForTxtFile <- function(txtFilename, fileType="INFER", avoidModelBias=TRUE)
{
  avoidModelBias = avoidModelBias %>% as.character() %>% as.logical()
  return(get_most_similar_vendor_for_txt_file(txtFilename, fileType, avoidModelBias, FALSE))
}
