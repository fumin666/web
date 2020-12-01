<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-19 18:52:12
 * @LastEditTime: 2020-07-09 01:23:00
 * @LastEditors: mybells
 -->
<!-- 协议设置 -->
<template>
  <div class="protocol-set">
    <s-row class="left-btn" v-show="!assetName">
      <s-button icon="plus" @click="add" v-if="judgeRoleBtn('assetsManage_addProtocol') || judgeRoleBtn('assetsManage_omaAddProtocol')">添加</s-button>
      <s-button icon="batch-del" @click="del" v-if="judgeRoleBtn('assetsManage_batchDelProtocol') || judgeRoleBtn('assetsManage_omaBatchDelProtocol')">批量删除</s-button>
      <s-button icon="batch-import" @click="importBatch" v-if="judgeRoleBtn('assetsManage_importProtocol') || judgeRoleBtn('assetsManage_omaImportProtocol')">协议导入</s-button>
      <s-button icon="batch-import" @click="importDbBatch" v-if="judgeRoleBtn('assetsManage_dbaImport') || judgeRoleBtn('assetsManage_omaDbaImport')">数据库实例导入</s-button>
      <s-button @click="batchExport" icon="export" v-if="judgeRoleBtn('assetsManage_exportProtocol') || judgeRoleBtn('assetsManage_omaExportProtocol')">批量导出</s-button>
    </s-row>
    <s-table-page :data="configList"
                 max-height="500"
                 @selection-change="selectionChange"
                 :row-actions='rowActionsDef()'
                 :row-class-name="tableRowClassName"
                 class="number-link"
                 actions-col-width="180">
      <s-table-column type="selection" width="45" show-overflow-tooltip v-if="!assetName">
      </s-table-column>
      <s-table-column prop="protocolName" label="协议名称" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="port" label="端口" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="资产账号数量" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="goDetail(scope.row)" href="javascript:void(0);" class="ipamColor">{{ scope.row.accountCount }}</a>
        </template>
      </s-table-column>
     <!-- <s-table-column label="资产账号名称" show-overflow-tooltip>
        <template slot-scope="scope">
          {{(scope.row.protocolName === 'SNMPV1' || scope.row.protocolName === 'SNMPV2') ? ((!scope.row.snmpCWordOr) ?
          '无' : scope.row.snmpCWordOr) : ((!scope.row.assetsAccountInfo) ? '无' :
          (!scope.row.assetsAccountInfo.accountName ? '无' : scope.row.assetsAccountInfo.accountName))}}
        </template>
      </s-table-column>
      <s-table-column label="资产账号角色" show-overflow-tooltip>
        <template slot-scope="scope">
          {{(!scope.row.accountTypeName) ? '无' : scope.row.accountTypeName}}
        </template>
      </s-table-column>-->
    </s-table-page>
    <!-- 协议设置添加弹框 -->
    <ProtocolSetAddDialog v-model="addDialogFlag" v-if="addDialogFlag" :options="selectOptionsObj" :data="configData"
                          :asset-uuid="uuid" :already-proto-list="configListalready" :curAsset="curAsset"
                          @config-save="configSave">
    </ProtocolSetAddDialog>

    <!-- 协议关联弹框 -->
    <s-dialog v-model="agreeAssociatedDialogFlag" v-if="agreeAssociatedDialogFlag" title="添加数据库/实例" width="600px" ref="agreeAssociatedDialog" append-to-body>
      <agreeAssociateDialog :agreeAssociated="agreeAssociated" :curAsset="curAsset">
      </agreeAssociateDialog>
    </s-dialog>
    <!--导入-->
    <import-dialog v-if="importDialogFlag" v-model="importDialogFlag" :save-log="true" :upload-obj="uploadObj"
                   :down-obj="downObj" @reload="()=>axiosConfigList(addAssetUuid)" :file-types="['xls', 'xlsx']">
      <!-- <s-form>
        <s-form-item label="协议名称">
          <s-select v-model="protocolname" multiple placeholder="选择协议" style="width: 200px;">
            <s-option v-for="(item,index) in protocolList" :key="index" :label="item.protocolName"
                      :value="item.protocolName"></s-option>
          </s-select>
        </s-form-item>
      </s-form> -->
    </import-dialog>

    <import-dialog v-model="importOrgDialog" v-if="importOrgDialog" :curAsset="curAsset" :uploadObj="DbuploadObj" :downObj="DbdownObj" :file-types="['xls', 'xlsx']"></import-dialog>
    <!--添加资产账号-->
    <select-user-dialog v-model="selectUserDialogFlag"
                        v-if="selectUserDialogFlag"
                        @select-user="selectUser"
                        :asset-uuid="assetUuid"
                        :portUuid="portUuid">
    </select-user-dialog>
    <!--已添加的资产账号-->
    <associated-assets-dialog ref="associatedAssetsDialog"
                              v-model="associatedAssetsDialogFlag"
                              v-if="associatedAssetsDialogFlag"
                              :protocoSetRow="protocoSetRow"
                              :assetName="assetName"
                              :isOma="isOma"
                              :curAsset="curAsset"
                              :permission="permission"
                              @add-asset-account="addAssetAccount"
                              @remove-Associate="removeAssociate" >
    </associated-assets-dialog>
    <export-dialog v-if="exportDialogFlag" v-model="exportDialogFlag" @exportDialogOk="exportDialogOk" @cancelDialog="cancelDialog"></export-dialog>
  </div>
