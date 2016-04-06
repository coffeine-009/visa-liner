/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 11:32 PM
 */




//- Configuration -//
var config = null;

/**
 * Entry point.
 */
window.onload = function() {

    chrome.storage.sync.get('config', (items) => {
        //- Get configuration -//
        config = JSON.parse(items.config);

        chrome.storage.onChanged.addListener((changes, area) => {
            config = JSON.parse(changes.config.newValue);
            console.info('Config reloaded.');
        });


        //- Get uri -//
        var uri = location.href.toString().split(window.location.host)[1];
        var actions = new LinkedList();

        switch (uri) {
            case '/disclaimer':
                actions.add( new ClickAction(
                    document.getElementById( 'ctl00_cp1_btnAccept_input' )
                ));
                break;

            case '/action':
                actions.add( new ClickAction(
                    document.getElementById( 'ctl00_cp1_btnNewAppointment_input' )
                ));
                break;

            case '/form':
                var country = document.getElementById( 'ctl00_cp1_ddCitizenship_Arrow' );
                if (country) {
                    actions.add( new ClickAction(
                        country
                    ) );
                    actions.add( new ClickAction(
                        getElementByXpath( '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[22]' )
                    ) );
                    actions.add( new ClickAction(
                        document.getElementById( 'ctl00_cp1_ddVisaType_Arrow' )
                    ) );
                    actions.add( new ClickAction(
                        getElementByXpath( '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul/li[4]' )
                    ) );
                    actions.add( new CaptchaAction(
                        document.getElementById( 'c_pages_form_cp1_captcha1_CaptchaImage' )
                    ) );
                }
                break;
        }

        var len = actions.size();
        for (let i = 0; i < len; i++) {
            actions.item( i ).doIt();
        }

        var registrationDate = document.getElementById('cp1_rblDate');
        if (registrationDate) {
            chrome.extension.sendRequest({
                title: "Congratulations!",
                msg: 'Registration is available.'
            });
        } else {
            setTimeout(() => {
                document.getElementById( 'ctl00_cp1_btnPrev_input' ).click();
            }, config.interval )
        }

        var page = new Page(uri, actions);
    });
};

/**
 * Translation messages for storing configuration.
 */
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    // First, validate the message's structure
    if (msg.from === 'popup') {
        // Enable the page-action for the requesting tab
        chrome.runtime.sendMessage({
            from:   'content',
            msg:    msg.msg
        });
    }

    if (msg.from === 'popup-init') {
        response(config);
    }
});


//----------------------------------------------------------------------------//
/*
 * Linked List implementation in JavaScript
 * Copyright (c) 2009 Nicholas C. Zakas
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
