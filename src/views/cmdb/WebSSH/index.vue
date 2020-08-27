<template>
  <div class="container">
    <my-terminal :terminal="terminal"></my-terminal>
    <!-- <img class="img" src="https://w.wallhaven.cc/full/vg/wallhaven-vg3wm5.jpg"/> -->
    <topnav class="topnav"></topnav>

  </div>
</template>

<script>
import Console from './Console'
import topnav from '@/components/charts/topnav/index.vue'

export default {
  name: 'WebSSH',
  data () {
    return {
      terminal: {
        pid: 1,
        name: 'terminal',
        cols: 600,
        rows: 400
      }
    }
  },
  components: {
    'my-terminal': Console,
    topnav
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.topnav{
    position: fixed;
    right: 10px;
}
</style>
