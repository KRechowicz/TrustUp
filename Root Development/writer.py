import csv

with open('/Users/russellmoore/Desktop/Cova/Txt Files/form.csv', 'rt') as f:
    lines = f.readlines()
    mystr = '\t'.join([line.strip() for line in lines]) #moves all text onto one line
    print(mystr)

with open('/Users/russellmoore/Desktop/Cova/Txt Files/txt.csv', 'at') as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(mystr)

#takes input file and writes text without commas to a new file (must be done in order to tokenize)
with open("/Users/russellmoore/Desktop/Cova/Txt Files/txt.csv") as infile, open("/Users/russellmoore/Desktop/Cova/Txt Files/ready.csv", "w") as outfile:
    for line in infile:
        outfile.write(line.replace(",", ""))






# for f in clean_list:
#     reader = csv.reader(f)
#     i = next(reader)
#     rest = [row for row in reader]
    #print(rest)
