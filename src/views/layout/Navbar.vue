<template>
  <div class="navbar ">
    <div class="head-left">
      <div class="logo" v-show="!isCollapse">
        <img src="../../assets/head_images/logo32-1.png" />
        <span>运维管理平台</span>
      </div>
    </div>

    <div class="head-center">
      <div class="collapse" @click="toggleCollapse" :class="{'collapse-rotate': isCollapse}">
        <!-- <i class="fa fa-bars" aria-hidden="true"></i> -->
        <i class="el-icon-s-fold" ></i>
      </div>
      <div class="icon-left" @click.stop="menuLeftMove" ><i class="el-icon-caret-left"></i></div>
      <div  class="head-menu" ref="headMenu">
        <el-menu
          :default-active="topActiveIndex"
          :unique-opened="true"
          :router="true"
          class="el-menu-demo" 
          mode="horizontal" 
          background-color="transparent"
          text-color="#fff"
          @select="handleSelect"
          active-text-color="rgb(245, 165, 20)">
          
          <el-menu-item  v-for="(item , i) in userinfo.menu" v-bind:key="item.id" v-bind:index="i.toString()" route="/layout/home"  >{{item.permission_name}}</el-menu-item>   
        </el-menu>
      </div>
      <div class="icon-right" @click.stop="menuRightMove" ><i class="el-icon-caret-right"></i></div>
    </div>


    <div class="user-info fr">
      <div class="user-li navbar-item-hover" >
        <el-dropdown trigger="click" @command="getCommand">
          <div class="el-dropdown-link">
            <a href="javascript:void(0)">
              <span style="font-size: 20px;"><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
              <span class="user-name">{{userinfo.account}}</span>
              <span><i class="fa fa-caret-down" aria-hidden="true"></i></span>
            </a>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="skin">
              <i class="fa fa-adjust" aria-hidden="true"></i>
              <span>换肤</span>
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              <i class="fa fa-sign-out" aria-hidden="true"></i> 
              <span>退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
    </div>
  </div>
