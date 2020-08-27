<template>
<div class="hostsBox">
  <div class="hostTitle">
    <span style="color:#fff;font-size:1rem;">{{hostadr}}主机IP:{{titledata}}</span>          
  </div>
  <el-carousel :interval="4000" type="card" height="100px" width="90px">
    <el-carousel-item v-for="(item,index) in hostData" :key="index" v-model='titledata'>
      <hostBtn  class="hostBtn" :clickhost=[item,index] @changeBtn='change' style="margin:10px auto;"></hostBtn>
    </el-carousel-item>
  </el-carousel>  
</div>
</template>

<script>
import hostBtn from "./hostBtn"
export default {
  components: {
    hostBtn,
  },
  data() {
    return {
      hostData:[],
      titledata:'',
      hostadr:'',


    }
  },
  created () {
     this.$bus.$on('gethostDate', this.getData) // 监听 changeRed 事件，当事件触发时，会执行 this.getData 方法
  },
  methods: {
    change(index){
      //  console.log(index);
       this.titledata=index
       alert(this.$store.zabbixToken+"这是store")
      
    },
      getData(x){
        // console.log(x); //x 是事件触发时，传递的数据
        this.hostData=x[1]
        this.hostadr=x[0]
      },
      
      
  },
  mounted () {
    
  },
  beforeDestroy(){
    this.$bus.$off('gethostDate', this.getData)
  },
}
</script>
<style lang="scss" scoped>
.hostTitle{
  text-align:center
}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 100px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #33739C;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #33739C;
  }

</style>