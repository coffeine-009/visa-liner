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

        chrome.runtime.sendMessage({
            type:   'el.get',
            el:     '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul'
        });

        chrome.runtime.onMessage.addListener(function (msg, sender, response) {

            switch ( msg.type ) {
                case 'el.set':
                    citizenship.innerHTML;
                    //TODO
                    break;
            }
        });

        interval.value = config.interval / 1000;

        document.getElementById( 'save' ).onclick = function() {

            config.pages[ '/form' ].pages[ 0 ].actions[ 1 ].el = '//*[@id="ctl00_cp1_ddCitizenship_DropDown"]/div/ul/li[' + citizenship.value + ']';
            console.log(config);

            // Enable the page-action for the requesting tab
            chrome.storage.sync.set({'config': JSON.stringify(config)}, function () {
                // Notify that we saved.
                console.info('Settings saved');
            });
        };
    });
});
