<template>
  <s-tab :animated="false" v-model="activeTab">
    <s-tab-pane label="基本配置" name="paneA">
      <s-scrollbar wrap-style="max-height: 600px;">
        <s-form
          :model="addForm"
          ref="rulesAppAddForm"
          label-width="140px">
          <s-form-item label="名称">
            <s-input v-model="addForm.name" disabled></s-input>
          </s-form-item>
          <s-form-item label="是否启用规则">
            <s-switch v-model="addForm.isEnabled" :active-value="1" :inactive-value="0" disabled></s-switch>
          </s-form-item>
          <s-form-item label="置为模板">
            <s-switch v-model="addForm.isTemplate" :active-value="1" :inactive-value="0" disabled></s-switch>
          </s-form-item>
          <s-form-item label="事件级别">
            <s-select v-model="addForm.eventLevel" disabled>
              <s-option v-for="item in level" :label="item.label" :value="item.value" key="item.value"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="描述">
            <s-input type="textarea" v-model="addForm.remarks" disabled></s-input>
          </s-form-item>
        </s-form>
        <div class="title">应用系统</div>
        <s-table-page
          :data="myAppList"
          :header-search="getSearchDef()"
          key="rulesAppAddA">
          <s-table-column label="资产名称" prop="itcompName"></s-table-column>
          <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
          <s-table-column label="资产类型" prop="citypeName"></s-table-column>
          <s-table-column label="厂商" prop="manufactCaption" show-overflow-tooltip></s-table-column>
          <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产重要程度" prop="importantStr" show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="规则配置" name="paneB">
      <s-scrollbar wrap-style="max-height: 600px;">
        <s-table :data="addForm.auditPolicyRuleList">
          <s-table-column label="逻辑" width="100px">
            <template slot-scope="scope">
              <s-select v-model="scope.row.relation" v-if="scope.$index > 0">
                <s-option label="且" :value="1"></s-option>
                <s-option label="或" :value="2"></s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column label="规则类型" prop="type" show-overflow-tooltip width="150px">
            <template slot-scope="scope">
              <span v-text="getType(scope.row.type)"></span>
            </template>
          </s-table-column>
          <s-table-column label="值" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-text="getValue(scope.row)"></span>
            </template>
          </s-table-column>
        </s-table>
        <div class="title">事件格式</div>
        <s-input type="textarea" v-model="addForm.ruleDesc" disabled></s-input>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="审计时间" name="paneC">
      <s-form
        :model="addForm"
        label-width="100px">
        <s-form-item label="日期">
          <s-col :span="10">
            <s-date-picker v-model="startDate" type="date" placeholder="请选择开始日期" style="width: 100%" disabled></s-date-picker>
          </s-col>
          <s-col :span="4" style="text-align: center">-</s-col>
          <s-col :span="10">
            <s-date-picker v-model="endDate" type="date" placeholder="请选择结束日期" style="width: 100%" disabled></s-date-picker>
          </s-col>
        </s-form-item>
        <s-form-item label="星期">
          <s-select v-model="week" multiple placeholder="请选择" disabled>
            <s-option v-for="item in weeks" :label="item.label" :value="item.value" key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="时间">
          <s-col :span="10">
            <s-time-picker v-model="startTime" placeholder="请选择开始时间" style="width: 100%" disabled></s-time-picker>
          </s-col>
          <s-col :span="4" style="text-align: center">-</s-col>
          <s-col :span="10">
            <s-time-picker v-model="endTime" placeholder="请选择结束时间" style="width: 100%" disabled></s-time-picker>
          </s-col>
        </s-form-item>
      </s-form>
    </s-tab-pane>
    <s-tab-pane label="告警配置" name="paneD">
      <s-form
        :data="addForm"
        label-width="100px">
        <s-row>
          <s-col :span="8">
            <s-form-item label="免审计">
              <s-switch v-model="tmp" :inactive-value="0" :active-value="1" @change="handletmpChange" disabled></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8" v-show="isShow">
            <s-form-item label="审计">
              <s-switch v-model="qqxia" :inactive-value="0" :active-value="1" @change="handleQqxiaChange" disabled></s-switch>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row v-show="isShow && qqxia">
          <s-col :span="8">
            <s-form-item label="告警标志">
              <s-switch v-model="addForm.isCreateAlarm" :inactive-value="0" :active-value="1" disabled></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8">
            <s-form-item label="事件告警">
              <s-switch v-model="addForm.isCreateEvent" :inactive-value="0" :active-value="1" disabled></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8">
            <!--<s-form-item label="流程标志">-->
              <!--<s-switch v-model="addForm.isTriggerFlow" :inactive-value="0" :active-value="1" disabled></s-switch>-->
            <!--</s-form-item>-->
          </s-col>
        </s-row>
      </s-form>
      <s-scrollbar wrap-style="max-height: 500px;">
        <s-table
          v-show="isShow && qqxia && addForm.isCreateEvent"
          :data="myAlarmList">
          <s-table-column label="名称" prop="name"></s-table-column>
          <s-table-column label="通知方式" prop="sendMode"></s-table-column>
          <s-table-column label="描述" prop="description"></s-table-column>
        </s-table>
      </s-scrollbar>
    </s-tab-pane>
  </s-tab>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import {numTransToString} from 'sunflower-common-utils'

  export default {
    components: {

    },

    props: {
      data: Object
    },

    data() {
      return {
        activeTab: 'paneA',
        addForm: this.data,
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        level: [
          {label: '未知', value: 0},
          {label: '正常', value: 1},
          {label: '提示', value: 2},
          {label: '警告', value: 3},
          {label: '次要', value: 4},
          {label: '主要', value: 5},
          {label: '严重', value: 6}
        ],
        weeks: [
          {label: '周一', value: 0},
          {label: '周二', value: 1},
          {label: '周三', value: 2},
          {label: '周四', value: 3},
          {label: '周五', value: 4},
          {label: '周六', value: 5},
          {label: '周天', value: 6}
        ],
        week: [],
        appList: [],
        myAppList: [],
        alarmList: [],
        myAlarmList: [],
        selectedAlarmList: [],
        tmp: 0,
        qqxia: 0,
        isShow: true,
        compareArr: [],
        logicArr: [],
        typeArr: [],
        relationArr: ['', '且', '或']
      }
    },
    methods: {
      getSearchDef() {
        return {
          show: false
        }
      },
      getWeek(val) {
        if (val.length > 0) {
          this.addForm.daysOfWeekBinary = this.week.toString().replace(/,/g, '');
        } else {
          this.addForm.daysOfWeekBinary = [];
        }
      },
      getAlarmList() {
        $axios.get('/infoSend/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.alarmList = res.data;
            for (let i = 0; i < this.data.auditPolicyInfoSendList.length; i++) {
              for (let j = 0; j < this.alarmList.length; j++) {
                if (this.data.auditPolicyInfoSendList[i].infoSendUuid === this.alarmList[j].uuid) {
                  this.myAlarmList.push(this.alarmList[j]);
                  break;
                }
              }
            }
          }
        });
      },
      getAppList() {
        $axios.post('/auditPolicyRule/getAppWithoutDbByImportance', {importanceList: this.data.importanceList}).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.appList = res.data;
            /* for (let i = 0; i < this.data.auditPolicyObjectList.length; i++) {
              for (let j = 0; j < this.appList.length; j++) {
                if (this.data.auditPolicyObjectList[i].objectUuid === this.appList[j].uuid) {
                  this.myAppList.push(this.appList[j]);
                  break;
                }
              }
            } */
            /**
             * 根据是否"置为模板"处理"应用系统"列表展示的项目
             * 是： 过滤掉auditPolicyObjectList字段现有项目，展示其余项
             * 否： 直接展示auditPolicyObjectList字段项目
             */
            if (this.data.isTemplate === 1) {
              let restAll = [];
              for (let i = 0, length1 = this.appList.length; i < length1; i++) {
                let flag = true;
                for (let j = 0, length2 = this.data.auditPolicyObjectList.length; j < length2; j++) {
                  if (this.appList[i].uuid === this.data.auditPolicyObjectList[j].objectUuid && this.data.importance.indexOf(this.appList[i]['important'] !== -1))flag = false;
                }
                if (flag)restAll.push(this.appList[i]);
              }
              this.myAppList = restAll;
            } else {
              // this.myAppList = res.data.auditPolicyObjectList;
              let targetArr = []
              for (let i = 0, length1 = this.appList.length; i < length1; i++) {
                for (let j = 0, length2 = this.data.auditPolicyObjectList.length; j < length2; j++) {
                  if (this.appList[i].uuid === this.data.auditPolicyObjectList[j].objectUuid && this.data.importance.indexOf(this.appList[i]['important'] !== -1)) {
                    targetArr.push(this.appList[i])
                  }
                }
              }
              this.myAppList = targetArr
            }
          }
        });
      },
      showRuleNew() {
        this.$emit('showRuleNew');
      },
      handletmpChange(val) {
        if (val) {
          this.addForm.isAuditSql = 0;
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      },
      handleQqxiaChange(val) {
        if (val) {
          this.addForm.isAuditSql = 1;
        } else {
          this.addForm.isAuditSql = null;
        }
      },
      getValue(row) {
        let str = '';
        for (let i = 0; i < row.auditPolicyRuleItemList.length; i++) {
          let tmp = row.auditPolicyRuleItemList[i];
          str += (numTransToString(this.logicArr, tmp.relation) + numTransToString(this.compareArr, tmp.compare) + tmp.value1);
          if (tmp.value2) {
            str += ('-' + tmp.value2);
          }
        }
        row._val = str;
        return str;
      },
      getType(typeId) {
        return numTransToString(this.typeArr, typeId);
      },

      getCompareType() {
        $axios.get('/auditPolicyRule/getAllCompareType').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.compareArr = res.data;
            this.getLogicType();
          }
        });
      },
      getLogicType() {
        $axios.get('/auditPolicyRule/getAllLogicType').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.logicArr = res.data;
            this.getTypeOption();
          }
        });
      },
      getTypeOption() {
        $axios.get('/auditPolicyRule/getAuditPolicyTypeByUsed/2').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.typeArr = res.data;
          }
        });
      }
    },
    created() {
      this.getAppList();
      this.getAlarmList();
      this.getCompareType();
      if (this.data.isAuditSql) {
        this.tmp = 0;
        this.qqxia = 1;
      } else {
        this.tmp = 1;
        this.qqxia = 0;
      }
      if (this.data.startDate) {
        this.startDate = new Date(this.data.startDate);
      }
      if (this.data.endDate) {
        this.endDate = new Date(this.data.endDate);
      }
      if (this.data.daysOfWeek > 0) {
        let weekArr = [];
        let arr = this.data.daysOfWeekBinary.split('');
        let len = arr.length;
        for (let i = 0; i < 7 - len; i++) {
          arr.unshift('0');
        }
        for (let i = 0; i < 7; i++) {
          if (arr[i] === '1') {
            weekArr.push(i);
          }
        }
        this.week = weekArr;
      }
      if (this.data.startTime) {
        this.startTime = new Date(2017, 1, 1, this.data.startTime.substr(0, 2), this.data.startTime.substr(3, 2), this.data.startTime.substr(6));
      }
      if (this.data.endTime) {
        this.endTime = new Date(2017, 1, 1, this.data.endTime.substr(0, 2), this.data.endTime.substr(3, 2), this.data.endTime.substr(6));
      }
    }
  }
</script>