</template>
    
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { logout } from '@/api/logout.js';
  // import { get_head_menu } from '@/api/sysManage.js';
  export default {
    name: 'Navbar',
    computed: {
      ...mapGetters([
        'userinfo',
        'menuList',
        'topActiveIndex',
      ])
    },
    data() {
      return {
        // activeIndex: '0',
        isCollapse: false,//是否显示左侧菜单栏
        isToggleClass: false,//是否切换整体样式
        // menuItem: [{id:1,group_name:'系统管理',order_num:'2',route_uri:"sysmanage"},{id:2,group_name:'数据库管理',order_num:'1',route_uri:"dbmanage"}]
        // menuItem: [],

      }
    },
    created() {
      // this.get_head_menu()
      

      //this.handleSelect('0',0)//初始化侧边栏数据
    },
    mounted(){
      // console.log(this.$refs['headMenu'])
      window.onresize = () =>{//通过监听窗口变化事件，动态调整导航菜单的显示宽度
        let headMenu = this.$refs['headMenu'];//父方框标签
        let elMenu = this.$refs['headMenu'].getElementsByTagName("ul")[0];//子菜单标签

        let headMenuWidth = headMenu.offsetWidth;//获取父标签的宽度
        let elMenuWidth = elMenu.offsetWidth;//获取子标签的宽度

        let  leftDistance=headMenu.offsetLeft - elMenu.offsetLeft;   //获取子菜单标签，在父标签中，向左移动的距离

        if (elMenuWidth - leftDistance < headMenuWidth && elMenuWidth> headMenuWidth){//如果子标签要显示的宽度，小于父标签的宽度，且子标签的宽度，大于父标签的宽度
          elMenu.style.left=(headMenuWidth - elMenuWidth).toString() + 'px';//

          // if((-leftDistance + 100) > 0){//如果子向右标签移动的距离，大于初始位置，那么将子标签的left设置为0px
          //   elMenu.style.left = '0px';
          // }
        }else if (elMenuWidth<= headMenuWidth){
          elMenu.style.left='0px';
        }     
      }



    },
    methods: {
      handleSelect(key, keyPath) {
        if (this.userinfo.hasOwnProperty('account')){//判断是否存在用户账号数据
          this.setTopActiveIndex(key)
          // console.log(key,this.topActiveIndex)
          this.setMenuList(this.userinfo.menu[key].children)//获取选中模块下的菜单数据

        }else{
          this.$router.push({path: '/login'})
        }

        // console.log(key, keyPath,this.menuList);
      },
      toggleCollapse () {
        this.isCollapse = !this.isCollapse
        let left = document.getElementById("left")
        let right = document.getElementsByClassName("right")[0]
        // let logo = document.getElementsByClassName("logo")
        if (left) {
          if (this.isCollapse) {
            // left.style.flex = '0 0 0px'
            left.style.display = 'none';
            right.style.paddingLeft = '20px';
            // logo[0].style.display= 'none'
          } else {
            // left.style.flex = '0 0 190px'
            left.style.display = 'block'
            right.style.paddingLeft =  '210px';
            // logo[0].style.display= 'block'
          }
        }




        this.setCollapse(this.isCollapse)
      },
      isShowItem (list, f){
        if(list && list.length === 0) return
        if (list && list.length !== 0) {
          for (let i = 0; i < list.length; i++) {
            let item = list[i];
            item.style.display = f ? "none" : 'block';
          }
        }
      },
      getCommand (command) {
        if (command === 'skin') { // 换肤
          let className = '';
          this.isToggleClass = ! this.isToggleClass;
          className = this.isToggleClass ? 'dark-theme' : 'light-theme';
          this.setSkin(className); 
        } else if (command === 'logout'){ // 退出
          
          logout().then(
            res=>{
              let a={};
              this.$router.push({path: '/login'});
              this.setUserInfo(a);
              this.setMenuList([]);
              },
            err => {
              self.$message({
                  message: '系统忙，请稍后再试！',
                  type: 'warning'
                })
              console.log('error',err)
            }
          )
          this.$router.push({path: '/login'})
        }
      },
      ...mapMutations({
        setCollapse : 'SET_COLLAPSE',
        setSkin : 'SET_SKIN',
        setMenuList: 'SET_MENU_LIST',
        setUserInfo: 'SET_USER_INFO',
        setTopActiveIndex: 'SET_TOP_ACTIVE_INDEX',
      }),
      // get_head_menu(){
      //   get_head_menu().then(
      //     res=>{
      //       if (res.status == 200){
      //         this.menuItem=res.data.message
      //         this.activeIndex = this.menuItem[0].id.toString()//指定默认选中的头部菜单
      //         console.log(this.menuItem)
      //       }
      //     }
      //   )
      // }


      menuLeftMove(){
        // console.log(this.$refs['headMenu'].offsetWidth,this.$refs['headMenu'].getElementsByTagName("ul")[0].offsetWidth) 

        let headMenu = this.$refs['headMenu'];//父方框标签
        let elMenu = this.$refs['headMenu'].getElementsByTagName("ul")[0];//子菜单标签

        let headMenuWidth = headMenu.offsetWidth;//获取父标签的宽度
        let elMenuWidth = elMenu.offsetWidth;//获取子标签的宽度

        let  leftDistance=headMenu.offsetLeft - elMenu.offsetLeft;   //获取子菜单标签，在父标签中，向左移动的距离

        if ((elMenuWidth - leftDistance) > headMenuWidth){//如果子标签的宽度，减去向左移动的距离，大于父标签的宽度，可以进行相对位移
          elMenu.style.left='-' + (leftDistance + 100).toString() + 'px';//每次向左移动100px

          if((elMenuWidth - leftDistance - 100) < headMenuWidth){//如果子标签的宽度，减去向左移动的距离，小于父标签的宽度，往右移动一段距离，保证占满宽度
            elMenu.style.left = '-' + (elMenuWidth - headMenuWidth).toString() + 'px';
          }
        }
      },
      menuRightMove(){

        let headMenu = this.$refs['headMenu'];//父方框标签
        let elMenu = this.$refs['headMenu'].getElementsByTagName("ul")[0];//子菜单标签

        let headMenuWidth = headMenu.offsetWidth;//获取父标签的宽度
        let elMenuWidth = elMenu.offsetWidth;//获取子标签的宽度

        let  leftDistance=headMenu.offsetLeft - elMenu.offsetLeft;   //获取子菜单标签，在父标签中，向左移动的距离

        if (leftDistance > 0){//如果子标签向左移动过，那么就向右移动100px
          elMenu.style.left=(-leftDistance + 100).toString() + 'px';//每次向右移动100px

          if((-leftDistance + 100) > 0){//如果子向右标签移动的距离，大于初始位置，那么将子标签的left设置为0px
            elMenu.style.left = '0px';
          }
        }
      },





    },
    watch: {
    //   'headMenuWidth'(newVal,oldVal) {//监听导航栏最外层标签的宽度，保证内部的子标签，能够最大限度的显示出来。
    //     console.log(newVal + ' --- ' + oldVal)
    //   }
    }
  }
