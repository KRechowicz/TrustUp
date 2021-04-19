import requests
import json
import time
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

grade_patterns = ['*.txt']
ignore_patterns = ""
ignore_directories = True
case_sensitive = False
grade_event_handler = PatternMatchingEventHandler(grade_patterns, ignore_patterns, ignore_directories, case_sensitive)


def on_created_grade(event):
    print(f"{event.src_path} has been created!")
    ploads = {'txtFilename': event.src_path}
    print(ploads)

    r_grade = requests.get('http://127.0.0.1:4000/getGradeForTxtFile', params=ploads)
    r_vendor = requests.get('http://127.0.0.1:4000/getMostSimilarVendorForTxtFile', params=ploads)

    filename_grade = json.loads(r_grade.text)[0]
    filename_vendor = json.loads(r_vendor.text)[0]
    print("Grade for file is: " + filename_grade)
    print("Most similar vendor for file is: " + filename_vendor)


def on_modified_grade(event):
    print(f"{event.src_path} has been modified.")


grade_event_handler.on_created = on_created_grade
grade_event_handler.on_modified = on_modified_grade

path = "."
go_recursively = False
grade_observer = Observer()
grade_observer.schedule(grade_event_handler, path, recursive=go_recursively)

grade_observer.start()
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    grade_observer.stop()
    grade_observer.join()

'''
# change this file path to desired PP or ToS
my_tos_filename = "/Users/russellmoore/Desktop/text-classification-cci/input/terms-of-service/fitbit-tos.txt"  # /Users/rgore/src/text-classification-cci/input/terms-of-service/fitbit-tos.txt"

ploads = {'txtFilename': my_tos_filename}
print(ploads)

r_grade = requests.get('http://127.0.0.1:4000/getGradeForTxtFile', params=ploads)
r_vendor = requests.get('http://127.0.0.1:4000/getMostSimilarVendorForTxtFile', params=ploads)

filename_grade = json.loads(r_grade.text)[0]
filename_vendor = json.loads(r_vendor.text)[0]
print("Grade for file is: " + filename_grade)
print("Most similar vendor for file is: " + filename_vendor)
'''
