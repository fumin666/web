<template>
  <section>
    <s-scrollbar wrap-style="max-height:660px;">
      <s-table-page
        :data='changePwdLogDetail'


        :header-search='getLogSearchDef()'>
        <s-table-column
          prop="taskName"
          label="任务名称"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="beginTime"
          label="开始时间"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="endTime"
          label="结束时间"
          sortable
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="deviceIp"
          label="目标机器"
          sortable
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="accountName"
          label="改密账号">
        </s-table-column>
        <s-table-column
          prop="resultStr"
          label="改密结果">
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        changePwdLogDetail: []
      }
    },

    props: {
      logInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // 表格搜索
      getLogSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'beginTime', 'endTime', 'deviceIp', 'accountName']
        }
      }
    },
    created() {
      let sendData = {
        taskuuid: this.logInfo.taskUuid,
        loguuid: this.logInfo.uuid
      }
      $axios.post('/changePwdLog/view', sendData, {
        data: [{taskName: this.logInfo.taskName}],
        logTemplate: '查看|改密任务日志>改密任务(#taskName#)'
      }).then(res => {
        let resData = res.data
        if (resData && resData instanceof Array) {
          this.changePwdLogDetail = resData
        }
      })
    }
  }
</script>
