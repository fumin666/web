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
            <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
            <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
            <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
          </s-row>
        </s-col>
      </s-row>
    </section>
    <s-table-page
      :data="tableData">
      <s-table-column
        prop="level"
        label="事件级别">
      </s-table-column>
      <s-table-column
        prop="count"
        label="事件条数">
      </s-table-column>
      <s-table-column
        prop="recoverCount"
        label="解决事件数">
      </s-table-column>
      <s-table-column
        prop="noRecoverCount"
        label="遗留事件数">
      </s-table-column>
      <s-table-column
        label="解决率">
        <template slot-scope="scope">
          <span>{{scope.row.percent}}%</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="rangeRecover"
        label="平均恢复时间">
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
        let params = {startTime: new Date(beginTimes).getTime() / 1000, endTime: new Date(endTimes).getTime() / 1000}
        $axios.post(`/hierarchyProtection/countIncident/`, params).then((res) => {
          this.tableData = res.data || []
        })
      },
      DownloadHandle(type) {
        let {beginTimes, endTimes} = this.$refs.selecttime
        beginTimes = beginTimes || null;
        endTimes = endTimes || null;
        this.$confirm(`确定将事件故障统计报表以${type}格式导出？`, '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportcountIncident/${type}/${parseInt(new Date(beginTimes).getTime() / 1000)}/${parseInt(new Date(endTimes).getTime() / 1000)}`)
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="stylus">
</style>
