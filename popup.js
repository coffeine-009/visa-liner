/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 3:45 PM
 */

//- Get configuration -//
var config = {
    pages: {}
};

function renderPage( el ) {
    var content = '';
    for (let uri in config.pages) {
        content += '<option>' + uri + '</option>';
    }

    el.innerHTML = content;
}

function renderActions( el, uri ) {
    var actionsContent = '<tr><th>Type</th><th>el</th><th>Step</th><th>Result el</th><th>Delay</th></tr>';
    config.pages[ uri ].actions.forEach( (action) => {
        actionsContent += '<tr>'
            + '<td>' + action.name + '</td>'
            + '<td>' + action.el + '</td>'
            + '<td><input type="number" style="width: 25px;" value="' + action.step + '"/></td>'
            + '<td>' + action.elResult + '</td>'
            + '<td>' + action.delay + '</td>'
            + '</tr>';
    });
    el.innerHTML = actionsContent;
}

window.addEventListener('DOMContentLoaded', function () {

    chrome.storage.sync.get('config', (items) => {
        try {
            config = JSON.parse( items.config );
        } catch (e) {
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
                            {
                                name: 'click',
                                el: '//*[@id="ctl00_cp1_btnNext_input"]',
                                delay : 40000,
                                step: 4
                            }
                        ]
                    },
                    "/finish-check": {//FIXME: set correct uri
                        currentStep: 0,
                        actions: [
                            {
                                name: 'check',
                                el: '//*[@id="cp1_rblDate"]',
                                step: 1
                            }
                        ]
                    },
                    "/finish": {
                        currentStep: 0,
                        actions: [
                            {
                                name: 'future-click',
                                el: '//*[@id="ctl00_cp1_btnPrev_input"]',
                                step: 1,
                                timeout: 3600
                            }
                        ]
                    }
                }
            };
            console.warn( 'Cannot load config.' );
        }

        var interval = document.getElementById( 'interval' );
        var page = document.getElementById( 'page' );
        var pageNewUri = document.getElementById( 'page-new' );
        var action = document.getElementById( 'action-el' );
        var actionType = document.getElementById( 'action-type' );
        var actions = document.getElementById( 'actions' );

        renderPage( page );
        renderActions( actions, page.value );

        pageNewUri.addEventListener('change', () => {
            var uri = pageNewUri.value;

            config.pages[ uri ] = {
                uri: uri,
                //- Actions per page -//
                actions: []
            };

            renderPage( page );
        });

        page.addEventListener('change', () => {
            renderActions( actions, page.value );
        });

        action.addEventListener( 'change', function() {
            config.pages[ page.value ].actions.push({
                name: actionType.value,
                el: action.value,
                step: 1
            });
        });



        document.getElementById( 'save' ).onclick = function() {
            config.interval = interval.value * 1000;

            // Enable the page-action for the requesting tab
            chrome.storage.sync.set({'config': JSON.stringify(config)}, function () {
                // Notify that we saved.
                console.info('Settings saved');
            });
        };
    });
});
