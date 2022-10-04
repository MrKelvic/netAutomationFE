
<template>
    <div class="__app__">
      <div class="palette">
        <dashboardpalette/>
      </div>
      <div class="__view__">
        <router-view></router-view>
      </div>
    </div>
</template>

<script>
// imports goes here
import dashboardpalette from '@/components/dashboardpalette/dashboardpalette.vue';
export default {
  name: 'dashboard',
  props:[],
  components: {
    dashboardpalette
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

  },
  watch:{

  }
}
</script>
<style scoped>
.__app__{
  width:100%;
  height:100vh;
  display:grid;
  grid-template-columns:minmax(var(--palette-width),10%) minmax(auto,90%);
  /* grid-template-columns: repeat(2, minmax(min(10rem, 100%), 1fr)); */
}
/* .palette{
  } */
.__view__{
  background:var(--secondary);
  /* background:red; */
  padding: 10px 10px;
}

/* media */
/* @media only screen and (max-width:1250px){
  .__app__{
    grid-template-columns:minmax(122px,11%) minmax(auto,89%);
  }
}
@media only screen and (max-width:930px){
  .__app__{
    grid-template-columns:minmax(122px,11%) minmax(auto,89%);
  }
  
}
@media only screen and (max-width:760px){
  .__app__ {
      grid-template-columns: minmax(83px,11%) minmax(auto,89%);
  }
}
@media only screen and (max-width:480px){

} */
</style>
