<!--
 * @Version: //Q4资产管理列表
 * @Description:单注册一个系统（OMA）资产管理列表
 * @Position:资产管理-》资产管理列表
 * @Date: 2019-10-16 09:54:49
 * @LastEditors: mybells
 -->
<template>
    <div class="assetList" style="height: calc(100vh - 190px);">
      <s-row :gutter="15">
        <s-col :span="4">
          <div class="listChunk">
            <s-tab v-model="activeTab">
              <s-tab-pane label="IT资产">
                <s-scrollbar wrap-style="maxHeight:calc(100vh - 225px);" key="it" ref="treeScrollbar">
                  <div ref="menuTree">
                    <s-tree id="itAssetsTree" prefixIcon="circle" :showLine='true' ref="itAssetsTree" :data="itTreeData" :props="defaultProps" @node-expand="nodeExpand" @node-click="handleNodeClick" :highlight-current="true" :default-expand-all="defaultexpandall" :default-expanded-keys="defaultExpandKeys" node-key="uuid" :current-node-key="currentLeftTreeUuid" :render-content="renderContent" :expand-on-click-node="false"></s-tree>
                  </div>
                </s-scrollbar>
              </s-tab-pane>
            </s-tab>
          </div>
        </s-col>
        <s-col :span="20">
          <s-scrollbar wrap-style="maxHeight:calc(100vh - 190px);">
            <div class="listChunk" style="min-height:550px;padding-right:10px;">
              <s-row>
                <s-form :inline="true" :model="searchForm" class="search_form" label-width="75px">
                  <div>
                    <s-form-item label="资产类型：">
                      <input-tree v-model="searchForm.citypeUuid" name="uuid" :data="searchOptions" :props="defaultProps" :hasDelIcon="true"></input-tree>
                    </s-form-item>
                    <s-form-item label="IP地址：">
                      <s-input @keyup.enter.native="listSearch" v-model.trim="searchForm.assetIp"></s-input>
                    </s-form-item>
                    <s-form-item label="资产名称：">
                      <s-input @keyup.enter.native="listSearch" v-model.trim="searchForm.assetName"></s-input>
                    </s-form-item>
                    <s-form-item label="厂商：">
                    <s-select v-model="searchForm.manufact" clearable filterable style="width:165px;">
                      <s-option v-for="i in manufactOptions" :key="i.uuid" :value="i.uuid" :label="i.caption"></s-option>
                    </s-select>
                    </s-form-item>
                    <s-form-item label="型号：">
                      <s-select v-model="searchForm.product" clearable filterable style="width:165px;">
                        <s-option v-for="i in productOptions" :key="i.uuid" :value="i.uuid" :label="i.caption"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="使用部门：">
                      <input-tree v-model="searchForm.cmdbOrgUuid" name="uuid" :data="cmdbOrgOptions" :props="defaultProps" :hasDelIcon="true"></input-tree>
                    </s-form-item>
                    <s-form-item label="账号名称：">
                      <s-input @keyup.enter.native="listSearch" v-model.trim="searchForm.accountName"></s-input>
                    </s-form-item>
                    <s-form-item label="协议名称：">
                      <s-select v-model="searchForm.protocolName" filterable multiple  collapse-tags clearable>
                        <s-option v-for="(item, index) in protocolOption" :key="index" :label="item" :value="item"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="端口：">
                      <s-select v-model="searchForm.port" multiple filterable collapse-tags clearable>
                        <s-option v-for="(item, index) in portOption" :key="index" :label="item" :value="item"></s-option>
                      </s-select>
                    </s-form-item>
                  </div>
                  <div class="search_btn">
                    <s-button icon="magnifier" @click="listSearch">查询</s-button>
                  </div>
                </s-form>
              </s-row>
              <s-row class="searchBtChunk" style="margin-top:15px;">
                <s-col class="left">
                  <s-button icon="self-test" @click="newScanDialogFlag = true" v-noBtn="'assetsManage_omaNewScan'">新扫描</s-button>
                  <s-button icon="plus" @click="addAsset" v-noBtn="'assetsManage_omaAddAsset'">添加</s-button>
                  <s-dropdown v-noBtn="'assetsManage_omaBatchOperation'">
                    <s-button icon="backup">
                      批量操作<i class="iconfont icon-bottom"></i>
                    </s-button>
                    <s-dropdown-menu slot="list">
                      <s-dropdown-item v-noBtn="'assetsManage_omaBatchEditAsset'" @click.native="batchEdit">
                        <i class="iconfont icon-edit" title="批量编辑"></i>
                        <span>批量编辑</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaBatchDelAsset'" @click.native="delBatch">
                        <i class="iconfont icon-delete" title="批量删除"></i>
                        <span>批量删除</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaImportAsset'" @click.native="importBatch">
                        <i class="iconfont icon-import" title="资产导入"></i>
                        <span>资产导入</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaExportAsset'" @click.native="exportBatch">
                        <i class="iconfont icon-export" title="资产导出"></i>
                        <span>资产导出</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaBOImportProtocol'" @click.native="protocolImportBatch">
                        <i class="iconfont icon-import" title="协议导入"></i>
                        <span>协议导入</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaBOExportProtocol'" @click.native="protocolExportBatch">
                        <i class="iconfont icon-export" title="协议导出"></i>
                        <span>协议导出</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaBOImportAssetAccount'" @click.native="accountImportBatch">
                        <i class="iconfont icon-import" title="账号导入"></i>
                        <span>账号导入</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaBOExportAssetAccount'" @click.native="accountExportBatch">
                        <i class="iconfont icon-export" title="账号导出"></i>
                        <span>账号导出</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaAssetAccountpwExport'" @click.native="AccountExport">
                        <i class="iconfont icon-export" title="账号密码导出"></i>
                        <span>账号密码导出</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaKeyFileImport'" @click.native="passKeyImport">
                        <i class="iconfont icon-import" title="密钥文件导入"></i>
                        <span>密钥文件导入</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaKeyFileExport'" @click.native="passKeyExport">
                        <i class="iconfont icon-export" title="密钥文件导出"></i>
                        <span>密钥文件导出</span>
                      </s-dropdown-item>
                    </s-dropdown-menu>
                  </s-dropdown>
                  <s-button icon="change-psw" @click="authorise" v-noBtn="'assetsManage_omaRapidAuthorization'">快速授权</s-button>
                  <s-dropdown v-noBtn="'assetsManage_omaExportAllData'">
                    <s-button icon="download">
                      全部导出<i class="iconfont icon-bottom"></i>
                    </s-button>
                    <s-dropdown-menu slot="list">
                      <s-dropdown-item v-noBtn="'assetsManage_omaExportAllAsset'" @click.native="exportDialogFlagAll=true">
                        <i class="iconfont icon-export" title="导出所有资产"></i>
                        <span>导出所有资产</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaExportAllProtocol'" @click.native="exportProtpcolDialogFlagAll=true">
                        <i class="iconfont icon-export" title="导出所有协议"></i>
                        <span>导出所有协议</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaExportAllAccount'" @click.native="exportAccountDialogFlagAll=true">
                        <i class="iconfont icon-export" title="导出所有账号"></i>
                        <span>导出所有账号</span>
                      </s-dropdown-item>
                      <s-dropdown-item v-noBtn="'assetsManage_omaExportAllAccountPw'" @click.native="exportAssetAccountDialogFlagAll=true">
                        <i class="iconfont icon-export" title="导出所有资产账号密码"></i>
                        <span>导出所有资产账号密码</span>
                      </s-dropdown-item>
                    </s-dropdown-menu>
                  </s-dropdown>
                  <!-- <s-button icon="delete" @click="delBatch" v-noBtn="'assetsManage_omaBatchDelAsset'">批量删除</s-button>
                  <s-button icon="edit" @click="batchEdit" v-noBtn="'assetsManage_omaBatchEditAsset'">批量编辑</s-button>
                  <s-button icon="import" @click="importBatch" v-noBtn="'assetsManage_omaImportAsset'">批量导入</s-button>
                  <s-button icon="export" @click="exportBatch" v-noBtn="'assetsManage_omaExportAsset'">批量导出</s-button>
                  <s-button icon="export" @click="AccountExport" v-noBtn="'assetsManage_omaAssetAccountpwExport'">资产账号密码导出</s-button>
                  <s-button icon="export" @click="passKeyImport" v-noBtn="'assetsManage_omaKeyFileImport'">密钥文件导入</s-button>
                  <s-button icon="export" @click="passKeyExport" v-noBtn="'assetsManage_omaKeyFileExport'">密钥文件导出</s-button> -->
                </s-col>
                <s-col class="right" >
                  <!-- 动态列设置 -->
                  <dynamic-column-set class="s-upload showColumnSet" ref="showColumnSet"  @show="showColumnSet" v-if="isSystemAdmin&&judgeRoleBtn('assetsManage_omaDynamicColumnSet')" @hide="hide" :dynamicData="dynamicData.assetDynList" :option="option" @save="saveform" style="display:inline-block">
                    <s-button icon="set" title="设置" slot="click"></s-button>
                    <s-form ref="drawerForm" label-width="280px" slot="otherSetting">
                      <s-form-item label="默认排序列" prop="orderName" label-width="100px">
                        <s-select v-model="dynamicData.orderName" placeholder="请选择">
                          <s-option label="资产名称" value="assetName"></s-option>
                          <s-option label="IP地址" value="ip"></s-option>
                        </s-select>
                      </s-form-item>
                      <s-form-item label="排序方式" prop="orderType" label-width="100px">
                        <s-select v-model="dynamicData.orderType" placeholder="请选择">
                          <s-option label="升序" :value="1"></s-option>
                          <s-option label="降序" :value="0"></s-option>
                        </s-select>
                      </s-form-item>
                      <div class="popper_setting_header">
                        <div>
                          <i class="iconfont icon-set iconposition"></i>
                          <span class="fontcolor85" style="font-weight:bold;">操作列设置</span>
                        </div>
                      </div>
                      <s-form-item label="展开所有操作按钮" prop="showBtn" label-width="150px">
                        <s-switch v-model="dynamicData.operationCol" :active-value="1" :inactive-value="0"></s-switch>
                      </s-form-item>
                    </s-form>
                  </dynamic-column-set>
                </s-col>
              </s-row>
              <RealPageTable :useVirtual="true" :height="600" id="realpagetable_2" v-if="showTable" :fit="false" ref="assetListTable" style="width:100%;" :ajax-obj="ajaxObj" @selection-change="selectionChange" :callback="handleData">
                <s-table-column type="selection" width="45" align="center"></s-table-column>
                <s-table-column :fixed="fixed(obj.name)" :label="obj.name" :prop="obj.value" v-for="(obj,index) in listHead" :key="index" show-overflow-tooltip :min-width="120">
                  <template slot-scope="scope">
                    <span v-text="scope.row[obj.value]" v-if="obj.name==='资产名称'"></span>
                    <span v-text="scope.row[obj.value]" v-else></span>
                  </template>
                </s-table-column>
                <!-- <s-table-column label="操作" width="250" align="center">
                  <template slot-scope="scope">
                    <i class="iconfont icon-line" v-noBtn="'assetsManage_omaViewRelation'" @click="viewRelationalGraph(scope.row)" title="查看关系图"></i>
                    <i class="iconfont icon-asset-add" @click="rowAccount(scope.row)" v-noBtn="'assetsManage_omaAccountManage'" title="账号管理"></i>
                    <i class="iconfont icon-protocol-add" @click="rowProtocol(scope.row)" v-noBtn="'assetsManage_omaAssetListAgreementSet'" title="协议设置"></i>
                    <i class="iconfont icon-seal" @click="rowProtocolAudit(scope.row)" v-noBtn="'assetsManage_omaAssetAccountCollect'"  title="资产账号稽核"></i>
                    <i class="iconfont icon-edit" @click="rowAssetEdit(scope.row)" v-noBtn="'assetsManage_omaEditAsset'" v-if="isConfigAdminCheck(scope.row.monitorItcomp)" title="编辑"></i>
                    <i class="iconfont icon-info" @click="rowEditOther(scope.row)" v-noBtn="'assetsManage_omaEditOther'" v-if="isConfigAdminCheck(scope.row.monitorItcomp)" title="编辑其他属性"></i>
                    <i class="iconfont icon-qr-code" @click="rowQrCord(scope.row)" v-noBtn="'assetsManage_omaQrCode'" title="查看二维码"></i>
                    <i class="iconfont icon-delete" @click="rowDel(scope.row)" v-noBtn="'assetsManage_omaDelAsset'" title="删除"></i>
                  </template>
                </s-table-column> -->
                <s-table-column label="操作" :width="operationWidth" align="center" fixed="right">
                  <template slot-scope="scope">
                    <button-set :scope="scope" :btnData="btnDataOma()" :option="tableOption"></button-set>
                  </template>
                </s-table-column>
              </RealPageTable>
            </div>
          </s-scrollbar>
        </s-col>
      </s-row>

      <!--协议批量导入-->
      <importAPDialog v-if="protocolImportDialogFlag" v-model="protocolImportDialogFlag" :save-log="true" :upload-obj="protocolUploadObj" :down-obj="protocolDownObj" :file-types="['xls', 'xlsx']">
      </importAPDialog>
      <!-- 账号批量导入 -->
      <importAPDialog v-model="accountImportDialog" v-if="accountImportDialog" :uploadObj="accountUploadObj" :downObj="accountDownObj" :fileTypes='accountFileType'></importAPDialog>
      <!--导入-->
      <import-dialog v-if="importDialogFlag" v-model="importDialogFlag" :asset-type-options="addOptions" @reload="reload(true)"></import-dialog>
      <!--资产账号稽核-->
      <asset-check-dialog v-model="checkDialogFlag" v-if="checkDialogFlag" :asset-list="auditAssets" @complete="checkComplete"></asset-check-dialog>
      <!--资产账号稽核结果-->
      <asset-check-result-dialog v-model="checkResultDialogFlag" v-if="checkResultDialogFlag" :result="checkResult"></asset-check-result-dialog>
      <!--快速授权-->
      <speed-authorise-dialog v-if="authoriseDialogFlag" v-model="authoriseDialogFlag" :authorise-assets="authoriseAssets" @closeDialog="reload"></speed-authorise-dialog>
      <!--修改管理配置-->
      <manage-config-dialog v-model="manageDialogFlag" v-if="manageDialogFlag" @reload="reload" :cur-asset="curAsset"></manage-config-dialog>

      <!--二维码-->
      <qr-cord-dialog v-model="qrCordDialogFlag" v-if="qrCordDialogFlag" :cur-asset="curAsset"></qr-cord-dialog>

      <!--新扫描-->
      <new-scan-dialog v-if="newScanDialogFlag" v-model="newScanDialogFlag" @reload="reload(true)"></new-scan-dialog>

      <!--批量编辑资-->
      <s-dialog v-if="batchEditDialog" v-model="batchEditDialog" title="批量编辑" width="500px">
        <assets-batch-edit :batchEditAssets="selections" :ciTypeTreeData="searchOptions" :batchEditSelect="selections" @closeDialog="closeBatchEditDialog">
        </assets-batch-edit>
      </s-dialog>
      <!--资产导出-->
      <export-dialog v-if="exportDialogFlag" v-model="exportDialogFlag" @exportDialogOk="exportDialogOk" @cancelDialog="cancelDialog"></export-dialog>
      <!--协议导出-->
      <export-dialog v-if="exportProtpcolDialogFlag" v-model="exportProtpcolDialogFlag" @exportDialogOk="exportDialogOk"  @cancelDialog="cancelDialog"></export-dialog>
      <!--账号导出-->
      <export-dialog v-if="exportAccountDialogFlag" v-model="exportAccountDialogFlag" @exportDialogOk="exportDialogOk" @cancelDialog="cancelDialog"></export-dialog>
      <!--全部资产导出-->
      <export-dialog v-if="exportDialogFlagAll" v-model="exportDialogFlagAll" @exportDialogOk="exportAssets" @cancelDialog="exportDialogFlagAll=false"></export-dialog>
      <!--全部协议导出-->
      <export-dialog v-if="exportProtpcolDialogFlagAll" v-model="exportProtpcolDialogFlagAll" @exportDialogOk="exportProtocol"  @cancelDialog="exportProtpcolDialogFlagAll=false"></export-dialog>
      <!--全部账号导出-->
      <export-dialog v-if="exportAccountDialogFlagAll" v-model="exportAccountDialogFlagAll" @exportDialogOk="exportAccount" @cancelDialog="exportAccountDialogFlagAll=false"></export-dialog>
      <!--全部资产账号密码导出-->
      <export-dialog v-if="exportAssetAccountDialogFlagAll" v-model="exportAssetAccountDialogFlagAll" @exportDialogOk="exportAssetAccount" @cancelDialog="exportAssetAccountDialogFlagAll=false"></export-dialog>
      <!-- 密钥文件导入弹框 -->
      <account-passkey-import-dialog v-if="accountPasskeyImportDialogFlag" v-model="accountPasskeyImportDialogFlag" ></account-passkey-import-dialog>
      <!-- 密钥文件导出弹框 -->
      <account-passkey-export-dialog v-if="accountPasskeyExportDialogFlag" v-model="accountPasskeyExportDialogFlag" @exportAccountPassKeyOk="exportAccountPassKeyOk"></account-passkey-export-dialog>

      <!--添加资产弹框-->
      <s-dialog
        v-model="addDialogFlag"
        v-if="addDialogFlag"
        width="500px"
        title="添加">
        <asset-add-dialog-one-project v-if="addDialogFlag" ref="addDialog" formType="add" @addPost="addPost"></asset-add-dialog-one-project>
        <template slot="footer" class="dialog-footer">
          <s-button @click="submitAddForm" :disabled="addDialogBtnFlag">确定</s-button>
          <s-button type="cancel" @click="addDialogFlag = false">关闭</s-button>
        </template>
      </s-dialog>
      <!--编辑资产弹框-->
      <s-dialog
        v-model="editDialogFlag"
        v-if="editDialogFlag"
        width="500px"
        title="编辑">
        <asset-add-dialog-one-project ref="editDialog" v-if="editDialogFlag" formType="edit" :assetUuidProp="editAssetuuid" @editPost="editPost"></asset-add-dialog-one-project>
        <template slot="footer" class="dialog-footer">
          <s-button @click="submitEditForm" :disabled="editDialogBtnFlag">确定</s-button>
          <s-button type="cancel" @click="editDialogFlag = false">关闭</s-button>
        </template>
      </s-dialog>
      <!--账号管理-->
      <s-dialog v-model="accountDialogFlag" v-if="accountDialogFlag" title="账号管理" width="900px">
        <asset-account :addAssetUuid="assetUuid" :isOma="isOma" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset || {})"></asset-account>
      </s-dialog>
      <!--协议设置-->
      <s-dialog v-model="protocolDialogFlag" v-if="protocolDialogFlag" title="协议设置" width="900px">
        <protocol-set :addAssetUuid="assetUuid" :isOma="isOma" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset || {})"></protocol-set>
      </s-dialog>
      <!--编辑其他属性-->
      <s-dialog v-model="editOtherFlag" v-if="editOtherFlag" title="编辑其他属性" width="900px">
        <edit-other-dialog :isOma="isOma" :curAsset="curAsset"></edit-other-dialog>
      </s-dialog>
      <!-- 查看关联人员 -->
      <check-relation-dialog v-if="checkRelationDialog" :assetUuid="assetUuid" :checkRelationDialog.sync="checkRelationDialog"></check-relation-dialog>
    </div>
