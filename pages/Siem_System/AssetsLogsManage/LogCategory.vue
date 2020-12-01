/**
* Created by alex on 2019/2/18.
*/
<template>
  <section>
    <s-table-page
      :data="categoryList"
      :header-actions="innerActionsDef()"
      @selection-change="selectionChange"
      :header-search="searchDef()"
      >
      <s-table-column label="应用类别名称" prop="typeName"></s-table-column>
      <s-table-column label="备注" prop="remark"></s-table-column>
      <s-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i v-if="scope.row.isDefault !== 1" class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)"></i>
          <i v-if="scope.row.isDefault !== 1" class="iconfont icon-delete" title="删除" @click="deleteHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--新增-->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      title="添加">
      <add-dialog ref="addItem"></add-dialog>
      <template slot="footer">
        <s-button @click="saveDialog('add')">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      title="编辑">
      <add-dialog :editData="editRow" ref="editItem"></add-dialog>
      <template slot="footer">
        <s-button @click="saveDialog('edit')">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import addDialog from './components/AddCategory'
  export default {
    components: {

      addDialog
    },
    data() {
      return {
        categoryList: [],
        selections: [],
        addDialog: false,
        editDialog: false,
        editRow: ''
      }
    },
    created() {
      this.getTableList()
    },
    methods: {
      saveDialog(flag) {
        let addForm, form, url
        if (flag === 'add') {
          addForm = this.$refs['addItem'].form
          form = this.$refs['addItem'].$refs['addForm']
          url = '/syslogAuditSetting/addAppType'
        } else if (flag === 'edit') {
          addForm = this.$refs['editItem'].form
          form = this.$refs['editItem'].$refs['addForm']
          url = '/syslogAuditSetting/editAppType'
        }
        let obj = {
          data: [addForm],
          logTemplate: flag === 'edit' ? '编辑|日志审计配置>应用类别配置>应用类别(#typeName#)' : '添加|日志审计配置>应用类别配置>应用类别(#typeName#)'
        }
        form.validate((valid) => {
            if (!valid) {
              return false;
            }
            $axios.post(url, addForm, obj).then((res) => {
              if (res.data.state) {
                this.$message.success('保存成功！')
                this.getTableList()
                flag === 'add' ? this.addDialog = false : this.editDialog = false
              } else {
                this.$message.error(res.data.errormsg)
              }
            })
        })
      },
      getTableList() {
        $axios.get('/syslogAuditSetting/getAppTypeList').then((res) => {
          this.categoryList = res.data
        })
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      searchDef() {
        return {
          show: false
        }
      },
      innerActionsDef () {
        let vm = this
        return {
          width: 5,
          offset: 0,
          actions: [
            {
              name: '添加',
              icon: 'plus',
              click () {
                vm.addDialog = true
              }
            }
          ]
        }
      },
      editHandler(row) {
        this.editDialog = true
        this.editRow = row
      },
      deleteHandler(row) {
        this.$confirm('确定删除?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
          let obj = {
            data: [row],
            logTemplate: '删除|日志审计配置>应用类别配置>应用类别(#typeName#)'
          }
          $axios.get(`/syslogAuditSetting/deleteAppType/${row.uuid}`, obj).then(({data}) => {
            if (data) {
              this.$message.success('删除成功!')
              this.getTableList()
            } else {
              this.$message.success('删除失败!')
            }
          });
        }).catch(() => {});
      }
    }
  }
</script>
