<template>
  <div class="events-strategy">
    <s-table-page
      :data="data"
      :header-search="getSearchDef()"
      :header-actions="getActionsDef()"
      :row-actions="getRowActionsDef()"
      @selection-change="handleSelectionChange"
      key="RulesLogs"
      actionColWidth="150px">
      <s-table-column show-overflow-tooltip type="selection" width="45"></s-table-column>
      <!--<s-table-column show-overflow-tooltip type="index" width="70" label="编号"></s-table-column>-->
      <s-table-column show-overflow-tooltip label="规则名称" prop="name"></s-table-column>
      <s-table-column show-overflow-tooltip label="资产类别" prop="logSourceTypeName"></s-table-column>
      <s-table-column show-overflow-tooltip label="事件级别" prop="level">
        <template slot-scope="scope">
          <span v-text="getLevel(scope.row.level)"></span>
        </template>
      </s-table-column>
      <s-table-column show-overflow-tooltip label="策略描述" prop="decription"></s-table-column>
      <s-table-column show-overflow-tooltip label="禁止/启动">
        <template slot-scope="scope">
          <s-switch v-model="scope.row.isOpen" size="small" :active-value="1" :inactive-value="0"
                    @change="handleSwitchChange(scope.row)"></s-switch>
        </template>
      </s-table-column>
    </s-table-page>
    <!-- 新增事件策略 -->
    <s-dialog
      v-model="addDialog"
      v-if="addDialog"
      width="800px"
      title="添加">
      <events-strategy-form
        ref="addEvent"
        :logTypeList="logTypeList"
        :eventTypeList="eventTypeList"
        :levelProtectData="levelProtectData"
        :alarmRuleListProp="alarmRuleListCache"
        :current-step="currentStep"
        @add-warning="addWarning"
        @init="initAlarm"
        @change="deleteAlarm"
        @setCurrentStep="setCurrentStep">
      </events-strategy-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="next" v-show="currentStep < 2">下一步</s-button>
        <s-button @click="submitAddEvent" v-show="currentStep === 2">确定</s-button>
        <s-button @click="addDialog = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <!-- 编辑事件策略 -->
    <s-dialog
      v-model="editDialog"
      v-if="editDialog"
      width="800px"
      title="编辑日志规则">
      <events-strategy-form
        ref="editEvent"
        type="edit"
        :logTypeList="logTypeList"
        :eventTypeList="eventTypeList"
        :defaultData="editData"
        :levelProtectData="levelProtectData"
        :alarmRuleListProp="alarmRuleListCache"
        :current-step="currentStep"
        @add-warning="addWarning"
        @init="initAlarm"
        @change="deleteAlarm"
        @setCurrentStep="setCurrentStep">
      </events-strategy-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="currentStep --" v-show="currentStep > 0">上一步</s-button>
        <s-button @click="editNext" v-show="currentStep < 2">下一步</s-button>
        <s-button @click="submitEditEvent" v-show="currentStep === 2">确定</s-button>
        <s-button @click="editDialog = false; currentStep = 0">取消</s-button>
      </template>
    </s-dialog>
    <!-- 查看事件策略 -->
    <s-dialog
      v-model="eyeDialog"
      v-if="eyeDialog"
      width="800px"
      title="查看日志规则">
      <events-strategy-form-eye
        type="eye"
        :logTypeList="logTypeList"
        :eventTypeList="eventTypeList"
        :defaultData="editData"
        :levelProtectData="levelProtectData"
        :alarmRuleListProp="alarmRuleListCache">
      </events-strategy-form-eye>
    </s-dialog>
  </div>
</template>

