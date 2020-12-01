<template>
  <div>
    <s-dialog v-model="dialogFlag" title="待我审批"  width="70%">
      <s-table-page
        :data='pendingLists'
        >
        <s-table-column prop="specialoperCode" label="运维号">
        </s-table-column>
        <s-table-column prop="title" label="摘要">
        </s-table-column>
        <s-table-column prop="specialoperTypeName" label="运维类型">
        </s-table-column>
        <s-table-column prop="startTime" label="开始时间">
        </s-table-column>
        <s-table-column prop="endTime" label="结束时间">
        </s-table-column>
        <s-table-column prop="applyStatus" label="审批状态">
        </s-table-column>
        <s-table-column prop="sendEmail" label="是否发送邮件">
          <template slot-scope="scope">
            {{scope.row.sendEmail ? '是' : '否'}}
          </template>
        </s-table-column>
        <s-table-column prop="applyUserName" label="提交人">
        </s-table-column>
        <s-table-column prop="applyCreateTime" label="提交时间">
        </s-table-column>
        <s-table-column label="操作" width='200'>
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="viewHandler(scope.row)"></i>
          <i title='处理' class="iconfont icon-flag" @click="setOrder(scope.row)"></i>
<!--          <i title='查看审批详情' class="iconfont icon-config-audit" @click="getApprovalList(scope.row.applyUuid)"></i>-->
        </template>
      </s-table-column>
      </s-table-page>
    </s-dialog>
    <!--查看-->
    <s-dialog
      v-model="SeeDialog"
      v-if="SeeDialog"
      width="70%"
      title="申请信息">
      <view-special :viewdata="viewdata"></view-special>
    </s-dialog>
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
        <s-table-page :data='approvalList' >
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

<script>
  import $axios from 'sunflower-ajax'

  import ApplySpecial from './SpecialApproveDialog.vue';
  import viewSpecial from './ViewSpecialApplycation'
  export default {
    components: {
      ApplySpecial,
      viewSpecial
    },
    data() {
      return {
        dialogFlag: false,
        viewDialog: false,
        SeeDialog: false,
        pendingLists: [],
        workOrderBox: {
        show: false,
        viewdata: {},
        id: {},
        child: {},
        assetCurrent: [],
        workflowType: null,
        tabIndex: 0,
        savebtn: true
        },
        tableRowData: {}, // 当前行的所有数据
        approvalList: []

      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
    },
    mounted() {
      this.getPendingList()
    },
    methods: {
      getPendingList() {
        $axios.post('/omaIndex/getMyApprovalOrderList').then(res => {
          if (res.status === 200) {
            this.pendingLists = res.data
          }
        })
      },
      setOrder(row) {
        let self = this;
        $axios.get(`/specialOperationApply/getSpecialApplyDealOrder/${row.applyUuid}/${row.approvalUuid}`)
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
      },
      viewHandler(row) {
        $axios.get(`/specialOperationApply/getSpecialoperApplyDetail/${row.applyUuid}`).then(res => {
          this.SeeDialog = true
          this.viewdata = res.data
        })
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
