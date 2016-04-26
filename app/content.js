/**
 * Copyright (c) 2014-2016, Coffeine, Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/08/2016 11:32 PM
 */


/**
 * Base class for actions.
 */
class Action {

    /**
     * Create a new action.
     *
     * @param el    DOM element.
     * @param val   Value.
     */
    constructor(el, val, delay, next) {
        this.el = el;
        this.val = val;
        this.delay = delay;
        this.nextSubPage = next;

        this._next = null;
    }

    get value() {
        return this.val;
    }

    get next() {
        return this._next;
    }

    set next(next) {
        this._next = next;
    }

    /**
     * Do the next action in chain if it exists.
     */
    doIt() {
        if (this.next) {
            this.next.doIt();
        }

        if (this.nextSubPage) {
            chrome.runtime.sendMessage({
                type:   'page.next',
                //- Get uri -//
                uri:    location.href.toString().split(window.location.host)[1]
            });
        }
    };
}

/**
 * Click action on element by XPath.
 *
 * @version 1.0
 */
class ClickAction extends Action {

    /**
     * Do it for click action.
     */
    doIt() {
        setTimeout(() => {
            var el = getElementByXpath( this.el );
            if (el)
                el.click();

            super.doIt();

            if (!this.nextSubPage) {
                chrome.runtime.sendMessage({
                    type:   'page.reset',
                    //- Get uri -//
                    uri:    location.href.toString().split(window.location.host)[1]
                });
            }
        }, this.delay);
    }
}

/**
 * Check action.
 * Check if element exists.
 *
 * @version 1.0
 */
class CheckAction extends Action {

    /**
     * Do check.
     */
    doIt() {
        setTimeout(() => {
            if ( !getElementByXpath( this.el ) ) {
                chrome.runtime.sendMessage( {
                    type: 'congratulations'
                } );
            }

            super.doIt();
        }, this.delay);
    }
}

/**
 * Captcha action.
 * Recognize captcha and answer.
 *
 * @version 1.0
 */
class CaptchaAction extends Action {

    /**
     * Create a new captcha action.
     *
     * @param el        Element(img) with captcha image.
     * @param resultEl  Element for answer.
     */
    constructor(el, resultEl) {
        super(el);

        this.resultEl = resultEl;
    }

    /**
     * Do recognision.
     */
    doIt() {
        var el = getElementByXpath( this.el );
        if (el)
            toDataUrl(el.src, ( data) => { this.recognize(data); });
        else
            super.doIt();
    }

    recognize(data) {
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            var res = xhr.response.split('|');
            if (res[0] == 'OK') {
                setTimeout(() => {
                    this.parse(res[1]);
                }, 15000);
            }
            console.log(xhr.response);
        };
        xhr.open('POST', 'https://rucaptcha.com/in.php');
        xhr.send('method=base64&key=e9f4eff94ef0123abc325e8ead5545a1&body=' + encodeURIComponent(data));
    }

    parse(id) {
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.response == 'CAPCHA_NOT_READY') {
                return this.parse(id);
            }
            var res = xhr.response.split('|');
            if (res[0] == 'OK') {
                getElementByXpath( this.resultEl ).value = res[1];
                super.doIt();
                // getElementByXpath( '//*[@id="ctl00_cp1_btnNext_input"]' ).click();
            }
        };
        xhr.open('GET', 'https://rucaptcha.com/res.php?key=e9f4eff94ef0123abc325e8ead5545a1&action=get&id=' + id);
        xhr.send();
    }
}


//- SECTION :: HELPER -//
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function toDataUrl(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader  = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}


/**
 * Entry point.
 * Every time when page is loaded call background script for next action.
 */
chrome.runtime.sendMessage({
    type:   'actions.next',
    //- Get uri -//
    uri:    location.href.toString().split(window.location.host)[1]
});

/**
 * Listen to background script for getting list of actions.
 */
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    switch ( msg.type ) {
        case 'page':
            var actions = new Action();
            var currentAction = actions;
            msg.page.actions.forEach( (action) => {

                switch (action.name) {
                    case 'click':
                        currentAction.next = new ClickAction( action.el, null, action.delay || 0, action.next );
                        break;
                    case 'captcha':
                        currentAction.next = new CaptchaAction( action.el, action.elResult );
                        break;
                    case 'check':
                        currentAction.next = new CheckAction( action.el, null, action.delay );
                        break;
                }

                currentAction = currentAction.next;
            });

            actions.doIt();
            break;

        case 'el.get':
            var children = [];
            var els = getElementByXpath( msg.el ).children;
            for(let i = 0; i < els.length; i++) {
                children.push(els[i].innerHTML);
            }
            chrome.runtime.sendMessage({
                type:   'el.set',
                destEl: msg.destEl,
                html:   children
            });
            break;

        case 'citizenship.select':
            getElementByXpath( '//*[@id="ctl00_cp1_ddCitizenship_Arrow"]' ).click();
            getElementByXpath( msg.el ).click();
            break;

        case 'embassy.select':
            getElementByXpath( '//*[@id="ctl00_cp1_ddEmbassy_Arrow"]' ).click();
            getElementByXpath( msg.el ).click();
            break;

        case 'visatype.select':
            getElementByXpath( '//*[@id="ctl00_cp1_ddVisaType_Arrow"]' ).click();
            getElementByXpath( msg.el ).click();
            break;
    }
});

