<!--
 * @Author: 高建鹏
 * @Version: //Q4资产管理列表
 * @Description:资产管理列表页面
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
                  <s-tree id="itAssetsTree" prefixIcon="circle" :showLine="true" ref="itAssetsTree" :data="itTreeData" :props="defaultProps" @node-expand="nodeExpand" @node-click="handleNodeClick" :highlight-current="true" :default-expand-all="defaultexpandall" :default-expanded-keys="defaultExpandKeys" node-key="uuid" :current-node-key="currentLeftTreeUuid" :render-content="renderContent" :expand-on-click-node="false"></s-tree>
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
                    <s-select v-model="searchForm.manufact" clearable filterable>
                      <s-option v-for="i in manufactOptions" :key="i.uuid" :value="i.uuid" :label="i.caption"></s-option>
                    </s-select>
                  </s-form-item>
                  <s-form-item label="型号：">
                    <s-select v-model="searchForm.product" clearable filterable>
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
              <s-cascader id="addTypeCascader" :options="addOptions" v-model="addType" @change="add(addType)">
              </s-cascader>
              <s-col class="left">
                <s-button icon="self-test" @click="newScanDialogFlag = true" v-noBtn="'assetsManage_newScan'">新扫描</s-button>
                <s-button icon="plus" @click="showCascader" v-noBtn="'assetsManage_addAsset'">添加</s-button>
                <s-dropdown v-noBtn="'assetsManage_batchOperation'">
                  <s-button icon="backup">
                    批量操作<i class="iconfont icon-bottom"></i>
                  </s-button>
                  <s-dropdown-menu slot="list">
                    <s-dropdown-item v-noBtn="'assetsManage_batchEditAsset'" @click.native="batchEdit">
                      <i class="iconfont icon-edit" title="批量编辑"></i>
                      <span>批量编辑</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_batchDelAsset'" @click.native="delBatch">
                      <i class="iconfont icon-delete" title="批量删除"></i>
                      <span>批量删除</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_importAsset'" @click.native="importBatch">
                      <i class="iconfont icon-import" title="资产导入"></i>
                      <span>资产导入</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_exportAsset'" @click.native="exportBatch">
                      <i class="iconfont icon-export" title="资产导出"></i>
                      <span>资产导出</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_bOImportProtocol'" @click.native="protocolImportBatch">
                      <i class="iconfont icon-import" title="协议导入"></i>
                      <span>协议导入</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_bOExportProtocol'" @click.native="protocolExportBatch">
                      <i class="iconfont icon-export" title="协议导出"></i>
                      <span>协议导出</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_bOImportAccount'" @click.native="accountImportBatch">
                      <i class="iconfont icon-import" title="账号导入"></i>
                      <span>账号导入</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_bOExportAccount'" @click.native="accountExportBatch">
                      <i class="iconfont icon-export" title="账号导出"></i>
                      <span>账号导出</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_assetAccountpwExport'" @click.native="AccountExport">
                      <i class="iconfont icon-export" title="账号密码导出"></i>
                      <span>账号密码导出</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_keyFileImport'" @click.native="passKeyImport">
                      <i class="iconfont icon-import" title="密钥文件导入"></i>
                      <span>密钥文件导入</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_keyFileExport'" @click.native="passKeyExport">
                      <i class="iconfont icon-export" title="密钥文件导出"></i>
                      <span>密钥文件导出</span>
                    </s-dropdown-item>
                  </s-dropdown-menu>
                </s-dropdown>
                <s-button icon="change-psw" @click="authorise" v-noBtn="'assetsManage_rapidAuthorization'">快速授权</s-button>
                <s-button icon="start" @click="openBatchAudit" v-noBtn="'assetsManage_logAudit'">批量开启日志审计</s-button>
                <s-button icon="config-safe" @click="setConfigBase" v-noBtn="'assetsManage_confStandard'">置为配置基准</s-button>
                <s-dropdown v-noBtn="'assetsManage_exportAllData'">
                  <s-button icon="download">
                    全部导出<i class="iconfont icon-bottom"></i>
                  </s-button>
                  <s-dropdown-menu slot="list">
                    <s-dropdown-item v-noBtn="'assetsManage_exportAllAsset'" @click.native="exportDialogFlagAll=true">
                      <i class="iconfont icon-export" title="导出所有资产"></i>
                      <span>导出所有资产</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_exportAllProtocol'" @click.native="exportProtpcolDialogFlagAll=true">
                      <i class="iconfont icon-export" title="导出所有协议"></i>
                      <span>导出所有协议</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_exportAllAccount'" @click.native="exportAccountDialogFlagAll=true">
                      <i class="iconfont icon-export" title="导出所有账号"></i>
                      <span>导出所有账号</span>
                    </s-dropdown-item>
                    <s-dropdown-item v-noBtn="'assetsManage_exportAllAccountPw'" @click.native="exportAssetAccountDialogFlagAll=true">
                      <i class="iconfont icon-export" title="导出所有资产账号密码"></i>
                      <span>导出所有资产账号密码</span>
                    </s-dropdown-item>
                  </s-dropdown-menu>
                </s-dropdown>
              </s-col>
              <s-col class="right">
                <!-- 动态列设置 -->
                <dynamic-column-set class="s-upload showColumnSet" ref="showColumnSet"  @show="showColumnSet" v-if="isSystemAdmin&&judgeRoleBtn('assetsManage_exportAssetAccount')" :dynamicData="dynamicData.assetDynList" :option="option" @hide="hide" @save="saveform" style="display:inline-block">
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
            <RealPageTable :useVirtual="true" :height="600" id="realpagetable_1" v-if="showTable" :fit="false" ref="assetListTable" style="width:100%;" :ajax-obj="ajaxObj" @selection-change="selectionChange" :callback="handleData">
              <s-table-column type="selection" width="55" align="center"></s-table-column>
              <template v-for="(obj,index) in listHead">
                <s-table-column v-if="obj.name!=='日志审计'" :fixed="fixed(obj.name)" :label="obj.name" :prop="obj.value" :key="index" show-overflow-tooltip :min-width="120">
                  <template slot-scope="scope">
                    <span v-text="scope.row[obj.value]" v-if="obj.name==='资产名称'"></span>
                    <span v-text="scope.row[obj.value]" class="ip" @click="gotoItemInfo(scope.row)" v-else-if="obj.name==='IP地址' && isImp"></span>
                    <span v-text="scope.row[obj.value]" v-else-if="obj.name==='IP地址'"></span>
                    <span v-text="scope.row[obj.value]" v-else-if="obj.name!=='日志审计'"></span>
                  </template>
                </s-table-column>
              </template>
              <s-table-column v-if="SiemAuth && isSystemAdmin" label="日志审计" :width="80" fixed="right">
                <template slot-scope="scope">
                  <s-switch :key="scope.row.uuid" v-model="scope.row['isAudit']" size="small" :active-value="1" :inactive-value="0" @change="monitor(scope.row)"></s-switch>
                </template>
              </s-table-column>
              <s-table-column label="操作" :width="operationWidth" align="left" fixed="right">
                <template slot-scope="scope">
                  <button-set :scope="scope" :btnData="btnData()" :option="tableOption"></button-set>
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

    <!--批量编辑资产-->
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
    <account-passkey-import-dialog v-if="accountPasskeyImportDialogFlag" v-model="accountPasskeyImportDialogFlag"></account-passkey-import-dialog>
    <!-- 密钥文件导出弹框 -->
    <account-passkey-export-dialog v-if="accountPasskeyExportDialogFlag" v-model="accountPasskeyExportDialogFlag" @exportAccountPassKeyOk="exportAccountPassKeyOk"></account-passkey-export-dialog>
    <!--账号管理-->
    <s-dialog v-model="accountDialogFlag" v-if="accountDialogFlag" title="账号管理" width="900px">
      <asset-account :addAssetUuid="assetUuid" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset || {})"></asset-account>
    </s-dialog>
    <!--协议设置-->
    <s-dialog v-model="protocolDialogFlag" v-if="protocolDialogFlag" title="协议设置" width="900px">
      <protocol-set :addAssetUuid="assetUuid" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset || {})"></protocol-set>
    </s-dialog>
    <!--编辑其他属性-->
    <s-dialog v-model="editOtherFlag" v-if="editOtherFlag" title="编辑其他属性" width="900px">
      <edit-other-dialog :curAsset="curAsset"></edit-other-dialog>
    </s-dialog>
     <!-- 查看关联人员 -->
    <check-relation-dialog v-if="checkRelationDialog" :assetUuid="assetUuid" :checkRelationDialog.sync="checkRelationDialog"></check-relation-dialog>
  </div>
