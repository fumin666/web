<template>
  <section id="two-content" class="oper-subpage-margin">
    <s-form :inline="true" :model="formInline" label-width="90px" style="margin-bottom: 20px" class="search_form">
      <div>
        <s-form-item label="会话类型：">
          <s-select  v-model="formInline.sessionTypeUuid" clearable filterable>
            <s-option v-for="item in specialType" :key="item.id" :label="item.specialoperTypeName" :value="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="协议名：">
          <s-select v-model="formInline.protocolName" clearable filterable>
            <s-option v-for="(item, index) in protocolName" :key="index" :label="item" :value="item"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="审核状态：">
          <s-select v-model="formInline.sessionAuditResult" clearable filterable>
            <s-option label="未审核" value="0"></s-option>
            <s-option label="合规" value="1"></s-option>
            <s-option label="违规" value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="运维号：">
          <s-input v-model="formInline.sessionOpnumber"></s-input>
        </s-form-item>
        <s-form-item label="客户端IP：">
          <s-input v-model="formInline.clientIp"></s-input>
        </s-form-item>
        <s-form-item label="目标资产IP：">
          <s-input v-model="formInline.deviceIP"></s-input>
        </s-form-item>
        <s-form-item label="端口：">
          <s-input v-model="formInline.port"></s-input>
        </s-form-item>
        <s-form-item label="账号：">
          <s-input v-model="formInline.accountName"></s-input>
        </s-form-item>
        <s-form-item label="访问时间段：">
          <s-date-picker v-model="formInline.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="formInline.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="getSearchActionDef">查询</s-button>
      </div>
    </s-form>
    <s-page-infinite-table
      ref="infiniteTable"
      :border='false'
      loading-text="正在加载中"
      :ajax-obj="axiosObj"
      :startAjax="getFlag">
      <s-table-column prop="sessionId" label="会话ID" show-overflow-tooltip></s-table-column>
      <s-table-column prop="sessionType" label="会话类型" show-overflow-tooltip></s-table-column>
      <s-table-column prop="sessionNumber" label="运维号" show-overflow-tooltip></s-table-column>
      <s-table-column prop="oprateUser" label="操作人" show-overflow-tooltip></s-table-column>
      <s-table-column prop="clientIp" label="客户端IP" show-overflow-tooltip></s-table-column>
      <s-table-column prop="deviceIp" label="目标资产IP" show-overflow-tooltip></s-table-column>
      <s-table-column prop="port" label="端口" show-overflow-tooltip></s-table-column>
      <s-table-column prop="protocolName" label="协议" show-overflow-tooltip></s-table-column>
      <s-table-column prop="accountName" label="账号" show-overflow-tooltip></s-table-column>
      <s-table-column width="200" prop="startTime" label="访问时间" show-overflow-tooltip></s-table-column>
      <s-table-column prop="timeLongView" label="时长" show-overflow-tooltip></s-table-column>
      <s-table-column prop="auditResult" label="审核状态" show-overflow-tooltip></s-table-column>
    </s-page-infinite-table>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  export default {
    data() {
      return {
        formInline: {
          sessionTypeUuid: '',
          doubleUserUuid: '',
          protocolName: '',
          sessionStatus: '',
          sessionAuditResult: '',
          sessionOpnumber: '',
          oriSessionUuid: '',
          clientIp: '',
          deviceIP: '',
          port: '',
          accountName: '',
          startTime: null,
          endTime: null
        },
        lists: [],
        getFlag: true,
        axiosObj: {
          type: 'post',
          url: '/basicOperation/getOperationLogList',
          params: {
            condition: {

            }
          }
        },
        specialType: [],
        protocolName: [],
        doubleUser: []
      }
    },
    methods: {
      getSearchActionDef() {
        let params = Object.assign({}, this.formInline)
        params.startTime = params.startTime !== null ? Date.parse(new Date(params.startTime)) / 1000 : null;
        params.endTime = params.endTime !== null ? Date.parse(new Date(params.endTime)) / 1000 : null;
        this.axiosObj.params.condition = params
      },
      getDateRangeStart() {
        let start = this.searchForm.startTime ? new Date(this.searchForm.startTime).getTime() / 1000 : 0
        let end = this.searchForm.endTime ? new Date(this.searchForm.endTime).getTime() / 1000 : 0
        if (end) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.startTime = '';
          }
        }
      },
      getDateRangeEnd() {
        let start = this.searchForm.startTime ? new Date(this.searchForm.startTime).getTime() / 1000 : 0
        let end = this.searchForm.endTime ? new Date(this.searchForm.endTime).getTime() / 1000 : 0
        if (start) {
          if (start > end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.endTime = '';
          }
        }
      }
    },
    components: {
      sPageInfiniteTable
    },
    created() {
      $axios.get('basicOperation/initSearchCondtiton').then(response => {
        this.specialType = response.data.specialType;
        this.protocolName = response.data.protocolName;
        this.doubleUser = response.data.doubleUser;
      })
    }
  }
</script>
<style lang="stylus">
.s-table-border th{
  border-right: 0px solid #e0e0e0;
  border-bottom: 0px solid #e0e0e0;
}
</style>

