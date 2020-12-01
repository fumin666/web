<template>
<div>
  <s-table-page
    ref="multipleTable"
    :data="ManageData"
    :header-actions='getListActionsDef()'
    :header-search='{show: false}'
    @selection-change="handleSelectionChange"
    style="width:100%"
  >
  <!--  <s-table-column type="selection" width="180"></s-table-column>-->
    <s-table-column prop="fristTypeName" label="一级分类"></s-table-column>
   <s-table-column prop="secondTypeName" label="二级分类"></s-table-column>
    <s-table-column prop="threeTypeName" label="三级分类"></s-table-column>
    <s-table-column prop="remarks" label="描述"></s-table-column>
    <s-table-column label="操作" width="250">
      <template slot-scope="scope">
        <i class="iconfont icon-eye" title="查看" @click="lookHanddler(scope.row)" v-noBtn="'assetsManage_viewConfigurationItem'"></i>
        <i class="iconfont icon-edit" v-if="delIsShow(scope.row)" title="编辑" @click="editHandler(scope.row)"></i>
        <i class="iconfont icon-oper-auto-1" title="编辑特殊属性" @click="editspecialAttr(scope.row)" v-noBtn="'assetsManage_editSpecialAttr'"></i>
        <i class="iconfont icon-delete" v-if="delIsShow(scope.row)" title="删除" @click="delHandler(scope.row)"></i>
      </template>
    </s-table-column>
  </s-table-page>
  <!--添加弹框-->
  <s-dialog
    v-model="addDialog"
    v-if="addDialog"
    width="600px"
    title="添加">
    <add-manage-dialog ref="addManage"></add-manage-dialog>
    <template slot="footer" class="dialog-footer">
      <s-button @click="addOk">保存</s-button>
      <s-button type="cancel" @click="addDialog=false">取消</s-button>
    </template>
  </s-dialog>
  <!--编辑弹框-->
  <s-dialog
    v-model="editDialog"
    v-if="editDialog"
    width="600px"
    title="编辑">
    <add-manage-dialog ref="editManage" :editData="editManageData"></add-manage-dialog>
    <template slot="footer" class="dialog-footer">
      <s-button @click="editOk">保存</s-button>
      <s-button type="cancel" @click="editDialog=false">取消</s-button>
    </template>
  </s-dialog>
  <!--编辑特殊属性-->
  <!-- class="special-status-dialog"必须，不要删除 -->
  <s-dialog
  v-model="specialDialog"
  v-if="specialDialog"
  class="special-status-dialog"
  width="1000px"
  title="编辑特殊属性"
  >
<edit-special-dialog ref="editSpecial" :specialdata="specialAttrData"></edit-special-dialog>
    <template slot="footer" class="dialog-footer">
      <s-button @click="editspecialOk">保存</s-button>
      <s-button type="cancel" @click="specialDialog=false">取消</s-button>
    </template>
  </s-dialog>
  <!--查看-->
  <s-dialog
    v-model="lookDialog"
    v-if="lookDialog"
    width="700px"
    title="查看"
  >
    <look-dialog ref="lookDialog" :specialData="specialData"></look-dialog>
  </s-dialog>
</div>
</template>

