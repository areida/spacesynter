module.exports = {
    reload : {
        perform : function (callback) {
            exec(
                'service nginx reload',
                function (error) {
                    if (error) {
                        callback(null, error);
                    } else {
                        callback(null, 'nginx reloaded')
                    }
                }
            );
        }
    }
};