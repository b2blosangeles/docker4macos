(function() {
    var obj = function(env) {
        var fs = require('fs');

        this.loadDockersList = (callback) => {
            var me = this;
            var dirname = env.root + '/dockers';
            fs.readdir(dirname, (err, files) => {
                var list = [];
                for (var i in files) {
                    me.getDescription(dirname + '/' + files[i],
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
                var info = contents.match(/^\#((.|\r|\n|\r\n|\n\r)*)FROM/);
                var l = (info) ? info[1].split('#') : [];
                for (i in l) {
                    l[i] = l[i].replace(/^\s*|\s*$/g, '');
                }
                callback(err, l);
            });
        }
        
    }

    module.exports = obj;
})()