<!--
 * @Author: songyf
 * @Version: //Q4人员属性配置
 * @Description:人员属性配置列表
 * @Position:账号管理-组织机构管理-人员属性配置
 * @Date: 2019-11-12 11:11:11
 * @LastEditors: songyf
 -->
<template>
<section>
  <div>
    <s-table-page
      :data="tableData"
      :header-actions="actionsDef()"
      @selection-change="onSelectionChange">
      <s-table-column type="selection" :selectable="isSelectable"></s-table-column>
      <s-table-column label="属性名称" prop="propertyName"></s-table-column>
      <s-table-column label="属性类型" prop="propertyType">
        <template slot-scope="scope">
          <span v-if="scope.row.propertyType===1">文本</span>
          <span v-if="scope.row.propertyType===2">数值</span>
          <span v-if="scope.row.propertyType===3">列表</span>
          <span v-if="scope.row.propertyType===4">日期</span>
        </template>
      </s-table-column>
      <s-table-column label="描述" prop="propertyDesc"></s-table-column>
      <s-table-column label="是否加入人员弹窗" prop="applyFlag">
        <template slot-scope="scope">
          <s-switch v-model="scope.row['applyFlag']" size="small" :active-value="1" :inactive-value="0"
                    :disabled="scope.row.editFlag ? false : true" @change="switchChangeApply(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="是否必填项" prop="requiredValueFlag">
        <template slot-scope="scope">
          <s-switch v-model="scope.row['requiredValueFlag']" size="small" :active-value="1" :inactive-value="0"
                    :disabled="scope.row.editFlag ? false : true" @change="switchChangeRequire(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="是否支持批量编辑" prop="supportEditing">
        <template slot-scope="scope">
          <s-switch v-model="scope.row['batchFlag']" size="small" :active-value="1" :inactive-value="0" v-if="scope.row.propertyKey === 'userWorkPosition'"
                    disabled  @change="switchChangeBath(scope.row)" title="工号具有唯一性，不支持批量编辑"></s-switch>
          <s-switch v-model="scope.row['batchFlag']" size="small" :active-value="1" :inactive-value="0" v-else
                    :disabled="scope.row.editFlag ? false : true" @change="switchChangeBath(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="rowView(scope.row)" title="查看"></i>
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" v-if="!scope.row.internalFlag" @click="rowDelete(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加人员属性配置-->
    <add-people-attribute-conf :addDialog.sync="addDialog" v-if="addDialog" :rowData="rowData" @reload="getTableData"></add-people-attribute-conf>
    <!--查看人员属性配置-->
    <view-people-attribute-conf :viewDialog.sync="viewDialog" v-if="viewDialog" :rowData="rowData"></view-people-attribute-conf>
  </div>
</section>
</template>

<script>
import $axios from 'sunflower-ajax';
import addPeopleAttributeConf from './AddPeopleAttributeConf.vue';
import viewPeopleAttributeConf from './ViewPeopleAttributeConf.vue';
export default {
  data() {
    return {
      tableData: [],
      rowData: null,
      addDialog: false,
      viewDialog: false,
      selectionList: []
    }
  },
  computed: {
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      $axios.get('/userProperties/getAll').then(({data}) => {
        this.tableData = data || []
      })
    },
    isSelectable(row, index) {  // 内置属性不可批量操作
      return !row.internalFlag
    },
    // 表头按钮定义
    actionsDef() {
      let _this = this
      return {
        width: 12,
        actions: [{
          name: '添加',
          icon: 'plus',
          click: function() {
            _this.rowData = null;
            _this.addDialog = true;
          }
        }, {
          name: '批量删除',
          icon: 'batch-del',
          click: function() {
            if (_this.selectionList.length > 0) {
              _this.$confirm('确认执行删除操作？', '提示', {
                confirmButonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let logData = _this.selectionList.map(list => {
                  return {propertyName: list.propertyName, uuid: list.uuid};
                });
                $axios.post('/userProperties/batchRemoveProperty',
                  {uuidList: _this.selectionList.map(obj => obj.uuid)}, {
                    data: logData,
                    logTemplate: '删除|人员管理>人员属性(#propertyName#)'
                  }).then(({data}) => {
                  if (data.data) {
                    data.result = 'success';
                    data.data.map(item => {
                      if (!item.state) {
                        data.result = 'fail';
                        data.err = item.errormsg;
                      }
                    })
                    if (data.result === 'success') {
                      _this.$message({type: 'success', message: '删除成功!'});
                      _this.getTableData();
                    } else {
                      if (data.result === 'fail') {
                        _this.$message({type: 'error', message: data.err});
                        _this.getTableData();
                      }
                    }
                  } else {
                    _this.$message({type: 'error', message: '删除失败'});
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
    rowView(row) {
      this.rowData = row;
      this.viewDialog = true;
    },
    rowEdit(row) {
      this.rowData = row;
      this.addDialog = true;
    },
    rowDelete(row) {
      if (row.applyFlag) {
        this.$message({type: 'warning', message: '请先关闭“是否加入人员弹窗”，再执行删除操作'});
        return
      }
      this.$confirm('确认删除？', '提示', {
        confirmButonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post(`/userProperties/removeProperty/${row.uuid}`, {}, {
          data: [row],
          logTemplate: '删除|人员管理>人员属性(#propertyName#)'
        }).then((res) => {
          if (res.data) {
            this.$message({type: 'success', message: '删除成功'});
            this.getTableData();
          } else {
            this.$message({type: 'error', message: '删除失败'});
          }
        });
      }).catch(() => {
      });
    },
    switchChangeApply(row) {
      $axios.post(`/userProperties/openOrCloseApplySwith`, {uuid: row.uuid, swith: row.applyFlag}, {
        data: [row],
        logTemplate: `${row.applyFlag ? '开启' : '关闭'}|是否加入人员弹窗(#propertyName#)`
      }).then(({data}) => {
      });
      if (row.propertyKey === 'userGender' && row.applyFlag === 1) { // 如果是性别,联动相关操作
        row.requiredValueFlag = 1;
        row.batchFlag = 1;
        this.switchChangeRequire(row);
        this.switchChangeBath(row);
      }
    },
    switchChangeRequire(row) {
      $axios.post(`/userProperties/openOrCloseRequiredSwith`, {uuid: row.uuid, swith: row.requiredValueFlag}, {
        data: [row],
        logTemplate: `${row.requiredValueFlag ? '开启' : '关闭'}|是否必填项(#propertyName#)`
      }).then(({data}) => {
      });
    },
    switchChangeBath(row) {
      $axios.post(`/userProperties/openOrCloseBatchSwith`, {uuid: row.uuid, swith: row.batchFlag}, {
        data: [row],
        logTemplate: `${row.batchFlag ? '开启' : '关闭'}|是否支持批量编辑(#propertyName#)`
      }).then(({data}) => {
      });
    },
    onSelectionChange (val) {
      this.selectionList = val;
    }
  },
  components: {
    addPeopleAttributeConf,
    viewPeopleAttributeConf
  }
}
</script>
