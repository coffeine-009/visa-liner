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
            console.error( 'Cannot load config.' );
        }

        var interval = document.getElementById( 'interval' );
        var page = document.getElementById( 'page' );
        var pageNewUri = document.getElementById( 'page-new' );
        var action = document.getElementById( 'action-el' );
        var actionType = document.getElementById( 'action-type' );
        var actions = document.getElementById( 'actions' );

        interval.value = config.interval / 1000;
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
            config.pages[ '/form' ].actions[ 9 ].delay = interval.value * 1000;

            // Enable the page-action for the requesting tab
            chrome.storage.sync.set({'config': JSON.stringify(config)}, function () {
                // Notify that we saved.
                console.info('Settings saved');
            });
        };
    });
});
