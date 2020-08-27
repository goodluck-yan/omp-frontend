<template>
  <ve-line :data="chartData" :settings="chartSettings" :height="'250px'" :width="'400px'" :extend="extend"></ve-line>
</template>

<script>

  export default {
    data () {
      this.chartSettings = {
        stack: { '用户': ['访问用户', '下单用户'] },
        area: true
      }
      this.extend = {
            legend: {
                // 调整图例区的位置，单位(数字，百分比，center/left位置)
                // left:15,
                // 图例的宽度，不够会换行
                // 是否可以点击，隐藏点击的内容
                selectedMode:true,
                textStyle: { 
                color: "#fff",
                fontSize:12
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
        }
      return {
        chartData: {
          columns: ['日期', '访问用户', '下单用户', '下单率'],
          rows: [
            { '日期': '1/1', '访问用户': 1393, '下单用户': 1093, '下单率': 0.32 },
            { '日期': '1/2', '访问用户': 3530, '下单用户': 3230, '下单率': 0.26 },
            { '日期': '1/3', '访问用户': 2923, '下单用户': 2623, '下单率': 0.76 },
            { '日期': '1/4', '访问用户': 1723, '下单用户': 1423, '下单率': 0.49 },
            { '日期': '1/5', '访问用户': 3792, '下单用户': 3492, '下单率': 0.323 },
            { '日期': '1/6', '访问用户': 4593, '下单用户': 4293, '下单率': 0.78 }
          ]
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
   

</style>