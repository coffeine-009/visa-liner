/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/05/16 8:25 AM
 */

import { Action } from 'Action';

/**
 * Action :: SelectAction.
 * Select concrete value from select's options.
 *
 * @version 1.0
 */
export class SelectAction extends Action {

    /**
     * Choose value from the options.
     */
    doIt() {
        this.el.value = this.val;
    }
}
