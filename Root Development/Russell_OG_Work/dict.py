from lemmatize import clean_list

def dict_create(text):
    unique_words_dict = {}
    for word in text:
        if word in unique_words_dict:
            unique_words_dict[word] += 1
        else:
            unique_words_dict[word] = 1
    return sorted(unique_words_dict.items())

final_dict= dict_create(clean_list)

print(dict(final_dict))
