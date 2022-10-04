<template>
    <div>
      <div v-if="!inFocus">
        <div v-if="done!=nodes.length">
          <div class="actionIndexs">
            <a-tag class="hoveAction" @click="inFocus=v" style="margin:4px 0px;margin-right:10px;" :color="getColor(v.res,v.done,v.incom)" v-for="(v,i) in nodes" :key="i">
              {{v.hostname}} - {{v.IP.ip}}
              <template #icon>
                <sync-outlined v-if="v.incom" :spin="true" />
                <check-circle-outlined v-if="v.done&&v.res" />
                <close-circle-outlined v-if="v.done&&!v.res" />
                 <clock-circle-outlined v-if="!v.done&&!v.res&&!v.com" />
              </template>
            </a-tag>
            <div style="display:block;width:100%;text-align:center;margin:0px;margin-top:5px;">
              <p style="margin:0px;">{{done}} / {{nodes.length}} </p>
              <!-- <a-progress :showInfo="false" :percent="(done/nodes.length)*100" /> -->
            </div>
          </div>
        </div>
        <div v-else>
          <div>
            <outputinterface :data="nodes"/>
          </div>
          <div>
            <a-collapse v-model:activeKey="activeKey" :bordered="false">
                <template #expandIcon="{ isActive }">
                  <caret-right-outlined :rotate="isActive ? 90 : 0" />
                </template>
                <a-collapse-panel v-for="node in nodes" :key="node.hostname" :header="`${node.hostname} - ${node.IP.ip} - ${node.OS}`" :style="`border:none;border-left:2px solid;border-right:2px solid;margin-bottom:10px;border-color:${getColor(node.res,node.done,node.incom)};`">
                  <template #extra>
                      <div class="topinfo">
                        <!-- :style="(()=>{let t=node.deviceType=='router'?`border-radius:90px;`:'';t+=node.res?'color:#389e0d;':'color:red;';return t;})()" -->
                        <span :style="`color:${getColor(node.res,node.done,node.incom)};`">
                            <i v-if="node.deviceType=='switch'" class="fa-solid fa-right-left"></i>
                            <i v-else-if="node.deviceType=='router'" class="fa-solid fa-arrows-to-circle"></i>
                            <i v-else class="fa-solid fa-ethernet"></i>
                        </span>
                      </div>
                  </template>
                  <div>
                    <div>
                      <div class="node_ations">

                      </div>
                    </div>
                    <div class="outputs">
                        <div v-if="node.res">
                          <div v-if="node.res.web">
                            <a-table :pagination="false" size="middle" :dataSource="node.res.web" :columns="tableCols">
                              <template #value="{ record }">
                                <div>
                                  <div v-if="!localIsArray(record.value)" style="background:black;color:white;padding:4px 6px;">
                                    <p style="white-space: pre-wrap;">{{record.value}}</p>
                                  </div>
                                  <div v-else>
                                    <table>
                                        <tr v-for="item in dictArrayToTable(record.value)" :key="item[1]">
                                          <td style="padding:5px;" v-for="v in item" :key="v">
                                            <span v-if="v.style">
                                              <span v-if="localIsArray(v.value)" :style="v.style">{{v.value.join(" , ")}}</span>
                                              <span v-else :style="v.style">{{v.value}}</span>
                                            </span>
                                            <span v-else>{{v}}</span>
                                            <!-- <span v-else>
                                              <span v-if="v.style" :style="v.style">{{v.value}}</span>
                                              <span v-else>{{v}}</span>
                                            </span> -->
                                          </td>
                                        </tr>
                                      </table>
                                  </div>
                                </div>
                              </template>
                            </a-table>
                          </div>
                          <div v-else>
                            <h2>{{node.hostname}}</h2>
                            <p>No Output</p>
                          </div>
                        </div>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
</template>

