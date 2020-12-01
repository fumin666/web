/**
* @author fumin
* @date 2019/7/18
* @Description: 事件中心 -> 规则配置 -> 运维审计规则 -> 查看
*/
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
                <s-option label="登录重要资产" :value="3"></s-option>
              </s-select>
            </s-form-item>
            <s-form-item label="描述">
              <s-input type="textarea" v-model="addForm.remark" disabled></s-input>
            </s-form-item>
          </s-form>
          <div class="title">资产列表</div>
          <s-table-page
            :data="selectedAccountList"
            :header-search="getSearchDef()"
            ref="accountTable">
            <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
            <s-table-column label="IP地址" prop="controlAdderss" show-overflow-tooltip></s-table-column>
            <s-table-column label="资产类型" prop="citypeName" show-overflow-tooltip></s-table-column>
            <s-table-column label="厂商" prop="manufactKeyName" show-overflow-tooltip></s-table-column>
            <s-table-column label="型号" prop="productKeyName" show-overflow-tooltip></s-table-column>
            <s-table-column label="资产重要程度" prop="importantStr" show-overflow-tooltip></s-table-column>
          </s-table-page>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="告警配置" name="alarm" :vif="data.bwType === 3">
        <s-scrollbar wrap-style="max-height: 600px;">
          <div class="title">动作</div>
          <s-form>
            <s-row>
              <s-col :span="8">
                <s-form-item label="事件告警">
                  <s-switch v-model="eventBool" disabled></s-switch>
                </s-form-item>
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
  // import $axios from 'sunflower-ajax'
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
        userList: [],
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
          // show: false,
          width: 8,
          offset: 16,
          placeholder: '请输入查询内容',
          searchProps: ['itcompName', 'controlAdderss', 'manufactKeyName', 'importantStr', 'citypeName', 'productKeyName']
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
            // 4.处理告警
            if (this.eventBool) {
              if (this.selectedAlarmList.length === 0) {
                this.$message({icon: 'error', message: '请选择告警'});
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
            this.$message({icon: 'error', message: '请输入名称'});
            this.activeTab = 'account';
            return false;
          }
        });
      }
    },

    created() {
      this.selectedAccountList = this.data.majorAssetList
      this.selectedAlarmList = this.data.infoSendList
      this.addForm.uuid = this.data.uuid;
      this.addForm.bwName = this.data.bwName;
      this.addForm.bwType = this.data.bwType;
      this.addForm.remark = this.data.remark;
      if (this.data.infoSendList.length > 0) {
        this.eventBool = true;
      }
      if (this.data.bwFlow) {
        this.addForm.bwFlow = 1;
      }
    }
  }
</script>
