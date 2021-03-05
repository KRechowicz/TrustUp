import requests
import watchdog
import idna
import certifi
import chardet
import urllib3
import json
import os
import time
from bs4 import BeautifulSoup
TEST_STATUS = os.getenv('TEST_STATUS')
print("TEST_STATUS is: "+TEST_STATUS)
if TEST_STATUS == "TRUE":
	time.sleep(15)
	my_tos_filename = "/home/app/input/terms-of-service/fitbit-tos.txt"
	ploads = {'txtFilename':my_tos_filename}
	r_grade = requests.get('http://file-classifier:4000/getGradeForTxtFile',params=ploads)
	r_vendor = requests.get('http://file-classifier:4000/getMostSimilarVendorForTxtFile',params=ploads)
	filename_grade = json.loads(r_grade.text)[0]
	filename_vendor = json.loads(r_vendor.text)[0]
	print("Grade for file is: "+filename_grade)
	print("Most similar vendor for file is: "+filename_vendor)
i = 5
while i > 0:
	y = 7
y = 10