</template>

<script>
import assetListMixin from './mixins/assetListMixin'
import * as assetListAjax from './api/assetList_api'
import newScanDialog from '@/pages/AssetsMonitor_List/MonitorDialog/NewScanDialog';
import assetsBatchEdit from './AssetOtherDialog/AssetsBatchEdit';
import roleCheckMixin from '@/common/mixins/roleCheckMixin';
import buttonSet from '@/components/tableHandleHidden/buttonSet';
import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

export default {
  mixins: [assetListMixin, roleCheckMixin],
  data() {
    return {
      isSecurityUser: '',
      newScanDialogFlag: false,
      assetListAjax: assetListAjax,
      tableOption: {// 操作栏配置项
        isHidden: true, // 是否开启隐藏
        appendId: '#realpagetable_1',
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
  methods: {
    // 操作栏按钮
    btnData() {
      let vm = this;
      return [
        {
          icon: 'eye',
          name: '查看资产详情',
          v_noBtn: 'assetsManage_viewAsset',
          handler: function (row, scope) {
            vm.gotoAssetDetail(row)
          }
        },
        {
          icon: 'edit',
          name: '编辑',
          handler: function (row, scope) {
            vm.curUuid = scope.row.uuid;
            vm.$router.push(`assets_list/assetEdit/${vm.curUuid}/0`);
          },
          v_if: function (row, scope) {
            return vm.isConfigAdminCheck(scope.row) || vm.judgeRoleBtn('assetsManage_editAsset')
          }
        },
        {
          icon: 'delete',
          name: '删除',
          v_noBtn: 'assetsManage_delAsset',
          handler: function (row, scope) {
            let newData = [];
            newData.push(scope.row);
            vm.axiosDelAssets([scope.row.uuid], newData);
          }
        },
        {
          icon: 'asset-add',
          name: '资产账号管理',
          v_noBtn: 'assetsManage_accountManage',
          handler: function (row, scope) {
            vm.assetUuid = scope.row.uuid;
            vm.curAsset = scope.row;
            vm.accountDialogFlag = true
          }
        },
        {
          icon: 'protocol-addi',
          name: '协议设置',
          v_noBtn: 'assetsManage_assetListAgreementSet',
          handler: function (row, scope) {
            vm.assetUuid = scope.row.uuid;
            vm.curAsset = scope.row;
            vm.protocolDialogFlag = true
          }
        },
        {
          icon: 'order',
          name: '查看关联人员',
          v_noBtn: 'assetsManage_viewAssociatedUser',
          handler: function (row, scope) {
            vm.assetUuid = row.uuid;
            // vm.$message.warning('此功能正在开发中...')
            vm.checkRelationDialog = true
          }
        },
        {
          icon: 'seal',
          name: '资产账号稽核',
          v_noBtn: 'assetsManage_assetAccountCollect',
          handler: function (row, scope) {
            vm.auditAssets = [scope.row];
            vm.checkDialogFlag = true;
          }
        },
        {
          icon: 'line',
          name: '关联关系管理',
          v_noBtn: 'assetsManage_viewRelation',
          handler: function (row, scope) {
            vm.$router.push(`/AssetsAll/assets_list/relationalGraph/${scope.row.uuid}`)
          }
        },
        {
          icon: 'info',
          name: '查看配置基准',
          v_noBtn: 'assetsManage_viewConfStandard',
          handler: function (row, scope) {
            vm.$router.push(`/AssetsAll/assets_list/configuration_baseline/${scope.row.uuid}`)
          }
        },
        {
          icon: 'qr-code',
          name: '查看二维码',
          v_noBtn: 'assetsManage_qrCode',
          handler: function (row, scope) {
            vm.curAsset = scope.row;
            vm.qrCordDialogFlag = true;
          }
        }
      ]
    },
    // 添加
    showCascader() {
      document.querySelector('.s-cascader').click();
    },
    // 置为配置基准
    setConfigBase() {
      if (this.selections.length < 1) {
        this.$message.warning('请至少选择一项资产！');
      } else {
        let dateStr = ''
        let date = new Date()
        let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
        this.selections = this.selections.map(item => {
          return Object.assign({}, item, {dateStr: dateStr})
        })
        let obj = {
          data: this.selections,
          logTemplate: '置为配置基准|资产(#controlAdderss#/#itcompName#)>配置>变更时间(#dateStr#)'
        }
        this.assetListAjax.addBaseline(this.selections.map(item => item.uuid), obj).then(({ data }) => {
          if (data.state === true) {
            this.$message.success('设置成功！')
            this.selections = [];
            this.$refs.assetListTable.$refs.stable.clearSelection()
          } else {
            this.$message.error(data.errormsg)
          }
        })
      }
    },
    // 批量开始日志审计
    openBatchAudit() {
      let uuidArr = this.selections.map(item => {
        return item.uuid;
      });
      if (uuidArr.length === 0) {
        this.$message.warning('请至少选择一项资产！');
      } else {
        let params = {
          params: 'start',
          monitorItcompUuids: uuidArr
        };
        let obj = {
          data: this.selections,
          logTemplate: '开启日志|资产(#controlAdderss#/#itcompName#)'
        }
        this.assetListAjax.assetBatchAudit(params, obj).then(({ data }) => {
          if (data.result === 'success_on') {
            this.$message({ showClose: true, message: '开启日志审计成功！', type: 'success' });
          } else {
            let tip = '';
            if (data.fail1sb !== undefined && data.fail1sb !== null) {
              tip = `设备【${data.fail1sb.join(',')}】因没有配置IP，`;
            }
            if (data.fail2sb !== undefined && data.fail2sb !== null) {
              tip += `设备【${data.fail2sb.join(',')}】因日志审计数达到上限，`
            }
            this.$message({ duration: 5000, showClose: true, message: `${tip}开启日志审计失败！`, type: 'error' });
          }
          this.reload();
        });
      }
    }
  },
  components: {
    newScanDialog,
    assetsBatchEdit,
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
