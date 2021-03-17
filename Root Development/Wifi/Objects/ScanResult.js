var oui = require('oui');
import Review from './Reviews';

export default class myClass {
    ip: string;
    mac: string;
    tosdr_vendor: string;
    wifi_vendor: string;
    lastScanned: string;
    reviews: [];
    docURL: string;
    docType: string;
    grade: string;
    constructor(ip, mac) {
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
            this.wifi_vendor = "Unknown_Vendor";
        }
        else{
            this.wifi_vendor = vendor;
        }
    }

    addTOSDRVendor(vendor){
        this.tosdr_vendor = vendor;
    }

    addGradeReviews(grade, reviews){
        this.grade = grade;
        this.reviews = reviews;
    }





}