const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const By = webdriver.By;
const Until = webdriver.until;
const monthInfo = {
    0 : "Jan",
    1 : "Feb",
    2 : "Mar",
    3 : "Apr",
    4 : "May",
    5 : "Jun",
    6 : "Jul",
    7 : "Aug",
    8 : "Sep",
    9 : "Oct",
    10 : "Nov",
    11 : "Dec",

};

const options = new chrome.Options();
options.addArguments("--user-data-dir=./profile");
const newOpts = new chrome.Options();
newOpts.addArguments("--user-data-dir=/tmp");

var currDriver = false;

var cutoffDriver = new webdriver.Builder()
.forBrowser('chrome')
.withCapabilities(webdriver.Capabilities.chrome())
.setChromeOptions(options)
.build();

var cutoffDriver2 = new webdriver.Builder()
.forBrowser('chrome')
.withCapabilities(webdriver.Capabilities.chrome())
.setChromeOptions(newOpts)
.build();

//setInterval(getCutoffInfo,100);

function getCutoffElements(driver){
    return new Promise(function(resolve){
        driver.get("http://game.granbluefantasy.jp/#event/teamraid042/ranking").then(()=>{
            driver.wait(Until.elementsLocated(By.className('txt-total-record')),10000,"no ele").then(function(){
                driver.findElements(By.className('txt-total-record')).then(elements=>{
                    var first = elements[9].getText();
                    var second = elements[11].getText();
                    var third =  elements[13].getText();
                    var fourth = elements[15].getText();
                    Promise.all([first,second,third,fourth]).then(vals=>{resolve(vals)});
                });
            }).catch(()=>{console.log("waiting for login")});
        }); 
    });
}

function saveToJson(GWdata,date,file,callback = function(){}){
    fs.readFile(file,'utf8',function(err,data){
        if(err){
            throw err;
        }else{
            var obj = JSON.parse(data);
            var dateStr = ""+monthInfo[date.getMonth()]+" " + date.getDate()+ ", "+date.getHours()+":"+date.getMinutes();
            var map = {
                "30k" : GWdata[0],
                "50k" : GWdata[1],
                "70k" : GWdata[2],
                "120k" : GWdata[3]
            };
            var info = {};
            info[dateStr] = map;
            obj.push(info);
            var json = JSON.stringify(obj,null,4);
            fs.writeFile(file,json,callback);
        }
    });
}

function getCutoffInfo(){
    var date = new Date();
    if(date.getMinutes()%10 == 0 && !currDriver){
        currDriver = true;
        getCutoffElements(cutoffDriver).then(eles=>{
            saveToJson(eles,date,'./json/cutoffs.json',function(){
                console.log("saved to cutoffs.json");
                console.log("saved at: ",""+monthInfo[date.getMonth()]+" " + date.getDate()+ ", "+date.getHours()+":"+date.getMinutes());
            });
        });
    }
    if(date.getMinutes()%10 == 1 && currDriver){
        currDriver = false;
    }
}