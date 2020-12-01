<template>
<div id="findAgain" class="step3" style="margin-top:20px">
  <s-scrollbar wrap-style="max-height: 500px;">
    <s-table-page style="margin:10px 10px"
                  :data="tableData"
                  ref="table">
      <s-table-column prop="ipAddress" label="IP地址"></s-table-column>
      <s-table-column prop="status" label="IP地址状态">
        <template slot-scope="scope">
          <span>{{status(scope.row.status)}}</span>
        </template>
      </s-table-column>
      <s-table-column prop="subnetAddress" label="子网地址"></s-table-column>
      <s-table-column prop="assetName" label="资产名称"></s-table-column>
      <s-table-column prop="assetCitypeName" label="资产类型"></s-table-column>
      <s-table-column prop="modelNumber" label="资产型号"></s-table-column>
      <s-table-column prop="assetStatus" label="资产状态"></s-table-column>
    </s-table-page>
  </s-scrollbar>
</div>
</template>

<script>
import $axios from 'sunflower-ajax'

export default {
  data() {
    return {
    }
  },
  computed: {
    tableData: {
      get() {
        return this.$store.state.addressAllocationSteps.step3.tableData;
      },
      set(val) {
        this.$store.commit('addressAllocationSteps/setStep3Table', val);
      }
    }
  },
  methods: {
    status(status) {
      if (status === 1) {
        return '可用的'
      } else if (status === 2) {
        return '已用的'
      } else if (status === 0) {
        return '暂态'
      } else {
        return ''
      }
    },
    getTableData() { // 可用的IP地址
      let param = {
        ipUuidList: this.$store.state.addressAllocationSteps.step2.table1Data.map(function (item) {
          return item.uuid;
        }),
        itcompUuidList: this.$store.state.addressAllocationSteps.step2.table2Data.map(function (item) {
          return item.uuid;
        })
      }
      $axios.post('/ipamNetsegment/getDistributionResult', param).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data;
        }
      })
    }
  },
  created() {
    this.getTableData();
  },
  mounted() {

  }
}
</script>
