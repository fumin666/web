/**
* Created by songyf on 2019/10/23.
* 运维审批-审批查看详情.
*/

<template>
  <s-dialog v-model="dialogFlag" title="查看详情" width="1040px" class="">
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
              <s-table-page :data="cmdList">
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
        <s-row>
          <s-col :span="3">
            <div class="grid-content bg-purple">审批详情：</div>
          </s-col>
          <s-col :span="21">
            <div class="grid-content bg-purple-light table-view">
              <s-table-page :data="auditDetails">
                <s-table-column
                  prop="approvalUserName"
                  label="审批人">
                </s-table-column>
                <s-table-column
                  prop="approvalTime"
                  label="审批时间">
                </s-table-column>
                <s-table-column
                  prop="applyStatus"
                  label="审批状态">
                </s-table-column>
                <s-table-column
                  prop="approvalComments"
                  label="审批意见" show-overflow-tooltip>
                </s-table-column>
              </s-table-page>
            </div>
            <div class="clr"></div>
          </s-col>
        </s-row>
      </div>
    </s-scrollbar>
  </s-dialog>
</template>

<script>

  import {Download} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        dialogFlag: false,
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
        auditDetails: this.viewdata.auditDetails,
        isShowCmd: true
      }
    },

    props: {
      value: {
        type: Boolean,
        default: false
      },
      viewdata: {
        type: Object
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
    },
    created() {
      if (this.viewdata.specialoperCategory === 0) {
        this.isShowCmd = false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">

</style>

