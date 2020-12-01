<template>
  <div>
    <s-dialog v-model="dialogFlag" :title="(this.isEdit ? '编辑' : '新增') + '巡检任务'" width="700px" class="pollingTaskAddDialog">
      <s-tab>
        <s-tab-pane label="基础设定">
          <s-form :model="taskForm" :rules="taskRules" label-width="120px" ref="taskForm">
            <s-form-item label="巡检名称" prop="inspectName">
              <s-input v-model="taskForm.inspectName"></s-input>
            </s-form-item>
            <s-form-item label="是否周期任务" prop="isPeriod">
              <s-radio-group v-model="taskForm.isPeriod">
                <s-radio :label="0">否</s-radio>
                <s-radio :label="1">是</s-radio>
              </s-radio-group>
            </s-form-item>
            <s-period v-model="taskForm.tScheduleTime" v-if="periodShow" :isShowNow="'is-show-now'" :showPeriodItem="showPeriodItem" ref="period"></s-period>
            <s-form-item label="备注" prop="inspectDesc">
              <s-input v-model="taskForm.inspectDesc" type="textarea" :row="3"></s-input>
            </s-form-item>
          </s-form>
        </s-tab-pane>
        <s-tab-pane label="巡检对象">
            <s-row class="topRow">
              <s-button icon="plus" @click="add">添加</s-button>
              <s-button icon="delete" @click="del">删除</s-button>
            </s-row>
            <s-table-page :data="tableData" @selection-change="selectionChange"  max-height="455">
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="资产名称" prop="itcompName" show-overflow-tooltip></s-table-column>
              <s-table-column label="IP地址" prop="controlAdderss"></s-table-column>
              <s-table-column label="资产类别" prop="citypeName" v-if="isAssets">
              </s-table-column>
              <s-table-column label="资产类别" prop="modelNumber" v-if="!isAssets">
              </s-table-column>
              <s-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <i class="iconfont icon-delete" @click="rowDel(scope.row)"></i>
                </template>
              </s-table-column>
            </s-table-page>
        </s-tab-pane>
        <s-tab-pane label="通知方式">
          <s-row class="title">邮件</s-row>
          <s-row>
            <s-col span="8">启用邮件发送</s-col>
            <s-col span="16"><s-switch v-model="openEmail"></s-switch></s-col>
          </s-row>
          <s-row v-show="openEmail">
            <s-row class="opeRow">
              <s-button icon="plus" @click="addQuoteManual">手动添加</s-button>
              <s-button icon="link" @click="addQuoteAuto">添加引用</s-button>
              <s-button icon="delete" @click="delQuote">删除引用</s-button>
            </s-row>
            <s-table style="width: 100%;" :data="quoteList" @selection-change="quoteSelectionChange"  max-height="450">
              <s-table-column type="selection" width="45" align="center"></s-table-column>
              <s-table-column label="真实姓名" prop="accountName"></s-table-column>
              <s-table-column label="Email" prop="email"></s-table-column>
            </s-table>
          </s-row>
        </s-tab-pane>
      </s-tab>
      <template slot="footer" class="dialog-footer">
        <s-button @click="dialogOk">确定</s-button>
        <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
      </template>
    </s-dialog>

    <select-asset-dialog v-model="selectAssetDialogFlag" v-if="selectAssetDialogFlag" @selected="selectAsset" :selected-list="tableData">
    </select-asset-dialog>

    <add-quote-manual-dialog  v-model="addQuoteManualDialog" v-if="addQuoteManualDialog" @add-quote="addQuoteManualCb">
    </add-quote-manual-dialog>
    <add-quote-auto-dialog
      v-model="addQuoteAutoDialog"
      v-if="addQuoteAutoDialog"
      :user-list="userList"
      :has-select="hasSelectUser"
      @add-quote="addQuoteAutoCb"></add-quote-auto-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  import selectAssetDialog from './SelectAssetDialog.vue';
  import AddQuoteAutoDialog from './AddQuoteAutoDialog';
  import AddQuoteManualDialog from './AddQuoteManualDialog';
  import sPeriod from '@/components/periodFormItem/Period'
  import {cloneDeep} from 'lodash'

  export default {
    data() {
      return {
        dialogFlag: false,
        selectAssetDialogFlag: false,
        periodShow: false,
        taskForm: {
          inspectName: '',
          isPeriod: 0,
          tScheduleTime: {
            timeType: 1,
            day: 1,
            week: 1,
            month: 1,
            year: 1,
            dayOfWeek: [2],
            dayOfMonth: [1],
            monthOfYear: 1,
            isForever: 0,
            firstFireTime: undefined,
            endFireTime: undefined
          },
          inspectDesc: ''
        },
        taskRules: {
          inspectName: [
            Validaters.NotNull,
            Validaters.Max(30)
          ],
          inspectDesc: [Validaters.Max(200)]
        },
        firstPickerOptions: {},
        lastPickerOptions: {},
        tableData: [],
        selections: [],
        openEmail: false,
        userList: [], // 引用列表
        quoteList: [],
        quoteSelections: [],
        addQuoteManualDialog: false,
        addQuoteAutoDialog: false,
        isAssets: false,
        showPeriodItem: false
      }
    },
    props: {
      curPollingTask: {
        type: Object
      },
      curTableData: {
        type: Array
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isEdit() {
        return Object.keys(this.curPollingTask).length > 0;
      },
      hasSelectUser() { // 已经引用的
        return this.quoteList.filter(item => item.accountUuid)
      }
    },
    created() {
       if (this.$route.name === 'autoOps_Polling') {
         this.isAssets = false
       } else {
         this.isAssets = true
       }
      if (this.isEdit) {
        $axios.get(`/assetInspectTask/get/${this.curPollingTask.uuid}`).then(({data}) => {
          for (let i in this.taskForm) {
            this.taskForm[i] = data.task[i];
          }
          this.periodShow = true
          this.tableData = data.assets.map(item => ({
            itcompName: item.assetName,
            controlAdderss: item.ipAddress,
            citypeName: item.assetType,
            modelNumber: item.modelNumber,
            uuid: item.assetUuid
          }));
          this.openEmail = data.notices.length > 0;
          this.quoteList = data.notices;
        })
      } else {
        this.periodShow = true
      }
      this.axiosUserList();
    },
    methods: {
      validatorAny(rule, value, callback) {
        callback();
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      add() {
        this.selectAssetDialogFlag = true;
      },
      _trim(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
      },
      del() {
        if (this.selections.length === 0) {
          this.$message({message: '请先选择资产！', type: 'warning'});
          return;
        }
        this.selections.forEach(item => {
          let index = this.tableData.findIndex(innerItem => innerItem.uuid === item.uuid);
          this.tableData.splice(index, 1);
        });
      },
      rowDel(row) {
        let index = this.tableData.findIndex(item => row.uuid === item.uuid);
        this.tableData.splice(index, 1);
      },
      selectAsset(arr) {
        this.tableData = this.tableData.concat(arr);
      },
      getTimeStamp(str) {
        if (str === null) return str;
        return parseInt(new Date(str).getTime() / 1000);
      },
      quoteSelectionChange(selections) {
        this.quoteSelections = selections;
      },
      axiosUserList() {
        $axios.post('/iamUserInfo/list', {}).then(({data}) => {
          if (data && data instanceof Array) {
            this.userList = data.map(item => {
              item.accountName = item.userRealName;
              item.email = item.userMail;
              item.accountUuid = item.uuid;
              return item;
            })
          }
        });
      },
      addQuoteManual() {
        this.addQuoteManualDialog = true;
      },
      addQuoteAuto() {
        this.addQuoteAutoDialog = true;
      },
      delQuote() {
        if (this.quoteSelections.length === 0) {
          this.$message({message: '请选择要删除的数据', type: 'warning'});
          return;
        }
        this.quoteSelections.forEach(delItem => {
          for (let j = 0; j < this.quoteList.length; j++) {
            let item = this.quoteList[j];
            if ((delItem.accountUuid && delItem.accountUuid === item.accountUuid) ||
              (!delItem.accountUuid &&
                delItem.accountName === item.accountName &&
                delItem.email === item.email)) {
                this.quoteList.splice(j, 1);
                break;
            }
          }
        });
      },
      addQuoteManualCb(obj) {
        let arr = this.quoteList;
        for (let i in arr) {
          if (arr[i].email === obj.email) {
            this.$message({message: '不能添加相同的Email', type: 'warning'});
            return
          }
        }
        this.quoteList.push(obj);
      },
      addQuoteAutoCb(arr) {
        let _this = this;
        let handleArr = this.quoteList.filter(item => !item.accountUuid)
        let autoArr = JSON.parse(JSON.stringify(arr));
          handleArr.forEach(function(obj1) {
            arr.forEach(function(obj2) {
                if (obj1.email === obj2.email) {
                  _this.$message({message: `列表已存在邮箱${obj1.email},不能添加相同的email`, type: 'warning'});
                  autoArr = autoArr.filter(item => item.email !== obj1.email);
                }
            })
          })
        this.quoteList = handleArr.concat(autoArr);
      },
      filterNotices(arr) {
        if (!this.openEmail) return [];
        return arr.map(item => {
          if (item.accountUuid) {
            return {accountUuid: item.accountUuid}
          } else {
            return item;
          }
        })
      },
      delNotNeedKey(arr, target) {
        for (var key in target) {
          if (arr.indexOf(key) < 0) {
            delete target[key]
          }
        }
        return target
      },
      formattScheduleTime(obj) {
        const notPeriod = ['timeType', 'firstFireTime']
        const dayKeys = ['timeType', 'firstFireTime', 'endFireTime', 'day']
        const dayKeysForever = ['timeType', 'firstFireTime', 'isForever', 'day']
        const weekKeys = ['timeType', 'firstFireTime', 'endFireTime', 'week', 'dayOfWeek']
        const weekKeysForever = ['timeType', 'firstFireTime', 'isForever', 'week', 'dayOfWeek']
        const monthKeys = ['timeType', 'firstFireTime', 'endFireTime', 'month', 'dayOfMonth']
        const monthKeysForever = ['timeType', 'firstFireTime', 'isForever', 'month', 'dayOfMonth']
        const yearKeys = ['timeType', 'firstFireTime', 'endFireTime', 'year', 'dayOfMonth', 'monthOfYear']
        const yearKeysForever = ['timeType', 'firstFireTime', 'isForever', 'year', 'dayOfMonth', 'monthOfYear']
        let newForm = cloneDeep(obj)
        if (newForm.isPeriod === 0) {
          newForm.tScheduleTime = this.delNotNeedKey(notPeriod, newForm.tScheduleTime)
          newForm.tScheduleTime.timeType = 7
        } else {
          let type = newForm.tScheduleTime.timeType
          let forever = newForm.tScheduleTime.isForever
          if (type === 1) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(dayKeys, newForm.tScheduleTime)
            }
          }
          if (type === 2) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(weekKeys, newForm.tScheduleTime)
            }
          }
          if (type === 3) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(monthKeys, newForm.tScheduleTime)
            }
          }
          if (type === 4) {
            if (forever === 1) {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeysForever, newForm.tScheduleTime)
            } else {
              newForm.tScheduleTime = this.delNotNeedKey(yearKeys, newForm.tScheduleTime)
            }
          }
        }
        for (let key in newForm.tScheduleTime) {
          // 转日期为int
          if ((key === 'firstFireTime' || key === 'endFireTime') && newForm.tScheduleTime[key] !== null) {
            newForm.tScheduleTime[key] = parseInt(new Date(newForm.tScheduleTime[key]).getTime() / 1000)
          }
          // 转数组为字符串
          if ((key === 'dayOfWeek' || key === 'dayOfMonth') && newForm.tScheduleTime[key].length > 0) {
            newForm.tScheduleTime[key] = newForm.tScheduleTime[key].join(',')
          }
          // 依据不同情况删除多余字段
        }
        return newForm
      },
      dialogOk() {
        if (this.tableData.length === 0) {
          this.$message({message: '请选择巡检对象！', type: 'warning'});
          return;
        }
        if (this.openEmail && this.quoteList.length === 0) {
          this.$message({message: '请添加要通知的邮件！', type: 'warning'});
          return;
        }
        this.$refs.taskForm.validate(valid => {
          if (!valid) {
            this.$message({showClose: true, message: '请检查填写内容!', type: 'warning'});
            return;
          } else {
            this.$refs.period.$refs.periodForm.validate((v) => {
              if (!v) {
                this.$message({showClose: true, message: '请检查填写内容!', type: 'warning'});
              } else {
                this.taskForm.inspectName = this._trim(this.taskForm.inspectName);
                if (this.curTableData.length > 0) {
                  let arr = [];
                  if (this.isEdit) {
                    let index = this.curTableData.indexOf(this.curPollingTask);
                    arr = this.curTableData.concat();
                    arr.splice(index, 1);
                    for (let i in arr) {
                      if (arr[i].inspectName === this.taskForm.inspectName) {
                        this.$message({
                          type: 'warning',
                          message: '巡检名称不能重复，请重新设置'
                        })
                        return;
                      }
                    }
                  } else {
                    for (let i in this.curTableData) {
                      if (this.curTableData[i].inspectName === this.taskForm.inspectName) {
                        this.$message({
                          type: 'warning',
                          message: '巡检名称不能重复，请重新设置'
                        })
                        return;
                      }
                    }
                  }
                }
                this.taskForm = this.formattScheduleTime(this.taskForm)
                let task = {}
                if (this.$route.path === '/AssetsAll/assets_polling') {
                  task = Object.assign({}, this.taskForm, {inspectType: 0})
                } else {
                  task = Object.assign({}, this.taskForm, {inspectType: 1})
                }
                let param = {
                  task: task,
                  assets: this.tableData.map(item => ({assetUuid: item.uuid})),
                  notices: this.filterNotices(this.quoteList)
                };
                $axios.post(`assetInspectTask/isTrigger`, task).then(({data}) => {
                  if (!data) {
                    this.$message({type: 'warning', message: '开始时间或结束时间设置不合理，请重新选择!'});
                    return;
                  }
                  let urlTail = this.isEdit ? 'update' : 'add';
                  this.isEdit && (param.task.uuid = this.curPollingTask.uuid);
                  let obj = {
                    data: [param],
                    logTemplate: this.isEdit ? '编辑|巡检任务(#inspectName#)' : '添加|巡检任务(#inspectName#)'
                  }
                  $axios.post(`/assetInspectTask/${urlTail}`, param, obj).then(({data}) => {
                    if (data === true) {
                      this.$message({showClose: true, message: '保存成功!', type: 'success'});
                      this.$emit('reload');
                      this.dialogFlag = false;
                    } else {
                      this.$message({showClose: true, message: '保存失败!', type: 'error'});
                    }
                  })
                });
              }
            });
          }
        });
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
      'taskForm.isPeriod': {
        handler: function (val) {
          val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
        },
        deep: true
      }
    },
    components: {
      selectAssetDialog,
      AddQuoteManualDialog,
      AddQuoteAutoDialog,
      sPeriod
    }
  }
</script>

<style lang="stylus">

</style>
