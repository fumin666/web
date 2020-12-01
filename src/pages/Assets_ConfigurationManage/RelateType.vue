<template>
  <div>
    <s-table-page
      ref="multipleTable"
      :data="relationtypelist"

      :header-actions='getListActionsDef()'

      :header-search='getSearchDef()'
      @selection-change="handleSelectionChange"
      style="width:100%"
    >
      <!--  <s-table-column type="selection" width="180" :selectable="delIsShow"></s-table-column>-->
      <s-table-column prop="forwardRelationtype.relationName" label="关系类型"></s-table-column>
      <!--   <s-table-column prop="reverseRelationtype.relationName" label="反向111111关系类型"></s-table-column>-->
      <s-table-column prop="forwardRelationtype.relationDescription" label="描述"></s-table-column>
      <s-table-column prop="forwardRelationtype.status" label="状态">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.forwardRelationtype.status" size="small" @change="onSwitchChange(scope.row)" :active-value="1" :disabled="!judgeRoleBtn('assetsManage_switchState')"
                    :inactive-value="0"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" v-if="judgeRoleBtn('assetsManage_editRelationType') && judgeRoleBtn('assetsManage_viewRelationType')">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)" v-noBtn="'assetsManage_editRelationType'"></i>
          <i v-if="delIsShow(scope.row)" class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--新增-->
    <s-dialog
      v-model="addRelateDialog"
      v-if="addRelateDialog"
      width="700px"
      title="添加">
      <add-relate-dialog ref="addRelate"></add-relate-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="addCancel">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editRelateDialog"
      v-if="editRelateDialog"
      width="700px"
      title="编辑">
      <add-relate-dialog :editData="editdata" ref="editRelate"></add-relate-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk">确定</s-button>
        <s-button type="cancel" @click="editCancel">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>

  import $axios from 'sunflower-ajax';
  import AddRelateDialog from '@/pages/Assets_ConfigurationManage/AddRelateDialog';
  export default {
    data() {
      return {
        selections: [],
        relationtypelist: [],
        addRelateDialog: false,
        editRelateDialog: false,
        editdata: {}
      }
    },
    components: {AddRelateDialog},
    methods: {
      onSwitchChange(row) {
        let status = row.forwardRelationtype.status
        let word = status === 1 ? '开启' : '关闭'
        row.forwardRelationtype.status = status === 1 ? 0 : 1
        this.$confirm(`确定${word}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/resourcemanager/configurationmanage/relationtype/updateRealtiontypeGroupStatus/${row.uuid}/${status}`).then(({data}) => {
            if (data.state === true) {
              row.forwardRelationtype.status = status
              this.$message.success(`${word}成功`)
            } else {
              this.$message.error(`${word}失败`)
            }
          })
        })
      },
      handleSelectionChange(selections) {
        this.selections = selections;
        // console.log(this.selections)
      },
      delIsShow(row) {
        return !(row.forwardRelationtype.isDefault === 1)
      },
      editHandler(row) {
        this.editRelateDialog = true
        this.editdata = row;
      },
      delHandler(row) {
        this.$confirm('确定删除？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post('/resourcemanager/configurationmanage/relationtype/remove', [row.uuid], {
            data: [{relationName: row.forwardRelationtype.relationName}],
            logTemplate: '删除|关系类型>关系(#relationName#)'
          }).then(response => {
            if (response.data === 'true') {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              });
            }
          })
        }).catch(() => {});
      },
      delHandlerm(row, logData) {
        this.$confirm('确定删除？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          $axios.post('/resourcemanager/configurationmanage/relationtype/remove', row, {
            data: logData,
            logTemplate: '删除|关系类型>关系(#relationName#)'
          }).then(response => {
            if (response.data === 'true') {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              });
            }
          })
        }).catch(() => {});
      },
      getListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [
            {
              name: '添加',
              show: (row) => {
                return self.judgeRoleBtn('assetsManage_addRelationType');
              },
              click() {
                self.addRelateDialog = true
              },
              icon: 'plus'
            }
          ]
        }
      },
      getSearchDef() {
        return {
          show: false
        }
      },
      checkRelateName(name, cb, oldName) {
        let names = this.relationtypelist.map(item => item.forwardRelationtype.relationName)
        if (names.indexOf(name) === -1 || name === oldName) {
          cb(false)
        } else {
          cb(true)
        }
      },
      addOk() {
        let form = this.$refs['addRelate'].$refs['addForm'];
        let formData = this.$refs['addRelate'].form
        this.checkRelateName(formData.forwardRelationtype.relationName, exist => {
          if (exist) {
            this.$message.warning('名称已存在!')
          } else {
            // 这几个空数据必传
            let addForm = {
              uuid: null,
              forwardUuid: null,
              reverseUuid: null,
              ...this.$refs['addRelate'].form,
              reverseRelationtype: {}
            };
            form.validate((valid) => {
              if (!valid) {
                return false;
              }
              $axios.post('/resourcemanager/configurationmanage/relationtype/save', addForm, {
                data: [{relationName: addForm.forwardRelationtype.relationName}],
                logTemplate: '添加|关系类型>关系(#relationName#)'
              }).then((res) => {
                if (res.data === 'true') {
                  this.$message({
                    message: '保存成功  ',
                    type: 'success'
                  });
                  this.addRelateDialog = false;
                  this.getList();
                }
              });
            });
          }
        })
      },
      addCancel() {
        this.addRelateDialog = false;
      },
      editOk() {
        let form = this.$refs['editRelate'].$refs['addForm'];
        let formData = this.$refs['editRelate'].form
        this.checkRelateName(formData.forwardRelationtype.relationName, exist => {
          if (exist) {
            this.$message.warning('名称已存在!')
          } else {
            let addForm = this.$refs['editRelate'].form;
            form.validate((valid) => {
              if (!valid) {
                return false;
              }
              $axios.post('/resourcemanager/configurationmanage/relationtype/update', addForm, {
                data: [{relationName: addForm.forwardRelationtype.relationName}],
                logTemplate: '编辑|关系类型>关系(#relationName#)'
              }).then((res) => {
                if (res.data === 'true') {
                  this.$message({
                    message: '修改成功  ',
                    type: 'success'
                  });
                  this.editRelateDialog = false;
                  this.getList();
                }
              });
            });
          }
        }, this.editdata.forwardRelationtype.relationName)
      },
      editCancel() {
        this.editRelateDialog = false
      },
      getList() {
        $axios.get('/resourcemanager/configurationmanage/relationtype/list').then((res) => {
          this.relationtypelist = res.data
          // console.log(res.data)
        })
      }
    },
    mounted() {
      this.getList();
    }
  }
</script>
