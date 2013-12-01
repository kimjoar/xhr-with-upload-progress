describe('xhr with upload progress', function() {

    it('adds "loadstart" event listener', function() {
        var addEventListener = sinon.spy();
        var callback = function() {};

        var baseXhr = {
            upload: {
                addEventListener: addEventListener
            }
        };

        var xhr = xhrUploadProgress(baseXhr, callback);

        xhr();

        expect(addEventListener.called).toBe(true);
        expect(addEventListener.firstCall.args[0]).toBe('loadstart');
    });

    it('adds "progress" event listener', function() {
        var addEventListener = sinon.spy();
        var callback = function() {};

        var baseXhr = {
            upload: {
                addEventListener: addEventListener
            }
        };

        var xhr = xhrUploadProgress(baseXhr, callback);

        xhr();

        expect(addEventListener.called).toBe(true);
        expect(addEventListener.lastCall.args[0]).toBe('progress');
    });

    describe('when progress events', function() {

        it('does not trigger callback if progres event does not contain any data', function() {
            var addEventListener = sinon.spy();
            var callback = sinon.spy();

            var progressFunc = createUploadProgressAndReturnProgressFunc(callback);

            progressFunc({});

            expect(callback.called).toBe(false);
        });

        it('triggers callback if progres event contains data', function() {
            var callback = sinon.spy();

            var progressFunc = createUploadProgressAndReturnProgressFunc(callback);

            progressFunc({
                lengthComputable: true,
                loaded: 1,
                total: 2
            });

            expect(callback.called).toBe(true);
        });

        it('includes percent in callback', function() {
            var callback = sinon.spy();

            var progressFunc = createUploadProgressAndReturnProgressFunc(callback);

            progressFunc({
                lengthComputable: true,
                loaded: 1,
                total: 2
            });

            var progress = callback.firstCall.args[0];

            expect(progress.percent).toEqual(50);
        });

        it('includes time in callback', function() {
            var clock = sinon.useFakeTimers();
            var callback = sinon.spy();

            var progressFunc = createUploadProgressAndReturnProgressFunc(callback);

            clock.tick(10);

            progressFunc({
                lengthComputable: true,
                loaded: 1,
                total: 2
            });

            var progress = callback.firstCall.args[0];

            expect(progress.time).toEqual(10);

            clock.restore();
        });

    });

    function createUploadProgressAndReturnProgressFunc(callback) {
        var addEventListener = sinon.spy();

        var baseXhr = {
            upload: {
                addEventListener: addEventListener
            }
        };

        var xhr = xhrUploadProgress(baseXhr, callback);

        xhr();

        var loadStartFunc = addEventListener.firstCall.args[1];
        var progressFunc = addEventListener.lastCall.args[1];

        loadStartFunc();

        return progressFunc;
    }

});
