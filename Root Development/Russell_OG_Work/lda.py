import warnings
warnings.simplefilter("ignore", DeprecationWarning)
# Load the LDA model from sk-learn
from sklearn.decomposition import LatentDirichletAllocation as LDA
from sklearn.feature_extraction.text import CountVectorizer


# Load lemmatization and data cleaning modules
from nltk.corpus import wordnet
from nltk import pos_tag, word_tokenize
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords
import string
import pandas as pd

"""
Data cleaning process:
- create tag map
- tokenize the string
- remove stopwords and punctuation from data
- create a list containing the clean data
"""

def get_pos(tag): # tag map

    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return ''

token = str(pd.read_csv('/Users/russellmoore/Desktop/Cova/Txt Files/ready.csv')) #tokenizes the string
text = pos_tag(word_tokenize(token))

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
punct = set(string.punctuation)
punct.add('“')
punct.add('”')
clean_list = []

for i in range(len(text)):
    tag = get_pos(text[i][1])
    if tag != '' and tag != 'r':   #no adverbs or empty tags
        if text[i][0][0] not in punct and text[i][0] not in stop_words and text[i][0] != 'amazon.com':                                                             # text[i][0][1] not in punct
            #removes stop words, "n't" and "'s" etc
            clean_list.append(lemmatizer.lemmatize(text[i][0], tag).lower())

# print(clean_list)
# print(len(clean_list))

"""
Latent Dirichlet Allocation Topic Modeling:
"""
# Helper function
def print_topics(model, count_vectorizer, n_top_words):
    words = count_vectorizer.get_feature_names()
    for topic_idx, topic in enumerate(model.components_):
        print("\nTopic #%d:" % topic_idx)
        print(" ".join([words[i]
                        for i in topic.argsort()[:-n_top_words - 1:-1]]))

# Tweak the two parameters below
number_topics = 5
number_words = 10
# Create and fit the LDA model

count_vectorizer = CountVectorizer(stop_words='english')
count_data = count_vectorizer.fit_transform(clean_list)

lda = LDA(n_components = number_topics, n_jobs = -1)
lda.fit(count_data)

# Print the topics found by the LDA model
print("Topics found via LDA:")
print_topics(lda, count_vectorizer, number_words)
