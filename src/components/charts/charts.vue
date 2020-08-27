<template>
  <div class="charts">
    <dheader>
      <clock class="clock" :styleObj="{'color':'#fff','font-size':'20px'}"></clock>
    </dheader>
     <topnav></topnav> 
     <div class="data-content">
      <div class="data-main">
        <div class="main-left">
          <dleft></dleft>
        </div>
        <div class="main-center">
          <mapchart class="map"></mapchart>
           <databox
              class="main-buttom"
              :title="'任务发布'"
              :dheight="260"
              :icon="'account'"
            >
              <!-- <myevent :data="myevent"></myevent> -->
                <serverinfo></serverinfo>
            </databox>
        </div>
        <div class="main-right">
          <dright ></dright>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import dheader from './dheader'
import topnav from './topnav'
import mapchart from './map/mapchart'
import dright from './dright'
import dleft from './dleft'
import databox from '../charts/databox'
import myevent from './myevent'
import clock from '../Clock'
import serverinfo from '@/components/charts/map/serverinfo'

import publishdata from '@/assets/data/publishdata.json'
var mapName = 'china'



export default {
      name: "charts",
      components:{
          dheader,
          topnav,
          mapchart,
          dright,
          dleft,
          databox,
          myevent,
          clock,
          serverinfo
          
      },
        
    data () {
          
          return {   
            myevent:[], 
        }
    },
    mounted () {
      this.myevent=publishdata.publishJobs
    }

}
</script>

<style lang="scss" scoped>
.charts{
  position:fixed;  
  background: url(../../assets/data/true.png) repeat-x;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  min-width: 1220px;
  .clock{
    position: relative;
    top: -42px;
    right: -30px;
  }
  
   .data-content {
    padding-bottom: 20px;
    position: relative;
    top:-40px;
 
    .data-main {
      width: calc(100% - 40px);
      margin-bottom: 40px;
      margin-left: 20px;
      height: 750px;
      .map{
        position: relative;
        top: 55px;
        right: 12px;
      }
      .main-left {
        width: 27%;
        float: left;
        position: relative;
        top: 71px;
      }
      .main-center {
        float: left;
        width: 46%;
        padding: 0 20px 0 20px;
        .main-buttom{
          position: relative;
          top: 73px;
        }
      
      }
      .main-right {
        float: left;
        width: 27%;
        height: 615px;
      }
    }
  }
}

</style>
