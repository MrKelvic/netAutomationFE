
<template>
    <div>
      <div>
        <!-- <p>{{routes}}</p> -->
        <!-- <p>{{content}}</p> -->
        <!-- <p>{{extras}}</p> -->
        <!-- fa-circle-nodes -->
        <div class="routes_wrapper">
          <a-collapse v-model:activeKey="activeKey" :bordered="false">
            <template #expandIcon="{ isActive }">
              <caret-right-outlined :rotate="isActive ? 90 : 0" />
            </template>
            <a-collapse-panel v-for="(protocol,protocolIndex) in routes" :key="protocol.protocol" :header="protocol.protocol">
              <template #extra>
                <div class="topinfo">
                  <span :style="`color:green;margin-left:5px;`">
                      <i v-if="protocol.protocol=='static'" class="fa-solid fa-right-left"></i>
                      <i v-else class="fa-solid fa-circle-nodes"></i>
                  </span>
                </div>
              </template>
              <div>
                <!-- <p>{{protocol}}</p> -->
                <div v-if="protocol.protocol=='ospf'">
                  <a-button class="ui_btn" @click="AddRouteProcess(protocolIndex,'ospf')" type="link" title="Add new OSPF process">
                    <span style="margin-right:10px;">Add OSPF process</span>
                    <i class="fa-solid fa-plus"></i>
                  </a-button>
                  <div class="modals">
                    <!-- ADD OSPF NETWORK -->
                    <a-modal v-model:visible="cols.ospf.formData.show" 
                      :centered="true" :destroyOnClose="true" 
                      :closable="false" :maskClosable="false"
                      @ok="addDynamicRoute(null,null,true,null,null,'ospf')"
                      @cancel="cancelAdd('ospf')" title="Add Network to OSPF process">
                      <a-form layout="vertical" :model="cols.ospf.formData.data">
                        <a-form-item :colon="false" label="Area">
                          <a-input v-model:value="cols.ospf.formData.data.area" />
                        </a-form-item>
                         <a-form-item :colon="false" label="Network">
                          <a-input v-model:value="cols.ospf.formData.data.network" />
                        </a-form-item>
                         <a-form-item :colon="false" label="Wildcard">
                          <a-input v-model:value="cols.ospf.formData.data.wildcard" />
                        </a-form-item>
                      </a-form>
                    </a-modal>
                  </div>
                  <div class="pid_process" v-for="(routeProcess,processID) in  protocol.routes" :key="routeProcess.pid">
                    <div>
                       <div class="addProccess">
                            <span style="margin-right:5px;color:var(--g-color);">Process ID <span style="color:green;font-weight:bold;margin-left:4px;">{{routeProcess.pid}}</span></span>
                      </div>
                      <div v-if="routeProcess.passive" class="passiveIntCls passiveIntClsRed">
                        <p>Passive Interfaces</p>
                        <a-select v-model:value="routeProcess.passive" 
                         :options="extras.listedInterfaces.filter(e=>!routeProcess.noPassive.includes(e)).map(e=>({value:e}))" 
                         mode="tags" style="width: 100%" placeholder="" option-label-prop="label"></a-select>
                      </div>
                      <div v-if="routeProcess.noPassive" class="passiveIntCls passiveIntClsGreen">
                        <p>Allowed OSPF Interfaces</p>
                         <a-select v-model:value="routeProcess.noPassive"
                         :options="extras.listedInterfaces.filter(e=>!routeProcess.passive.includes(e)).map(e=>({value:e}))" 
                         mode="tags" style="width: 100%" placeholder="" option-label-prop="label"></a-select>
                      </div>
                    </div>
                    <div class="networks">
                      <a-table :pagination="{ pageSize:10,size:'small',showSizeChanger:false }" size="small" :columns="cols.ospf.network" :dataSource="routeProcess.network"> 
                        <template #footer>
                          <div class="addProccessFoot">
                             <a-button class="ui_btn" type="link" @click="addDynamicRoute(protocolIndex,processID,null,null,null,'ospf')">
                              <span style="margin-right:10px;">Add route</span>
                              <i class="fa-solid fa-plus"></i>
                            </a-button>
                          </div>
                        </template>
                        <template #edit="{ record }">
                          <span>
                            <a-button @click="addDynamicRoute(protocolIndex,processID,record,false,true,'ospf')" type="link">
                              <i class="fa-solid fa-edit"></i>
                            </a-button>
                          </span>
                        </template>
                        <template #delete="{ record }">
                          <span>
                              <a-popconfirm @confirm="removeRoute(protocolIndex,processID,record)"  title="Are you sure you want to remove network on next commit?" okText="yes">
                                <template #icon><question-circle-outlined style="color: red" /></template>
                                <a href="#" style="color:#ff4d4f;">
                                  <i class="fa-regular fa-trash-can"></i>
                                </a>
                              </a-popconfirm>
                          </span>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>
                <div v-else-if="protocol.protocol=='eigrp'">
                  <div>
                    <div>
                      <div v-if="cols.eigrp.formData.isAddingAs" class="passiveIntCls">
                          <p>AS Number</p>
                          <div>
                            <a-input v-model:value="cols.eigrp.formData.asn" size="small" placeholder="Enter AS number" style="width:100px;" />
                            <a-button class="ui_btn" style="margin-left:5px;" @click="AddRouteProcess(protocolIndex,'eigrp')" type="link">
                              save
                            </a-button>
                          </div>
                      </div>
                      <a-button class="ui_btn" v-else @click="cols.eigrp.formData.isAddingAs=true" type="link">
                        <span style="margin-right:10px;">Add EIRGP ASN</span>
                        <i class="fa-solid fa-plus"></i>
                      </a-button>
                    </div>
                    <div class="modals">
                    <!-- ADD EIRGP -->
                    <a-modal v-model:visible="cols.eigrp.formData.show" 
                      :centered="true" :destroyOnClose="true" 
                      :closable="false" :maskClosable="false"
                      @ok="addDynamicRoute(null,null,true,null,null,'eigrp')"
                      @cancel="cancelAdd('eigrp')" title="Add Network to EIRGP AS">
                      <a-form layout="vertical" :model="cols.eigrp.formData.data">
                         <a-form-item :colon="false" label="Network">
                          <a-input v-model:value="cols.eigrp.formData.data.network" />
                        </a-form-item>
                         <a-form-item :colon="false" label="Wildcard">
                          <a-input v-model:value="cols.eigrp.formData.data.wildcard" />
                        </a-form-item>
                      </a-form>
                    </a-modal>
                  </div>
                  </div>
                  <div class="pid_process" v-for="(routeProcess,processID) in  protocol.routes" :key="routeProcess.pid">
                    <div class="networks">
                      <div class="addProccess">
                        <span style="color:var(--g-color);margin-right:5px;">ASN <span style="color:green;font-weight:bold;">{{routeProcess.asn}}</span></span>
                      </div>
                      <a-table :pagination="{ pageSize:10,size:'small',showSizeChanger:false }" size="small" :columns="cols.eigrp.network" :dataSource="routeProcess.network">
                        <template #title>
                        </template>
                        <template #footer>
                          <div class="addProccessFoot">
                             <a-button class="ui_btn" type="link" @click="addDynamicRoute(protocolIndex,processID,null,null,null,'eigrp')">
                              <span style="margin-right:10px;">Add route</span>
                              <i class="fa-solid fa-plus"></i>
                            </a-button>
                          </div>
                        </template>
                        <template #edit="{ record }">
                          <span>
                            <a-button @click="addDynamicRoute(protocolIndex,processID,record,false,true,'eigrp')" type="link">
                              <i class="fa-solid fa-edit"></i>
                            </a-button>
                          </span>
                        </template>
                        <template #delete="{ record }">
                          <span>
                            <a-popconfirm @confirm="removeRoute(protocolIndex,processID,record)"  title="Are you sure you wante to remove network on next commit?" okText="yes">
                              <template #icon><question-circle-outlined style="color: red" /></template>
                              <a href="#" style="color:#ff4d4f;">
                                <i class="fa-regular fa-trash-can"></i>
                              </a>
                            </a-popconfirm>
                          </span>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>
                <div v-else-if="protocol.protocol=='static'">
                  <div class="pid_process" v-for="routeProcess in  protocol.routes" :key="routeProcess.pid">
                    <div class="modals">
                      <!-- ADD STATIC ROUTE -->
                      <a-modal v-model:visible="cols.static.formData.show" 
                        :centered="true" :destroyOnClose="true" 
                        :closable="false" :maskClosable="false"
                        @ok="editStaticRoute('add',null,protocolIndex)"
                        @cancel="editStaticRoute('show');cols.static.formData.show=false" title="Add static route">
                        <a-form layout="vertical" :model="cols.static.formData.data">
                          <a-form-item :colon="false" label="Network">
                            <a-input v-model:value="cols.static.formData.data.network" />
                          </a-form-item>
                          <a-form-item :colon="false" label="Mask">
                            <a-input v-model:value="cols.static.formData.data.mask" />
                          </a-form-item>
                          <a-form-item :colon="false" label="Next Hop">
                            <a-input v-model:value="cols.static.formData.data.next_hop" />
                          </a-form-item>
                          <a-form-item :colon="false" label="Admin Distance">
                            <a-input v-model:value="cols.static.formData.data.AD" />
                          </a-form-item>
                        </a-form>
                      </a-modal>
                    </div>
                    <div class="networks">
                      <a-table :pagination="{ pageSize:10,size:'small',showSizeChanger:false }" size="small" :columns="cols.static.network" :dataSource="routeProcess.route">
                        <template #footer>
                          <div class="addProccessFoot">
                             <a-button class="ui_btn" type="link" @click="editStaticRoute('show')">
                              <span style="margin-right:10px;">Add route</span>
                              <i class="fa-solid fa-plus"></i>
                            </a-button>
                          </div>
                        </template>
                        <template #edit="{ record }">
                          <span>
                            <a-button @click="editStaticRoute('show',record,protocolIndex)" type="link">
                              <i class="fa-solid fa-edit"></i>
                            </a-button>
                          </span>
                        </template>
                        <template #delete="{ record }">
                          <span>
                            <a-popconfirm @confirm="editStaticRoute('remove',record,protocolIndex)"  title="Are you sure you wante to remove network on next commit?" okText="yes">
                              <template #icon><question-circle-outlined style="color: red" /></template>
                              <a href="#" style="color:#ff4d4f;">
                                <i class="fa-regular fa-trash-can"></i>
                              </a>
                            </a-popconfirm>
                          </span>
                        </template>
                      </a-table>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p>{{ protocol.routes }}</p>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <!-- <p>{{content}}</p> -->
      </div>
    </div>
