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

        interval.value = config.interval / 1000;

        document.getElementById( 'save' ).onclick = function() {
            config.interval = interval.value * 1000;
            config.pages[ '/form' ].pages[ 0 ].actions[ 9 ].delay = interval.value * 1000;

            // Enable the page-action for the requesting tab
            chrome.storage.sync.set({'config': JSON.stringify(config)}, function () {
                // Notify that we saved.
                console.info('Settings saved');
            });
        };
    });
});
