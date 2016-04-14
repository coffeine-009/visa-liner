/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 11:32 PM
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
    constructor(el, val, delay) {
        this.el = el;
        this.val = val;
        this.delay = delay;

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

    doIt() {
        if (this.next) {
            this.next.doIt();
        }
    };
}

class ClickAction extends Action {

    doIt() {
        setTimeout(() => {
            var el = getElementByXpath( this.el );
            if (el)
                el.click();
            console.info('Click', el);

            super.doIt();
        }, this.delay);
    }
}

class CheckAction extends Action {

    doIt() {
        setTimeout(() => {
            if ( !getElementByXpath( this.el ) ) {
                chrome.runtime.sendMessage( {
                    type: 'congratulations'
                } );
            }
            console.info('Check', this.el);
            super.doIt();
        }, this.delay);
    }
}

class CaptchaAction extends Action {

    constructor(el, resultEl) {
        super(el);

        this.resultEl = resultEl;
    }

    doIt() {
        var el = getElementByXpath( this.el );
        if (el)
            toDataUrl(el.src, ( data) => { this.recognize(data); });
        else
            super.doIt();

        console.info('Captcha', this.el);
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


//- Entry point -//
chrome.runtime.sendMessage({
    type:   'actions.next',
    //- Get uri -//
    uri:    location.href.toString().split(window.location.host)[1]
});

/**
 * Translation messages for storing configuration.
 */
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    switch ( msg.type ) {
        case 'page':
            var actions = new Action();
            var currentAction = actions;
            msg.page.actions.forEach( (action) => {

                switch (action.name) {
                    case 'click':
                        currentAction.next = new ClickAction( action.el, null, action.delay || 0 );
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
    }

    // First, validate the message's structure
    if (msg.from === 'popup') {
        // Enable the page-action for the requesting tab
        chrome.runtime.sendMessage({
            from:   'content',
            msg:    msg.msg
        });
    }
});

