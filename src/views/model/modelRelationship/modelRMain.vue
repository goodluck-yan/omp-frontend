<template>
  <div 
    class="relation-container" 
    v-loading="loading">
    <div id="treeContainer"></div>
  </div>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { getModelRelationTree } from '@/api/model.js'
	import { mapType } from '@/utils/config.js'
	import { deepClone } from '@/utils/index.js'
	import echarts from 'echarts'
  import 'echarts/lib/chart/tree'

  let myChart

	export default {
	  data () {
	    return {
	     	treeObj: {},
	     	nodeCount: 0, // 统计节点的个数,
	     	loading: false,
	     	green:'#66dc6b',
	     	blue: '#5cadff'
	    }
	  },
	  computed: {
      ...mapGetters([
        'isCollapse',
        'skin'
      ])
    },
	  mounted () {
	  	let self = this
	  	this.initMyChart()
	  	// myChart = echarts.init(document.getElementById('treeContainer'))
      // if (myChart) {
      //   window.onresize = function () {
      //     self.initMyChart()
      //     myChart.resize()
      //   }
      // }
	    this._getModelRelationTree()
	  },
	  methods:{
	   	_getModelRelationTree () {
	   		let obj = {
	   			method: 'get',
	   			layer_id: mapType(this.$route.params.modelManageType)
	   		}
	   		this.loading = true
	   		getModelRelationTree(obj).then(res => {
	   			this.loading = false
	   			if (res.status === 200) {
	   				this.treeObj = res.data
	   				if (this.treeObj.children && this.treeObj.children.length > 0) {
	   					this.nodeCount = this.treeObj.children.length
	   				}
	   				this.doTreeData(this.treeObj)
	   				this.drawTree(this.treeObj)
	   			}
	   		}, err => {
	   			this.loading = false
	   			console.log('error', err)
	   		})
	   	},
	   	// 设置canvas的大小
      initMyChart () {
        let domObj = document.getElementById('treeContainer');
        if(domObj){
        	if (this.isCollapse) {
          	domObj.style.width = (document.body.clientWidth - 72) + 'px';
        	} else {
        		domObj.style.width = (document.body.clientWidth - 245) + 'px';
        	}
          domObj.style.height = (document.body.clientHeight - 200) + 'px';
        }
        myChart = echarts.init(domObj)
      },
      // 构造树图的数据
      doTreeData (obj) {
      	let newObj = obj
      	let has_children = newObj.has_children
      	let children = newObj.children
      	if (has_children) {
      		newObj.itemStyle = {
      			color: this.green
      		}
      		newObj.emphasis = {
      			itemStyle: {
              color: this.green
            }
      		}
      		for (let i in children) {
      			this.doTreeData(children[i])
      		}
      	}
      },
	   	// 绘制树图
	   	drawTree (data) {
	   		let option = {
	   			tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        	},
	        series:[
	        	{
	            type: 'tree',
              data: [data],
              left: '2%',
              right: '2%',
              top: '8%',
              bottom: '20%',
              symbol: 'circle',
              symbolSize: 30,
              orient: 'vertical',
              roam: true,
              initialTreeDepth: 2,
              itemStyle: {
                color: this.blue,
                borderColor: '#e3e8ee'
              },
              expandAndCollapse: true,
              label: {
                normal: {
                  position: 'top',
                  rotate: this.nodeCount > 20 ? -90 : 0,
                  verticalAlign: 'middle',
                  align: this.nodeCount > 20 ? 'right' : 'center',
                  fontSize: 12,
                  color: this.skin === 'dark-theme' ? this.blue : '#303133'
                }
              },
              lineStyle: {
                color: this.blue,
                width: 0.5
              },
              emphasis: {
                itemStyle: {
                  color: '#4082e6'
                }
              },

              leaves: {
                label: {
                  normal: {
                    position: 'bottom',
                    rotate: this.nodeCount > 20 ? -90 : 0,
                    verticalAlign: 'middle',
                    align: this.nodeCount > 20 ? 'right' : 'center'
                  }
                }
              },
              animationDurationUpdate: 750
		        }
	        ]
	   		}
	   		myChart.setOption(option)
	   	}
	  },
	  watch: {
      "isCollapse"(v) {
        let self = this;
        let closeWidth = document.body.clientWidth
        if (v) {
          myChart.resize({width: closeWidth - 72})
        } else {
          myChart.resize({width: closeWidth - 220})
        }
      }
    }
	}
</script>

<style lang='less' scoped>
	.relation-container {
		position: relative;
	}
</style>