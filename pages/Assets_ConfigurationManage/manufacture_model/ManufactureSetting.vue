<!--
 * @Author: 高建鹏
 * @Version: //Q4厂商型号配置
 * @Description:厂商页面
 * @Position:配置项管理-》厂商型号配置 ->厂商tab
 * @Date: 2019-10-30 14:35:06
 * @LastEditors: mybells
 -->
<template>
  <div>
    <s-table-page
      ref="manufactureTable"
      :data="data"
      :header-search="searchDef"
      :hasActionCol='false'
      @selection-change="onSelectionChange"
      :header-actions="actionsDef()">
      <s-table-column type="selection" :selectable="isSelectable"></s-table-column>
      <s-table-column label="厂商" prop="caption"></s-table-column>
      <s-table-column label="描述" prop="description"></s-table-column>
      <s-table-column label="操作" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-edit" v-if="!scope.row.defaultStatus" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" v-if="!scope.row.defaultStatus" @click="rowDelete(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <addCustomManufactureDialog :addDialog.sync="addDialog" v-if="addDialog" :rowData="rowData" @reload="getattrpage"></addCustomManufactureDialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax';

  import addCustomManufactureDialog from './Dialog/AddCustomManufactureDialog.vue';

  export default {
    components: {

      addCustomManufactureDialog
    },
    data() {
      return {
        rowData: null,
        addDialog: false,
        data: [],
        selectionList: []
      }
    },
    created() {
      this.getattrpage()
    },
    computed: {
      searchDef() {
        return {
          offset: 7,
          placeholder: '请输入搜索条件',
          searchProps: ['caption']
        }
      }
    },
    methods: {
      getattrpage() {
        $axios.get('/resourcemanager/configurationmanage/manufactProduct/getAllManufact').then(({data}) => {
          this.$refs.manufactureTable.searchKey = '';
          this.data = data || []
        })
      },
      onSelectionChange (val) {
        this.selectionList = val;
      },
      isSelectable(row, index) {
        return !row.defaultStatus
      },
      // 表头按钮定义
      actionsDef() {
        let _this = this
        return {
          width: 12,
          actions: [{
            name: '添加',
            icon: 'plus',
            click(row) {
              _this.rowData = null;
              _this.addDialog = true;
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click(row) {
              if (_this.selectionList.length > 0) {
                _this.$confirm('删除属性会同时删除所有资产的该属性及其数据，确认执行删除操作？', '提示', {
                  confirmButonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  let obj = {
                    data: _this.selectionList,
                    logTemplate: `删除|厂商型号配置>厂商(#caption#)`
                  }
                  $axios.post(`/resourcemanager/configurationmanage/manufactProduct/deleteManufact`, _this.selectionList.map(obj => obj.uuid), obj).then((res) => {
                    if (res.data.state) {
                      _this.$message({type: 'success', message: '删除成功'});
                      _this.getattrpage();
                    } else {
                      _this.$message({type: 'error', message: res.data.errormsg});
                    }
                  });
                }).catch(() => {});
              } else {
                _this.$message({type: 'warning', message: '请至少选择一条数据进行删除'});
              }
            }
          }]
        }
      },
      rowEdit(row) {
        this.rowData = row;
        this.addDialog = true;
      },
      rowDelete(row) {
        this.$confirm('删除属性会同时删除所有资产的该属性及其数据，确认执行删除操作？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let obj = {
            data: [],
            logTemplate: `删除|厂商型号配置>厂商(${row.caption})`
          }
          $axios.post(`/resourcemanager/configurationmanage/manufactProduct/deleteManufact`, [row.uuid], obj).then((res) => {
            if (res.data.state) {
              this.$message({type: 'success', message: '删除成功'});
              this.getattrpage();
            } else {
              this.$message({type: 'error', message: res.data.errormsg});
            }
          });
        }).catch(() => {});
      }
    }
  }
</script>
