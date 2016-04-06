/**
 * Copyright (c) 2014-2016, Coffeine Inc
 *
 * @author <a href = "mailto:vitaliyacm@gmail.com">Vitaliy Tsutsman</a>
 *
 * @date 8:27 AM
 */

/**
 * Utils.
 *
 * @version 1.0
 */
export class Util {

    /**
     * Get DOM element by XPath.
     *
     * @param path      XPath string.
     *
     * @returns {Node}
     */
    static getElementByXpath(path) {
        return document.evaluate(
            path,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
    }

    /**
     * Get image from url as base64-encoded-image.
     *
     * @param url       Url of image.
     * @param callback  Callback for parse response.
     */
    static toDataUrl(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var reader  = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }
}
