define(['common/networking/binaryAjax',
        'common/networking/ajax'],
function (binaryAjax, ajax) {


    describe('binaryAjax', function () {

        var fakedSuccessResponse = { name: 'Avi' };

        var fakedPromiseResolver = function () {
            var d = $.Deferred();
            d.resolve(fakedSuccessResponse);
            return d.promise();
        };

        it('should be defined', function () {
            expect(binaryAjax).toBeDefined();
        });


        describe('request method', function () {

            var settings = {};

            beforeEach(function () {
                settings = {
                    url: 'fakedURL',
                    method: 'GET'
                };
                spyOn(ajax, 'request').and.callFake(fakedPromiseResolver);


            });

            it('should be defined', function () {
                expect(binaryAjax.request).toBeDefined();
            });

            describe('params', function () {
                it('settings object is mandatory ', function () {
                    expect(function () { binaryAjax.request().toThrow(); });
                });

                it('settings must be an object', function () {
                    expect(function () { binaryAjax.request(JSON.stringify(settings)).toThrow(); });
                });
            });
            describe('logic', function () {
                it('binary settings are added to settings ', function () {
                    binaryAjax.request(settings);
                    expect(ajax.request).toHaveBeenCalledWith(jasmine.objectContaining({
                        dataType: 'binary',
                        processData: false,
                        responseType: 'arraybuffer',
                        url: 'fakedURL',
                        method: 'GET'
                    }));

                });
                it('binary settings merge with settings ', function () {
                    binaryAjax.request({ url: 'fakedURL', method: 'GET', responseType: 'blob' });
                    expect(ajax.request).toHaveBeenCalledWith(jasmine.objectContaining({
                        dataType: 'binary',
                        processData: false,
                        responseType: 'blob',
                        url: 'fakedURL',
                        method: 'GET'
                    }));

                });
                it('return a promise', function () {

                    const request = binaryAjax.request(settings);
                    expect(typeof request).toEqual('object');
                    expect(typeof request.then).toEqual('function');

                });

            });


        });

    });

});
