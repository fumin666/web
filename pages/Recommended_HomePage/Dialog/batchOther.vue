<template>
  <div>
    <s-dialog v-model="dialogFlag" title="他人已审批"  width="70%">
        <s-table-page :data='BatchExcuteAuditList'

                  :has-action-col='false'
                  :header-search='getExcSearchDef()'>
          <s-table-column
            prop="taskName"
            label="任务名称">
          </s-table-column>
          <s-table-column
            prop="userRealName"
            label="申请者">
          </s-table-column>
          <s-table-column
            prop="typeStr"
            label="审核状态">
          </s-table-column>
          <s-table-column
            prop="strPeriod"
            label="执行周期">
          </s-table-column>
          <s-table-column
            prop="beginTime"
            label="开始时间">
          </s-table-column>
          <s-table-column
            prop="endTime"
            label="结束时间">
          </s-table-column>
          <s-table-column label="操作" width="180">
            <template slot-scope="scope">
              <i class="iconfont icon-eye" @click="viewListHandle(scope.row, 1)" title="查看详情"></i>
              <i class="iconfont icon-download" @click="downloadHandle(scope.row)" title="下载"></i>
              <i v-if="!isShow(scope.row)" class="iconfont icon-delete" @click="delHandle(scope.row)" title="删除"></i>
              <i v-if="isShow(scope.row)" class="iconfont icon-seal" @click="approveHandle(scope.row)" title="审批"></i>
            </template>
          </s-table-column>
        </s-table-page>
    </s-dialog>
        <!--查看详情-->
    <s-dialog
      v-model="viewInfoDialog"
      v-if="viewInfoDialog"
      width="900px"
      title="申请详情">
      <view-list :viewdata="viewdata"></view-list>
    </s-dialog>
        <!--审批操作-->
    <s-dialog
      v-model="approveDialog"
      v-if="approveDialog"
      width="50%"
      title="审批">
      <view-dialog :uuid="viewUuid" :taskUuid="viewTaskUuid" ref="approveDia"></view-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button v-if="doing" @click="approveOk">确定</s-button>
        <s-button v-if="!doing" disabled style="width:100px">
          <div style="float: left">正在审批</div>
          <s-spin color="#30a6fd" type="clip" size="8px"></s-spin>
        </s-button>
        <s-button type="cancel" @click="approveDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import viewList from './ViewBatchDialog'
  import viewDialog from './ViewList'
  import {Download} from 'sunflower-common-utils';
  // import {isArray} from 'lodash';
  import $axios from 'sunflower-ajax'

  export default {
    components: {
      viewList,
      viewDialog
    },
    data() {
      return {
        dialogFlag: false,
        viewInfoDialog: false,
        viewUuid: '',
        viewUuidName: '',
        viewTaskUuid: '',
        approveDialog: false,

        BatchExcuteAuditList: [],
        viewdata: {},

        tableData: [],
        form: {
          type: '',
          time: ''
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getBatchExcuteAuditList()
    },
    methods: {
      getExcSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'userRealName', 'type', 'taskPeriod', 'beginTime', 'endTime']
        }
      },
      getBatchExcuteAuditList() {
        $axios.get('/omaIndex/getMySubApprovedTask').then((res) => {
          this.BatchExcuteAuditList = res.data
        });
      },
      viewListHandle(row, type) {
        let infoUuid = ''
        type === 1 ? infoUuid = row.taskUuid : infoUuid = row.uuid
        $axios.get(`/operationBatchExcute/getAddFormInfo/${infoUuid}`).then(res => {
          this.viewInfoDialog = true
          this.viewdata = res.data
        })
      },
      downloadHandle(row) {
        Download(`/operationBatchExcute/downloadExeScript/${row.uuid}`, {
          data: [row],
          logTemplate: '下载|审批列表>审批任务(#taskName#)'
        });
      },
      delHandle(row) {
        let vm = this
        vm.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationBatchExcute/delScriptAudit/${row.uuid}`).then((res) => {
            if (res.data === true) {
              vm.$message({
                message: '删除成功',
                type: 'success'
              });
              vm.getBatchExcuteAuditList();
            } else {
              vm.$message({
                message: '删除失败',
                type: 'error'
              });
            }
          });
        }).catch(() => {});
      },
    approveHandle(row) {
        this.viewUuid = row.uuid
        this.viewUuidName = row.taskName
        this.viewTaskUuid = row.taskUuid
        this.approveDialog = true
      },
    approveOk() {
        let addForm = this.$refs['approveDia'].addForm;
        this.$refs['approveDia'].$refs['addForm'].validate(valid => {
          if (!valid) return;
          this.doing = false
          $axios.post('/operationBatchExcute/batchExcuteAudit', addForm, {
            data: [{name: this.viewUuidName}],
            logTemplate: '审批|审批列表>审批任务（#name#）'
          }).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.approveDialog = false
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
            this.getBatchExcuteAuditList();
            this.doing = true;
          })
        })
      },
    isShow(row) {
        if (row.createTime.substr(0, 4) === '1970') {
          return true
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
