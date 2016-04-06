/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 8:22 AM
 */


chrome.extension.onRequest.addListener(
    function ( request, sender, sendResponse ) {

        // Create a simple text notification:
        var notify = chrome.notifications.create({
            type: 'basic',
            title: request.title,
            message: request.msg,
            iconUrl: 'icon.png'
        });

        var yourSound = new Audio('notification.mp3');
        yourSound.play();

        sendResponse( { returnMsg: "All good!" } ); // optional response
    }
);

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'content')) {
        // Enable the page-action for the requesting tab
        chrome.storage.sync.set({'config': JSON.stringify(msg.msg)}, function() {
            // Notify that we saved.
            console.info('Settings saved');
        });
    }
});
