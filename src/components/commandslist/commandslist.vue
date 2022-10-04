
<template>
    <div>
      <div>
            <!-- <p>{{commands[0]}}</p> -->
        <div v-if="commands.length" class="actionLi">
          <a-radio-group v-model:value="selected" size="large">
            <a-radio-button class="opt-btn" v-for="cmd in commands" :key="cmd.action" :value="cmd">
              <div class="opt-btn-in">
                <i :class="`fa-solid `+cmd.dis.icon"></i>
                <span>{{cmd.dis.title}}</span>
              </div>
            </a-radio-button>
          </a-radio-group>
        </div>
        <div class="parramsList" v-if="selected">
          <p style="font-size:14px;"><span>{{selected.dis.title}}</span> <i :class="`fa-solid `+selected.dis.icon"></i></p>
          <div>
             <a-form-item v-for="(param,i) in selected.params" :key="param.label" :label="param.label">
                <!-- <p>{{selected}}</p> -->
                <div style="display:flex;place-items:center;">
                  <div>
                    <a-input @input="emitChange()" style="width:200px;" size="small" v-model:value="selected.params[i].value"/>
                  </div>
                  <div>
                    <div style="margin-left:10px;" v-if="finale(i)">
                        <a-tag v-if="!isarray(selected.params[i].fin)" style="margin:0px 2px;" color="green">{{selected.params[i].fin}}</a-tag>
                        <a-tag v-else style="margin:0px 2px;" color="green" v-for="v in selected.params[i].fin" :key="v">{{v}}</a-tag>
                    </div>
                  </div>
               </div>
              </a-form-item>
          </div>
          <a-button size="small" v-if="showSave" style="margin-top:12px" @click="proccessAndUpdate">Save</a-button>
        </div>
      </div>
    </div>
</template>

<script>
// imports goes here
// const ip = require('ip')
import ip from 'ip';
import genFns from '@/api/generalFns';
export default {
  name: 'commandslist',
  props:['content','keepAlive'],
  components: {

  },
  computed:{
    finale(){
      return (index)=>{
        let v=this.selected.params[index].value
        if(this.selected.params[index].validate){
          if(!this.selected.params[index].validate(v)) return null
        }
        // console.log(this.selected.params[index].label,(this.selected.params[index].valeFn?this.selected.params[index].valeFn(v):'None Fn'),v)
        this.selected.params[index].fin=this.selected.params[index].valeFn?this.selected.params[index].valeFn(v):v
        return this.selected.params[index].fin
      }
    }
  },
  data(){
    return{
      selected:null,
      showSave:true,
      commands:[
        this.pingProbe(),
        this.traceroute(),
        this.findRouteTo(),
        this.macTable(),
        this.interfaces(),
        this.cli(),
        this.getConfig(),
      ]
    }
  },
  methods:{
    isarray(it){
      return Array.isArray(it)
    },
    pingProbe(){
      return {
          action:"ping",
          dis:{
            title:"ping probe",
            icon:"fa-tower-broadcast"
          },
          params:[
            {
              label:"Target IP",
              value:"8.8.8.8",
              validate:(value)=>ip.isV4Format(value),
              valeFn:null,
              fnKey:"rawString"
            },
            {
              label:"Ping source",
              value:null,
              validate:null,
              valeFn:genFns.reverseInterface,
              fnKey:"rawString"
            },
            {
              label:"Ping count",
              value:3,
              validate:(value)=>parseInt(value),
              valeFn:(value)=>parseInt(value),
              fnKey:"rawNumber"
            },
          ]
        };
    },
    traceroute(){
      return {
          action:"traceroute",
          dis:{
            title:"Trace route",
            icon:"fa-circle-nodes"
          },
          params:[
            {
              label:"Target IP",
              value:"8.8.8.8",
              validate:(value)=>ip.isV4Format(value),
              valeFn:null,
              fnKey:"rawString"
            }
          ]
        };
    },
    macTable(){
      return {
          action:"macTable",
          dis:{
            title:"Find MAC address",
            icon:"fa-microchip"
          },
          params:[
            {
              label:"MAC address",
              value:null,
              validate:null,
              valeFn:null,
              fnKey:"rawString"
            }
          ]
        };
    },
     interfaces(){
      return {
          action:"interfaces",
          dis:{
            title:"Interface details",
            icon:"fa-ethernet"
          },
          params:[
            {
              label:"Interface",
              value:null,
              validate:null,
              valeFn:genFns.reverseInterface,
              fnKey:"rawString"
            }
          ]
        };
    },
    cli(){
      return {
          action:"cli",
          dis:{
            title:"CLI",
            icon:"fa-terminal"
          },
          params:[
            {
              label:"Commands",
              value:null,
              validate:null,
              valeFn:(e)=>(e||'').split(",").map(e=>e.trim()).filter(e=>e&&e.length>3),
              fnKey:"arrayOfStrings"
            }
          ]
        };
    },
    getConfig(){
      return {
          action:"getConfig",
          dis:{
            title:"Get configuration",
            icon:"fa-file-code"
          },
          params:[]
        };
    },
    findRouteTo(){
      return {
          action:"findRouteTo",
          dis:{
            title:"Find route to",
            icon:"fa-wave-square"
          },
          params:[
            {
              label:"Target IP",
              value:"8.8.8.8",
              validate:(value)=>ip.isV4Format(value),
              valeFn:null,
              fnKey:"rawString"
            }
          ]
        };
    },
    // 
    // 
    // 
    emitChange(){
      this.showSave=true
      this.$emit('disabledNext')
    },
    proccessAndUpdate(){
      let temp=Object.assign({},this.content)
      temp.engineFn=this.selected.action
      temp.action="get"
      temp.params=this.selected.params
      // if(this.selected.params.length==1&&this.isarray(this.selected.params[0].fin)){
      //   temp.params=this.selected.params//[0]//.fin
      // }else{
        // temp.params=this.selected.params//.map(e=>e?.fin||null)//.filter(e=>!e)
        // console.clear()
        // console.log(temp.params)
      // }
      // console.log(temp," temp")
      this.$emit("value",{data:temp,keepAlive:{target:'commandslist',value:this.selected}})
      this.showSave=false
      /* 
        payload={
          nodes:[cl],
          engineFn:"info",
          action:"get",
          params:[]
        }
      */
    }
  },
  mounted(){
    // console.clear()
    if(this.keepAlive?.commandslist){
      this.selected=this.keepAlive?.commandslist
    }
    // console.log(genFns)
    // console.log(ip.address())
  },
  watch:{

  }
}
</script>
<style scoped>
.opt-btn{
  margin-left:20px;
  margin-bottom:20px;
}
.opt-btn-in{
  display:grid;
}
.opt-btn-in>i{
  font-size: 2em;
  margin-top:5px;
  margin-bottom:15px;
}
.parramsList{
  padding: 30px 25px;
  margin-top: 30px;
  background:var(--white);
  width:fit-content;
}
.actionLi{
  margin:30px 0px;
}
</style>
