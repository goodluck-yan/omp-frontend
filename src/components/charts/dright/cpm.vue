<template>
  <div id="app">
     <ve-liquidfill class="liquidfill" :data="chartData" :settings="chartSettings"></ve-liquidfill>
  </div>
</template>

<script>
var cpmData={pm:[
    {     
        pmName: 'CPU',
        percent: 0.9
    }, {
        pmName: '内存',
        percent: 0.3
    }, {
        pmName: '磁盘',
        percent: 0.7
    }
]}
var colordata=[]
export default {
  name: 'cpm',
  created () {
      // console.log(cpmData.pm[1].percent)
      // console.log(this.changeColor(cpmData.pm[1].percent))
              
  },
   data () {
    this.chartSettings = {
    //   wave: [[0.9, 0.6], [0.9, 0.5], [0.9, 0.6]],
      seriesMap: [
        {
          color: this.changeColor(cpmData.pm[0].percent),
        // color:['red'],
          label: {
            formatter (options) {
              const {
                seriesName,
                data: {
                  value
                }
              } = options
              return `${seriesName}\n${value*100}%`
            },
            fontSize: 20
          },
          center: ['20%', '25%'],
          radius: '30%',
          waveAnimation: true
        },
        {
        //   color: ['red', 'yellow','green'],
          color:this.changeColor(cpmData.pm[1].percent),
          label: {
            formatter (options) {
              return `${options.seriesName}\n${options.data.value*100}%`
            },
            fontSize: 20
          },
          center: ['50%', '25%'],
          radius: '30%'
        },
        {
        //   color: ['red', 'yellow','green'],
          color:this.changeColor(cpmData.pm[2].percent),

          label: {
              formatter (options) {
              return `${options.seriesName}\n${options.data.value*100}%`
            },
            fontSize: 20
          },
          center: ['80%', '25%'],	
          radius: '30%',
          waveAnimation: true
        }
      ]
    }
    return {
      chartData: {
        columns: ['pmName', 'percent'],
        rows: cpmData.pm
      }
    }
  },
  methods: {
      changeColor(pmdata){
          if(pmdata>=0.9){
              colordata=['red'];
          }else if(0.6<pmdata && pmdata<0.9) {
              colordata=['yellow'];       
          }else if(pmdata<=0.6){
              colordata=['green'];
          }
        return colordata; 
      }
  }
}
</script>

<style lang="scss" scoped>

</style>