(function() {
    var obj = function(env, pkg) {
        var fs = require('fs');
        var exec = require('child_process').exec;

        var fn = env.sites + '/setting/hosts.json';
        var fnHosts = env.sites + '/setting/refreshHosts.sh';
        var fnDocker = env.sites + '/setting/addDocker.sh';

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
        this.save = (opt, data, callback) => {
            var me = this;
            var _f={};

            _f['SitesHosts'] = function(cbk) {
                if (opt === 'add') {
                    me.saveSitesHosts(data, cbk);
                } else {
                    me.deleteSitesHosts(data, cbk);
                }
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
                unidx      : me.getUnIdx() 
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
        this.saveHosts = (callback) => {
            var me = this;
            var str='',
                err = {};

            str += "#!/bin/bash\n";
            str += 'MARK="#--UI_MAC_LOCAL_REC--"' + "\n";
            str += 'NLINE=$' + "'" + '\\n' + "'\n";
            str += 'TABL=$' + "'" + '\\t' + "'\n";
        
            str += 'v=$(sed "/"$MARK"/,/"$MARK"/d" /etc/hosts)' + "\n";

            var list = me.getList();
            str += 'p="$v $NLINE$NLINE$MARK$NLINE';
            for (var i=0; i < list.length; i++) {
                str += '"127.0.0.1"$TABL"' + list[i].serverName + '_x3"$NLINE';
            }
            str += '$MARK$NLINE"' + "\n";
            str += 'echo "$p" > /etc/hosts' + "\n";
            fs.writeFile(fnHosts, str, (err) => {
                me.addDocker(list[0], (err) => {
                    me.createVhostConfig(list, (err1) => {
                        callback(err);
                    });
                });
            });
        }
        
        this.addDocker = (rec, callback) => {
            var me = this;
            var str='', err = {}, DOCKERCMD = {};
            try {
                delete require.cache[env.root + '/DOCKERCMD.json'];
                DOCKERCMD = require(env.root + '/DOCKERCMD.json');
            } catch (e) {};

            var dname = rec.serverName.toLowerCase();
            var iname = rec.dockerFile.toLowerCase();

            str += DOCKERCMD.DOCKERCMD + ' build -f  ' + DOCKERCMD.ROOT + '/_localChannel/admin/dockers/' + rec.dockerFile + ' -t ' + iname + '-image .'  + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container stop site_channel_container-'  + dname + "\n";
            str += DOCKERCMD.DOCKERCMD + ' container rm site_channel_container-' + dname  + "\n";

            str += DOCKERCMD.DOCKERCMD + ' run -d --network=network_ui_app -p 10080:80 -p 103000:3000 -p 104200:4200 -v ';
            str += '"'+ DOCKERCMD.ROOT + '/_localChannel/admin/sites/' + dname;
            str += '":/var/_localChannel --name site_channel_container-' + dname + '  ' + iname + '-image';
            str += "\n";

            fs.writeFile(fnDocker, str, (err) => {
                callback(err);
            });
        }
        this.vHostRec = (rec) => {
            var str = '';
            str += '<VirtualHost *:' + rec.port + '>' + "\n";
            str += 'ServerName ' + rec.serverName +  "\n";
            str += 'ProxyRequests On' + "\n";
            str += 'ProxyPreserveHost Off' + "\n";
            str += 'ProxyPass / http://' + rec.ip + ':' + rec.innerPort + '/' + "\n";
            str += 'ProxyPassReverse http://' + rec.ip + ':' + rec.innerPort + '/' + "\n";
            str += '</VirtualHost>' + "\n\n";
            return str;
        }
        this.createVhostConfig = (list, callback) => {
            var me = this;
            var fnVhostConfig = env.sites + '/setting/vHost.conf';
            var strVHostRec = '';
            for (v in list) {
                strVHostRec += me.vHostRec({
                    port        : 3000,
                    serverName  : list[v].serverName,
                    ip  : '10.10.10.254',
                    innerPort  : '3000'
                }) + me.vHostRec({
                    port        : 80,
                    serverName  : list[v].serverName,
                    ip  : '10.10.10.254',
                    innerPort  : '4200'
                });
            }
            fs.writeFile(fnVhostConfig, strVHostRec, (err) => {
                callback(err);
            });
        }

    }
    module.exports = obj;
})()