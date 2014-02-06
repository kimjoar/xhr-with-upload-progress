(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['timer'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('timer'));
    } else {
        // Browser globals (root is window)
        root.xhrUploadProgress = factory(root.timer);
    }
}(this, function (timer) {
    "use strict";

    return function(xhr, callback) {
        return function() {
            if (typeof xhr === 'function' && callback == null) {
                callback = xhr;
                xhr = new XMLHttpRequest();
            }

            if (!xhr.upload) return xhr;

            var time = timer();

            xhr.upload.addEventListener('loadstart', time.start, false);
            xhr.upload.addEventListener('progress', function(event) {
                if (!event.lengthComputable) return;

                var position = event.loaded || event.position;
                var total = event.total;

                callback({
                    percent: Math.floor((position * 100) / total),
                    time: time()
                });
            }, false);

            return xhr;
        };
    };

}));
