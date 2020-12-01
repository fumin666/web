<template>
  <s-scrollbar wrap-class="scrollMaxheight" @onScroll="hideSelect">
    <view-module :data="datalist"></view-module>
    <s-form ref="addForm" :model="addForm" label-width="120px" :rules="rules">
      <s-form-item label="选择资产" prop="scriptDir" class="apply-special-table">
        <s-table-page :data='hostList'


                  :pagination-def="getPaginationDef()"
                  :header-search='getNewSearchDef()'
                  @selection-change="handleSelectionChange"
                  ref="hostTable">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址">
          </s-table-column>
          <s-table-column
            prop="port"
            label="端口">
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-form-item>
      <s-form-item label="审批历史">
        <s-table-page :data="historyList"
                   :paginationShow="false">
          <s-table-column
            prop="approveUser"
            label="审批人">
          </s-table-column>
          <s-table-column
            prop="createTime"
            label="审批时间">
          </s-table-column>
          <s-table-column
            prop="typeStr"
            label="审批结论">
          </s-table-column>
          <s-table-column
            prop="approveCont"
            label="审批综述">
          </s-table-column>
        </s-table-page>
      </s-form-item>
      <s-form-item label="审批" prop="type">
        <s-select v-model="addForm.type" ref="hideSelect">
          <s-option v-for="item in approveList" :key="item.id" :label="item.approveAuthName" :value="item.uuid" ></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="审批综述" prop="approveCont">
        <s-input type="textarea" v-model="addForm.approveCont" :rows="5"></s-input>
      </s-form-item>
    </s-form>
  </s-scrollbar>
</template>

<script type="text/babel">

import viewModule from '@/components/commonView/DialogView'
import $axios from 'sunflower-ajax'
export default {
  data() {
    return {
      datalist: [],
      approveList: [],
      hostList: [],
      historyList: [],
      addForm: {
        approveCont: '',
        taskUuid: this.taskUuid,
        type: '',
        devices_checked: [],
        uuid: this.uuid
      },
      rules: {
        approveCont: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
      }
    }
  },
  props: {
    uuid: {
      type: String
    },
    taskUuid: {
      type: String
    }
  },
  methods: {
    getNewSearchDef() {
      return {
        width: 6,
        placeholder: '查询条件',
        searchProps: ['itcompName', 'controlAdderss', 'protocolName']
      }
    },
    getPaginationDef() {
      return {
        layout: 'prev, pager, next'
      }
    },
    handleSelectionChange(val) {
      let uuids = []
      for (let v of val) {
        uuids.push(v.uuid)
      }
      this.addForm.devices_checked = uuids
    },
    hideSelect() {
      this.$refs['hideSelect'].visible = false
    }
  },
  created() {
    $axios.get(`/operationBatchExcute/getAddFormInfo/${this.taskUuid}`).then((res) => {
      let viewInfo = res.data.ScriptAudit
      this.approveList = res.data.ApproveType
      this.hostList = res.data.ScriptTaskDevices
      this.historyList = res.data.ScriptAuditResultList
      this.datalist = [
        {
        name: '标题',
        content: viewInfo.taskName
        },
        {
          name: '申请者',
          content: viewInfo.userRealName
        },
        {
          name: '申请者领导',
          content: viewInfo.approveUser
        },
        {
          name: '执行周期',
          content: viewInfo.strPeriod
        },
        {
          name: '状态',
          content: viewInfo.taskStatus
        },
        {
          name: '开始时间',
          content: viewInfo.beginTime
        },
        {
          name: '结束时间',
          content: viewInfo.endTime
        },
        {
          name: '脚本目录',
          content: viewInfo.scriptDir
        },
        {
          name: '文件列表',
          content: viewInfo.files.join(',')
        },
        {
          name: '文件服务器',
          content: viewInfo.archiveDeviceIp
        },
        {
          name: '结果存放目录',
          content: viewInfo.ftpServerDir
        },
        {
          name: '邮件接收者',
          content: viewInfo.mailbox
        },
        {
          name: '备注',
          content: viewInfo.remark
        }
      ]
      this.$nextTick(() => {
        this.hostList.map((item) => {
          this.$refs.hostTable.toggleRowSelection(item, true)
        })
      })
    });
  },
  components: {
    viewModule
  }
}
</script>

