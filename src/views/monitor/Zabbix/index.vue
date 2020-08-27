<template>
  <div style="height:100%;overflow: hidden;">
    <topnav></topnav>
    <iframe  name="ifm1"  frameborder="0" scrolling="auto">
      <form  ref="form"  action="http://192.168.9.47/zabbix/index.php" method="POST" target="ifm1" >
        <input type="text" name='name' value="admin"/>
        <input type="text" name='password' value="zabbix"/>
        <input type="text" name='autologin' value="1"/>
        <input type="text" name='enter' value="登录"/>
        <!-- <input type="submit" onclick="submitForm()" value="提交"/> -->

      </form>
    </iframe>
  </div>

</template>



<script>
import topnav from '@/components/charts/topnav/index.vue'

export default {
    name: 'Zabbix',
    
    created() {

    },
    mounted() {

      this.$refs.form.submit();
    },
    components:{
      topnav,
    }
}
</script>

<style lang="scss" scoped>

  iframe{
    width: 100%;
    height: 100%;
  }


  form{
    display: none;
  }
</style>