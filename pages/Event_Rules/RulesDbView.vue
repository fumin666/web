<template>
  <s-tab :animated="false" v-model="activeTab">
    <s-tab-pane label="基本配置" name="paneA">
      <s-scrollbar wrap-style="max-height: 600px;">
        <s-form
          :model="addForm"
          :rules="rules"
          ref="rulesDbAddForm"
          label-width="140px">
          <s-form-item label="名称" prop="name">
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
        <div class="title">监控资产</div>
        <s-table-page
          :data="myDbList"
          :header-search="getSearchDef()"
          ref="rulesDbAddA">
          <s-table-column label="资产名称" prop="dbiName"></s-table-column>
          <s-table-column label="IP地址" prop="dbiIp"></s-table-column>
          <s-table-column label="资产类型" prop="protocolName"></s-table-column>
          <s-table-column label="厂商" prop="manufactName" show-overflow-tooltip></s-table-column>
          <s-table-column label="型号" prop="modelNumberName" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产重要程度" prop="importance" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.importance === 2">很高</span>
              <span v-if="scope.row.importance === 3">高</span>
              <span v-if="scope.row.importance === 4">中等</span>
              <span v-if="scope.row.importance === 5">低</span>
              <span v-if="scope.row.importance === 6">很低</span>
            </template>
          </s-table-column>
          <s-table-column label="协议" prop="protocolName"></s-table-column>
          <s-table-column label="端口" prop="dbiPort"></s-table-column>
        </s-table-page>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="规则配置" name="paneB">
      <s-scrollbar wrap-style="max-height: 600px;">
        <s-table :data="addForm.auditPolicyRuleList">
          <s-table-column label="逻辑" width="100px">
            <template slot-scope="scope">
              <s-select v-model="scope.row.relation" v-if="scope.$index > 0" disabled>
                <s-option label="且" :value="1"></s-option>
                <s-option label="或" :value="2"></s-option>
              </s-select>
            </template>
          </s-table-column>
          <s-table-column label="规则类型" show-overflow-tooltip width="150px">
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
            <s-date-picker v-model="startDate" type="date" placeholder="请选择开始日期" @change="getStartDate" style="width: 100%" disabled></s-date-picker>
          </s-col>
          <s-col :span="4" style="text-align: center">-</s-col>
          <s-col :span="10">
            <s-date-picker v-model="endDate" type="date" placeholder="请选择结束日期" @change="getEndDate" style="width: 100%" disabled></s-date-picker>
          </s-col>
        </s-form-item>
        <s-form-item label="星期">
          <s-select v-model="week" multiple placeholder="请选择" @change="getWeek" disabled>
            <s-option v-for="item in weeks" :label="item.label" :value="item.value" key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="时间">
          <s-col :span="10">
            <s-time-picker v-model="startTime" placeholder="请选择开始时间" @change="getStartTime" style="width: 100%" disabled></s-time-picker>
          </s-col>
          <s-col :span="4" style="text-align: center">-</s-col>
          <s-col :span="10">
            <s-time-picker v-model="endTime" placeholder="请选择结束时间" @change="getEndTime" style="width: 100%" disabled></s-time-picker>
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
          <s-col :span="8" v-show="isShow && qqxia">
            <s-form-item label="审计操作详情">
              <s-switch v-model="addForm.isAuditSqlDetail" :inactive-value="0" :active-value="1" disabled></s-switch>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row v-show="isShow && qqxia && addForm.isAuditSqlDetail">
          <s-col :span="8">
            <s-form-item label="审计结果集">
              <s-switch v-model="addForm.isAuditSqlr" :inactive-value="0" :active-value="1" disabled></s-switch>
            </s-form-item>
            <!--<s-form-item label="流程标志">-->
            <!--<s-switch v-model="addForm.isTriggerFlow" :inactive-value="0" :active-value="1"></s-switch>-->
            <!--</s-form-item>-->
          </s-col>
          <s-col :span="8">
            <s-form-item label="生成事件">
              <s-switch v-model="addForm.isCreateAlarm" :inactive-value="0" :active-value="1" disabled></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8">
            <s-form-item label="事件告警">
              <s-switch v-model="addForm.isCreateEvent" :inactive-value="0" :active-value="1" disabled></s-switch>
            </s-form-item>
          </s-col>
        </s-row>
      </s-form>
      <s-scrollbar wrap-style="max-height: 500px;" v-show="isShow && qqxia && addForm.isCreateEvent">
        <s-table
          :data="myAlarmList"
          ref="alarmTable">
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
      data: Object,
      cmdOptions: Array
    },
    data() {
      return {
        activeTab: 'paneA',
        addForm: {
          name: '',
          isEnabled: 0,
          isTemplate: 0,
          eventLevel: 0,
          remarks: '',
          auditPolicyObjectList: [],

          auditPolicyRuleList: [],
          ruleDesc: '',

          startDate: '',
          endDate: '',
          daysOfWeekBinary: '',
          startTime: null,
          startTimeStr: '',
          endTime: null,
          endTimeStr: '',

          isAuditSql: 0,
          isAuditSqlr: 0,
          isBuiltin: 0,
          isCreateAlarm: 0,
          isCreateEvent: 0,
          isTriggerFlow: 0,
          auditPolicyInfoSendList: []
        },
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
        dbList: [],
        myDbList: [],
        alarmList: [],
        myAlarmList: [],
        selectedAlarmList: [],
        tmp: 0,
        qqxia: 0,
        isShow: true,
        compareArr: [],
        logicArr: [],
        typeArr: [],
        relationArr: ['', '且', '或'],
        selectedDbList: []
      }
    },
    methods: {
      getSearchDef() {
        return {
          show: false
        }
      },
      getAlarmActionsDef() {
        return {
          width: 24,
          actions: [{
            name: '添加',
            click() {}
          }]
        }
      },
      getAlarmSearchDef() {
        return {
          show: false
        }
      },
      showAlarmList() {},
      getStartDate(val) {
        this.addForm.startDate = val;
      },
      getEndDate(val) {
        this.addForm.endDate = val;
      },
      getStartTime(val) {
        this.addForm.startTimeStr = '2017-01-01 ' + val;
      },
      getEndTime(val) {
        this.addForm.endTimeStr = '2017-01-01' + val;
      },
      getWeek(val) {
        if (val.length > 0) {
          this.addForm.daysOfWeekBinary = this.week.toString().replace(/,/g, '');
        } else {
          this.addForm.daysOfWeekBinary = null;
        }
      },
      getAlarmList() {
        $axios.get('/infoSend/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.alarmList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                for (let i = 0; i < this.data.auditPolicyInfoSendList.length; i++) {
                  for (let j = 0; j < this.alarmList.length; j++) {
                    if (this.data.auditPolicyInfoSendList[i].infoSendUuid === this.alarmList[j].uuid) {
                      this.myAlarmList.push(this.alarmList[j]);
                      break;
                    }
                  }
                }
              });
            }
          }
        });
      },
      handleAlarmChange(val) {
        this.selectedAlarmList = val;
      },
      getDbList() {
        $axios.post('/resourcemanager/assetmanage/databaseasset/getDbInstanceByImportance', this.data.importanceList).then(res => {
          if (res.data && res.data instanceof Array) {
            this.dbList = res.data;
            if (this.data) {
              /* this.$nextTick(() => {
                for (let i = 0; i < this.data.auditPolicyObjectList.length; i++) {
                  for (let j = 0; j < this.dbList.length; j++) {
                    if (this.data.auditPolicyObjectList[i].objectUuid === this.dbList[j].dbiUuid) {
                      this.myDbList.push(this.dbList[j]);
                      break;
                    }
                  }
                }
              }); */
              /**
               * 根据是否"置为模板"处理"监控资产"列表展示的项目
               * 是： 过滤掉auditPolicyObjectList字段现有项目，展示其余项
               * 否： 直接展示auditPolicyObjectList字段项目
               */
              if (this.data.isTemplate === 1) {
                let restAll = [];
                for (let i = 0, length1 = this.dbList.length; i < length1; i++) {
                  let flag = true;
                  for (let j = 0, length2 = this.data.auditPolicyObjectList.length; j < length2; j++) {
                    if (this.dbList[i].dbiUuid === this.data.auditPolicyObjectList[j].objectUuid && this.data.importance.indexOf(this.dbList[i]['importance'] !== -1))flag = false;
                  }
                  if (flag)restAll.push(this.dbList[i]);
                }
                this.myDbList = restAll;
                console.log(this.myDbList);
              } else {
                // this.myDbList = res.data.auditPolicyObjectList;
                let targetArr = []
                for (let i = 0, length1 = this.dbList.length; i < length1; i++) {
                  for (let j = 0, length2 = this.data.auditPolicyObjectList.length; j < length2; j++) {
                    if (this.dbList[i].dbiUuid === this.data.auditPolicyObjectList[j].objectUuid && this.data.importance.indexOf(this.dbList[i]['importance'] !== -1)) {
                      targetArr.push(this.dbList[i])
                    }
                  }
                }
                this.myDbList = targetArr
              }
            }
          }
        });
      },
      handleDbListChange(val) {
        this.selectedDbList = val;
      },
      showRuleNew() {
        this.$emit('showRuleNew');
      },
      action(index) {
        this.addForm.auditPolicyRuleList.splice(index, 1);
      },
      exec() {
        this.addForm.ruleDesc = '';
        let tmp = this.addForm.auditPolicyRuleList;
        tmp[0].relation = '';
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i].relation) {
            this.addForm.ruleDesc += (' ' + this.relationArr[tmp[i].relation] + ' ');
          }
          this.addForm.ruleDesc += (this.getType(tmp[i].type) + tmp[i]._val);
        }
      },
      beforeAdd() {
        this.$refs.rulesDbAddForm.validate((valid) => {
          if (valid) {
            if (this.addForm.auditPolicyRuleList.length === 0) {
              this.$message({type: 'error', message: '请设置规则'});
              this.activeTab = 'paneB';
              return false;
            }
            if (this.addForm.ruleDesc.length === 0) {
              this.$message({type: 'error', message: '请生成事件格式'});
              this.activeTab = 'paneB';
              return false;
            }
            for (let i = 0; i < this.addForm.auditPolicyRuleList.length; i++) {
              this.addForm.auditPolicyRuleList[i].index = (i + 1);
            }
//            if (this.addForm.startTime.length === 0) {
//              this.addForm.startTime = null;
//            }
//            if (this.addForm.endTime.length === 0) {
//              this.addForm.endTime = null;
//            }
            if (this.addForm.startDate && this.addForm.startDate.length === 0) {
              this.addForm.startDate = null;
            }
            if (this.addForm.endDate && this.addForm.endDate.length === 0) {
              this.addForm.endDate = null;
            }
            for (let i = 0; i < this.addForm.auditPolicyRuleList.length; i++) {
              delete this.addForm.auditPolicyRuleList[i]._val;
            }
            for (let i = 0; i < this.selectedDbList.length; i++) {
              this.addForm.auditPolicyObjectList.push({
                objectUuid: this.selectedDbList[i].dbiUuid,
                isSelected: this.addForm.isAuditSql
              });
            }
            for (let i = 0; i < this.selectedAlarmList.length; i++) {
              this.addForm.auditPolicyInfoSendList.push({infoSendUuid: this.selectedAlarmList[i].uuid});
            }
            this.$emit('ok', this.addForm);
          } else {
            this.$message({type: 'error', message: '请输入名称'});
            this.activeTab = 'paneA';
            return false;
          }
        });
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
          this.addForm.isAuditSql = 0;
        }
      },
      getValue(row) {
        let str = '';
        for (let i = 0; i < row.auditPolicyRuleItemList.length; i++) {
          let tmp = row.auditPolicyRuleItemList[i];
          str += (numTransToString(this.logicArr, tmp.relation) + numTransToString(this.compareArr, tmp.compare));
          if (row.type === 10) {
            let _arr = tmp.value1.split(',');
            if (_arr) {
              for (let i = 0; i < _arr.length; i++) {
                str += numTransToString(this.cmdOptions, _arr[i], 'dbo_id', 'dbo_key');
                str += numTransToString(this.cmdOptions, _arr[i], 'dbo_id', 'dbo_expand') + ' ';
              }
            }
          } else if (row.type === 2) { // 登录状态
            str += tmp.value1 === '1' ? '成功' : '失败';
          } else {
            str += tmp.value1;
          }
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
        $axios.get('/auditPolicyRule/getAuditPolicyTypeByUsed/1').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.typeArr = res.data;
          }
        });
      }
    },
    created() {
      this.getDbList();
      this.getAlarmList();
      this.getCompareType();
      this.addForm = this.data;
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
        arr.reverse()
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
