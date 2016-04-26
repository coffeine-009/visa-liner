/**
 * Copyright (c) 2014-2016, Coffeine, Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/08/2016 3:45 PM
 */

//- Get configuration -//
var config = {
    pages: {}
};

window.addEventListener('DOMContentLoaded', function () {

    chrome.storage.sync.get('config', (items) => {
        try {
            config = JSON.parse( items.config );
        } catch (e) {
            console.error( 'Cannot load config.' );
        }

        var interval = document.getElementById( 'interval' );
        var citizenship = document.getElementById( 'citizenship' );
        var embassy = document.getElementById( 'embassy' );
        var visatype = document.getElementById( 'visatype' );

        citizenship.addEventListener('change', () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        type:   'citizenship.select',
                        el:     '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[' + citizenship.value + ']'
                    }
                );

                setTimeout(() => {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            {
                                type:   'el.get',
                                destEl: 'embassy',
                                el:     '//*[@id="ctl00_cp1_ddEmbassy_DropDown"]/div/ul'
                            }
                        );
                    });
                }, 3000);
            });
        });

        embassy.addEventListener('change', () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        type:   'embassy.select',
                        el:     '//*[@id="ctl00_cp1_ddEmbassy_DropDown"]/div/ul/li[' + embassy.value + ']'
                    }
                );

                setTimeout(() => {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            {
                                type:   'el.get',
                                destEl: 'visatype',
                                el:     '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul'
                            }
                        );
                    });
                }, 3000);
            });
        });

        visatype.addEventListener('change', () => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        type:   'visatype.select',
                        el:     '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul/li[' + visatype.value + ']'
                    }
                );
            });
        });

        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    type:   'el.get',
                    destEl: 'citizenship',
                    el:     '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul'
                }
            );
        });

        chrome.runtime.onMessage.addListener(function (msg, sender, response) {

            switch ( msg.type ) {
                case 'el.set':
                    var html = '';
                    for (let i = 0; i < msg.html.length; i++) {
                        html += '<option value = "' + (i + 1) +'">' + msg.html[ i ] + '</option>'
                    }
                    document.getElementById(msg.destEl).innerHTML = html;
                    break;
            }
        });

        interval.value = config.interval / 1000;

        document.getElementById( 'save' ).onclick = function() {

            config.pages[ '/form' ].pages[ 0 ].actions[ 1 ].el = '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[' + citizenship.value + ']';
            config.pages[ '/form' ].pages[ 0 ].actions[ 3 ].el = '//*[@id="ctl00_cp1_ddEmbassy_DropDown"]/div/ul/li[' + embassy.value + ']';
            config.pages[ '/form' ].pages[ 0 ].actions[ 5 ].el = '//*[@id="ctl00_cp1_ddVisaType_DropDown"]/div/ul/li[' + visatype.value + ']';

            config.pages[ '/form' ].pages[ 0 ].actions[ 9 ].delay = interval.value * 1000;
            console.log(config);

            // Enable the page-action for the requesting tab
            chrome.storage.sync.set({'config': JSON.stringify(config)}, function () {
                // Notify that we saved.
                console.info('Settings saved');
            });

            chrome.extension.sendMessage({
                type:   'configured'
            });
        };
    });
});
