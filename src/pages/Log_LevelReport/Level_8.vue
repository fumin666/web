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
        prop="iamuserinfo.userRealName"
        label="姓名">
      </s-table-column>
      <s-table-column
        prop="iamuserinfo.userLoginName"
        label="登录名">
      </s-table-column>
      <s-table-column
        prop="countAssetAccount"
        label="使用账号数">
      </s-table-column>
      <s-table-column
        prop="countItcomp"
        label="登录资产数">
      </s-table-column>
      <s-table-column
        prop="countCmd"
        label="使用命令数">
      </s-table-column>
      <s-table-column
        prop="countTime"
        label="运维时长">
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
        tableData: []
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        let {beginTimes, endTimes} = this.$refs.selecttime
        let params = {
          startTime: beginTimes ? new Date(beginTimes).getTime() / 1000 : 0,
          endTime: endTimes ? new Date(endTimes).getTime() / 1000 : Number.parseInt(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000)
        }
        $axios.get(`/hierarchyProtection/OperationCount/${params.startTime}/${params.endTime}`).then((res) => {
          this.tableData = res.data || []
        })
      },
      ExcelDownloadHandle() {
        let {beginTimes, endTimes} = this.$refs.selecttime;
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm('确定将资产运维操作统计报表以Excel格式导出？', '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportOperationCount/excel/${parseInt(new Date(beginTimes).getTime() / 1000)}/${parseInt(new Date(endTimes).getTime() / 1000)}`)
        }).catch(() => {});
      },
      WordDownloadHandle() {
        let {beginTimes, endTimes} = this.$refs.selecttime;
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm('确定将资产运维操作统计报表以Word格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportOperationCount/word/${parseInt(new Date(beginTimes).getTime() / 1000)}/${parseInt(new Date(endTimes).getTime() / 1000)}`)
        }).catch(() => {});
      },
      PdfDownloadHandle() {
        let {beginTimes, endTimes} = this.$refs.selecttime;
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm('确定将资产运维操作统计报表以Pdf格式导出？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportOperationCount/pdf/${parseInt(new Date(beginTimes).getTime() / 1000)}/${parseInt(new Date(endTimes).getTime() / 1000)}`)
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="stylus">
</style>
