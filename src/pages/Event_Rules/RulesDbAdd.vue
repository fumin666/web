<template>
  <div class="rules-db-add">
    <s-steps :current="currentStep" type="arrow" step-width="170px">
      <s-step title="基本配置"></s-step>
      <s-step title="规则配置"></s-step>
      <s-step title="审计时间"></s-step>
      <s-step title="告警配置"></s-step>
    </s-steps>
    <s-scrollbar v-show="currentStep === 0" wrap-class="scrolldbMonitor" v-dialogclose="{id:'.scrolldbMonitor'}">
      <s-form
        :model="addForm"
        :rules="rules"
        ref="rulesDbAddForm"
        label-width="140px">
        <s-form-item label="名称" prop="name">
          <s-input v-model="addForm.name"></s-input>
        </s-form-item>
        <s-form-item label="是否启用规则">
          <s-switch v-model="addForm.isEnabled" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>
        <s-form-item label="置为模板">
          <s-switch v-model="addForm.isTemplate" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>
        <s-form-item label="内置策略">
          <s-switch v-model="addForm.isBuiltin" :inactive-value="0" :active-value="1"></s-switch>
        </s-form-item>
        <s-form-item label="事件级别">
          <s-select v-model="addForm.eventLevel">
            <s-option v-for="(item,index1) in level" :label="item.label" :value="item.value" :key="index1"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="描述" prop="remarks">
          <s-input type="textarea" v-model="addForm.remarks"></s-input>
        </s-form-item>
      </s-form>
      <div class="title">监控资产</div>
      <s-table-page
        :data="dbList"
        :show-header-checkbox="true"
        :header-search="getSearchDef()"
        @filter-change="handleFilterChange"
        @selection-change="handleDbListChange"
        ref="rulesDbAddA">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="资产名称" prop="dbiName"></s-table-column>
        <s-table-column label="IP地址" prop="dbiIp"></s-table-column>
        <s-table-column label="资产类型" prop="protocolName"></s-table-column>
        <s-table-column label="厂商" prop="manufactName" show-overflow-tooltip></s-table-column>
        <s-table-column label="型号" prop="modelNumberName" show-overflow-tooltip></s-table-column>
        <s-table-column label="资产重要程度" prop="importanceStr" width="130px" :filters="importanceFilter"
                        :filtered-value="companyNameFilters" column-key="importanceStr" show-overflow-tooltip>
        </s-table-column>
        <s-table-column label="协议" prop="protocolName"></s-table-column>
        <s-table-column label="端口" prop="dbiPort"></s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-scrollbar v-show="currentStep === 1" wrap-style="max-height: 400px;">
      <s-button style="margin-bottom: 10px;" @click="showRuleNew" icon="plus">添加</s-button>
      <s-table :data="addForm.auditPolicyRuleList">
        <s-table-column label="逻辑" width="100px">
          <template slot-scope="scope">
            <s-select v-model="scope.row.relation" v-if="scope.$index > 0">
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
        <s-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <i class="iconfont icon-cancel" @click="action(scope.$index)"></i>
          </template>
        </s-table-column>
      </s-table>
      <s-button style="margin: 10px 0;" @click="exec" icon="account-audit">生成事件格式</s-button>
      <s-input type="textarea" v-model="addForm.ruleDesc" :maxlength="1440" placeholder="1440个字符内"></s-input>
    </s-scrollbar>
    <s-form
      v-show="currentStep === 2"
      :model="addForm"
      label-width="100px">
      <s-form-item label="日期">
        <s-col :span="10">
          <s-date-picker v-model="startDate" type="date" placeholder="请选择开始日期" @change="getStartDate" style="width: 100%" :picker-options="pickerBeginDateBefore"></s-date-picker>
        </s-col>
        <s-col :span="4" style="text-align: center">-</s-col>
        <s-col :span="10">
          <s-date-picker v-model="endDate" type="date" placeholder="请选择结束日期" @change="getEndDate" style="width: 100%" :picker-options="pickerOptions0"></s-date-picker>
        </s-col>
      </s-form-item>
      <s-form-item label="星期">
        <s-select v-model="week" multiple placeholder="请选择" @change="getWeek">
          <s-option v-for="(item,index2) in weeks" :label="item.label" :value="item.value" :key="index2"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="时间">
        <s-col :span="10">
          <s-time-picker v-model="startTime" placeholder="请选择开始时间" @change="getStartTime" style="width: 100%"></s-time-picker>
        </s-col>
        <s-col :span="4" style="text-align: center">-</s-col>
        <s-col :span="10">
          <s-time-picker v-model="endTime" placeholder="请选择结束时间" @change="getEndTime" style="width: 100%"></s-time-picker>
        </s-col>
      </s-form-item>
    </s-form>
    <div v-show="currentStep === 3">
      <s-form
        :data="addForm"
        label-width="100px">
        <s-row>
          <s-col :span="8">
            <s-form-item label="免审计">
              <s-switch v-model="tmp" :inactive-value="0" :active-value="1" @change="handletmpChange"></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8" v-show="isShow">
            <s-form-item label="审计">
              <s-switch v-model="qqxia" :inactive-value="0" :active-value="1" @change="handleQqxiaChange"></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8" v-show="isShow && qqxia">
            <s-form-item label="审计操作详情">
              <s-switch v-model="addForm.isAuditSqlDetail" :inactive-value="0" :active-value="1" @change="handleISAuditSqlDetailChange"></s-switch>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row v-show="isShow && qqxia && addForm.isAuditSqlDetail">
          <s-col :span="8">
            <s-form-item label="审计结果集">
              <s-switch v-model="addForm.isAuditSqlr" :inactive-value="0" :active-value="1"></s-switch>
            </s-form-item>
            <!--<s-form-item label="流程标志">-->
            <!--<s-switch v-model="addForm.isTriggerFlow" :inactive-value="0" :active-value="1"></s-switch>-->
            <!--</s-form-item>-->
          </s-col>
          <s-col :span="8">
            <s-form-item label="生成事件">
              <s-switch v-model="addForm.isCreateAlarm" :inactive-value="0" :active-value="1"></s-switch>
            </s-form-item>
          </s-col>
          <s-col :span="8">
            <s-form-item label="事件告警" v-show="addForm.isCreateAlarm === 1">
              <s-switch v-model="addForm.isCreateEvent" :inactive-value="0" :active-value="1"></s-switch>
            </s-form-item>
          </s-col>
        </s-row>
      </s-form>
      <s-scrollbar wrap-style="max-height: 500px;" v-show="isShow && qqxia && addForm.isCreateEvent">
        <s-table
          :data="alarmList"
          @selection-change="handleAlarmChange"
          ref="alarmTable">
          <s-table-column type="selection" width="55px"></s-table-column>
          <s-table-column label="名称" prop="name"></s-table-column>
          <s-table-column label="通知方式" prop="sendMode"></s-table-column>
          <s-table-column label="描述" prop="description"></s-table-column>
        </s-table>
      </s-scrollbar>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import { numTransToString, parseDate, parseTime } from 'sunflower-common-utils'
  
  export default {
    components: {

    },
    props: {
      data: Object,
      cmdOptions: Array,
      currentStep: Number
    },
    data() {
      return {
        importanceFilter: [
          {text: '很高', value: 2},
          {text: '高', value: 3},
          {text: '中等', value: 4},
          {text: '低', value: 5},
          {text: '很低', value: 6}
        ],
        addForm: {
          name: '',
          isEnabled: 0,
          isTemplate: 0,
          eventLevel: 0,
          remarks: '',
          auditPolicyObjectList: [],
          importanceList: [2, 3, 4, 5, 6],
          auditPolicyRuleList: [],
          ruleDesc: '',
          startDate: null,
          endDate: null,
          daysOfWeekBinary: '00000000',
          startTime: '',
          endTime: '',
          isAuditSql: 0,
          isAuditSqlr: 0,
          isBuiltin: 0,
          isCreateAlarm: 0,
          isCreateEvent: 0,
          isAuditSqlDetail: 1,
          isTriggerFlow: 0,
          auditPolicyInfoSendList: []
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            {max: 20, message: '最长输入20个字符', trigger: 'change'}
          ],
          remarks: [
            {max: 50, message: '最长输入50个字符', trigger: 'change'}
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
        alarmList: [],
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
    computed: {
      companyNameFilters() {
        if (this.data) {
          return this.data.importanceList || []
        } else {
          return [2, 3, 4, 5, 6]
        }
      },
      pickerBeginDateBefore() {
        return {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        }
      },
      pickerOptions0() {
        let vm = this;
        return {
          disabledDate(time) {
            return time.getTime() < Date.parse(vm.addForm.startDate) - 9.64e7;
          }
        }
      }
    },
    methods: {
      handleFilterChange(filter) {
        for (let key in filter) {
          this.addForm.importanceList = filter[key]
        }
        $axios.post('/resourcemanager/assetmanage/databaseasset/getDbInstanceByImportance', this.addForm.importanceList).then(res => {
          this.dbList = res.data
          if (this.data) {
            /**
             *根据"值为模板"是否打开，处理"监控资产"列表的选中情况
             * 是：除了添加/编辑时未选中的"监控资产"列表中其余项全部选中
             * 否：直接选中"监控资产"列表中添加/编辑时选中的
             */
            if (this.data.isTemplate === 1) {
              let restAll = [];
              for (let i = 0, length1 = this.dbList.length; i < length1; i++) {
                let flag = true;
                for (let j = 0, length2 = this.data.auditPolicyObjectList.length; j < length2; j++) {
                  if (this.dbList[i].dbiUuid === this.data.auditPolicyObjectList[j].objectUuid)flag = false;
                }
                if (flag)restAll.push(this.dbList[i]);
              }
              this.toggleSelectTableRow(restAll, 'dbiUuid')
            } else {
              this.toggleSelectTableRow(this.data.auditPolicyObjectList, 'objectUuid')
            }
          }
        })
      },
      getSearchDef() {
        return {
          width: 8,
          placeholder: '请输入搜索条件',
          searchProps: ['dbiName', 'dbiIp', 'protocolName', 'manufactName', 'modelNumberName', 'dbiPort', 'importanceStr']
        }
      },
      getAlarmSearchDef() {
        return {
          show: false
        }
      },
      getStartDate(val) {
        this.addForm.startDate = val ? parseDate(val) : null;
        let start = this.addForm.startDate ? new Date(this.addForm.startDate).getTime() : 0
        let end = this.addForm.endDate ? new Date(this.addForm.endDate).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.addForm.startDate = '';
          }
        }
      },
      getEndDate(val) {
        this.addForm.endDate = val ? parseDate(val) : null;
        let start = this.addForm.startDate ? new Date(this.addForm.startDate).getTime() : 0
        let end = this.addForm.endDate ? new Date(this.addForm.endDate).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.addForm.endDate = '';
          }
        }
      },
      getStartTime(val) {
        this.addForm.startTime = val ? parseTime(val) : null;
      },
      getEndTime(val) {
        this.addForm.endTime = val ? parseTime(val) : null;
      },
      getWeek(val) {
        let tmp = [0, 0, 0, 0, 0, 0, 0];
        if (val.length > 0) {
          for (let i = 0; i < val.length; i++) {
            tmp[val[i]] = 1;
          }
          this.addForm.daysOfWeekBinary = '0' + tmp.reverse().toString().replace(/,/g, '');
        } else {
          this.addForm.daysOfWeekBinary = '00000000';
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
                      this.$refs.alarmTable.toggleRowSelection(this.alarmList[j]);
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
        $axios.get('/resourcemanager/assetmanage/databaseasset/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.dbList = res.data;
            if (this.data) {
              /**
               *根据"值为模板"是否打开，处理"监控资产"列表的选中情况
               * 是：除了添加/编辑时未选中的"监控资产"列表中其余项全部选中
               * 否：直接选中"监控资产"列表中添加/编辑时选中的
               */
              if (this.data.isTemplate === 1) {
                let restAll = [];
                for (let i = 0, length1 = this.dbList.length; i < length1; i++) {
                  let flag = true;
                  for (let j = 0, length2 = this.data.auditPolicyObjectList.length; j < length2; j++) {
                    if (this.dbList[i].dbiUuid === this.data.auditPolicyObjectList[j].objectUuid)flag = false;
                  }
                  if (flag)restAll.push(this.dbList[i]);
                }
                this.toggleSelectTableRow(restAll, 'dbiUuid')
              } else {
                this.toggleSelectTableRow(this.data.auditPolicyObjectList, 'objectUuid')
              }
            }
          }
        });
      },
      // 根据"值为模板"是否打开过滤出的选中结果，选中列表中对应项
      toggleSelectTableRow(targetArr, compStr) {
        this.$nextTick(() => {
          for (let i = 0; i < targetArr.length; i++) {
            for (let j = 0; j < this.dbList.length; j++) {
              if (targetArr[i][compStr] === this.dbList[j].dbiUuid && this.data.importance.indexOf(targetArr[i]['importance'] !== -1)) {
                this.$refs.rulesDbAddA.toggleRowSelection(this.dbList[j]);
                break;
              }
            }
          }
        });
      },
      handleDbListChange(val) {
        this.selectedDbList = val;
      },
      showRuleNew() {
        this.addForm.ruleDesc = '';
        this.$emit('showRuleNew');
      },
      action(index) {
        this.addForm.ruleDesc = '';
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
              this.$emit('setCurrentStep', 1);
              return false;
            }
            if (this.addForm.ruleDesc.length === 0) {
              this.$message({type: 'error', message: '请生成事件格式'});
              this.$emit('setCurrentStep', 1);
              return false;
            }
            if ((this.addForm.isCreateEvent === 1) && (this.selectedAlarmList.length <= 0)) {
              this.$message({type: 'error', message: '请选择告警方式'});
              return false;
            }
            if (this.addForm.ruleDesc.length > 1450) {
              this.$message({type: 'error', message: '事件格式不能超过1440个字符'});
              return false;
            }
            for (let i = 0; i < this.addForm.auditPolicyRuleList.length; i++) {
              this.addForm.auditPolicyRuleList[i].index = (i + 1);
            }
            if (!this.addForm.startTime) {
              this.addForm.startTime = null;
            }
            if (!this.addForm.endTime) {
              this.addForm.endTime = null;
            }
            let start = this.addForm.startDate ? new Date(this.addForm.startDate).getTime() : 0
            let end = this.addForm.endDate ? new Date(this.addForm.endDate).getTime() : 0
            if (start) {
              if (start >= end) {
                this.$message({
                  type: 'warning',
                  message: '结束时间必须大于开始时间！'
                })
                this.addForm.endDate = '';
                this.$emit('setCurrentStep', 2);
                return false;
              }
            }
            if (end) {
              if (start >= end) {
                this.$message({
                  type: 'warning',
                  message: '开始时间必须小于结束时间！'
                })
                this.addForm.startDate = '';
                this.$emit('setCurrentStep', 2);
                return false;
              }
            }
            if (!this.addForm.startDate) {
              this.addForm.startDate = null;
            }
            if (!this.addForm.endDate) {
              this.addForm.endDate = null;
            }
            for (let i = 0; i < this.addForm.auditPolicyRuleList.length; i++) {
              delete this.addForm.auditPolicyRuleList[i]._val;
            }
            this.addForm.auditPolicyObjectList = [];
            /**
             * 根据 是否"置为模板" 处理上传数据
             * 是->上传"监控资产"未选中项, 否->上传"监控资产"选中项
             */
            if (this.addForm.isTemplate === 1) {
              let notCheckList = [];
              // 过滤选中项，获取未选中项
              for (let i = 0, length1 = this.dbList.length; i < length1; i++) {
                let flag = true;
                for (let j = 0, length2 = this.selectedDbList.length; j < length2; j++) {
                  if (this.dbList[i].dbiUuid === this.selectedDbList[j].dbiUuid)flag = false;
                }
                if (flag)notCheckList.push(this.dbList[i]);
              }
              // 构造上传参数
              notCheckList.forEach(list => {
                this.addForm.auditPolicyObjectList.push({
                  objectUuid: list.dbiUuid,
                  isSelected: 0
                });
              })
            } else {
              this.selectedDbList.forEach(item => {
                this.addForm.auditPolicyObjectList.push({
                  objectUuid: item.dbiUuid,
                  isSelected: 1
                });
              })
            }
            this.addForm.auditPolicyInfoSendList = [];
            for (let i = 0; i < this.selectedAlarmList.length; i++) {
              this.addForm.auditPolicyInfoSendList.push({infoSendUuid: this.selectedAlarmList[i].uuid});
            }
            /**
             * 添加告警配置时，点击switch切换开关状态，显示/隐藏关联的switch，但DBA要求保留switch之前所选数据，
             * 上传时不需要隐藏的switch的数据，因此，在上传时，需要根据约束条件手动删除已经关闭的switch数据
             */
            // "免审计"开启
            if (this.temp) {
              this.addForm.isAuditSql = 0;
              this.addForm.isAuditSqlDetail = 0;
              this.addForm.isAuditSqlr = 0;
              this.addForm.isCreateAlarm = 0;
              this.addForm.isCreateEvent = 0;
            }
            // "免审计"关闭，"审计"关闭
            if (!this.temp && !this.qqxia) {
              this.addForm.isAuditSql = 0;
              this.addForm.isAuditSqlr = 0;
              this.addForm.isCreateAlarm = 0;
              this.addForm.isCreateEvent = 0;
              this.addForm.isAuditSqlDetail = 0;
              this.addForm.auditPolicyInfoSendList = [];
            }
            // "免审计"关闭，"审计"开启，"审计操作详情"关闭
            if (!this.temp && this.qqxia && !this.addForm.isAuditSqlDetail) {
              this.addForm.isAuditSqlr = 0;
              this.addForm.isCreateAlarm = 0;
              this.addForm.isCreateEvent = 0;
            }
            this.$emit('ok', this.addForm);
          } else {
            this.$message({type: 'error', message: '请输入名称'});
            this.$emit('setCurrentStep', 0);
            return false;
          }
        });
      },
      handletmpChange(val) {
        if (val) {
          this.qqxia = 0;
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      },
      handleQqxiaChange(val) {
        if (val) {
          this.addForm.isAuditSql = 1;
          this.addForm.isAuditSqlDetail = 1
        } else {}
      },
      handleISAuditSqlDetailChange(val) {
      },
      getValue(row) {
        let str = '';
        for (let i = 0; i < row.auditPolicyRuleItemList.length; i++) {
          let tmp = row.auditPolicyRuleItemList[i];
          str += (numTransToString(this.logicArr, tmp.relation) + numTransToString(this.compareArr, tmp.compare));
          if (row.type === 10) {
            str += numTransToString(this.cmdOptions, tmp.value1, 'dbo_id', 'dbo_key');
            str += numTransToString(this.cmdOptions, tmp.value1, 'dbo_id', 'dbo_expand');
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
      // let date = new Date()
      // if (date.getTime()) {
      // }
      this.getAlarmList();
      this.getCompareType();
      if (this.data) {
        this.addForm = this.data;
        if (this.data.isAuditSql) {
          this.tmp = 0;
          this.qqxia = 1;
        } else {
          this.tmp = 1;
          this.qqxia = 0;
          this.isShow = false;
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
        let arr = this.data.importanceList ? this.data.importanceList : []
        this.handleFilterChange({importanceStr: arr})
      } else {
        this.getDbList();
      }
    }
  }
</script>
<style>
  .scrolldbMonitor {
    max-height: 400px;
  }
</style>
