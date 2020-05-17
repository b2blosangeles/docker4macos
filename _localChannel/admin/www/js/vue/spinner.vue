<template>
    <span v-if="$parent.triggerSpinner">
        <div class="overlay_spin_cover"></div>
        <div class="spinner"></div>
    </span>
</template>
 
<script>
module.exports = {
    props: []
}
</script>
<style>
/*---- overlay and spinner ---*/
.spinner {
   position: fixed;
   z-index:8009;
   left: 50%;
   top: 15%;
   height:60px;
   width:60px;
   margin:0px auto;
   -webkit-animation: rotation .6s infinite linear;
   -moz-animation: rotation .6s infinite linear;
   -o-animation: rotation .6s infinite linear;
   animation: rotation .6s infinite linear;
   border-left:6px solid rgba(4, 234, 8,.15);
   border-right:6px solid rgba(4, 234, 8,.15);
   border-bottom:6px solid rgba(4, 234, 8,.15);
   border-top:6px solid rgba(4, 234, 8,.8);
   border-radius:100%;
}
@-webkit-keyframes rotation {
   from {-webkit-transform: rotate(0deg);}
   to {-webkit-transform: rotate(359deg);}
}
@-moz-keyframes rotation {
   from {-moz-transform: rotate(0deg);}
   to {-moz-transform: rotate(359deg);}
}
@-o-keyframes rotation {
   from {-o-transform: rotate(0deg);}
   to {-o-transform: rotate(359deg);}
}
@keyframes rotation {
   from {transform: rotate(0deg);}
   to {transform: rotate(359deg);}
}


.overlay_spin_cover {
    position:fixed;
    top:0; left:0;
    background:rgba(0,0,0,0.5);
    z-index:8008;
    width:100%;
    height:100%;
    /* display:none; */
}

</style>