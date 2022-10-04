<template>
  <router-view/>
</template>
<script>
import 'ant-design-vue/dist/antd.css';
import sessions from '@/service/session'
export default {
  name: 'app',
  methods:{
    wasReload(){
    return ((window.performance.navigation && window.performance.navigation.type === 1) ||window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload'))
    },
    rootAuth(){
      // auth and bounce back to prev route or go to dashboard
      if(this.wasReload()){
        this.$router.push({name:"root",params:{refreshed:true,back:sessions.get("history")}})
      }else{
        this.$router.push({name:"root"})
      }
    }

  },
  mounted(){
    window.addEventListener("beforeunload",()=>{
      // let noCache=["auto"]
      let noCache=[]
      let t=!noCache.includes(this.$route.name)?JSON.stringify(this.$route.params||{}):JSON.stringify({})
      if(this.$route.name!="root") sessions.add(
        ["history",this.$route.name?
        `${this.$route.name}^${t}`:""
        ]
        )// store route before refresh
    })
    this.rootAuth()
  },
}
</script>

<style>

:root{
  --primary:#000;
  /* --secondary:#fff; */
  --secondary:#f5f7fb;
  /* #f5f7fb */
  --theme:#1b4a43;
  --theme-bright:#40a092;
  --bold-font:-apple-system,BlinkMacSystemFont,Avenir,"Helvetica Neue","Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  /* --color:#000; */
  --color:#3c4043;
  --error:#a70b0b;
  --floor:#f1f1f1;
  --white:#fff;
  /* #f9f9fb #fafafa #f9f9fb */
  --flat-grey:#8e8e8e45;
  --color-grey:#3b3c3b;
  --action:rgb(14,175,82);
  /* #878a87  #3b3c3b*/
  --grey:#dadce0;
  --palette-width:150px;
  /* --palette-width:270px; */
  /* G */
  --g-color:#5f6368;
  --g-shade-back:#f1f3f4;
  --g-deep-shadow:0px 1px 14px 0px rgb(60 64 67 / 30%), 0px 1px 3px 1px rgb(60 64 67 / 15%);
}
.g-l{
  border-radius: 8px;
  border: 1px solid #dadce0;
  box-sizing: border-box;
}
*{
  margin:0px;
  padding:0px;
  font-family:var(--bold-font);
  scroll-behavior:smooth;
  transition:all 0.1s linear;
}
/* .router-link-active{
  background:var(--theme-bright);
  color:var(--secondary);
} */
.router-link-exact-active,.router-link-active{
  /* background:#dde3e2; */
  background:var(--secondary);
  color:#000 !important;
}
body,#app{
  background:var(--secondary);
  min-height:100vh;
  min-width:100%;
  font-size:12px;
  color:var(--color);
}
a{
  text-decoration:none;
  color:inherit;
}
ul,li{
  list-style:none;
}
button{
  border:none;
  padding:4px;
}
button:hover{
  cursor:pointer;
}
/* custom classes */
.img-fit{
  width:100%;
  height:100%;
}
.center-flex{
  display:flex;
  place-content:center;
  justify-content:center;
  align-content:center;
  justify-items:center;
  align-items:center;
}
.center-grid{
  display:grid;
  place-content:center;
  justify-content:center;
  align-content:center;
  justify-items:center;
  align-items:center;
}
@media only screen and (max-width:1250px){

}
@media only screen and (max-width:930px){
  
}
@media only screen and (max-width:760px){

}
@media only screen and (max-width:480px){

}
/* OVERIDES */
.ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td {
    padding: 8px 10px!important;
}
.ant-table-pagination.ant-pagination{
  margin:9px 0px !important;
}
.ant-table.ant-table-small {
    font-size: 12px !important;
}
.ant-radio-group-large .ant-radio-button-wrapper {
    height: fit-content !important;
    font-size: 13px !important;
    padding: 10px !important;
    text-align: center !important;
    width: 200px !important;
    line-height:unset;
}
.ant-form-item-label > label{
  font-size: 12px !important;
}
</style>
