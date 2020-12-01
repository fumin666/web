<template>
  <s-scrollbar wrap-class="scrollMaxheight">
    <div class="userInfo">
      <s-row v-for="(item, index) in data" v-if="item.content !== null" :key="item.id">
        <s-col :span="3">
          <div class="grid-content bg-purple">{{item.name}}</div>
        </s-col>
        <s-col :span="21">
          <div class="grid-content bg-purple-light">{{item.content}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="3">
          <div class="grid-content bg-purple">资产列表：</div>
        </s-col>
        <s-col :span="21">
          <div class="grid-content bg-purple-light table-view">
            <s-table-page :data="hostList">
              <s-table-column
                prop="device_account"
                label="账号">
              </s-table-column>
              <s-table-column
                prop="device_ip"
                label="IP地址">
              </s-table-column>
              <s-table-column
                prop="device_port"
                label="端口">
              </s-table-column>
              <s-table-column
                prop="device_protocol"
                label="协议">
              </s-table-column>
              <s-table-column
                prop="approveStatus"
                label="状态"
                :formatter="formatterStatus">
              </s-table-column>
            </s-table-page>
          </div>
          <div class="clr"></div>
        </s-col>
      </s-row>
      <s-row v-if="isShowCmd">
        <s-col :span="3">
          <div class="grid-content bg-purple">命令列表：</div>
        </s-col>
        <s-col :span="21">
          <div class="grid-content bg-purple-light table-view">
            <s-table-page :data="cmdList"
                       >
              <s-table-column
                prop="accountName"
                label="账号">
              </s-table-column>
              <s-table-column
                prop="deviceIp"
                label="IP地址">
              </s-table-column>
              <s-table-column
                prop="commandname"
                label="命令">
              </s-table-column>
              <s-table-column
                prop="commandParam"
                label="参数">
              </s-table-column>
              <s-table-column
                prop="commandBwTypeName"
                label="命令类型">
              </s-table-column>
              <s-table-column
                prop="approveStatus"
                label="状态"
                :formatter="formatterStatus">
              </s-table-column>
            </s-table-page>
          </div>
          <div class="clr"></div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="3">
          <div class="grid-content bg-purple">附件：</div>
        </s-col>
        <s-col :span="21">
          <div class="grid-content bg-purple-light">
            <span @click="downLoadFile(item.uuid)" v-for="item in downloadList" :key="item.id" style="color: #00a3e4;cursor:pointer">
              {{item.fileName}}&nbsp;&nbsp;
            </span>
          </div>
        </s-col>
      </s-row>
    </div>
  </s-scrollbar>
</template>

<script type="text/babel">

  import {Download} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        data: [
          {
          name: '运维号：',
          content: this.viewdata.specialoperCode
          },
          {
            name: '标题：',
            content: this.viewdata.specialoperName
          },
          {
            name: '申请者：',
            content: this.viewdata.userName
          },
          {
            name: '待审批人：',
            content: this.viewdata.approveUser
          },
          {
            name: '运维类型：',
            content: this.viewdata.specialoperTypeName
          },
          {
            name: '审批状态：',
            content: this.viewdata.applyStatus
          },
          {
            name: '开始时间：',
            content: this.viewdata.startTime
          },
          {
            name: '结束时间：',
            content: this.viewdata.endTime
          },
          {
            name: '内容描述：',
            content: this.viewdata.specialoperCont
          }
        ],
        cmdList: this.viewdata.relcommandList,
        hostList: this.viewdata.relresourceList,
        downloadList: this.viewdata.relfileList,
        isShowCmd: true
      }
    },
    props: {
      viewdata: {
        type: Object
      }
    },
    created() {
      if (this.viewdata.specialoperCategory === 0) {
        this.isShowCmd = false
      }
    },
    methods: {
      formatterStatus(item) {
        return item.approveStatus === 0 ? '批准' : '未批准';
      },
      downLoadFile(uuid) {
        Download(`/specialOperationApply/downLoadApplyFile/${uuid}`)
      },
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
          uuids.push(v.accountUuid)
        }
        this.addForm.devices_checked = uuids
      }
    }
  }
</script>
