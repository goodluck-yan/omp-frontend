<template>
<div style="height:100%">
    <topnav class="topnav"></topnav>
    <iframe  name="ifm1"  frameborder="0" scrolling="auto" src="http://139.9.76.19:18899/web/#/main">
      
    </iframe>
</div>

</template>

<script>
import topnav from '@/components/charts/topnav/index.vue'

export default {
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
.topnav{
    position:fixed;
    top: 40px;  
}

</style>