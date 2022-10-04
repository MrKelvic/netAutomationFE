
<template>
  <div class="wrapper center-grid">
    <loadingcomponent :properties="{show:true,paused:!userInter.serverCom}"/>
    <h2 class="int-head" >Sign In</h2>
    <div class="login-form">
      <form @submit="authLogin" method="post">
        <div>
          <label for="email">Email address</label>
          <input v-model="userInputs.loginCreds.email" type="email" placeholder="user@cbg.com.gh" id="email">
        </div>
          <div>
          <label for="password">Password</label>
          <input v-model="userInputs.loginCreds.password" type="password" placeholder="8 string char" id="password">
        </div>
        <button :disabled="userInter.serverCom||!userInputs.loginCreds.password||!userInputs.loginCreds.email">Log In</button>
        <p class="error"></p>
      </form>
    </div>
  </div>
</template>

<script>
// imports goes here
import login from '@/auths/userAuth';
import loadingcomponent from '@/components/loadingcomponent/loadingcomponent.vue'
export default {
  name: 'loginroute',
  props:[],
  components: {
    loadingcomponent
  },
  computed:{

  },
  data(){
    return{
      userInputs:{
        loginCreds:{
          email:"false@gmail.com"||null,
          password:"jnkjnjkgrejnkjnjk"||null
        }
      },
      userInter:{
        err:false,
        serverCom:false
      }
    }
  },
  methods:{
    async authLogin($event){
      $event.preventDefault()
      // console.log(login)
      if(this.userInter.serverCom) return 0;
      this.userInter.serverCom=true
      let response=await login.login(this.userInputs.loginCreds)
      /* rerout to root and there we decide if the token is valid */
      if(response.passed) this.$router.push({name:"root"})
      else{
        this.userInter.err="Invalid credentials"
        setTimeout(()=>{
          this.userInter.err=null
        })
      }
      // console.log(response)
      this.userInter.serverCom=false                               
    }
  },
  mounted(){
    // console.log()
    // console.log(login,signUp)
  },
  watch:{

  }
}
</script>
<style scoped>
.wrapper{
  background:var(--secondary);
  width:100%;
  height:100vh;
}
.int-head{
  font-size:1.8em;
  margin:.9em 0em;
}
.login-form{
  padding:10px;
}
form>div{

}
form>div>label{
  display:block;
  margin-bottom:4px;
  color:var(--color-grey);
}
form>div>input{
  padding:8px 6px;
  margin-bottom:20px;
  min-width:260px;
  border:1px solid var(--grey);
  border-radius:4px;
}
form>button{
  width:100%;
  border-radius:4px;
  padding:10px 0px;
  background:var(--action);
  color:var(--floor);
}
</style>
