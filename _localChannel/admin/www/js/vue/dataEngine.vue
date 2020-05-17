<template>
</template>

<script>
module.exports = {
    props: ['commonData'],
    data: function() {
        return {
        }
    },
    created() {
        var me = this;
        me.$parent.triggerSpinner = true;
    },
    methods :{
        removeVirtualHost(serverName) {
            var me = this;
            $('#confirm_modal').modal('hide');
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'deleteHost',
                    serverName :serverName
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (result.status !== 'success') {
                    } else {
                        me.$parent.commonData.list = result.list;
                    }
                },
                dataType: 'JSON'
            });
        },
        getVHostList(noSpinner) {
            var me = this;
            if (!noSpinner) {
                me.$parent.triggerSpinner = true;
            }
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'loadList'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    me.$parent.commonData.list = result.list;
                },
                dataType: 'JSON'
            });
        },
        loadDockersList(noSpinner) {
            var me = this;
            if (!noSpinner) {
                me.$parent.triggerSpinner = true;
            }
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'loadDockersList'
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    me.$parent.commonData.dockers = result.list;
                },
                dataType: 'JSON'
            });
        },
        gitRemoteBranchs (gitRecord, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'gitRemoteBranchs',
                    data : gitRecord
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    callback(result);
                },
                dataType: 'JSON'
            });
        },
        saveVHostForm(data, callback) {
            var me = this;
            me.$parent.triggerSpinner = true;
            $.ajax({
                type: 'POST',
                url:'/api',
                data: {
                    cmd :'addHost',
                    data: data
                },
                success: function(result) {
                    me.$parent.triggerSpinner = false;
                    if (result.status === 'success') {
                        me.getVHostList();
                    }
                    callback(result); 
                },
                dataType: 'JSON'
            });
        }
    }
}
</script>
 
<style>
</style>