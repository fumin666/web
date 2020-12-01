<!--
 * @Author: songyf
 * @Date: 2020-7-20
 * @LastEditors: LaMando
 * @Description: 账号管理-授权策略管理-授权协议与账号
 -->
<template>
  <s-dialog v-model="dialogFlag" title="授权协议与账号" width="950px" append-to-body>
    <s-scrollbar wrap-class="default-dialog-scroll">
      <section>
        <!--树形表格-->
        <div class="auth-tree">
          <auth-table-tree
            v-loading="loading"
            ref="AuthTableTree"
            style="width: 100%"
            :data="tree.data"
            :config="tree.configDetailed"
            :treeIndex="1"
            :selections="assetsSelections"
            @selection-change="assetsSelectHandle"
            :treeCheck="true">
            <div class="input-search" slot="rightBtn">
              <s-input v-model="assetsSearchKey" @keyup.enter.native="getAuthAssetsDetailList"
                       placeholder="请输入账号" class="real-search-input"></s-input>
              <i class="iconfont icon-magnifier search-btn" @click="getAuthAssetsDetailList"></i>
            </div>
            <div class="auth-detail" slot="allSet" style="margin: 8px 0">
              <s-row class="updown">
                <s-col span="3">
                  <s-checkbox v-model="updown.all">全局</s-checkbox>
                </s-col>
                <s-col span="4">
                  <s-checkbox v-model="updown.cutup" :disabled="!updown.all">剪贴板上行</s-checkbox>
                </s-col>
                <s-col span="4">
                  <s-checkbox v-model="updown.cutdown" :disabled="!updown.all">剪贴板下行</s-checkbox>
                </s-col>
                <s-col span="4">
                  <s-checkbox v-model="updown.diskup" :disabled="!updown.all">磁盘映射上行</s-checkbox>
                </s-col>
                <s-col span="4">
                  <s-checkbox v-model="updown.diskdown" :disabled="!updown.all">磁盘映射下行</s-checkbox>
                </s-col>
              </s-row>
            </div>
            <s-table-column
              label="操作"
              width="90">
              <template slot-scope="scope">
                <i class="iconfont icon-association"
                   @click="associatedBtn(scope.row)"
                   v-if="qqArr.indexOf(scope.row.protocolUuid) > -1 && scope.row.accountName"
                   title="关联实例">
                </i>
                <i class="iconfont icon-set"
                   @click="seniorSetBtn(scope.row)"
                   v-if="scope.row.protocolUuid === '00000000000000000000000000000077' || (scope.row.protocolClass === 2 && scope.row.protocoltype === 1)"
                   title="剪贴板/磁盘映射">
                </i>
              </template>
            </s-table-column>
          </auth-table-tree>
        </div>
        <!--资产组织机构剪贴板上下行-->
        <s-dialog
          v-model="bloomDeviceOrgUpDown"
          v-if="bloomDeviceOrgUpDown"
          append-to-body
          title="剪贴板/磁盘映射">
          <device-up-down ref="deviceOrgUpDown" :data="dbData" :rowData="rowData"></device-up-down>
          <template slot="footer" class="dialog-footer">
            <s-button @click="saveDeviceOrgUpDown">保存</s-button>
            <s-button type="cancel" @click="bloomDeviceOrgUpDown = false">取消</s-button>
          </template>
        </s-dialog>
        <!--数据库实例-->
        <s-dialog
          v-model="bloomDb"
          v-if="bloomDb"
          append-to-body
          title="关联实例">
          <db-dialog :data="dbData" ref="addDb" :rowData="rowData"></db-dialog>
          <template slot="footer" class="dialog-footer">
            <s-button @click="addDbOk">保存</s-button>
            <s-button type="cancel" @click="bloomDb = false">取消</s-button>
          </template>
        </s-dialog>
      </section>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveAuthProAccount">保存</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import authTableTree from '@/components/tableCom/src/AuthTableTree';
  import $axios from 'sunflower-ajax';
  import DeviceUpDown from '../DeviceUpDown'
  import DbDialog from '../Db'

  const detailColumn = [
    {
      title: '资产名称',
      property: 'itcompName',
      width: 180
    },
    {
      title: 'ip地址',
      property: 'controlAdderss',
      width: 130
    },
    {
      title: '资产类型',
      property: 'citypeName'
    },
    {
      title: '型号',
      property: 'modelNumber'
    },
    {
      title: '运维责任组',
      property: 'groupName'
    },
    {
      title: '协议',
      property: 'protocolName'
    },
    {
      title: '端口',
      property: 'port'
    }
  ];
  const columnArr = [
    {
      title: '账号名称',
      property: 'accountName'
    },
    {
      title: '账号角色',
      property: 'accountRole'
    }
  ];
  export default {
    components: {
      authTableTree,
      DeviceUpDown,
      DbDialog
    },
    data() {
      return {
        dialogFlag: false,
        loading: false,
        updown: {
          all: false,
          cutup: false,
          cutdown: false,
          diskup: false,
          diskdown: false
        },
        bloomDeviceOrgUpDown: false, // 高级设置
        updownObj: null,
        bloomDb: false,
        dbData: null,
        rowData: null,
        assetsSelections: [],
        assetsBatchUuids: [],
        assetsSearchKey: '',
        tree: {
          data: [],
          configDetailed: []
        },
        qqArr: [
          '00000000000000000000000000000114', // plsql
          '00000000000000000000000000000120', // toadoracle
          '00000000000000000000000000000080',  // ORACLE
          '00000000000000000000000000000113' // mssqlserver
        ]
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      conditionObj: {
        type: Object,
        require: true,
        default: null
      },
      authSeniorObj: {
        type: Object,
        require: true,
        default: null
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      'authSeniorObj.pwdCon': {
        handler(val) {
        }
      }
    },
    created() {
      this.tree.configDetailed = detailColumn
      this.getListSelected();
    },
    methods: {
      /* 细粒度资产授权 */
      getAuthAssetsDetailList() {
        if (this.authSeniorObj.pwdCon === 1) { // 密钥会同开启关闭展示字段不同 （flag === 1）开启
          this.tree.configDetailed = [...detailColumn]
        } else {
          this.tree.configDetailed = [...detailColumn, ...columnArr]
        }
        let params = {
          uniqueUuid: this.conditionObj.uniqueUuid,
          type: this.conditionObj.type,
          secondType: this.conditionObj.secondType,
          content: this.assetsSearchKey,
          authUuid: this.conditionObj.authUuid,
          tempUuid: this.conditionObj.tempUuid
        };
        let vm = this;
        vm.loading = true
        $axios.post('/operationAuth/getAuthDeviceDetailInfo', params).then(({data}) => {
          if (data) {
            vm.tree.data = [data];
          } else {
            vm.tree.data = []
          }
          vm.loading = false
        });
      },
      getListSelected() { // 获取选中的data
        let vm = this;
        $axios.post('/operationAuth/getAuthedDeviceInfo', {
          authUuid: this.conditionObj.authUuid,
          tempUuid: this.conditionObj.tempUuid,
          itcompUuid: this.conditionObj.uniqueUuid,
          type: this.conditionObj.type,
          secondType: this.conditionObj.secondType
        }).then(({data}) => {
          if (data.length) {
            vm.assetsSelections = data
          }
          this.getAuthAssetsDetailList();
        });
      },
      assetsSelectHandle(val) { // 选择的数据
        this.assetsSelections = val;
      },
      seniorSetBtn(row) { // 高级设置弹窗
        this.dbData = {
          portUuid: row.portUuid,
          uuid: row.uuid,
          authUuid: this.conditionObj.authUuid,
          tempUuid: this.conditionObj.tempUuid
        };
        this.rowData = row;
        this.bloomDeviceOrgUpDown = true;
      },
      saveDeviceOrgUpDown() {
        let vm = this;
        let saveData = vm.$refs['deviceOrgUpDown'].deviceForm;
        let params = {
          type: vm.conditionObj.type,
          secondType: vm.conditionObj.secondType,
          authUuid: vm.conditionObj.authUuid,
          tempUuid: vm.conditionObj.tempUuid,
          uniqueUuid: vm.dbData.uuid,
          clipboardUp: saveData.clipboardUp,
          clipboardDown: saveData.clipboardDown,
          diskMappingUp: saveData.diskMappingUp,
          diskMappingDown: saveData.diskMappingDown,
          updateType: 1
        };
        $axios.post('/operationAuth/saveOtherProperty', params).then(({data}) => {
          if (data.state) {
            if (!vm.rowData.authDeviceObj) {
              vm.rowData.authDeviceObj = {};
            }
            vm.rowData.authDeviceObj.clipboardUp = saveData.clipboardUp;
            vm.rowData.authDeviceObj.clipboardDown = saveData.clipboardDown;
            vm.rowData.authDeviceObj.diskMappingUp = saveData.diskMappingUp;
            vm.rowData.authDeviceObj.diskMappingDown = saveData.diskMappingDown;
            vm.$message({type: 'success', message: data.errormsg});
            vm.bloomDeviceOrgUpDown = false;
          } else {
            vm.$message({type: 'error', message: data.errormsg});
          }
        });
      },
      associatedBtn(row) {
        this.dbData = {
          portUuid: row.portUuid,
          uuid: row.uuid,
          authUuid: this.conditionObj.authUuid,
          tempUuid: this.conditionObj.tempUuid
        };
        this.rowData = row;
        this.bloomDb = true;
      },
      addDbOk() {
        let vm = this;
        let tmp = vm.$refs.addDb;
        let dataParams = {
          authUuid: vm.conditionObj.authUuid,
          tempUuid: vm.conditionObj.tempUuid,
          uniqueUuid: vm.dbData.uuid,
          dbnameList: [],
          updateType: 2
        };
        for (let i = 0; i < tmp.selectedDb.length; i++) {
          dataParams.dbnameList.push(tmp.selectedDb[i]);
        }
        $axios.post('/operationAuth/saveOtherProperty', dataParams).then((res) => {
          if (res.data.state) {
            if (!vm.rowData.dbnameList) {
              vm.rowData.dbnameList = [];
            }
            vm.rowData.dbnameList = dataParams.dbnameList;
            vm.$message({type: 'success', message: res.data.errormsg});
            vm.bloomDb = false;
          } else {
            vm.$message({type: 'error', message: res.data.errormsg});
          }
        });
      },
      saveAuthProAccount() { // 保存协议与账号
        let deviceTempList = [] // 选中的资产信息
        this.assetsSelections.forEach(v => {
          deviceTempList.push({
            uniqueUuid: v.uuid,
            itcompUuid: v.itcompUuid,
            portUuid: v.portUuid,
            accountUuid: v.accountUuid,
            protocolUuid: v.protocolUuid
          })
        })
        let operationGlobalSettings = null // 全局设置
        if (this.updown.all) {
          operationGlobalSettings = {
            clipboardUp: this.updown.cutup ? 1 : 0,
            clipboardDown: this.updown.cutdown ? 1 : 0,
            diskMappingUp: this.updown.diskup ? 1 : 0,
            diskMappingDown: this.updown.diskdown ? 1 : 0
          };
        }
        let params = {
          authUuid: this.conditionObj.authUuid,
          tempUuid: this.conditionObj.tempUuid,
          itcompUuid: this.conditionObj.uniqueUuid,
          deviceTempList: deviceTempList,
          operationGlobalSettings: operationGlobalSettings
        }
        $axios.post('operationAuth/tempSaveAuthDevice', params).then((res) => {
          if (res.data.state) {
            this.dialogFlag = false;
            this.$emit('updataAssets')
            this.$message({type: 'success', message: res.data.errormsg});
          } else {
            this.$message({type: 'error', message: res.data.errormsg});
          }
        });
      }
    }
  }
</script>
