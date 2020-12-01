<template>
  <div>
    <section class="reportTop noPrint">
      <s-row>
        <s-col :span="24">
          <s-form :inline="true">
            <select-time ref="selecttime">
              <template slot="searchBtn">
                <div class="search_btn">
                  <s-button title="查询" icon='magnifier' @click="getList">查询</s-button>
                </div>
              </template>
            </select-time>
          </s-form>
          <s-row style="margin: 15px 0 10px;">
            <s-button title="EXCEL报表" icon="excel" @click="ExcelDownloadHandle()">EXCEL报表</s-button>
            <s-button title="WORD报表" icon="word" @click="WordDownloadHandle()">WORD报表</s-button>
            <s-button title="PDF报表" icon="pdf" @click="PdfDownloadHandle()">PDF报表</s-button>
          </s-row>
        </s-col>
      </s-row>
    </section>
    <s-table-page
      :data="tableData">
      <s-table-column
        prop="dbiName"
        label="数据库名">
      </s-table-column>
      <s-table-column
        prop="dbiType"
        label="数据库类型">
      </s-table-column>
      <s-table-column
        prop="dbiIp"
        label="数据库IP">
      </s-table-column>
      <s-table-column
        prop="accountName"
        label="登录名">
      </s-table-column>
      <s-table-column
        prop="clientIp"
        label="登录IP">
      </s-table-column>
      <s-table-column
        prop="grant"
        label="Grant使用数">
      </s-table-column>
      <s-table-column
        prop="revoke"
        label=" Revoke使用数">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  export default {
    components: {
      SelectTime
    },
    data () {
      return {
        period: 'day',
        tableData: []
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        let {beginTimes, endTimes} = this.$refs.selecttime
        let params = {startTime: new Date(beginTimes).getTime() / 1000, endTime: new Date(endTimes).getTime() / 1000}
        $axios.post(`/hierarchyProtection/grantAndRevoke`, params).then((res) => {
          this.tableData = res.data || []
        })
      },
      ExcelDownloadHandle() {
        let {beginTimes, endTimes} = this.$refs.selecttime;
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm('确定将权限变更情况统计报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportGrantAndRevoke/${new Date(beginTimes).getTime() / 1000}/${new Date(endTimes).getTime() / 1000}/excel`)
        }).catch(() => {});
      },
      WordDownloadHandle() {
        let {beginTimes, endTimes} = this.$refs.selecttime;
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm('确定将权限变更情况统计报表以Word格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportGrantAndRevoke/${new Date(beginTimes).getTime() / 1000}/${new Date(endTimes).getTime() / 1000}/word`)
        }).catch(() => {});
      },
      PdfDownloadHandle() {
        let {beginTimes, endTimes} = this.$refs.selecttime;
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm('确定将权限变更情况统计报表以Pdf格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportGrantAndRevoke/${new Date(beginTimes).getTime() / 1000}/${new Date(endTimes).getTime() / 1000}/pdf`)
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="stylus">
</style>
