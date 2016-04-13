/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 11:32 PM
 */


//- Configuration -//
var config = null,
    currentUri = null;

/**
 * Entry point.
 */
chrome.storage.sync.get('config', (items) => {
    //- Get configuration -//
    try {
        config = JSON.parse( items.config );
    } catch( e ) {
        config = {
            interval: 3600,

            pages: {
                "/disclaimer": {
                    uri: '/disclaimer',
                    currentStep: 0,
                    //- Actions per page -//
                    actions: [
                        {
                            name: 'click',
                            el: "//*[@id=\"ctl00_cp1_btnAccept_input\"]",
                            step: 1
                        }
                    ]
                },
                "/action": {
                    uri: '/action',
                    currentStep: 0,
                    //- Actions per page -//
                    actions: [
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_btnNewAppointment_input"]',
                            step: 1
                        }
                    ]
                },
                "/form": {
                    uri: '/disclaimer',
                    currentStep: 0,
                    //- Actions per page -//
                    actions: [
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_ddCitizenship_Arrow"]',
                            step: 1
                        },
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[22]',
                            step: 1
                        },
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_ddVisaType_Arrow"]',
                            step: 2
                        },
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul/li[4]',
                            step: 2
                        },
                        {
                            name: 'captcha',
                            el: '//*[@id="c_pages_form_cp1_captcha1_CaptchaImage"]',
                            elResult: '//*[@id="cp1_pnlCaptchaBotDetect"]/span/input[1]',
                            step: 3
                        },
                        // {
                        //     name: 'click',
                        //     el: '//*[@id="ctl00_cp1_btnNext_input"]',
                        //     delay : 25000,
                        //     step: 3
                        // }
                        {
                            name: 'check',
                            el: '//*[@id="cp1_lblNoDates"]',
                            step: 4
                        },
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_btnPrev_input"]',
                            step: 4,
                            delay: 60000
                        }
                    ]
                }
            }
        };
        console.info( 'Cannot read config.' );
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        config = JSON.parse(changes.config.newValue);
        console.info('Config reloaded.');
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {

    switch (msg.type) {
        //- Send next action to content script -//
        case 'actions.next':
            // ...query for the active tab...
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function ( tabs ) {
                // ...and send a request for the DOM info...
                var page = config.pages[ msg.uri ];
                    page.currentStep++;

                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        type: 'page',
                        page: page
                    }
                );

                if (currentUri != null && currentUri != msg.uri) {
                    config.pages[ currentUri ].currentStep = 0;
                }
                currentUri = msg.uri;
            });
            break;

        //- Successful attempt -//
        case 'congratulations':
            // Create a simple text notification:
            var notify = chrome.notifications.create({
                type: 'basic',
                title: 'Congratulations',
                message: 'Registration is available.',
                iconUrl: 'icon.png'
            });

            var yourSound = new Audio('notification.mp3');
            yourSound.play();
            break;
    }
    // First, validate the message's structure
    if ((msg.from === 'content')) {

    }
});
