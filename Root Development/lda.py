import warnings
warnings.simplefilter("ignore", DeprecationWarning)
# Load the LDA model from sk-learn
from sklearn.decomposition import LatentDirichletAllocation as LDA
from sklearn.feature_extraction.text import CountVectorizer
from lemmatize import clean_list


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

"""
LDA:
Classifies text in a document to a particular topic. 
It builds a topic per document model and words per topic model, modeled as Dirichlet distributions.
"""
