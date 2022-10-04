
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
                  <a-button style="padding-left:0px;" @click="AddRouteProcess(protocolIndex,'ospf')" type="link" title="Add new OSPF process">
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
                            <span style="margin-right:5px;color:var(--g-color);">Process ID <span style="color:green;font-weight:bold;">{{routeProcess.pid}}</span></span>
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
                             <a-button type="link" @click="addDynamicRoute(protocolIndex,processID,null,null,null,'ospf')">
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
                <div v-else-if="protocol.protocol=='eigrp'">
                  <div>
                    <div>
                      <div v-if="cols.eigrp.formData.isAddingAs" class="passiveIntCls">
                          <p>AS Number</p>
                          <div>
                            <a-input v-model:value="cols.eigrp.formData.asn" size="small" placeholder="Enter AS number" style="width:100px;" />
                            <a-button style="margin-left:5px;" @click="AddRouteProcess(protocolIndex,'eigrp')" type="link">
                              save
                            </a-button>
                          </div>
                      </div>
                      <a-button v-else style="padding-left:0px !important;" @click="cols.eigrp.formData.isAddingAs=true" type="link">
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
                             <a-button type="link" @click="addDynamicRoute(protocolIndex,processID,null,null,null,'eigrp')">
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
                             <a-button type="link" @click="editStaticRoute('show')">
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
// imports goes here
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
    }
  },
  methods:{
    routesToLinear(){
      // console.clear()
      for(let protocol in this.content){
        this.routes.push({
          protocol:protocol,
          routes:this.content[protocol]
        })
      }
        // console.log(this.routes)
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
            console.log(data)
            this.cols.static.formData.clone=JSON.parse(JSON.stringify(data))
            this.cols.static.formData.pointer=[index,pointerIndex]
            this.cols.static.formData.show=true
          }
        }
      }else if(action=='add'){
        if(this.cols.static.formData.pointer.length){
          // Editing
          this.routes[index].routes[0].route[this.cols.static.formData.pointer[1]]=this.cols.static.formData.data
        }else{
          this.routes[index].routes[0].route.push(this.cols.static.formData.data)
        }
        // console.log(this.routes[index].routes[0].route)
        this.editStaticRoute('show')
      }else if(action=='remove'){
        this.routes[index].routes[0].route=this.routes[index].routes[0].route.filter(records=>{
        let found=false
        for(let key in data){
          if(records[key]!=data[key]){
            found=true
            break
          }
        }
        return found
      })
      }
    },
    // DYNAMIC ROUTES
    removeRoute(protocolIndex,processID,record){
      this.routes[protocolIndex].routes[processID].network=this.routes[protocolIndex].routes[processID].network.filter(records=>{
        let found=false
        for(let key in record){
          if(records[key]!=record[key]){
            found=true
            break
          }
        }
        return found
      })
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
        if(this.cols[proto].formData.isEdit){
          this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].network[this.cols[proto].formData.pointer[2]]=this.cols[proto].formData.data
        }else{
          this.routes[this.cols[proto].formData.pointer[0]].routes[this.cols[proto].formData.pointer[1]].network.push(this.cols[proto].formData.data)
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
  background: var(--g-shade-back);
}
</style>
