<template>
  <div class="messege-box">
    <div class="messege-content">
      <vueSeamlessScroll :data="listData" :class-option="optionSingleHeightTime" class="seamless-warp">
        <ul>
          <li v-for="(item, index) in listData" :key="index">
            <el-popover
              placement="top-start"
              width="600"
              trigger="hover"
              
              >
               <databox
                :title="'最新消息'"
                :dheight="160"
                :icon="'account'"
                >
                <a class="a-msg">
              <icon :type="'tongzhi1'" :size="'1rem'" :color="'#F0FF00'"></icon>
              <span style="font-size:1rem">
                {{ index+1 }}、{{item.groups[0].name}}:&nbsp;{{item.description}} <br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                时间: {{item.lastchange*1000 | formatDate}} &nbsp;主机:{{item.hosts[0].host}}
              </span>
              <!-- <span class="title" v-text="item.alarm_name"></span>&nbsp;<span class="date" v-text="item.date"></span> -->
              </a>
              </databox>
            <el-button class="el-msg" slot="reference">
              <a>
              <icon :type="'tongzhi1'" :size="'1rem'" :color="'#F0FF00'"></icon>
                {{ index+1 }}、{{item.groups[0].name}}:&nbsp;{{item.description}} | 时间: {{item.lastchange*1000 | formatDate}} &nbsp;{{item.hosts[0].host}}              
              <!-- <span class="title" v-text="item.alarm_name"></span>&nbsp;<span class="date" v-text="item.date"></span> -->
              </a>
            </el-button>
          </el-popover>
           
          </li>
        </ul>
      </vueSeamlessScroll>
      <!-- <el-dialog :visible.sync="dialogTableVisible" :modal-append-to-body='false' :show-close='false'>
        <databox
          :title="'最新消息'"
          :dheight="260"
          :icon="'account'"
          >
        </databox>
      </el-dialog> -->
    </div>
  </div>
</template>

<script >
import icon from "../icon"
import vueSeamlessScroll from 'vue-seamless-scroll'
import databox from '../databox'
import {get_info_alarm} from '@/api/bigData/getZbInfo.js'
import {post_token} from '@/api/bigData/getZbToken.js'

import {formatDate} from '@/utils/datefmt.js'
import newmsg from '../../../assets/data/newmsg.json'

export default {
  name:"message",
  filters: {
      formatDate(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
  },
  components:{
    icon,
    vueSeamlessScroll,
    databox,

  },
  props: {
    // data: Array
  },
  data() {
    return {
      listData: [],
      dialogTableVisible: false,
      // req_alarm_data:{
      //     "jsonrpc": "2.0",
      //     "method": "trigger.get",
      //     "params": {
        
      //         "output": [
      //                 "triggerid", 
      //                 "description",
      //                 "status",
      //                 "value",
      //                 "priority",
      //                 "lastchange",
      //                 "recovery_mode",
      //                 "hosts",
      //                 "state"
      //         ],
      //         "selectHosts":"hosts",
      //         "sortfield": "lastchange",
      //         "sortorder": "DESC",
      //         "min_severity": 4,
      //         "skipDependent": 1,
      //         "expandDescription": 6,
      //         "selectHosts": ['host'],
      //         "selectGroups": ['name'],
      //         "only_true": 1,
      //         "filter": {
      //                 "value": 1,
      //                 "status": 0
      //                 },
      //     },
      //     "auth": this.$store.zabbixToken,
      //     "id": 1
      //  },
    };
  },
  computed: {
     optionSingleHeightTime () {
        return {
                singleHeight: 26,
                waitTime: 2000,    
            }
      },
               
  },
  beforecreate(){
      
  },
  created () {
    this.getZbAlarm() 
  },
  methods:{
    // getZbToken(){
    //    post_token().then(
    //      res=>{
    //         this.$store.zabbixToken=JSON.parse(res.data.message)
    //      }
    //    )
    //   },
    getZbAlarm(){       
       get_info_alarm().then(
         res=>{
            this.listData=res.data.message
         }
       )
      },
  },
  mounted () {
      // setInterval(() => {
      //   this.getZbAlarm()   
      //   console.log('updatealarm')
      // }, 100000); 

  },
  
}
</script>

<!-- 覆盖element的样式 -->
<style lang="scss">
   .el-popover{
     color: #fff;
     background: rgba(25, 75, 140, 0.603);
     border: none;
     .a-msg{
       margin-top: 10px;
       size: 30px;
     }

 }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.messege-box {
  width: 100%;
  height: 100%;
  padding: 15px 15px 25px 15px;
  overflow: hidden;
  .messege-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 4px;
    .seamless-warp {
        height: 229px;
        overflow: hidden;
        ul {
      width: 100%;
      height: 100%;
      position: relative;
      transition: margin-top 0.5s;

      li {
        width: 100%;
        height: 1/6 * 100%;
        padding-bottom: 5px;
        overflow: hidden;
        margin: auto 0;
       .el-msg{
           width: 100%;
          height: 40px;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #d3d3d3;
          text-decoration: none;
          background: rgba(216, 191, 216, 0.1);
          border-radius: 2px;
          padding-left: 30px;
          position: relative;
          font-size: 1rem;
          line-height: 1.3rem;
          border: none;
          a {
         
          // &:before {
          //   position: absolute;
          //   box-sizing: border-box;
          //   margin-left: -22px;
          //   display: block;
          //   height: 100%;
          //   content: "◆";
          //   font-size: 0.9rem;
          //   color: #eb8a00;
          // }
          i {
            padding-right: 8px;
          }
        }
       }
      }
    }
    }
  }
}
</style>
