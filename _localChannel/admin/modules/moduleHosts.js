(function() {
    var obj = function(env, pkg) {
        var fs = require('fs');
        var exec = require('child_process').exec;

        var fn = env.dataFolder + '/setting/hosts.json';
        var fnHosts = env.dataFolder + '/tasks/refreshEtcHosts.sh';
//        var fnDocker = env.dataFolder + '/setting/addDocker.sh';
//        var fnRemoveDocker = env.dataFolder + '/setting/removeDocker.sh';


        var CP = new pkg.crowdProcess();

        this.callList = (callback) => {
            var me = this;
            var list = me.getList();
            callback(list)
        }
        this.getList = () => {
            var me = this;
            var list = [];
            try { 
                delete require.cache[fn];
                list = require(fn);
            } catch(e) {}
            return list;
        }
        this.addHost = (data, callback) => {
            var me = this;
            var _f={};
            data.unidx = me.getUnIdx();

            _f['cloneCode'] = function(cbk) {
                delete require.cache[env.root+ '/modules/moduleGit.js'];
                var MGit = require(env.root+ '/modules/moduleGit.js');
                var git = new MGit(env);
                git.gitClone(data, function(result) {
                    cbk(true);
                });
            };

            _f['SitesHosts'] = function(cbk) {
                me.saveSitesHosts(data, cbk);
            };

            _f['EtcHosts'] = function(cbk) {
                me.saveEtcHosts(cbk);
            };
            _f['VHosts'] = function(cbk) {
                me.createVhostConfig(cbk);
            };

            _f['addDocker'] = function(cbk) {
                me.addDocker(data, cbk);
            };

            CP.serial(_f, function(data) {
                callback(CP.data.SitesHosts);
            }, 30000);
        }
        this.removeHost = (serverName, callback) => {
            var me = this;
            var dirn = env.sites;
            var _f={};
            var exec = require('child_process').exec;
            _f['deleteCode'] = function(cbk) {
                cmd = 'rm -fr ' + dirn + '/' + serverName;
                exec(cmd, {maxBuffer: 1024 * 2048},
                    function(error, stdout, stderr) {
                        cbk(true);
                });
            };

            _f['SitesHosts'] = function(cbk) {
                me.deleteSitesHosts(serverName, cbk);
            };

            _f['EtcHosts'] = function(cbk) {
                me.saveEtcHosts(cbk);
            };

            _f['VHosts'] = function(cbk) {
                me.createVhostConfig(cbk);
            };

            _f['removeDocker'] = function(cbk) {
                me.removeDocker(serverName, cbk);
            };

            CP.serial(_f, function(data) {
                callback(CP.data.SitesHosts);
            }, 30000);
        }
        this.saveSitesHosts = (data, callback) => {
            var me = this;
            var list = me.getList();
            var v = {
                dockerFile : data['dockerFile'],
                serverName : data['serverName'],
                gitHub     : data['gitHub'],
                branch     : data['branch'],
                ports      : data['ports'],
                unidx      : data['unidx'] 
            }
            list.push(v);
            fs.writeFile(fn, 
                JSON.stringify(list), (err) => {
                    callback(err);
            });
        }
        this.deleteSitesHosts = (serverName, callback) => {
            var me = this;
            var list = me.getList(), v = [];

            for (var i = 0; i < list.length; i++) {
                if (list[i].serverName !== serverName) {
                    v.push(list[i]);
                }
            }
            fs.writeFile(fn, 
                JSON.stringify(v), (err) => {
                    callback(err);
            });
        }
        this.getUnIdx = () => {
            var me = this;
            var list = me.getList();
            var idxList = [];

            for (var i = 0; i < list.length; i++) { 
                if (list[i].unidx) {
                    idxList.push(list[i].unidx);
                }
            }
            for (var i = 0; i < list.length; i++) {
                if (idxList.indexOf(i+1) === -1) {
                    return i + 1;
                }
            }
            return list.length + 1;
        }
        this.saveEtcHosts = (callback) => {
            var me = this;
            var str='',
                err = {};

            str += "#!/bin/bash\n";
            str += 'MARKS="#--UI_MAC_LOCAL_S--"' + "\n";
            str += 'MARKE="#--UI_MAC_LOCAL_E--"' + "\n";
            str += 'NLINE=$' + "'" + '\\n' + "'\n";
            str += 'TABL=$' + "'" + '\\t' + "'\n";
        
            str += 'v=$(sed "/"$MARKS"/,/"$MARKE"/d" /etc/hosts)' + "\n";

            var list = me.getList();
            str += 'p="$v $NLINE$NLINE$MARKS$NLINE';
            for (var i=0; i < list.length; i++) {
                str += '"127.0.0.1"$TABL"' + list[i].serverName + '.local"$NLINE';
                str += '"127.0.0.1"$TABL"' + list[i].serverName + '_local"$NLINE';
            }
            str += '$MARKE$NLINE"' + "\n";
            str += 'echo "$p" > /etc/hosts' + "\n";
            fs.writeFile(fnHosts, str, (err) => {
                callback(err);
            });
        }

        this.copyToTasks = (fname, fnTask, cbk) => {
            var cmd = 'cp -fr ' + fname + ' ' + fnTask;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    cbk(true);
            });
        }
        this.removeBootupFile = (fname, cbk) => {
            var cmd = 'rm -fr ' + fname;
            exec(cmd, {maxBuffer: 1024 * 2048},
                function(error, stdout, stderr) {
                    cbk(true);
            });
        }

        this.addDocker = (rec, callback) => {
            var me = this;
            var str='', err = {}, DOCKERCMD = {};
            try {
               delete require.cache[env.dataFolder  + '/DOCKERCMD.json'];
               DOCKERCMD = require(env.dataFolder  + '/DOCKERCMD.json');
            } catch (e) {};
           
            var dname = rec.serverName.toLowerCase();
            var iname = rec.dockerFile.toLowerCase();

            str += DOCKERCMD.DOCKERCMD + ' build -f  ' + DOCKERCMD.ROOT + '/_localChannel/admin/dockers/' + rec.dockerFile + ' -t ' + iname + '-image .'  + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container stop site_channel_container-'  + dname + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container rm site_channel_container-' + dname  + "\n";
            
            var p_str = '', p = rec.ports.split(',');
            
            for (var i = 0; i < p.length; i++) {
                p_str += ' -p ' + (parseInt(rec.unidx + '0000') + parseInt(p[i])) + ':' + parseInt(p[i]) + ' ';
            }
            
            str += DOCKERCMD.DOCKERCMD + ' run -d --network=network_ui_app ' + p_str + ' -v ';
            str += '"'+ DOCKERCMD.DATAPATH + '/sites/' + dname;
            str += '":/var/_localChannel --name site_channel_container-' + dname + '  ' + iname + '-image';
            str += "\n";

            var fnDocker = env.dataFolder + '/bootup/addDocker_' + dname +'.sh';
            var fnTask = env.dataFolder + '/tasks/addDocker_' + dname +'.sh';

            fs.writeFile(fnDocker, str, (err) => {
                me.copyToTasks(fnDocker, fnTask, callback);
             //   callback(err);
            });
        }
        this.removeDocker = (dname, callback) => {
            var me = this;
            var str='', DOCKERCMD = {};
            try {
               delete require.cache[env.dataFolder  + '/DOCKERCMD.json'];
               DOCKERCMD = require(env.dataFolder  + '/DOCKERCMD.json');
            } catch (e) {};

            str += DOCKERCMD.DOCKERCMD + ' container stop site_channel_container-'  + dname + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container rm site_channel_container-' + dname  + "\n";

            var fnDocker = env.dataFolder + '/bootup/addDocker_' + dname + '.sh';
            var fnRemoveDocker = env.dataFolder + '/tasks/removeDocker.sh';

            fs.writeFile(fnRemoveDocker, str, (err) => {
                me.removeBootupFile(fnDocker, callback);
            });
        }

        this.vHostRec = (rec) => {
            var str = '';
            str += '<VirtualHost *:80>' + "\n";
            str += 'ServerName ' + rec.serverName +  ".local\n";
            str += 'ProxyRequests On' + "\n";
            str += 'ProxyPreserveHost Off' + "\n";
            str += 'ProxyPass / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += 'ProxyPassReverse / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += '</VirtualHost>' + "\n\n";

            str += '<VirtualHost *:80>' + "\n";
            str += 'ServerName ' + rec.serverName +  "_local\n";
            str += 'ProxyRequests On' + "\n";
            str += 'ProxyPreserveHost Off' + "\n";
            str += 'ProxyPass / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += 'ProxyPassReverse / http://' + rec.ip + ':' + rec.port + '/' + "\n";
            str += '</VirtualHost>' + "\n\n";
            return str;
        }
        this.createVhostConfig = (callback) => {
            var me = this;
            var list = me.getList();
            var fnVhostConfig = env.dataFolder + '/setting/vHost.conf';
            var strVHostRec = '';
            for (v in list) {
                var port_a = list[v].ports.split(',');
                for (var i = 0; i < port_a.length; i++) {
                    strVHostRec += me.vHostRec({
                        port        :  10000 * parseInt(list[v].unidx + '') + parseInt(port_a[i]),
                        serverName  : list[v].serverName,
                        ip  : '10.10.10.254',
                        innerPort  : parseInt(port_a[i])
                    })
                }
            }
            fs.writeFile(fnVhostConfig, strVHostRec, (err) => {
                callback(err);
            });
        }

    }
    module.exports = obj;
})()