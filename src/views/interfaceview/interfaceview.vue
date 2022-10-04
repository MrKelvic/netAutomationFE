
<template>
    <div>
      <div>
        <div class="deviceModule_cont">
          <div class="deviceModule">
            <div class="pan" v-for="i in parseInt((interfaceList.length+1)/2)" :key="i">
              <div class="interfaceGroup">
                <span v-for="x in 2" class="interface" :key="x">
                  <span v-if="interfaceList[rendIn(x,i)]">
                    <span v-if="x==1" class="intTitle">
                      {{interfaceList[rendIn(x,i)].shortName}}
                    </span>
                    <span :style="`background:${interFaceColor(interfaceList[rendIn(x,i)].state,interfaceList[rendIn(x,i)].connected)};`" class="interCard">
                      <span :style="x==1?'top:0px;':'bottom:0px;'" class="shdow-l"></span>
                      <span :style="x==1?'top:0px;':'bottom:0px;'" class="shdow-r"></span>
                    </span>
                     <span v-if="x!=1" class="intTitle">
                      {{interfaceList[rendIn(x,i)].shortName}}
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <ul class="key">
            <li>
              <span>Administratively Down</span>
              <span :style="`background:${interFaceColor(false,false)};`" class="key-code"></span>
            </li>
             <li>
              <span>Disconnected</span>
              <span :style="`background:${interFaceColor(true,false)};`" class="key-code"></span>
            </li>
            <li>
              <span>Connected</span>
              <span :style="`background:${interFaceColor(true,true)};`" class="key-code"></span>
            </li>
          </ul>
        </div>
        <div>
          <!-- {{interfaceList[0]}} -->
          <div class="content-table">
             <a-table v-if="interfaceList.length" :columns="tableCols" :data-source="interfaceList" :scroll="{x:1300}" :pagination="{ pageSize:20,size:'small',showSizeChanger:false }">
              <template #state="{ text }">
                <a-tag :color="interFaceColor(text,true)" >
                  {{ text?'Up':'Admin Down' }}
                </a-tag>
              </template>
              <template #connected="{ text }">
                <a-tag :color="interFaceColor(true,text)" >
                  {{ text?'Up':'Down' }}
                </a-tag>
              </template>
              <template #edit="{ record }">
              <span>
                <a-button @click="editThis(record)" type="link">
                  <!-- {{record.mode}} -->
                  <i class="fa-regular fa-edit"></i>
                </a-button>
              </span>
            </template>
            </a-table>
          </div>
        </div>
        <div class="drawer">
          <!--  -->
          <a-modal v-model:visible="isInEdit.show" 
          :centered="true" :destroyOnClose="true" 
          :closable="false" :maskClosable="false"
          :bodyStyle="{height:100}"
          @ok="saveEdit"
          @cancel="editClose" title="Interface">
          <!-- <p>{{this.isInEdit.int}}</p> -->
            <h2 v-if="isInEdit.int">{{isInEdit.int.fullName}}
              <a-tag v-if="isInEdit.int.subId" color="blue" >
                  sub interface
                </a-tag>
            </h2>
             <a-form layout="vertical" :model="isInEdit.int">
              <a-form-item :colon="false" label="Administrative state">
                <a-switch v-model:checked="isInEdit.int.state" />
              </a-form-item>
              <div v-if="isInEdit.int.state">
                <a-form-item v-if="allowL2&&isInEdit.int.layer=='L2'" :colon="false" label="Interface mode">
                  <a-radio-group @change="controlIntType" v-model:value="isInEdit.int.mode">
                    <a-radio value="access">Access</a-radio>
                    <a-radio value="trunk">Trunk</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="allowL2">
                  <div v-if="isInEdit.int.mode=='access'&&isInEdit.int.layer=='L2'">
                    <a-form-item :colon="false" label="Data VLAN">
                      <a-input v-model:value="isInEdit.int.data" />
                    </a-form-item>
                    <a-form-item :colon="false" label="Voice VLAN">
                      <a-input v-model:value="isInEdit.int.voice" />
                    </a-form-item>
                  </div>
                  <div v-if="isInEdit.int.mode=='trunk'&&isInEdit.int.layer=='L2'">
                    <a-form-item :colon="false" label="Allowed VLANs">
                      <a-input v-model:value="isInEdit.int.allowedVlans" />
                    </a-form-item>
                    <a-form-item :colon="false" label="Native VLAN">
                      <a-input v-model:value="isInEdit.int.nativeVlan" />
                    </a-form-item>
                  </div>
                </div>
                <a-form-item :colon="false" label="Interface type">
                  <a-radio-group @change="layerChange" v-model:value="isInEdit.int.layer">
                    <a-radio :disabled="!allowL2" value="L2">Switch port</a-radio>
                    <a-radio :disabled="isInEdit.int.mode=='trunk'" value="L3">Routed port</a-radio>
                  </a-radio-group>
                </a-form-item>
                <div v-if="isInEdit.int.layer=='L3'&&isInEdit.int.mode!='trunk'">
                  <a-form-item :colon="false" label="IP address">
                    <a-input v-model:value="isInEdit.int.ip" />
                  </a-form-item>
                  <a-form-item :colon="false" label="Mask">
                    <a-input v-model:value="isInEdit.int.mask" />
                  </a-form-item>
                </div>
                <a-form-item :colon="false" label="Description">
                  <a-input v-model:value="isInEdit.int.description" />
                </a-form-item>
              </div>
              <div v-else>
                <p>Interface is down</p>
              </div>
            </a-form>
          </a-modal>
        </div>
      </div>
    </div>
