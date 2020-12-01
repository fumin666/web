<template>
  <div class="rules-operation-view">
    <s-tab :animated="false" v-model="activeTab">
      <s-tab-pane label="基本配置" name="account">
        <s-scrollbar wrap-style="max-height: 600px;">
          <s-form label-width="100px" :model="addForm" ref="accountForm">
            <s-form-item label="名称">
              <s-input v-model="addForm.bwName" disabled></s-input>
            </s-form-item>
            <s-form-item label="类型">
              <s-select v-model="addForm.bwType" disabled>
                <s-option label="白名单" :value="1"></s-option>
                <s-option label="黑名单" :value="2"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="描述">
              <s-input type="textarea" v-model="addForm.remark" disabled></s-input>
            </s-form-item>
          </s-form>
          <div class="title">账号列表</div>
          <s-table-page
            :data="selectedAccountList"
            :header-search="getSearchDef()"
            ref="accountTable">
            <s-table-column label="账号名称" prop="accountName" show-overflow-tooltip></s-table-column>
            <s-table-column label="资产名称" prop="assetName" show-overflow-tooltip></s-table-column>
            <s-table-column label="IP地址" prop="assetIp" show-overflow-tooltip></s-table-column>
            <s-table-column label="资产类型" prop="assetType" show-overflow-tooltip></s-table-column>
            <s-table-column label="厂商" prop="manufact" show-overflow-tooltip></s-table-column>
            <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
            <s-table-column label="资产重要程度" prop="importanceStr" show-overflow-tooltip></s-table-column>
            <s-table-column label="账号类型" prop="attributeName" show-overflow-tooltip></s-table-column>
            <s-table-column label="账号角色" prop="accountRoleName" show-overflow-tooltip></s-table-column>
          </s-table-page>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="命令配置" name="cmd">
        <s-scrollbar wrap-style="max-height: 600px;">
          <s-table style="margin-top: 10px;" :data="cmdList">
            <s-table-column label="名称" prop="commandName" show-overflow-tooltip></s-table-column>
            <s-table-column label="参数" prop="commandPara" show-overflow-tooltip></s-table-column>
            <s-table-column label="匹配类型">
              <template slot-scope="scope">
                <span v-text="getType(scope.row.type)"></span>
              </template>
            </s-table-column>
            <s-table-column label="事件级别">
              <template slot-scope="scope">
                <span v-text="getRisk(scope.row.commandRisk)"></span>
              </template>
            </s-table-column>
            <s-table-column label="命令类型" v-if="data.bwType === 2">
              <template slot-scope="scope">
                {{cmdArr[scope.row.cmdType]}}
              </template>
            </s-table-column>
          </s-table>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="关联用户" name="user">
        <s-scrollbar wrap-style="max-height: 600px;">
          <s-table :data="selectedUserList" ref="userTable">
            <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
            <s-table-column label="账号名称" prop="userLoginName"></s-table-column>
            <s-table-column label="角色" prop="roleName"></s-table-column>
          </s-table>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="告警配置" name="alarm" :vif="data.bwType === 2">
        <s-scrollbar wrap-style="max-height: 600px;">
          <div class="title">动作</div>
          <s-form>
            <s-row>
              <s-col :span="8">
                <s-form-item label="事件告警">
                  <s-switch v-model="eventBool" disabled></s-switch>
                </s-form-item>
              </s-col>
              <s-col :span="8">
                <!--<s-form-item label="事件流程">-->
                <!--<s-switch v-model="addForm.bwFlow" :active-value="1" :inactive-value="0" disabled></s-switch>-->
                <!--</s-form-item>-->
              </s-col>
            </s-row>
          </s-form>
          <div class="title" v-show="eventBool">告警</div>
          <s-table :data="selectedAlarmList" v-show="eventBool" ref="alarmTable">
            <s-table-column label="名称" prop="name"></s-table-column>
            <s-table-column label="通知方式" prop="sendMode"></s-table-column>
            <s-table-column label="描述" prop="description"></s-table-column>
          </s-table>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    components: {

    },

    props: {
      data: Object
    },

    data() {
      return {
        addForm: {
          bwName: '',
          bwType: 1,
          remark: '',
          bwFlow: 0,

          bwHaveAccountListList: [],
          bwHaveCommandListList: [],
          bwHaveUserListList: [],
          bwInfoSendRefList: []
        },
        activeTab: '',
        accountList: [],
        selectedAccountList: [],
        cmdList: [],
        userList: [],
        selectedUserList: [],
        alarmList: [],
        selectedAlarmList: [],
        currentCmdMode: 1,
        cmdArr: ['', '会话阻断', '命令阻断', '命令告警'],
        eventBool: false
      }
    },

    methods: {
      getSearchDef() {
        return {
          show: false
        }
      },
      getType(type) {
        let types = ['精确匹配', '模糊匹配', '任意匹配'];
        return types[type];
      },
      getRisk(type) {
        let types = ['未知', '正常', '提示', '警告', '次要', '主要', '严重'];
        return types[type];
      },
      beforeAdd() {
        this.$refs.accountForm.validate((valid) => {
          if (valid) {
            // 1.处理账号
            if (this.selectedAccountList.length === 0) {
              this.$message({type: 'error', message: '请选择账号'});
              this.activeTab = 'account';
              return false;
            } else {
              for (let i = 0; i < this.selectedAccountList.length; i++) {
                this.addForm.bwHaveAccountListList.push({
                  accountUuid: this.selectedAccountList[i].uuid
                });
              }
            }
            // 2.处理命令
            if (this.cmdList.length === 0) {
              this.$message({type: 'error', message: '请配置命令'});
              this.activeTab = 'cmd';
              return false;
            } else {
              for (let i = 0; i < this.cmdList.length; i++) {
                this.addForm.bwHaveCommandListList.push({
                  commandUuid: this.cmdList[i].uuid,
                  type: this.cmdList[i].cmdType
                });
              }
            }
            // 3.处理用户
            if (this.selectedUserList.length === 0) {
              this.$message({type: 'error', message: '请选择用户'});
              this.activeTab = 'user';
              return false;
            } else {
              for (let i = 0; i < this.selectedUserList.length; i++) {
                this.addForm.bwHaveUserListList.push({userUuid: this.selectedUserList[i].uuid});
              }
            }
            // 4.处理告警
            if (this.eventBool) {
              if (this.selectedAlarmList.length === 0) {
                this.$message({type: 'error', message: '请选择告警'});
                this.activeTab = 'alarm';
                return false;
              } else {
                for (let i = 0; i < this.selectedAlarmList.length; i++) {
                  this.addForm.bwInfoSendRefList.push({infoSendUuid: this.selectedAlarmList[i].uuid});
                }
              }
            }
            if (this.data) {
              this.$emit('modifyOk', this.addForm);
            } else {
              this.$emit('ok', this.addForm);
            }
          } else {
            this.$message({type: 'error', message: '请输入名称'});
            this.activeTab = 'account';
            return false;
          }
        });
      },

      // 账号列表
      getAccountList() {
        $axios.get('/bwInfo/getAllAccountInfo').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.accountList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                this.selectedAccountList = this.autoSelect(this.$refs.accountTable, this.accountList, this.data.bwHaveAccountListList, 'accountUuid');
              });
            }
          }
        });
      },
      // 用户列表
      getUserList() {
        $axios.get('/bwInfo/getAllUserInfo').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.userList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                this.selectedUserList = this.autoSelect(this.$refs.userTable, this.userList, this.data.bwHaveUserListList, 'userUuid');
              });
            }
          }
        });
      },
      // 告警列表
      getAlarmList() {
        $axios.get('/infoSend/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.alarmList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                this.selectedAlarmList = this.autoSelect(this.$refs.alarmTable, this.alarmList, this.data.bwInfoSendRefList, 'infoSendUuid');
              });
            }
          }
        });
      },
      // 命令列表
      getCmdList() {
        $axios.get('/commandInfo/commandInfoList').then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < this.data.bwHaveCommandListList.length; i++) {
              for (let j = 0; j < res.data.length; j++) {
                if (this.data.bwHaveCommandListList[i].commandUuid === res.data[j].uuid) {
                  res.data[j].cmdType = this.data.bwHaveCommandListList[i].type;
                  this.cmdList.push(res.data[j]);
                  break;
                }
              }
            }
          }
        });
      },

      autoSelect(table, arr, sel, uuid) {
        let res = [];
        for (let i = 0; i < sel.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (sel[i][uuid] === arr[j].uuid) {
              res.push(arr[j]);
              break;
            }
          }
        }
        return res;
      }
    },

    created() {
      this.getAccountList();
      this.getUserList();
      this.getAlarmList();
      this.getCmdList();
      this.addForm.uuid = this.data.uuid;
      this.addForm.bwName = this.data.bwName;
      this.addForm.bwType = this.data.bwType;
      this.addForm.remark = this.data.remark;
      if (this.data.bwInfoSendRefList.length > 0) {
        this.eventBool = true;
      }
      if (this.data.bwFlow) {
        this.addForm.bwFlow = 1;
      }
    }
  }
</script>
