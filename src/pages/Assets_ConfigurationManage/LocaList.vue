<template>
  <div>
    <div class="btn">
      <s-button icon="plus" title="添加" @click="add">添加</s-button>
     <!-- <s-button icon="delete" title="删除" @click="delectList()">删除</s-button>-->
    </div>
    <s-table-tree
      :data="tree.data"
      :config="tree.config"
      :treeIndex="1"
      @selection-change="handleSelectionChange"
    >
      <s-table-column
        slot="pre"
        type="selection"
        :selectable="delIsShow"
        width="200">
      </s-table-column>
      <s-table-column
        label="操作"
        width="220">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" v-if="Isshow(scope.row)" @click="show(scope.$index, scope.row)"></i>
          <i class="iconfont icon-edit" title="编辑" v-if="IsshowEdit(scope.row)" @click="editHandler(scope.row)"></i>
          <i v-if="delIsShow(scope.row)" class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-tree>
    <!--查看-->
    <s-dialog
      v-model="lookDialog"
      v-if="lookDialog"
      width="700px"
      title="查看">
      <show :lookList="lookList"></show>
    </s-dialog>
    <!--新增-->
    <s-dialog
    v-model="addDialog"
    v-if="addDialog"
    width="600px"
    title="新增"
    >
      <categoryDialog :Type="type" ref="addDialog"></categoryDialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addcategory">保存</s-button>
        <s-button type="cancel" @click="addDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="600px"
      title="编辑"
    >
      <categoryDialog :Type="type" ref="editDialog" :editData = 'edit'></categoryDialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editcategory">保存</s-button>
        <s-button type="cancel" @click="editDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import show from '@/pages/Assets_ConfigurationManage/LookDialog'
  import categoryDialog from '@/pages/Assets_ConfigurationManage/CategoryDialog'
  export default {
    data() {
      return {
        type: 'add',
        lookDialog: false,
        edit: {},
        selectCaUuid: [],
        selections: [],
        lookList: [],
        citypeData: [],
        tree: {
          data: [],
          config: [
            {
              title: '类型',
              property: 'name',
              width: 400
            },
            {
              title: '描述',
              property: 'description'
            }
          ]
        },
        addDialog: false,
        editDialog: false
      }
    },
    components: {show, categoryDialog},
    methods: {
      addcategory() {
        let form = this.$refs.addDialog.$refs.configForm;
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          let formData = this.$refs.addDialog.configForm
          if (this.$refs.addDialog.upSelectUuid.indexOf(formData.citypeName.trim()) !== -1) {
            this.$message({showClose: true, message: '配置项类型名称已存在!', type: 'error'});
          } else {
            $axios.post('/resourcemanager/configurationmanage/citype/save', formData, {
              data: [{citypeName: formData.citypeName}],
              logTemplate: '添加|配置项类型>配置项(#citypeName#)'
            }).then((res) => {
              if (res.data === 'true') {
                this.$message({showClose: true, message: '保存成功!', type: 'success'});
                this.getTreeData()
              } else {
                this.$message({showClose: true, message: '保存失败!', type: 'error'});
              }
            })
            this.addDialog = false
          }
        })
      },
      editcategory() {
        let form = this.$refs.editDialog.$refs.configForm;
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          let formData = this.$refs.editDialog.configForm
          let data = this.$refs.editDialog.upSelectUuid
          if (data.indexOf(formData.citypeName.trim()) !== -1) {
            this.$message({showClose: true, message: '配置项类型名称已存在!', type: 'error'});
          } else {
            let operType = this.Type === 'add' ? '添加' : '编辑'
            let params = Object.assign(formData, {uuid: this.edit.uuid})
            $axios.post('/resourcemanager/configurationmanage/citype/save', params, {
              data: [{citypeName: formData.citypeName}],
              logTemplate: `${operType}|配置项类型>配置项(#citypeName#)`
            }).then((res) => {
              if (res.data === 'true') {
                this.$message({showClose: true, message: '保存成功!', type: 'success'});
                this.getTreeData()
              } else {
                this.$message({showClose: true, message: '保存失败!', type: 'error'});
              }
            })
            this.editDialog = false
          }
        })
      },
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      delIsShow(row) {
        let flag;
        row.node.isDefault === 0 ? flag = true : flag = false
        return flag
      },
      Isshow(row) {
       let fla;
       row.node.isDefault === null ? fla = false : fla = true
        return fla
      },
      IsshowEdit(row) {
        let fl;
        row.node.isDeleted === null ? fl = false : fl = true
        return fl
      },
      add() {
        this.addDialog = true
      },
      show(index, row) {
        $axios.post(`/resourcemanager/configurationmanage/citype/getcitypeDetail/${row.uuid}`).then((res) => {
          this.lookList = res.data
          this.lookDialog = true
        })
      },
      editHandler(row) {
        this.edit = row
       this.editDialog = true
      },
      delectList() {
        let self = this
        let uuidArr = self.selections.map(item => {
          return item.uuid;
        });
        let logData = self.selections.map(item => {
          return {
            name: item.name
          };
        });
        if (uuidArr.length === 0) {
          this.$message({showClose: true, message: '至少选择一个', type: 'error'});
        } else {
          self.delHandlerm(uuidArr, logData)
        }
      },
      delHandler(row) {
      this.$confirm('确定删除？', '提示', { confirmButtonText: ' 确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        $axios.post('/resourcemanager/configurationmanage/citype/batchRemove', [row.uuid], {
          data: [{name: row.name}],
          logTemplate: '删除|配置项类型>配置项(#name#)'
        }).then(res => {
          if (res.data.flag === true) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.getTreeData();
          } else {
            this.$message({type: 'error', message: res.data.msg});
          }
        });
      }).catch(() => {});
      },
      delHandlerm(row, logData) {
      this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        $axios.post('/resourcemanager/configurationmanage/citype/batchRemove', row, {
          data: logData,
          logTemplate: '删除|配置项类型>配置项(#name#)'
        }).then(res => {
          if (res.data === 'true') {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getTreeData();
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {});
      },
      getTreeData() {
        function cycle(arr) {
          arr.forEach(item => {
            item.name = item.name.replace(/\(.+\)/g, '');
            item.description = item.node.citypeDescription;
            if (item.childrenList.length !== 0) {
              item.children = item.childrenList;
              cycle(item.children);
            }
          });
        }
        $axios.post('/resourcemanager/configurationmanage/citype/getCountCitypeTree').then((res) => {
          cycle(res.data);
          $axios.post('/resourcemanager/configurationmanage/citype/nonitlist').then(({data}) => {
            let obj = {
              name: '非IT资产',
              node: {
                isDefault: null,
                isDeleted: null
              },
              uuid: '4183b013c2b648b2bb4c6a011324316b',
              children: []
            };
//            let a = data.slice(1, data.length)
            data.slice(0, 3).forEach(item => {
              obj.children.push({
                name: item.citypeName,
               node: {
                 isDeleted: null
               },
                uuid: item.uuid,
                description: item.citypeDescription
              })
            });
            data.slice(3, data.length).forEach(item => {
              obj.children.push({
                name: item.citypeName,
                node: {
                  isDeleted: 1,
                  isDefault: 1
                },
                uuid: item.uuid,
                description: item.citypeDescription
              })
            });
            res.data.push(obj);
            this.tree.data = res.data;
            this.selectCaUuid = this.tree.data
          })
        })
      }
    },
    mounted() {
      this.getTreeData()
    }
  }
</script>
<style lang="stylus">
  .btn
    margin-bottom:10px
</style>