</template>

<script>
// imports goes here
/* Work on sub interfaces */
export default {
  name: 'interfaceview',
  props:['content','deviceType'],
  components: {
    },
  computed:{
    allowL2(){
      console.log(this.deviceType)
      return !['Vlan','Loopback'].includes(this.isInEdit.int.module)&&['switch'].includes(this.deviceType)
    },
    isSubInterface(){
          // console.log("hii")
          return true
    },
    rendIn(){
      return (x,i)=>(x==1?((2*i)-1):(2*i))-1
    },
    interFaceColor(){
      return (adminState,connected)=>{
          if(adminState&&connected) return '#10c95e'//'#0eaf52';
          if(!adminState) return '#a70808';
          return '#d9d3d3'

      }
    }
  },
  data(){
    return{
      isInEdit:{
        int:null,
        show:false,
        temp:null,
        removed:[]
      },
      interfaceList:[],
      tableCols:[]
    }
  },
  methods:{
    saveEdit(){
      this.interfaceList[this.isInEdit.int.index]=Object.assign({},JSON.parse(JSON.stringify(this.isInEdit.int)))
      this.isInEdit.int=null
      this.isInEdit.show=false
      this.isInEdit.removed=[]
    },
    editThis(record){
      console.log(record)
      this.isInEdit.int=record
      this.isInEdit.show=true
      this.isInEdit.removed=[]
      this.isInEdit.temp=Object.assign({},JSON.parse(JSON.stringify(this.isInEdit.int)))
    },
    editClose(){
      this.interfaceList[this.isInEdit.int.index]=this.isInEdit.temp
      this.isInEdit.show=false;
      this.isInEdit.int=null
    },
    layerChange(e){
      const l3=[{key:"ip",def:''},{key:"mask",def:''},{key:"ip_helper",def:''}]
      const l2=[{key:"mode",def:'access'},{key:"allowedVlans",def:'all'},{key:"voice",def:null},{key:"data",def:'1'},{key:"nativeVlan",def:'1'}]
      const isChanged=this.isInEdit.temp.layer!=e.target.value
      if(e.target.value=='L2'){
        for(let remove of l3){
          if(isChanged){
            const f=this.isInEdit.removed.find(e=>e.key==remove.key)
            if(!f) this.isInEdit.removed.push({key:remove.key,value:this.isInEdit.int[remove.key]})
          }else{
            this.isInEdit.removed=this.isInEdit.removed.filter(e=>e.key==remove.key)
          }
          delete this.isInEdit.int[remove.key]
        }
        for(let add of l2){
          this.isInEdit.int[add.key]=add.def
        }
      }
      else if(e.target.value=='L3'){
        for(let remove of l2){
          if(isChanged){
            const f=this.isInEdit.removed.find(e=>e.key==remove.key)
            if(!f) this.isInEdit.removed.push({key:remove.key,value:this.isInEdit.int[remove.key]})
          }else{
            this.isInEdit.removed=this.isInEdit.removed.filter(e=>e.key==remove.key)
          }
          delete this.isInEdit.int[remove.key]
        }
        for(let add of l3){
          this.isInEdit.int[add.key]=add.def
        }
      }
      // console.clear()
      console.log(this.isInEdit.removed)
    },
    controlIntType(e){
      // console.log(e.target.value)
      this.isInEdit.int.layer=e.target.value=='trunk'?'L2':this.isInEdit.int.layer
    },
    genColumns(){
      if(!this.interfaceList[0]) return []
      let filters=["index","name","ip_helper","module","shortName","description","id","allowedVlans","voice","nativeVlan"]
      let temp=Object.keys(this.interfaceList[0]).filter(e=>!filters.includes(e))
      let tempL3=Object.keys(this.interfaceList[this.interfaceList.length-1]).filter(e=>!filters.includes(e)&&!temp.includes(e))
      let smallWidth=["connected","state","layer","data","outgoing_acl","inbound_acl","mode"]
      this.tableCols=[...temp,...tempL3].map(e=>({
        title:e,
        key:e,
        dataIndex:e,
        slots:{ customRender:e},
        width:smallWidth.includes(e)?100:150
      }))
      this.tableCols.push({
        title:"Edit",
        dataIndex:"edit",
        key:"edit",
        slots: { customRender:"edit"}
      })
      this.tableCols[0].fixed="left"
      this.tableCols[0].width=200
      this.tableCols[this.tableCols.length-1].fixed="right"
      this.tableCols[this.tableCols.length-1].width=50
    },
    genLinearInterface(){
        let interList=[]
        let index=0
        for(let layer in this.content){
          for(let l2module in this.content[layer]){
            for(let intFace of this.content[layer][l2module].members){
              interList.push({index:index,...intFace})
              index+=1
            }
          }
        }
        this.interfaceList=interList
        this.genColumns()
    }
  },
  mounted(){
    this.genLinearInterface()
  },
  watch:{

  }
}
</script>
<style scoped>
.deviceModule_cont{
  margin:40px 0px;
}
.deviceModule{
  border:1px solid var(--g-color);
  width:fit-content;
  display:flex;
  padding:6px;
  border-radius:5px;
  margin:20px 0px;
}
.pan{
  /* border:1px solid green; */
  margin:0px 7px;
}
.interfaceGroup{
  display:grid;
}
.interface{
  margin:3px 0px;
}
.interface>span{
  display:grid;
  place-content:center;
  place-items:center;
}
.intTitle{
  font-size:0.9em;
}
.interCard{
  display:block;
  /* background:green; */
  position:relative;
  width:30px;
  height:28px;
}
.shdow-l{
  position:absolute;
  background:#fff;
  left:0px;
  width:5px;
  height:5px;
}
.shdow-r{
  position:absolute;
  background:#fff;
  right:0px;
  width:5px;
  height:5px;
}
.key{
  display:flex;
  margin:10px 0px;
}
.key>li{
  margin-right:10px;
  display:flex;
  place-content:center;
  place-items:center;
  color:var(--color-grey);
}
.key-code{
  width:13px;
  height:13px;
  border-radius:30px;
  display:inline-block;
  margin:0px 4px;
}
</style>
