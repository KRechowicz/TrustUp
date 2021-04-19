from scapy.all import ARP, sniff

def dict_create(text):
    #creates unique dictionary for ip addresses
    unique_ip_dict = {}
    for word in text:
        if word in unique_ip_dict:
            unique_ip_dict[word] += 1
        else:
            unique_ip_dict[word] = 1
    return sorted(unique_ip_dict.items())

ip_list = []

def arp_display(pkt):
    if pkt[ARP].op == 1:  # who-has (request)
        ip_list.append(pkt[ARP].pdst)  # return f"Request: {pkt[ARP].psrc} is asking about {pkt[ARP].pdst}")
    if pkt[ARP].op == 2:  # is-at (response)
        ip_list.append(pkt[ARP].psrc)  # return f"*Response: {pkt[ARP].hwsrc} has address {pkt[ARP].psrc}")


sniff(prn=arp_display, filter="arp", store=0, count= 10)  # Displays ARP traffic

unique_dict = dict_create(ip_list)

print(unique_dict)

