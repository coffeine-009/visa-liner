/**
 * Copyright (c) 2014-2016, Coffeine, Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/08/2016 11:32 PM
 */


//- Configuration -//
var config = null;
var isConfigured = false;

/**
 * Entry point.
 */
chrome.storage.sync.get('config', (items) => {
    //- Get configuration -//
    try {
        config = JSON.parse( items.config );
    } catch( e ) {
        config = {
            interval: 3600000,

            pages: {
                "/disclaimer": {
                    currentStep: 0,
                    pages: [
                        {
                            uri: '/disclaimer',
                            //- Actions per page -//
                            actions: [
                                {
                                    name: 'click',
                                    el: "//*[@id=\"ctl00_cp1_btnAccept_input\"]",
                                    step: 1
                                }
                            ]
                        }
                    ]
                },
                "/action": {
                    currentStep: 0,
                    pages: [
                        {
                            uri: '/action',
                            //- Actions per page -//
                            actions: [
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_btnNewAppointment_input"]',
                                    step: 1
                                }
                            ]
                        }
                    ]
                },
                "/form": {
                    currentStep: 0,
                    pages: [
                        {
                            uri: '/disclaimer',
                            //- Actions per page -//
                            actions: [
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddCitizenship_Arrow"]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[22]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddEmbassy_Arrow"]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddEmbassy_DropDown"]/div/ul/li[2]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddVisaType_Arrow"]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul/li[4]'
                                },
                                {
                                    name: 'captcha',
                                    el: '//*[@id="c_pages_form_cp1_captcha1_CaptchaImage"]',
                                    elResult: '//*[@id="cp1_pnlCaptchaBotDetect"]/span/input[1]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_btnNext_input"]'
                                },
                                {
                                    name: 'check',
                                    el: '//*[@id="cp1_lblNoDates"]',
                                    delay: 5000
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_btnPrev_input"]',
                                    delay: 3600000,
                                    next: 1
                                }
                            ]
                        },
                        {
                            uri: '/disclaimer',
                            //- Actions per page -//
                            actions: [
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddCitizenship_Arrow"]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[22]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddEmbassy_Arrow"]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddEmbassy_DropDown"]/div/ul/li[1]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddVisaType_Arrow"]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul/li[4]'
                                },
                                {
                                    name: 'captcha',
                                    el: '//*[@id="c_pages_form_cp1_captcha1_CaptchaImage"]',
                                    elResult: '//*[@id="cp1_pnlCaptchaBotDetect"]/span/input[1]'
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_btnNext_input"]'
                                },
                                {
                                    name: 'check',
                                    el: '//*[@id="cp1_lblNoDates"]',
                                    delay: 5000
                                },
                                {
                                    name: 'click',
                                    el: '//*[@id="ctl00_cp1_btnPrev_input"]',
                                    delay: 3600000
                                }
                            ]
                        }
                    ]
                }
            }
        };
        //name: ctl00_cp1_txtFirstName, lastName: ctl00_cp1_txtFamilyName, birthday: ctl00_cp1_txtBirthDate_dateInput,
        // country: ctl00_cp1_ddBirthCountry_Arrow,->, //*[@id="ctl00_cp1_ddBirthCountry_DropDown"]/div/ul/li[22]
        // gender: select:ctl00_cp1_ddSex_Arrow
        // nextBtn: ctl00_cp1_btnNext_input

        // pasport.text: ctl00_cp1_txtPassportNumber
        // email.text: ctl00_cp1_txtEmail
        // phone: ctl00_cp1_txtPhone[+(_38) 0971231232]
        //nextBtn: ctl00_cp1_btnNext_input
        console.info( 'Cannot read config.' );

        chrome.storage.sync.set({'config': JSON.stringify(config)}, () => {
            // Notify that we saved.
            console.info('Settings saved');
        });
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        config = JSON.parse(changes.config.newValue);
        console.info('Config reloaded.', config);
    });
});

chrome.runtime.onMessage.addListener(function (msg, sender, response) {

    if (!isConfigured)
        return;

    switch ( msg.type ) {
        //- Send next action to content script -//
        case 'actions.next':
            // ...query for the active tab...
            chrome.tabs.query({
                url: '*://visapoint.eu/*',
                currentWindow: true
            }, function ( tabs ) {

                if (tabs.length == 0) {
                    return;
                }

                // ...and send a request for the DOM info...
                var page = config.pages[ msg.uri ];
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        type: 'page',
                        page: page.pages[ page.currentStep ]
                    }
                );
            });
            break;

        case 'page.next':
            config.pages[ msg.uri ].currentStep++;
            break;

        case 'page.reset':
            config.pages[ msg.uri ].currentStep = 0;
            break;

        //- Successful attempt -//
        case 'congratulations':
            // Create a simple text notification:
            chrome.notifications.create({
                type: 'basic',
                title: 'Congratulations',
                message: 'Registration is available.',
                iconUrl: 'icon.png'
            });

            var yourSound = new Audio('notification.mp3');
            yourSound.play();
            break;
    }
});

chrome.extension.onMessage.addListener((msg) => {
    switch (msg.type) {

        case 'configured':
            isConfigured = true;
            break
    }
});
