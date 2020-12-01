/**
* Created by alex on 2018/8/3.
*/
<template>
  <section>
    <s-table-page :data='logList'
                  :header-search="getSearchDef()">
      <s-table-column
        prop="specialoperCode"
        label="运维号">
      </s-table-column>
      <s-table-column
        prop="specialoperName"
        label="标题">
      </s-table-column>
      <s-table-column
        prop="specialoperTypeName"
        label="运维类型">
      </s-table-column>
      <s-table-column
        prop="userName"
        label="申请人">
      </s-table-column>
      <s-table-column
        prop="finalApproverName"
        label="审批人">
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
      <s-table-column label="操作" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看详情" @click="viewDetails(scope.row)"></i>
          <i v-if="scope.row.applyStatusInt !== 10" class="iconfont icon-cancel" title="作废审批日志" @click="viewHandler(scope.row)"></i>
          <i v-if="scope.row.applyStatusInt === 10" class="iconfont icon-order" title='查看作废详情' @click="view(scope.row.uuid)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-model="closeLog"
      width="600px"
      title="作废">
      <s-form ref="logForm" :model="logForm" :rules="logFormRule">
        <s-form-item label="作废原因：" prop="invalidReason">
            <s-input type="textarea" v-model="logForm.invalidReason" :rows="6"></s-input>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveReason">保存</s-button>
        <s-button type="cancel" @click="closeCancel">取消</s-button>
      </template>
    </s-dialog>
    <!-- 查看详情 -->
    <view-details-dialog
      v-model="viewDetailsFlag"
      v-if="viewDetailsFlag"
      :viewdata="viewdata">
    </view-details-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import viewDetailsDialog from './dialog/ApprovalViewDetails'
  export default {
    data () {
      return {
        logList: [],
        closeLog: false,
        viewDetailsFlag: false,
        rowData: {},
        logForm: {
          specialoperApplyUuid: '',
          invalidReason: ''
        },
        logFormRule: {
          invalidReason: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        }
      }
    },
    components: {
      viewDetailsDialog
    },
    created() {
      this.getLogList()
    },
    methods: {
      getLogList() {
        $axios.get('/specialOperationApply/getSpecialAuditLog').then(res => {
          this.logList = res.data
        });
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 20,
          placeholder: '请输入查询条件',
          searchProps: ['specialoperCode', 'specialoperName', 'userName', 'finalApproverName', 'specialoperTypeName', 'applyStatus', 'startTime', 'endTime']
        }
      },
      closeCancel() {
        this.closeLog = false;
      },
      saveReason() {
        this.$refs.logForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/specialOperationApply/invalidSpecialApply', this.logForm).then(res => {
            if (res.data.state === true) {
              this.$message({message: res.data.errormsg, type: 'success'});
              this.getLogList();
              this.closeCancel();
            } else {
              this.$message({message: res.data.errormsg, type: 'error'});
            }
          });
        })
      },
      viewHandler(row) {
        this.logForm.specialoperApplyUuid = row.uuid
        this.closeLog = true
      },
      view(uuid) {
        this.$emit('startDialog', uuid)
      },
      viewDetails(row) { // 查看详情
        $axios.get(`/specialOperationApply/getSpecialoperApplyDetail/${row.uuid}`).then(res => {
          this.viewDetailsFlag = true;
          this.viewdata = res.data
        });
      }
    },
    watch: {
      closeLog: {
        immediate: true,
        handler (val) {
          if (!val) {
            this.logForm = {
              specialoperApplyUuid: '',
              invalidReason: ''
            }
          }
        }
      }
    }
  }
</script>
