/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/05/16 8:25 AM
 */

import { Action } from 'Action';

/**
 * Action :: Click.
 * Click on DOM element.
 *
 * @version 1.0
 */
export class ClickAction extends Action {

    /**
     * Do click on concrete DOM element.
     */
    doIt() {
        this.el.click();
    }
}