</template>

<script>
  import {Download} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash'
  import ProtocolSetAddDialog from './dialog/ProtocolSetAddDialog';
  import AgreeAssociateDialog from './dialog/AgreeAssociateDialog'; // 协议关联弹窗
  // import ManageConfigMixin from '../AssetAddDialog/ManageConfigMixin';
  import importDialog from '@/components/importDialog/ImportDialog';
  import selectUserDialog from '@/pages/Assets_AssetList/AssetAddDialog/SelectUserDialogNew';
  import AssociatedAssetsDialog from '@/pages/Assets_AssetList/AssetAddDialog/AssociatedAssetsDialog';
  import exportDialog from '@/home/exportDialog';

  export default {
    // mixins: [ManageConfigMixin],
    data() {
      return {
        addDialogFlag: false,
        exportDialogFlag: false,
        importDialogFlag: false,
        importOrgDialog: false,
        agreeAssociatedDialogFlag: false,
        testDialogFlag: false,
        agreeAssociated: {},
        selections: [],
        curAccount: {},
        selectOptionsObj: {
          cmdbOrgList: [], // 所属机构
          sysUserList: [], // 维护人
          locationList: [], // 位置
          protocolList: [], // 配置弹框中的协议名称
          accountType: [] // 配置弹框中的角色名称
        },
        DbuploadObj: {
          type: 'post',
          url: '/databaseDbname/importDatabaseDbname'
        },
        DbdownObj: {
          text: '导入数据库实例管理模板',
          url: '/databaseDbname/importTemplate'
        },
        configData: {},
        configList: [],
        configListalready: [],
        uuid: this.addAssetUuid,
        assetUuid: '',
        protocolList: [],
        protocolname: [], // 协议索引，int
        selectUserDialogFlag: false,
        associatedAssetsDialogFlag: false,
        portUuid: '',
        protocoSetRow: {} // 协议设置当前行的信息
      }
    },
    props: {
      isOma: {
        type: Boolean,
        default: false
      },
      assetName: {
        type: Boolean,
        default: false
      },
      addAssetUuid: {
        type: String,
        default: ''
      },
      curAsset: {
        type: Object,
        default() {
          return {}
        }
      },
      permission: {   // 表示是否有操作按钮的权限
        type: Boolean,
        default: false
      }
    },
    computed: {
      editAssetUuid() {
        return this.$route.params.assetUuid;
      },
      selectionUuids() {
        return this.selections.map(item => {
          return item.uuid;
        });
      }
    },
    watch: {
      assetUuid(val) {
        if (!val) return null;
        this.axiosConfigList(val);
      }
    },
    created() {
      this.getOptions();
      if (this.$route.name === 'AssetsAll_assetEdit' || this.$route.name === 'AssetsAll_assetDetail') {
        this.assetUuid = this.editAssetUuid
        // this.axiosConfigList(this.editAssetUuid)
      } else {
        this.assetUuid = this.addAssetUuid
        this.axiosConfigList(this.addAssetUuid)
      }
    },
    methods: {
      // 添加资产账号
      addAccount(row) {
        this.associatedAssetsDialogFlag = true;
        this.protocoSetRow = row;
      },
      tableRowClassName(row) { // 操作按钮是否显示
        let className = '';
        if (!row.addDbname) {
          className += 'dis-data-base ';
        }
        if (!row.addAccount) {
          className += 'dis-bangding';
        }
        return className;
      },
      getOptions() {
        // 所属机构，维护人，位置，协议名称，资产状态，自定义属性下拉框，附件属性
        $axios.get('/resourcemanager/assetmanager/itasset/agreementSet').then(({data}) => {
          this.protocolList = data.protocolList;
          this.selectOptionsObj = cloneDeep(data);
        });
      },
      goDetail (row) {
        if (!row.addAccount) {
          return false
        }
        this.associatedAssetsDialogFlag = true;
        this.protocoSetRow = row;
      },
      axiosConfigList(uuid) { // 获取管理配置列表
        if (!uuid) return null
        let self = this;
        $axios.get('/assetsAccountInfo/getTAssetsPortInfoItUuid/' + uuid).then(({data}) => {
          // this.delRepeat(data);
          self.configList = data;
          self.configListalready = data.map((item, index) => {
            let obj = {};
            self.divideAccountProto(obj, item);
            obj.index = index;
            obj.id = item.id;
            return obj;
          });
        });
      },
      // 顶部操作-------------------------------------------------------
      add() {
        if (this.addAssetUuid === '') {
          this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
          return
        }
        this.configData = {}
        this.handlerAdd();
      },
      handlerAdd() {
        this.curAccount = {};
        this.addDialogFlag = true;
      },
      del() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择协议配置', type: 'info'});
          return;
        }
        let arr = [];
        this.selections.map((item) => {
          arr.push(item.uuid)
        });
        $axios.post(`/assetProtocolPort/judgeBeforeBatchDeletePort`, arr).then(({data}) => {
          this.$confirm(data.errormsg, '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'}).then(() => {
            $axios.post(`/assetProtocolPort/batchDeletePortInfo`, arr).then(({data}) => {
                  if (data.state === true) {
                    this.$message.success(data.errormsg)
                  } else {
                    this.$message.error(data.errormsg)
                  }
                });
                setTimeout(() => {
                  this.axiosConfigList(this.assetUuid);
                }, 500);
          }).catch(() => {})
        }).catch(() => {});
      },
      importDbBatch() {
        if (this.addAssetUuid === '') {
          this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
          return
        }
        this.importOrgDialog = true;
      },
      importBatch() {
        if (this.addAssetUuid === '') {
          this.$message({showClose: true, message: '请先正确填写资产信息', type: 'warning'});
          return
        }
        this.uploadObj = {
          type: 'post',
          url: '/resourcemanager/assetmanager/itasset/importProtocol'
        };
        this.downObj = {
          type: 'check',
          check() {
            return {state: true, params: []};
          },
          text: '协议导入模板',
          url: '/resourcemanager/assetmanager/itasset/protocolTempalte'
        };
        this.importDialogFlag = true;
      },
      batchExport() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '请先选择协议配置', type: 'info'});
          return;
        }
        this.exportDialogFlag = true
      },
      exportDialogOk(form) {
        let params = {}
        params.portUuidList = this.selections.map(item => item.uuid)
        $axios.post(`/assetProtocolPort/exportAssetProtocolFirst`, params).then(({data}) => {
          if (data) {
            Download(`/assetProtocolPort/exportAssetProtocolSecond/${form.password}`);
            this.exportDialogFlag = false
          }
        });
      },
      cancelDialog() {
        this.exportDialogFlag = false
      },
      // 是否显示资产账号按钮
      showCurrentBtn(row) {
        return !(row.protocolName === 'SNMPV2' || row.protocolName === 'SNMPV1' || row.protocolName === 'VNC');
      },
      // 表格相关--------------------------------------------------------------
      rowActionsDef() {
        let vm = this;
        if (this.assetName) {
          return [];
        }
        if (!this.isOma) {
          let show = !vm.judgeRoleBtn('assetsManage_dbaAdd') && !vm.judgeRoleBtn('assetsManage_editProtocol') && !vm.judgeRoleBtn('assetsManage_associatedAssetAccount') && !vm.judgeRoleBtn('assetsManage_delProtocol')
          if (show) {
            return [];
          } else {
            return [
              {
                icon: 'data-base',
                name: '添加数据库/实例',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_dbaAdd');
                },
                click: this.rowAgreeAssociation
              },
              {
                icon: 'edit',
                name: '编辑',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_editProtocol');
                },
                click: this.rowEdit
              },
              {
                icon: 'not-pass',
                name: '验证',
                click: this.notPass
              },
              {
                icon: 'bangding',
                name: '关联资产账号',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_associatedAssetAccount');
                },
                click: this.addAccount
              },
              {
                icon: 'delete',
                name: '删除',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_delProtocol');
                },
                click: this.rowDel
              }
            ];
          }
        } else {
          let show = !vm.judgeRoleBtn('assetsManage_omaDbaAdd') && !vm.judgeRoleBtn('assetsManage_omaEditProtocol') && !vm.judgeRoleBtn('assetsManage_omaAssociatedAssetAccount') && !vm.judgeRoleBtn('assetsManage_omaDelProtocol')
          if (show) {
            return [];
          } else {
            return [
              {
                icon: 'data-base',
                name: '添加数据库/实例',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_omaDbaAdd');
                },
                click: this.rowAgreeAssociation
              },
              {
                icon: 'edit',
                name: '编辑',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_omaEditProtocol');
                },
                click: this.rowEdit
              },
              {
                icon: 'not-pass',
                name: '验证',
                click: this.notPass
              },
              {
                icon: 'bangding',
                name: '关联资产账号',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_omaAssociatedAssetAccount');
                },
                click: this.addAccount
              },
              {
                icon: 'delete',
                name: '删除',
                show: (row) => {
                  return vm.judgeRoleBtn('assetsManage_omaDelProtocol');
                },
                click: this.rowDel
              }
            ];
          }
        }
      },
      notPass(row) {
        let loadingMsg = self.$message({
          type: 'info',
          duration: 200,
          showClose: true,
          message: '验证中，请稍候...'
        })
        $axios.get(`/assetProtocolPort/checkPort/${row.uuid}`).then(({data}) => {
          loadingMsg.close()
          if (data.state === true) {
            this.$message.success(data.errormsg)
          } else {
            this.$message.error(data.errormsg)
          }
        });
      },
      addAssetAccount(row) { // 打开添加资产账号弹窗
        this.selectUserDialogFlag = true;
        this.portUuid = row.uuid;
        this.assetUuid = row.assetsUuid;
      },
      removeAssociate(row) { // 打开添加资产账号弹窗
        this.axiosConfigList(row.assetsUuid);
      },
      selectUser(selectionList) {
        let param = {
            assetUuid: this.assetUuid,
          portUuid: this.portUuid,
          accountUuidList: selectionList.map(item => item.uuid),
          accountList: selectionList.map(item => item)
        };
        // 先进行校验
        $axios.post('/assetsAccountInfo/judgeSaveAccountPortRel', param).then(({data}) => {
          if (data.state) {
            this.ajaxSaveUser(param);
          } else {
            // this.$confirm(data.errormsg, '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
              this.ajaxSaveUser(param);
            // }).catch(() => {
            // });
          }
        });
      },
      // 保存资产账号
      ajaxSaveUser(param) {
        let vm = this
        let arr = param.accountList.map(item => {
          return Object.assign({}, {
            'IP地址': vm.curAsset.controlAdderss ? vm.curAsset.controlAdderss : '无',
            '资产名称': vm.curAsset.itcompName,
            '协议名称': vm.protocoSetRow.protocolName,
            '端口': vm.protocoSetRow.port,
            '账号名称': item.accountName
          })
        })
        $axios.post('/assetsAccountInfo/saveOntPortToManyAccount', param, {
          data: arr,
          logTemplate: '关联|资产(#IP地址#/#资产名称#)>资产协议(#协议名称#/#端口#)关联账号(#账号名称#)'
        }).then(({data}) => {
          this.$refs.associatedAssetsDialog.getAssociatedAssetsList(); // 更新当前关联资产账号数据
          if (data.state) {
            this.axiosConfigList(this.assetUuid);
            this.$message.success(data.errormsg);
          } else {
            this.$message.error(data.errormsg);
          }
        });
      },
      rowAgreeAssociation (row) { // 打开协议关联窗口
        this.agreeAssociated = cloneDeep(row);
        this.agreeAssociatedDialogFlag = true;
      },
      rowEdit(row) {
        this.configData = row
        this.addDialogFlag = true
      },
      nullFunc() {
        return null
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      // 行内操作--------------------------------------------------------------
      rowDel(row) {
        $axios.get(`/resourcemanager/assetmanager/itasset/judgeBeforeDeletePort/${row.uuid}`).then(({data}) => {
          this.$confirm(data.errormsg, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let vm = this
                $axios.get(`/resourcemanager/assetmanager/itasset/deleteAllAbountPort/${row.uuid}`, {
                  data: [
                    {
                      'IP地址': vm.curAsset.controlAdderss ? vm.curAsset.controlAdderss : '无',
                      '资产名称': vm.curAsset.itcompName,
                      '协议名称': row.protocolName,
                      '端口': row.port
                    }
                  ],
                  logTemplate: '删除|资产(#IP地址#/#资产名称#)>资产协议(#协议名称#/#端口#)'
                }).then(({data}) => {
                  if (data.state === true) {
                    this.$message({showClose: true, message: data.errormsg, type: 'success'});
                    this.axiosConfigList(this.assetUuid);
                  } else {
                    this.$message({showClose: true, message: data.errormsg, type: 'error'});
                  }
                })
            }).catch(() => {
          });
        })
      },
      configSave(obj, isEdit, protocolName) {
        let vm = this;
        if (!obj) return null;
        let logParam = {
          data: [
            {
              'IP地址': vm.curAsset.controlAdderss ? vm.curAsset.controlAdderss : '无',
              '资产名称': vm.curAsset.itcompName,
              '协议名称': protocolName,
              '端口': obj.port
            }
          ],
          logTemplate: isEdit ? '编辑|资产(#IP地址#/#资产名称#)>资产协议(#协议名称#/#端口#)' : '添加|资产(#IP地址#/#资产名称#)>资产协议(#协议名称#/#端口#)'
        };
        if (isEdit) {
          $axios.post(`/assetProtocolPort/onlyUpdatePortInfoByItcomp`, obj, logParam).then(({data}) => {
            if (data.state) {
              vm.$message({showClose: true, message: data.errormsg, type: 'success'});
              vm.axiosConfigList(vm.assetUuid);
            } else {
              vm.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        } else {
          $axios.post(`/assetProtocolPort/onlySaveAssetProtocolPort/${this.assetUuid}`, obj, logParam).then(({data}) => {
            if (data.state) {
              if (protocolName === 'SNMPV1' || protocolName === 'SNMPV2' || protocolName === 'VNC') {
                vm.$message({showClose: true, message: data.errormsg, type: 'success'});
                vm.axiosConfigList(vm.assetUuid);
                return
              }
              vm.axiosConfigList(vm.assetUuid);
              vm.$confirm('协议保存成功，是否继续关联资产账号？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false,
                closeOnPressEscape: false
              }).then(() => {
                vm.associatedAssetsDialogFlag = true;
                vm.protocoSetRow = data.data;
              }).catch(() => {
              });
            } else {
              vm.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          });
        }
      },
      delAction(delArr) {
        let paramArr = [];
        delArr.forEach((item) => {
          let paramString = `${item.deviceUuid},${item.uuid},${item.uuid}`;
          paramArr.push(paramString);
        });

        $axios.post(`/resourcemanager/assetmanager/itasset/batchDeleteCredenceByItcomp`, paramArr).then(({data}) => {
          if (data.status === true) {
            this.$message.success(data.err)
          } else {
            this.$message.error(data.err)
          }
        });
      },
      divideAccountProto(newObj, oldObj) {
        newObj.id = oldObj.id;
        newObj.assetsAccountInfo = oldObj.assetsAccountInfo || {};
        newObj.assetsPortInfo = oldObj.assetsPortInfo || {};
        let accountFied = ['accountName', 'accountPasswd', 'accountRoleUuid', 'accountTypeName', 'snmpCWordOr', 'snmpCWordRw'];
        for (let i in oldObj) {
          if (oldObj[i] !== '' && typeof oldObj[i] !== 'object' && i !== 'uuid') {
            if (accountFied.some(item => item === i)) {
              newObj.assetsAccountInfo[i] = oldObj[i];
            } else if (newObj.assetsPortInfo.hasOwnProperty(i)) {
              if (i === 'port') {
                newObj.assetsPortInfo[i] = oldObj[i] + '';
              } else {
                newObj.assetsPortInfo[i] = oldObj[i];
              }
            }
          }
        }
      },
      // 判断协议关联按钮是否显示
      isDatabase(value) {
        if (value === 'ORACLE' || value === 'MySQL' || value === 'SQL SERVER') {
          return true;
        }
        return false;
      },
      showDbExam(value) { // 显示数据库实例
        let arr = ['mssqlserver', 'plsql', 'toadoracle', 'DB2', 'INFORMIX', 'sybase', 'cache', 'dameng', 'kingbase', 'postgresql', 'oscar', 'greenplum'];
        return arr.filter(item => item === value).length > 0;
      }
    },
    components: {
      ProtocolSetAddDialog,
      AgreeAssociateDialog,
      importDialog,
      selectUserDialog,
      exportDialog,
      AssociatedAssetsDialog // 已关联账号
    }
  }
</script>

<style lang="stylus">
  .protocol-set {
    .tool-bar {
      margin-top: 10px;
    }

    .left-btn {
      margin-bottom: 10px;
    }

    .s-search-group {
      .s-select, .s-date-editor-datetimerange.s-input {
        width: 175px;
      }

      .s-form-item-label {
        text-align: center;
      }
    }
    /*不显示改按钮*/
    .dis-data-base .icon-data-base {
      display: none;
    }
    .dis-bangding .icon-bangding {
      display: none;
    }
    .number-link a{
      text-decoration none
    }
  }
</style>
