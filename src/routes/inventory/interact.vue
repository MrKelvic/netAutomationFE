
<template>
    <div style="background:var(--background);padding:15px;">
      <div>
          <!-- <p>IP 1.1.1.1</p>
          <p>{{device}}</p> -->
      </div>
      <div class="racks_wrapp">
        <div style="display:flex;place-items:center;place-content:center;height:50vh;" v-if="loadingState">
            <a-spin tip="running napalm engine" />
        </div>
        <div v-else>
          <div v-if="device">
            <p>{{changes}}</p>
            <div>
              <div class="topinfo">
                <span style="color:#389e0d;">
                    <i v-if="device.node.deviceType=='switch'" class="fa-solid fa-right-left"></i>
                    <i v-else-if="device.node.deviceType=='router'" class="fa-solid fa-arrows-to-circle"></i>
                    <i v-else class="fa-solid fa-ethernet"></i>
                </span>
                <div>
                  <h2>{{device.node.hostname}}</h2>
                  <p>{{device.node.Name}}</p>
                  <p>{{device.node.OS}} - {{device.node.deviceType}}</p>
                  <p>{{device.node.IP.ip}} / {{device.node.IP.mask}}</p>
                  <p>{{device.node.decription}}</p>
                </div>
              </div>
              <div class="action_btns">
                <!-- <a-button v-if="commitStates.genCode" class="ui_btn" size="small" type="link">
                  View changes
                </a-button> -->
              </div>
            </div>
            <div>
              <!-- SUB ROUTE -->
              <!-- <p>IP 1.1.1.1</p> -->
              <a-tabs v-model:activeKey="current">
                <a-tab-pane v-for="step in steps" :tab="step.title" :key="step.title" :title="step.title">
                  <!-- <p>{{step}}</p> -->
                  <!-- <component :is="routesview" :content="device.state[step.payload]" :deviceType="device.node.deviceType"></component> -->
                  <component :is="step.component" :content="device.state[step.payload]" @changeEvent="storeChange" :extras="getComponentDateDependancies(step.payload)" :deviceType="device.node.deviceType"></component>
                </a-tab-pane>
                <a-tab-pane tab="Changes" key="Changes" title="Changes">
                  <changesview :changesList="changes.values" :trigger="changes.trigger" :device="device"/>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
// imports goes here
// import sitemanagementService from '@/service/sitemanagement';
// import rack from '@/components/rack/rack.vue';
import inventory from '@/service/inventory';
import interfaceview from '@/views/interfaceview/interfaceview.vue'
import policiesview from '@/views/policiesview/policiesview.vue'
import routesview from '@/views/routesview/routesview.vue'
import changesview from '@/views/changesview/changesview.vue'
// import engine from '@/service/engine';
export default {
  name: 'sitemngsubrte',
  props:[],
  components: {
    // rack
    policiesview,
    routesview,
    interfaceview,
    changesview
  },
  computed:{

  },
  data(){
    return{
    current:"Interfaces",
    steps: [
        {
          title: 'Interfaces',
          component:"interfaceview",
          payload:'interfaces',
        },
        {
          title: 'Routes',
          component: 'routesview',
          payload:'routes',
        },
        // {
        //   title: 'Policies',
        //   component:"policiesview",
        //   payload:'policies',
        // },
      ],
      loadingState:false,
      device:null,
      originalDeviceState:null,
      commitStates:{
        genCode:false||true
      },
      changes:{
        trigger:0,
        values:{
          interfaces:[],
          routes:[]
        }
      }
    }
  },
  methods:{
    async fetch_state(ip){
      this.loadingState=true
      let response=await inventory.getState({ip:ip});
      if(response.passed){
        this.device=response.data[0]
        this.originalDeviceState=response.data[0]
        console.log(this.device)
      }
      this.loadingState=false
    },
    getComponentDateDependancies(key){
      if(key=='routes'){
        let availableInterfaces=['default']
         for(let layer in this.device.state.interfaces){
          for(let l2module in this.device.state.interfaces[layer]){
            for(let intFace of this.device.state.interfaces[layer][l2module].members){
              availableInterfaces.push(intFace.fullName)
            }
          }
        }
        return {listedInterfaces:availableInterfaces}
      }
      return {}
    },
    storeChange(event){
      if(this.changes.values[event.target]!=undefined){
        this.changes.trigger+=1
        this.changes.values[event.target]=event.value
        this.commitStates.genCode=true
      }
    }
  },
  mounted(){
    // console.log(this.$router)
    console.log(this.$route.params.ip)
    this.fetch_state(this.$route.params.ip)
  },
  watch:{

  }
}
</script>
<style scoped>
.topinfo{
  display:flex;
  flex-wrap:wrap;
  margin-bottom:10px;
  place-items:center;
  font-size:1.15em;
  /* place-content:center; */
}
.topinfo p,.topinfo h2{
  margin:0px;
}
.topinfo>span{
  margin-right:20px;
  display:inline-block;
  font-size:25px;
  /* border:1px solid; */
  /* border-radius:10px; */
  display:flex;
  place-items:center;
  place-content:center;
  width:60px;
  height:60px;
}
</style>