<script>
// imports goes here
import engine from '@/service/engine';
import genFns from '@/api/generalFns';
import outputinterface from '@/components/outputinterface/outputinterface.vue'
import {
  CaretRightOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue';
export default {
  name: 'auto',
  props:[],
  components: {
    CaretRightOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    outputinterface
  },
  computed:{
    getColor(){
      return (res,done,incom)=>{
        if(incom) return 'orange';
        if(res&&!incom) return 'green';
        if(!res&&done) return 'red';
        if(!res&&!done&&!incom) return 'grey';
        // 
      }
    },
    dictArrayToTable(){
      return (data)=>{        // cons
        if(!data.length) return [];
        let temp=Object.keys(data[0])
        return [temp,...(data.map(e=>{
            return temp.map(ei=>{
              // console.log(ei)
              let styled=["state","connected","active"]//,'protocol_status','link_status']
              if(styled.includes(ei)){
                return {style:`color:${e[ei]?'green':'red'};`,value:e[ei]?'Up':'Down'}
              }
              return {style:`color:#000;`,value:e[ei]||''}
              })
        }))
        ]
        // console.clear()
        // console.log(temp)
      }
    }
  },
  data(){
    return{
      payloads:{
        action:null,
        params:[],
        engineFn:null
      },
      nodes:[],
      done:0,
      inFocus:null,
      activeKey:0,
      tabKey:0,
      tableCols:[
        {
          // title: '-',
          dataIndex: 'title',
        },
        {
          // title: '--',
          dataIndex: 'value',
          slots: { customRender:"value"},
        }
      ]
    }
  },
  methods:{
    localIsArray(l){
      /* 
         - (${((it)=>{ 
                 return it.length?(e):0
                 })(node.res)})`
      */
      return Array.isArray(l)
    },
    setupPayload(){
      this.nodes=this.$route?.params.nodes.map(e=>Object.assign({res:null,done:false,incom:false},JSON.parse(e)))
      this.payloads.action=this.$route?.params.action
      this.payloads.params=this.$route?.params.params.map(e=>{
        let t=Object.assign({},JSON.parse(e))
        return genFns.parseParams[t.fnKey](t.fin)
      })
      if(Array.isArray(this.payloads.params[0])){
        this.payloads.params=this.payloads.params[0]
      }
      this.payloads.engineFn=this.$route?.params.engineFn
      // console.log(this.payloads)
      this.run()
    },

    run(){
      for(let i=0;i<this.nodes.length;++i){
        this.nodes[i].res=this.engineAction(this.nodes[i],i)
      }
    },
    async engineAction(device,index){
      this.nodes[index].incom=true
      try {
        let response= await engine.engineAction({...this.payloads,nodes:[device]})
        if(response.passed){
          if(response.data.length){
            this.nodes[index].res=response.data[0]
          }else{
            this.nodes[index].res=null
          }
          // device.detail=response.data[0].web
        }else{
          this.nodes[index].res=null
        }
      } catch (error) {
        this.nodes[index].res=null
      }
      this.nodes[index].incom=false
      this.nodes[index].done=true
      this.done+=1
      if((this.done)==this.nodes.length){
        this.nodes=this.nodes.sort((a,b)=>(parseInt(b.res?.web[0]?.value?.length)||0)-(parseInt(a.res?.web[0]?.value?.length)||0))
      }
    },
  },
  mounted(){
    console.clear()
    console.log(this.$route.params)
    this.payload=this.$route?.params
    if(!this.$route?.params?.engineFn){
      this.$router.push({name:'commands'})
    }else{
      this.setupPayload()
    }
  },
  watch:{

  }
}
</script>
<style scoped>
table {
  border-collapse: collapse !important;
}

td, th {
  border: 1px solid #e3e3e3 !important;
  padding: 0.5rem;
  text-align: left;
}
.hoveAction:hover{
  cursor:pointer;
}
.actionIndexs{
  height: 96vh;
  display: flex;
  place-content: center;
  place-items: center;
  flex-wrap: wrap;
}
.topinfo{
  display:flex;
  flex-wrap:wrap;
  /* margin-bottom:10px; */
  place-items:center;
  height:fit-content;
  /* place-content:center; */
}
.lildet p{
  margin:0px;
  margin-bottom:4px;
}
.lildet h2{
  margin:0px;
}
.topinfo p{
  margin:0px;
}
.topinfo>span{
  /* margin-right:20px; */
  /* display:inline-block; */
  font-size:15px;
  /* border:1px solid; */
  /* border-radius:10px; */
  display:flex;
  place-items:center;
  place-content:center;
  /* width:50px; */
  /* height:50px; */
}
</style>
