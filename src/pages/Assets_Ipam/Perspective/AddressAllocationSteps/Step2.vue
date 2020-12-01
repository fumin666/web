<template>
<div id="findAgain" class="step2" style="margin-top:20px">
  <s-scrollbar wrap-style="max-height: 500px;">
    <div style="font-weight:bold;width:90%;">可用的IP地址</div>
    <s-table-page style="margin:10px 10px"
                  :data="table1Data"
                  ref="table1">
      <s-table-column prop="ipAddress" label="IP地址"></s-table-column>
      <s-table-column prop="subnetAddress" label="子网地址"></s-table-column>
    </s-table-page>
    <div style="font-weight:bold;width:90%;">选择资产</div>
    <s-table-page
      ref="table2"
      :data="table2Data"
      :header-search="getSearchDef()"
      style="margin:10px 10px">
      <s-table-column prop="itcompName" label="资产名称"></s-table-column>
      <s-table-column prop="citypeName" label="资产类型"></s-table-column>
      <s-table-column prop="productKeyName" label="资产型号"></s-table-column>
      <s-table-column prop="assetstatusName" label="资产状态"></s-table-column>
    </s-table-page>
  </s-scrollbar>
</div>
</template>

<script>
import {cloneDeep} from 'lodash'
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      checked: false,
      tempData: []
    }
  },
  computed: {
    table1Data: {
      get() {
        return this.$store.state.addressAllocationSteps.step2.table1Data;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep2Table1', cloneDeep(val));
      }
    },
    table2Data: {
      get() {
        return this.$store.state.addressAllocationSteps.step2.table2Data;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep2Table2', cloneDeep(val));
      }
    },
    selections: {
      get() {
        return this.$store.state.addressAllocationSteps.step2.selections;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep2Selections', cloneDeep(val));
      }
    }
  },
  methods: {
    // 列表表头搜索
    getSearchDef() {
      return {
        width: 6,
        offset: 18,
        placeholder: '请输入查询内容',
        searchProps: ['itcompName', 'citypeName', 'productKeyName', 'assetstatusName']
      }
    },
    getTable1Data() { // 可用的IP地址
      let param = {
        applyNum: this.$store.state.addressAllocationSteps.step1.step1Form.applyNum,
        subNetList: this.$store.state.addressAllocationSteps.step1.selections.map(function (item) {
          return item.uuid;
        })
      }
      $axios.post('/ipamNetsegment/getIpAddressByPar', param).then((res) => {
        this.table1Data = res.data || [];
      })
    },
    getTable2Data() { // 资产列表
      $axios.get(`/ipamNetsegment/getIpamMonitorItcomp/${this.$store.state.addressAllocationSteps.step1.step1Form.applyNum}`).then((response) => {
        let {
          status,
          data
        } = response;
        if (status !== 200) {
          this.$message({
            title: '错误',
            message: '获取资产列表失败',
            type: 'error'
          });
        } else {
          this.table2Data = data;
        }
      })
    },
    next() { // 这个方法从上一级调用
      this.$store.commit('addressAllocationSteps/next');
    }
  },
  created() {
    this.getTable1Data();// 获取可用IP地址
    this.getTable2Data();// 选择资产
  },
  mounted() {

  }
}
</script>
