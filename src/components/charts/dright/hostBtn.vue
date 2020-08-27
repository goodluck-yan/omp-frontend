<template>
    <div class="imgdiv" @click="changeColor">
        <img :src="hostcloud" alt="" :style="{background:hostcloud}">
        <p >{{hostipadr}}</p>
    </div>    
</template>

<script>
export default {
     props: {
        clickhost:{
            type:Array,
            default:['0.0.0.0',0],
        }
    },
    data(){
        return{
            hostcloud:require('@/assets/data/hostcloud.png'),
            hostcloud2:require('@/assets/data/hostcloud2.png'),
            hostipadr:this.clickhost[0],
        }
    },
    methods: {
        changeColor(){
            // alert(this.clickhost[1])
            this.hostcloud=this.hostcloud2
            this.$emit('changeBtn',this.clickhost[0] )
            
        }
    },
    mounted () {
        setInterval(() => {
        this.hostcloud=this.hostcloud
      }, 10000);
    },
    watch:{

    },
}
</script>

<style lang="scss" scoped>
.imgdiv{
    margin-top:10px;
    margin:10px auto;
    width:105px;
    text-align:center;
    font-size: 0.5rem;
    color: #fff;

}
</style>