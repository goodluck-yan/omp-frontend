<template>
	<div class="model-content clearfix">
    <div class="model-left fl">
    	<div class="model-left-c">
    		<div class="model-left-content">
					  <side-bar></side-bar>	
    		</div>
    	</div>
    </div>
    <div class="model-right">
      <router-view style="height: 100%"></router-view>
    </div>
	</div>
</template>

<script>
	import SideBar from './sideBar.vue'
	export default {
		components: {
			SideBar
		},
		data () {
	    return {
	    }
	  },
    mounted () {
    },
    methods:{
    }
	}
</script>

<style lang="less" scoped>
.model-content {
  width: 100%;
  height: 100%;
  position: relative;
  .model-left {
    width: 170px;
    height: 100%;
    overflow: hidden;
    border-right: 1px solid #ccc;
    .model-left-c {
      width: 150%;
      padding-right:20px;
      overflow:auto;
      height: 100%;
      .model-left-content {
        height: 100%;
        width: 170px;
        .layer-management {
          margin-bottom: 10px;
          text-align: center;
        }
      }
    }
  }
  .model-right {
    width: auto;
    margin-left: 180px;
    height: 100%;
    overflow: auto;
    overflow-x:hidden;
    &::-webkit-scrollbar {
      width: 0px;
      height: 16px;
    }
  }
}
</style>