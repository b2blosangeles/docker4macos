<template>
    <div class="card shadow m-2 ml-1">
        <div class="card-body card-list-section">
            <h4>Virtual Host List</h4>
            <div class="list-group " id="list_section" v-for="item in  $parent.commonData.list">
                <div class="list-group-item list-group-item-action flex-column align-items-start mb-0">

                    <div class="container-fluid m-0">
                        <div class="row">
                            <div class="col-3 p-0 m-0 text-center pr-3">
                                <h3><b>{{item.serverName}}</b></h3>
                                <a class="btn btn-sm btn-warning" href="JavaScript:void(0)" v-on:click="deleteVirtualServer(item.serverName)">
                                    Delete
                                </a>
                            </div>
                            <div class="col-9 p-0 m-0">
                                Server name: <span class="text-info">{{item.serverName}}</span>
                                <span class="ml-3">
                                    innerPort - uterPort : <span class="text-info"> {{outerPorts(item)}} </span>
                                </span>
                                <br/>
                                Docker file: <span class="text-info">{{item.dockerFile}}</span><br/>
                                github : <span class="text-info"> {{item.gitHub}}</span><br/>
                                branch : <span class="text-info"> {{item.branch}}</span>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    </div> 
</template>
 
<script>
module.exports = {
    data: function() {
        return {
            list : []
        }
    },
    mounted() {
        var me = this;
        setTimeout(
            function() {
                me.loadList()
            }, 1000
        );
    },
    methods : {
        loadList() {
            var me = this;
            me.$parent.dataEngine().getVHostList(true);
        },
        deleteVirtualServer(serverName) {
            var me = this;
            me.$parent.commonData.popUp.serverName = serverName;
            $('#confirm_modal').modal('show');
        },
        outerPorts(item) {
            var me = this;
            var str = '';
            var p = item.ports.split(',');
            for (var i = 0; i < p.length; i++) {
                str += parseInt(p[i]) + '-' + parseInt(parseInt(item.unidx) + '0000') +  parseInt(p[i]) + ','
            }
            return str.replace(/\,$/,'');
        }
    }

}
</script>
 
<style>
</style>