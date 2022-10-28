
<template>
    <div>
      <div>
        <div>
          <!-- v-model:current="current" -->
          <a-steps :current="current">
            <a-step class="step" title="Action">
              <template #icon>
                <code-outlined />
              </template>
            </a-step>
            <a-step class="step" title="Targets">
              <template #icon>
                <fullscreen-exit-outlined />
              </template>
            </a-step>
            <a-step class="step"  title="Output">
              <template #icon>
                <profile-outlined />
              </template>
            </a-step>
          </a-steps>
          <div>
            <div v-if="(current+1)!=steps.length" class="steps-content">
                <component @value="updateAction" @disabledNext="disabledTheNext=true" v-if="steps[current].component" :is="steps[current].component" :content="payload" :keepAlive="keepAlive"></component>
            </div>
            <div v-else style="margin:30px 0px;">
              <div style="margin:30px 0px;" v-if="keepAlive.commandslist">
                <p style="font-size:16px;margin:0px;"><span>{{keepAlive.commandslist.dis.title}}</span> <i :class="`fa-solid `+keepAlive.commandslist.dis.icon"></i></p>
                <div v-for="p in payload.params" :key="p.label">
                  <div v-if="isarray(p.fin)">
                    <a-tag style="margin:4px 0px;margin-right:10px;" color="blue" v-for="v in p.fin" :key="v">{{v}}</a-tag>
                  </div>
                  <div v-else>
                    <a-tag style="margin:4px 0px;margin-right:10px;" color="blue">{{p.fin}}</a-tag>
                  </div>
                </div>
              </div>
              <div v-if="keepAlive.targetlist">
                <p style="font-size:16px;margin:0px;">Devices ({{keepAlive.targetlist.length}})</p>
                <a-tag style="margin:4px 0px;margin-right:10px;" color="blue" v-for="v in keepAlive.targetlist" :key="v.hostname">{{v.hostname}}</a-tag>
              </div>
              <div style="width:100%;display:grid;place-items:center;place-contents:center;height:50px;margin-top:30px;">
                  <a-button class="ui_btn" size="large" @click="automate">
                    <span style="margin-right:10px;">Run Automation</span>
                    <i class="fa-solid fa-robot"></i>
                  </a-button>
              </div>
            </div>
            <div class="steps-action">
              <a-button type="link" size="small" :disabled="!(current > 0)" @click="next(-1)">Previous</a-button>
              <a-button v-if="(current+1)!=steps.length" type="link" size="small" style="margin-left:12px" :disabled="!(current < steps.length - 1)||disabledTheNext" @click="next(1)">Next</a-button>
              <!-- <a-button v-if="current == steps.length - 1" type="primary" >Done</a-button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
// imports goes here
import commandslist from '@/components/commandslist/commandslist.vue'
import targetlist from '@/components/targetlist/targetlist.vue'
// const targetlist=()=>import('@/components/targetlist/targetlist.vue')
import {
  CodeOutlined,
  FullscreenExitOutlined,
  // LoadingOutlined,
  ProfileOutlined,
} from '@ant-design/icons-vue';
export default {
  name: 'commands',
  props:[],
  components: {
    CodeOutlined,
    FullscreenExitOutlined,
    // LoadingOutlined,
    ProfileOutlined,
    // ACTIONs
    commandslist,
    targetlist
  },
  computed:{

  },
  data(){
    return{
      keepAlive:{
        commandslist:null,
        targetlist:null
      },
      disabledTheNext:true,
      // keepAlive:{ "commandslist": { "action": "ping", "dis": { "title": "ping probe", "icon": "fa-tower-broadcast" }, "params": [ { "label": "Target IP", "value": "192.168.122.1", "valeFn": null, "fnKey": "rawString", "fin": "192.168.122.1" }, { "label": "Ping source", "value": null, "validate": null, "fnKey": "rawString", "fin": null }, { "label": "Ping count", "value": 3, "fnKey": "rawNumber", "fin": 3 } ] }, "targetlist": [ { "key": "hubsw", "hostname": "hubsw", "decription": "", "deviceType": "switch", "IP": { "ip": "192.168.122.167", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "spoke1", "hostname": "spoke1", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.207", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF1", "hostname": "OSPF1", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.230", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF2", "hostname": "OSPF2", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.125", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF3", "hostname": "OSPF3", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.59", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF4", "hostname": "OSPF4", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.13", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrp1", "hostname": "eigrp1", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.198", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF5", "hostname": "OSPF5", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.94", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrpsw", "hostname": "eigrpsw", "decription": "", "deviceType": "switch", "IP": { "ip": "192.168.122.219", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrp2", "hostname": "eigrp2", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.118", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrp3", "hostname": "eigrp3", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.183", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" } ] },
      // payload:{ "action": "get", "engineFn": "ping", "params": [ { "label": "Target IP", "value": "192.168.122.1", "valeFn": null, "fnKey": "rawString", "fin": "192.168.122.1" }, { "label": "Ping source", "value": null, "validate": null, "fnKey": "rawString", "fin": null }, { "label": "Ping count", "value": 3, "fnKey": "rawNumber", "fin": 3 } ], "nodes": [ { "key": "hubsw", "hostname": "hubsw", "decription": "", "deviceType": "switch", "IP": { "ip": "192.168.122.167", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "spoke1", "hostname": "spoke1", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.207", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF1", "hostname": "OSPF1", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.230", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF2", "hostname": "OSPF2", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.125", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF3", "hostname": "OSPF3", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.59", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF4", "hostname": "OSPF4", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.13", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrp1", "hostname": "eigrp1", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.198", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "OSPF5", "hostname": "OSPF5", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.94", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrpsw", "hostname": "eigrpsw", "decription": "", "deviceType": "switch", "IP": { "ip": "192.168.122.219", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrp2", "hostname": "eigrp2", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.118", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" }, { "key": "eigrp3", "hostname": "eigrp3", "decription": "", "deviceType": "router", "IP": { "ip": "192.168.122.183", "mask": "255.255.255.0" }, "Name": null, "OS": "ios" } ] },

      payload:{
        action:"get"
      },
      current:0,
      steps: [
        {
          title: 'Action',
          component:"commandslist"
        },
        {
          title: 'Targets',
          component:"targetlist"
        },
        {
          title: 'Summary',
          content: 'Last-content',
        },
      ],
    }
  },
  methods:{
    isarray(l){
      return Array.isArray(l)
    },
    next(value){
      this.current+=value
    },
    updateAction(item){
      this.payload=item.data
      this.keepAlive[item.keepAlive.target]=item.keepAlive.value
      this.disabledTheNext=false
      // console.log(this.payload," update")
    },
    automate(){
      this.$store.dispatch('setAutomatePayload',this.payload)
      // console.log(this.$store.state.application.automatePayload)
      this.$router.push({name:'auto'})
    }
  },
  mounted(){
    // console.log(this.payload)
  },
  watch:{

  }
}
</script>
<style scoped>
.steps-action{
  margin-top:20px;
}
.steps-action button{
  background:var(--button-background);
  color: var(--secondary) !important;
}
.step{
  color: var(--secondary) !important;
}
</style>
