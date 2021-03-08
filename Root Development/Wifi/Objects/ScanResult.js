var oui = require('oui');

export default class myClass {
    userID: string;
    ip: string;
    mac: string;
    vendor: string;
    lastScanned: string;
    constructor(id,ip, mac) {
        this.userID = id;
        this.ip = ip;
        this.mac = mac;
        this.getVendor();
        this.getScannedTime();
    }

    getScannedTime(){
        var today  = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        this.lastScanned = date + '-' + time;
    }

    getVendor(){
        var vendor = oui(this.mac);
        if(vendor == null){
            this.vendor = "Unknown_Vendor";
        }
        else{
            this.vendor = vendor;
        }
    }



}