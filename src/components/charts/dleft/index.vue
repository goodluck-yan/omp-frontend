<template>
  <div class="left-content">
    <div class="left-box">
        <databox :title="'主机分类'" :dheight="400">
          <piechart></piechart>
      </databox>
      <div class="messege">
        <databox
          :title="'项目发布'"
          :dheight="390"
          :icon="'account'"
        >
          <workchart></workchart>
        </databox>
      </div>
    </div>
  </div>
</template>

<script>
import databox from '../databox'
import piechart from '../map/piechart'
import workchart from '../map/workchart'
export default {
  components:{
    databox,
    piechart,
    workchart,
  },
  name:"dleft",
  data() {  
    
    return {
      
    }
  },
  created() {
   
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.left-content {
  width: 100%;
  height: 100%;
  .left-box {
    padding-bottom: 40px;
    .messege {
      padding-top: 20px;
    }
  }
}
</style>
