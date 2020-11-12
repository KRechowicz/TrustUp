import subprocess
import netifaces

def get_default_gateway():
    route_default_result = str(subprocess.check_output(["route", "get", "default"]))
    start = 'gateway: '
    end = '\\n'
    if 'gateway' in route_default_result:
        return (route_default_result.split(start))[1].split(end)[0]

gws = netifaces.gateways()
gateway = gws['default'][netifaces.AF_INET][0]

print("Gateway name:", get_default_gateway(), '\nGateway IP:', gateway)
