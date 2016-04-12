/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 11:32 PM
 */


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

/**
 * A linked list implementation in JavaScript.
 * @class LinkedList
 * @constructor
 */
class LinkedList {

    constructor() {
        /**
         * The number of items in the list.
         * @property _length
         * @type int
         * @private
         */
        this._length = 0;

        /**
         * Pointer to first item in the list.
         * @property _head
         * @type Object
         * @private
         */
        this._head = null;

        /**
         * Pointer to current item in the list.
         *
         * @property _current
         * @type {bject}
         * @private
         */
        this._current = null;
    }

    /**
     * Appends some data to the end of the list. This method traverses
     * the existing list and places the value at the end in a new item.
     * @param {variant} data The data to add to the list.
     * @return {Void}
     * @method add
     */
    add(data) {

        //create a new item object, place data in
        var node = {
                data: data,
                next: null
            },

        //used to traverse the structure
            current;

        //special case: no items in the list yet
        if (this._head === null) {
            this._head = node;
            this._current = node;
        } else {
            current = this._head;

            while (current.next) {
                current = current.next;
            }

            current.next = node;
        }

        //don't forget to update the count
        this._length++;

    }

    /**
     * Retrieves the data in the given position in the list.
     * @param {int} index The zero-based index of the item whose value
     *      should be returned.
     * @return {variant} The value in the "data" portion of the given item
     *      or null if the item doesn't exist.
     * @method item
     */
    item(index) {

        //check for out-of-bounds values
        if (index > -1 && index < this._length) {
            var current = this._head,
                i = 0;

            while (i++ < index) {
                current = current.next;
            }

            return current.data;
        } else {
            return null;
        }
    }

    /**
     * Retrieve the data in the next position in the list.
     *
     * @return {variant} The value in the next portion of the given item
     *      or null if the item doesn't exist.
     *
     * @method next
     */
    next() {
        //- Remember current item -//
        var result = this._current.data;

        //- Move current posi]aption -//
        this._current = this._current.next;

        //- Return current element -//
        return result;
    }

    /**
     * Removes the item from the given location in the list.
     * @param {int} index The zero-based index of the item to remove.
     * @return {variant} The data in the given position in the list or null if
     *      the item doesn't exist.
     * @method remove
     */
    remove(index) {

        //check for out-of-bounds values
        if (index > -1 && index < this._length) {

            var current = this._head,
                previous,
                i = 0;

            //special case: removing first item
            if (index === 0) {
                this._head = current.next;
            } else {

                //find the right location
                while (i++ < index) {
                    previous = current;
                    current = current.next;
                }

                //skip over the item to remove
                previous.next = current.next;
            }

            //decrement the length
            this._length--;

            //return the value
            return current.data;

        } else {
            return null;
        }

    }

    /**
     * Returns the number of items in the list.
     * @return {int} The number of items in the list.
     * @method size
     */
    size() {
        return this._length;
    }

    /**
     * Converts the list into an array.
     * @return {Array} An array containing all of the data in the list.
     * @method toArray
     */
    toArray() {
        var result = [],
            current = this._head;

        while (current) {
            result.push(current.data);
            current = current.next;
        }

        return result;
    }

    /**
     * Converts the list into a string representation.
     * @return {String} A string representation of the list.
     * @method toString
     */
    toString() {
        return this.toArray().toString();
    }
}


//- Configuration -//
var config = null;

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
                        {
                            name: 'click',
                            el: '//*[@id="ctl00_cp1_btnNext_input"]',
                            delay : 25000,
                            step: 3
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
