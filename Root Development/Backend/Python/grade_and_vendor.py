import requests
import json
from scraper import Scrape
import pathlib
print(pathlib.Path(__file__).parent.absolute())


#Object = Scrape('https://www.amazon.com/gp/help/customer/display.html?nodeId=202140280')

#Object.take_in()


#change this file path to desired PP or ToS
my_tos_filename = str(pathlib.Path(__file__).parent.absolute()) + "/ScraperOutput/terms-of-service/fitbit-tos.txt"

ploads = {'txtFilename':my_tos_filename}
print(ploads)

r_grade = requests.get('http://127.0.0.1:4000/getGradeForTxtFile',params=ploads)
r_vendor = requests.get('http://127.0.0.1:4000/getMostSimilarVendorForTxtFile',params=ploads)

filename_grade = json.loads(r_grade.text)
filename_vendor = json.loads(r_vendor.text)
print("Grade for file is: ",filename_grade)
print("Most similar vendor for file is: ",filename_vendor)
