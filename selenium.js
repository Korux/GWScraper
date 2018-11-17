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
const date = new Date();
options.addArguments("--user-data-dir=./profile");

var currDriver = false;

setInterval(getInfo,1000);

function getCutoffElements(driver){
    return new Promise(function(resolve){
        driver.get("http://game.granbluefantasy.jp/#event/teamraid041/ranking").then(()=>{
            driver.wait(Until.elementsLocated(By.className('txt-total-record')),10000,"no ele").then(function(){
                driver.findElements(By.className('txt-total-record')).then(elements=>{
                    var first = elements[9].getText();
                    var second = elements[11].getText();
                    var third =  elements[13].getText();
                    var fourth = elements[15].getText();
                    Promise.all([first,second,third,fourth]).then(vals=>{resolve(vals)});
                });
            });
        }); 
    });
}

function saveToJson(cutOffData,callback = function(){}){
    fs.readFile("./cutoffs.json",'utf8',function(err,data){
        if(err){
            throw err;
        }else{
            var obj = JSON.parse(data);
            var dateStr = ""+monthInfo[date.getMonth()]+" " + date.getDate()+ ", "+date.getHours()+":"+date.getMinutes();
            var cutOffMap = {
                "30k" : cutOffData[0],
                "50k" : cutOffData[1],
                "70k" : cutOffData[2],
                "120k" : cutOffData[3]
            };
            var cutOffInfo = {};
            cutOffInfo[dateStr] = cutOffMap;
            obj.push(cutOffInfo);
            var json = JSON.stringify(obj,null,4);
            fs.writeFile('cutoffs.json',json,callback);
        }
    });
}

function getInfo(){
    if(date.getMinutes()%10 == 0 && !currDriver){
        currDriver = true;
        let driver = new webdriver.Builder()
        .forBrowser('chrome')
        .withCapabilities(webdriver.Capabilities.chrome())
        .setChromeOptions(options)
        .build();

        getCutoffElements(driver).then(eles=>{
            saveToJson(eles,function(){
                console.log("saved to cutoffs.json");
                console.log("saved at: ",""+monthInfo[date.getMonth()]+" " + date.getDate()+ ", "+date.getHours()+":"+date.getMinutes());
                driver.quit();
            });
        });
    }
}