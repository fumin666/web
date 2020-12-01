<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-16 09:07:04
 * @LastEditTime: 2019-11-21 11:27:22
 * @LastEditors: 高建鹏,songyf
 -->
<template>
  <section id="oper-equipment" class="assetList" style="height: calc(100vh - 180px);">
    <s-row type="flex" :gutter="10">
      <s-col :span="4" class="people-manage-box">
        <div class="left-nav tree-box">
          <div class="tree-title">
            <i class="iconfont icon-organ"></i>
            <span>IT资产</span>
          </div>
          <s-scrollbar wrap-style="maxHeight:calc(100vh - 170px);" key="it" ref="treeScrollbar">
            <s-tree
              ref="tree"
              :data="itTreeData"
              id="itAssetsTree"
              :props="defaultProps"
              :highlight-current="true"
              :current-node-key="currentNodeValue"
              node-key="uuid"
              @node-click="handleNodeClick"
              :expand-on-click-node="false"
              :default-expand-all="true"
              :default-expanded-keys="[currentNodeValue]"
              :render-content="renderContent">
            </s-tree>
          </s-scrollbar>
        </div>
      </s-col>
      <s-col :span="20">
        <s-scrollbar wrap-class="tab-scroll-height">
          <div class="oper-right-table" style="margin-bottom: 20px">
            <s-form id="formToSearch"
                    :inline="true"
                    :model="formInline"
                    class="search_form"
                    style="margin: 0 0 10px 0"
                    label-width='75px'>
              <div>
                <s-form-item label="资产名称：">
                  <s-input v-model="formInline.condition.itcompName" @keyup.enter.native="enterAction"></s-input>
                </s-form-item>
                <s-form-item label="IP地址：">
                  <s-input v-model="formInline.condition.ipAddress" @keyup.enter.native="enterAction"></s-input>
                </s-form-item>
                <s-form-item label="协议名称：">
                  <s-select v-model="formInline.condition.protocolName" filterable multiple  collapse-tags clearable>
                    <s-option v-for="(item, index) in protocolOption" :key="index" :label="item" :value="item"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="端口：">
                  <s-select v-model="formInline.condition.port" multiple filterable collapse-tags clearable>
                    <s-option v-for="(item, index) in portOption" :key="index" :label="item" :value="item"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="账号：">
                  <s-input v-model="formInline.condition.accountName" @keyup.enter.native="enterAction"></s-input>
                </s-form-item>
              </div>
              <div class="search_btn">
                <s-button icon='magnifier' @click="getSearchActionDef">查询</s-button>
              </div>
            </s-form>
            <div>
              <div class="margin-bottom-15 fl">
                <s-button icon="backup" @click="batchOps">批量运维</s-button>
              </div>
              <div class="fr">
                <span>半自动代填</span>
                <s-switch v-model="isOpen" size="small" @change="changeOpen" :active-value="1" :inactive-value="0" style="vertical-align: text-top"></s-switch>
                <!-- 动态列设置 -->
                <dynamic-column-set v-if="showTable" :dynamicData="setData.sysOperList" :option="option" @save="saveSetForm" style="display:inline-block">
                  <s-button icon="set" title="列设置" slot="click"></s-button>
                  <s-form ref="form" label-width="280px" slot="otherSetting" :model="setData.sysOperSet">
                    <s-form-item label="默认排序列" label-width="100px">
                      <s-select v-model="setData.sysOperSet.orderCol" placeholder="请选择">
                        <s-option v-for="item in setData.sysOperList" :key="item.id" :label="item.colName" :value="item.colKey"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="排序方式" prop="isAsc" label-width="100px">
                      <s-select v-model="setData.sysOperSet.orderType" placeholder="请选择">
                        <s-option label="降序" :value="0"></s-option>
                        <s-option label="升序" :value="1"></s-option>
                      </s-select>
                    </s-form-item>
                  </s-form>
                </dynamic-column-set>
              </div>
              <!--真分页表格-->
              <s-table :data="equipmentList" style="width:100%;"
                       @selection-change="handleSelectionChange">
                <s-table-column type="selection" :selectable="isSelectable" width="45">
                </s-table-column>
                <s-table-column :key='index' v-for='(item, index) in propList'
                                :label="item.colName" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <template v-if="item.colKey !== 'device_name'">
                      {{scope.row[item.colKey]}}
                    </template>
                    <template v-if="item.colKey === 'device_name'">
                      <a class="detailLink" @click="gotoAssetDetail(scope.row)">{{scope.row[item.colKey]}}</a>
                    </template>
                  </template>
                </s-table-column>
                <s-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <i class="iconfont icon-oper-equip" v-if="scope.row.canOperate === true" @click="handleOps(scope.row)"
                       title="运维"></i>
                    <i class="iconfont icon-ban" v-if="scope.row.canOperate === false" @click="handleBan()"
                       title="禁止运维"></i>
                    <i class="iconfont icon-special-oper" v-if="isShowRapid(scope.row)" @click="handleRapid(scope.row)"
                       title="快速运维"></i>
                  </template>
                </s-table-column>
              </s-table>
              <s-row class="pageRow">
                <s-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                              :current-page="formInline.currentPage" :page-size="formInline.pageSize"
                              layout="total, sizes, prev, pager, next, jumper" :total="formInline.totalCount">
                </s-pagination>
              </s-row>
            </div>
          </div>
        </s-scrollbar>
      </s-col>
    </s-row>
    <!--运维访问(new)-->
    <s-dialog
      v-model="opsAccessNewDialog"
      v-if="opsAccessNewDialog"
      width="700px"
      title="运维访问">
      <ops-access-new :rowData="rowData" :isOpen="isOpen" ref="opsAccessNew"></ops-access-new>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOpsAccessNew">运维</s-button>
        <s-button type="cancel" @click="opsAccessNewDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--运维访问-->
    <s-dialog v-model="opsDialog" v-if="opsDialog" width="700px" title="运维访问">
      <ops-add :decisionData="rowData" :showModel="showModel" :isOpen="isOpen" ref="ops"></ops-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveOps">保存</s-button>
        <s-button type="cancel" @click="opsDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--快速运维弹框-->
    <s-dialog v-model="RapidopsDialog" v-if="RapidopsDialog" width="700px" title="快速运维">
      <rapid-add :decisionData="rowData" :userShow="usershow" :isOpen="isOpen" ref="Rapidops"></rapid-add>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveRapidops">保存</s-button>
        <s-button type="cancel" @click="RapidopsDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  import opsAdd from './OpsAdd'
  import rapidAdd from './RapidOpsAdd'
  import {cloneDeep} from 'lodash';
  import dynamicColumnSet from '@/components/dynamicColumnDialog/DynamicColumnSet.vue'
  import OpsAccessNew from '@/pages/Operation_Equipment/OpsAccessNew';

  const VNC = '00000000000000000000000000000078';
  const RDP = '00000000000000000000000000000077';
  const account = 'noneaccount000000000000000000000';
  const mysql = '00000000000000000000000000000084';
  const sqlserver = '00000000000000000000000000000085';
  const db2 = '00000000000000000000000000000081';
  const informix = '00000000000000000000000000000082';
  const sybase = '00000000000000000000000000000086';
  const oracle = '00000000000000000000000000000080';
  const plsql = '00000000000000000000000000000114';
  const toadoracle = '00000000000000000000000000000120';
  const SSH = '00000000000000000000000000000072';
  const SFTP = '00000000000000000000000000000074';
  const mssqlserver = '00000000000000000000000000000113';
  export default {
    data() {
      return {
        opsAccessNewDialog: false, // 运维访问(new)
        showTable: true,
        setData: {
          sysOperList: [],
          sysOperSet: {
            orderCol: '',
            orderType: ''
          }
        },
        option: {
          title: '列显示设置',
          key: 'uuid', // key
          nameKey: 'colName', // 名字key
          showKey: 'status', // 是否显示key
          sortKey: 'order', // 排序key
          width: '300',
          height: '500'
        },
        showModel: '',
        rowData: [],
        opsDialog: false,
        RapidopsDialog: false,
        itTreeData: [],
        positionTreeData: [],
        organizationTree: [],
        defaultExpandKeys: [],
        currentLeftTreeUuid: '',
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        },
        formInlines: {
          departName: [],
          protocolName: [],
          port: [],
          itcompName: '',
          ipAddress: ''
        },
        currentNodeValue: '',
        currentPositionValue: '',
        currentDepartValue: '',
        equipmentList: [],
        propList: [],
        protocolOption: [],
        portOption: [],
        usershow: '',
        multipleSelection: [],
        searchFlag: 1,
        formInline: { // 根据分页、查询条件查询列表的参数
          condition: {
            departName: [],
            protocolName: [],
            port: [],
            itcompName: '',
            ipAddress: '',
            citypeuuid: ''
          },
          currentPage: 1,
          orderByClause: '',
          pageSize: 10,
          totalCount: 0
        },
        isOpen: 0
      }
    },
    components: {

      // SearchBox,
      opsAdd,
      rapidAdd,
      dynamicColumnSet,
      OpsAccessNew
    },
    methods: {
      getSetForm() {
        $axios.get('/operationSettings/listOperPage').then((res) => {
          this.setData = res.data;
        })
      },
      // 获取开关状态
      getSwitch() {
        $axios.get('/basicOperation/getAutoSetInfo').then((res) => {
          this.isOpen = res.data
        })
      },
      changeOpen(isOpen) {
        $axios.get(`/basicOperation/openOrCloseAutoSet/${isOpen}`, {
          logTemplate: isOpen ? '设置|半自动代填' : '取消设置|半自动代填'
        }).then((res) => {
          if (isOpen) {
            this.$message({showClose: true, message: '开启半自动代填成功!', type: 'success'});
          } else {
            this.$message({showClose: true, message: '关闭半自动代填成功!', type: 'success'});
          }
        })
      },
      getWidth(i) {
        if (i.colKey === 'device_ip') {
          return 160
        }
      },
      /* 批量运维 */
      batchOps() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'error',
            message: '请至少选择一个'
          });
          return false
        }
        let equimentAry = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          let row = this.multipleSelection[i]
          equimentAry.push(row.uuid)
        }
        $axios.post('/basicOperation/batchOperationUrl', equimentAry).then((res) => {
          if (res.data !== '' || res.data !== null || res.data !== undefined) {
            if (res.data.length > 0) {
              window.location.href = res.data
            } else {
              this.$message({
                type: 'error',
                message: '无法运维,请检查！'
              });
            }
          }
        }).catch(() => {
            this.$message({
              type: 'error',
              message: '无法运维,请检查！'
            });
          }
        )
      },
      // 全选
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      /* 是否可以勾选 */
      isSelectable(row) {
        let flag;
        (row.accountUuid === account || row.accountUuid === null || row.canOperate === false) ? flag = false : flag = true
        return flag
      },
      /* 普通运维 */
      goToOperation(form) {
        $axios.post('/basicOperation/webOperation', form).then((res) => {
          if (res.status === 200) {
            if (res.data !== '' || res.data !== null || res.data !== undefined) {
              if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
                window.location.href = res.data
                this.opsDialog = false
                this.opsAccessNewDialog = false
              } else {
                this.opsDialog = false
                this.$message({
                  type: 'error',
                  message: res.data
                });
              }
            } else {
              this.opsDialog = false
              this.opsAccessNewDialog = false
              this.$message({
                type: 'error',
                message: '无法运维,请检查！'
              });
            }
          }
        });
      },
      /* 快速运维 */
      goQuickOperation(form) {
        $axios.post('/basicOperation/quickWebOperation', form).then((res) => {
          if (res.status === 200) {
            if (res.data !== '' || res.data !== null || res.data !== undefined) {
              if (res.data.length > 0 && res.data.indexOf('ssi://') !== -1) {
                window.location.href = res.data
                this.RapidopsDialog = false
              } else {
                this.RapidopsDialog = false
                this.$message({
                  type: 'error',
                  message: res.data
                });
              }
            } else {
              this.RapidopsDialog = false
              this.$message({
                type: 'error',
                message: '快速运维失败,请检查！'
              });
            }
          }
        });
      },
      saveOpsAccessNew() { // 保存运维访问（new）
        let form = this.$refs.opsAccessNew.searchForm
        if (!this.opsAccessNewDialog) {
          form.isAutoRecord = 0
        } else if (!this.$refs.opsAccessNew.userShow && !this.$refs.opsAccessNew.pwdShow) {
          form.isAutoRecord = 0
        }
        this.$refs['opsAccessNew'].$refs['searchForm'].validate(valid => {
          if (!valid) return;
          if (form.passwordType === 1 && form.strKeyPath === '') {
            this.$message({type: 'warning', message: '请先上传文件'});
            return
          }
          this.goToOperation(form)
        })
      },
      saveOps() {
        let form = this.$refs.ops.form
        if (!this.opsDialog) {
          form.isAutoRecord = null
        } else if (!this.$refs.ops.userShow && !this.$refs.ops.pwdShow) {
          form.isAutoRecord = null
        }
        this.$refs['ops'].$refs['addForm'].validate(valid => {
          if (!valid) return;
          if (form.passwordType === 1 && form.strKeyPath === '') {
            this.$message({type: 'warning', message: '请先上传文件'});
            return
          }
          this.goToOperation(form)
        })
      },
      saveRapidops() {
        let form = this.$refs['Rapidops'].form
        let row = this.$refs['Rapidops'].decisionData
        let argumentObj = JSON.parse(row.arguments)
        if (form.accountName !== '') {
          argumentObj.params.strAccount = form.accountName
        }
        if (!this.RapidopsDialog) {
          form.isAutoRecord = null
        }
        argumentObj.params.strPw = form.accountPwd
        argumentObj.params.strClipboard = row.clipboardNum.toString()
        argumentObj.params.strDiskMapping = row.disk_mappingNum.toString()
        let argumentStr = JSON.stringify(argumentObj)
        let formObj = {
          isAutoRecord: form.isAutoRecord,
          accountName: form.accountName,
          accountPwd: form.accountPwd,
          arguments: argumentStr,
          operationuuid: row.uuid
        }
        this.$refs['Rapidops'].$refs['rapid'].validate(valid => {
          if (!valid) return;
          this.goQuickOperation(formObj)
        })
      },
      handleOps(row) {
        this.rowData = row
        if (!row.portUuid) { // 运维访问（new）
          this.opsAccessNewDialog = true
        } else {
          let isAutoRecord = 1
          let opsForm = {
            accountuuid: row.accountUuid,
            diskMapping: row.disk_mappingNum,
            operationuuid: row.uuid,
            oprationIp: row.device_ip,
            portuuid: row.portUuid,
            protocluuid: row.protocolUuid,
            clipboard: row.clipboardNum,
            isAutoRecord: isAutoRecord,
            accountName: '',
            accountPwd: '',
            colorDepth: '',
            rdpConsole: '',
            dbname: row.dbName || row.dbServerName,
            resolution: '',
            serverip: ''
          }
          let pid = row.protocolUuid
          let pType = row.protocolType
          let aid = row.accountUuid
          let authorized = false
          if (aid === account || aid === null) {
            authorized = true
          }   // 未授权
          if (pType === 2 || pType === 5 || pid === db2 || pid === informix || pid === sybase || pid === sqlserver || pid === mysql) {
            if (authorized) {
              if (pid === SSH || pid === SFTP) {
                this.showModel = 8
                this.opsDialog = true
              } else {
                this.showModel = 1
                this.opsDialog = true
              }
            } else {
              opsForm.isAutoRecord = null
              this.goToOperation(opsForm)
            }
          } else if (pid === oracle || pid === plsql || pid === toadoracle || pid === mssqlserver) {
            if (authorized) {
              this.showModel = 3
              this.opsDialog = true
            } else {
              this.showModel = 2
              this.opsDialog = true
            }
          } else if (pid === RDP || (pType === 1 && pid !== toadoracle && pid !== plsql && pid !== mssqlserver)) {
            if (authorized) {
              this.showModel = 5
              this.opsDialog = true
            } else {
              this.showModel = 4
              this.opsDialog = true
            }
          } else if (pid === VNC) {
            if (authorized) {
              this.showModel = 7
              this.opsDialog = true
            } else {
              this.showModel = 6
              this.opsDialog = true
            }
          } else {
            if (authorized) {
              this.showModel = 1
              this.opsDialog = true
            } else {
              opsForm.isAutoRecord = null
              this.goToOperation(opsForm)
            }
          }
        }
      },
      handleRapid(row) {
        this.rowData = row
        const arg = JSON.parse(row.arguments)
        arg.params.strClipboard = row.clipboardNum.toString()
        arg.params.strDiskMapping = row.disk_mappingNum.toString()
        let isAutoRecord = 1
        let quickForm = {
          isAutoRecord: isAutoRecord,
          accountName: row.accountName,
          accountPwd: row.accountPwd,
          arguments: JSON.stringify(arg),
          operationuuid: row.uuid
        }
        let pid = row.protocolUuid
        let pType = row.protocolType
        let aid = row.accountUuid
        let authorized = false
        if (aid === account || aid === null) {
          authorized = true
        }   // 未授权
        if (pid === RDP || pType === 1) {
          if (!authorized) {
            quickForm.isAutoRecord = null
            this.goQuickOperation(quickForm)
          } else {
            this.RapidopsDialog = true
          }
        } else if (pid === VNC) {
          if (authorized) {
            this.RapidopsDialog = true
            this.usershow = false
          } else {
            quickForm.isAutoRecord = null
            this.goQuickOperation(quickForm)
          }
        } else {
          if (authorized) {
            this.showModel = 1
            this.opsDialog = true
          } else {
            quickForm.isAutoRecord = null
            this.goQuickOperation(quickForm)
          }
        }
      },
      // 能否快速运维
      isShowRapid(row) {
        let flag
        let pid = row.protocolUuid
        let ppType = row.protocolType
        if (row.canOperate === false) {
          flag = false
          return flag
        }
        if (pid === VNC || pid === RDP || ppType === 1) {
          row.arguments !== null ? flag = true : flag = false
        }
        return flag
      },
      // 禁止运维
      handleBan() {
        this.$message({
          type: 'warning',
          message: '禁止运维'
        })
      },
      getSearchOption() {
        $axios.get('/basicOperation/getSearchBoxCondition').then((res) => {
          this.protocolOption = res.data.protocolName
          this.portOption = res.data.port
        });
      },
      // 左侧树
      getTreeData() {
        $axios.get('/basicOperation/getCitypelist').then((res) => {
          this.itTreeData = res.data;
          this.currentNodeValue = res.data[0].uuid;
          this.$nextTick(function() {
            this.$refs.tree.setCurrentNode(this.itTreeData[0])
          });
          this.getTableList(res.data[0].uuid)
        });
      },
      // 树节点点击
      handleNodeClick(node) {
        this.searchFlag = 1
        this.currentNodeValue = node.uuid
        this.getTableList(node.uuid)
      },
      renderContent(h, {node}) {
        let arr = [];
        let img = '';
        if (node.data.node.icon !== null) {
          arr = node.data.node.icon.split('/')
          img = 'static/images/asseticon/' + arr[arr.length - 1]
        } else {
          img = 'static/images/asseticon/files.png'
        }
        return (
          <span>
          <span style="vertical-align: middle;"><img style="margin-right: 4px" src={img}></img></span>
          <span style="font-size:14px" title={ node.label }>{node.label}</span>
        </span>);
      },
      // 获取数据
      getTableList(uuid) {
        this.formInline.condition.citypeuuid = uuid;
        this.getAssetTableData();
      },
      // 搜索
      enterAction() {
        let vm = this
        let param = cloneDeep(vm.formInline);
        switch (vm.searchFlag) {
          case 1:
            param.condition.citypeuuid = vm.currentNodeValue;
            break
        }
        $axios.post('/basicOperation/getBasicOplist', param).then((res) => {
          this.equipmentList = res.data.pageList;
          this.formInline.totalCount = res.data.totalCount;
          this.formInline.pageSize = res.data.pageSize;
        });
      },
      getAssetTableData() {
        let vm = this;
        let param = cloneDeep(vm.formInline);
        this.getSetForm();// 获取动态列数据
        $axios.post('/basicOperation/getBasicOplist', param).then((res) => {
          this.equipmentList = res.data.pageList;
          this.formInline.totalCount = res.data.totalCount;
        });
      },
      getSearchActionDef() { // 统计
        let vm = this
        let param = cloneDeep(vm.formInline);
        switch (vm.searchFlag) {
          case 1:
            param.condition.citypeuuid = vm.currentNodeValue;
            break
        }
        $axios.post('/basicOperation/getBasicOplist', param).then((res) => {
          this.equipmentList = res.data.pageList;
          this.formInline.totalCount = res.data.totalCount;
          this.formInline.pageSize = res.data.pageSize;
        });
      },
      gotoAssetDetail(row) {
        this.$router.push(`/OperationCenter/oper_assets/${row.itcompUuid}`)
      },
      /* 页码 */
      handleSizeChange(curPageSize) {
        this.formInline.currentPage = 1;
        this.formInline.pageSize = curPageSize;
        this.getAssetTableData();
      },
      /* 分页 */
      handleCurrentChange(current) {
        if (current === this.formInline.currentPage) return;
        this.formInline.currentPage = current;
        this.getAssetTableData();
      },
      getColData() {
        $axios.get('/operationSettings/getShowOperationPage').then(response => {
          this.propList = response.data;
          this.getAssetTableData();
        });
      },
      saveSetForm(data) {
        this.setData.sysOperList = data;
        let addForm = Object.assign({}, this.setData)
        $axios.post('/operationSettings/saveSysOper', addForm, {
          logTemplate: '编辑|运维页面设置'
        }).then((res) => {
          if (res.data === 'success') {
            this.getColData();
            this.showTable = false;
            this.$nextTick(() => {
              this.showTable = true;
              this.$nextTick(() => {
                this.getSetForm();
              })
            })
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }
        });
      }
    },
    created() {
      this.getSwitch()
      this.getColData();
      this.getTreeData();
      this.getSearchOption();
    }
  }
</script>
<style lang="stylus">
  .tab-scroll-height
    max-height: calc(100vh - 150px)

  .tree-box
    height: calc(100vh - 150px)
    margin-top 10px

    .s-tree-node-content
      line-height 30px

    .tree-title
      font-size 14px
      padding 12px


</style>
