<!--
 * @Author: 高建鹏
 * @Version: //Q4资产通用属性调整
 * @Description:通用属性和厂商型号tab
 * @Position:配置项管理
 * @Date: 2019-09-12 11:13:10
 * @LastEditors  : mybells
 -->
<template>
  <div class="managex" style="height: calc(100vh - 190px);margin-top: 15px;">
    <s-col span="4">
      <s-menu :active-name="activeTab" @on-select="selection" style="font-size:14px">
        <s-menu-item name="pane1" v-if="judgeRoleBtn('assetsManage_configurationItemType') || judgeRoleBtn('gradeProtect_rsConfItemType')">
          <i class="icon iconfont icon-set-configure"></i>
          配置项类型
        </s-menu-item>
        <s-menu-item name="pane2" v-if="judgeRoleBtn('assetsManage_relationshipTypes') || judgeRoleBtn('gradeProtect_rsRelationType')">
          <i class="icon iconfont icon-yiwei"></i>
          关系类型
        </s-menu-item>
        <s-menu-item name="pane3" v-if="judgeRoleBtn('assetsManage_configurationItemStatus') || judgeRoleBtn('gradeProtect_rsConfItemStatus')">
          <i class="iconfont icon-compass"></i>
          配置项状态
        </s-menu-item>
        <s-menu-item name="pane4" v-if="judgeRoleBtn('assetsManage_generalProperties') || judgeRoleBtn('gradeProtect_rsGeneralAttribute')">
          <i class="iconfont icon-file"></i>
          通用属性
        </s-menu-item>
        <s-menu-item name="pane5" v-if="judgeRoleBtn('assetsManage_manufactAndProduct') || judgeRoleBtn('gradeProtect_rsProductConf')">
          <i class="iconfont icon-organ"></i>
          厂商型号配置
        </s-menu-item>
        <s-menu-item name="pane6" v-if="judgeRoleBtn('assetsManage_manufactAndProduct') || judgeRoleBtn('gradeProtect_rsAssetImportantDegree')">
          <i class="iconfont icon-histogram"></i>
          资产重要程度
        </s-menu-item>
      </s-menu>
    </s-col>
    <s-col span="20" style="padding-left:20px;">
      <s-scrollbar wrap-style="maxHeight:calc(100vh - 190px);">
        <conManage ref="multipleTable" v-if="activeTab === 'pane1'"></conManage>
        <relateType ref="multipleTable" v-if="activeTab === 'pane2'"></relateType>
        <s-table-page ref="multipleTable" :data="assetstatuslist" :header-actions='getListActionsDef()' :header-search='getSearchDef()'
          @selection-change="handleSelectionChange" style="width:100%" v-if="activeTab === 'pane3'">
          <s-table-column type="selection" width="180" :selectable="delIsShow"
            v-if="judgeRoleBtn('assetsManage_editConfStatus') && judgeRoleBtn('assetsManage_viewConfStatus')"></s-table-column>
          <s-table-column prop="assetstatusName" label="名称"></s-table-column>
          <s-table-column prop="assetstatusDesc" label="描述"></s-table-column>
          <s-table-column label="操作" v-if="judgeRoleBtn('assetsManage_editConfStatus') && judgeRoleBtn('assetsManage_viewConfStatus')">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" title="编辑" @click="editHandler(scope.row)" v-noBtn="'assetsManage_editConfStatus'"></i>
              <i v-if="delIsShow(scope.row)" class="iconfont icon-delete" title="删除" @click="delHandler(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table-page>
        <assetsAttr ref="multipleTable" v-if="activeTab === 'pane4'"></assetsAttr>
        <manufactureModel v-if="activeTab === 'pane5'"></manufactureModel>
        <assetsImportance v-if="activeTab === 'pane6'"></assetsImportance>
      </s-scrollbar>
    </s-col>
    <!--新增-->
    <s-dialog v-model="addAssetsDialog" v-if="addAssetsDialog" width="600px" title="添加">
      <add-assets-dialog ref="addAssets"></add-assets-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="addCancel">取消</s-button>
      </template>
    </s-dialog>
    <!--编辑-->
    <s-dialog v-model="editAssetsDialog" v-if="editAssetsDialog" width="600px" title="编辑">
      <add-assets-dialog :editData="editdata" ref="editAssets"></add-assets-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="editOk">确定</s-button>
        <s-button type="cancel" @click="editCancel">取消</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>

