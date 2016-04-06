/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 8:23 AM
 */

/**
 * Page object.
 *
 * @version 1.0
 */
class Page {

    /**
     * Create a new Page.
     *
     * @param uri       URI of page.
     * @param actions   List of actions for this page.
     *
     * @constructor
     */
    constructor(uri, actions) {
        this.uri = uri;
        this.actions = actions;
    }

    /**
     * Do actions.
     */
    doActions() {
        //FIXME: use chain of actions
        this.actions.forEach( ( action ) => {
            action.doIt();
        });
    };
}
