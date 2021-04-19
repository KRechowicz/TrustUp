import csv
import getopt
import os
import re
import sys
import pandas as pd
import dateparser
# import datefinder # Doesn't work
from urllib.parse import urlparse
from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options
from bs4 import BeautifulSoup


class Scrape:
    def __init__(self, argv):
        self.Blacklist = []

        self.ListOfText = []

        self.ListOfUrl = []

        self.ListOfVendors = []

        self.ListOfDocumentType = []

        # self.ListOfProducts = []

        # self.ListOfDates = []

        self.ListOfFilenames = []

        self.CurrentDate = ""  # Used to compare the date of the previously existing document with the scraped text of
        # possibly updated document.

        self.documentIterator = 0  # This serves as a index for each document that is looped through in parse().
        # The iterator is used to traverse through the ListOfFilenames indices. (And also used to traverse ListOfUrl,
        # ListOfVendors, etc.)
        # Used for writeto() and CheckDate(). Value is increased by one every time a document is done being parsed
        # through.

        self.textIterator = 0  # This serves as a index for each piece of text that is appended onto ListOfText.
        # The amount of indices in ListOfText will be different than the amount of indices in ListOfFilenames,
        # Since documents that don't need to be updated will not be an index in the ListOfText.
        # Used for writeto().

        self.argv = argv  # Command Line Arguments

    def takein(self):
        inputfile = ''

        try:
            opts, args = getopt.getopt(self.argv, "hi:o:", ["ifile=", "ofile="])

        except getopt.GetoptError:
            print('test.py -i <inputfile>')

            sys.exit(2)

        for opt, arg in opts:
            if opt == '-h':
                # print('test.py -i <inputfile> -o <outputfile>')
                print('test.py -i <inputfile>')

                sys.exit()

            elif opt in ("-i", "--ifile"):
                inputfile = arg

        print(f'Input file is: {inputfile}')

        print('Parsing...')

        self.parse(inputfile)

        # self.writeto(outputfile)
        # self.readin(inputfile)
        # self.writeto()

        # print(self.ListOfFilenames)

    '''
    # Deprecated
    def CheckDate(self):
        with open(self.ListOfFilenames[self.documentIterator], 'r') as csv_file:
            try:
                csv_reader = csv.reader(csv_file)

                rows = list(csv_reader)

                documentDate = re.match('.*/.*/.*', rows[1][0])

            except:  # If there is no date within the document, then return True.
                print("Date couldn't be found: ", self.ListOfFilenames[self.documentIterator])
                return True

            if documentDate != self.Date:  # If the current document's date is not equal to previous documents date...
                print("Updated File: ", self.ListOfFilenames[self.documentIterator])
                return True

            if documentDate == self.Date:
                return False
    '''

    def OutputFiles(self):
        output_files = ''

        for filename in self.ListOfFilenames:
            part = filename + ' '

            output_files = output_files + part

        print('Output file(s) are: ', output_files)

    def CheckDate(self):
        with open(self.ListOfFilenames[self.documentIterator], 'r') as csv_file:
            try:
                csv_reader = csv.reader(csv_file)

                rows = list(csv_reader)

                documentDate = dateparser.find_dates(rows[1][0])

                # If the current document's date is not equal to previous documents date...
                if documentDate != self.CurrentDate:
                    print("Updated File: ", self.ListOfFilenames[self.documentIterator])
                    return True

                elif documentDate == self.CurrentDate:
                    return False

            except:  # If there is no date within the document, then return False.
                print("Date couldn't be found: ", self.ListOfFilenames[self.documentIterator])
                return False

    # Writes each entry in the cleaned list of text to a csv file
    def writeto(self):
        # print(filename)
        with open(self.ListOfFilenames[self.documentIterator], 'w', newline='') as csv_file:
            csv_writer = csv.writer(csv_file)

            csv_writer.writerow([self.ListOfVendors[self.documentIterator]])
            # print(self.ListOfVendors[i])     Works just fine, but csv_writer works differently.

            csv_writer.writerow([self.ListOfText[self.textIterator]])

    def readin(self, filename):
        data = pd.read_csv(filename)  # Read the csv using pandas

        # data.loc[:, ['Vendor', 'URL']]) can't be used.
        # Two reasons: index labels are present (0,1,2,3...), and column name are present.

        # print(data.iloc[:, 0:2].values)     Use to_numpy instead.

        for nested in data.iloc[:, 0:1].to_numpy():  # data.iloc[:, 0:1].to_numpy() Returns a list of lists
            for vendor in nested:
                self.ListOfVendors.append(vendor)

        for nested in data.iloc[:, 1:2].to_numpy():
            for url in nested:
                self.ListOfUrl.append(url)

        for nested in data.iloc[:, 2:3].to_numpy():
            for DocumentType in nested:
                self.ListOfDocumentType.append(DocumentType)

        '''
        for nested in data.iloc[:, 3:4].to_numpy():
            for product in nested:
                self.ListOfProducts.append(product)
        
        for i in range(0, len(self.ListOfVendors) or len(self.ListOfDocumentType)):     # or len(self.ListOfProducts)
            filename = self.ListOfVendors[i] + self.ListOfDocumentType[i] + '.csv'  # + self.ListOfProducts[i]

            self.ListOfFilenames.append(filename)
        
        # For Date Formats
        for i in range(0, len(self.ListOfVendors) or len(self.ListOfDocumentType) or len(self.ListOfDates)):
            ...
        
        for nested in data.iloc[:, 3:4].to_numpy():
            for date in nested:
                self.ListOfDates.append(date)
        '''

        for i in range(0, len(self.ListOfVendors) or len(self.ListOfDocumentType)):
            filename = self.ListOfVendors[i] + self.ListOfDocumentType[i] + '.csv'

            self.ListOfFilenames.append(filename)

        return self.ListOfUrl  # I have a return here because this function is used in parse(), and because
        # readin() also needs to be called

    def parse(self, filename):

        opts = Options()

        # set_headless is deprecated
        opts.headless = True  # Headless Browser

        browser = Firefox(options=opts)

        for url in self.readin(filename):
            self.hostname(url)

            browser.get(url)

            soup = BeautifulSoup(browser.page_source, "html.parser")

            # Find all tags with nav in their id
            p = soup.find_all(re.compile(".*"), {
                re.compile('.*'): re.compile(".*" + re.escape("nav") + ".*", re.IGNORECASE)})

            for match in p:
                match.decompose()  # Removes all tags with nav in their id, along with their content

            text = soup.get_text(separator=' ', strip=True)  # separator = ' '  # To separate all concatenated words

            # self.Date = re.match(".*/.*/.*", text)
            text = self.reafter(text)

            try:
                self.CurrentDate = dateparser.parse(text)

            except:
                # print(f"No date found for for document: {self.ListOfFilenames[self.documentIterator]}")
                pass

            '''
            # If the file size is not equal to zero
            if os.stat(self.ListOfFilenames[self.documentIterator]).st_size != 0:
                self.Option1(text)

            elif os.stat(self.ListOfFilenames[self.documentIterator]).st_size == 0:
                self.Option2(text)
            '''
            if not os.path.exists(self.ListOfFilenames[self.documentIterator]):
                self.Option2(text)

            if os.path.exists(self.ListOfFilenames[self.documentIterator]):
                self.Option1(text)

            self.documentIterator = self.documentIterator + 1

        browser.quit()

        return self.ListOfText

    # For previously existing documents
    def Option1(self, text):
        if self.CheckDate():
            self.ListOfText.append(text)

            self.writeto()

            self.textIterator = self.textIterator + 1

    # For new documents
    def Option2(self, text):
        self.ListOfText.append(text)

        print("New File:", self.ListOfFilenames[self.documentIterator])

        self.writeto()

        self.textIterator = self.textIterator + 1

    def reafter(self, text):
        text = text.encode('ascii', 'ignore').decode('ascii', 'ignore')  # Remove Unicode

        # text = str.translate(text, {ord(i): None for i in r"'\'"})  # Remove backslash

        text = text.replace('[^a-zA-Z\s]', '')

        text = re.sub(r'\s\s+[\s+]', '', text)  # Remove \n|\t|\r|etc. and trim additional whitespace

        rep1 = re.compile(re.escape('footer') + '^.*', re.IGNORECASE)  # Remove headers and footers, if there are any

        rep2 = re.compile('^.*' + re.escape('header'), re.IGNORECASE)

        text = re.sub(rep1, '', text)

        text = re.sub(rep2, '', text)

        text = self.multiple_replace(self.Blacklist, text)

        return text

    # Generates two strings: "Vendor", "Domain"
    # These will be added to a blacklist (Which is a simple list that is reinitialized to empty every run)
    # and subbed out with multiple_replace
    def hostname(self, url):
        o = urlparse(url)

        hn = o.hostname

        divided_url = hn.split('.')

        Vendor = divided_url[1]

        Domain = '.' + divided_url[2]

        self.Blacklist.append(Vendor)

        self.Blacklist.append(Domain)

        # return self.Blacklist

    # Given a list, create a regex that contains the strings in that list. Sub them out.
    def multiple_replace(self, list, text):
        # Create a regular expression ignoring case from the dictionary keys
        regex = re.compile("(%s)" % "|".join(map(re.escape, list)), re.IGNORECASE)

        # Sub the regex out
        return regex.sub('', text)


if __name__ == '__main__':
    Object = Scrape(sys.argv[1:])

    Object.takein()

    # Generates a new file if the name does not already exist.
