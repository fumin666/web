<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:42
 * @LastEditTime: 2019-12-04 17:54:57
 * @LastEditors: 高建鹏
 -->
<template>
  <section>
    <s-table-page
      ref="multipleTable"
      :data="locationList"
      :header-actions='getListActionsDef()'
      :header-search='getSearchDef()'
      @selection-change="handleSelectionChange"
      style="width:100%"
    >
      <s-table-column type="selection" width="80" :selectable="delIsShow"></s-table-column>
      <s-table-column show-overflow-tooltip prop="name" label="位置"></s-table-column>
      <s-table-column show-overflow-tooltip prop="cityName" label="城市"></s-table-column>
      <s-table-column show-overflow-tooltip prop="countyName" label="区域"></s-table-column>
      <s-table-column show-overflow-tooltip prop="building" label="建筑物"></s-table-column>
      <s-table-column show-overflow-tooltip prop="floor" label="楼层"></s-table-column>
      <s-table-column show-overflow-tooltip prop="partition" label="分区"></s-table-column>
      <s-table-column show-overflow-tooltip prop="locationSite" label="位置"></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)"></i>
          <i v-if="delIsShow(scope.row)"  class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加弹框-->
    <s-dialog
      v-model="addlocalDialog"
      v-if="addlocalDialog"
      width="700px"
      title="添加">
      <add-location ref="addLocal"></add-location>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="addlocalDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑弹框-->
    <s-dialog
      v-model="editlocalDialog"
      v-if="editlocalDialog"
      width="700px"
      title="编辑">
      <add-location ref="editLocal" :editData = editData></add-location>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk">确定</s-button>
        <s-button type="cancel" @click="editlocalDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>
<script>
  import $axios from 'sunflower-ajax'
  import addLocation from './EditLocation'
 export default {
   components: {addLocation},
   data() {
     return {
       locationList: [],
       selections: [],
       addlocalDialog: false,
       editlocalDialog: false,
       editData: {}
     }
   },
   created() {
      this.getList()
   },
   methods: {
     getListActionsDef() {
       let self = this
       return {
         width: 6,
         actions: [{
           name: '添加',
           click: function() {
             self.addlocalDialog = true
           },
           icon: 'plus'
         }, {
           name: '批量删除',
           click: function() {
            if (self.selections.length === 0) {
              self.$message({
                type: 'warning',
                message: '请至少选择一条数据'
              })
            } else {
              self.delete(self.selections.map(item => {
                return item;
              }))
            }
           },
           icon: 'batch-del'
         }]
       }
     },
     getSearchDef() {
       return {
         width: 4,
         offset: 14,
         placeholder: '请输入查询内容',
         searchProps: ['name', 'cityName', 'countyName', 'building', 'floor', 'partition', 'cabinet', 'locationSite']
       }
     },
     delIsShow(row) {
       let flag;
       row.isDefault === 0 ? flag = true : flag = false
       return flag
     },
     getList() {
       $axios.get('/resourcemanager/configurationmanage/location/list').then((res) => {
         this.locationList = res.data
       })
     },
     handleSelectionChange(selections) {
       this.selections = selections;
     },
     editHandler(row) {
      this.editData = row
      this.editlocalDialog = true
       this.$refs.multipleTable.clearSearch()
     },
     addOk() {
       let form = this.$refs.addLocal.$refs.addLocationForm;
       form.validate((valid) => {
         if (!valid) {
           return false;
         }
         let formData = this.$refs.addLocal.locationForm
         let data = this.locationList.map(item => {
         return item.name
         })
         if (data.indexOf(formData.name) !== -1) {
           this.$message({showClose: true, message: '位置名称已存在!', type: 'error'});
         } else {
           let cityData = formData.city
           let city = cityData.length === 1 ? cityData[0] : cityData[1]
           let province = cityData[0]
           let params = {
             building: formData.building,
             cabinet: formData.cabinet,
             province: province,
             city: city,
             county: formData.county,
             floor: formData.floor,
             locationSite: formData.locationSite,
             name: formData.name,
             partition: formData.partition
           }
           let options = {
             data: [{name: params.name}],
             logTemplate: '添加|位置管理>位置(#name#)'
           };
           $axios.post('/resourcemanager/configurationmanage/location/save', params, options).then((res) => {
             if (res.data.state === true) {
               this.$message({
                 type: 'success',
                 message: '保存成功'
               })
               this.getList()
               this.addlocalDialog = false
             }
           })
         }
       })
     },
     editOk() {
       let form = this.$refs.editLocal.$refs.addLocationForm;
       form.validate((valid) => {
         if (!valid) {
           return false;
         }
         let formData = this.$refs.editLocal.locationForm
         let data = this.locationList.map(item => {
           return item.name
         })
         let Data = data.filter(item => {
           return (item !== this.editData.name)
         })
         if (Data.indexOf(formData.name) !== -1) {
           this.$message({showClose: true, message: '位置名称已存在!', type: 'error'});
         } else {
           let cityData = formData.city
           let city = cityData.length === 1 ? cityData[0] : cityData[1]
           let province = cityData[0]
           let params = {
             uuid: this.editData.uuid,
             name: formData.name,
             city: city,
             county: formData.county,
             building: formData.building,
             floor: formData.floor,
             partition: formData.partition,
             cabinet: formData.cabinet,
             locationSite: formData.locationSite,
             province: province
           }
           let options = {
             data: [{name: params.name}],
             logTemplate: '编辑|位置管理>位置(#name#)'
           };
           $axios.post('/resourcemanager/configurationmanage/location/update', params, options).then((res) => {
             if (res.data.state === true) {
               this.$message({
                 type: 'success',
                 message: '保存成功'
               })
               this.getList()
               this.editlocalDialog = false
             }
           })
         }
       })
     },
     delHandler(row) {
      this.delete([row])
     },
     delete(rowArr) {
       let param = [];
       if (rowArr.length > 0) {
         for (let i in rowArr) {
           param.push(rowArr[i].uuid)
         }
       }
       let options = {
         data: rowArr,
         logTemplate: '删除|位置管理>位置(#name#)'
       }
       this.$confirm('确定删除？', '提示', { confirmButtonText: ' 确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
         $axios.post('/resourcemanager/configurationmanage/location/remove', param, options).then(res => {
           if (res.data === true) {
             this.$message({
               message: '删除成功',
               type: 'success'
             });
             this.getList()
           } else {
             this.$message({type: 'error', message: '删除失败'});
           }
         });
       }).catch(() => {});
     }
   }
 }
</script>
<style>
</style>
