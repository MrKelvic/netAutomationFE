
<template>
    <div>
      <!-- <h2>Trigger count {{trigger}}</h2> -->
      <!-- <p v-if="changes.stateIndex==0">Stagged config</p> -->
      <p v-if="changes.stateIndex==1">Generated configuration</p>
      <p v-else-if="changes.stateIndex==2">Stagged configuration</p>
      <div>
        <div class="genConfig">
          <div class="configs">
            <ul v-if="changes.stateIndex==1">
              <li v-for="gen in changes.generated" :key="gen.data" class="flex_line">
                <span><i :class="`fa-solid fa-${gen.state=='gen'?'robot':'angle-right'}`"></i></span>
                <p :style="`color:${gen.color};`">{{gen.data}}</p>
              </li>
            </ul>
            <ul v-else-if="changes.stateIndex==2">
              <li v-for="gen in changes.stagged" :key="gen" class="flex_line">
                <span><i class="fa-solid fa-angle-right"></i></span>
                <p>{{gen}}</p>
              </li>
            </ul>
          </div>
          <a-button v-if="changes.stateIndex==0" class="ui_btn" type="link" @click="digestChanges">
            <span style="margin-right:10px;">Generate config</span>
            <i class="fa-solid fa-robot"></i>
          </a-button>
          <a-button v-else-if="changes.stateIndex==1" class="ui_btn" type="link" @click="StageConfig(null)">
            <span style="margin-right:10px;">Stage config</span>
            <i class="fa-solid fa-terminal"></i>
          </a-button>
          <a-button v-else-if="changes.stateIndex==2" class="ui_btn" style="margin-right:20px;" type="link" @click="StageConfig(null)">
            <span style="margin-right:10px;">Push config</span>
            <i class="fa-solid fa-save"></i>
          </a-button>
          <a-button v-if="changes.stateIndex==2" class="ui_btn" type="link" danger @click="StageConfig('discard')">
            <span style="margin-right:10px;">Discard stagged config</span>
            <i class="fa-solid fa-save"></i>
          </a-button>
        </div>
      </div>
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
      states:['gen','stage','push'],
      changes:{
        stateIndex:0,
        generated:[],
        stagged:[]
      }
    }
  },
  methods:{
    async digestChanges(){
      const req= await engine.digestChanges({node:this.device,code:this.changesList})
      if(req?.data){
        this.changes.generated=req.data.map(e=>({...e,state:this.states[0]}))
        this.changes.stateIndex=1
      }
    },
    async StageConfig(action){
      const req= await engine.engineAction({nodes:[this.device?.node],params:[action||this.states[this.changes.stateIndex],this.changes.generated],engineFn:'stageOrPush'})
      // console.log(req.data)
      if(req?.data){
        console.log(req.data[0]?.web[0]?.value[0])
        this.changes.stagged=req.data[0]?.web[0]?.value[0]?.split('\n')||[]
        this.changes.stateIndex+=1
      }
    }
  },
  mounted(){
  },
  watch:{
    'trigger':function(){
      this.changes.stateIndex=0
      // console.log("triggerd ",e)
      // this.digestChanges()
    }
  }
}
</script>
<style scoped>

.flex_line{
  display:flex;
  margin: 3px 0px;
}
.flex_line p{
  margin:1px 0px;
  background:#14171c;
  padding: 0px 15px;
  border-radius: 3px;
  width:-webkit-fill-available;
  width:100%;
}
.flex_line>span{
  margin-right:20px;
  font-size:0.9em;
}
</style>
