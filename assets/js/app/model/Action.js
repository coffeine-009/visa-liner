/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/05/16 8:24 AM
 */

/**
 * Base class for actions.
 *
 * @version 1.0
 */
export class Action {

    /**
     * Create a new action.
     *
     * @param el    DOM element.
     * @param val   Value.
     */
    constructor(el, val) {
        this.el = el;
        this.val = val;
    }

    /**
     * Accessor for value.
     *
     * @returns Value.
     */
    get value() {
        return this.val;
    }

    /**
     * Abstract method.
     * Do action.
     *
     * @abstract
     * @method
     */
    doIt() {

    }
}
