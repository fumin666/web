<template>
  <section class="talkDetail">
    <s-table-page
      :data="orderList"
      :header-search="getSearchDef()"
      :header-actions="getListActionsDef()"
      :row-actions="getRowActionsDef()"
      @selection-change="handleSelectionChange"
      actions-col-width="100">
      <s-table-column type="selection" width="65"></s-table-column>
      <s-table-column label="命令名称" prop="key_command_name"></s-table-column>
      <s-table-column label="命令内容" prop="key_command_cont"></s-table-column>
    </s-table-page>
    <s-dialog
      v-model="bloomAddOrder"
      v-if="bloomAddOrder"
      title="添加"
      key="bloomAddOrder">
      <add-order ref="addorder"></add-order>
      <template slot="footer">
        <s-button @click="save">保存</s-button>
        <s-button @click="bloomAddOrder = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="bloomEdit"
      v-if="bloomEdit"
      title="编辑"
      key="bloomEdit">
      <add-order ref="editorder" :current="currentOrder"></add-order>
      <template slot="footer">
        <s-button @click="edit">保存</s-button>
        <s-button @click="bloomEdit = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <!--导入-->
    <import-dialog v-if="importOrgDialog" v-model="importOrgDialog" :save-log="true"
                   :upload-obj="uploadObj" :down-obj="downObj" @reload="reload" :fileTypes="fileTypes"></import-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import AddOrder from './AddOrder.vue'
  import {Download} from 'sunflower-common-utils'
  import importDialog from '@/components/importDialog/ImportDialog';
  export default {
    components: {
      AddOrder,
      // Download,
      importDialog
    },
    data() {
      return {
        orderList: [],
        currentOrder: {},
        bloomAddOrder: false,
        bloomEdit: false,
        selections: [],
        // fileList: [],
        importOrgDialog: false,
        uploadObj: {},
        downObj: {},
        fileTypes: ['xls', 'xlsx', 'csv']
      }
    },
    methods: {
      getListActionsDef() {
        let vm = this;
        return {
          width: 16,
          actions: [{
            name: '添加',
            icon: 'plus',
            click: function() {
              vm.bloomAddOrder = true;
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click: function() {
              if (vm.selections.length === 0) {
                vm.$message('请至少选择一项')
              } else {
                vm.delete(vm.selections)
              }
            }
          }, {
            name: '重点命令导出',
            icon: 'export',
            click: function() {
              if (vm.selections.length === 0) {
                vm.$message('请至少选择一项')
              } else {
                vm.ExcelDownloadHandle(vm.selections);
              }
            }
          }, {
            name: '重点命令导入',
            icon: 'import',
            click: function() {
              // vm.importOrgDialog = true;
              vm.importBatch()
            }
          }]
        }
      },
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: '/keyCommand/importKeyCmd'
        };
        this.downObj = {
          url: '/keyCommand/downTemplate'
        };
        this.importOrgDialog = true;
      },
      reload() {
        this.showList();
      },
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '编辑',
          icon: 'edit',
          click: (row) => {
            vm.bloomEdit = true;
            // 如果直接这样想，会变为响应式，点击dialog的x号页面的表格数据的显示也会改变
            // vm.currentOrder = row;
            vm.currentOrder = {
              key_command_cont: row.key_command_cont,
              key_command_name: row.key_command_name,
              uuid: row.uuid
            }
          }
        }, {
          name: '删除',
          icon: 'delete',
          click: (row) => {
            let singleDelete = [];
            singleDelete.push(row.uuid)
            vm.delete(singleDelete);
          }
        }]
      },
      getSearchDef() {
        return {
          width: 8,
          placeholder: '请输入查询内容',
          searchProps: ['key_command_name', 'key_command_cont']
        }
      },
      handleSelectionChange(val) {
        this.selections = [];
        val.map((item) => {
          this.selections.push(item.uuid)
        })
      },
      showList() {
        let vm = this;
        $axios.post('/keyCommand/list').then((res) => {
          vm.orderList = res.data;
        });
      },
      ExcelDownloadHandle(val) {
        $axios.post('/keyCommand/exportKeyCmd', val).then((res) => {
          if (res.data === 'success') {
            Download(`/keyCommand/downKeyCmd?t=${new Date().getTime()}`);
          }
        });
      },
      save() {
        var vm = this;
        this.$refs['addorder'].$refs['KeyCommand'].validate((valid) => {
          let _data = vm.$refs['addorder'].KeyCommandInfo;
          if (valid) {
            $axios.post('/keyCommand/add', _data).then((res) => {
              if (res.data === 'success') {
                vm.$message({
                  type: 'success',
                  message: '提交命令成功'
                });
                vm.showList();
                vm.bloomAddOrder = false;
              }
            });
          } else {
              return false;
          }
        })
      },
      edit() {
        var vm = this;
        vm.$refs['editorder'].$refs['KeyCommand'].validate((valid) => {
          let _data = vm.$refs['editorder'].KeyCommandInfo;
          let KeyCommandInfos = {key_command_cont: _data.key_command_cont, key_command_name: _data.key_command_name, uuid: _data.uuid};
          if (valid) {
            $axios.post('/keyCommand/update', KeyCommandInfos).then((res) => {
              if (res.data === 'success') {
                vm.$message({
                  type: 'success',
                  message: '修改命令成功'
                });
                vm.showList();
                vm.bloomEdit = false;
              }
            });
          } else {
            // vm.showList();
            return false;
          }
        })
      },
      delete(val) {
        var vm = this;
        vm.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/keyCommand/delete', val).then((res) => {
            if (res.data === 'failure') {
              vm.$message({
                type: 'failure',
                message: '删除失败'
              });
            } else {
              vm.$message({
                type: 'success',
                message: '删除成功'
              });
              vm.showList();
              vm.selections.length = 0;
            }
          });
        }).catch(() => {});
      }
    },
    created () {
      this.showList();
    }
  }
</script>
