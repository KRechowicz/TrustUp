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
        if(ip){
            this.ip = ip;
            this.mac = mac;
            this.getVendor();
        }
        else{
            this.ip = "Manually Added";
            this.mac = "Manually Added"
        }
        this.getScannedTime();
    }

    getScannedTime(){
        var today  = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes();
        this.lastScanned = date + '/' + time;
    }

    getVendor(vendorRecieved){
        if(this.mac !== 'Manually Added'){
            var vendor = oui(this.mac);
        }
        else{
            var vendor = vendorRecieved;
        }

        if(vendor == null || !vendor){
            this.wifi_vendor = "Unknown Vendor";
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
        if(reviews){
            this.reviews = reviews;
        }
        else{
            this.reviews = [];
        }

    }

    addDocInfo(docType, url){
        this.docType = docType;
        this.docURL = url;
    }





}