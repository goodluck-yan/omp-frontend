<template>
	<!-- <div id="app" :class="skin"> -->
	<div id="app" >
		<router-view></router-view>
	</div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default{
  	name: 'APP',
    computed: {
      ...mapGetters([
        'skin'
      ])
    }
  }
</script>

<style scoped>
  #app{
  	height: 100%;
    width: 100%;
  }
</style>
