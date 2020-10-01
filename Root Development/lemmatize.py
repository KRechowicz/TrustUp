from nltk.corpus import wordnet
from nltk import pos_tag, word_tokenize
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import stopwords
import string
import pandas as pd

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

print(clean_list)
print(len(clean_list))
