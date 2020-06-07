<template>
<div class="card shadow m-2 mr-1">
    <div class="card-body card-form-section">
        <div v-if="!$parent.commonData.formStarted">
            <div class="m-3 text-center"><button class="btn btn-success" v-on:click="startFrom()">Click here to add a new virtual host</button></div>
            <div class="noFormImage"></div>
        </div>
        <form v-if="$parent.commonData.formStarted" >
            <div class="form-group">
                <label>Repository git URI *</label>
                <input type="text" class="form-control" v-model="form.gitHub" @input="changedGit" placeholder="Repository git URI">
            </div>
            <div class="form-group" v-if="branches===null">
                <div class="container-fluid border border-2 p-2 alert-secondary rounded">
                    <div class="row">
                        <div class="col-6">
                            <label>Repository username</label>
                            <input type="text" class="form-control" v-model="form.userName"  placeholder="Rep. username">                        
                        </div>
                        <div class="col-6">
                            <label>Repository password</label>
                            <input type="password" class="form-control" v-model="form.password" placeholder="Rep. password">
                        </div>
                    </div>    
                </div>
            </div>
            <button type="button" v-if="branches===null" class="btn btn-info" v-on:click="gitRemoteBranchs(form)">Get branchs</button>
            <div v-if="branches!==null" >
                <input type="hidden" v-model="form.userName">
                <input type="hidden"  v-model="form.password" >
            </div>
            <div class="form-group" v-if="branches!==null" >
                <label>Branche</label>
                <select class="form-control" :required="true" v-model="form.branch">
                    <option 
                    v-for="option in branches" 
                    v-bind:value="option"
                    :selected="option ==  form.branch"
                    >{{ option }}</option>
                </select>
            </div>

            <div class="form-group" v-if="branches!==null" >
                <label>Host ServerName * </label>
                <input type="text" class="form-control" maxlength="64" v-model="form.serverName" placeholder="Host ServerName">
            </div>

            <div class="form-group" v-if="branches!==null" >
                <label>Open Ports</label>
                <input type="text" class="form-control" maxlength="64" v-model="form.ports" placeholder="ports">
            </div>

            <div class="form-group" v-if="branches!==null">
                <label>Dockerfile</label>
                    <div class="dropdown">
                        <input type="text" data-toggle="dropdown"  class="form-control dockerfile" v-model="form.dockerFile" 
                        aria-haspopup="true" aria-expanded="false"
                        placeholder="Select your Dockerfile" readonly />
                        
                        <div class="dropdown-menu dropdown-pick-docker shadow border-secondary rounded-0 border-width-1" >
                            <div v-for="(v, k) in $parent.commonData.dockers" class="dropdown-item" v-bind:class="{ 'bg-even': !(k%2), 'bg-odd': (k%2) }">
                                <a href="JavaScript:void(0)" v-on:click="selectDocker(v.code)"><b>{{v.code}}</a></a>
                                <p class="text-wrap p-0 m-1" v-html="v.description"></p>
                            </div>
                        </div>
                    </div>
            </div>

           
            <button type="button" v-if="branches!==null" class="btn btn-info" v-on:click="saveVHost()">Save the virtual host</button>
            <!--button type="button" class="btn btn-warning" v-on:click="reset()">Reset fields</button-->
            <button type="button" class="btn btn-secondary" v-on:click="cancel()">Cancel</button>
            
            <hr/>
            <div class="text-danger p-3"  v-if="!isformValid()">
                <b>Please correct the following error(s):</b>
                <ul>
                <li v-for="(v, k) in errors">{{v}}</li>
                </ul>
            </div>
        </form>
    </div>