<script type="text/babel">

  import eventsStrategyForm from './components/EventsStrategyForm.vue'
  import eventsStrategyFormEye from './components/EventsStrategyFormEye.vue'
  // import alarmListDialog from './components/AlarmListDialog.vue'
  /* eslint-disable no-unused-vars */
  import {omit, cloneDeep} from 'lodash'
  import $axios from 'sunflower-ajax'
  export default {
    components: {

      eventsStrategyForm,
      eventsStrategyFormEye
      // alarmListDialog
    },
    data() {
      return {
        data: [],
        addDialog: false,
        editDialog: false,
        eyeDialog: false,
        warningListDialog: false,
        logTypeList: [],
        eventTypeList: [],
        editData: {},
        levelProtectData: [],
        alarmRuleListCache: [],
        warnListData: [],
        selectionList: [],
        currentStep: 0
      }
    },
    mounted() {
      this.getData()
    },
    methods: {
      getLevel(num) {
        let level = ['未知', '正常', '提示', '警告', '次要', '主要', '严重'];
        return level[num];
      },
    getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入查询内容',
          searchProps: ['name', 'logSourceTypeName', 'levelName', 'decription']
        }
      },
      getActionsDef() {
        let _self = this
        return {
          width: 12,
          actions: [
            {
              name: '添加',
              icon: 'plus',
              click() {
                _self.alarmRuleListCache = []
                _self.currentStep = 0;
                Promise.all([
                  $axios.get('/strategyInfo/getProtectInfo/1'),
                  $axios.get('/strategyInfo/getLogSourceTypeAndEventLevel')
                ]).then(function (data) {
                  _self.levelProtectData = data[0].data
                  _self.logTypeList = data[0].data.logSourceTypeList
                  _self.eventTypeList = data[0].data.eventLevelList
                  _self.addDialog = true
                })
              }
            },
            {
              name: '批量删除',
              icon: 'batch-del',
              click() {
                if (_self.selectionList.length > 0) {
                  _self.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // _self.selectionList.map(function (item) {return item.uuid})
                    _self.handleDelete(_self.selectionList)
                  }).catch(() => {});
                } else {
                  _self.$message.error('请选择删除项')
                }
              }
            }
          ]
        }
      },
      getRowActionsDef() {
        let _self = this
        return [
          {
            name: '查看',
            icon: 'eye',
            click(row) {
              Promise.all([
                $axios.get('/strategyInfo/getStrategyInfoByUuid/' + row.uuid),
                $axios.get('/strategyInfo/getProtectInfo/1'),
                $axios.get('/strategyInfo/getLogSourceTypeAndEventLevel')
              ]).then(function (data) {
                _self.editData = data[0].data
                _self.levelProtectData = data[1].data
                _self.logTypeList = data[1].data.logSourceTypeList
                _self.eventTypeList = data[1].data.eventLevelList
                _self.eyeDialog = true
              })
            }
          },
          {
            name: '编辑',
            icon: 'edit',
            click(row) {
              _self.alarmRuleListCache = []
              _self.currentStep = 0;
              Promise.all([
                $axios.get('/strategyInfo/getStrategyInfoByUuid/' + row.uuid),
                $axios.get('/strategyInfo/getProtectInfo/1'),
                $axios.get('/strategyInfo/getLogSourceTypeAndEventLevel')
              ]).then(function (data) {
                _self.editData = data[0].data
                _self.levelProtectData = data[1].data
                _self.logTypeList = data[1].data.logSourceTypeList
                _self.eventTypeList = data[1].data.eventLevelList
                _self.editDialog = true
              })
            }
          },
          {
            name: '删除',
            icon: 'delete',
            click(row) {
              _self.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                // [row.uuid]
                _self.handleDelete([row])
              }).catch(() => {});
            }
          }
        ]
      },
      handleSelectionChange(selection) {
        this.selectionList = selection
      },
      getData() {
        $axios.get('/strategyInfo/getStrategyInfoList').then(({data}) => {
          this.data = data
        })
      },
      addWarning() {
        $axios.get('/alarmRule/getAlarmRuleList').then(({data}) => {
          this.warnListData = data
          this.warningListDialog = true
        })
      },
      submitWarningList() {
        this.alarmRuleListCache = this.alarmRuleListCache.concat(this.$refs.warnList.selectionList)
        this.warningListDialog = false
      },
      initAlarm(data) {
        this.alarmRuleListCache = cloneDeep(data)
      },
      deleteAlarm(selection) {
        if (!selection) {
          return
        }
        let uuids = selection.map(function (item) {
          return item.uuid
        })
        this.alarmRuleListCache = this.alarmRuleListCache.filter(function (item) {
          if (uuids.indexOf(item.uuid) === -1) {
            return true
          }
          return false
        })
      },
      submitAddEvent() {
        this.$refs.addEvent.validate((valid) => {
          if (valid) {
            if ((this.$refs.addEvent.form.isAlarm === 1) && (this.$refs.addEvent.selectedAlarm.length <= 0)) {
              this.$message({type: 'error', message: '请选择告警方式'});
              return false;
            } else {
              this.addDialog = false
              let data = this.$refs.addEvent.getFormData()
              let strategyIncidentSendUuidList = this.$refs.addEvent.selectedAlarm.map(function (item) {
                return item.uuid;
              });
              let param = Object.assign({}, data, {
                infoSendUuidList: strategyIncidentSendUuidList,
                incidentFlow: data.isAlarm
              })
              $axios.post('strategyInfo/saveStrategyInfo', param).then(({data}) => {
                if (data === 'success') {
                  this.$message.success('保存成功')
                  this.getData()
                } else {
                  this.$message.error('保存失败')
                }
              })
            }
          }
        })
      },
      submitEditEvent() {
        this.$refs.editEvent.validate((valid) => {
          if (valid) {
            if ((this.$refs.editEvent.form.isAlarm === 1) && (this.$refs.editEvent.selectedAlarm.length <= 0)) {
              this.$message({type: 'error', message: '请选择告警方式'});
              return false;
            } else {
              this.editDialog = false
              let data = this.$refs.editEvent.getFormData()
              //  console.log(this.$refs.editEvent.alarmList)
              let strategyIncidentSendUuidList = this.$refs.editEvent.selectedAlarm.map(function (item) {
                return item.uuid;
              });
              data.uuid = this.editData.uuid
              let param = Object.assign({}, data, {
                infoSendUuidList: strategyIncidentSendUuidList,
                incidentFlow: data.isAlarm
              })
              $axios.post('/strategyInfo/updateStrategyInfo', param).then(({data}) => {
                if (data === 'success') {
                  this.$message.success('保存成功')
                  this.getData()
                } else {
                  this.$message.error('保存失败')
                }
              })
            }
          }
        })
      },
      handleDelete(params) {
        let arr = params.map(function (item) {
          return item.uuid
        })
        $axios.post('/strategyInfo/deleteStrategyInfo', arr, {
          data: params,
          logTemplate: '删除|日志审计规则(#name#)'
        }).then(({data}) => {
          if (data === 'success') {
            this.$message.success('删除成功')
            this.getData()
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      handleSwitchChange(row) {
        let self = this
        this.$nextTick(function () {
          let text = ''
          if (row.isOpen) {
            text = '开启'
          } else {
            text = '关闭'
          }
          self.$confirm('确定' + text + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`/strategyInfo/openOrStopStrategyInfo/${row.uuid}`).then(function ({data}) {
              if (data === 'success') {
                self.$message.success('设置成功')
                self.getData()
              } else {
                self.$message({type: 'error', message: '设置失败'});
                self.$set(row, 'isOpen', row.isOpen === 1 ? 0 : 1)
                self.data = Object.assign([], self.data)
              }
            })
          }).catch(function () {
            self.$set(row, 'isOpen', row.isOpen === 1 ? 0 : 1)
            self.data = Object.assign([], self.data)
          });
        })
      },
      setCurrentStep(val) {
        this.currentStep = val;
      },
      next () {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/strategyInfo/judgeStrategyName', {
            name: that.$refs.addEvent.form.name
          }).then((res) => {
            if (res.data.state === false) {
              that.$message({type: 'error', message: res.data.errormsg});
            } else {
              that.currentStep ++;
            }
          });
        } else {
          that.currentStep ++;
        }
      },
      editNext () {
        let that = this;
        if (that.currentStep === 0) {
          $axios.post('/strategyInfo/judgeStrategyName', {
            name: that.$refs.editEvent.form.name,
            uuid: this.editData.uuid
          }).then((res) => {
            if (res.data.state === false) {
              that.$message({type: 'error', message: res.data.errormsg});
            } else {
              that.currentStep ++;
            }
          });
        } else {
          that.currentStep ++;
        }
      }
    }
  };
</script>
