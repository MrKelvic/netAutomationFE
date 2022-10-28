
<template>
    <div class="wrapper">
    <div v-if="!int_route.nested" class="main_route">
     <div class="flex_div">
       <div>
          <a-table :pagination="{ pageSize:10,size:'small',showSizeChanger:false }" size="small" :columns="columns" :dataSource="data.devices">
            <template #DEVICETYPE="{record}">
              <span>
                <a-tag :color="(record.isAlive||record.reacheable)?'green':`grey`" >
                  {{ record.deviceType }}
                  <i v-if="record.deviceType=='switch'" class="fa-solid fa-right-left"></i>
                  <i v-else-if="record.deviceType=='router'" class="fa-solid fa-arrows-to-circle"></i>
                  <i v-else class="fa-solid fa-ethernet"></i>
                </a-tag>
              </span>
            </template>
            <template #IP="{record}">
              <span> {{record.IP.ip}} </span>
            </template>
            <template #view="{ record }">
              <span>
                <a-button @click="moreDeviceInfo(record)" type="link">
                  <i class="fa-regular fa-eye"></i>
                </a-button>
              </span>
            </template>
          </a-table>
            <a-button class="ui_btn" @click="tempDevice.options.show=true;tempDevice.options.isEdit=false" size="small" type="link">
              Add Device
              <template #icon><PlusOutlined /></template>
            </a-button>
       </div>
       <div style="max-width:150px;">
         <div class="infoc" v-if="inFocus">
            <div class="topinfo">
              <span :style="(()=>{let t=inFocus.deviceType=='router'?`border-radius:90px;`:'';t+=inFocus.reacheable?'color:#389e0d;':'';return t;})()">
                  <i v-if="inFocus.deviceType=='switch'" class="fa-solid fa-right-left"></i>
                  <i v-else-if="inFocus.deviceType=='router'" class="fa-solid fa-arrows-to-circle"></i>
                  <i v-else class="fa-solid fa-ethernet"></i>
              </span>
              <div>
                <h2>{{inFocus.hostname}}</h2>
                <p>{{inFocus.Name}}</p>
                <p>{{inFocus.deviceType}}</p>
                <p>{{inFocus.IP.ip}}</p>
                <p>{{inFocus.decription}}</p>
              </div>
            </div>
            <div v-if="!loadingIn" class="detail">
              <div v-if="inFocus.detail">
                <div v-for="detail in inFocus.detail" :key="detail.title">
                  <span class="head">{{detail.title}}</span>
                  <span v-if="!isarray(detail.value)" class="data">{{detail.value}}</span>
                  <span v-else>
                    <a-tag style="margin:3px;color:var(--color);font-size:1.1em;" color="blue" v-for="v in detail.value" :key="v" >{{v}}</a-tag>
                  </span>
                </div>
              </div>
              <div v-else>
                <p style="text-align:center;">Can't connect to device</p>
              </div>
            </div>
            <div style="display:flex;place-items:center;place-content:center;min-height:200px;" v-if="loadingIn">
                <a-spin tip="running napalm engine" />
            </div>
            <div class="btn_actions">
              <a-button class="ui_btn" style="margin:0px 6px;" type="link" @click="$router.push({name:'interact',params:{ip:inFocus.IP.ip}})" :disabled="!inFocus.reacheable" ghost>
                <i style="margin-right:10px;" class="fa-solid fa-terminal"></i>
                interact
              </a-button>
              <a-button class="ui_btn" style="margin:0px 6px;" type="link" @click="initEdit()" ghost>
                <i style="margin-right:10px;" class="fa-solid fa-edit"></i>
                Edit
              </a-button>
              <a-button class="ui_btn" style="margin:0px 6px;" type="link" @click="deleteInventory()" danger>
                <i style="margin-right:10px;" class="fa-regular fa-trash-can"></i>
                Remove
              </a-button>
            </div>
         </div>
       </div>
     </div>
      <a-modal v-model:visible="tempDevice.options.show" 
          :centered="true" :destroyOnClose="true" 
          :closable="false" :maskClosable="false"
          @ok="saveTemp"
          @cancel="saveReset" :title="tempDevice.options.isEdit?'Edit Device':'Add Device'">
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
          <a-form-item :colon="false" label="Mask">
            <a-input v-model:value="tempDevice.value.IP.mask" />
          </a-form-item>
          <a-form-item :colon="false" label="Decription">
            <a-input v-model:value="tempDevice.value.decription" />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <router-view v-else></router-view>
    </div>
