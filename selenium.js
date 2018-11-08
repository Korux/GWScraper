const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const By = webdriver.By;

var options = new chrome.Options();
options.addArguments("--user-data-dir=./profile");

let driver = new webdriver.Builder()
    .forBrowser('chrome')
    .withCapabilities(webdriver.Capabilities.chrome())
    .setChromeOptions(options)
    .build();

driver.get("http://game.granbluefantasy.jp/#mypage");

driver.get("http://game.granbluefantasy.jp/#event/treasureraid074").then(()=>{
    driver.findElements(By.className("jssdk")).then((result)=>{
        console.log(result);
    });
});;





