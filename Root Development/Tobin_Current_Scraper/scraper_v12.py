import sys
import requests
import bs4
from bs4 import BeautifulSoup
from urllib.parse import urlparse
# from urllib.request import urlopen
# from urllib.request import Request
# from lxml import etree

class Scrape:
    def __init__(self, argv):
        super().__init__()

        self.headers = {
            'User-Agent': "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)"
        }

        self.argv = argv

        self.Vendor = ''

        self.Filename = ''

    def take_in(self):
        input_url = self.argv

        print(f'Input url is: {input_url}')

        print('Parsing...')

        self.hostname(input_url)

        self.generate_filename()

        self.parse(input_url)

    def get_source(self, input_url: str):
        return requests.get(input_url, headers=self.headers, stream=True)
        # return Request(input_url, headers=self.headers)

    def hostname(self, input_url):
        o = urlparse(input_url)

        hn = o.hostname

        divided_url = hn.split('.')

        self.Vendor = divided_url[1]

    def generate_filename(self):

        self.Filename = self.Vendor + '.txt'

        print('Output file is: ', self.Filename)

    def parse(self, input_url: str):
        response = self.get_source(input_url)

        response.raw.decode_content = True

        # request = self.get_source(input_url)

        # request.raw.decode_content = True

        # response = urlopen(request)

        # html_parser = etree.HTMLParser()

        # htmlTree = etree.parse(response, html_parser)

        # fout = open(self.Filename, 'w')

        # fout.write(str(htmlTree.xpath("//div[@class='content']")))

        htmlData = BeautifulSoup(response.text, features='lxml')

        self.prettify(htmlData)

    def prettify(self, htmlData):
        soup = htmlData

        fout = open(self.Filename, 'w')

        # TAG_LIST = ['p', 'ul', 'ol', 'h1', 'h2', 'h3', 'div']
        TAG_LIST = ['p', 'li', 'ul']    # ['strong', 'em', 'br', 'b']

        for tag in soup.findAll(True):
            tag.attrs = {}  # Remove attributes to keep things clean

        for tag in soup.findAll(["script"]):  # Remove <script> elements
            tag.decompose()

        for tag in soup.findAll(True):
            if isinstance(tag, bs4.Tag) and tag.name in TAG_LIST:
                x = str(tag)
                x = x.encode('ascii', 'replace')
                fout.write(str(x) + '\n')

        '''
        for string in soup.strings:
            # if type(string) in [bs4.element.Comment, bs4.element.Doctype]:
            #    continue
            x = string.encode('ascii', 'replace')
            fout.write(str(x))
        '''


if __name__ == '__main__':
    Object = Scrape(sys.argv[1])

    Object.take_in()

    # Generates a new file if the name does not already exist.