</template>

<script>
// import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
// imports goes here
import { v4 as uuid } from 'uuid';
import {
  CaretRightOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
export default {
  name: 'routesview',
  props:['content','deviceType','extras'],
  components: {
    CaretRightOutlined,
    QuestionCircleOutlined
  },
  computed:{

  },
  data(){
    return{
      text:'..........',
      activeKey:['ospf','eigrp','static'],
      routes:[],
      compareCache:[],
      cols:{
        ospf:{
          network:[
            {
              title:"network",
              dataIndex:"network",
              key:"network",
            },
            {
              title:"wildcard",
              dataIndex:"wildcard",
              key:"wildcard",
            },
            {
              title:"area",
              dataIndex:"area",
              key:"area",
            },
            {title:" ",dataIndex:"edit",key:"edit",slots: { customRender:"edit"}},
            {title:" ",dataIndex:"delete",key:"delete",slots: { customRender:"delete"}},
          ],
          formData:{
            clone:null,
            show:false,
            isEdit:false,
            pointer:[],
            data:{
              area:null,
              network:null,
              wildcard:null,
            }
          }
        },
        eigrp:{
          network:[
            {
              title:"network",
              dataIndex:"network",
              key:"network",
            },
            {
              title:"wildcard",
              dataIndex:"wildcard",
              key:"wildcard",
            },
            {title:" ",dataIndex:"edit",key:"edit",slots: { customRender:"edit"}},
            {title:" ",dataIndex:"delete",key:"delete",slots: { customRender:"delete"}},
          ],
          formData:{
            clone:null,
            isAddingAs:false,
            asn:null,
            show:false,
            isEdit:false,
            pointer:[],
            data:{
              network:null,
              wildcard:null,
            }
          }
        },
        static:{
          network:[
            {
              title:"network",
              dataIndex:"network",
              key:"network",
            },
            {
              title:"mask",
              dataIndex:"mask",
              key:"mask",
            },
            {
              title:"Next hop",
              dataIndex:"next_hop",
              key:"next_hop",
            },
            {
              title:"Admin Distance",
              dataIndex:"AD",
              key:"AD",
            },
            {title:" ",dataIndex:"edit",key:"edit",slots: { customRender:"edit"}},
            {title:" ",dataIndex:"delete",key:"delete",slots: { customRender:"delete"}},
          ],
          formData:{
            clone:null,
            isAddingAs:false,
            show:false,
            isEdit:false,
            pointer:[],
            data:{
              network:null,
              mask:null,
              next_hop:null,
              AD:1,
            }
          }
        }
      },
      changes:{
          added:[],
          removed:[],
          changed:[]
      }
    }
  },
  methods:{
    routesToLinear(){
      console.clear()
      // console.log(this.content)
      this.compareCache=[] 
      this.routes=[]
      for(let protocol in this.content){
        let obj={
          protocol:protocol,
          routes:this.content[protocol]
        }
        this.routes.push(obj)
        this.compareCache.push(JSON.parse(JSON.stringify(obj)))
      }
      // console.log(this.routes)
    },
    emitChange(){
      this.$emit("changeEvent",{target:'routes',value:this.changes})
    },
    editStaticRoute(action,data,index){
      if(action=='show'){
        this.cols.static.formData.show=!this.cols.static.formData.show
        if(this.cols.static.formData.show&&!data){
        if(this.cols.static.formData.pointer.length){
          this.routes[this.cols.static.formData.pointer[0]].routes[0].route[this.cols.static.formData.pointer[1]]=this.cols.static.formData.clone
        }
          // adding New init
          this.cols.static.formData.data={network:null,mask:null,next_hop:null,AD:1}
          this.cols.static.formData.pointer=[]
        }else if(this.cols.static.formData.show&&data){
          const pointerIndex=this.routes[index].routes[0].route.findIndex(records=>{
            let found=true
            for(let key in data){
              if(records[key]!=data[key]){
                found=false
                break
              }
            }
            return found
          })
          if(pointerIndex+1){
            this.cols.static.formData.data=data
            this.cols.static.formData.clone=JSON.parse(JSON.stringify(data))
            this.cols.static.formData.pointer=[index,pointerIndex]
            this.cols.static.formData.show=true
          }
        }
      }else if(action=='add'){
        if(this.cols.static.formData.pointer.length){
          // Editing
          //if to be eddited was just added
          const indexChk =this.changes.added.findIndex(e=>
             e.value?.uid==this.routes[index].routes[0].route[this.cols.static.formData.pointer[1]]?.uid)
          if(indexChk!=-1){
            //then replace what is at added's index
            console.log("Item was found in added List :: ",indexChk," ",this.changes.added[indexChk])
            this.changes.added[indexChk]=this.cols.static.formData.data
          }else{
            // this is an actual change then check if item already exists in changed array? then replace it else push
            const indexAlt =this.changes.changed.findIndex(e=>
              e.value?.uid==this.routes[index].routes[0].route[this.cols.static.formData.pointer[1]]?.uid)
              let nObj={
                  key:'static',
                  value:this.cols.static.formData.data,
                  old:this.compareCache[index].routes[0].route[this.cols.static.formData.pointer[1]]
                }
            if(indexAlt!=-1){
              console.log("Item was found in changed List :: ",indexAlt," ",this.changes.changed[indexAlt])
              this.changes.changed[indexAlt]=nObj
            }else{
              console.log("Item was not found in List :: PUSHED")
              this.changes.changed.push(nObj)
            }
          }

          this.routes[index].routes[0].route[this.cols.static.formData.pointer[1]]=this.cols.static.formData.data
          // console.log(this.changes)
          this.emitChange()
          // DONE_COMP_DIFF
        }else{
          let obj={...this.cols.static.formData.data,uid:uuid()}
          this.routes[index].routes[0].route.push(obj)
          this.changes.added.push({
            key:'static',value:obj
          })
          // console.log(this.changes)
          this.emitChange()
          // DONE_COMP_DIFF
        }
        // console.log(this.routes[index].routes[0].route)
        this.editStaticRoute('show')
      }else if(action=='remove'){
        this.routes[index].routes[0].route=this.routes[index].routes[0].route.filter(records=>records.uid!=data.uid)
        // if found in changes.added then remove else just add to removed
        const indexChk =this.changes.added.findIndex(e=>e.value?.uid==data?.uid)
        if(indexChk!=-1){
          this.changes.added=this.changes.added.filter(e=>e.value?.uid!=data?.uid)
        }else{
          this.changes.changed=this.changes.changed.filter(e=>e.value?.uid!=data?.uid)
          let originalFromCache=this.compareCache[index].routes[0].route.find(e=>e.uid==data.uid)
          this.changes.removed.push({
            key:'static',value:originalFromCache||data
          })
        }
        // console.log(this.changes)
        this.emitChange()
        // DONE_COMP_DIFF
      }
    },
    // DYNAMIC ROUTES
    removeRoute(protocolIndex,processID,record){
      this.routes[protocolIndex].routes[processID].network=this.routes[protocolIndex].routes[processID].network.filter(records=>records?.uid!=record?.uid)
      // if found in changes.added then remove else just add to removed
      const indexChk =this.changes.added.findIndex(e=>e.value?.uid==record?.uid)
      if(indexChk!=-1){
        this.changes.added=this.changes.added.filter(e=>e.value?.uid!=record?.uid)
      }else{
        this.changes.changed=this.changes.changed.filter(e=>e.value?.uid!=record?.uid)
        let originalFromCache=this.compareCache[protocolIndex].routes[processID].network.find(e=>e.uid==record.uid)
        this.changes.removed.push({
          key:this.routes[protocolIndex].protocol,
          value:{...(originalFromCache||record),pid:this.routes[protocolIndex].routes[processID].pid}
        })
      }
      // console.log(this.changes)
        this.emitChange()
        // DONE_COMP_DIFF
    },
    cancelAdd(proto){
      this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].network[this.cols[proto].formData.pointer[2]]=this.cols[proto].formData.clone
      this.addDynamicRoute(null,null,null,true,null,proto)
    },
    addDynamicRoute(routeIndex,pIdIndex,data,close,isEdit,proto){
      if(isEdit){
        // console.log(data)
        this.cols[proto].formData.isEdit=true
        let endPointer=this.routes[routeIndex].routes[pIdIndex].network.findIndex(records=>{
          let found=true
          for(let key in data){
            if(records[key]!=data[key]){
              found=false
              break
            }
          }
          return found
        })
        this.cols[proto].formData.pointer=[routeIndex,pIdIndex,endPointer]
        this.cols[proto].formData.data=data
        this.cols[proto].formData.clone=JSON.parse(JSON.stringify(data))
        this.cols[proto].formData.show=true
      }
      else if(!data&&!close){
        this.cols[proto].formData.show=true
        this.cols[proto].formData.pointer=[routeIndex,pIdIndex]
      }else if(data&&!close){
        const firstIndex=this.cols[proto].formData.pointer[0]
        const secondIndex=this.cols[proto].formData.pointer[1]
        const thirdIndex=this.cols[proto].formData.pointer[2]
        if(this.cols[proto].formData.isEdit){
          // Edditing
          const protocolNumber={
              ospf:{pid:this.routes[firstIndex].routes[secondIndex].pid},
              eigrp:{asn:this.routes[firstIndex].routes[secondIndex].asn}
            }
          const indexChk =this.changes.added.findIndex(e=>
             e.value?.uid==this.routes[firstIndex].routes[secondIndex].network[thirdIndex]?.uid)
          if(indexChk!=-1){
            //then replace what is at added's index
            console.log("Item was found in added List :: ",indexChk," ",this.changes.added[indexChk])
            this.changes.added[indexChk]={key:this.routes[firstIndex].protocol,value:{...this.cols[proto].formData.data,...(protocolNumber[this.routes[firstIndex].protocol])}}
          }else{
            // this is an actual change then check if item already exists in changed array? then replace it else push
            const indexAlt =this.changes.changed.findIndex(e=>
              e.value?.uid==this.routes[firstIndex].routes[secondIndex].network[thirdIndex]?.uid)
              
              let nObj={
                  key:this.routes[firstIndex].protocol,
                  value:{...this.cols[proto].formData.data,
                    ...(protocolNumber[this.routes[firstIndex].protocol])
                  },
                  old:{...this.compareCache[firstIndex].routes[secondIndex].network[thirdIndex],
                    ...(protocolNumber[this.routes[firstIndex].protocol])
                  }
                }
            if(indexAlt!=-1){
              console.log("Item was found in changed List :: ",indexAlt," ",this.changes.changed[indexAlt])
              this.changes.changed[indexAlt]=nObj
            }else{
              console.log("Item was not found in List :: PUSHED")
              this.changes.changed.push(nObj)
            }
          }
          this.routes[firstIndex].routes[secondIndex].network[thirdIndex]=this.cols[proto].formData.data
          // this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].network[this.cols[proto].formData.pointer[2]]=this.cols[proto].formData.data
          // console.log(this.changes)
          this.emitChange()
          // DONE_COMP_DIFF
        }else{
          // this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].network.push(this.cols[proto].formData.data)
          let obj={...this.cols[proto].formData.data,uid:uuid()}
          this.routes[firstIndex].routes[secondIndex].network.push(obj)
          const protocolNumber={
              ospf:{pid:this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].pid},
              eigrp:{asn:this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].asn}
            }
          this.changes.added.push({
            key:this.routes[this.cols[proto].formData.pointer[0]].protocol,
            value:{...obj,
              ...(protocolNumber[this.routes[this.cols[proto].formData.pointer[0]].protocol])
            }
          })
          // console.log(this.changes)
          this.emitChange()
          // DONE_COMP_DIFF
        }
        this.addDynamicRoute(null,null,null,true,null,proto)
      }else{
        this.cols[proto].formData.show=false
        this.cols[proto].formData.isEdit=false
        this.cols[proto].formData.pointer=[]
        this.cols[proto].formData.data=(proto=="ospf")?{area:null,network:null,wildcard:null}:{network:null,wildcard:null}
      }
    },
    AddRouteProcess(protocolIndex,protocol){
      if(protocol==='ospf'){
        let nextPid=(parseInt(this.routes[protocolIndex]?.routes[this.routes[protocolIndex]?.routes.length-1]?.pid)||this.routes[protocolIndex].routes.length+1)+1
        this.routes[protocolIndex].routes.push({
          pid:nextPid,
          network:[]
        })
      }else if(protocol==='eigrp'){
        // Check if asn exists
        const exists= this.routes[protocolIndex].routes.find(e=>e.asn==this.cols.eigrp.formData.asn)
        if(exists){
          message.error("ASN exists...")
        }else{
          this.routes[protocolIndex].routes.push({
            asn:this.cols.eigrp.formData.asn,
            network:[]
          })
          this.cols.eigrp.formData.isAddingAs=false
          this.cols.eigrp.formData.asn=null
        }
      }
    }
  },
  mounted(){
    this.routesToLinear()
  },
  watch:{

  }
}
</script>
<style scoped>
.addProccessFoot{
  width:100%;
  display:flex;
  place-content:center;
  place-items:center;
}
.passiveIntCls{
  margin:10px 0px;
}
.passiveIntCls>p{
  font-size:0.86em;
  margin:0px;
  margin-bottom:2px;
  color:var(--g-color);
} 
.passiveIntCls>ul{
  display:flex;
  place-items:center;
}
</style>
<style>

.passiveIntClsGreen .ant-select-selection-item{
  color: #389e0d !important;
  /* background: #f6ffed !important;
  border-color: #b7eb8f !important; */
  background: none !important;
  border: none !important;
}
.passiveIntClsRed .ant-select-selection-item{
  color: #cf1322 !important;
  /* background: #fff1f0 !important;
  border-color: #ffa39e !important; */
  background: none !important;
  border: none !important;
}
.routes_wrapper .ant-collapse-header{
  /* background: var(--g-shade-back); */
}
</style>
