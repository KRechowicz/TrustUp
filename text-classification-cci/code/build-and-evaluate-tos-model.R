library(tidyverse)
library(tm)
library(caret)
library(tidytext)

source("code/text-classification-api.R")

# set the random number seed for development
set.seed(42)

# get all the tos data in a single table
tos_data = read_all_files_in_dir_into_tibble("data/pp sentences/", replace_vendor=TRUE)


# unnest all the tokens
tos_tokens = tos_data %>% unnest_tokens(output = word, input = Text)

# filter out any text that contains a digit anywhere or is not of length 5
tos_tokens = tos_tokens %>% filter(str_detect(word, "^\\D+$") & str_detect(word, "\\w{5,}"))
tos_tokens = tos_tokens %>% anti_join(stop_words, by="word")

tos_tokens = tos_tokens %>% mutate(word = SnowballC::wordStem(word))

# create a document-term matrix with all features and tf weighting
tos_dtm_tf_idf = tos_tokens %>% count(ID, word) %>% bind_tf_idf(word, ID, n)
tos_dtm_tf_idf = tos_dtm_tf_idf %>% cast_dtm(document = ID, term = word, value = tf_idf)

# remove any tokens that are missing from more than 99.9% of the documents in the corpus	   
tos_dtm_tf_idf = tos_dtm_tf_idf %>% removeSparseTerms(sparse = .999)

# at this point we have filtered out some of the original text that have not met our guidelines
# (only contains strings with numbers or of length less than 5)
# so we need to figure out which text rows are left, we can do this with group_by
# followed by a meaningless summarise. The goal here is to get the vendor
# labels for the messages left in our data set
vendors_i_want = tos_tokens %>% group_by(ID, Vendor) %>% summarise(n=n())


# build the model data
model_data = cbind.data.frame(as.matrix(tos_dtm_tf_idf), as.factor(vendors_i_want$Vendor))
number_of_cols = ncol(model_data)
colnames(model_data) = c(colnames(model_data)[1:(number_of_cols-1)], "Vendor")


# split train and test
index = createDataPartition(model_data$Vendor, p = 0.7, list = FALSE)
train_data = model_data[index, ]
test_data  = model_data[-index, ]


# this runs pretty quickly
tos_rf = train(Vendor ~ ., data = train_data,  
                    method = "rf", ntree = 200, 
                    trControl = trainControl(method = "oob"))

# get the predictions to play with classification threshold
results = data.frame(actual = test_data$Vendor, predict(tos_rf, test_data, type = "prob"))

confusionMatrix(predict(tos_rf, test_data), test_data$Vendor)

saveRDS(tos_rf, file="models/terms-of-service/tos_rf.RDS")