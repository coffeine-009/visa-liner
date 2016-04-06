/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 04/05/16 9:28 AM
 */

import { Util } from 'Util';

export class Captcha {

    constructor(imgSrc, destDOMs) {
        this.imageSrc = imgSrc;
        this.destinationDOMs = destDOMs || [];
    }

    recognize() {
        Util.toDataUrl(this.imageSrc, (data) => {

        });
    }

    /**
     * Send captcha for recognize.
     *
     * @param data
     */
    send( data ) {
        var xhr = new XMLHttpRequest();
        xhr.onload = () => {
            //- Parse response -//
            var res = xhr.response.split( '|' );
            //- Check success -//
            if ( res[ 0 ] == 'OK' ) {
                return this.parse( res[ 1 ] );
            }

            throw 'Cannot recognize';
        };
        xhr.open( 'POST', 'https://rucaptcha.com/in.php' );
        xhr.send(
            'method=base64&key=e9f4eff94ef0123abc325e8ead5545a1&body='
            + encodeURIComponent( data )
        );
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
        xhr.open(
            'GET',
            'https://rucaptcha.com/res.php?key=e9f4eff94ef0123abc325e8ead5545a1&action=get&id=' + id
        );
        xhr.send();
    }
}
