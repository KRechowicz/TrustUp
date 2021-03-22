import requests
import json
from scraper import Scrape
import pathlib
import sys
import os
from os import path

RootPath = str(pathlib.Path(__file__).parent.absolute())

Object = Scrape(sys.argv[1])

Object.hostname(sys.argv[1])
Object.generate_filename()

if(not path.isfile(RootPath+ "/ScraperOutput/" +Object.Filename)):
    Object.take_in()



#change this file path to desired PP or ToS
my_tos_filename = RootPath+ "/ScraperOutput/" +Object.Filename

temp = "/Users/bgeldhau/GitHub/CoVA_CCI/Root Development/Backend/Python/ScraperOutput/terms-of-service/cellartracker-tos.txt"

ploads = {'txtFilename':my_tos_filename}
#print(ploads)

r_grade = requests.get('http://127.0.0.1:4000/getGradeForTxtFile',params=ploads)
r_vendor = requests.get('http://127.0.0.1:4000/getMostSimilarVendorForTxtFile',params=ploads)

filename_grade = json.loads(r_grade.text)
filename_vendor = json.loads(r_vendor.text)

infoToSend = {
  "grade": filename_grade[0],
  "similiarTo": filename_vendor[0]
}

# convert into JSON:
jsonToSend = json.dumps(infoToSend)

# the result is a JSON string:
print(jsonToSend)
#print("Grade for file is: ",filename_grade)
#print("Most similar vendor for file is: ",filename_vendor)