</template>

<script>
  import assetListMixin from './mixins/assetListMixin'
  import * as assetListAjax from './api/assetList_api'
  import assetsBatchEdit from './AssetOtherDialog/AssetsBatchEdit';
  import newScanDialog from '@/pages/AssetsMonitor_List/MonitorDialog/NewScanDialog';
  import AssetAddDialogOneProject from '@/pages/Assets_AssetList/AssetAddDialog/AssetAddDialogOneProject'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';
  import $axios from 'sunflower-ajax';
  import buttonSet from '@/components/tableHandleHidden/buttonSet';
  import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    mixins: [assetListMixin, roleCheckMixin],
    data() {
      return {
        isOma: false,
        newScanDialogFlag: false,
        assetListAjax: assetListAjax,
        addDialogFlag: false,
        editDialogFlag: false,
        addDialogBtnFlag: true,
        editDialogBtnFlag: true,
        editAssetuuid: '',
        tableOption: {// 操作栏配置项
          isHidden: false, // 是否开启隐藏
          appendId: '#realpagetable_2',
          showNum: 3// 超过3ge隐藏
        },
        option: {
          title: '列显示设置',
          key: 'uuid', // key
          nameKey: 'headName', // 名字key
          showKey: 'isShow', // 是否显示key
          sortKey: 'headIndex', // 排序key
          width: '300',
          height: '500'
        }
      }
    },
    created () {
      // 判断是否是单注册OMA
      if (this.$store.state.userData.registerModelList.length === 1 && this.$store.state.userData.registerModelList[0] === 'OMA') {
        this.isOma = true
      }
    },
    methods: {
      // 操作栏按钮
      btnDataOma() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看资产详情',
            v_noBtn: 'assetsManage_omaViewAsset',
            handler: function (row, scope) {
              vm.gotoAssetDetail(row)
            }
          },
          {
            icon: 'edit',
            name: '编辑',
            v_noBtn: 'assetsManage_omaEditAsset',
            handler: function (row, scope) {
              vm.rowAssetEdit(row);
            },
            v_if: function (row, scope) {
              return vm.isConfigAdminCheck(scope.row)
            }
          },
          {
            icon: 'delete',
            name: '删除',
            v_noBtn: 'assetsManage_omaDelAsset',
            handler: function (row, scope) {
              let newData = [];
              newData.push(scope.row);
              vm.axiosDelAssets([scope.row.uuid], newData);
            }
          },
          {
            icon: 'asset-add',
            name: '资产账号管理',
            v_noBtn: 'assetsManage_omaAccountManage',
            handler: function (row, scope) {
              vm.assetUuid = scope.row.uuid;
              vm.curAsset = scope.row;
              vm.accountDialogFlag = true
            }
          },
          {
            icon: 'protocol-addi',
            name: '协议设置',
            v_noBtn: 'assetsManage_omaAssetListAgreementSet',
            handler: function (row, scope) {
              vm.assetUuid = scope.row.uuid;
              vm.curAsset = scope.row;
              vm.protocolDialogFlag = true
            }
          },
          {
            icon: 'order',
            name: '查看关联人员',
            v_noBtn: 'assetsManage_omaViewAssociatedUser',
            handler: function (row, scope) {
              vm.assetUuid = row.uuid;
              vm.checkRelationDialog = true
            }
          },
          {
            icon: 'seal',
            name: '资产账号稽核',
            v_noBtn: 'assetsManage_omaAssetAccountCollect',
            handler: function (row, scope) {
              vm.auditAssets = [scope.row];
              vm.checkDialogFlag = true;
            }
          },
          {
            icon: 'line',
            name: '关联关系管理',
            v_noBtn: 'assetsManage_omaViewRelation',
            handler: function (row, scope) {
              vm.$router.push(`/AssetsAll/assets_list/relationalGraph/${scope.row.uuid}`)
            }
          },
          {
            icon: 'info',
            name: '编辑其他属性',
            v_noBtn: 'assetsManage_omaEditOther',
            handler: function (row, scope) {
              vm.curAsset = row;
              vm.editOtherFlag = true
            },
            v_if: function (row, scope) {
              return vm.isConfigAdminCheck(scope.row)
            }
          },
          {
            icon: 'qr-code',
            name: '查看二维码',
            v_noBtn: 'assetsManage_omaQrCode',
            handler: function (row, scope) {
              vm.curAsset = scope.row;
              vm.qrCordDialogFlag = true;
            }
          }
        ]
      },
      // 添加资产\
      addAsset() {
        this.addDialogFlag = true;
        this.addDialogBtnFlag = false;
      },
      rowAssetEdit(row) {
        this.editAssetuuid = row.uuid;
        this.editDialogFlag = true;
        this.editDialogBtnFlag = false;
      },
      // 添加对话框确认按钮
      submitAddForm() {
        this.$refs.addDialog.saveAsset();
      },
      addPost(saveData) {
        let option = {
          data: [{name: saveData.monitorItcomp.controlAdderss ? (saveData.monitorItcomp.controlAdderss + '/' + saveData.monitorItcomp.itcompName) : saveData.monitorItcomp.itcompName}],
          logTemplate: '添加|资产(#name#)'
        };
        $axios.post('/resourcemanager/assetmanager/itasset/save', saveData, option).then(({data}) => {
          if (typeof data === 'string') {
            if (data.indexOf('success') !== -1) {
              this.$message.success('保存成功！')
              this.reload(true);
              this.addDialogFlag = false;
              this.addDialogBtnFlag = true;
            } else {
              if (data.indexOf('failcount') !== -1) {
                this.$message.error('资产点数达到上限，添加失败！')
              } else if (data.indexOf('fail') !== -1) {
                this.$message.error('资产IP已存在，请勿重复添加！')
              }
              this.addDialogBtnFlag = true;
            }
          } else {
            this.$message.error('保存失败，请重试！')
            this.addDialogBtnFlag = true;
          }
        })
      },
      submitEditForm() {
        this.$refs.editDialog.saveAsset();
      },
      editPost(saveData) {
        // 编辑保存时，上传资产uuid
        saveData.monitorItcomp.uuid = this.editAssetuuid;
        // "组织部门"为空时，上传值改为null
        if (!saveData.monitorItcomp.cmdbOrguuid) saveData.monitorItcomp.cmdbOrguuid = null;
        /**
         * 编辑时，比较当前"资产IP"值和上次入库的值是否一致
         * 有更改：monitorUpdate = 0
         * 没改动：monitorUpdate = 1
         */
        saveData.monitorItcomp.monitorUpdate = saveData.monitorItcomp.controlAdderss === this.$refs.editDialog.originData.controlAdderss ? 1 : 0;
        let option = {
          data: [{name: saveData.monitorItcomp.controlAdderss ? (saveData.monitorItcomp.controlAdderss + '/' + saveData.monitorItcomp.itcompName) : saveData.monitorItcomp.itcompName}],
          logTemplate: '编辑|资产(#name#)'
        };
        $axios.post('/resourcemanager/assetmanager/itasset/update', saveData, option).then(({data}) => {
          if (typeof data === 'string' && data.indexOf('success') !== -1) {
            this.$message.success('编辑成功！')
            this.editAssetuuid = '';
            this.editDialogFlag = false;
            this.editDialogBtnFlag = true;
            // 自动巡检接口（传与初始值不同的key-value对象）
            this.$refs.editDialog.autoPolling(saveData);
            this.reload()
          } else {
            this.$message.error(data)
            this.editDialogBtnFlag = true;
          }
        })
      }
    },
    components: {
      newScanDialog,
      assetsBatchEdit,
      AssetAddDialogOneProject,
      buttonSet,
      dynamicColumnSet,
      RealPageTable
    }
  }
</script>

<style lang="stylus">
  .assetList {
    .listChunk {
      .s-loading-mask {
        z-index: 2000;
      }

      .s-table span.ip {
        cursor: pointer;
      }
      .showColumnSet .s-button-default .iconfont{
        margin-right:0;
      }
    }

    #addTypeCascader {
      visibility: hidden;
      position: absolute;
      left: 80px;
      top: 2px;
    }
  }
</style>
