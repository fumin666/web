<!--
 * @Author: 高建鹏
 * @Version: //Q4资产通用属性调整
 * @Description:通用属性页面
 * @Position:配置项管理-》通用属性
 * @Date: 2019-09-12 11:13:10
 * @LastEditors  : mybells
 -->
<template>
  <div id="assetsArr">
    <s-table-page
      :data="data"
      :searchDef="{show:false}"
      :hasActionCol='false'
      @selection-change="onSelectionChange"
      :header-actions="actionsDef()">
      <s-table-column type="selection" :selectable="isSelectable"></s-table-column>
      <s-table-column label="属性名称" prop="colnumName"></s-table-column>
      <s-table-column label="属性类型" prop="dataType">
        <template slot-scope="scope">
          <span v-if="scope.row.dataType===1&&scope.row.colnumName!=='IP地址'&&scope.row.colnumName!=='面板'">文本</span>
          <span v-if="scope.row.dataType===1&&scope.row.colnumName==='IP地址'">数值(IP格式)</span>
          <span v-if="scope.row.dataType===1&&scope.row.colnumName==='面板'">文本(图片)</span>
          <span v-if="scope.row.dataType===2">数值</span>
          <span v-if="scope.row.dataType===3">列表</span>
          <span v-if="scope.row.dataType===4">日期</span>
        </template>
      </s-table-column>
      <s-table-column label="描述" prop="attributeDesc"></s-table-column>
      <s-table-column label="是否应用" prop="applicationStatus">
        <template slot-scope="scope">
          <s-switch v-model="scope.row['applicationStatus']" size="small" :active-value="1" :inactive-value="0"
          :disabled="scope.row.switchStatus===1||isOnlyTeamLeader" @change="switchChange(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="是否必填" prop="requiredStatus">
        <template slot-scope="scope">
          <s-switch v-model="scope.row['requiredStatus']" size="small" :active-value="1" :inactive-value="0"
          :disabled="scope.row.switchStatus===1||isOnlyTeamLeader" @change="switchChange(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="是否支持批量编辑" prop="supportEditing">
        <template slot-scope="scope">
          <s-switch v-if="scope.row.colnumName!=='资产编码'" size="small" v-model="scope.row['supportEditing']" :active-value="1" :inactive-value="0"
          :disabled="scope.row.switchStatus===1||isOnlyTeamLeader" @change="switchChange(scope.row)"></s-switch>
          <s-switch v-if="scope.row.colnumName==='资产编码'" size="small" v-model="scope.row['supportEditing']" :active-value="1" :inactive-value="0"
          :disabled="true||isOnlyTeamLeader" @change="switchChange(scope.row)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="操作" width="150">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="rowView(scope.row)" title="查看"></i>
          <i class="iconfont icon-edit" @click="rowEdit(scope.row)" title="编辑"></i>
          <i class="iconfont icon-delete" v-if="!scope.row.defaultStatus&&!isOnlyTeamLeader" @click="rowDelete(scope.row)" title="删除"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <addCustomAttributeDialog :addDialog.sync="addDialog" v-if="addDialog" :rowData="rowData" @reload="getattrpage"></addCustomAttributeDialog>
    <viewAttributeDialog :viewDialog.sync="viewDialog" v-if="viewDialog" :rowData="rowData"></viewAttributeDialog>
  </div>
</template>
<script>
  import $axios from 'sunflower-ajax';
  // import {cloneDeep} from 'lodash'

  import addCustomAttributeDialog from './AddCustomAttributeDialog.vue';
  import viewAttributeDialog from './ViewAttributeDialog.vue';

  export default {
    components: {
      addCustomAttributeDialog,
      viewAttributeDialog
    },
    data() {
      return {
        rowData: null,
        addDialog: false,
        viewDialog: false,
        data: [],
        selectionList: [],
        isOnlyTeamLeader: false
      }
    },
    created() {
      let role = this.$store.state.userData.roleUuidsStr ? this.$store.state.userData.roleUuidsStr.split(',') : [];
      if (role.length === 1 && role[0] === 'tsecondroleinfo00000000000000008') {
        // 如果角色只有团队主管，只能查看
        this.isOnlyTeamLeader = true;
      }
      this.getattrpage()
    },
    methods: {
      getattrpage() {
        $axios.post('/resourcemanager/configurationmanage/generalProperty/getAllGeneralProperty').then(({data}) => {
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
            click() {
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
                  $axios.post('/resourcemanager/configurationmanage/generalProperty/batchDeleteGeneralProperty', _this.selectionList.map(obj => obj.uuid), {
                    data: _this.selectionList,
                    logTemplate: '删除|通用属性>通用属性(#colnumName#)'
                  }).then((res) => {
                    if (res.data.state) {
                      _this.$message({type: 'success', message: '删除成功'});
                      _this.getattrpage();
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
        this.$confirm('删除属性会同时删除所有资产的该属性及其数据，确认执行删除操作？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/resourcemanager/configurationmanage/generalProperty/deleteGeneralProperty`, {propertyUuid: row.uuid}, {
            data: [row],
            logTemplate: '删除|通用属性>通用属性(#colnumName#)'
          }).then((res) => {
            if (res.data.state) {
              this.$message({type: 'success', message: '删除成功'});
              this.getattrpage();
            }
          });
        }).catch(() => {});
      },
      switchChange(row) {
        $axios.post(`/resourcemanager/configurationmanage/generalProperty/generalPropertyStatusSwitch`, row).then((res) => {});
      }
    }
  }
</script>
