
<template>
    <div>
      <div>
        <div class="selectionList">
          <div class="pool-cont">
            <h2>Devices</h2>
            <div class="filters">
              <div>
                <a-input-search :allowClear="true" size="small" v-model:value="filt.all.query" @input="supperFilter('all')" placeholder="Enter host name" style="width:200px;"/>
              </div>
              <div>
                 <a-select size="small" v-model:value="filt.all.type" mode="multiple" placeholder="Inserted are removed" style="width:fit-content;" 
                 :options="['router','switch','other'].map(e=>({value:e}))" @change="supperFilter('all')">
                 </a-select>
              </div>
            </div>
            <div class="pool">
              <a-table
                  :pagination="{ pageSize:10,size:'small',showSizeChanger:false }" size="small"
                  :row-selection="{ selectedRowKeys:filt.all.tempKeys,onSelectAll:()=>forceSelectAll('all'),onChange:(strv,v)=>selected(strv,v,'all')}"
                  :columns="columns"
                  :data-source="filt.all.filtered">
                  <template #deviceType="{record}">
                      <span>
                        <a-tag color="grey" >
                          {{ record.deviceType }}
                          <i v-if="record.deviceType=='switch'" class="fa-solid fa-right-left"></i>
                          <i v-else-if="record.deviceType=='router'" class="fa-solid fa-arrows-to-circle"></i>
                          <i v-else class="fa-solid fa-ethernet"></i>
                        </a-tag>
                      </span>
                    </template>
                    <template #IP="{record}">
                      <span>
                          {{ record.IP.ip }}
                      </span>
                    </template>
              </a-table>
            </div>
            <div class="btn_grp" style="margin-top:10px;">
              <a-button class="ui_btn" @click="addToNodes(true)" :disabled="filt.all.tempKeys.length<1" size="small" type="link">
                Add Selected
                <template #icon><PlusOutlined /></template>
              </a-button>
              <a-button class="ui_btn" @click="addToNodes(true,true)" :disabled="filt.all.filtered.length<1" size="small" type="link">
                Add All
                <template #icon><PlusOutlined /></template>
              </a-button>
            </div>
          </div>
          <!--  -->
          <!--  -->
          <div class="pool-cont">
            <h2>Selected Devices</h2>
            <div class="filters">
              <div>
                <a-input-search :allowClear="true" size="small" v-model:value="filt.sel.query" @input="supperFilter('sel')" placeholder="Enter host name" style="width:200px;"/>
              </div>
              <div>
                 <a-select size="small" v-model:value="filt.sel.type" mode="multiple" placeholder="Inserted are removed" style="width:fit-content;" 
                 :options="['router','switch','other'].map(e=>({value:e}))" @change="supperFilter('sel')">
                 </a-select>
              </div>
            </div>
            <div class="pool">
              <a-table
                  :pagination="{ pageSize:10,size:'small',showSizeChanger:false }" size="small"
                  :row-selection="{ selectedRowKeys:filt.sel.tempKeys, onChange:(strv,v)=>selected(strv,v,'sel')}"
                  :columns="columns"
                  :data-source="filt.sel.filtered">
                  <template #deviceType="{record}">
                      <span>
                        <a-tag color="green" >
                          {{ record.deviceType }}
                          <i v-if="record.deviceType=='switch'" class="fa-solid fa-right-left"></i>
                          <i v-else-if="record.deviceType=='router'" class="fa-solid fa-arrows-to-circle"></i>
                          <i v-else class="fa-solid fa-ethernet"></i>
                        </a-tag>
                      </span>
                    </template>
                    <template #IP="{record}">
                      <span>
                          {{ record.IP.ip }}
                      </span>
                    </template>
              </a-table>
            </div>
            <div class="btn_grp" style="margin-top:10px;">
              <a-button class="ui_btn" @click="addToNodes(false)" danger :disabled="filt.sel.tempKeys.length<1" size="small" type="link">
                  Remove Selected
                  <template #icon><CloseOutlined /></template>
                </a-button>
              <a-button class="ui_btn" danger @click="addToNodes(false,true)" :disabled="filt.sel.filtered.length<1" size="small" type="link">
                Remove All
                <template #icon><CloseOutlined /></template>
              </a-button>
              <a-button class="ui_btn" @click="tempDevice.options.show=true" size="small" type="link">
                Add Device
                <template #icon><PlusOutlined /></template>
              </a-button>
            </div>
          </div>
        </div>
          <!-- :bodyStyle="{height:100}" -->
        <a-modal v-model:visible="tempDevice.options.show" 
          :centered="true" :destroyOnClose="true" 
          :closable="false" :maskClosable="false"
          @ok="saveTemp"
          @cancel="saveReset" title="Add Temporal Device">
          <a-form layout="vertical" :model="tempDevice.value">
            <a-form-item :colon="false" label="Hostname">
              <a-input v-model:value="tempDevice.value.hostname" />
            </a-form-item>
            <a-form-item :colon="false" label="Device type">
              <a-radio-group v-model:value="tempDevice.value.deviceType">
                <a-radio v-for="type in tempDevice.options.deviceType" :key="type" :value="type">{{type}}</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :colon="false" label="Device OS">
              <a-radio-group v-model:value="tempDevice.value.OS">
                <a-radio v-for="type in tempDevice.options.os" :key="type.value" :value="type.value">{{type.dis}}</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item :colon="false" label="IP address">
              <a-input v-model:value="tempDevice.value.IP.ip" />
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
      <div>
          <a-button class="ui_btn" size="small" v-if="showSave" style="margin-top:12px;color:var(--action);" @click="proccessAndUpdate">Apply</a-button>
      </div>
    </div>
