<!--资产账号变更情况统计-->
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
    <RealPageTable
      :ajax-obj="ajaxObj">
      <s-table-column prop="itCompName" label="设备名称"></s-table-column>
      <s-table-column prop="address" label="IP"></s-table-column>
      <s-table-column prop="location" label="位置"></s-table-column>
      <s-table-column prop="account" label="账号"></s-table-column>
      <s-table-column prop="accountType" label="账号类型"></s-table-column>
      <s-table-column prop="creatTime" label="创建时间"></s-table-column>
      <s-table-column prop="isUp" label="密码是否变更"></s-table-column>
    </RealPageTable>
  </div>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  import SelectTime from '@/components/selectTime/SelectTime.vue'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    components: {
      SelectTime,
      RealPageTable
    },
    data () {
      return {
        period: 'day',
        ajaxObj: {
          type: 'post',
          url: '/hierarchyProtection/countItcompAsset',
          params: {
            condition: {}
          }
        }
      }
    },
    mounted() {
      this.getList()
    },
    methods: {
      getList() {
        let {beginTimes, endTimes} = this.$refs.selecttime
        let startTime = beginTimes ? new Date(beginTimes).getTime() / 1000 : 0
        let endTime = endTimes ? new Date(endTimes).getTime() / 1000 : Number.parseInt(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000)
        let params = {
          startTime: startTime,
          endTime: endTime
        };
        this.ajaxObj.params.condition = params;
      },
      DownloadHandle(type) {
        let {beginTimes, endTimes} = this.$refs.selecttime
        let startTime = beginTimes ? new Date(beginTimes).getTime() / 1000 : 0
        let endTime = endTimes ? new Date(endTimes).getTime() / 1000 : Number.parseInt(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1).getTime() / 1000)
        this.$confirm(`确定将资产账号变更情况统计以${type}格式导出？`, '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          Download(`/hierarchyProtection/exportCountItcompAsset/${type}/${startTime}/${endTime}`)
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="stylus">
</style>
