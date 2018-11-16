const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const By = webdriver.By;
const Until = webdriver.until;

var options = new chrome.Options();
options.addArguments("--user-data-dir=./profile");

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();

getCutoffElements().then(eles=>{
    saveToJson(eles,function(){
        console.log("saved to cutoffs.json");
        driver.quit();
    });
});

function getCutoffElements(){
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
            var cutOffMap = {
                "30k" : cutOffData[0],
                "50k" : cutOffData[1],
                "70k" : cutOffData[2],
                "120k" : cutOffData[3]
            };
            obj.push(cutOffMap);
            var json = JSON.stringify(obj);
            fs.writeFile('cutoffs.json',json,callback);
        }
    });
}
