<template>
  <div>
    <s-dialog v-model="dialogFlag" title="他人已审批"  width="70%">
      <s-table-page :data='lists'
                id="3333"

                :has-action-col='false'
                :header-search='getNewSearchDef()'>
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
          prop="applyStatus"
          label="审批状态">
        </s-table-column>
        <s-table-column
          prop="startTime"
          label="开始时间"
          show-tool->
        </s-table-column>
        <s-table-column
          prop="endTime"
          label="结束时间">
        </s-table-column>
        <s-table-column label="操作" width="200">
          <template slot-scope="scope">
            <i v-if="isShow(scope.row.oprType).includes(1)" class="iconfont icon-eye" title="查看" @click="viewHandler(scope.row)"></i>
            <i v-if="isShow(scope.row.oprType).includes(6)" class="iconfont icon-delegate" @click="autoApprovalHandler(scope.row)" title="自动审批"></i>
            <i v-if="isShow(scope.row.oprType).includes(2)" title='查看审批详情' class="iconfont icon-config-audit" @click="gotoApproval(scope.row)"></i>
            <i v-if="isShow(scope.row.oprType).includes(4)" class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
            <i v-if="isShow(scope.row.oprType).includes(3)" class="iconfont icon-special-oper" title="运维" @click="opsHandler(scope.row)"></i>
            <i v-if="isShow(scope.row.oprType).includes(5)" class="iconfont icon-order" title='查看作废详情' @click="getcancelReason(scope.row.applyUuid)"></i>
          </template>
        </s-table-column>
      </s-table-page>

    </s-dialog>
            <!--查看-->
    <s-dialog
      v-model="viewDialog"
      v-if="viewDialog"
      width="70%"
      title="申请信息">
      <view-special :viewdata="viewdata"></view-special>
    </s-dialog>
        <!--自动审批-->
    <s-dialog
      v-model="approvalDialog"
      v-if="approvalDialog"
      width="600px"
      title="自动审批">
      <auto-approval :initData="initViewdata" ref="autoApprovalDialog"></auto-approval>
      <template slot="footer" class="dialog-footer">
        <s-button @click="sendMessage">发送短信</s-button>
        <s-button @click="approvalByAuto">自动审批</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="autoViewDialog"
      v-if="autoViewDialog"
      width="800px"
      title="审批详情">
      <s-table :data="autoViewList">
        <s-table-column label="申请人" prop="applyUserName"></s-table-column>
        <s-table-column label="审批人" prop="approveUserName"></s-table-column>
        <s-table-column label="审批状态" prop="type"></s-table-column>
        <s-table-column label="审批时间" prop="replyTime"></s-table-column>
      </s-table>
    </s-dialog>
        <!--查看详情弹框-->
    <s-dialog v-model="viewApproveDialog" v-if="viewApproveDialog" width="70%" title="查看详情">
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
    <!--运维弹框-->
    <s-dialog
      v-model="specialDialog"
      v-if="specialDialog"
      width="900px"
      title="特殊运维">
      <spec-list :uuid="uuids" @showOperation="operation"></spec-list>
      <template slot="footer" class="dialog-footer">
        <s-button type="cancel" @click="specialDialog = false">关闭</s-button>
      </template>
    </s-dialog>
            <!--作废原因查看的窗口-->
    <s-dialog
      v-model="cancellationDialog"
      v-if="cancellationDialog"
      width="600px"
      title="作废原因">
      <div v-for="item in cancelReason">
        <s-row>
          <s-col :span="6">
            <div class="grid-content bg-purple">{{item.name}}</div>
          </s-col>
          <s-col :span="18">
            <div class="grid-content bg-purple-light" style="height:100%;word-wrap: break-word">{{item.val}}</div>
          </s-col>
        </s-row>
      </div>
    </s-dialog>
    <!--运维访问(new)-->
    <s-dialog
      v-model="opsAccessNewDialog"
      v-if="opsAccessNewDialog"
      width="700px"
      title="运维访问">
      <ops-access-new :rowData="rowData" :isOpen="isOpen" ref="opsAccessNew"></ops-access-new>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOpsAccessNew">运维</s-button>
        <s-button type="cancel" @click="opsAccessNewDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import OpsAccessNew from '@/pages/Operation_Equipment/OpsAccessNew';
  import viewSpecial from './ViewSpecialApplycation'
  import specList from './OpsEquipment'
  import autoApproval from './AutomaticApproval'
  const VNC = '00000000000000000000000000000078';
  const RDP = '00000000000000000000000000000077';
  const account = 'noneaccount000000000000000000000';
  const mysql = '00000000000000000000000000000084';
  const sqlserver = '00000000000000000000000000000085';
  const db2 = '00000000000000000000000000000081';
  const informix = '00000000000000000000000000000082';
  const sybase = '00000000000000000000000000000086';
  const oracle = '00000000000000000000000000000080';
  const plsql = '00000000000000000000000000000114';
  const toadoracle = '00000000000000000000000000000120';
  const SSH = '00000000000000000000000000000072';
  const SFTP = '00000000000000000000000000000074';
  const mssqlserver = '00000000000000000000000000000113';
  export default {
    components: {
      viewSpecial,
      autoApproval,
      specList,
      OpsAccessNew
    },
    data() {
      return {
        dialogFlag: false,
        viewDialog: false,
        opsAccessNewDialog: false,
        specialDialog: false,
        approvalDialog: false,
        autoViewDialog: false,
        viewApproveDialog: false,
        cancellationDialog: false,
        approvalList: [],
        autoViewList: [],
        cancelReason: [],
        initViewdata: {},
        initdata: {
          specialoperUuid: '',
          approveUserUuid: '',
          userPasswd: ''
        },
        viewdata: {},
        lists: [],
        tableData: [],
        specialOperateCode: ''

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
      this.getLists()
    },
    methods: {
      getNewSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['specialoperCode', 'specialoperName', 'specialoperTypeName', 'applyStatus', 'startTime', 'endTime']
        }
      },
      getLists() {
        $axios.get('/omaIndex/getMySubApprovedOrder').then(res => {
          this.lists = res.data
        });
      },
      isShowDelegate(row) {
        let flag
        (row.applyStatus === '未审批' && row.specialoperCategory === 0) ? flag = true : flag = false
        return flag
      },
      isShow(status) {
        let arr = status.split('').map(Number)
        return arr
      },
      viewHandler(row) {
        $axios.get(`/specialOperationApply/getSpecialoperApplyDetail/${row.applyUuid}`).then(res => {
          this.viewDialog = true
          this.viewdata = res.data
        })
      },
      autoApprovalHandler(row) {
        $axios.get('/specialOperationApply/getApproveLeader').then(res => {
          this.approvalDialog = true
          this.initViewdata = res.data
          this.initdata.specialoperUuid = row.uuid
        })
      },
      approvalByAuto() {
        let form = this.$refs['autoApprovalDialog'].form
        if (form.pwd === '') {
          this.$message({
            type: 'error',
            message: '请输入口令'
          })
        } else {
          this.initdata.userPasswd = form.pwd
          this.initdata.approveUserUuid = form.leaderUuid
          $axios.post('specialOperationApply/confirmAutoApprove', this.initdata).then(res => {
            if (res.data.hasOwnProperty('success')) {
              this.$message({
                type: 'success',
                message: '自动审批成功'
              })
              this.approvalDialog = false
              this.getLists()
            } else {
              this.$message({
                type: 'error',
                message: res.data.error_reason
              })
            }
          })
        }
      },
      sendMessage() {
        let form = this.$refs['autoApprovalDialog'].form
        if (form.leaderUuid === '') {
          this.$message({
            type: 'error',
            message: '请选择审批领导'
          })
          return false
        }
        this.initdata.approveUserUuid = form.leaderUuid
        $axios.post('specialOperationApply/autoApproveSendMessage', this.initdata).then(res => {
          if (res.data.hasOwnProperty('success')) {
            this.$message({
              type: 'success',
              message: '发送成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data.error_reason
            })
          }
        })
      },
      gotoApproval(row) {
        let _this = this
        _this.currentRow = row
        if (row.specialoperCategory === 0) {
          this.autoViewDialog = true
          $axios.get(`/specialOperationApply/getSpecialoperAuditList/${row.applyUuid}`).then(res => {
            this.autoViewList = res.data
          })
        } else {
          $axios.post(`/specialOperationApply/getApplySpecialoperAuditDetailList/${row.applyUuid}`).then(res => {
            if (res.status === 200) {
              _this.viewApproveDialog = true;
              _this.approvalList = res.data
            } else {
              _this.$message({
                message: '获取审批详情失败，请重试',
                type: 'error'
              });
            }
          });
        }
      },
      delHandler(row) {
        let vm = this
        vm.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/specialOperationApply/deleteSpecialoperApply/${row.applyUuid}`, {
            data: [{code: row.specialoperCode}],
            logTemplate: '删除|运维申请(#code#)'
          }).then((res) => {
            if (res.data === true) {
              vm.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getLists()
            }
          });
        }).catch(() => {});
      },
      opsHandler(row) {
        $axios.get(`specialOperationApply/judgeApplyBeforeOperation/${row.applyUuid}`).then(res => {
          if (res.data.hasOwnProperty('true')) {
            this.specialOperateCode = row.applyUuid
            this.uuids = row.applyUuid
            this.specialDialog = true
          } else if (res.data.hasOwnProperty('false')) {
            this.$message({
              type: 'error',
              message: res.data.false
            })
          }
        })
      },
      getcancelReason(uuid) {
        this.cancellationDialog = true
        $axios.get('/specialOperationApply/getInvalidLogByApplyUuid/' + uuid).then(res => {
          let detail = res.data
          this.cancelReason = [
            {name: '运维号', val: detail.specialoperCode},
            {name: '作废时间', val: detail.invalidTime},
            {name: '作废人员', val: detail.userName},
            {name: '原因', val: detail.invalidReason}
            ]
        });
      },
      saveOpsAccessNew() { // 保存运维访问（new）
        let form = this.$refs.opsAccessNew.searchForm
        if (!this.opsAccessNewDialog) {
          form.isAutoRecord = 0
        } else if (!this.$refs.opsAccessNew.userShow && !this.$refs.opsAccessNew.pwdShow) {
          form.isAutoRecord = 0
        }
        this.$refs['opsAccessNew'].$refs['searchForm'].validate(valid => {
          if (!valid) return;
          if (form.passwordType === 1 && form.strKeyPath === '') {
            this.$message({type: 'warning', message: '请先上传文件'});
            return
          }
          this.goToOperation(form)
        })
      },
      operation(row) {
        if (!row.portUuid) {
          this.rowData = row
          this.opsAccessNewDialog = true
        } else {
          this.handleOps(row)
        }
      },
      /* 普通运维 */
      goToOperation(form) {
        $axios.post('/basicOperation/webOperation', form).then(res => {
          if (res.status === 200) {
            if (res.data !== '' || res.data !== null || res.data !== undefined) {
              if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
                window.location.href = res.data;
                this.opsAccessNewDialog = false
                this.opsDialog = false;
                this.getAssetTableData()
              } else {
                this.opsDialog = false;
                this.$message({
                  type: 'error',
                  message: res.data
                });
              }
            } else {
              this.opsDialog = false;
              this.$message({
                type: 'error',
                message: '无法运维,请检查！'
              });
            }
          }
        });
      },
      handleOps(row) {
        this.rowData = row
        let opsForm = {
          specialOperateCode: this.specialOperateCode,
          accountuuid: row.accountUuid,
          diskMapping: row.diskMapping,
          operationuuid: row.maintainedDeviceUuid,
          oprationIp: row.device_ip,
          portuuid: row.portUuid,
          protocluuid: row.protocolUuid,
          clipboard: row.clipboard,
          accountName: '',
          accountPwd: '',
          colorDepth: '',
          rdpConsole: '',
          dbname: row.dbName || row.dbServerName,
          resolution: ''
        }
        let pid = row.protocolUuid
        let pType = row.protocolType
        let aid = row.accountUuid
        let authorized = false
        if (aid === account || aid === null) {
          authorized = true
        }   // 未授权
        if (pType === 2 || pType === 5 || pid === db2 || pid === informix || pid === sybase || pid === sqlserver || pid === mysql) {
          if (authorized) {
            if (pid === SSH || pid === SFTP) {
              this.showModel = 8
              this.opsDialog = true
            } else {
              this.showModel = 1
              this.opsDialog = true
            }
          } else {
            this.goToOperation(opsForm)
          }
        } else if (pid === oracle || pid === plsql || pid === toadoracle || pid === mssqlserver) {
          if (authorized) {
            this.showModel = 3
            this.opsDialog = true
          } else {
            this.showModel = 2
            this.opsDialog = true
          }
        } else if (pid === RDP || (pType === 1 && pid !== toadoracle && pid !== plsql && pid !== mssqlserver)) {
          if (authorized) {
            this.showModel = 5
            this.opsDialog = true
          } else {
            this.showModel = 4
            this.opsDialog = true
          }
        } else if (pid === VNC) {
          if (authorized) {
            this.showModel = 7
            this.opsDialog = true
          } else {
            this.showModel = 6
            this.opsDialog = true
          }
        } else {
          if (authorized) {
            this.showModel = 1
            this.opsDialog = true
          } else {
            this.goToOperation(opsForm)
          }
        }
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