<script type="text/ecmascript-6">

  import addManageDialog from './components/AddManageDialog'
  import editSpecialDialog from './components/EditspecialDialog'
  import $axios from 'sunflower-ajax';
  import lookDialog from './components/LookManageDialog'
  export default {
    components: {addManageDialog, editSpecialDialog, lookDialog},
   data () {
  return {
    ManageData: [],
    selections: [],
    addDialog: false,
    editDialog: false,
    specialDialog: false,
    lookDialog: false,
    looknormalDialog: false,
    specialData: {},
    editManageData: {},
    firstData: [],
    secondData: [],
    threeData: [],
    specialAttrData: {}
  }
  },
  created() {
    this.getData()
  },
  methods: {
    delIsShow(row) {
      let flag;
      row.isDefault === 1 ? flag = false : flag = true
      return flag
    },
    getData() {
      $axios.get('resourcemanager/configurationmanage/citype/getCitypeList').then((res) => {
       this.ManageData = res.data
       this.firstData = this.ManageData.map(item => {
           return item.fristTypeUuid
        })
        this.secondData = this.ManageData.map(item => {
          return item.secondTypeUuid
        })
        this.threeData = this.ManageData.map(item => {
          return item.threeTypeUuid
        })
      })
    },
    getListActionsDef() {
      let self = this
      return {
        width: 6,
        actions: [{
          name: '添加',
          show: (row) => {
            return self.judgeRoleBtn('assetsManage_addConfigurationItem');
          },
          click() {
           self.addDialog = true
          },
          icon: 'plus'
        }]
      }
      },
    handleSelectionChange(selections) {
        this.selections = selections;
    },
    lookHanddler(row) {
      this.specialData = row
      this.lookDialog = true
    },
    editHandler(row) {
    this.editManageData = row
    this.editDialog = true
    },
    editspecialAttr(row) {
    this.specialAttrData = row
    this.specialDialog = true
    },
    delHandler(row) {
      this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        let param = {
          data: [{fristTypeName: row.fristTypeName + '/' + row.secondTypeName + (row.threeTypeName ? ('/' + row.threeTypeName) : '')}],
          logTemplate: '删除|配置项类型>配置项(#fristTypeName#)'
        };
        $axios.get(`/resourcemanager/configurationmanage/citype/deleteCitype/${row.fristTypeUuid}/${row.secondTypeUuid}/${row.threeTypeUuid}`, param).then(({data}) => {
          if (data.state === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getData();
          } else {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {});
    },
    IsUuid(data, uuid) {
      data = data.map(item => {
        return item.uuid
      })
      if (data.indexOf(uuid) !== -1) {
        return uuid
      } else {
      return null
      }
    },
    IsName(data, uuid) {
      if (data.indexOf(uuid) !== -1) {
        return true
      } else {
       return false
      }
    },
    IscitypeName(data, uuid) {
     data = data.filter(item => {
      return item.uuid === uuid
      })
      return data[0].citypeName
    },
    citypeName(save, type, editname, name) {
    let data = []
      if (type === 1) {
        if (save === 'edit') {
          this.ManageData.forEach((item, index) => {
            if (item.fristTypeUuid === editname) {
              this.ManageData.splice(index, 1)
            }
          })
        }
     data = this.ManageData.map(item => item.fristTypeName && item.fristTypeName.length !== 0 ? item.fristTypeName.replace(/\s+/g, '') : item.fristTypeName)
      } else if (type === 2) {
        if (save === 'edit') {
          this.ManageData.forEach((item, index) => {
            if (item.secondTypeUuid === editname) {
              this.ManageData.splice(index, 1)
            }
          })
        }
     data = this.ManageData.map(item => item.secondTypeName && item.secondTypeName.length !== 0 ? item.secondTypeName.replace(/\s+/g, '') : item.secondTypeName)
      } else {
        if (save === 'edit') {
          this.ManageData.forEach((item, index) => {
            if (item.threeTypeUuid === editname) {
              this.ManageData.splice(index, 1)
            }
          })
        }
     data = this.ManageData.map(item => item.threeTypeName && item.threeTypeName.length !== 0 ? item.threeTypeName.replace(/\s+/g, '') : item.threeTypeName)
      }
      name = (name && name.length !== 0) ? name.replace(/\s+/g, '') : name
      if (data.indexOf(name) !== -1) {
      return true
      } else {
      return false
      }
    },
    addOk() {
      let form = this.$refs['addManage'].$refs['manageForm'];
      let addForm = this.$refs['addManage'].Manageform;
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let fristData = this.$refs['addManage'].fristData
        let secondData = this.$refs['addManage'].secondData
        let threeData = this.$refs['addManage'].threeData
         if ((this.IsName(this.firstData, addForm.fristTypeUuid) && this.IsName(this.secondData, addForm.secondTypeUuid) && (!addForm.threeTypeUuid)) ||
          (this.IsName(this.firstData, addForm.fristTypeUuid) && this.IsName(this.secondData, addForm.secondTypeUuid) && (addForm.threeTypeUuid) && this.IsName(this.threeData, addForm.threeTypeUuid))) {
           this.$message({
             message: '配置项类型已存在',
             type: 'error'
           });
         } else {
           let data = Object.assign({},
             {fristTypeUuid: this.IsUuid(fristData, addForm.fristTypeUuid)},
             {secondTypeUuid: this.IsUuid(secondData, addForm.secondTypeUuid)},
             {threeTypeUuid: this.IsUuid(threeData, addForm.threeTypeUuid)})
           let params = Object.assign({}, data,
             {remarks: addForm.remarks},
             {fristTypeName: data.fristTypeUuid === null ? addForm.fristTypeUuid : this.IscitypeName(fristData, addForm.fristTypeUuid)},
             {secondTypeName: data.secondTypeUuid === null ? addForm.secondTypeUuid : this.IscitypeName(secondData, addForm.secondTypeUuid)},
             {threeTypeName: data.threeTypeUuid === null ? addForm.threeTypeUuid : this.IscitypeName(threeData, addForm.threeTypeUuid)}
           )
           if (params.threeTypeName.length === 0) {
             params.threeTypeName = null
           }
           if (params.fristTypeUuid === null && this.citypeName('add', 1, '', params.fristTypeName) && params.secondTypeUuid === null && this.citypeName('add', 2, '', params.secondTypeName) && params.threeTypeUuid === null && this.citypeName('add', 3, '', params.threeTypeName)) {
             this.$message({
               message: '配置项类型已存在',
               type: 'error'
             });
           } else {
             let options = {
               data: [{fristTypeName: params.fristTypeName + '/' + params.secondTypeName + (params.threeTypeName ? ('/' + params.threeTypeName) : '')}],
               logTemplate: '添加|配置项类型>配置项(#fristTypeName#)'
             };
             $axios.post('/resourcemanager/configurationmanage/citype/saveCitype', params, options).then(({data}) => {
               if (data.state === true) {
                 this.$message({
                   message: '保存成功',
                   type: 'success'
                 });
                 this.getData();
               } else {
                 this.$message({
                   message: '保存失败',
                   type: 'error'
                 })
               }
             })
           }
           this.addDialog = false
         }
      })
    },
    IseditName(name, level, cb) {
    $axios.get(`/resourcemanager/configurationmanage/citype/validateCmdbcitype/${name}/${level}`).then(({data}) => {
    cb(data.state === false)
    })
    },
    editOk() {
      let form = this.$refs['editManage'].$refs['manageForm'];
      let editForm = this.$refs['editManage'].Manageform;
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let fristData = this.$refs['editManage'].fristData
        let secondData = this.$refs['editManage'].secondData
        let threeData = this.$refs['editManage'].threeData
          let editData = Object.assign({},
            {fristTypeUuid: this.IsUuid(fristData, editForm.fristTypeUuid)},
            {secondTypeUuid: this.IsUuid(secondData, editForm.secondTypeUuid)},
            {threeTypeUuid: this.IsUuid(threeData, editForm.threeTypeUuid)},
            {
              status: this.editManageData.threeTypeName === null && editForm.threeTypeUuid &&
              editForm.threeTypeUuid.length !== 0 ? 1 : this.editManageData.threeTypeUuid &&
              this.editManageData.threeTypeUuid.length !== 0 &&
              editForm.threeTypeUuid.length === 0 ? 2 : this.editManageData.threeTypeName !== null &&
              editForm.threeTypeUuid && editForm.threeTypeUuid.length !== 0 ? 3 : 2
            })
          let params = Object.assign({}, editData,
            {remarks: editForm.remarks},
            {fristTypeName: editData.fristTypeUuid === null ? editForm.fristTypeUuid : this.IscitypeName(fristData, editForm.fristTypeUuid)},
            {secondTypeName: editData.secondTypeUuid === null ? (this.editManageData.secondTypeUuid === editForm.secondTypeUuid ? editForm.secondTypeName : editForm.secondTypeUuid) : this.IscitypeName(secondData, editForm.secondTypeUuid)},
            {threeTypeName: editData.threeTypeUuid === null ? (this.editManageData.threeTypeUuid === editForm.threeTypeUuid ? editForm.threeTypeName : editForm.threeTypeUuid) : this.IscitypeName(threeData, editForm.threeTypeUuid)}
          )
          /* 是否改变了数据 */
          let changeData = ((editForm.fristTypeUuid !== this.editManageData.fristTypeUuid) || (editForm.secondTypeUuid !== this.editManageData.secondTypeUuid) || (editForm.threeTypeUuid !== this.editManageData.threeTypeUuid));

          /* 查看列表中1+2+3级和编辑后1+2+3是否相同 */
          let list = this.ManageData.map(item => { return item.fristTypeUuid + item.secondTypeUuid + item.threeTypeUuid });
          let isSameInList = list.filter(item => { return item === (editForm.fristTypeUuid + editForm.secondTypeUuid + editForm.threeTypeUuid) })

          /* 列表中一级数组中是否包含编辑后的一级 ，列表中二级数组中是否包含编辑后的二级 ，列表中三级数组中是否包含编辑后的三级 */
          // let IsEditName = this.IsName(this.firstData, editForm.fristTypeUuid) && this.IsName(this.secondData, editForm.secondTypeUuid) && this.IsName(this.threeData, editForm.threeTypeUuid)
        if (changeData && isSameInList.length) {
          this.$message({
            message: '配置项类型已存在',
            type: 'error'
          });
        } else if ((this.citypeName('edit', 1, editForm.fristTypeUuid, params.fristTypeName) && this.citypeName('edit', 2, editForm.secondTypeUuid, params.secondTypeName) && this.citypeName('edit', 3, editForm.threeTypeUuid, params.threeTypeName))) {
          this.$message({
            message: '配置项类型已存在',
            type: 'error'
          });
        } else {
          if (this.editManageData.threeTypeUuid && this.editManageData.threeTypeUuid.length !== 0 && editForm.threeTypeUuid.length === 0 ||
            this.editManageData.threeTypeName !== null && editForm.threeTypeUuid && editForm.threeTypeUuid.length !== 0
          ) {
            params.threeTypeUuid = this.editManageData.threeTypeUuid
          }
          if (!params.secondTypeUuid) {
            params.secondTypeUuid = this.editManageData.secondTypeUuid
          }
          if (!params.fristTypeUuid) {
            params.fristTypeUuid = this.editManageData.fristTypeUuid
          }
          if (!params.threeTypeName) {
            params.threeTypeName = null
          }
          let options = {
            data: [{fristTypeName: params.fristTypeName + '/' + params.secondTypeName + (params.threeTypeName ? ('/' + params.threeTypeName) : '')}],
            logTemplate: '编辑|配置项类型>配置项(#fristTypeName#)'
          };
            $axios.post('/resourcemanager/configurationmanage/citype/updateCitype', params, options).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                });
                this.getData();
                this.editDialog = false
              } else {
                this.$message({
                  message: '编辑失败',
                  type: 'error'
                });
                this.editDialog = false
              }
            })
        }
      })
    },
    editspecialOk() {
      this.$refs.editSpecial.$refs.SpecialAttr.Typesave()
      this.specialDialog = false
    },
    lookOk() {
      this.lookDialog = false
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
