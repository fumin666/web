<template>
  <div class="rules-monitor-add">
    <s-tab :animated="false">
      <s-tab-pane label="基本配置">
        <s-scrollbar wrap-class="scrollMonitor">
          <s-form
            :model="addForm"
            label-width="100px">
            <s-form-item label="启动规则">
              <s-switch v-model="addForm.isOpen" :active-value="1" :inactive-value="0" disabled></s-switch>
            </s-form-item>
            <s-form-item label="名称">
              <s-input v-model="addForm.name" disabled></s-input>
            </s-form-item>
            <s-form-item label="规则类型">
              <s-select v-model="addForm.type" disabled>
                <s-option label="监控项" :value="1"></s-option>
                <s-option label="PING" :value="2"></s-option>
                <s-option label="凭证检测" :value="3"></s-option>
                <s-option label="运行时间检测" :value="4"></s-option>
              </s-select>
            </s-form-item>
            <template v-if="addForm.type === 1">
                <s-form-item label="监控项">
                  <s-col :span="12">
                    <select-tree disabled url="/monitorcitype/getCitypeTree" v-model="addForm.ciType" @selectTreeChange="selectTreeChange" name="name" style="width: 90%" disabled></select-tree>
                  </s-col>
                  <s-col :span="12">
                    <s-select v-model="addForm.miType" style="width: 90%; margin-left: 10%;" disabled>
                      <s-option v-for="item in cmdbList" :label="item.name" :value="item.value" :key="item.value" disabled></s-option>
                    </s-select>
                  </s-col>
                </s-form-item>
              </template>
            <s-form-item label="置为模板">
              <s-switch v-model="addForm.isTemplet" :active-value="1" :inactive-value="0" disabled></s-switch>
            </s-form-item>
            <s-form-item label="描述">
              <s-input type="textarea" v-model="addForm.description" disabled></s-input>
            </s-form-item>
          </s-form>
          <div v-if="addForm.type === 2 || addForm.type === 3 || addForm.type === 4">
            <div class="title">资产</div>
            <s-table-page
              :data="pingDeviceList">
              <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
              <s-table-column label="IP地址" prop="controlAdderss" width="150px"></s-table-column>
              <s-table-column label="资产类型" prop="citypeName"></s-table-column>
              <s-table-column label="厂商" prop="manufactCaption" show-overflow-tooltip></s-table-column>
              <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
              <s-table-column label="资产重要程度" prop="importantStr"></s-table-column>
            </s-table-page>
          </div>
          <div class="title" v-if="showMonitorDeviceList">监控项</div>
          <s-table-page
            :data="monitorDeviceList"
            v-if="showMonitorDeviceList"
            ref="monitorDeviceLists">
            <s-table-column label="资产名称" prop="itcompName"></s-table-column>
            <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
            <s-table-column label="资产类型" prop="assetType"></s-table-column>
            <s-table-column label="厂商" prop="manufact" show-overflow-tooltip></s-table-column>
            <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
            <s-table-column label="监控项名称" prop="monitorName"></s-table-column>
            <s-table-column label="资产重要程度" prop="importantStr"></s-table-column>
          </s-table-page>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="规则配置">
        <s-scrollbar wrap-style="max-height: 600px;">
          <s-table :data="addForm.groupList">
            <s-table-column label="规则组名">
              <template slot-scope="scope">
                <s-input v-model="scope.row.ruleName" disabled></s-input>
              </template>
            </s-table-column>
            <s-table-column label="事件级别">
              <template slot-scope="scope">
                <s-select v-model="scope.row.level" disabled>
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
                <s-switch v-model="scope.row.isNeedSend" size="small" :active-value="1" :inactive-value="0" disabled></s-switch>
              </template>
            </s-table-column>
            <s-table-column label="进入流程">
              <template slot-scope="scope">
                <s-switch v-model="scope.row.isWorkFlow" size="small" :active-value="1" :inactive-value="0" disabled></s-switch>
              </template>
            </s-table-column>
            <s-table-column label="事件格式" prop="incidentTemplate" show-overflow-tooltip></s-table-column>
            <s-table-column label="规则组描述" prop="desc" show-overflow-tooltip></s-table-column>
          </s-table>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="策略配置" class="s-tab-pane-c">
        <s-form :model="addForm" label-width="160px">
          <s-form-item label="连续触发次数" tip="事件检测值连续满足规则规则的次数，达到该次数后，才触发事件">
            <s-input-number v-model="addForm.triggerCount" :min="1" disabled></s-input-number>
          </s-form-item>
          <!--<s-form-item label="是否产生恢复事件">
            <s-switch v-model="addForm.isRecovery" on-text="是" off-text="否" :active-value="1" :inactive-value="0" disabled></s-switch>
          </s-form-item>-->
          <!--<transition name="fade">-->
            <!--<s-form-item v-show="addForm.isRecovery" label="恢复事件延迟（次）" tip="事件检测值连续不满足规则规则的次数，达到该次数后，恢复该事件">-->
              <!--<s-input-number v-model="addForm.recoveryTriggerCount" :min="0" disabled></s-input-number>-->
            <!--</s-form-item>-->
          <!--</transition>-->
          <s-form-item label="最大产生告警（次）" tip="告警发送的次数，达到该次数后，如果事件未恢复，则停止告警；当告警发送次数置为0表示不限发送次数；当前告警发送次数=最大告警发送次数-已经发送的告警次数，该值<=0时，都不再发送">
            <s-input-number v-model="addForm.maxAlarmNum" :min="0" disabled></s-input-number>
          </s-form-item>
        </s-form>
      </s-tab-pane>
      <s-tab-pane label="动作配置" name="action">
        <s-scrollbar wrap-style="max-height: 600px;">
          <s-form :model="addForm" label-width="140px">
            <s-form-item label="事件告警">
              <s-switch v-model="addForm.isNeedSend" :active-value="1" :inactive-value="0" disabled></s-switch>
            </s-form-item>
            <!--<s-form-item label="是否进入事件流程">
              <s-switch v-model="addForm.incidentFlow" :active-value="1" :inactive-value="0" disabled></s-switch>
            </s-form-item>-->
          </s-form>
          <div v-show="addForm.isNeedSend">
            <div class="title">告警列表</div>
            <s-table :data="alarmList">
              <s-table-column label="名称" prop="name"></s-table-column>
              <s-table-column label="通知方式" prop="sendMode"></s-table-column>
              <s-table-column label="描述" prop="description"></s-table-column>
            </s-table>
          </div>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import SelectTree from '@/components/selectTree/SelectTree'

  export default {
    components: {
      SelectTree
    },
    props: {
      data: Object
    },
    data() {
      return {
        addForm: this.data,
        SNMPList: [],
        cmdbList: [],
        pingDeviceList: [],
        monitorDeviceList: [],
        showMonitorDeviceList: false,
        alarmList: []
      }
    },
    methods: {
      getActionsDef() {
//        let vm = this;
        return {
          width: 12,
          actions: [{
            name: '选择全部',
            icon: '',
            click() {}
          }, {
            name: '取消全选',
            icon: '',
            click() {}
          }]
        }
      },
      getSearchDef() {
        return {
          show: false
        }
      },
      selectTreeChange(val) {
        this.addForm.cmdbType = val.uuid;
        this.cmdbList = [];
        $axios.get(`/thresholdInfo/getMiTypeSelectByMonitorCiTypeUuid/${val.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.cmdbList = res.data;
            if (this.data) {
              this.$nextTick(() => {
                this.addForm.miType = this.data.miType;
              });
            }
          }
        });
      },

      getPingDevice() {
        let vm = this;
        let params = {
          thresholdUuid: vm.data.uuid,
          importanceList: this.addForm.importanceList
        }
        $axios.post(`/monitorItcomp/getItcompByThresholdUuid`, params).then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isRelated) {
                this.pingDeviceList.push(res.data[i]);
              }
            }
          }
        });
      },
      getMonitorDevice() {
        let params = {
          cmdbTypeUuid: this.addForm.cmdbType,
          miType: this.addForm.miType,
          thresholdUuid: this.data.uuid,
          importanceList: this.addForm.importanceList
        }
        $axios.post(`/monitorConfigitem/getMonitorItcompByMiTypeForThreshold`, params).then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isRelated) {
                this.monitorDeviceList.push(res.data[i]);
              }
            }
            if (this.monitorDeviceList.length > 0) {
              this.showMonitorDeviceList = true;
            }
          }
        });
      },
      getAlarmList() {
        $axios.get(`/infoSend/getInfoSendlistByThresholdUuid/${this.data.uuid}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].isRelated) {
                this.alarmList.push(res.data[i]);
              }
            }
            if (this.alarmList.length > 0) {
              this.addForm.isNeedSend = 1;
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
      setGroupList(example, desc) {
        let len = this.addForm.groupList.length;
        this.addForm.groupList.push({
          ruleInfo: '',
          index: len,
          ruleName: `规则组${len}`,
          level: 0,
          isNeedSend: 1,
          incidentTemplate: example,
          desc: desc
        });
      }
    },

    created() {
      this.getAlarmList()
      this.addForm.ciType = this.data.cmdbTypeName;
      if (this.data.type === 1) {
        this.getMonitorDevice();
      } else {
        this.getPingDevice();
      }
    }
  }
</script>

<style>
  .scrollMonitor {
    padding-right: 17px;
    max-height: 400px;
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
</style>
