<template>
	<div class="layout">
		<div class="theme-navbar-container navbar-container ">
			<navbar></navbar>
		</div>
		<div class="main-container">
			<div class="left theme-layout-left" id="left">
				<sidebar></sidebar>
			</div>
			<div class="right">
        <div class="breadcrumb">
          <span>当前位置：</span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="(item,index) in breadList" :key="index">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

				<!-- <div style="whith:100%;flex:1;margin-top:5px;display:flex"> -->
					<router-view></router-view>
				<!-- </div> -->

				
			</div>
			<div></div>
		</div>
		
	</div>

</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
	import Navbar from './Navbar.vue'
	import Sidebar from './Sidebar.vue'

	export default {
		name: 'Layout',

		data(){
			return{
        breadList:[]//路由集合
      }
    },
    watch:{
      $route(){
        this.getBreadcrumb();
      }
    },

    computed: {
      ...mapGetters(['menuList',])
    },

		components: {
			Navbar,
			Sidebar,

		},

    created(){
      this.setLeftActiveIndex('1');
    },

		mounted(){
      this.getBreadcrumb();
		},
    
    

		methods: {
      ...mapMutations({
        setLeftActiveIndex: 'SET_LEFT_ACTIVE_INDEX',
      }),


      
      getMenuId(menuList,routePath){
        for (let key in menuList){//通过最后的路由url，找出路由对应的菜单id，进行选中。
          if ( menuList[key].route_uri === routePath){
            this.setLeftActiveIndex(menuList[key].id.toString());
            return true;
          }

          if (typeof(menuList[key].children) != "undefined"){
            let rep = this.getMenuId(menuList[key].children,routePath);
            if (rep){
              return true;
            }
          }
          console.log(menuList[key].route_uri);
        }

        return false;
      },


		getBreadcrumb(){//在设置面包屑位置的时候，同时获取选中的菜单id
        let matched = this.$route.matched;//获取路由嵌套列表

        // if( matched[0].name === '主页布局' ){//如果是主页布局，直接替换成主页
        //   matched = [{name: "主页"}]
        // }

        this.breadList = matched;
        let routePath = matched[matched.length -1].path
        // console.log(matched,path)
        if( routePath === '/layout/home'){//如果是主页，则没有选中的菜单

          this.breadList = [{name: "主页"}]//指定面包屑默认为"主页"
          this.setLeftActiveIndex('')
          // console.log(path)
        }else{
                  // console.log(path,this.menuList,this.topActiveIndex)
                  // console.log(22222,this.menuList)
          this.breadList = matched;
          // for (let key in this.menuList){//通过最后的路由url，找出路由对应的菜单id，进行选中。
          //   // console.log(this.menuList[key].route_uri,path)
          //   if ( this.menuList[key].route_uri === path){
          //     this.setLeftActiveIndex(this.menuList[key].id.toString());
          //     break;
          //   }
          // }


          this.getMenuId(this.menuList,routePath)
        }
 

      }
		},
	}
</script>

//style lang="scss">
// 	html,body {
// 		height: 100%;
// 		width: 100%;
// 	}
// 	body {
// 	    // background: #edf2f6;
// 	    overflow: hidden;
// 	}
// </style>

<style lang="scss" scoped>
	// @import "src/styles/mixin.scss";
	.layout {
		height: 100%;
		width: 100%;
		min-width: 1000px;
		min-height: 600px;
		overflow: auto;


		.navbar-container {
			height: 55px;
			position: fixed;
			top: 0;
			// left: 0;
			// margin-right: 0px;
			// margin-left: 0px;
			width: 100%;
			// min-width: 1260px;
			z-index: 910;
			line-height: 55px;
			background-color:#252a2f ;
		}
		.main-container {
			height: 100%;
			width: 100%;
			// display: flex;
			// position: relative;
			padding-top: 55px;

			.left {
				z-index: 910;
				position: fixed;
				top: 55px;
				bottom: 0px;
				// height: 100%;
				overflow-x: hidden;
				overflow-y: auto;
				width: 190px;
				// background-color:#252a2f ;
				background-color:#545c64 ;
				// transition: all .28s ease-out;
				// flex: 0 0 190px;
				// border-color: #e4e7eb;
			}
			.right {
				overflow: hidden;
				height: 100%;
				width: 100%;
				// flex: 1;
				// padding-left: 20px;
				padding-left: 210px;
				padding-top: 0px;
				padding-right: 20px;
				padding-bottom: 0px;
				display: flex;
        flex-direction: column;
        

        .breadcrumb{
          height:34px;
          line-height: 34px;
          background-color: #f4f4f4;
          margin-bottom: 6px;
          span{
            float:left;
            font-weight: bold;
          }
        }
        .breadcrumb /deep/ .el-breadcrumb{
          float: left;
          height: 34px;
          line-height: 34px;
        }


			}
		}
	}


</style>
