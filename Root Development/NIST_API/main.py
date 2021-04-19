import requests

CVE_url = 'https://services.nvd.nist.gov/rest/json/cves/1.0'
CPE = 'https://services.nvd.nist.gov/rest/json/cpes/1.0'

CVE_list = []


class CVE:
    def __init__(self, id, description, sev_score, references):
        self.id = id
        self.description = description
        self.sev_score = sev_score
        self.references = references

    def print_results(self):
        print(f"The CVE {self.id} has a score of {self.sev_score}. Its description is {self.description} and has "
              f"multiple references listed below :")
        print(self.references)


'''
Searches NVD, you can use keywords or search for an exact CVE
Pass 0 for start_index
'''
def cve_search(keywords, start_index):
    temp_start_index = start_index
    index_size = 20
    response = requests.get(
        CVE_url + '?' + 'keyword=' + keywords + '&isExactMatch=false' + "&startIndex=" + str(temp_start_index))
    json_response = response.json()

    if json_response['totalResults'] == 0:
        return print("Nothing Found")

    for item in json_response['result']['CVE_Items']:
        patch_check(item['cve']['references']['reference_data'])

        # Try and except KeyError is here for older versions of the scoring system
        # We can add these ands store what system they were measured on but they are very old
        try:
            current_cve = CVE(item['cve']['CVE_data_meta']['ID'],
                              item['cve']['description']['description_data'][0]['value'],
                              item['impact']['baseMetricV3']['cvssV3']['baseScore'],
                              item['cve']['references']['reference_data'])
            current_cve.print_results()
            CVE_list.append(current_cve)

        except KeyError:
            pass

    # Request only returns 20 items, if there are more than 20 call function again but with different start index
    if temp_start_index > json_response['totalResults']:
        return

    if index_size < json_response['totalResults']:
        temp_start_index = temp_start_index + 20
        cve_search(keywords, temp_start_index)

    return


'''
This will be our check to see if a result has been patched
Not to sure if this is needed because there are no patch tags in recent CVE entries
'''
def patch_check(ref_list):
    # for item in ref_list:
    # print(item['tags'])
    pass


'''
For some reason my CVE_list keep returning with None Values
This is my attempt to clean those but unsuccessful
'''
def clean_list():
    res = []
    for val in CVE_list:
        if val != None:
            res.append(val)

    return res

def main():
    cve_search('ENTER PHRASE HERE', 0)


if __name__ == '__main__':
    main()
