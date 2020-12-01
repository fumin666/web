<template>
  <section>
    <s-scrollbar wrap-style="max-height:660px;">
      <s-table-page
        :data='cfmPassLogDetail'


        :header-actions='getListActionsDef()'
        :header-search='getLogSearchDef()'>
        <s-table-column
          prop="taskName"
          label="任务名称"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="beginTime"
          label="开始时间"
          sortable
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
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="accountName"
          label="验证账号"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          prop="resultStr"
          label="验证结果"
          show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'

  export default{
    data() {
      return {
        cfmPassLogDetail: [],
        resultArr: ['成功', '失败', '异常', '旧密码错误', '位置错误', '端口错误', '脚本错误', 'TNS信息错误', '管理账号密码错误', '未关联自定义脚本']
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
      // 表头操作功能初始化
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: 'Excel报表',
            click() {
              Download(`tPasswdChangeTask/exportPassLogInfo/${self.logInfo.uuid}`, {
                logTemplate: '导出|验证密码日志>导出验证结果(Bulk_password_authentication.xls)'
              })
            },
            icon: 'excel'
          }]
        }
      },
      // 表格搜索
      getLogSearchDef() {
        return {
          width: 6,
          offset: 12,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'beginTime', 'endTime', 'deviceIp', 'accountName', 'resultStr']
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
        logTemplate: '查看|验证密码日志>改密任务(#taskName#)'
      }).then(res => {
        let resData = res.data
        if (resData && resData instanceof Array) {
          this.cfmPassLogDetail = resData
          // this.cfmPassLogDetail.forEach(list => {
          //   this.$set(list, 'resultStr', this.resultArr[list.result])
          // })
        }
      })
    }
  }
</script>
