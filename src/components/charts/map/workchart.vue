<template>
    <ve-pie style="margin-top:20px" :settings="chartSettings" :data="starData" :extend="extend" :height="'250px'"></ve-pie>
</template>

<script>
export default {
    name:'workchart',
     data() {  
        this.chartSettings = {
                roseType: 'radius',
                label: {
                    show: true,
                    fontSize:12
                },
            }
        this.extend = {
        legend: {
            left:15,
            width:2,
            textStyle: { 
            color: "#fff",
            fontSize:13
            }
        },
        grid: {
            textStyle: {
            color: "#fff",
            }
        },
        series: {
            radius: ["0", "70%"],
            center: ["55%", "60%"]
        }
        };
        return {
            starData: {
                columns: ['hostAdr', 'hostNum'],
                rows: []
            },
        }
  },
  created() {
   var hostdata=[
      {'name':'百驿','num':13},
      {'name':'资产管理','num':5},
      {'name':'cmdb','num':16},
      {'name':'定时任务 ','num':9},
      {'name':'作业配置','num':2}

    ]
    let rowdata=[]
    for (var i= 0 ; i< hostdata.length;i++){
        let hostAdr=hostdata[i].name
        let hostNum=hostdata[i].num
        let obj={
          hostAdr:hostAdr,
          hostNum:hostNum
        }
        rowdata.push(obj)
    }
  
    this.starData.rows=rowdata
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>

</style>