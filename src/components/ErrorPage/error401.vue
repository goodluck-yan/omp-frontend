<template>
    <div>
        <div class="wrap">
            <div class="logo">
                <p style="font-size:220px">401</p>
                <p style="font-size:50px; font-family:STLiti;">您无权访问该页面</p> 
                <br/>
                <Button type="ghost" icon="arrow-left-c" @click="goback" style="font-size:15px">返回上一页</Button>
            </div>
            <div class="img">
                   <img src="../../assets/401_images/401.png" height="512" width="512" alt="" />
            </div>
        </div>
    </div>
</template>

<style scoped >
    .wrap{
        width:1000px;
        margin:0 auto;
    }
    .wrap .logo{
        width:430px;
        position:relative;
        top:210px; 
        left:500px;    
        color:#CDC9C9;
    }
    .wrap .img{
        width:400px;
        position:relative;
        top:-240px; 
        left:-50px;
 
    }
</style>

<script>
    export default {
        data () {
            return {

            }
        },

        methods: {
            goback (){
                this.$router.go(-1);
            }
        },

    }
</script>