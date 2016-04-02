/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 3:45 PM
 */

//- Get configuration -//
var config = {};
chrome.storage.sync.get('config', (items) => {
    config = JSON.parse(items.config);
});

window.addEventListener('DOMContentLoaded', function () {

    var interval = document.getElementById( 'interval' );

    // ...query for the active tab...
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                from: 'popup-init',
                msg: 'Give config.'
            },
            (info) => {alert(info);}
        );
    });

    document.getElementById( 'save' ).onclick = function() {
        var config = {
            interval: interval.value * 1000
        };

        // ...query for the active tab...
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            // ...and send a request for the DOM info...
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    from: 'popup',
                    msg: config
                },
                (info) => {}
            );
        });
    };
});
