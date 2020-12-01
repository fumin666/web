<template>
  <section>
    <s-table-page
      :data="orderList"

      :header-search="getSearchDef()"
      :header-actions="getListActionsDef()"
      :row-actions="getRowActionsDef()"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange">
      <s-table-column label="命令集名称" prop="name"></s-table-column>
      <s-table-column label="备注" prop="remark"></s-table-column>
    </s-table-page>
    <s-dialog
      v-model="bloomAddOrder"
      v-if="bloomAddOrder"
      title="添加"
      key="bloomAddOrder">
      <add-gather ref="addgather"></add-gather>
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
      <add-gather ref="editgather" :orderUuid="currentOrderUUid"></add-gather>
      <template slot="footer">
        <s-button @click="edit">保存</s-button>
        <s-button @click="bloomEdit = false" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="bloomCheck"
      v-if="bloomCheck"
      title="查看"
      key="bloomCheck">
      <check-order ref="checkorder" :List="checkOrders"></check-order>
      <template slot="footer">
        <s-button @click="set">设置重点命令</s-button>
        <s-button @click="bloomCheck = false;" type="cancel">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      v-model="bloomSet"
      v-if="bloomSet"
      title="重点命令列表"
      key="bloomSet">
      <set-order ref="setorder" :importList="correctionList" @getUuid="correlationUuid"></set-order>
      <template slot="footer">
        <s-button @click="correlation">确定</s-button>
        <s-button @click="cancelSelect" type="cancel">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import AddGather from './AddGather.vue'
  import CheckOrder from './CheckOrder.vue'
  import SetOrder from './SetOrder.vue'
  export default {
    components: {

      AddGather,
      CheckOrder,
      SetOrder
    },
    data() {
      return {
        orderList: [],
        correctionList: [],
        currentOrderUUid: '',     // 当前编辑的命令集uuid
        bloomAddOrder: false,
        bloomEdit: false,
        bloomCheck: false,
        bloomSet: false,
        selections: [],
        checkOrders: {},
        uuid: [],
        groupUuid: '',  // 被查看行的uuid
        selection: [] // 设置重点命令的回显
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
            click() {
              vm.bloomAddOrder = true;
            }
          }]
        }
      },
      getRowActionsDef() {
        let vm = this;
        return [{
          name: '编辑',
          icon: 'edit',
          click(row) {
            vm.currentOrderUUid = row.uuid;
            vm.bloomEdit = true;
          }
        }, /* {
          name: '查看',
          icon: 'eye',
          click(row) {
            vm.check(row.uuid);
          }
        }, */ {
          name: '删除',
          icon: 'delete',
          click(row) {
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
          searchProps: ['name', 'remark']
        }
      },
      tableRowClassName(row) {
        if (row.status === 1) {
          return 'disableDelete'
        }
      },
      handleSelectionChange(val) {
        this.selections.length = 0;
        val.map((item) => {
          this.selections.push(item.uuid)
        })
      },
      showList() {
        let vm = this;
        $axios.get('/keyCommandGroup/list').then((res) => {
          vm.orderList = res.data;
        });
      },
      save() {
        var vm = this;
        this.$refs['addgather'].$refs['KeyCommand'].validate((valid) => {
          let _data = {
            commandUuids: vm.$refs['addgather'].orderListSelections.map(item => item.uuid),
            ...vm.$refs['addgather'].KeyCommandGroupInfo
          }
          if (_data.commandUuids.length === 0) {
            this.$message({type: 'warning', message: '请至少添加一条命令'});
            return
          }
          if (valid) {
            $axios.post('/keyCommandGroup/add', _data).then((res) => {
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
        this.$refs['editgather'].$refs['KeyCommand'].validate((valid) => {
          let _data = vm.$refs['editgather'].KeyCommandGroupInfo;
          let KeyCommandGroupInfos = {
            name: _data.name,
            remark: _data.remark,
            commandUuids: vm.$refs['editgather'].orderListSelections.map(item => item.uuid),
            groupUuid: _data.uuid
          };
          if (KeyCommandGroupInfos.commandUuids.length === 0) {
            this.$message({type: 'warning', message: '请至少添加一条命令'});
            return
          }
          if (valid) {
            $axios.post('/keyCommandGroup/update', KeyCommandGroupInfos).then((res) => {
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
            return false;
          }
        })
      },
      delete(val) {
        var vm = this;
        vm.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/keyCommandGroup/delete', val).then((res) => {
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
            }
          });
        }).catch(() => {});
      },
      check(val) {
        let vm = this;
        this.groupUuid = val;
        $axios.get('/keyCommandGroup/view/' + val).then((res) => {
          vm.checkOrders = res.data;
          vm.bloomCheck = true;
        });
      },
      set() {
        let vm = this;
        $axios.get('/keyCommand/list').then((res) => {
          vm.correctionList = res.data;
          // selection回显
          vm.promiseSelection().then((data) => {
            vm.uuid = data.selectionUuid;
            vm.selection = data.selection;
            if (vm.selection.length !== 0) {
              vm.$nextTick(() => {
                vm.selection.forEach(row => {
                  // 设置重点命令回显
                  vm.$refs.setorder.$refs.table.toggleRowSelection(vm.correctionList[row], true);
                });
              })
            }
          });
          this.bloomSet = true;
        })
      },
      // 不写为promise则selection为空
      promiseSelection() {
        return new Promise((resolve, reject) => {
          let vm = this
          let selectObj = {
            selectionUuid: [],
            selection: []
          }
          vm.checkOrders.rels.map((item) => {
            selectObj.selectionUuid.push(item.uuid);
            // 需要拿到indexList实现回显
            vm.correctionList.map((itemList, indexList) => {
              if (item.uuid === itemList.uuid) {
                selectObj.selection.push(indexList);
              }
            });
          });
          resolve(selectObj)
        })
      },
      correlation() {
        let vm = this;
        $axios.post('/keyCommandGroup/keyCommandRel', {commandUuids: this.uuid, groupUuid: this.groupUuid}).then((res) => {
          if (res.data === 'success') {
            vm.$message({
              type: 'success',
              message: '关联成功'
            });
            // 刷新查看页面的关联列表
            $axios.get(`/keyCommandGroup/view/${this.groupUuid}`).then((res) => {
              vm.checkOrders = res.data;
            });
            vm.bloomSet = false;
          } else {
            vm.$message({
              type: 'error',
              message: '关联失败'
            });
          }
        });
      },
      correlationUuid(uuid) {
        this.uuid = uuid;
      },
      cancelSelect() {
        let vm = this;
        vm.bloomSet = false;
      }
    },
    created() {
      this.showList()
    }
  }
</script>

<style>
  .disableDelete .icon-delete{
    display: none;
  }
</style>
