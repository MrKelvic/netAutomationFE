
<template>
  <div>
    <a id="download"></a>
    <div style="margin: 0px 0px 25px 0px">
      <div>
        <p style="color: var(--color-grey)">Select fields to export</p>
        <a-tree-select
          v-model:value="headers"
          style="width: 100%"
          :show-checked-strategy="SHOW_PARENT"
          :tree-data="getOptions()"
          tree-checkable
          allow-clear
          @change="reportLink=null"
        />
      </div>
      <ul class="action-list">
        <li>
          <a-button v-if="!reportLink&&headers.length" @click="toExcel" type="primary" ghost class="action-btn">
            <span>Generate report as excel</span>
          </a-button>
          <a-button style="padding-left:0px;" v-if="reportLink&&headers.length" :href="reportLink" target="_blank" type="link" ghost class="action-btn">
            <span>Download generated report</span>
          </a-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// imports goes here
import engine from "@/service/engine";
import { TreeSelect } from "ant-design-vue";
export default {
  name: "outputinterface",
  props: ["data", "params"],
  components: {
    // TreeSelect
  },
  computed: {
    // headerOption(){
    // console.clear()
    // console.log(this.data[0].res.web.map(e=>({options:Object.keys(e.value[0]),title:e.title})))
    // if(!this.data[0]?.res?.web) return []
    // // console.log(this.data[0].res.web.map(e=>(Object.keys(e.value[0]).map(ee=>({value:ee})))).flat())
    // return this.data[0].res.web.map((e,index1)=>({
    //   children:Object.keys(e.value[0]).map((ch)=>({title:ch,value:`${index1}-`+ch})),
    // title:e.title,value:e.title}))
    // key:`0-${index1}`
    // key:`0-${index1}-${chindex}`
    // return this.data[0].res.web.map(e=>({value:Object.keys(e.value[0])})).flat()
    // }
  },
  data() {
    return {
      headers: [],
      headresFlat:[],
      reportFilters: {},
      reportLink:null,
      excel: {
        isMultiple: false,
        headers: [],
        values: [],
      },
    };
  },
  methods: {
    getOptions() {
      if (!this.data[0]?.res?.web) return [];
      return this.data[0].res.web.map((e) => ({
        children:e.value[0]? Object.keys(e.value[0]).map((ch) => ({
          title: ch,
          value: `${e.title}-` + ch,
        })):[],
        title:e.value[0]?e.title:null,
        value:e.value[0]?e.title:null,
      }));
    },
    iniExcelHeaders() {
      this.excel.headers = ["Device", "type", "IP"];
      this.excel.values = [];
      this.excel.isMultiple = false;
    },
    toExcel() {
      // console.clear()
      // console.log(this.headers)
      this.reportFilters = {};
      this.headresFlat=[]
      for (let header of this.headers) {
        let [parent, child] = header.split("-");
        if (!child && parent) {
          let sampleObj = this.data[0].res.web.find((e) => e.title == parent)?.value[0] || {};
          this.reportFilters[parent] = Object.keys(sampleObj);
          this.headresFlat=this.reportFilters[parent]
        } else if (parent && child) {
          if (!this.reportFilters[parent]) this.reportFilters[parent] = [];
          this.reportFilters[parent].push(child);
          this.headresFlat.push(child)
        }
      }
      this.iniExcelHeaders();
      for (let node of this.data) {
        if (this.excel.isMultiple) break;
        if (node?.res?.web) {
          for (let webRes of node.res.web) {
            if (webRes.title in this.reportFilters) {
              this.excel.isMultiple = webRes.value.length > 1;
            }
          }
        }
      }

      this.excel.headers = this.excel.isMultiple? []: [...this.excel.headers, ...this.headresFlat];
      for (let node of this.data) {
        if (node?.res?.web) {
          for (let webRes of node.res.web) {
            if (webRes.title in this.reportFilters) {
              // console.log(this.reportFilters[webRes.title],webRes.value)
              if (!this.excel.isMultiple) {
                this.excel.values.push([
                  node.hostname,
                  node.deviceType,
                  node.IP.ip,
                  ...this.reportFilters[webRes.title].map(
                    (key) => webRes.value[0][key]
                  ),
                ]);
              } else {
                this.excel.values.push({
                  head: `${node.hostname} - ${node.deviceType} - ${node.IP.ip}`,
                  headers: this.headresFlat,
                  values: this.reportFilters[webRes.title].map((key) =>
                    webRes.value.map?webRes.value.map((item) => item[key]):[webRes.value]
                  ),
                });
              }
            }
          }
        }
      }
      // console.log(this.excel);
      this.genReport();
    },
    async genReport() {
      // try {
      let response = await engine.genReport({ payload: this.excel });
      if (response.passed) {
        this.reportLink=response?.data?.path
        // console.log("Passed ",response.data.path);
      }
    },
  },
  mounted() {
    this.SHOW_PARENT = TreeSelect.SHOW_PARENT;
  },
  watch: {},
};
</script>
<style scoped>
.action-list {
  /* width:100%;
  display:flex;
  place-content:center;
  place-items: center; */
  margin: 10px 0px;
}
.action-list > li {
}
.action-btn {
  height: fit-content;
  width: fit-content;
  /* color: var(--color); */
  /* padding:15px 20px; */
}
.action-btn > i {
  font-size: 2em;
}
.action-btn > span {
  display: block;
}
</style>
