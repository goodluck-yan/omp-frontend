<template>
    <ve-pie style="margin-top:20px" :settings="chartSettings" :data="starData" :extend="extend" :height="'250px'"></ve-pie>
</template>

<script>
export default {
    name:'piechart',
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
                // 调整图例区的位置，单位(数字，百分比，center/left位置)
                left:15,
                // 图例的宽度，不够会换行
                width:2,
                color: "#fff",
                // 是否可以点击，隐藏点击的内容
                selectedMode:true,
                textStyle: { 
                color: "#fff",
                fontSize:15
                },
            },
            xAxis : {
							
							axisLabel:{
							     interval:0,//横轴信息全部显示
							     rotate:-30,//-30度角倾斜显示
							},
							axisLine:{
		                        lineStyle:{
		                            color:'#fff',
		                            width:1,//这里是为了突出显示加上的
		                        }
		                    }
						},
						yAxis : {
							
							splitLine: {
							    lineStyle: {
							        // 使用深浅的间隔色
							        color: ['#fff']
							    }
							},
							nameTextStyle: {
								color: ['#fff']
								},
							axisLine:{
		                        lineStyle:{
		                            color:'#fff',
		                            width:1,//这里是为了突出显示加上的
		                        }
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
      {'name':'AWS','num':3},
      {'name':'阿里云','num':5},
      {'name':'华为云','num':16},
      {'name':'腾讯云','num':9},
      {'name':'谷歌云','num':2}

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