</script>

<style type="text/css" lang="scss">
  .navbar {
    .el-dropdown {
      color: #fff;
    }
  }
//     #menu{
//     margin:0 200px;
//     width:500px;
//     height:40px
// }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  // @import "src/styles/mixin.scss";
  .navbar {
    // @include relative;
    padding: 0 0px;
    color: #fff;
    // position: relative;
    height: 100%;
    min-width: 800px;
    display: flex;

    .head-left{
      // background-color: #00c1de;
      height: 100%;
      // width: 190px;
      // position: absolute;
      // left:0;
      // top: 0px;
      // width: 190px;
      // transition: all .28s ease-out;
      .logo {
        display: block;
        width: 190px;
        height: 100%;
        cursor: pointer;
        // font-weight:600;
        font-size: 20px;
        img {
          display: inline-block;
          float: left;
          margin: 12px 3px 12px 6px;
        }
      }

    }


    .head-center{
      overflow: hidden;
      // min-width: 200px; 
      flex: 1;
      display: flex;
      background-color: #545c64; /* 不支持线性的时候显示 */
      background-image: linear-gradient(to right, #545c64 , #252a2f);
      .collapse {
        font-size: 27px;
        transition: all .28s ease-out;
        cursor: pointer;
        // margin-left: 20px;
        width: 40px;
        // height: 40px;
        text-align: center;
        // color: #252a2f;
        line-height: 55px;
        height: 55px;
      }
      .collapse:hover {
        // background-color: #4082e64d;
        // color:#29f2a3
        color:#409EFF
      }
      .collapse-rotate {
        transform: rotate(180deg);
        transition: all .28s ease-out;
      }

      .icon-right,.icon-left{
        font-size: 20px;
        // background-color:#545c64;
        margin: 3px 0px 3px 0px;
        line-height: 48px;
        cursor: pointer;
      }

      .icon-right:hover,.icon-left:hover {
        color:#409EFF
      }

      .head-menu{
        // position: absolute;
        // width:auto;
        // left:190px;
        // right:190px;
        // top: 0px;

        // -moz-box-flex:1.0; /* Firefox */
        // -webkit-box-flex:1.0; /* Safari 和 Chrome */
        // box-flex:1.0;

        flex: 1;
        // padding: 3px 0px 3px 0px;
        margin: 3px 0px 3px 0px;
        // background-color: #29f2a3;
        overflow: hidden;

        border: solid 1px #e6e6e6;
        box-shadow: rgb(240, 243, 245) 0px 0px 10px 0px inset;
        border-radius: 4px;
        line-height: 49px;


        .el-menu--horizontal{
          .el-menu-item{
            // float: left;
            height: 48px;
            line-height: 48px;
            // margin: 0;
          }
        }

      }

      // 强制设置菜单选中时的背景色
      .head-menu /deep/ .el-menu-item.is-active {
        background-color: rgb(67, 74, 80)!important;
      }
      
      //设置导航菜单呈现按钮状。
      .head-menu /deep/ .el-menu-item,.sidebar /deep/ .el-submenu__title {
        box-shadow: rgba(84, 92, 100, 1) -1px 0px 0px 0px inset, rgba(0, 0, 0, 0.3) -2px 0px 0px 0px inset,rgba(84, 92, 100, 1) -3px 0px 0px 0px inset;
      }

      //设置导航菜单的ul标签
      .head-menu /deep/ .el-menu-demo.el-menu--horizontal.el-menu {
        background-color: transparent;
        // border: solid 1px #e6e6e6;
        // box-shadow: rgb(240, 243, 245) 0px 0px 10px 0px inset;
        // border-radius: 4px;
        position: relative;
        transition: all 0.5s ease-out;
        display: inline-block;
        white-space: nowrap;
        height: 47px;
        line-height: 47px;
        left: 0px;
      }

      //设置导航菜单的li标签
      .head-menu /deep/ .el-menu--horizontal>.el-menu-item {
        position: relative;
        float: none;
        // transition: all 0.75s ease-out;
        display: inline-block;
        height: 47px;
        line-height: 47px;
      }
    }



    .user-info {
        // height: 100%;
        // position: absolute;
        width: 190px;
        top: 0px;
        right:0;
        .user-li {
          // position: relative;
          // right:0;
          padding: 0 15px;
          float: right;
          a {
            display: block;
            height: 100%;
            height: 100%;
          }
          .user-name {
            margin: 0 6px;
          }
        }
    }
  }
</style>
