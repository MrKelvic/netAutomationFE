
<template>
    <div class="center-grid" style="height:100vh;width:100%;">
      <loadingcomponent :properties="{show:true,paused:false}"/>
    </div>
</template>

<script>
// imports goes here
/* move to login or dashboard this component handles that */
import loadingcomponent from '@/components/loadingcomponent/loadingcomponent.vue';
import login from '@/auths/userAuth';
export default {
  name: 'root',
  props:[],
  components: {
    loadingcomponent
  },
  computed:{

  },
  data(){
    return{

    }
  },
  methods:{
    processAuth(params){
      /* Check why this page was called */
      /* Called on a refresh */
        console.log(params)
      if(params.refreshed&&this.checksession(true)){
        try {
          let v=params.back.split("^")
          console.log(v)
          v[1]=JSON.parse(v[1])
          if(v[1])  this.$router.push({name:v[0],params:v[1]})
          else this.$router.push({name:v[0]})
        } catch (error) {
          console.error(error)
        }
      }else{
        // was just called to auth
        this.checksession()
      }
    },
    async checksession(goBackToPrevRoute){
      let req=await login.checkSession();
      // console.log(req," session check")
      // if passed route previous route or to dashboard
      // else to login
      if(req.passed) return goBackToPrevRoute || this.$router.push({name:"dashboard"});
      else this.$router.push({name:"login"});
      // console.log(req)
  // login.checkSession()
    }
  },
  mounted(){
    this.processAuth(this.$route.params)
  },
  watch:{

  }
}
</script>
<style scoped>

</style>