import $axios from 'sunflower-ajax';
import AddAssetsDialog from '@/pages/Assets_ConfigurationManage/AddDialog';
import relateType from '@/pages/Assets_ConfigurationManage/RelateType';
import assetsImportance from '@/pages/Assets_ConfigurationManage/AssetsImportance';
import conManage from '@/pages/Assets_ConfigurationManage/ConManage'
import assetsAttr from '@/pages/Assets_ConfigurationManage/AssetsAttr';
// import specialAttr from '@/components/customFormPanel/dragForm'
import manufactureModel from './manufacture_model/ManufactureModel.vue'
export default {
  data() {
    return {
      tabNameArr: ['assetsManage_configurationItemType', 'assetsManage_relationshipTypes', 'assetsManage_configurationItemStatus'], // 页签名字的集合(顺序和页签一致)
      selections: [],
      assetstatuslist: [],
      addAssetsDialog: false,
      editAssetsDialog: false,
      editdata: {},
      activeTab: 'pane1',
      currentAssetStatusNameCache: ''
    }
  },
  components: { AddAssetsDialog, relateType, conManage, assetsAttr, manufactureModel, assetsImportance },
  methods: {
    selection(key) {
      this.activeTab = key
    },
    handleSelectionChange(selections) {
      this.selections = selections;
    },
    delIsShow(row) {
      let flag;
      row.isDefault === 1 ? flag = false : flag = true
      return flag
    },
    editHandler(row) {
      this.editAssetsDialog = true
      this.currentAssetStatusNameCache = row.assetstatusName
      this.editdata = {
        uuid: row.uuid,
        assetstatusName: row.assetstatusName,
        assetstatusDesc: row.assetstatusDesc
      }
    },
    delHandler(row) {
      this.$confirm('确定删除？', '提示', { confirmButtonText: ' 确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        $axios.post('/resourcemanager/configurationmanage/assetstatus/assetstatusremove', [row.uuid], {
          data: [{ assetstatusName: row.assetstatusName }],
          logTemplate: '删除|资产状态>状态(#assetstatusName#)'
        }).then(response => {
          if (response.data.flag === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          } else {
            this.$message({ type: 'error', message: '部分状态正在使用不能删除' });
          }
        })
      }).catch(() => { });
    },
    delHandlerm(row, logData) {
      this.$confirm('确定删除？', '提示', { confirmButtonText: ' 确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
        $axios.post('/resourcemanager/configurationmanage/assetstatus/assetstatusremove', row, {
          data: logData,
          logTemplate: '删除|资产状态>状态(#assetstatusName#)'
        }).then(response => {
          if (response.data.flag === true) {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          } else if (response.data.flag === false) {
            this.$message({
              message: '部分状态正在使用不能删除',
              type: 'error'
            });
            this.getList();
          } else {
            this.$message({
              message: '删除成功',
              type: 'error'
            });
          }
        })
      }).catch(() => { });
    },
    getListActionsDef() {
      let self = this
      return {
        width: 6,
        actions: [{
          name: '添加',
          show: (row) => {
            return self.judgeRoleBtn('assetsManage_addConfStatus');
          },
          click() {
            self.addAssetsDialog = true
          },
          icon: 'plus'
        }, {
          name: '批量删除',
          show: (row) => {
            return self.judgeRoleBtn('assetsManage_batchDelConfStatus');
          },
          click() {
            let uuidArr = self.selections.map(item => {
              return item.uuid;
            });
            let logData = self.selections.map(item => {
              return {
                assetstatusName: item.assetstatusName
              };
            });
            // console.log(uuidArr)
            if (uuidArr.length === 0) {
              self.$message({ showClose: true, message: '至少选择一个', type: 'error' });
            } else {
              self.delHandlerm(uuidArr, logData)
            }
          },
          icon: 'batch-del'
        }]
      }
    },
    getSearchDef() {
      return {
        show: false
      }
    },
    addOk() {
      let form = this.$refs['addAssets'].$refs['addForm'];
      let addForm = this.$refs['addAssets'].form;
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let param = {
          name: addForm.assetstatusName
        }
        $axios.post('/resourcemanager/configurationmanage/assetstatus/nameValidate', param).then(({ data }) => {
          if (data === 'false') {
            this.$message({ showClose: true, message: '资产状态名称已存在!', type: 'error' });
          } else {
            $axios.post('/resourcemanager/configurationmanage/assetstatus/assetstatussave', addForm, {
              data: [{ assetstatusName: addForm.assetstatusName }],
              logTemplate: '添加|资产状态>状态(#assetstatusName#)'
            }).then((res) => {
              if (res.data === 'true') {
                this.$message({
                  message: '保存成功  ',
                  type: 'success'
                });
                this.addAssetsDialog = false;
                this.getList();
              }
            });
          }
        })
      });
    },
    addCancel() {
      this.addAssetsDialog = false;
    },
    editOk() {
      let form = this.$refs['editAssets'].$refs['addForm'];
      let addForm = this.$refs['editAssets'].form;
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        if (this.currentAssetStatusNameCache !== addForm.assetstatusName) {
          if (this.assetstatuslist.map(item => item.assetstatusName).indexOf(addForm.assetstatusName) !== -1) {
            this.$message({ showClose: true, message: '资产状态名称已存在!', type: 'error' });
            return false;
          }
        }
        if (addForm.assetstatusName.trim().length === 0) {
          this.$message({
            message: '资产状态名称不能为空',
            type: 'error'
          });
        } else {
          $axios.post('/resourcemanager/configurationmanage/assetstatus/assetstatusupdate', addForm, {
            data: [{ assetstatusName: addForm.assetstatusName }],
            logTemplate: '编辑|资产状态>状态(#assetstatusName#)'
          }).then((res) => {
            if (res.data === 'true') {
              this.$message({
                message: '修改成功  ',
                type: 'success'
              });
              this.editAssetsDialog = false;
              this.getList();
            }
          });
        }
      });
    },
    editCancel() {
      this.editAssetsDialog = false
    },
    getList() {
      $axios.get('/resourcemanager/configurationmanage/assetstatus/assetstatuslist').then((res) => {
        this.assetstatuslist = res.data
      })
    }
  },
  mounted() {
    this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    this.getList();
  }
}
</script>
