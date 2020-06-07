(function () { //
	var obj =  function (env, pkg, req, res) {
		var fs = require('fs');
        fs = require('fs');
        delete require.cache[env.root+ '/modules/moduleHosts.js'];
        var MHosts = require(env.root+ '/modules/moduleHosts.js');
		var hosts = new MHosts(env, pkg);
		

		this.get = function() {
            var me = this, p = req.params[0];
            var fn = env.root + '/www/' + p;
            fs.stat(fn, function(err, stat) {
				if(err == null) {
					res.sendFile(fn);
				} else  {
					res.render('html/page404.ect');
				}
            });
		};	

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
		};

        this.gitRemoteBranchs = () => {
			delete require.cache[env.root+ '/modules/moduleGit.js'];
			var MGit = require(env.root+ '/modules/moduleGit.js');
			var git = new MGit(env);
			git.gitRemoteBranchs(req.body.data, function(result) {
			  res.send(result);
			});
		}
  
		this.postSaveHost = (data) => {
			var me = this;
			hosts.addHost(data, function(err) {
				me.postLoadList();
			});
		}
		this.postRemoveHost = (serverName) => {
			var me = this;
			hosts.removeHost(serverName, function(v) {
			  me.postLoadList();
			});
		}	
		this.loadDockersList = () => {
			  delete require.cache[env.root+ '/modules/moduleDockerfile.js'];
			  var MDockerfile= require(env.root+ '/modules/moduleDockerfile.js');
			  var dockers = new MDockerfile(env, pkg);
			  dockers.loadDockersList(function(list) {
				res.send({status:'success', list : list });
			  });
		  }
  
		  this.postLoadList = () => {
			hosts.callList(function(list) {
			  res.send({status:'success', list : list });
			})
		  }
  
	

	};
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = obj;
	} 

})();