</div>
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            errors: {},
            dockers : [],
            branches : null,
            form : {
                dockerFile  : '',
                serverName  : '',
                gitHub      : '',
                branch      : ''
            }
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
                me.loadDockersList()
            }, 1000
        );
    },
    methods : {
        initForm() {
            var me = this;
            me.branches = null;
            me.form.branch = '';
            me.form.serverName = '';
            me.form.ports = '';
            me.form.dockerFile = '';
        },
        changedGit(e) {
            var me = this;
            me.initForm();
        },
        loadDockersList() {
            var me = this;
            me.$parent.dataEngine().loadDockersList(true);
        },
        gitRemoteBranchs(gitRecord) {
            var me = this;
            me.gitValidation();
            me.$forceUpdate();
            if (me.isformValid()) {
                me.$parent.dataEngine().gitRemoteBranchs(gitRecord, function(result) {
                    if (result.status === 'success') {
                        me.branches = result.branches;
                    } else {
                        me.branches = null;
                        me.errors.gitHub = result.message;
                    }
                    me.form.branch = (!me.branches) ? '' : (me.branches.indexOf(me.form.branch) === -1) ? me.branches[0] : me.form.branch
                    me.$forceUpdate();
                });
            }
        },
        selectDocker(v) {
            var me = this;
            me.form.dockerFile = v;
            me.$forceUpdate();
        },
        saveVHost() {
            var me = this;
            me.formValidation();
            if (!me.isformValid()) {
                return false;
            } 
            me.$parent.dataEngine().saveVHostForm(
                me.form, function(result) {
                    if (result.status === 'success') {
                        me.cancel();
                    }
                }
            );
        },

        reset() {
            var me = this;
            me.form = {};
            me.errors={};
            me.branches = null;
        },
        cancel() {
            var me = this;
            me.reset();
            me.$parent.commonData.formStarted = false;
        },
        startFrom() {
            var me = this;
            me.$parent.commonData.formStarted = true;
        },
        isformValid() {
            var me = this;
            return (!Object.keys(me.errors).length) ? true : false;
        },
        isServerNameExist(name) {
            var me = this, list = me.$parent.commonData.list
            for (e in list) {
                console.log(e);
                if (list[e].serverName == name) {
                    return true;
                }
            }
            return false;
        }, 
        gitValidation() {
            var me = this;
            me.errors.gitHub = null;
            var regex = /^(git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
            
            if (!me.form.gitHub) {
                me.errors.gitHub = 'Github URI required.';
            } else if (!regex.test(me.form.gitHub)) {
                me.errors.gitHub = 'Incorrect github URI.';
            } else {
                delete me.errors.gitHub;
            }
            return (!me.errors.gitHub) ? true : false;
        },
        portValidation() {
            var me = this;
            delete me.errors.ports;
            if (!me.form.ports) {
                me.errors.ports = 'ports required.';
            } else if (me.form.ports) {
                var l = me.form.ports.split(',');
                for (var i = 0; i < l.length; i++) {
                    if (isNaN(l[i])) {
                        me.errors.ports = 'Incorrect port list.';
                        return false;
                    } else  if (l[i] > 9999) {
                        me.errors.ports = 'all port should be less than 10000';
                        return false;
                    }
                }
            } 
            return true ;
        },
        formValidation() {
            var me = this;
            me.errors = {};
            me.gitValidation();
            me.portValidation();

            if (!me.form.serverName) {
                me.errors.serverName = 'ServerName required.';
            }

            if (me.isServerNameExist(me.form.serverName)) {
                me.errors.serverName = 'ServerName required.';
            }

            if (!me.form.serverName) {
                me.errors.dockerFile = 'DockerFile required.';
            }
            
        }
    }
}
</script>
 
<style>
.noFormImage {
    min-width: 100%;
    min-height :512px;
    background-image: url("/imgs/icon1.png");
    background-color: transparent;
    background-size: 100%;
    background-position: center;
    background-repeat: no-repeat;
}
.dropdown-pick-docker {
    height:20em;
    z-index: 3000;
    width: 800px !important; 
    overflow-y: scroll;
    overflow-x: hidden;
}

.bg-odd {  min-height : 6em; border-bottom: 1px dashed; border-color: #aaa;}
.bg-even {  min-height : 6em;  border-bottom: 1px dashed; border-color: #aaa; }
.border-width-1 {  border-width: 6px; border-color: #999}

input.dockerfile[readonly] {
  background-color:transparent;
}

</style>