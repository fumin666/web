<template>
  <s-scrollbar wrap-class="scrollMaxheight">
    <div class="userInfo">
      <s-row v-for="(item, index) in data" :key="item.id">
        <s-col :span="6">
          <div class="grid-content bg-purple">{{item.name}}</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light ellipsis" :title="item.content">{{item.content}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">文件列表：</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light ellipsis" :title="viewdata.ScriptAudit.files.toString()">{{viewdata.ScriptAudit.files.toString()}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">资产列表：</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light table-view">
            <s-table-page :data="hostList"
                          :page-layout="getPaginationDef()">
              <s-table-column
                prop="accountName"
                label="账号">
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
                label="协议">
              </s-table-column>
              <s-table-column
                prop="approveStatus"
                label="状态">
                <template slot-scope="scope">
                  {{scope.row.approveStatus === 1 ? '批准' : '未批准'}}
                </template>
              </s-table-column>
            </s-table-page>
          </div>
          <div class="clr"></div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="6">
          <div class="grid-content bg-purple">审批历史：</div>
        </s-col>
        <s-col :span="18">
          <div class="grid-content bg-purple-light table-view">
            <s-table-page :data="historyList"
                          :page-layout="getPaginationDef()">
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
          </div>
          <div class="clr"></div>
        </s-col>
      </s-row>
    </div>
  </s-scrollbar>
</template>

<script type="text/babel">
  export default {
    data() {
      return {
        data: [
          {
            name: '标题：',
            content: this.viewdata.ScriptAudit.taskName
          },
          {
            name: '申请者：',
            content: this.viewdata.ScriptAudit.userRealName
          },
          {
            name: '申请者领导：',
            content: this.viewdata.ScriptAudit.approveUser
          },
          {
            name: '执行周期：',
            content: this.viewdata.ScriptAudit.strPeriod
          },
          {
            name: '状态：',
            content: this.viewdata.ScriptAudit.taskStatus
          },
          {
            name: '开始时间：',
            content: this.viewdata.ScriptAudit.beginTime
          },
          {
            name: '结束时间：',
            content: this.viewdata.ScriptAudit.endTime
          },
          {
            name: '脚本目录：',
            content: this.viewdata.ScriptAudit.scriptDir
          },
          {
            name: '文件服务器：',
            content: this.viewdata.ScriptAudit.archiveDeviceIp
          },
          {
            name: '结果存放目录：',
            content: this.viewdata.ScriptAudit.ftpServerDir
          },
          {
            name: '邮件接收者：',
            content: this.viewdata.ScriptAudit.mailbox
          },
          {
            name: '备注：',
            content: this.viewdata.ScriptAudit.remark
          }
        ],
        hostList: this.viewdata.ScriptTaskDevices,
        historyList: this.viewdata.ScriptAuditResultList,
        details: '',
        createTime: ''
      }
    },
    props: {
      viewdata: {
        type: Object
      }
    },
    created() {
      for (const v of this.viewdata.ApproveType) {
        if (v.uuid === this.viewdata.ScriptAudit.type) {
          this.details = v.approveAuthName
        }
      }
      (this.viewdata.ScriptAudit.createTime.substr(0, 4) === '1970') ? this.createTime = '' : this.createTime = this.viewdata.ScriptAudit.createTime
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
        return 'prev, pager, next'
      },
      handleSelectionChange(val) {
        let uuids = []
        for (let v of val) {
          uuids.push(v.accountUuid)
        }
        this.addForm.devices_checked = uuids
      }
    }
  }
</script>
