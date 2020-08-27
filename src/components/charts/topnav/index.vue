<template>
  <div class="navbar">
    <ul>
      <li @click="fullBox">
        <img :src="require('@/assets/data/fullscreen.png')" alt="全屏"> 
      </li>
      <li @click="changeLen">
        <img :src="require('@/assets/data/translate.png')" alt="翻译"> 

      </li>
      <li @click="topextend">
        <img :src="require('@/assets/data/warning.png')" alt="告警"> 
      </li>
      <li @click="goHome">
        <img :src="require('@/assets/data/rehome.png')" alt="返回"> 
      </li>
    </ul>
  </div>
</template>

<script>
import screenfull from "screenfull";
import icon from '../icon'
import {post_translate_data} from '@/api/cmdb/post_translate_data.js'
export default {
  data() {
    return {
      senddata:'',
      fydata:'',
    }
  },
  components: {
    icon
  },
  name: "topnav",
  computed: {
    
  },
  mounted () {
    
  },
  methods: {
    fullBox() {
      screenfull.toggle();

    },
   
    goHome() {
      if(screenfull.isFullscreen){
        console.log(screenfull.isFullscreen)
           screenfull.toggle();
      }
      this.$router.push({ path: "/layout/home" });
    },
    changeLen(){
        this.$prompt('翻译', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            
          }).then(({ value }) => {
            let fayi={
              key:value
            }
            post_translate_data(fayi).then(
                res=>{   
                    if(res.status == 200){
                        this.fydata=res.data.message
                    }
                }
              )
              
             
             setTimeout(() =>{
                  this.$notify({  
                    title: '翻译结果',
                    message: this.fydata,
                    duration: 5000
                  });
                },400);  
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });       
          });
        },
    topextend(){
      alert('功能开发中...')
    }
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  width: 202px;
  height: 50px;
  margin-bottom: 0;
  background: rgba(216, 191, 216, 0.2);
  border-radius: 0;
  border: none;
  margin-left: -150px;
  transition: margin-left 0.9s;
  position: fixed;
  top: 0px;
  ul {
    width: 100%;
    height: 100%;
    li {
      float: left;
      width: 50px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px;
      &:focus {
        background: #3498da;
      }
      &:hover {
        background: #3498da;
      }
    }
  }
  &:hover {
    margin-left: 0px;
  }
}
</style>