</template>

<script>
// imports goes here
import inventory from '@/service/inventory';
import { PlusOutlined,CloseOutlined } from '@ant-design/icons-vue';
export default {
  name: 'targetlist',
  props:['content','keepAlive'],
  components: {
    PlusOutlined,
    CloseOutlined
  },
  computed:{

  },
  data(){
    return{
      showSave:true,
      // {"hostname":str(IP(temp[0])),"decription":'------',"deviceType":None,"IP":{"ip":str(IP(temp[0]))},"Name":None,"OS":devOs}
      tempDevice:{
        value:{hostname:null,decription:'-',deviceType:null,IP:{ip:null,mask:'255.255.255.255'},Name:null,OS:'ios'},
        options:{
          show:false,
          deviceType:['router','switch','other'],
          os:[{value:"ios",dis:"Cisco ios"},{value:"nxos",dis:"Cisco nexus"}, {value:"eos",dis:"Huawie"}, {value:"junos",dis:"Juniper junos"}]
        }
      },
      filt:{
        all:{
          query:'',
          filtered:[],
          type:['router','switch','other'],
          tempSelected:[],
          tempKeys:[],
          inventory:[],
        },
        sel:{
          query:'',
          filtered:[],
          type:['router','switch','other'],
          tempSelected:[],
          tempKeys:[],
          inventory:[],
        }
      },
      inventory:{
        all:[],
        selected:[]
      },
      // 
      // 
      columns:[
        {
          title: 'Hostname',
          dataIndex: 'hostname',
        },
        {
          title: 'Device Type',
          dataIndex: 'deviceType',
          slots: { customRender:"deviceType"},
        },
        {
          title: 'IP',
          dataIndex: 'IP',
          slots: { customRender:"IP"},
        },
      ]
    }
  },
  methods:{
    saveReset(){
      this.tempDevice.options.show=false
      this.tempDevice.value={hostname:null,decription:'-',deviceType:null,IP:{ip:null,mask:'255.255.255.255'},Name:null,OS:'ios'}
    },
    saveTemp(){
      this.filt.sel.filtered.push(this.tempDevice.value)
      // this.filt.sel.inventory.push(this.tempDevice.value)
      this.saveReset()
    },
    async getInventoryLocal(){
      /* Get all sites */
      let response=await inventory.getInventory({filter:0});
      if(response.passed){
        this.inventory.all=response.data.map(e=>({key:e.hostname,...e}))
        this.resetFilters('all',this.inventory.all)
      }
    },
    forceSelectAll(where){
      this.filt[where].tempSelected=this.filt[where].filtered
      this.filt[where].tempKeys=this.filt[where].tempSelected.map(e=>e.hostname)
    },
    selected(stringValues,d,where){
      this.filt[where].tempKeys=stringValues
      this.filt[where].tempSelected=d
    },
    resetFilters(where,value){
      this.filt[where].filtered=value
      this.filt[where].inventory=value
      this.filt[where]. query=''
      this.filt[where].type=['router','switch','other']
      this.filt[where].tempSelected=[]
      this.filt[where].tempKeys=[]
    },
    addToNodes(add,all){
      // let cb=(e,arr)=>arr.find(ei=>ei.hostname==e.hostname)
      if(add){
        this.inventory.selected=[...(all?this.filt.all.filtered:this.filt.all.tempSelected.map(e=>e)),...this.inventory.selected]
        this.filt.sel.tempSelected=this.inventory.selected
        this.filt.all.inventory=this.filt.all.inventory.filter(e=>{
          return !this.filt.sel.tempSelected.find(ei=>ei.hostname==e.hostname)
        })
        // console.log(this.inventory.selected)
        this.resetFilters('all',this.filt.all.inventory)
        this.resetFilters('sel',this.filt.sel.tempSelected)
      }else{
        this.filt.all.inventory=[...(all?this.filt.sel.filtered:this.filt.sel.tempSelected.map(e=>e)),...this.filt.all.inventory]
        this.inventory.selected=all?[]:this.filt.sel.inventory.filter(e=>{
          return !((all?this.filt.sel.filtered:this.filt.sel.tempSelected.map(e=>e))).find(ei=>ei.hostname==e.hostname)
        })
        // console.log(this.inventory.selected)
        this.resetFilters('sel',this.inventory.selected)
        this.resetFilters('all',this.filt.all.inventory)
      }
      this.showSave=true
      this.$emit('disabledNext')
    },
    supperFilter(where){
      // console.clear()
      // console.log(this.filt[where].query)
      let t=this.filt[where].type.map(e=>e.toUpperCase())
      let cb=(e)=>(e.hostname.toUpperCase()).includes(this.filt[where].query.toUpperCase())&&(t.includes(e.deviceType.toUpperCase()))
      this.filt[where].filtered=this.filt[where].inventory.filter(e=>cb(e))
      this.filt[where].tempSelected=this.filt[where].tempSelected.filter(e=>cb(e))
      this.filt[where].tempKeys=this.filt[where].tempSelected.map(e=>e.hostname)
    },
    proccessAndUpdate(){
        let temp=Object.assign({},this.content)
        temp.nodes=this.filt.sel.filtered
        this.$emit("value",{data:temp,keepAlive:{target:'targetlist',value:this.filt.sel.filtered}})
        this.showSave=false
      }
  },
  mounted(){
    this.getInventoryLocal()
    if(this.keepAlive?.targetlist){
      this.filt.all.tempSelected=this.keepAlive?.targetlist
      // this.resetFilters('sel',this.keepAlive?.targetlist)
      this.addToNodes(true)
    }
  },
  watch:{

  }
}
</script>
<style scoped>
.selectionList{
  display:flex;
  flex-wrap:wrap;
}
.pool-cont{
  width:46%;
  min-width:500px;
  padding:15px;
  /* height:500px; */
  margin:10px;
  background:var(--white);
}
.pool{
  width:100%;
  height:fit-content;
  /* max-height:495px; display:flex; */
  overflow-y:auto;
  flex-wrap:wrap;
}
.pool-item{
  text-align:center;
  width:fit-content;
  height:fit-content;
  border:1px solid #d1d1d1;
  margin:8px;
  min-width:130px;
  padding:6px;
  border-radius:5px;
}
.pool-item p{
  margin:0px;
}
.pool-item span{
  margin:10px 0px;
  display:inline-block;
}
.pool-item i{
  font-size:20px;
}
.filters{
  margin-bottom:10px;
}
.filters>div{
  margin:15px 0px;
}
.btn_grp button{
  margin:0px 5px;
}
</style>
