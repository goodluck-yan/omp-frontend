<!-- use plane  -->
<!-- 传入bgColor改变按钮背景色 -->
<!-- state切换button的状态 调用cancel()可以切换 -->
<!-- text为按钮文字 -->
<template>
    <div class = "container">
        <img
            @click="confirm"
            :disabled="state"
            class="confirm"
            :src="hostcloud"
            :style="{background:bgColor}"
        >
        <p style="color:#fff;font-size:0.3rem;">{{text}}</p>
            
    </div>
</template>

<script>
export default {
    props:{
        btnData:{
            types:Array,
            default(){
                return{
                    text:'hostsname',
                    
                }
            }
        }
    },
    data(){
        return{
            text:this.btnData.text,
            state:false,
            bgColor:'',
            hostcloud:'/static/hostcloud.png',
            // bgImg:'/static/hostcloud2.png',
        }
    },
    methods: {
        confirm(){
            this.bgColor='#FFB980'
            this.state=true
            //这里是激活父组件的事件，因为子组件是不会冒泡到父组件上的，必须手动调用$emit
            //相对应父组件要在调用该组件的时候，将其挂载到上面
            this.$emit("confirm")
        },
        cancel(){
            this.text=this.btnData.text
            this.state=false
        }
    }
}
</script>

<style lang="less" scoped>
.container{
    margin-left:10px;
    margin-top:10px;
    width:105px;
    text-align:center,
    .confirm {
        border: none;
        margin:0 auto;
        color: #fff;
        width: 100%;
        padding: 1rem 0;
        border-radius: 4px;
        font-size: 1.6rem;
        background: #5da1fd;
        &:focus {
            outline:none;
        }
    }
}

</style>