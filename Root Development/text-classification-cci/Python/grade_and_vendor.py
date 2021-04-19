import requests
import json

#change this file path to desired PP or ToS
my_tos_filename = "/Users/russellmoore/Desktop/text-classification-cci/input/terms-of-service/fitbit-tos.txt" #/Users/rgore/src/text-classification-cci/input/terms-of-service/fitbit-tos.txt"

ploads = {'txtFilename':my_tos_filename}
print(ploads)

r_grade = requests.get('http://127.0.0.1:4000/getGradeForTxtFile',params=ploads)
r_vendor = requests.get('http://127.0.0.1:4000/getMostSimilarVendorForTxtFile',params=ploads)

filename_grade = json.loads(r_grade.text)[0]
filename_vendor = json.loads(r_vendor.text)[0]
print("Grade for file is: "+filename_grade)
print("Most similar vendor for file is: "+filename_vendor)
