(function() {
    var exec = require('child_process').exec;
    var obj = function(env) {
        var fs = require('fs');


        this.gitRemoteBranchs = (gitRecord, callback) => {
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            var uri_a = gitRecord.data.gitHub.match(regex);
            var uri = uri_a[1] + '://' + ((!gitRecord.data.userName) ? '' : 
                (encodeURIComponent(gitRecord.data.userName) + ':' + encodeURIComponent(gitRecord.data.password) + '@'));
            for (var i=4; i < uri_a.length; i++) {
                uri +=  uri_a[i];
            }
            var cmd = 'git ls-remote ' + uri;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    var branches = [];
                    var list = stdout.split(/\s+/);
                    if (!error) {
                        for (var i in list) {
                            let regs = /^refs\/heads\//i;
                            if (regs.test(list[i])) {
                                branches.push(list[i].replace(regs, ''));
                            }
                        }
                        callback({status : 'success', branches : branches });
                    } else {
                        callback({status : 'failure', message : error.message});
                    }

                    
            });
        }

        this.gitClone = (gitRecord, callback) => {
            var dirn = env.root + '/sites';
            var dirDocker = env.root + '/dockers';
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*@|)(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            var uri_a = gitRecord.data.gitHub.match(regex);
            var uri = uri_a[1] + '://' + ((!gitRecord.data.userName) ? '' : 
                (encodeURIComponent(gitRecord.data.userName) + ':' + encodeURIComponent(gitRecord.data.password) + '@'));
            for (var i=4; i < uri_a.length; i++) {
                uri +=  uri_a[i];
            }
            var branchName = gitRecord.data.branch;

            var cmd = 'mkdir -p ' + dirn + ' && cd ' + dirn + ' && rm -fr ' + gitRecord.data.serverName + ' && git clone ' + 
                    uri + ' ' + gitRecord.data.serverName +  ' && ' + 
                    'cd ' + gitRecord.data.serverName  + ' && checkout branch ' + branchName;
                    
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    if (!error) {
                        callback({status : 'success'});
                    } else {
                        callback({status : 'failure', message : error.message});
                    }
            });
        }
    }

    module.exports = obj;
})()