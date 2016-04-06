/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 8:25 AM
 */

import { Action } from 'Action';


class CaptchaAction extends Action {

    doIt() {
        toDataUrl(this.el.src, (data) => { this.recognize(data); });
        console.log(this.el.src);
    }

    recognize(data) {
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            var res = xhr.response.split('|');
            if (res[0] == 'OK') {
                this.parse(res[1]);
            }
            console.log(xhr.response);
        };
        xhr.open('POST', 'https://rucaptcha.com/in.php');
        xhr.send('method=base64&key=e9f4eff94ef0123abc325e8ead5545a1&body=' + encodeURIComponent(data));
    }

    parse(id) {
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            if (xhr.response == 'CAPCHA_NOT_READY') {
                return this.parse(id);
            }
            var res = xhr.response.split('|');
            if (res[0] == 'OK') {
                getElementByXpath('//*[@id="cp1_pnlCaptchaBotDetect"]/span/input[1]').value = res[1];
                document.getElementById('ctl00_cp1_btnNext_input').click();
            }
        };
        xhr.open('GET', 'https://rucaptcha.com/res.php?key=e9f4eff94ef0123abc325e8ead5545a1&action=get&id=' + id);
        xhr.send();
    }
}
