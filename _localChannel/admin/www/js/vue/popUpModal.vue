<template>
    <div id="confirm_modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <p>Please confirm if you need remove the virtual host "{{this.$parent.commonData.popUp.serverName}}"</p>
                    <button type="button" class="btn btn-primary m-1" v-on:click="execDeletVirtualServer()">Confirm</button>
                    <button type="button" class="btn btn-secondary m-1" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    props: [],
    data: function() {
        return {
        }
   },
   methods :{
        execDeletVirtualServer() {
            let serverName = this.$parent.commonData.popUp.serverName;
            this.$parent.dataEngine().removeVirtualHost(serverName);
        }
   }
}
</script>
 
<style>
</style>