(function() {
    var obj = function(env) {
        var fs = require('fs');

        this.loadDockersList = (callback) => {
            var me = this;
            var dirname = env.appFolder + '/dockerFiles';
            fs.readdir(dirname, (err, files) => {
                var list = [];
                for (var i in files) {
                    me.getDescription(dirname + '/' + files[i] + '/description',
                        (function(i) { return function(err, info) {
                            list.push({code : files[i], description : info});
                            if (list.length == files.length) {
                                callback(list);
                            }
                        }})(i)
                    );
                }
            });
        }
        this.getDescription = (fn, callback) => {
            fs.readFile(fn, 'utf8', function(err, contents) {
                var info = contents.replace(/(\r|\n|\r\n|\n\r)/g, '<br/>');
                callback(err, info);
            });
        }
        
    }

    module.exports = obj;
})()