
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
  max-width: 1280px;
  margin-right: auto;
  margin-left: auto;
  height:100vh;
  display:grid;
  grid-template-columns:minmax(var(--palette-width), 15%) minmax(auto,100%);
  /* grid-template-columns: repeat(2, minmax(min(10rem, 100%), 1fr)); */
}
.palette{
  background:var(--background);
}
.__view__{
  /* background:var(--background); */
  /* background:grey; */
  /* border:1px solid white; */
  padding:0px 10px;
  padding-top:20px;
  height: 100vh;
  overflow: auto;
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
