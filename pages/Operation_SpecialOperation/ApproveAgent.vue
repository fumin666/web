/**
* Created by songyf on 2019/4/22.
* 运维审批-代理审批.
*/
<template>
  <div>
    <s-table-page :data='agentData'
              :header-search="getSearchDef()">
      <s-table-column
        prop="specialoperCode"
        label="运维号">
      </s-table-column>
      <s-table-column
        prop="title"
        label="标题">
      </s-table-column>
      <s-table-column
        prop="specialoperTypeName"
        label="运维类型">
      </s-table-column>
      <s-table-column
        prop="applyUserName"
        label="申请人">
      </s-table-column>
      <s-table-column
        prop="proxyUserName"
        label="被代理人">
      </s-table-column>
      <s-table-column
        prop="applyStatus"
        label="审批状态">
      </s-table-column>
      <s-table-column
        prop="startTime"
        label="开始时间">
      </s-table-column>
      <s-table-column
        prop="endTime"
        label="结束时间">
      </s-table-column>
      <s-table-column label="操作" width="120">
        <template slot-scope="scope">
          <i title='处理' class="iconfont icon-flag" @click="setOrder(scope.row)"></i>
<!--          <i title='查看审批详情' class="iconfont icon-config-audit" @click="getApprovalList(scope.row.applyUuid)"></i>-->
        </template>
      </s-table-column>
    </s-table-page>
    <!--处理弹窗-->
    <s-dialog v-model="workOrderBox.show" v-if="workOrderBox.show" width="850px" title="工单处理">
      <ApplySpecial ref="AddApply" :model="workOrderBoxModel" :tableRowData="tableRowData"></ApplySpecial>
      <template slot="footer" class="dialog-footer">
        <s-button @click="setWorkOrderBox">处理</s-button>
        <s-button type="cancel" @click="workOrderBox.show = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看详情弹框-->
    <s-dialog v-model="viewDialog" v-if="viewDialog" width="70%" title="查看详情">
      <s-table-page :data='approvalList'>
        <s-table-column
          prop="approvalTime"
          label="审批时间">
        </s-table-column>
        <s-table-column
          prop="approvalUserName"
          label="审批人">
        </s-table-column>
        <s-table-column
          prop="applyStatus"
          label="审批状态">
        </s-table-column>
        <s-table-column
          prop="approvalComments"
          label="审批意见">
        </s-table-column>
      </s-table-page>
    </s-dialog>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import ApplySpecial from './dialog/SpecialApproveDialog.vue';
  export default {
    data () {
      return {
        agentData: [],
        viewDialog: false,
        approvalList: [],
        workOrderBox: {
          show: false,
          id: {},
          child: {},
          assetCurrent: [],
          workflowType: null,
          tabIndex: 0,
          savebtn: true
        }
      }
    },
    components: {
      ApplySpecial
    },
    created() {
      this.getAgentList()
    },
    methods: {
      getAgentList() {
        $axios.get('/specialOperationApply/getAuditApproveDetailList').then(res => {
          this.agentData = res.data
        });
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['specialoperCode', 'title', 'specialoperTypeName', 'applyUserName', 'proxyUserName', 'approvalUserName', 'applyStatus', 'startTime', 'endTime']
        }
      },
      getApprovalList(applyUuid) {
        $axios.post(`/specialOperationApply/getApplySpecialoperAuditDetailList/${applyUuid}`).then(res => {
          if (res.status === 200) {
            this.viewDialog = true
            this.approvalList = res.data
          } else {
            this.$message({
              message: '获取审批详情失败，请重试',
              type: 'error'
            });
          }
        });
      },
      setOrder(row) {
        let self = this;
        $axios.get(`/specialOperationApply/getSpecialApplyDealOrder/${row.applyUuid}/${row.approvalUuid}`, {
          data: [row],
          logTemplate: '执行|运维审批>运维号(#specialoperCode#)'
        })
          .then(res => {
            if (res.status === 200) {
              self.workOrderBoxModel = res.data;
              self.tableRowData = row;
              self.workOrderBox.show = true;
            } else {
              self.$message({
                message: '获取处理工单失败，请重试',
                type: 'error'
              })
            }
          })
      },
      setWorkOrderBox() {
        let form = this.$refs['AddApply'].addForm
        if (form.applyStatus === '') {
          this.$message({
            message: '请填写审批信息',
            type: 'error'
          });
          return false
        }
        if (form.applyResourceUuidList.length < 1) {
          this.$message({
            message: '您还没有选择资产',
            type: 'error'
          });
          return false
        }
        let param = {
          applyUuid: form.applyUuid, // 特殊运维申请清单
          applyCommandUuidList: form.applyCommandUuidList, // 命令列表
          applyResourceUuidList: form.applyResourceUuidList, // 资产列表
          applyStatus: form.applyStatus, // 0-未审批，1-审批通过，2-审批拒绝，3-审批拟通过，4-审批拟拒绝
          approvalUuid: form.approvalUuid, // 待审批单uuid
          approvalType: form.approvalType, // 待审批单类型
          comments: form.comments, // 审批意见
          poxyUuid: form.poxyUuid // 代理信息的uud,当为代理审批的时候，需要回传此参数
        };
        $axios.post('/specialOperationApply/dealSpecialApply', param)
          .then(res => {
            if (res.data.state) {
              this.$message({
                message: res.data.errormsg,
                type: 'success'
              });
              this.workOrderBox.show = false;
              this.getPendingList();
            } else {
              this.$message({
                message: res.data.errormsg,
                type: 'error'
              });
            }
          });
        this.workOrderBox.show = false;
      }
    }
  }
</script>

