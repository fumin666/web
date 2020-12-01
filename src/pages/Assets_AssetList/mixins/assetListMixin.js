/*
 * @Author: 高建鹏
 * @Version: //Q4资产管理列表
 * @Description:资产管理列表页面
 * @Position:资产管理-》资产管理列表
 * @Date: 2019-09-28 00:04:50
 * @LastEditors: mybells
 */
import $axios from 'sunflower-ajax'
import exportDialog from '@/home/exportDialog';
import inputTree from '@/components/inputTree/InputTree';
import importDialog from '../AssetOtherDialog/AssetsBatchImport';
import importAPDialog from '@/components/importDialog/ImportDialog';
import assetCheckDialog from '../AssetOtherDialog/AssetCheckDialog';
import assetCheckResultDialog from '../AssetOtherDialog/AssetCheckResultDialog';
import speedAuthoriseDialog from '../AssetOtherDialog/SpeedAuthoriseDialog';
import manageConfigDialog from '../AssetAddDialog/ManageConfigDialog';
import qrCordDialog from '../AssetOtherDialog/QrCordDialog';
import checkRelationDialog from '../AssetOtherDialog/CheckRelationDialog';
import accountPasskeyImportDialog from '../AssetOtherDialog/AccountPasskeyImportDialog';
import accountPasskeyExportDialog from '../AssetOtherDialog/AccountPasskeyExportDialog';
import assetAccount from '../AssetAddTabs/AssetAccount'
import protocolSet from '../AssetAddTabs/ProtocolSet'
import editOtherDialog from '../AssetOtherDialog/EditOtherDialog';
import {cloneDeep} from 'lodash';
import authCheck from '@/common/mixins/auth.js'
import Bus from '@/plugins/eventBus';
import {Download, base64} from 'sunflower-common-utils'
let assetListMixin = {
  mixins: [authCheck],
  data() {
    return {
      showColumn: false,
      defaultexpandall: false,
      showTable: false,
      exportDialogFlag: false,
      exportProtpcolDialogFlag: false,
      exportAccountDialogFlag: false,
      exportDialogFlagAll: false,
      exportProtpcolDialogFlagAll: false,
      exportAccountDialogFlagAll: false,
      exportAssetAccountDialogFlagAll: false,
      protocolUploadObj: {
        type: 'post',
        url: '/resourcemanager/assetmanager/itasset/importProtocol'
      },
      protocolDownObj: {
        text: '协议导入模板',
        type: 'check',
        check() {
          return {state: true, params: []};
        },
        url: '/resourcemanager/assetmanager/itasset/protocolTempalte'
      },
      accountFileType: ['xls', 'xlsx'],
      accountUploadObj: {
        url: '/assetsAccountInfo/importAccountInfo',
        type: 'get'
      },
      accountDownObj: {
        url: '/assetsAccountInfo/importAccountInfoTemplate',
        text: '批量导入资产账号模板'
      },
      checkRelationDialog: false, // 操作栏查看关联人员
      operationWidth: '150',
      dynamicData: {
        citypeUuid: '',
        assetDynList: [],
        orderType: 1,
        operationCol: 0,
        orderName: 'assetName'
      },
      tempDynamicData: {
        citypeUuid: '',
        assetDynList: [],
        orderType: 1,
        operationCol: 0,
        orderName: 'assetName'
      },
      isSecurityUser: '', // 是否是安全管理员
      isImp: true,
      data: [],
      activeTab: 0,
      itTreeData: [],
      currentLeftTreeUuid: '',
      defaultExpandKeys: [],
      searchOptions: [],
      cmdbOrgOptions: [],
      protocolOption: [],
      portOption: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      addType: [],
      listHead: [],
      listAllHead: [],
      assetList: [],
      selections: [],
      searchForm: {
        citypeUuid: '',
        assetIp: '',
        assetName: '',
        product: '', // 型号
        manufact: '', // 厂商
        cmdbOrgUuid: '', // 部门
        accountName: '',
        protocolName: [],
        port: []
      },
      ajaxObj: {
        type: 'post',
        url: '/assetDynamicColnum/getAssetListData',
        params: {
          condition: {
            // "citypeUuid":"",
            // "assetIp":"",
            // "assetName":"",
            // "manufact":"",
            // "product":""
          }
        }
      },
      criteria: { // 根据分页、查询条件查询列表的参数
        condition: {
          citypeUuid: '',
          assetIp: '',
          assetName: '',
          manufact: '',
          product: '',
          cmdbOrgUuid: '', // 部门
          accountName: '',
          protocolName: [],
          port: []
        }
      },
      manufactOptions: [], // 厂商下拉列表
      productOptions: [], // 型号下拉列表
      protocolImportDialogFlag: false,
      accountImportDialog: false,
      importDialogFlag: false,
      checkDialogFlag: false,
      checkResultDialogFlag: false,
      authoriseAssets: [],         // 批量快速授权资产uuids
      authoriseDialogFlag: false,
      manageDialogFlag: false,
      qrCordDialogFlag: false,
      batchEditDialog: false,         // 批量编辑弹框
      accountPasskeyImportDialogFlag: false,    // 密钥文件导入
      accountPasskeyExportDialogFlag: false,    // 密钥文件导出
      curUuid: '',
      assetUuid: '',
      curAsset: {},
      auditAssets: [],
      checkResult: {},
      treeScrollHeight: 500,
      accountDialogFlag: false,
      protocolDialogFlag: false,
      editOtherFlag: false
    }
  },
  created() {
    if (this.$route.query.all) {
      this.defaultexpandall = true;
    }
    // 获取型号
    $axios.get(`/resourcemanager/configurationmanage/manufactProduct/getAllManufact`).then((res) => {
      this.manufactOptions = res.data || [];
    });
    // 获取使用部门、端口、协议
    $axios.get(`/assetDynamicColnum/getAssetListSearchCondition`).then((res) => {
      this.cmdbOrgOptions = res.data.cmdbOrgTree || []
      this.protocolOption = res.data.protocolName || []
      this.portOption = res.data.port || []
    });
    // 获取搜索栏资产类型选项
    this.assetListAjax.getCitypeTree().then(({data}) => {
      this.searchOptions = data;
    });
    // 获取IT资产树
    this.axiosAssetItTree(() => {
      this.selectItTree(this.$route.query.name);
    });
    Bus.$on('securityUser', (val) => { // 是否是安全管理员
      if (val) {
        this.isSecurityUser = 'max-height: calc(100vh - 100px);'
      }
    });
    let firestMenu = this.$store.state.firstMenu;// 获取所有一级目录
    let imp = firestMenu.filter(function(obj) { // 返回资产监控的obj
      return obj.uuid === 'f10adc3949ba59abbe56e057f20f88a8'
    })
    // 如果这个人注册了监控模块并且显示有监控模块
    if (!this.ImpAuth && !imp.length) {
      this.isImp = false
      // 当且仅当该资产被监控时，跳转至资产监控数据面板业
    }
  },
  mounted() {
    this.doLayout();
    window.addEventListener('resize', this.doLayout);
    /* 监听刷新操作 （新扫描添加操作AssetsMonitor_List\MonitorDialog\NewScanDialog.vue） */
    Bus.$on('reloadPage', () => {
      this.reload(true);
    });
  },
  beforeDestroy() {
    Bus.$off('securityUser');
  },
  destroyed() {
    window.removeEventListener('resize', this.doLayout);
  },
  methods: {
    fixed(val) {
      if (val === '资产名称') {
        return true;
      } else {
        return false;
      }
    },
    handleData(data) {
      data.totalCount = data.criteria.totalCount;
      this.listHead = data.tableHeads;
      return data.criteria.pageList;
    },
    /* 按钮协议导入 */
    protocolImportBatch() {
      this.protocolImportDialogFlag = true;
    },
    /* 按钮协议导出 */
    protocolExportBatch() {
      if (this.selections.length === 0) {
        this.$message.warning('请至少选择一项要导出的资产！');
        return;
      }
      this.exportProtpcolDialogFlag = true
    },
    /* 按钮账号导入 */
    accountImportBatch() {
      this.accountImportDialog = true;
    },
    /* 按钮账号导出 */
    accountExportBatch() {
      if (this.selections.length === 0) {
        this.$message.warning('请至少选择一项要导出的资产！');
        return;
      }
      this.exportAccountDialogFlag = true
    },
    doLayout() {
      this.$nextTick(() => {
        let totalHeihgt = document.body.offsetHeight;
        let headHeight = document.querySelector('#headBar').offsetHeight;
        let footHeight = document.querySelector('.s-footer').offsetHeight;
        let bodyHeight = totalHeihgt - headHeight - footHeight;
        // 17是因为scrollbar的marginbottom, 后一个20是距离footer的距离
        this.treeScrollHeight = bodyHeight - 20 - 35 - 15 - 20 + 17;
        // let searchBoxHeight = document.querySelector('.assetList .searchBtChunk').offsetHeight + 8;
        // searchBoxHeight += document.querySelector('.assetList .searchFormChunk').offsetHeight + 8;
        // let pageHeight = document.querySelector('.assetList .pageRow').offsetHeight + 8;
        // 1好像是table的border,clientTop为1
        // this.tableHeight = pageHeight - 20 - 1;
      });
    },
    // 获取动态列配置
    getDynamicConfig() {
      let uuid = this.currentLeftTreeUuid || 'common_asset_column_000000000000';// 后面这个是查询栏没选择资产类型的公共uuid。
      return $axios.get(`/assetDynamicColnum/getConfig/${uuid}`).then((res) => {
        this.operationWidth = res.data.operationCol ? '300' : '150';
        this.tableOption.isHidden = !res.data.operationCol;
        this.showTable = true;
        this.dynamicData = res.data;
        this.tempDynamicData = cloneDeep(res.data);
      });
    },
    // 动态列恢复
    hide() {
      this.dynamicData.orderType = this.tempDynamicData.orderType;
      this.dynamicData.operationCol = this.tempDynamicData.operationCol;
      this.dynamicData.orderName = this.tempDynamicData.orderName;
    },
    handleNodeClick(nodeData, node, nodeVM) {
      for (let i in this.searchForm) {
        if (i === 'port' || i === 'protocolName') {
          this.searchForm[i] = []
        } else {
          this.searchForm[i] = ''
        }
      }
      for (let i in this.criteria.condition) {
        if (i === 'port' || i === 'protocolName') {
          this.criteria.condition[i] = []
        } else {
          this.criteria.condition[i] = ''
        }
      }
      let name = nodeData.name.slice(0, nodeData.name.indexOf('('));
      if (name !== this.$route.query.name) {
        if (this.$route.query.all) {
          this.$router.replace(`${this.$route.path}?name=${name}&all=1`)
        } else {
          this.$router.replace(`${this.$route.path}?name=${name}`)
        }
      }
      this.currentLeftTreeUuid = nodeData.uuid; // 保证tree刷新后高亮
      this.criteria.condition.citypeUuid = nodeData.uuid;
      this.searchForm.citypeUuid = nodeData.uuid;
      this.getDynamicConfig().then(() => {
        this.axiosAssetList();
      })
    },
    nodeExpand(nodeData) {
      this.defaultExpandKeys = this.getallUuidArr(nodeData);
    },
    renderContent(h, {node}) {
      let arr = [];
      let img = '';
      if (node.level !== 1) {
        if (node.data.node.icon) {
          arr = node.data.node.icon.split('/')
          img = '../../static/images/asseticon/' + arr[arr.length - 1]
        } else {
          img = '../../static/images/asseticon/files.png'
        }
      } else {
        img = '../../static/images/asseticon/files.png'
      }
      return (<span><span style="vertical-align: middle;"><img style="margin-right: 4px" src={img} ></img> </span><span style="font-size:14px" title={ node.label }> {node.label}</span ></span>);
    },
    axiosAssetItTree(callback = function () {}) {
      this.assetListAjax.getCountCitypeTree().then(({data}) => {
        this.itTreeData = data;
        // 展开一级
        // this.defaultExpandKeys = this.itTreeData.map(item => {
        //   return item.uuid;
        // });
        callback();
      });
    },
    getNameUuid(name) {
      switch (name) {
        case '服务器':
          return {self: '953ef33351f6434d8e8fa5c6165d2dc2', top: '953ef33351f6434d8e8fa5c6165d2dc2'};
        case '数据库':
          return {self: 'b90897142ef14a84a33a1535b397fdd0', top: 'fdc689052311432f8efa5cb7416d5f10'};// fdc689052311432f8efa5cb7416d5f10/215231af192543f7bfd6c07801a5f864
        case '中间件':
          return {self: '6af6cda15e21424992737a796a559b13', top: 'fdc689052311432f8efa5cb7416d5f10'};
        case '存储':
          return {self: '232ae915fa524f10b7d170eced1e5e1e', top: '232ae915fa524f10b7d170eced1e5e1e'};
        case '网络':
          return {self: '30913cb481694279a3b1e987d5956545', top: '30913cb481694279a3b1e987d5956545'};
        default:
          return {self: '953ef33351f6434d8e8fa5c6165d2dc2', top: '953ef33351f6434d8e8fa5c6165d2dc2'};
      }
    },
    getallUuidArr(nodeData) {
      let uuidArr = [];
      function loop(data) {
        uuidArr.push(data.uuid);
        var arr = data.childrenList;
        if (arr && arr.length) {
          arr.forEach(item => { loop(item) })
        }
      }
      loop(nodeData);
      return uuidArr;
    },
    selectItTree(name = '服务器') {
      let selfUuid = this.getNameUuid(name).self;
      let topUuid = this.getNameUuid(name).top;
      this.$nextTick(() => {
        if (this.$refs.menuTree) {
          let data = this.$refs.itAssetsTree.getNode(topUuid).data;
          this.defaultExpandKeys = this.getallUuidArr(data);
          this.$refs.itAssetsTree.setCurrentKey(selfUuid);
          let nodeData = this.$refs.itAssetsTree.getCurrentNode();
          this.handleNodeClick(nodeData)
          this.$nextTick(() => {
            let nodes = this.$refs.menuTree.querySelectorAll('.is-current');
            nodes.forEach(item => {
                let scrollWrap = this.$refs.treeScrollbar.$refs.wrap;
                if (item.offsetTop > scrollWrap.clientHeight) {
                  scrollWrap.scrollTop = item.offsetTop - scrollWrap.clientHeight + 300;
                }
            });
          });
        }
      });
    },
    axiosAssetList(callback = () => {}) {
      let param = cloneDeep(this.criteria);
      this.selections = [];// 清除选中项
      for (let i in param.condition) {
        if (param.condition[i] === null || param.condition[i] === '' || param.condition[i].length === 0) {
          param.condition[i] = null;
        }
      }
      this.ajaxObj.params.condition = cloneDeep(param.condition);
    },
    // 删除资产
    axiosDelAssets(param, data, isBatch = false) {
      this.$confirm('确定删除所选资产?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let newArr = [];
        if (data.length > 0) {
          for (let i in data) {
            let param = {
              name: data[i]['controlAdderss'] !== null ? data[i]['controlAdderss'] + '/' + data[i]['itcompName'] : data[i]['itcompName']
            }
            newArr.push(param);
          }
        }
        let option = {data: newArr, logTemplate: '删除|资产(#name#)'}
        this.assetListAjax.assetBatchDelete(param, option).then(({data}) => {
          if (data.result === 'success') {
            this.$message({showClose: true, message: '删除成功!', type: 'success'});
            this.reload(true);
          } else if (data.result === 'fail') {
            this.$message({showClose: true, message: '删除失败，请重试！', type: 'error'});
            this.reload(true);
          } else {
            this.$message({showClose: true, message: '删除失败，请重试！', type: 'error'});
            this.reload(true);
          }
        });
      }).catch(() => {});
    },
    selectionChange(selections) {
      this.selections = selections;
    },
    showColumnSet() {
      if (!this.currentLeftTreeUuid) {
        this.$message.warning('请选定具体资产分类进行动态列设置！');
        this.$refs.showColumnSet.close();
      }
    },
    listSearch() {
      this.criteria.condition = Object.assign({}, this.criteria.condition, this.searchForm);
      if (this.searchForm.citypeUuid) {
        this.currentLeftTreeUuid = this.searchForm.citypeUuid;
        let data = this.$refs.itAssetsTree.getNode(this.currentLeftTreeUuid).data;
        this.defaultExpandKeys = this.getallUuidArr(data);
        this.$refs.itAssetsTree.setCurrentKey(this.currentLeftTreeUuid);
      } else {
        this.currentLeftTreeUuid = '';
        this.$refs.itAssetsTree.setCurrentKey(null);
      }
      this.getDynamicConfig().then(() => {
        this.axiosAssetList();
      })
      this.$nextTick(() => {
        let nodes = this.$refs.menuTree.querySelectorAll('.is-current');
        nodes.forEach(item => {
            // item.click()
            let scrollWrap = this.$refs.treeScrollbar.$refs.wrap;
            if (item.offsetTop > scrollWrap.clientHeight) {
              scrollWrap.scrollTop = item.offsetTop - scrollWrap.clientHeight + 300;
            }
        });
      });
    },
    // 弹框关闭后刷新所有
    reload(treeFlag) { // treeFlag:需不需要刷新左侧树
      if (treeFlag) {
        this.axiosAssetItTree()
      }
      this.axiosAssetList();
    },
    // 顶部隐藏添加下拉列表按钮-----------------------------------------------------------------------------------
    add(val) {
      this.$router.push({path: 'assets_list/assetAdd', query: {addType: val}})
    },
    // 批量操作---------------
    delBatch() {
      let uuidArr = this.selections.map(item => {
        return item.uuid;
      });
      if (uuidArr.length === 0) {
        this.$message.warning('请至少选择一项要删除资产！');
      } else {
        this.axiosDelAssets(uuidArr, this.selections, true);
      }
    },
    // 批量编辑资产
    batchEdit() {
      let uuidArr = this.selections.map(item => item.uuid);
      if (uuidArr.length === 0) {
        this.$message.warning('请至少选择一项要编辑的资产！');
      } else {
        this.batchEditDialog = true;
      }
    },
    // 批量编辑资产弹窗的回调
    closeBatchEditDialog(freshList) {
      freshList && this.reload();
      this.axiosAssetItTree();
      this.batchEditDialog = false;
    },
    // 打开批量导入弹框
    importBatch() {
      this.importDialogFlag = true;
    },
    exportBatch() {
      if (this.selections.length === 0) {
        this.$message.warning('请至少选择一项要导出的资产！');
        return;
      }
      for (let key in this.form) {
        this.form[key] = ''
      }
      this.exportDialogFlag = true
    },
    cancelDialog() {
      if (this.exportDialogFlag) {
        this.exportDialogFlag = false
      } else if (this.exportProtpcolDialogFlag) {
        this.exportProtpcolDialogFlag = false
      } else if (this.exportAccountDialogFlag) {
        this.exportAccountDialogFlag = false
      }
    },
    exportDialogOk(form) {
      let params = {}
      params.assetUuidList = this.selections.map(item => item.uuid);
      if (this.exportDialogFlag) {
        this.assetListAjax.exportAssetParams(params, {
          data: [],
          logTemplate: '资产导出|资产(Asset)'
        }).then(({data}) => {
          if (data) {
            Download(`/resourcemanager/assetmanager/itasset/exportAssetSecond/${form.password}`);
            this.exportDialogFlag = false
          }
        });
      } else if (this.exportProtpcolDialogFlag) {
        $axios.post(`/assetProtocolPort/exportBatchOpeProtocolFirst`, params, {
          data: this.selections,
          logTemplate: '协议导出|资产(#controlAdderss#/#itcompName#)>协议(ProtocolPort)'
        }).then(({data}) => {
          if (data) {
            Download(`/assetProtocolPort/exportBatchOpeProtocolSecond/${form.password}`);
            this.exportProtpcolDialogFlag = false
          }
        });
      } else if (this.exportAccountDialogFlag) {
        $axios.post(`/assetsAccountInfo/exportBatchOpeAccountFirst`, params, {
          data: this.selections,
          logTemplate: '账号导出|资产(#controlAdderss#/#itcompName#)>账号(AccountInfo)'
        }).then(({data}) => {
          if (data) {
            Download(`/assetsAccountInfo/exportBatchOpeAccountSecond/${form.password}`);
            this.exportAccountDialogFlag = false
          }
        });
      }
    },
    exportAccountPassKeyOk(form) {
      let encrypt = new base64()
      if (form.password !== form.repassword) {
        this.$message({showClose: true, message: '两次输入的密码必须一样', type: 'error'});
        return false;
      }
      form.password === '' ? form.password = '' : form.password = encrypt.encode(form.password)
      $axios.post('/assetsAccountInfo/exportSshKeyFile', {passwd: form.password}, {
        data: this.selections,
        logTemplate: '密钥文件导出|资产(#controlAdderss#/#itcompName#)>密钥文件(SshKeyFile)'
      }).then(res => {
        if (res.data) {
          Download(res.data[0]); // 导出
        }
      })
      this.accountPasskeyExportDialogFlag = false
    },
    // 资产账号稽核完成的回调
    checkComplete(result) {
      result.sysLogList.forEach((item, index) => {
        if (item.assetAccountName.indexOf('public') !== -1) {
          result.sysLogList.splice(index, 1)
        }
      })
      this.checkResult = result;
      this.checkResultDialogFlag = true;
    },
    // 快速授权
    authorise() {
      if (this.selections.length > 0) {
        this.authoriseAssets = this.selections.concat([]);
        this.authoriseDialogFlag = true;
      } else {
        this.$message.warning('请至少选择一项要授权的资产');
      }
    },
    // 密码导出
    AccountExport(row) {
      if (this.selections.length === 0) {
        this.$message.warning('请至少选择一项要导出账号密码的资产！');
        return;
      }
      let uuids = this.selections.map(item => item.uuid);
      this.$router.push({path: `/AssetsAll/assets_list/assetsAccountExport`, query: {uuids: uuids}})
    },
    // 点击列表资产名称
    gotoAssetDetail(row) {
      let path = this.$route.path.split('/')
      if (path.indexOf('assets_list') !== -1) {
        this.$router.push(`assets_list/assetDetail/${row.uuid}`);
      } else {
        this.$router.push(`AssetsAll/assets_list/assetDetail/${row.uuid}`);
      }
    },
    // 列表日志审计开关
    BatchMonitor(params, option, callback = () => {}) {
      this.assetListAjax.assetBatchAudit(params, option).then(({data}) => {
        callback(data);
      });
    },
    // 列表日志审计开关
    monitor(row) {
      let param = {};
      this.$nextTick(() => {
        if (row['isAudit'] === 0) {
          param.params = 'end';
        } else {
          param.params = 'start';
        }
        param.monitorItcompUuids = [row.uuid];
        let option = {data: [Object.assign({}, row)], logTemplate: `${row['isAudit'] ? '开启' : '关闭'}日志审计|资产(#controlAdderss#/#itcompName#)`}
        this.BatchMonitor(param, option, data => {
          if (data.result === 'success_on') {
            this.$message({showClose: true, message: '开启日志审计成功！', type: 'success'});
          } else if (data.result === 'success_off') {
            this.$message({showClose: true, message: '关闭成功！', type: 'success'});
          } else {
            let tip = '';
            if (data.fail1sb !== undefined && data.fail1sb !== null) {
              tip = `设备【${data.fail1sb.join(',')}】因没有配置IP，`;
            }
            if (data.fail2sb !== undefined && data.fail2sb !== null) {
              tip += `设备【${data.fail2sb.join(',')}】因日志审计数达到上限，`
            }
            this.$message({duration: 5000, showClose: true, message: `${tip}开启日志审计失败！`, type: 'error'});
          }
          this.reload();
        })
      })
    },
    // 点击列表ip地址
    gotoItemInfo(row) {
      let firestMenu = this.$store.state.firstMenu;// 获取所有一级目录
      let imp = firestMenu.filter(function(obj) { // 返回资产监控的obj
        return obj.uuid === 'f10adc3949ba59abbe56e057f20f88a8'
      })
      // 如果这个人注册了监控模块并且显示有监控模块
      if (this.ImpAuth && imp.length) {
        // 当且仅当该资产被监控时，跳转至资产监控数据面板业
        if (row.canMonitor) {
          this.$router.push(`/AssetsMonitor/assetsMonitor_list/assetDetail/${row.uuid}`);
        } else {
          this.$message.info('该资产未被监控，无法查看监控数据！')
        }
      } else {
        this.$message.info('没有权限,请联系管理员！')
      }
    },
    // 密钥文件导入
    passKeyImport() {
      this.accountPasskeyImportDialogFlag = true;
    },
    // 密钥文件导出
    passKeyExport() {
      this.accountPasskeyExportDialogFlag = true;
    },
    circleGetOptions(arr) {
      return arr.map(item => {
        let obj = {
          value: item.uuid,
          label: item.name
        };
        if (item.childrenList && item.childrenList.length > 0) {
          obj.children = this.circleGetOptions(item.childrenList)
        }
        return obj;
      })
    },
    // 动态列设置保存
    saveform(data) {
      let params = cloneDeep(this.dynamicData)
      params.assetDynList = data;
      $axios.post(`/assetDynamicColnum/setConfig`, params, {
        data: [],
        logTemplate: '编辑|动态列设置'
      }).then((res) => {
        if (res.data && res.data.state) {
          this.showTable = false;
          this.getDynamicConfig().then(() => {
              this.axiosAssetList();
          })
          this.$message.success('设置成功')
        } else {
          this.$message.error(res.data.errormsg)
        }
      });
    },
    /* 全部导出 */
    exportAssets(form) {
      $axios.post(`/resourcemanager/assetmanager/itasset/exportAllAssetFirst`, this.searchForm).then(({data}) => {
        if (data) {
          Download(`/resourcemanager/assetmanager/itasset/exportAllAssetSecond/${form.password}`);
          this.exportDialogFlagAll = false
        }
      });
    },
    exportProtocol(form) {
      $axios.post(`/assetProtocolPort/exportAllProtocolByItcompFirst`, this.searchForm).then(({data}) => {
        if (data) {
          Download(`/assetProtocolPort/exportAllProtocolByItcompSecond/${form.password}`);
          this.exportProtpcolDialogFlagAll = false
        }
      });
    },
    exportAccount(form) {
      $axios.post(`/assetsAccountInfo/exportAllAssetAccountByItcompFirst`, this.searchForm).then(({data}) => {
        if (data) {
          Download(`/assetsAccountInfo/exportAllAssetAccountByItcompSecond/${form.password}`);
          this.exportAccountDialogFlagAll = false
        }
      });
    },
    exportAssetAccount(form) {
      $axios.post(`/resourcemanager/assetmanager/itasset/exportAllAssetAccountPwFirst`, Object.assign({}, this.searchForm, {password: form.password})).then(({data}) => {
        if (data) {
          Download(data[0]);
          this.exportAssetAccountDialogFlagAll = false
        }
      })
    }
  },
  computed: {
    // 添加操作下拉列表
    addOptions() {
      return this.circleGetOptions(this.searchOptions);
    }
  },
  watch: {
    // 根据厂商获取型号
    'searchForm.manufact'(manufactUuid) {
      this.searchForm.product = ''
      if (manufactUuid) {
        $axios.get(`/resourcemanager/configurationmanage/manufactProduct/getProductByManufact/${manufactUuid}`).then((res) => {
          this.productOptions = res.data || [];
        });
      } else {
        this.productOptions = [];
      }
    }
  },
  components: {
    exportDialog,
    inputTree,
    importDialog,
    importAPDialog,
    assetCheckDialog,
    speedAuthoriseDialog,
    manageConfigDialog,
    assetCheckResultDialog,
    qrCordDialog,
    accountPasskeyImportDialog,
    accountPasskeyExportDialog,
    assetAccount,
    protocolSet,
    editOtherDialog,
    checkRelationDialog
  }
};

export default assetListMixin;
