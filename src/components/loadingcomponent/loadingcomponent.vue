
<template>
    <div class="loader">
      <div :style="(()=>properties.paused?'animation-play-state:paused;':'animation-play-state:running;')()" class="__inner__ one"></div>
      <div :style="(()=>properties.paused?'animation-play-state:paused;':'animation-play-state:running;')()" class="__inner__ two"></div>
      <div :style="(()=>properties.paused?'animation-play-state:paused;':'animation-play-state:running;')()" class="__inner__ three"></div>
    </div>
</template>

<script>
// imports goes here
export default {
  name: 'loadingcomponent',
  props:{
    properties:Object
  },
  components: {

  },
  computed:{

  },
  data(){
    return{
     
    }
  },
  methods:{

  },
  mounted(){
    
  }
}
</script>
<style scoped>
.loader {
  /* position: absolute; */
  top: calc(50% - 32px);
  left: calc(50% - 32px);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  perspective: 800px;
}

.__inner__ {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;  
}
.__inner__.one {
  left: 0%;
  top: 0%;
  animation: rotate-one 1s linear infinite;
  border-bottom: 3px solid var(--theme);
}

.__inner__.two {
  right: 0%;
  top: 0%;
  animation: rotate-two 1s linear infinite;
  border-right: 3px solid var(--theme);
}

.__inner__.three {
  right: 0%;
  bottom: 0%;
  animation: rotate-three 1s linear infinite;
  border-top: 3px solid var(--theme);
}

@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>
