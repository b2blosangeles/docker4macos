(function() {
    var obj = function(env, pkg, req, res) {
        fs = require('fs');
        delete require.cache[__dirname + '/moduleHosts.js'];
        var MHosts = require(__dirname + '/moduleHosts.js');
        var hosts = new MHosts(env);

        this.get = () => {
            var fn = env.root + '/www/' + req.params[0];
            fs.stat(fn, function(err, stat) {
                  if(err == null) {
                    res.sendFile(fn);
                  } else  {
                    res.render('html/page404.ect');
                  }
            });
        }
        this.post = () => {
            var me = this;
            switch(req.body.cmd) {
              case 'loadList' :
                  me.postLoadList();
                  break;
              case 'addHost' :
                me.postSaveHost(req.body.data);
                break;
              case 'deleteHost' :
                me.postRemoveHost(req.body.serverName);
                break;
              case 'loadDockersList' :
                  me.loadDockersList();
                  break;
              case 'gitRemoteBranchs' :
                    me.gitRemoteBranchs();
                    break;
              default :
                res.send({status:'failure', message : '404 wrong cmd!'});
            }
        }
        this.gitRemoteBranchs = () => {
          delete require.cache[__dirname + '/moduleGit.js'];
          var MGit = require(__dirname + '/moduleGit.js');
          var git = new MGit(env);
          git.gitRemoteBranchs(req.body, function(result) {

            res.send(result);
          });
      }

      this.postSaveHost = (data) => {
        var me = this;
        // -- todo---
        delete require.cache[__dirname + '/moduleGit.js'];
        var MGit = require(__dirname + '/moduleGit.js');
        var git = new MGit(env);
        git.gitClone(req.body, function(result) {
          hosts.save(data, function(err) {
              me.postLoadList();
          });
        });
      }
      
      this.loadDockersList = () => {
            delete require.cache[__dirname + '/moduleDockerfile.js'];
            var MDockerfile= require(__dirname + '/moduleDockerfile.js');
            var dockers = new MDockerfile(env);
            dockers.loadDockersList(function(list) {
              res.send({status:'success', list : list });
            });
        }

        this.postLoadList = () => {
          hosts.callList(function(list) {
            res.send({status:'success', list : list });
          })
        }

        this.postRemoveHost = (serverName) => {
          var me = this;
          hosts.delete(serverName, function(v) {
            me.postLoadList();
          });
        }
    }
    module.exports = obj;
})()