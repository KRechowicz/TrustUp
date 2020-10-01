def find_keyword(word, file):
    for i, line in enumerate(file, 1):
        if word in line:
            print(line)
            print("line number:", i,"\n")

def display_topics(file):
    for line in file:
        if line.startswith("*"):
            print(line)

def display_examples(file):
    for line in file:
        if line.startswith("#"):
            print(line)
        elif line.startswith("-"):
            print(line)


want = input("What do you want to search the document for?\n"
              "Enter 'k' to search for a keyword\n"
              "Enter 't' to display all topics\n"
              "Enter 'e' to display examples of information collected\n")
#file = input("Enter file path: ")
file = "/Users/russellmoore/Desktop/Cova/Txt Files/Amazon/privacy_notice.txt"

new_file = []
with open(file) as openfile:
    for line in openfile:
        new_file.append(line.lower())

if want == "k":

    word = input("Enter keyword would you like to search for: \n")
    print("\n",find_keyword(word, new_file))

if want == "t":
    print(display_topics(new_file))

if want == "e":
    print(display_examples(new_file))