</template>

<script>
// imports goes here
import inventory from '@/service/inventory';
import engine from '@/service/engine';
// import { Table } from "ant-design-vue";
import { PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
// import loadingcomponent from '@/components/loadingcomponent/loadingcomponent.vue'
export default {
  name: 'inventory',
  props:[],
  components: {
    PlusOutlined,
    // loadingcomponent
    // Table
  },
  computed:{

  },
  data(){
    return{
      tempDevice:{
        value:{hostname:null,decription:'-',deviceType:'router',IP:{ip:null,mask:'255.255.255.255'},Name:null,OS:'ios'},
        options:{
          show:false,
          isEdit:false,
          deviceType:['router','switch','other'],
          os:[{value:"ios",dis:"Cisco ios"},{value:"nxos",dis:"Cisco nexus"}, {value:"eos",dis:"Huawie"}, {value:"junos",dis:"Juniper junos"}],
          validators:{
            hostname:(e)=>e&&String(e).replace(/\s/gi,''),
            decription:()=>true,
            deviceType:(e)=>['router','switch','other'].includes(e),
            IP:(e)=>(e.ip&&String(e.ip).replace(/\s/gi,''))&&(e.mask&&String(e.mask).replace(/\s/gi,'')),//{ip:null,mask:'255.255.255.255'},
            Name:()=>true,
            OS:(e)=>['ios','nxos','eos',"junos"].includes(e)},
        }
      },
      int_route:{
        nested:false
      },
      data:{
        devices:[],

      },
      inFocus:null,
      loadingIn:false,
      // 
      dataSource: [],
      columns: [],
    }
  },
  methods:{
    initEdit(){
      this.tempDevice.options.show=true;
      this.tempDevice.options.isEdit=true;
      this.tempDevice.value.IP=this.inFocus.IP
      this.tempDevice.value.oldIp=this.inFocus.IP.ip
      this.tempDevice.value.Name=this.inFocus.Name
      this.tempDevice.value.OS=this.inFocus.OS
      this.tempDevice.value.decription=this.inFocus.decription
      this.tempDevice.value.deviceType=this.inFocus.deviceType
      this.tempDevice.value.hostname=this.inFocus.hostname
    },
    saveReset(){
      this.tempDevice.options.show=false
      this.tempDevice.options.isEdit=false
      this.tempDevice.value={hostname:null,decription:'',deviceType:'router',IP:{ip:null,mask:'255.255.255.255'},Name:null,OS:'ios'}
    },
    saveTemp(){
      let err=null
      for(let key in this.tempDevice.options.validators){
        if(!this.tempDevice.options.validators[key](this.tempDevice.value[key])){
          err=key
          break
        }
      }
      if(err){
        message.error("Provide "+err)
        return 0
      }
      if(this.tempDevice.options.isEdit) this.updateInventory()
      else this.addInventoryLocal()
    },
    isarray(data){
      return Array.isArray(data)
    },
    genColumns(title){
      let mapper={
        HOSTNAME:"Hostname",
        DECRIPTION:"Description",
        DEVICETYPE:"Device Type",
        IP:"ip",
        NAME:"Name",
        OS:"OS"
      }
        return {
            title:mapper[title.toUpperCase()],
            dataIndex:title,
            key:title.toUpperCase(),
            slots: { customRender: title.toUpperCase()},
            // width:200
          }
    },
    async deleteInventory(){
      /* Get all sites */
      let response=await inventory.deleteInventory({ip:this.inFocus.IP.ip});
      if(response.passed){
        this.data.devices=response.data
        this.inFocus=null
        this.saveReset()
      }
    },
    async updateInventory(){
      /* Get all sites */
      let response=await inventory.updateInventory({device:this.tempDevice.value});
      if(response.passed){
        this.data.devices=response.data
        this.saveReset()
      }
    },
    async addInventoryLocal(){
      /* Get all sites */
      let response=await inventory.addInventory({device:this.tempDevice.value});
      if(response.passed){
        this.data.devices=response.data
        // this.data.devices.unshift(this.tempDevice.value)
        this.saveReset()
      }
    },
    async getInventoryLocal(){
      /* Get all sites */
      let response=await inventory.getInventory({filter:0});
      if(response.passed){
        let cols=[];
        let colsExept=['decription','Name']
        this.data.devices=response.data.map(item=>{
          Object.keys(item).forEach(e=>{
            if(!cols.includes(e)&&!colsExept.includes(e)){
              cols.push(e)
            }
            // if(typeof(item[e])=="object"&&item[e]){
            //   let n=""
            //   Object.keys(item[e]).forEach(inter=>n+=item[e][inter]+" ")
            //   item[e]=n
            // }
          })
          return item
        })
        this.columns=cols.map(e=>this.genColumns(e))
        this.columns.push({
            title:"View",
            dataIndex:"view",
            key:"view",
            slots: { customRender:"view"},
          })
      }
    },
    async moreDeviceInfo(device){
      this.inFocus=device
      let cl=Object.assign({},device)
      // cl.IP={
      //   ip:device.IP.split("/")[0],
      //   mask:device.IP.split("/")[1]
      // }
      let payload={
        nodes:[cl],
        engineFn:"info",
        action:"get",
        params:[]
      }
      if(device.detail) return 0;
      this.loadingIn=true
      let response= await engine.engineAction(payload)
      if(response.passed&&response.data.length){
        device.reacheable=true
        let d=this.objectToKeyPair(response.data[0]?.web[0]?.value[0])
        this.inFocus.detail=d
        device.detail=d
      }
      this.loadingIn=false
      // console.clear()
      // console.log(device.detail)
      // console.log(response)
    },
    objectToKeyPair(obj){
      return Object.keys(obj).map(e=>({title:e,value:obj[e]}))
    },
    nest_int_route(nested){
      this.int_route.nested=nested
    }

  },
  mounted(){
    // fetch sites
    this.nest_int_route(this.$route.matched.length==3)
    this.getInventoryLocal()
    // console.log(this.$route,this.int_route)
  },
  watch:{
    '$route.matched.length':function(e){
      console.log('leng changed',e)
      this.nest_int_route(e===3)
    }
  }
}
</script>
<style scoped>
.wrapper{
  width:100%;
  padding-top:30px;
}
.add{
  background:var(--theme);
  color:var(--floor);
  width:40px;
  height:40px;
  border-radius:30px;
  position:fixed;
  left:50%;
  bottom:2%;
}
.sites{
  display:flex;
  flex-wrap:wrap;
}
.site{
  background: var(--secondary);
  padding: 15px;
  margin: 10px;
  border-radius: 6px;
  border-radius: 8px;
  border: 1px solid var(--grey);
  box-sizing: border-box;
}
.site:hover{
  box-shadow:var(--g-deep-shadow);
  cursor:pointer;
}
.site_cont{
  /* display:flex; */
}
.site_cont>div{
  margin:10px;
}
.location{

}
.site_details{
  background:var(--floor);
  padding:12px 10px 12px 28px;
  border-radius:6px;
}
.site_subs{

}
.site_subs>ul{
  display: grid;
  grid-template-columns: 33.33% 33.33% 33.33%;
}
.site_sub{
  margin:0px 10px;
  white-space: nowrap;
}
.site_sub:nth-child(2){
  margin-left: 30px;
}
.item_head{
  color: var(--g-color);
  font-size: .9em;
}
.item_val{
  font-size: 1.5em;
  margin-bottom:5px;
  border-radius:50px;
  color:#5995ef;
}
.item_head>span{

}
/*  */
.flex_div{
  display:flex;
  /* place-content: space-between; */
  flex-wrap:wrap;
}
.flex_div>div{
  background:var(--white);
  padding:10px;
  border-radius:2px;
  min-width:480px;
  max-width:610px;
  margin-right:10px;
  margin-bottom:20px;
  height:fit-content;
}
.topinfo{
  display:flex;
  flex-wrap:wrap;
  margin-bottom:10px;
  place-items:center;
  font-size:1.2em;
  /* place-content:center; */
}
.topinfo p{
  margin:0px;
}
.topinfo h2{
  margin:0px;
}
.topinfo>span{
  margin-right:20px;
  display:inline-block;
  font-size:25px;
  border:1px solid;
  border-radius:10px;
  display:flex;
  place-items:center;
  place-content:center;
  width:60px;
  height:60px;
}
.head{
  font-size:14px;
  margin-right:10px;
  font-weight:bold;
}
.data{
  font-size:14px;
}
.btn_actions{
  margin-top:20px;
}
</style>
