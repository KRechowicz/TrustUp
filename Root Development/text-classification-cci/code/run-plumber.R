library(plumber)
source("code/classify-document.R")

pr <- plumber::plumb("code/get-grade-for-txt-file-api.R")
pr$run(host="0.0.0.0", port=4000)