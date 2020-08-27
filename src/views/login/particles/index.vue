<template>
    <vue-particles
      color="#6495ED"
      :particleOpacity="0.8"
      :particlesNumber="70"
      shapeType="circle"
      :particleSize="4"
      linesColor="#6495ED"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.6"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
</template>

<script>
// import Vue from "vue";

export default {
  name: "particles"
};
</script>

<style>


</style>
