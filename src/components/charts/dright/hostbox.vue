<template>
    <div @click="ll" style="margin-left:10px;margin-top:10px;width:105px;text-align:center"  >
        <img style="margin:0 auto" :src="hostcloud" alt="192.168.38.100">
        <p style="color:#fff;font-size:0.3rem;">192.168.38.100</p>
    </div>    
</template>

<script>
export default {
    data(){
        return{
            hostcloud:require('@/assets/data/hostcloud.png'),
        }
    },
    methods: {
        ll(){
            alert("sada")
        }
    }
}
</script>

<style>

</style>