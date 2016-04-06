/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 8:25 PM
 */

/**
 * Helper for get element by XPath.
 *
 * @param path
 * @returns {Node}
 */
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}


//- Get input(img and instructions) -//
setTimeout( ()=> {
    //- Img -//
    var img = getElementByXpath( '//*[@id="rc-imageselect-target"]/table/tbody/tr[1]/td[1]/div/div[1]/img' );
    //- Instructions -//
    var instructions = getElementByXpath( '//*[@id="rc-imageselect"]/div[2]/div[1]/div[1]/div[1]' );

    // Enable the page-action for the requesting tab
    chrome.runtime.sendMessage({
        type:   'recaptcha-recognize',
        instructions: instructions.innerHTML,
        imageSrc: img.src
    });
}, 1000 );

/**
 * Listen messages for answering.
 */
chrome.runtime.onMessage.addListener( (msg, sender, response) => {

    var width = getElementByXpath( '//*[@id="rc-imageselect-target"]/table/tbody/tr[1]' ).childElementCount;

    // Check type of message
    if ( msg.type === 'recaptcha-finish' ) {
        msg.images.forEach( (index) => {

            //- Get coords -//
            var x = Math.floor(index / width) + 1;
            var y = (index % width) + 1;

            getElementByXpath(
                '//*[@id="rc-imageselect-target"]/table/tbody/tr[' + x + ']/td[' + y + ']/div'
            ).click();
        });

        setTimeout(() => {
            getElementByXpath( '//*[@id="recaptcha-verify-button"]' ).click();
        }, 500);
    }
});
