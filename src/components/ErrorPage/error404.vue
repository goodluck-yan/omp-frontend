<template>
    <div id="wrapper">
        <div id="main" align="middle">
            <img src="../../assets/404_images/404.png" height="556" width="1014"/>
         </div>               
        <div id="content">
            <h2>您打开的页面不存在！</h2>
            <Button type="primary" size="large" icon="arrow-left-c" @click="goback">返回上一级</Button>
        </div>  
        <router-view></router-view>
    </div>
</template>
<style>
    #wrapper img{
        background-attachment:fixed;
    }
    #content h2{
        margin-bottom: 8px;
    }
    #main{
        text-align: center;
        font-size: 30px;
        color:#3399ff;
        margin-top:20px; 
        margin-bottom:30px;
    }
    #content{
        text-align: center;
        font-size: 20px;
    }
</style>
<script>
    export default {
        methods: {
            goback: function(){
                this.$router.go(-1);
            }
    }
}
</script>