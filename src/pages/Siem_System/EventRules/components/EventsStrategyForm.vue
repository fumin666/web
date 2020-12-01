<template>
  <div class="events-strategy-form">
    <s-steps :current="currentStep" type="arrow" step-width="230px">
      <s-step title="基础设置"></s-step>
      <s-step title="规则设置"></s-step>
      <s-step title="动作设置"></s-step>
    </s-steps>
    <s-scrollbar v-show="currentStep === 0" wrap-class="myHeight" v-dialogclose="{id:'.myHeight'}">
      <s-form ref="form1" :model="form" :rules="rules" label-width="100px">
        <s-form-item labelWidth="0">
          <s-card class="box-card-nobg cardborder" style="width:95%;">
            <div slot="header">
                <span class="card-title">
                  <i class="iconfont icon-tag"></i>
                    常规属性
                </span>
            </div>
          </s-card>
        </s-form-item>
        <s-form-item label="启动规则">
          <s-switch v-model="form.isOpen" :active-value="1" :inactive-value="0" :disabled="disabled"></s-switch>
        </s-form-item>
        <s-form-item label="名称" prop="name">
          <s-input v-model="form.name" :disabled="disabled"></s-input>
        </s-form-item>
        <s-form-item label="监控项" prop="logSourceTypeUuid">
          <!--  <s-select v-model="form.logSourceTypeUuid" placeholder="请选择" @change="getLogSource" :disabled="disabled">
              <s-option v-for="(item, index) in logTypeList" :label="item.name" :value="item.uuid"
                        :key="index"></s-option>
            </s-select>-->
          <select-tree
            url="/resourcemanager/configurationmanage/citype/getCountCitypeTree"
            v-model="form.logSourceTypeUuid" @selectTreeChange="getLogSource"
            name="uuid" :disabled="disabled" style="width: 95%"></select-tree>
        </s-form-item>
        <!--<s-form-item label="事件级别" prop="level">
          <s-select v-model="form.level" placeholder="请选择" :disabled="disabled">
            <s-option v-for="(item, index) in eventTypeList" :label="item.configName"
                      :value="Number.parseInt(item.configValue)"
                      :key="index"></s-option>
          </s-select>
        </s-form-item>-->
        <s-form-item label="事件级别" prop="level">
          <s-select v-model="form.level" :disabled="disabled">
            <s-option label="未知" :value="0"></s-option>
            <s-option label="正常" :value="1"></s-option>
            <s-option label="提示" :value="2"></s-option>
            <s-option label="警告" :value="3"></s-option>
            <s-option label="次要" :value="4"></s-option>
            <s-option label="主要" :value="5"></s-option>
            <s-option label="严重" :value="6"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="置为模板">
          <s-radio-group v-model="form.isTemplet" :disabled="disabled">
            <s-radio :label="true">是</s-radio>
            <s-radio :label="false">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-form-item label="描述" prop="decription">
          <s-input v-model="form.decription" :disabled="disabled"></s-input>
        </s-form-item>
        <s-form-item labelWidth="0">
          <s-card class="box-card-nobg" style="width:95%;">
            <!-- <div slot="header">
             <span class="card-title">
               <i class="iconfont icon-info"></i>
                 日志源
             </span>
             </div>-->
          </s-card>
        </s-form-item>
        <s-form-item labelWidth="0">
          <div class="title">监控项</div>
          <s-table-page
            ref="logSourceList"
            :data="form.logSourceList"
            :show-header-checkbox="true"
            @filter-change="handleFilterChange"
            :header-search="defHeaderSearch()"
            @selection-change="handleSelectionChange">
            <s-table-column show-overflow-tooltip :selectable="getDisabled" type="selection"
                            width="45"></s-table-column>
            <s-table-column show-overflow-tooltip label="资产名称" prop="itcompName"></s-table-column>
            <s-table-column show-overflow-tooltip label="IP地址" prop="controlAdderss"></s-table-column>
            <s-table-column label="资产类型" prop="assetType"></s-table-column>
            <s-table-column label="厂商" prop="manufact" show-overflow-tooltip></s-table-column>
            <s-table-column label="型号" prop="modelNumber" show-overflow-tooltip></s-table-column>
            <s-table-column label="资产重要程度" prop="importantStr" width="130px" :filters="importanceFilter"
                            :filtered-value="companyNameFilters" column-key="importantStr" show-overflow-tooltip>
            </s-table-column>
          </s-table-page>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <s-scrollbar v-show="currentStep === 1" wrap-class="defaultSrollHeight">
      <s-form ref="form2" :model="form" :rules="rules" label-width="120px">
        <s-form-item labelWidth="0">
          <s-card class="box-card-nobg" style="width:90%;">
            <div slot="header">
                <span class="card-title">
                  <i class="iconfont icon-set"></i>
                    规则设置
                </span>
            </div>
          </s-card>
        </s-form-item>
        <s-form-item labelWidth="0">
          <drag-field ref="dragField" v-model="form.ruleList" :disabled="disabled" @clearData="clearData"></drag-field>
        </s-form-item>
        <s-form-item labelWidth="0">
          <s-button icon="account-audit" @click="buildEventFormat" :disabled="disabled">生成事件格式</s-button>
          <div class="event-format">
            {{form.incidentTemplet}}
          </div>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <!--<s-scrollbar v-show="currentStep === 2" wrap-class="defaultSrollHeight">
      <s-form ref="form3" :model="form" :rules="rules3" label-width="120px">
        <s-form-item label="触发事件延迟" prop="triggerCount">
          <s-input-number v-model="form.triggerCount" :min="0" :step="1" style="width: 90%"
                          :disabled="disabled"></s-input-number>
          <span style="display: inline-block">次</span>
        </s-form-item>
        <s-form-item label="最大产生告警" prop="maxTriggerAlarmCount">
          <s-input-number v-model="form.maxTriggerAlarmCount" :min="0" :step="1"
                          style="width: 90%;" :disabled="disabled"></s-input-number>
          <span style="display: inline-block">次</span>
        </s-form-item>
        <s-form-item labelWidth="0">
          <s-row style="color: rgb(119,141,159)">
            <s-col :span="4"><b>备注:</b></s-col>
            <s-col :span="20">
              首次触发规则，忽略<b>【触发事件延迟】</b>，直接产生事件
            </s-col>
          </s-row>
          <s-row style="color: rgb(119,141,159)">
            <s-col :span="4"><b>最大产生告警:</b></s-col>
            <s-col :span="20">
              告警发送次数，达到该次数后，如果事件未恢复，则停止告警；<br/>
              当告警发送次数置为0，表示不限发送次数；<br/>
              当前告警发送次数=最大告警发送次数-已发送的告警次数，该值<=0时，都不再发送。<br/>
            </s-col>
          </s-row>
        </s-form-item>
      </s-form>
    </s-scrollbar>-->
    <s-scrollbar v-show="currentStep === 2" wrap-style="max-height: 600px;">
      <div class="fontcolor">动作</div>
      <s-form :model="form" label-width="140px">
        <s-form-item label="加入等保">
          <s-switch v-model="openLevel" :active-value="1" :inactive-value="0" :disabled="disabled"></s-switch>
        </s-form-item>
        <s-form-item v-if="levelShowItem" label="">
          <s-checkbox-group v-model="otherData.showLevelProtect">
            <s-checkbox v-for="(item, index) in levelProtectData"
                        :label="item.value.uuid"
                        :disabled="disabled"
                        :key="index">{{ item.value.typeName }}
            </s-checkbox>
          </s-checkbox-group>
        </s-form-item>
        <s-form-item v-for="(item, index) in levelProtectData"
                     v-if="levelShowItem && otherData.showLevelProtect.indexOf(item.value.uuid) !== -1" :key="index">
          <s-col :span="5">{{ item.value.typeName }}</s-col>
          <s-col :span="8" :offset="1">
            <s-select v-model="form.strategyProtectRankRelList[index].protectCategory" placeholder="请选择"
                      @change="setNextLevel(item.value.uuid, 1, otherData.levels[index][0])"
                      :disabled="disabled">
              <s-option v-for="(child, index) in otherData.levels[index][0]" :label="child.value.keyName"
                        :value="child.value.uuid" :key="index"></s-option>
            </s-select>
          </s-col>
          <s-col :span="8" :offset="1">
            <s-select v-model="form.strategyProtectRankRelList[index].protectTarget" :disabled="disabled"
                      :placeholder="(otherData.levels[index][0].length > 0 && form.strategyProtectRankRelList[index].protectCategory) ? '请选择' : '请选择前一项'">
              <s-option v-for="(child, index) in otherData.levels[index][1]" :label="child.keyName"
                        :value="child.uuid" :key="index"></s-option>
            </s-select>
          </s-col>
        </s-form-item>
        <s-form-item label="事件告警">
          <s-switch v-model="form.isAlarm" :active-value="1" :inactive-value="0" :disabled="disabled"></s-switch>
        </s-form-item>
        <!-- <s-form-item label="是否进入事件流程">
           <s-switch v-model="form.incidentFlow" :active-value="1" :inactive-value="0" :disabled="disabled"></s-switch>
         </s-form-item>-->
      </s-form>
      <div v-show="form.isAlarm === 1">
        <div class="fontcolor">告警</div>
        <s-table-page
          :data="alarmList"
          @selection-change="handleAlarmSelect"

          :header-search="{width: 6, offset: 18}"

          :paginationShow="false"
          ref="alarmTable">
          <s-table-column type="selection" width="45" :selectable="getDisabled"></s-table-column>
          <s-table-column label="名称" prop="name"></s-table-column>
          <s-table-column label="通知方式" prop="sendMode"></s-table-column>
          <s-table-column label="描述" prop="description"></s-table-column>
        </s-table-page>
      </div>
    </s-scrollbar>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {omit} from 'lodash'
  import {batchUuid} from 'sunflower-common-utils'

  import dragField from './DragField'
  import SelectTree from '@/components/selectTree/SelectTree'
  export default {
    components: {
      dragField,
      SelectTree
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
        openLevel: 0,
        levelShowItem: false,
        form: {
          // 属性
          name: '',
          isOpen: 0,
          logSourceTypeUuid: '',
          level: '',
          isTemplet: true,
          decription: '',
          logSourceList: [],
          importanceList: [2, 3, 4, 5, 6],
          logSourceUuidList: [],
          // 规则
          ruleList: [],
          incidentTemplet: '',
          // 策略
          triggerCount: 0,
          maxTriggerAlarmCount: 0,
          // 动作
          isAlarm: 0,
          isProtectRank: 0,
          // alarmRuleList: [],
          // protectCategory 大类别
          // protectTarget 具体
          // protectType 名称
          // strategyUuid 策略
          strategyProtectRankRelList: [],
          //  isNeedSend: 0,
          incidentFlow: 0,
          infoSendUuids: ''
        },
        rules: {
          name: [{required: true, message: '不能为空', trigger: 'blur'},
            {min: 0, max: 40, message: '最大长度不超过40个字符', trigger: 'blur'}
          ],
          logSourceTypeUuid: [{required: true, message: '不能为空', trigger: 'change'}],
          level: [{required: true, message: '不能为空', trigger: 'change', type: 'number'}],
          decription: [{required: true, message: '不能为空', trigger: 'blur'},
            {min: 0, max: 200, message: '最大长度不超过200个字符', trigger: 'blur'}]
        },
        rules3: {
          triggerCount: [{required: true, message: '不能为空', trigger: 'blur', type: 'number'}],
          maxTriggerAlarmCount: [{required: true, message: '不能为空', trigger: 'blur', type: 'number'}]
        },
        otherData: {
          levels: [],
          classify: [], // 1告警转发，2加入等保
          showLevelProtect: [],
          alarmRuleSelection: []
        },
        disabled: false,
        alarmList: [],
        selectedAlarm: [],
        showMonitorDeviceList: false,
        ztreedata: [],
        dataHasChanged: false
      }
    },
    created() {
      // 等保
      for (let i = 0; i < this.levelProtectData.length; i++) {
        this.form.strategyProtectRankRelList.push({
          strategyUuid: this.defaultData.uuid,
          protectType: this.levelProtectData[i].value.uuid,
          protectCategory: '',
          protectTarget: ''
        })
        this.otherData.levels[i] = [[], []]
        this.otherData.levels[i][0] = this.levelProtectData[i].children
      }
      if (this.type !== 'add') {
        this.initData()
      }
      if (this.type === 'eye') {
        this.disabled = true
      }
      /* if (this.type === 'add') {
       this.showMonitorDeviceList = false
       } */
      this.getAlarmList();
      // this.getZtreedata()
    },
    mounted() {
      if (this.type !== 'add') {
        this.showMonitorDeviceList = true
        let logSourceListTable = this.$refs.logSourceList
        this.$nextTick(() => {
          this.form.logSourceList ? this.form.logSourceList.map((item) => {
            logSourceListTable.toggleRowSelection(item, !!item.isRelated)
          }) : ''
        })
      }
    },
    computed: {
      companyNameFilters() {
        if (this.defaultData.importanceList) {
          return this.defaultData.importanceList || []
        } else {
          return [2, 3, 4, 5, 6]
        }
      }
    },
    watch: {
      openLevel: {
        handler: function (val) {
          if (val === 0) {
            this.levelShowItem = false
            // this.form.strategyProtectRankRelList = []
          } else if (val === 1) {
            this.levelShowItem = true
          }
        }
      },
      selectedAlarm: {
        deep: true,
        handler: function (val) {
          this.form.infoSendUuids = batchUuid('uuid', val).toString();
        }
      },
      'form.logSourceList': {
        immediate: true,
        deep: true,
        handler() {
          if (this.type !== 'add') {
            this.showMonitorDeviceList = true
            let logSourceListTable = this.$refs.logSourceList
            this.$nextTick(() => {
              this.form.logSourceList ? this.form.logSourceList.map((item) => {
                if (item.isRelated === 1) {
                  logSourceListTable.toggleRowSelection(item);
                }
              }) : ''
            })
          }
        }
      }
    },
    methods: {
      clearData() {
        if (this.type === 'edit' && !this.dataHasChanged) {
          this.dataHasChanged = true
          return
        }
        this.form.incidentTemplet = ''
      },
      getZtreedata() {
        $axios.get('resourcemanager/configurationmanage/citype/getCountCitypeTree').then((res) => {
          this.ztreedata = res.data
        })
      },
      getAlarmList() {
        $axios.get('/infoSend/list').then((res) => {
          //  console.log(res.data && res.data instanceof Array)
          if (res.data && res.data instanceof Array) {
            // console.log(this.type)
            this.alarmList = res.data;
            // 这块没必要置为1
//            if (this.alarmList.length > 0) {
//              this.form.isNeedSend = 1;
//            }
            if (this.type !== 'add') {
              this.getSelectedAlarmList();
            }
          }
        });
      },
      getSelectedAlarmList() {
        let a = ''
        if (this.type === 'edit') {
          a = 1
        } else if (this.type === 'eye') {
          a = 0
        }
        $axios.get(`/infoSend/getInfoSendlistByStrategyUuid/${this.defaultData.uuid}/${a}`).then((res) => {
          if (res.data && res.data instanceof Array) {
            if (this.type === 'eye') {
              this.alarmList = res.data
            }
            this.$nextTick(() => {
              /* if (res.data.length > 0) {
               this.form.incidentFlow = 1;
               } */
              if (this.type === 'eye') {
                this.alarmList.map((item) => {
                  this.$refs.alarmTable.toggleRowSelection(item, true)
                })
              } else {
                let uuids = res.data.filter(item => !!item.isRelated).map(item => item.uuid)
                this.alarmList.map((item) => {
                  if (uuids.indexOf(item.uuid) !== -1) {
                    this.$refs.alarmTable.toggleRowSelection(item, true)
                  }
                })
              }
            });
          }
        });
      },
      handleAlarmSelect(val) {
        this.selectedAlarm = val;
      },
      handleFilterChange(filter) {
        for (let key in filter) {
          this.form.importanceList = filter[key]
        }
        this.getLogSource(this.form)
      },
      defHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'controlAdderss', 'protocolName', 'manufact', 'modelNumber', 'importantStr']
        }
      },
      handleSelectionChange(selection) {
        this.form.logSourceUuidList = selection.map(function (item) {
          return item.uuid
        })
      },
      initData() {
        let defaultData = this.defaultData
        // --显示等保
        let protectDataUuids = this.levelProtectData.map(function (item) {
          return item.value.uuid
        })
        let strategyProtectRankRelList = this.form.strategyProtectRankRelList;
        strategyProtectRankRelList.forEach((item1) => {
          defaultData.strategyProtectRankRelList.forEach((item2) => {
            if (item1.protectType === item2.protectType) {
              item1.protectCategory = item2.protectCategory
              item1.protectTarget = item2.protectTarget;
            }
          })
        })
        if (defaultData.strategyProtectRankRelList && defaultData.strategyProtectRankRelList.length > 0) {
          this.levelShowItem = true
          this.openLevel = 1
          this.otherData.classify.push('2')
          this.otherData.showLevelProtect = []
          defaultData.strategyProtectRankRelList.forEach((item) => {
            let index = protectDataUuids.indexOf(item.protectType)
            this.otherData.showLevelProtect.push(item.protectType)
            this.initNextLevel(item.protectType, 1, this.levelProtectData[index].children, item.protectCategory)
          })
        }
        this.form = Object.assign({}, this.form, this.defaultData, {
          logSourceList: this.defaultData.logSourceList ? this.defaultData.logSourceList : [],
          strategyProtectRankRelList: strategyProtectRankRelList
        })
        this.form.isTemplet = !!this.form.isTemplet
        this.$emit('init', defaultData.alarmRuleList)
      },
      // 获取日志源类别
      getLogSource(value) {
        value.uuid = value.logSourceTypeUuid || value.uuid
        this.form.uuid = value.uuid
        if (this.type === 'add') {
          let params = {
            cmdbTypeUuid: value.uuid,
            strategyUuid: '0',
            isAll: '1',
            importanceList: this.form.importanceList
          }
          $axios.post(`monitorConfigitem/getMonitorItcompListByStrategyUuid`, params).then(({data}) => {
            this.form.logSourceList = data
          })
        } else if (this.type === 'edit') {
          let params = {
            cmdbTypeUuid: value.uuid,
            strategyUuid: this.defaultData.uuid,
            isAll: '1',
            importanceList: this.form.importanceList
          }
          $axios.post(`monitorConfigitem/getMonitorItcompListByStrategyUuid`, params).then(({data}) => {
            this.form.logSourceList = data
          })
        }
      },
      getEventFormat() {
        let result = this.$refs.dragField.data && this.$refs.dragField.data.length > 0 ? '{日志源}{IP}触发规则' +
          this.$refs.dragField.data.map(function (item, index) {
            let str = ''
            if (index !== 0) {
              str += ` ${item.ruleRelationName} `
            }
            if (item.ruleType <= 2) {
              str += (`(${item.attributeName}以(${item.contentName})${item.ruleTypeName})`)
            } else if (item.ruleType <= 4) {
              str += (`(${item.attributeName}${item.ruleTypeName}(${item.contentName}))`)
            } else if (item.ruleType <= 6) {
              str += (`(${item.attributeName}满足${item.ruleTypeName}(${item.contentName}))`)
            } else {
              str += (`(${item.attributeName}${item.ruleTypeName}(${item.contentName}))`)
            }
            return str
          }).join(' ') + '【日志内容：{日志内容}】' : '';
        console.log(result);
        return result
      },
      buildEventFormat() {
        if (!this.$refs.dragField.validate()) {
          this.$message.error('请填写完整规则!')
        } else {
          if (this.$refs.dragField.data && this.$refs.dragField.data.length > 0) {
            this.form.incidentTemplet = '{日志源}{IP}触发规则' +
              this.$refs.dragField.data.map(function (item, index) {
                let str = ''
                if (index !== 0) {
                  str += ` ${item.ruleRelationName} `
                }
                if (item.ruleType <= 2) {
                  str += (`(${item.attributeName}以(${item.contentName})${item.ruleTypeName})`)
                } else if (item.ruleType <= 4) {
                  str += (`(${item.attributeName}${item.ruleTypeName}(${item.contentName}))`)
                } else if (item.ruleType <= 6) {
                  str += (`(${item.attributeName}满足${item.ruleTypeName}(${item.contentName}))`)
                } else {
                  str += (`(${item.attributeName}${item.ruleTypeName}(${item.contentName}))`)
                }
                return str
              }).join(' ') + '【日志内容：{日志内容}】';
          } else {
            this.form.incidentTemplet = ''
          }
        }
      },
      validate(cb) {
        let flag = true
        this.$refs.form1.validate((valid) => {
          if (!valid) {
            flag = false
            this.$message.error('请填写完整属性')
            this.$emit('setCurrentStep', 0);
          }
        })
        this.$refs.form2.validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        /* this.$refs.form3.validate((valid) => {
          if (!valid) {
            flag = false
          }
        }) */
        /* this.$refs.form4.validate((valid) => {
         if (!valid) {
         flag = false
         }
         }) */
//        if (flag && this.form.logSourceUuidList && this.form.logSourceUuidList.length === 0) {
//          flag = false
//          this.$message.error('日志源列表数据至少要勾选一项')
//        }
//        if (flag && this.form.isNeedSend && this.selectedAlarm.length === 0) {
//          flag = false
//          this.$message.error('请选择告警')
//        }
        if (!this.$refs.dragField.validate()) {
          flag = false;
          this.$message.error('请填写完整规则')
        } else if (this.getEventFormat() !== this.form.incidentTemplet) {
          flag = false;
          this.$message.error('请生成事件模板')
        }
        if (flag) {
           this.form.strategyProtectRankRelList.map((item) => {
             if (this.otherData.showLevelProtect.indexOf(item.protectType) !== -1) {
             // 做校验
             // protectCategory 大类别
             // protectTarget 具体
             // protectType 名称
             // strategyUuid 策略
             if (!(item.protectType && (item.protectCategory === 'xxx' ? '' : item.protectCategory) && (item.protectTarget === 'xxx' ? '' : item.protectTarget))) {
             this.$message.success('请填写完整等保策略!')
             flag = false
             }
            }
           })
         }
        cb(flag)
      },
      getDisabled() {
        return !this.disabled
      },
      getFormData() {
        /*
         *
         * 修改
         * isTemplet -> 0/1
         * alarmRuleList -> alarmRuleUuidList
         *
         * 不需要字段
         * alarmRuleList
         * createTime
         * eventLevelList
         * id
         * isBuiltin
         * levelName
         * levelUuid
         * logSourceList
         * logSourceTypeList
         * logSourceTypeName
         * modifyTime
         * protectList
         */
        let data = this.form
        let otherData = this.otherData
        data.isTemplet = data.isTemplet ? 1 : 0
        data = omit(data, [
          'infoSendUuids',
          'alarmRuleList',
          'alarmRuleUuidList',
          'createTime',
          'eventLevelList',
          'id',
          'isBuiltin',
          'levelName',
          'levelUuid',
          'logSourceList',
          'logSourceTypeList',
          'logSourceTypeName',
          'modifyTime',
          'protectList'
        ])
        data.strategyProtectRankRelList = data.strategyProtectRankRelList.filter(function (item) {
         if (otherData.showLevelProtect.indexOf(item.protectType) !== -1) {
         return true
         }
         return false
         })
        // 等保
        if (otherData.showLevelProtect.length === 0) {
          data.isProtectRank = 0
        }
        return data
      },

      initNextLevel(typeUuid, level, data, defaultUuid) {
        // 清空所有后续层数据(protectTarget)
        // 选中的uuid:form.strategyProtectRankRelList[type].protectCategory
        let type = this.levelProtectData.map(function (item) {
          return item.value.uuid
        }).indexOf(typeUuid)
        let index = -1
        let uuid = defaultUuid || this.form.strategyProtectRankRelList[type].protectCategory
        data.forEach(function (item, i) {
          if (item.value.uuid === uuid) {
            index = i
          }
        })
        this.otherData.levels[type][level] = Object.assign([], data[index].children)
        this.otherData.levels = Object.assign([], this.otherData.levels)
      },

      setNextLevel(typeUuid, level, data, defaultUuid) {
        // 清空所有后续层数据(protectTarget)
        // 选中的uuid:form.strategyProtectRankRelList[type].protectCategory
        let type = this.levelProtectData.map(function (item) {
          return item.value.uuid
        }).indexOf(typeUuid)
        let index = -1
        let uuid = defaultUuid || this.form.strategyProtectRankRelList[type].protectCategory
        data.forEach(function (item, i) {
          if (item.value.uuid === uuid) {
            index = i
          }
        })
        this.otherData.levels[type][level] = Object.assign([], data[index].children)
        this.otherData.levels = Object.assign([], this.otherData.levels)
        this.form.strategyProtectRankRelList[type].protectTarget = ''
      }
    },
    props: {
      logTypeList: {
        type: Array,
        default() {
          return []
        }
      },
      eventTypeList: {
        type: Array,
        default() {
          return []
        }
      },
      levelProtectData: {
         type: Array,
         default() {
         return []
         }
      },
      defaultData: {
        type: Object,
        default() {
          return {}
        }
      },
      alarmRuleListProp: {
        type: Array,
        default() {
          return []
        }
      },
      type: {
        type: String,
        default: 'add' // edit,eye,add
      },
      currentStep: Number
    }
  };
</script>

<style>
  .myHeight{
    padding-right: 17px;
  }
  .events-strategy-form .s-steps {
    margin-bottom: 20px;
  }
  .events-strategy-form .s-card {
    border: 0px !important
  }
</style>
