
<template>
    <div>
      <h2>{{trigger}}</h2>
      <div>
        {{this.changesList}}
      </div>
      <br>
      <br>
      <a-button type="link" @click="digestChanges">
        <span style="margin-right:10px;">Add route</span>
        <i class="fa-solid fa-plus"></i>
      </a-button>
    </div>
</template>

<script>
import engine from '@/service/engine';
// imports goes here
export default {
  name: 'changesview',
  props:['changesList','trigger','device'],
  components: {

  },
  computed:{

  },
  data(){
    return{

    }
  },
  methods:{
    async digestChanges(){
      console.log(this.changesList)
      const req= await engine.digestChanges({node:this.device,code:this.changesList})
      console.log(req)
    }
  },
  mounted(){
  },
  watch:{
    'trigger':function(e){
      console.log("triggerd ",e)
      // this.digestChanges()
    }
  }
}
</script>
<style scoped>

</style>
