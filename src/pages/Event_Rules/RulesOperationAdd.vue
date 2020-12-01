<template>
  <div class="rules-operation-add">
    <s-steps :current="currentStep" type="arrow" :step-width="stepWidth">
      <s-step title="基本配置"></s-step>
      <s-step title="命令配置"></s-step>
      <s-step title="关联用户"></s-step>
      <s-step title="告警配置" v-if="addForm.bwType === 2"></s-step>
    </s-steps>
    <s-scrollbar v-show="currentStep === 0" wrap-class="opeMonitor" v-dialogclose="{id:'.opeMonitor'}">
      <s-form label-width="100px" :model="addForm" :rules="rules" ref="accountForm">
        <s-form-item label="名称" prop="bwName">
          <s-input v-model="addForm.bwName"></s-input>
        </s-form-item>
        <s-form-item label="类型">
          <s-select v-model="addForm.bwType" :disabled="Boolean(data)" @change="bwTypeChange">
            <s-option label="白名单" :value="1"></s-option>
            <s-option label="黑名单" :value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="描述" prop="remark">
          <s-input type="textarea" v-model="addForm.remark"></s-input>
        </s-form-item>
      </s-form>
      <div class="title">账号列表</div>
      <s-table-page
        :data="accountList"
        :show-header-checkbox="true"
        :header-search="getSearchDef()"
        v-loading='loading'
        @filter-change="handleFilterChange"
        @selection-change="handleAccountChange"
        ref="accountTable">
        <s-table-column type="selection" width="55px"></s-table-column>
        <s-table-column label="账号名称" prop="accountName" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产名称" prop="assetName" show-overflow-tooltip></s-table-column>
        <s-table-column label="IP地址" prop="assetIp" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产类型" prop="assetType" show-overflow-tooltip></s-table-column>
        <s-table-column label="厂商" prop="manufact" show-overflow-tooltip></s-table-column>
        <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产重要程度" prop="importanceStr" width="130px" :filters="importanceFilter"
                        :filtered-value="companyNameFilters" column-key="importanceStr" show-overflow-tooltip></s-table-column>
        <s-table-column label="账号类型" prop="attributeName" show-overflow-tooltip></s-table-column>
        <s-table-column label="账号角色" prop="accountRoleName" show-overflow-tooltip></s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-scrollbar v-show="currentStep === 1" wrap-style="max-height: 400px;">
      <template v-if="addForm.bwType === 1">
        <s-button @click="newCmd(0)" icon="config-commandnli" v-if="addForm.bwType === 1">命令设置</s-button>
        <s-table style="margin-top: 10px;" :data="cmdList" key="opa">
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
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-delete" @click="delCmd(scope.$index)"></i>
            </template>
          </s-table-column>
        </s-table>
      </template>
      <template v-else>
        <s-button @click="newCmd(3)" icon="alarm">命令告警</s-button>
        <s-button @click="newCmd(1)" icon="dialog">会话阻断</s-button>
        <s-button @click="newCmd(2)" icon="config-commandnli">命令阻断</s-button>
        <s-table style="margin-top: 10px;" :data="cmdList" key="opb">
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
          <s-table-column label="命令类型">
            <template slot-scope="scope">
              {{cmdArr[scope.row.cmdType]}}
            </template>
          </s-table-column>
          <s-table-column label="操作">
            <template slot-scope="scope">
              <i class="iconfont icon-delete" @click="delCmd(scope.$index)"></i>
            </template>
          </s-table-column>
        </s-table>
      </template>
    </s-scrollbar>
    <s-scrollbar v-show="currentStep === 2" wrap-style="max-height: 400px;">
      <s-table-page :data="userList" ref="userTable" @selection-change="handleUserChange" :header-search="getHeaderSearch()">
        <s-table-column type="selection" width="55px"></s-table-column>
        <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
        <s-table-column label="账号名称" prop="userLoginName"></s-table-column>
        <s-table-column label="角色" prop="roleName"></s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-scrollbar v-show="currentStep === 3" wrap-style="max-height: 400px;">
      <div class="title">动作</div>
      <s-form>
        <s-row>
          <s-col :span="8">
            <s-form-item label="事件告警">
              <s-switch v-model="eventBool"></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8">
            <!--<s-form-item label="事件流程">-->
            <!--<s-switch v-model="addForm.bwFlow" :active-value="1" :inactive-value="0"></s-switch>-->
            <!--</s-form-item>-->
          </s-col>
        </s-row>
      </s-form>
      <div class="title" v-show="eventBool">告警</div>
      <s-table :data="alarmList" @selection-change="handleAlarmChange" v-show="eventBool" ref="alarmTable">
        <s-table-column type="selection" width="55px"></s-table-column>
        <s-table-column label="名称" prop="name"></s-table-column>
        <s-table-column label="通知方式" prop="sendMode"></s-table-column>
        <s-table-column label="描述" prop="description"></s-table-column>
      </s-table>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { cloneDeep } from 'lodash';

  export default {
    components: {

    },

    props: {
      data: {
        type: Object,
        default: null
      },
      currentStep: Number
    },

    data() {
      return {
        loading: false,
        importanceFilter: [
          {text: '很高', value: 2},
          {text: '高', value: 3},
          {text: '中等', value: 4},
          {text: '低', value: 5},
          {text: '很低', value: 6}
        ],
        stepWidth: '230px',
        addForm: {
          bwName: '',
          bwType: 1,
          remark: '',
          bwFlow: 0,
          importanceList: [2, 3, 4, 5, 6],
          bwHaveAccountListList: [],
          bwHaveCommandListList: [],
          bwHaveUserListList: [],
          bwInfoSendRefList: []
        },
        rules: {
          bwName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            {max: 20, message: '最长输入20个字符', trigger: 'change'}
          ],
          remark: [
            {max: 50, message: '最长输入50个字符', trigger: 'change'}
          ]
        },
        accountList: [],
        selectedAccountList: [],
        cmdList: [],
        userList: [],
        selectedUserList: [],
        alarmList: [],
        selectedAlarmList: [],
        currentCmdMode: 1,
        cmdArr: ['', '会话阻断', '命令阻断', '命令告警'],
        eventBool: false,
        tab2Init: false,
        tab3Init: false
      }
    },

    methods: {
      handleFilterChange(filter) {
        for (let key in filter) {
          this.addForm.importanceList = filter[key]
        }
        this.loading = true
        $axios.post('/bwInfo/secondGetAccountInfoByParam', {importanceList: this.addForm.importanceList}).then(res => {
          if (res.data) {
            this.accountList = res.data
            this.loading = false
            if (this.data) {
              this.$nextTick(() => {
                this.autoSelect(this.$refs.accountTable, this.accountList, this.data.bwHaveAccountListList, 'accountUuid');
              });
            }
          }
        })
      },
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询内容',
          searchProps: ['userRealName', 'userLoginName', 'roleName']
        }
      },
      getSearchDef() {
        return {
          width: 8,
          placeholder: '请输入查询内容',
          searchProps: ['accountName', 'assetName', 'assetType', 'manufact', 'modelNumber', 'importanceStr', 'attributeName', 'accountRoleName', 'assetIp']
        }
      },
      newCmd(mode) {
        this.currentCmdMode = mode;
        this.$emit('showCmd', this.cmdList, mode);
      },
      getType(type) {
        let types = ['精确匹配', '模糊匹配', '任意匹配'];
        return types[type];
      },
      getRisk(type) {
        let types = ['未知', '正常', '提示', '警告', '次要', '主要', '严重'];
        return types[type];
      },
      delCmd(index) {
        this.cmdList.splice(index, 1);
      },
      beforeAdd() {
        this.$refs.accountForm.validate((valid) => {
          if (valid) {
            // 1.处理账号
            if (this.selectedAccountList.length === 0) {
              this.$message({type: 'error', message: '请选择账号'});
              this.$emit('setCurrentStep', 0);
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
              this.$emit('setCurrentStep', 1);
              this.addForm.bwHavaAccountListList = [];
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
              this.$emit('setCurrentStep', 2);
              this.addForm.bwHaveAccountListList = [];
              this.addForm.bwHaveCommandListList = [];
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
                this.$emit('setCurrentStep', 3);
                this.addForm.bwHaveAccountListList = [];
                this.addForm.bwHaveCommandListList = [];
                this.addForm.bwHaveUserListList = [];
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
            this.$message({type: 'error', message: '请检查数据'});
            this.$emit('setCurrentStep', 0);
            return false;
          }
        });
      },

      handleAccountChange(val) {
        this.selectedAccountList = val;
      },
      handleUserChange(val) {
        this.selectedUserList = val;
      },
      handleAlarmChange(val) {
        this.selectedAlarmList = val;
      },

      // 账号列表
      getAccountList() {
        $axios.get('/bwInfo/getAllAccountInfo').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.accountList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                this.autoSelect(this.$refs.accountTable, this.accountList, this.data.bwHaveAccountListList, 'accountUuid');
              });
            }
          }
        });
      },
      // 用户列表
      getUserList() {
        $axios.get('/bwInfo/getAllUserInfo').then((res) => {
          if (res.data && res.data instanceof Array) {
            let filterArr = cloneDeep(res.data)
            let filterArrNew = []
            filterArr.forEach(item => {
              if (item.roleUuidsStr) {
                if (item.roleUuidsStr.indexOf('tsecondroleinfo00000000000000008') !== -1 || item.roleUuidsStr.indexOf('tsecondroleinfo00000000000000009') !== -1) {
                  filterArrNew.push(item)
                }
              }
            })
            this.userList = filterArrNew;
          }
        });
      },
      // 告警列表
      getAlarmList() {
        $axios.get('/infoSend/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.alarmList = res.data;
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
        for (let i = 0; i < sel.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (sel[i][uuid] === arr[j].uuid) {
              table.toggleRowSelection(arr[j]);
              break;
            }
          }
        }
      },

      bwTypeChange(val) {
        if (val === 1) {
          this.stepWidth = '230px';
          this.$emit('typeChange', 1);
          this.addForm.bwFlow = 0;
          this.eventBool = false;
          this.addForm.bwInfoSendRefList = [];
        } else {
          this.stepWidth = '170px';
          this.$emit('typeChange', 2);
        }
      }
    },
    watch: {
      // 如果没有将表格选中放在此处，会在打开第一个tab立即关闭窗口后出现控制台异常bug
      currentStep(newVal) {
        if (newVal === 2 && this.userList.length && !this.tab2Init) {
          this.$nextTick(() => {
            let bwHaveUserListList = this.data ? this.data.bwHaveUserListList : [];
            this.autoSelect(this.$refs.userTable, this.userList, bwHaveUserListList, 'userUuid');
            this.tab2Init = true;
          });
        }
        if (newVal === 3 && this.alarmList.length && !this.tab3Init) {
          this.$nextTick(() => {
            let bwInfoSendRefList = this.data ? this.data.bwInfoSendRefList : [];
            this.autoSelect(this.$refs.alarmTable, this.alarmList, bwInfoSendRefList, 'infoSendUuid');
            this.tab3Init = true;
          });
        }
      },
      userList(newVal) {
        if (this.currentStep === 2 && !this.tab2Init) {
          this.$nextTick(() => {
            let bwHaveUserListList = this.data ? this.data.bwHaveUserListList : [];
            this.autoSelect(this.$refs.userTable, this.userList, bwHaveUserListList, 'userUuid');
            this.tab2Init = true;
          })
        }
      },
      alarmList(newVal) {
        if (this.currentStep === 3 && !this.tab3Init) {
          this.$nextTick(() => {
            let bwInfoSendRefList = this.data ? this.data.bwInfoSendRefList : [];
            this.autoSelect(this.$refs.alarmTable, this.alarmList, bwInfoSendRefList, 'infoSendUuid');
            this.tab3Init = true;
          })
        }
      }
    },
    computed: {
      companyNameFilters() {
        if (this.data) {
          return this.data.importanceList || []
        } else {
          return [2, 3, 4, 5, 6]
        }
      }
    },
    created() {
      this.getUserList();
      this.getAlarmList();
      if (this.data) {
        this.getCmdList();
        this.addForm.uuid = this.data.uuid;
        this.addForm.bwName = this.data.bwName;
        this.addForm.bwType = this.data.bwType;
        this.bwTypeChange(this.data.bwType);
        this.addForm.remark = this.data.remark;
        if (this.data.bwFlow) {
          this.addForm.bwFlow = 1;
        }
        if (this.data.bwInfoSendRefList.length > 0) {
          this.eventBool = true;
        }
        let arr = this.data.importanceList ? this.data.importanceList : []
        this.handleFilterChange({importanceStr: arr})
      } else {
        this.getAccountList();
      }
    }
  }
</script>

<style>
  .rules-operation-add .s-steps {
    margin-bottom: 20px;
  }
  .opeMonitor {
    max-height: 400px;
  }
</style>
