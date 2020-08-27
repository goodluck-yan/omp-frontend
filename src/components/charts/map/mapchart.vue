<template>
  <div class="mapchart">
    
      <!-- <span style="color:#fff;margin:auto">当前选中了: {{ cityName || '-' }}</span> -->
       <ve-map height='520px' :tooltip="chartTooltip" :settings="chartSettings" :geo="chartGeo"  :series="chartSeries" :data="chartData" :events="chartEvents"></ve-map>     
       </div>
</template>

<script>
import 'v-charts/lib/style.css'
import mapadr from '@/assets/data/mapadr.json'
import clock from '../../Clock'
import {mapState,mapMutations,mapAction } from 'vuex'

var ipadr=['无']
var mapName = 'china'
var cityName=[]
var data= [
            {name: '北京',value: ['116.46', '39.92', ['109.16.20.1','109.16.20.2','109.16.20.3','109.16.20.4']]},                   
            {name: '吉林',value: ["125.35","43.88", ['109.16.20.1','109.16.20.2']]},
            { name : "河北", value:[ "114.48","38.03",ipadr]},
            {name : "广东", value:[ "113.23","23.16",['109.16.20.1','109.16.20.2']]},

        ]

export default {
        name:'mapchart',
        components: {
            clock
        },
        data(){
            this.chartEvents = {
            click: (v) => {
            //   this.cityName = v.name+'ip:'+v.value[2]
            this.cityName=[v.name,v.value[2]]

            if(this.cityName){
                this.$bus.$emit('gethostDate',this.cityName )
            }


            // this.setIpadr(this.cityName)
            // console.log('--------------------------------------------------'+this.cityName)


              
            },
             
          }
          return{
            cityName:''
          }
        },
        
        methods: {
           
        },
        computed: {
           ...mapMutations({
                 setIpadr:'SET_IPADR'
            }),    
        },
        created() {
            // 信息显示窗
            this.chartTooltip = {
             padding: 0,
                enterable: true,
                transitionDuration: 1,
                textStyle: {
                    color: '#fff',
                    decoration: 'none',
                },
                // position: function (point, params, dom, rect, size) {
                //   return [point[0], point[1]];
                // },
                formatter: function(params) {
                    // console.log(params)
                    var tipHtml = '';
                    tipHtml = '<div style="width:250px;height:120px;background:rgba(22,80,158,0.8);border:1px solid rgba(7,166,255,0.7)">'
                    +'<div style="width:100%;height:40px;line-height:40px;padding:0 20px">'+'<i style="display:inline-block;width:8px;height:8px;background:#16d6ff;border-radius:40px;">'+'</i>'
                    +'<span style="margin-left:10px;color:#fff;font-size:16px;">'+params.name+'</span>'+'</div>'+'<div style="width:250px;height:2px;background:rgba(7,166,255,0.7);"></div>'
                    +'<div style="padding:20px">'
                    +'<p style="color:#fff;font-size:12px;">'+'<i style="display:inline-block;width:10px;height:10px;background:#16d6ff;border-radius:40px;margin:0 8px">'+'</i>'
                    +'IP地址：'+'<span style="color:#11ee7d;margin:0 6px;">'+params.value[2]+'</span>'+'</p>'
                    +'</div>'+'</div>';
                    // setTimeout(function() {
                    //     tooltipCharts(params.name);
                    // }, 10);
                    return tipHtml;
                }
            }

           
            this.chartData = {
                columns: [],
                rows: []
            }
            this.chartSettings = {
                position: mapName,
                
            }
            this.chartSeries = [{
                name: '散点',
                type: 'scatter', // 'scatter'
                coordinateSystem: 'geo',
                symbolSize: 10,
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                //坐标数据点
                data: mapadr.mapaddress,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fff'
                    }
                }
            },
            {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 0.75, //长宽比
                showLegendSymbol: false, // 存在legend时显示
                label: {
                    normal: {
                        show: true  
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#031525',
                        borderColor: '#3B5077',
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                animation: false,
                data: data
            },
             {
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 6,
        },
        {
            name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: data,
            symbolSize: 10,
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'left',
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    color: 'yellow',
                    shadowBlur: 10,
                    shadowColor: 'yellow'
                }
            },
            zlevel: 1
        },

            ]
            this.chartGeo = {
                show: true,                
                map: mapName,
                label: {
                    normal: {
                        show: false
                    },
                    emphasis: {
                        show: false,
                    }
                },
                //移动缩放
            roam: true,
            itemStyle: {
                    normal: {
                        areaColor: '#023677',
                        borderColor: '#1180c7',
                    },
                    emphasis: {
                        areaColor: '#4499d0',
                    }
                }
            }
        },
        mounted () {
             this.$bus.$emit('gethostDate',['广东',['109.16.20.1','109.16.20.2','109.16.20.2']] )

        },
}
</script>
<style lang="scss" scoped>
.mapchart{
  width: 600px;
  height: 550px;
  margin: 0 auto;
  
}

</style>
