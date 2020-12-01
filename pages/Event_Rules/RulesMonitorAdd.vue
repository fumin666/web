<template>
  <div class="rules-monitor-add">
    <s-steps :current="currentStep" type="arrow" step-width="170px">
      <s-step title="基本配置"></s-step>
      <s-step title="规则配置"></s-step>
      <s-step title="策略配置"></s-step>
      <s-step title="动作配置"></s-step>
    </s-steps>
    <s-scrollbar v-show="currentStep === 0" wrap-class="scrollMonitor" v-dialogclose="{id:'.scrollMonitor'}">
      <s-form
        :model="addForm"
        :rules="rules"
        label-width="100px"
        ref="propForm">
        <s-form-item label="启动规则">
          <s-switch v-model="addForm.isOpen" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>
        <s-form-item label="名称" prop="name">
          <s-input v-model="addForm.name"></s-input>
        </s-form-item>
        <s-form-item label="规则类型">
          <s-select v-model="addForm.type" @change="typeChange" ref="type">
            <s-option label="监控项" :value="1"></s-option>
            <s-option label="PING" :value="2"></s-option>
            <s-option label="凭证检测" :value="3"></s-option>
            <s-option label="运行时间检测" :value="4"></s-option>
          </s-select>
        </s-form-item>
        <transition name="fade">
          <template v-if="addForm.type === 1">
            <s-form-item label="监控项" required>
              <s-col :span="12">
                <select-tree url="/monitorcitype/getCitypeTree" v-model="addForm.ciType" @selectTreeChange="selectTreeChange" name="name" style="width: 90%"></select-tree>
              </s-col>
              <s-col :span="12">
                <s-select v-model="addForm.miType" filterable @change="miChange" style="width: 90%; margin-left: 10%;">
                  <s-option v-for="item in cmdbList" :label="item.name" :value="item.value" :key="item.value"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
          </template>
        </transition>
        <s-form-item label="置为模板" prop="isTemplet">
          <s-switch v-model="addForm.isTemplet" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>
        <s-form-item label="描述" prop="description">
          <s-input type="textarea" v-model="addForm.description"></s-input>
        </s-form-item>
      </s-form>
      <div v-if="addForm.type === 2 || addForm.type === 3 || addForm.type === 4">
        <div class="title">资产（至少选择一项）</div>
        <s-table-page
          :data="pingDeviceList"
          :show-header-checkbox="true"
          :header-search="getPingSearchDef()"
          @filter-change="handleFilterChange"
          @selection-change="handleDeviceSelectChange"
          ref="pingTable">
          <s-table-column type="selection" width="55px"></s-table-column>
          <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
          <s-table-column label="IP地址" prop="controlAdderss" width="150px"></s-table-column>
          <s-table-column label="资产类型" prop="citypeName"></s-table-column>
          <s-table-column label="厂商" prop="manufactCaption" show-overflow-tooltip></s-table-column>
          <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
          <s-table-column label="资产重要程度" prop="importantStr" width="130px" :filters="importanceFilter"
                          :filtered-value="companyNameFilters" column-key="importantStr" show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </div>
      <div class="title" v-if="showMonitorDeviceList">资产监控项列表（至少选择一项）</div>
      <s-table-page
        v-if="showMonitorDeviceList"
        :data="monitorDeviceList"
        :show-header-checkbox="true"
        :header-search="getMSearchDef()"
        @filter-change="handlerMiChange"
        @selection-change="handleDeviceSelectChange"
        ref="monitorDeviceLists">
        <s-table-column type="selection" width="55px"></s-table-column>
        <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
        <s-table-column label="IP地址" prop="controlAdderss" width="150px"></s-table-column>
        <s-table-column label="资产类型" prop="assetType"></s-table-column>
        <s-table-column label="厂商" prop="manufact" show-overflow-tooltip></s-table-column>
        <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
        <s-table-column label="监控项名称" prop="monitorName"></s-table-column>
        <s-table-column label="资产重要程度" prop="importantStr" width="100px" :filters="importanceFilter"
                        :filtered-value="companyNameFilters" column-key="importantStr" show-overflow-tooltip>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-scrollbar v-show="currentStep === 1" wrap-style="max-height: 500px;">
      <s-button icon="plus" class="new-rules-group-btn" @click="showRulesMonitorNew">添加</s-button>
      <s-table :data="addForm.groupList" ref="ruleTable" class="luck-table">
        <s-table-column label="规则组名">
          <template slot-scope="scope">
            <s-input v-model="scope.row.ruleName"></s-input>
          </template>
        </s-table-column>
        <s-table-column label="事件级别">
          <template slot-scope="scope">
            <s-select v-model="scope.row.level" @change="hanldeLevelChange(scope.row)">
              <s-option label="未知" :value="0"></s-option>
              <s-option label="正常" :value="1"></s-option>
              <s-option label="提示" :value="2"></s-option>
              <s-option label="警告" :value="3"></s-option>
              <s-option label="次要" :value="4"></s-option>
              <s-option label="主要" :value="5"></s-option>
              <s-option label="严重" :value="6"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="事件告警">
          <template slot-scope="scope">
            <s-switch
              size="small"
              v-model="scope.row.isNeedSend"
              :active-value="1" :inactive-value="0"
              :disabled="scope.row.sendFlowDisable">
            </s-switch>
          </template>
        </s-table-column>
        <s-table-column label="进入流程">
          <template slot-scope="scope">
            <s-switch
              size="small"
              v-model="scope.row.isWorkFlow"
              :active-value="1" :inactive-value="0"
              :disabled="scope.row.sendFlowDisable">
            </s-switch>
          </template>
        </s-table-column>
        <s-table-column label="事件格式" prop="incidentTemplate" show-overflow-tooltip></s-table-column>
        <s-table-column label="规则组描述" prop="desc" show-overflow-tooltip></s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont icon-delete" title="删除" @click="delRules(scope.$index)"></i>
            <i class="iconfont icon-edit" title="编辑" @click="modifyGroup(scope.$index, scope.row)"></i>
          </template>
        </s-table-column>
      </s-table>
    </s-scrollbar>
    <s-form v-show="currentStep === 2" :model="addForm" label-width="160px">
      <s-form-item label="连续触发次数" tip="事件检测值连续满足规则规则的次数，达到该次数后，才触发事件">
        <s-input-number v-model="addForm.triggerCount" :min="1"></s-input-number>
      </s-form-item>
      <!--<s-form-item label="是否产生恢复事件">
        <s-switch v-model="addForm.isRecovery" on-text="是" off-text="否" :active-value="1" :inactive-value="0"></s-switch>
      </s-form-item>-->
      <!--<transition name="fade">-->
        <!--<s-form-item v-show="addForm.isRecovery" label="恢复事件延迟（次）" tip="事件检测值连续不满足规则规则的次数，达到该次数后，恢复该事件">-->
          <!--<s-input-number v-model="addForm.recoveryTriggerCount" :min="0"></s-input-number>-->
        <!--</s-form-item>-->
      <!--</transition>-->
      <s-form-item label="最大产生告警（次）" tip="告警发送的次数，达到该次数后，如果事件未恢复，则停止告警；当告警发送次数置为0表示不限发送次数；当前告警发送次数=最大告警发送次数-已经发送的告警次数，该值<=0时，都不再发送">
        <s-input-number v-model="addForm.maxAlarmNum" :min="0"></s-input-number>
      </s-form-item>
    </s-form>
    <s-scrollbar v-show="currentStep === 3" wrap-style="max-height: 500px;">
      <s-form :model="addForm" label-width="140px">
        <s-form-item label="事件告警">
          <s-switch v-model="addForm.isNeedSend" :active-value="1" :inactive-value="0" :disabled="lastStepSendDisable" @change="sendChange"></s-switch>
        </s-form-item>
        <!--<s-form-item label="是否进入事件流程">
          <s-switch v-model="addForm.incidentFlow" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>-->
      </s-form>
      <div v-show="addForm.isNeedSend">
        <div class="title">告警</div>
        <s-table :data="alarmList" @selection-change="handleAlarmSelect" ref="alarmTable">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="名称" prop="name"></s-table-column>
          <s-table-column label="通知方式" prop="sendMode"></s-table-column>
          <s-table-column label="描述" prop="description"></s-table-column>
        </s-table>
      </div>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {batchUuid} from 'sunflower-common-utils'

  import SelectTree from '@/components/selectTree/SelectTree'

  export default {
    components: {

      SelectTree
    },
    props: {
      data: Object,
      currentStep: Number
    },
    data() {
      return {
        editMode: 'edited',
        importanceFilter: [
          {text: '很高', value: 2},
          {text: '高', value: 3},
          {text: '中等', value: 4},
          {text: '低', value: 5},
          {text: '很低', value: 6}
        ],
        addForm: {
          isOpen: 0,
          name: '',
          type: 1,
          ciType: '',
          cmdbType: '',
          miType: '',
          isTemplet: 0,
          description: '',
          importanceList: [2, 3, 4, 5, 6],
          groupList: [],
          triggerCount: 1,
          isRecovery: 1,
          recoveryTriggerCount: 1,
          maxAlarmNum: 0,

          isNeedSend: 0,
          incidentFlow: 0,
          infoSendUuids: ''
        },
        lastStepSendDisable: false,
        boolRecovery: true,
        SNMPList: [],
        rules: {
          name: [
            {required: true, message: '请输入规则名称', trigger: 'blur'},
            {max: 20, message: '最长输入20个字符', trigger: 'change'}
          ],
          description: [
            {max: 50, message: '最长输入50个字符', trigger: 'change'}
          ]
        },
        cmdbList: [],
        pingDeviceList: [],
        monitorDeviceList: [],
        selectedDeviceList: [],
        showMonitorDeviceList: false,
        alarmList: [],
        selectedAlarm: [],
        currentRuleIdx: null,
        ruleId: null
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
    methods: {
      handleFilterChange(filter) {
        for (let key in filter) {
          this.addForm.importanceList = filter[key]
        }
        let vm = this;
        let params = {
          thresholdUuid: (vm.data && vm.data.uuid) ? vm.data.uuid : '0',
          importanceList: (vm.data && vm.data.importanceList) ? this.data.importanceList : this.addForm.importanceList
        }
        $axios.post(`/monitorItcomp/getItcompByThresholdUuid`, params).then((pingres) => {
          if (pingres.data && pingres.data instanceof Array) {
            vm.pingDeviceList = pingres.data;
            vm.$nextTick(() => {
              for (let i = 0; i < pingres.data.length; i++) {
                if (pingres.data[i].isRelated) {
                  vm.$refs.pingTable.toggleRowSelection(pingres.data[i]);
                }
              }
            });
          }
        });
      },
      selectTreeChange(val) {
        // this.showMonitorDeviceList = false;
        // this.monitorDeviceList = [];
        this.addForm.cmdbType = val.uuid;
        this.cmdbList = [];
        if (!this.flag) {
          this.addForm.miType = '';
        } else {
          this.flag = false
        }
        $axios.get(`/thresholdInfo/getMiTypeSelectByMonitorCiTypeUuid/${val.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.cmdbList = res.data;
          }
        });
      },
      showRulesMonitorNew() {
        this.currentRuleIdx = null;
        if (this.addForm.type === 1 && this.addForm.miType === '') {  // 监控项-miType不为空验证
          this.$message({type: 'warning', message: '请选择监控项'});
          this.$emit('setCurrentStep', 0);
        } else {
          this.$emit('showRulesMonitorNew', this.addForm.miType, this.selectedDeviceList, this.addForm.type);
        }
      },
      typeChange(val) {
        this.addForm.groupList = []
        this.showMonitorDeviceList = false;
        this.monitorDeviceList = [];
        if (!this.flag) {
          this.addForm.miType = '';
          this.addForm.ciType = '';
        } else {
          this.flag = false
        }
        if ((val === 2 || val === 3 || val === 4) && this.pingDeviceList.length === 0) {
          let params = {
            thresholdUuid: '0',
            importanceList: this.addForm.importanceList
          }
          $axios.post('/monitorItcomp/getItcompByThresholdUuid', params).then((res) => {
            if (res.data && res.data instanceof Array) {
              this.pingDeviceList = res.data;
            }
          });
        }
      },
      handlerMiChange(filter) { // 编辑
        if (this.data && this.editMode === 'editing') {
          this.$nextTick(() => {
            this.addForm.groupList = this.data.groupList;
            this.addForm.groupList.forEach(v => {
              if (v.level === 6) {
                v.sendFlowDisable = true
              } else {
                v.sendFlowDisable = false
              }
            })
          });
        }
        for (let key in filter) {
          this.addForm.importanceList = filter[key]
        }
        let params = {
          cmdbTypeUuid: (this.data && this.data.cmdbType) ? this.data.cmdbType : this.addForm.cmdbType,
          miType: (this.data && this.data.miType) ? this.data.miType : this.addForm.miType,
          thresholdUuid: (this.data && this.data.uuid) ? this.data.uuid : '0',
          importanceList: (this.data && this.data.importanceList) ? this.data.importanceList : this.addForm.importanceList
        }
        $axios.post(`/monitorConfigitem/getMonitorItcompByMiTypeForThreshold`, params).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.monitorDeviceList = res.data;
            this.showMonitorDeviceList = true;
            this.$nextTick(() => {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].isRelated) {
                  this.$refs.monitorDeviceLists.toggleRowSelection(this.monitorDeviceList[i]);
                }
              }
              this.editMode = 'edited';
            });
          }
        });
      },
      miChange(val) { // 添加监控项
        if (val) {
          let params = {
            cmdbTypeUuid: this.addForm.cmdbType,
            miType: this.addForm.miType,
            thresholdUuid: '0',
            importanceList: this.addForm.importanceList
          }
          $axios.post(`/monitorConfigitem/getMonitorItcompByMiTypeForThreshold`, params).then((res) => {
            if (res.data && res.data instanceof Array) {
              this.monitorDeviceList = res.data;
              this.showMonitorDeviceList = true;
            }
          });
        }
      },
      getMSearchDef() {
        return {
          width: 8,
          placeholder: '请输入资产名称、IP地址、监控项名称查询',
          searchProps: ['itcompName', 'controlAdderss', 'assetType', 'manufact', 'modelNumber', 'monitorName', 'importantStr']
        }
      },
      getPingSearchDef() {
        return {
          width: 8,
          placeholder: '请输入资产名称、IP地址、资产类别查询',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'manufactCaption', 'modelNumber', 'importantStr']
        }
      },
      getAlarmList() {
        $axios.get('/infoSend/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.alarmList = res.data;
            if (this.data) {
              this.getSelectedAlarmList();
            }
          }
        });
      },
      handleAlarmSelect(val) {
        this.selectedAlarm = val;
      },
      delRules(index) {
        this.addForm.groupList.splice(index, 1);
      },
      modifyGroup(idx, row) {
        this.currentRuleIdx = idx;
        this.$emit('modifyGroup', row);
      },
      setGroupList(example, desc, rule) {
        if (this.currentRuleIdx !== null) {
          let tmp = this.addForm.groupList[this.currentRuleIdx];
          tmp.ruleInfo = rule;
          tmp.incidentTemplate = example;
          tmp.desc = desc;
        } else {
          let len = this.addForm.groupList.length;
          let ruleNameIndex = 1;
          if (len > 0) {
            ruleNameIndex = Number(this.addForm.groupList[len - 1].ruleName.slice(3)) + 1;
          }
          this.addForm.groupList.push({
            ruleInfo: rule,
            index: this.ruleId ? (this.ruleId + 1) : len,
            ruleName: `规则组${ruleNameIndex}`,
            level: 6,   // 默认事件级别为6-严重
            isNeedSend: 1,
            isWorkFlow: 1,
            sendFlowDisable: true,   // 因为默认事件级别为6-严重，事件告警/进入流程默认开启，且置灰不可修改
            incidentTemplate: example,
            desc: desc
          });
          this.ruleId && (this.ruleId ++)
        }
        this.currentRuleIdx = null;
      },
      handleDeviceSelectChange(val) {
        this.selectedDeviceList = val;
      },
      getSelectedAlarmList() {
        $axios.get(`/infoSend/getInfoSendlistByThresholdUuid/${this.data.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.$nextTick(() => {
              for (let i = 0; i < res.data.length; i++) {
                if (!res.data[i].isRelated) {
                  continue;
                }
                this.addForm.isNeedSend = 1;
                for (let j = 0; j < this.alarmList.length; j++) {
                  if (res.data[i].uuid === this.alarmList[j].uuid) {
                    this.$refs.alarmTable.toggleRowSelection(this.alarmList[j]);
                    break;
                  }
                }
              }
            });
          }
        });
      },
      hanldeLevelChange (row) {
        if (row.level === 6) {
          row.isWorkFlow = 1;
          row.isNeedSend = 1;
          row.sendFlowDisable = true;
        } else {
          row.isWorkFlow = 0;
          row.isNeedSend = 0;
          row.sendFlowDisable = false;
        }
      },

      sendChange(val) {
        if (val === 1) {
          this.getAlarmList();
        }
      }
    },
    watch: {
      selectedAlarm: {
        deep: true,
        handler: function(val) {
          this.addForm.infoSendUuids = batchUuid('uuid', val).toString();
        }
      },
      currentStep(val) {
        if (val === 3) {
          this.lastStepSendDisable = false;   // 先重置为初始状态
          let step2AnyOpen = this.addForm.groupList.some(item => item.isNeedSend === 1);
          if (step2AnyOpen) {
            this.addForm.isNeedSend = 1;
          }
          let step2AllClose = this.addForm.groupList.every(item => item.isNeedSend !== 1);
          if (step2AllClose) {
            this.addForm.isNeedSend = 0;
            this.lastStepSendDisable = true;
          }
        }
      }
    },
    created() {
      this.getAlarmList();
      this.flag = true
      if (this.data) {  // 编辑模式
        this.editMode = 'editing';
        let tmp = this.addForm;
        tmp.isOpen = this.data.isOpen;
        tmp.name = this.data.name;
        tmp.type = this.data.type;
        if (this.data.type !== 1) {
          this.showMonitorDeviceList = false;
          this.monitorDeviceList = [];
          let arr = this.data.importanceList ? this.data.importanceList : []
          this.handleFilterChange({importanceStr: arr});
        } else {
          this.showMonitorDeviceList = true;
          let arr = this.data.importanceList ? this.data.importanceList : []
          this.handlerMiChange({importanceStr: arr})
        }
        tmp.ciType = this.data.cmdbTypeName;
        tmp.cmdbType = this.data.cmdbType;
        tmp.miType = this.data.miType
        tmp.description = this.data.description;
        tmp.isTemplet = this.data.isTemplet;
        tmp.triggerCount = this.data.triggerCount;
        tmp.isRecovery = this.data.isRecovery;
        tmp.recoveryTriggerCount = this.data.recoveryTriggerCount;
        tmp.maxAlarmNum = this.data.maxAlarmNum;
        tmp.incidentFlow = this.data.incidentFlow;
        tmp.uuid = this.data.uuid;
        this.ruleId = this.data.groupList.length !== 0 ? this.data.groupList[this.data.groupList.length - 1].index : null;
      }
      this.addForm.groupList = this.data ? this.data.groupList : [];
    }
  }
</script>

<style>
  .scrollMonitor {
    padding-right: 17px;
    max-height: 500px;
  }
  .inputTree .treeContainer .inputTreeHeight {
    max-height: 180px;
  }
  .rules-monitor-add .s-steps {
    margin-bottom: 20px;
  }
  .rules-monitor-add .s-tab-pane-c .s-form-item {
    height: 36px;
  }
  .rules-monitor-add .new-rules-group-btn {
    margin-bottom: 10px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .rules-monitor-add .luck-table .s-table-header-wrapper>table {
    width: 100% !important;
  }
</style>
