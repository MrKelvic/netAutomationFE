<template>
    <div>
      <div class="dashboard">
      <div class="dash-cont">
        <!-- <div class="user_det">
          <div class="user-cont">
            <div class="user-img center-flex">
              <h2 style="font-size:3.2em;">KT</h2>
            </div>
            <p class="user-name">Kelvin Tester</p>
            <p style="color:var(--theme);margin-top:5px;">Shiashie</p>
          </div>
        </div> -->
        <ul class="dash-links">
          <li v-for="route in links" :key="route.n" ><router-link :style="route.s" :to="{name:route.l}"><i :class="`fa ${route.i}`"></i><span>{{route.n}}</span></router-link></li>
        </ul>
      </div>
    </div>
    </div>
</template>

<script>
// imports goes here
import {dashboardLinks} from '@/api/appData';
export default {
  name: 'dashboardpalette',
  props:[],
  components: {
    // loadingcomponent
  },
  computed:{

  },
  data(){
    return{
      collapsed: false,
      links:[]
    }
  },
  methods:{
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
  mounted(){
    // console.log(dashboardLinks)
    this.links=dashboardLinks
  },
  watch:{

  }
}
</script>
<style scoped>
.dashboard{
  width:100%;
  height:100vh;
}
.dash-cont{
  z-index:2;
  width:100%;
  height:100%;
  padding:20px 0px;
  display:grid;
  place-items:center;
  height: 100vh;
}
.user_det{
  display:grid;
  place-items:center;
}
.user-cont{
  text-align:center;
}
.user-img{
  width:110px;
  height:110px;
  margin-bottom:10px;
  border-radius:50%;
  border:1px solid var(--flat-grey);
  /* background:red; */
}
.user-img>img{
  width:100%;
  height:100%;
}
.user-name{

}
.dash-links{
  margin:10px auto;
  width:90%;
}
.dash-links>li{
  margin:15px 0px;
}
.dash-links a{
  padding:5px 10px;
  display:flex;
  border-radius:5px;
  color:#8a8b8a;
  font-size: 1.1em;
  place-items:center;
}
.dash-links a:hover{
  background:var(--selected-hover);
  cursor: pointer;
}
.dash-links a>span{
  margin-left:10px;
}
.dash-links a>i{
  font-size:1.1em;
  display:inline-block;
  margin-right:6px;
}
.route-cont{

}
.route-cont>div{
  padding:30px;
  min-height:90vh;
}
/* media */

</style>
