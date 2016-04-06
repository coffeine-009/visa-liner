/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 8:25 PM
 */

if (!window.isTop) { // true  or  undefined
    // do something...
    var data = 'test';
    // Send message to top frame, for example:
    chrome.runtime.sendMessage({sendBack:true, data:data});
    console.log('frame:captcha: ', location.href);
}
console.log('captcha: ', location.href);
getElementByXpath( '//*[@id="recaptcha-anchor"]/div[5]' ).click();


function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}