<template>
  <div class="assetOperationResp">
    <s-row class="topRow" style="float:left;">
      <s-button @click="add" icon="plus">添加</s-button>
      <s-button @click="batchDel" icon="batch-del">批量删除</s-button>
      <s-button @click="batchImport" icon="import">批量导入</s-button>
      <s-button @click="batchExport" icon="export">批量导出</s-button>
    </s-row>
    <s-table-page :data="operationRespList"  :header-search="searchDef()"  @selection-change="handleSelectionChange">
      <!-- <s-table-column type="index" width="45" align="center"></s-table-column>-->
      <s-table-column type="selection" width="80"></s-table-column>
      <s-table-column label="运维责任组名称" prop="deviceGroupName" width="300"></s-table-column>
      <s-table-column label="资产数" prop="deviceCount" width="150">
        <template slot-scope="scope">
          <span class="deviceCount" @click="rowSee(scope.row)">{{scope.row.deviceCount}}</span>
        </template>
      </s-table-column>
      <s-table-column label="备注" prop="remark" show-overflow-tooltip></s-table-column>
      <s-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <!-- <i class="iconfont icon-eye" @click="rowSee(scope.row)" title="查看"></i> -->
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>

    <AssetOperationRespAddDialog v-if="addDialogFlag" v-model="addDialogFlag" :operationRespList="operationRespList" :operationResp="curRow" @reload="axiosList"></AssetOperationRespAddDialog>
    <AssetOperationRespSeeDialog v-if="seeDialogFlag" v-model="seeDialogFlag" :operationResp="curRow" @reload="axiosList"></AssetOperationRespSeeDialog>
    <!-- <protocol-detail-dialog  v-if="detailDialogFlag" v-model="detailDialogFlag" :protocol="curRow"></protocol-detail-dialog> -->
    <import-dialog v-if="importOrgDialog" v-model="importOrgDialog" :upload-obj="uploadObj" :down-obj="downObj" @reload="axiosList" :fileTypes="['xls', 'xlsx']">
    </import-dialog>
    <export-dialog v-if="exportDialogFlag" v-model="exportDialogFlag" @exportDialogOk="exportDialogOk" @cancelDialog="cancelDialog"></export-dialog>
  </div>
</template>

<script>
import $axios from 'sunflower-ajax';
import exportDialog from '@/home/exportDialog';
import {Download} from 'sunflower-common-utils'
import importDialog from '@/components/importDialog/ImportDialog';
import AssetOperationRespAddDialog from './AssetOperationRespAddDialog';
import AssetOperationRespSeeDialog from './AssetOperationRespSeeDialog';

export default {
  data() {
    return {
      addDialogFlag: false,
      seeDialogFlag: false,
      importOrgDialog: false,
      exportDialogFlag: false,
      operationRespList: [],
      fileList: [],
      selections: [],
      curRow: {},
      uploadObj: {},
      downObj: {}
    }
  },
  created() {
    this.axiosList();
  },
  methods: {
    searchDef() {
      return {
        width: 4,
        offset: 20,
        placeholder: '请输入关键字',
        searchProps: ['deviceGroupName', 'remark']
      }
    },
    axiosList() {
      $axios.post(`/operationDeviceGroup/getAllDeviceGroupList`).then(({data}) => {
        this.operationRespList = data;
        this.operationRespList.forEach(item => {
          if (item.remark === '') {
            item.remark = '----'
          }
        })
      });
    },
    add() {
      this.curRow = {};
      this.addDialogFlag = true;
    },
    rowSee(row) {
      this.curRow = row;
      this.seeDialogFlag = true;
    },
    rowEdit(row) {
      this.curRow = Object.assign({}, row);
      this.addDialogFlag = true;
    },
    rowDel(row) {
      this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
        let arr = [];
        arr.push(row);
        this.delete(arr);
      }).catch(() => {});
    },
    handleSelectionChange(selections) {
      this.selections = selections;
    },
    batchDel() {
      if (this.selections.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          this.delete(this.selections)
        }).catch(() => {});
      }
    },
    batchImport() {
      this.uploadObj = {
        type: 'post',
        url: '/operationDeviceGroup/deviceGroupImport'
      };
      this.downObj = {
        text: '批量导入运维责任组模板',
        url: '/operationDeviceGroup/deviceGroupImportTemplate'
      };
      this.importOrgDialog = true;
    },
    batchExport() {
      if (this.selections.length === 0) {
        this.$message({
          type: 'error',
          message: '请至少选择一条数据'
        })
      } else {
        this.exportDialogFlag = true
      }
    },
    exportDialogOk(form) {
      let params = {}
      params.deviceGroupUuidList = this.selections.map(item => item.uuid)
      $axios.post(`/operationDeviceGroup/exportDeviceGroupFirst`, params).then(({data}) => {
        if (data) {
          Download(`/operationDeviceGroup/exportDeviceGroupSecond/${form.password}`);
          this.exportDialogFlag = false
        }
      });
    },
    cancelDialog() {
      this.exportDialogFlag = false
    },
    delete(uuidArr) {
      if (!Array.isArray(uuidArr) || uuidArr.length === 0) return
      let uuidList = uuidArr.map(item => {
        return item.uuid
      })
      let obj = {
        data: uuidArr,
        logTemplate: '删除|运维责任组(#deviceGroupName#)'
      }
      $axios.post(`/operationDeviceGroup/deleteDeviceGroup`, uuidList, obj).then(({data}) => {
        if (data.state === true) {
          this.$message({showClose: true, message: '删除成功!', type: 'success'});
          this.axiosList();
        } else {
          this.$message({showClose: true, message: data.errormsg, type: 'error'});
          this.axiosList();
        }
      });
    }
  },
  components: {
    AssetOperationRespAddDialog,
    AssetOperationRespSeeDialog,
    importDialog,
    exportDialog
    // protocolDetailDialog
  }
}
</script>

<style lang="stylus">
.assetOperationResp .underLine {
  text-decoration: underline;
  cursor: pointer;
}
</style>
