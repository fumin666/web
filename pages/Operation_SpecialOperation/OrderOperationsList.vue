/**
* Created by songyf on 2019/4/22.
* 工单运维-工单运维列表.
*/
<template>
  <section class="order-operations-list">
    <!--工单运维列表表格-->
    <s-table-page :data="orderOperationList"
                 :row-actions='rowActionsDef()'
                 :actions-col-width="`50px`"
                 :has-action-col="true"

                 :header-search="getSearchDef()" >
      <s-table-column prop="orderNumber" label="工单号" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="startTime" label="开始时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="endTime" label="结束时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="remark" label="备注" show-overflow-tooltip>
      </s-table-column>
    </s-table-page>
    <!--查看工单运维弹框-->
    <s-dialog
      v-model="orderOperationsViewDialogFlag"
      v-if="orderOperationsViewDialogFlag"
      width="960px"
      title="工单运维">
      <order-operations-view
        @showOperation="operation"
        :orderOperationsViewData="orderOperationsViewData"
        :isShowOper="isShowOper"
        ref="orderOperationsView"
      >
      </order-operations-view>
      <!--运维访问弹框-->
      <s-dialog
        v-model="opsDialog"
        v-if="opsDialog"
        width="700px"
        title="运维访问"
        append-to-body>
        <ops-add :decisionData="rowData" :showModel="showModel" ref="ops"></ops-add>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveOps">保存</s-button>
          <s-button type="cancel" @click="opsDialog = false">取消</s-button>
        </template>
      </s-dialog>

    </s-dialog>
  </section>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax'

import orderOperationsView from './dialog/OrderOperationsView'
import opsAdd from '../Operation_Equipment/OpsAdd'
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
  data() {
    return {
      isShowOper: true, // 是否显示运维按钮判断
      orderOperationList: [],
      orderOperationsViewData: [],
      orderOperationsViewDialogFlag: false,
      opsDialog: false, // 运维助手
      opsNewDialog: false, // 运维助手new
      rowData: {},
      showModel: '',
      specialOperateCode: '0'
    }
  },
  components: {

    orderOperationsView,
    opsAdd
  },
  created() {
    this.getOrderOperationList();
  },
  methods: {
    getOrderOperationList() {
      $axios.get('/orderOperation/getOrderOperationList').then(res => {
        this.orderOperationList = res.data
      });
    },
    // 表格相关--------------------------------------------------------------
    rowActionsDef() {
      let vm = this;
      return [{
        icon: 'eye',
        name: '查看',
        click(row) {
          $axios.get(`/orderOperation/getOrderOperationAccountList/${row.uuid}`).then(res => {
            vm.orderOperationsViewData = res.data;
          });
          let NowTime = (new Date().getTime()) - (new Date(row.startTime).getTime());
          if (NowTime < 0) { // 当前时间是否大于开始时间
            vm.isShowOper = false
          }
          vm.orderOperationsViewDialogFlag = true;
        }
      }]
    },
    getSearchDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入查询条件',
        searchProps: ['orderNumber', 'remark']
      }
    },
    saveOps() {
      let form = this.$refs.ops.form;
      if (form.passwordType === 1 && form.strKeyPath === '') {
        this.$message({type: 'warning', message: '请先上传文件'});
        return
      }
      form['specialOperateCode'] = this.specialOperateCode;
      this.goToOperation(form)
    },
    operation(row) {
      if (row.port === null || row.port === '' || row.port === void 0) {
        this.$message({
          message: '运维失败,请检查后重试',
          type: 'error'
        });
        return false
      }
      this.rowData = row
      let opsForm = {
        specialOperateCode: '0',
        accountuuid: row.accountuuid,
        diskMapping: row.diskMapping,
        operationuuid: '',
        oprationIp: row.oprationIp,
        portuuid: row.portuuid,
        protocluuid: row.protocluuid,
        clipboard: row.clipboard,
        accountName: '',
        accountPwd: '',
        colorDepth: '',
        rdpConsole: '',
        dbname: row.dbName || row.dbServerName,
        resolution: '',
        orderOperationNumber: row.orderOperationNumber
      }
      let pid = row.protocluuid
      let pType = row.protocolType
      let aid = row.accountuuid
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
    },
    goToOperation (form) {
      $axios.post('/basicOperation/webOperation', form).then((res) => {
        if (res.status === 200) {
          if (res.data !== '' || res.data !== null || res.data !== undefined) {
            if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
              window.location.href = res.data
              this.opsDialog = false
            } else {
              this.opsDialog = false
              this.$message({
                type: 'error',
                message: res.data
              });
            }
          } else {
            this.opsDialog = false
            this.$message({
              type: 'error',
              message: '无法运维,请检查！'
            });
          }
        }
      });
    }
  }
}
</script>
