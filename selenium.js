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

const button = driver.wait(webdriver.until.elementLocated(By.id('mobage-login')), 20000).then(element => {
    return driver.wait(webdriver.until.elementIsVisible(element),20000);
});



