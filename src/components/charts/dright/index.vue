<template>
  <div class="right-content">
   
      <databox :title="''" :dheight="480">  
        <databox
          :title="'主机'"
          :dheight="160"
          :boxb="false"
        >
        <hosts-box></hosts-box>
        </databox>
        <databox
          :title="'性能'"
          :dheight="320"
          :boxb="false"
        >
       <cpm></cpm>
          
        </databox>
      </databox>
      <div class="top-box">
       <div class="messege">
        <databox
          :title="'最新消息'"
          :dheight="310"
          :icon="'account'"
        >
          <message></message>
        </databox>
      </div>
    </div>
  </div>
</template>

<script>

import databox from "../databox"
import message from "../dright/message"
import hostsBox from "./hostsBox"
import cpm from "./cpm"

export default {
  components: {
    databox,
    hostsBox,
    message,
    cpm,
  },
  props: {

  },
  data() {
    return {
     messege: [],
    };
  },
  created() {
    
    // this.getData(this.username)
  },
  methods: {
  
  },
  mounted() {
 
  },
  watch: {
    
  }
};
</script>

<style lang="scss" scoped>
.right-content {
  width: 100%;
  height: 100%;
  .top-box {
    padding-bottom: 40px;
    .messege {
      padding-top: 20px;
    }
  }
}
</style>
