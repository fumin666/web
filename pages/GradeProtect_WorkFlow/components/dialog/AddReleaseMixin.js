/*
  * @Author: fumin
 * @Date: 2020-3-12
 * @LastEditors: fumin
  @Description: 等级保护-等保工作流-工作下发=公共方法 */
import $axios from 'sunflower-ajax';
import {Validaters, timeStamp, parseNumAllTime, intersectObj} from 'sunflower-common-utils';
import {cloneDeep} from 'lodash'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    bulletinTypeUuid: {
      type: String,
      default: ''
    },
    incidentUuid: { // 事件的uuid
      type: String,
      default: ''
    },
    rowData: {
      type: Object,
      default: {}
    }
  },
  data() {
    let checkTaskStartTime = (rule, value, callback) => {  // 校验下发时间
      if (value && this.bulletinForm.orderStartTime !== null) {
        if (timeStamp(this.bulletinForm.orderStartTime) - timeStamp(this.bulletinForm.startTime) < 0) {
          callback(new Error('下发时间应小于等于启动时间！'));
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    let checkTaskEndTime = (rule, value, callback) => {  // 校验结束时间
      if (value && this.bulletinForm.orderStartTime !== null) {
        if (timeStamp(this.bulletinForm.endTime) - timeStamp(this.bulletinForm.orderStartTime) > 0) {
          callback()
        } else {
          callback(new Error('结束时间应大于启动时间！'));
        }
      } else {
        callback()
      }
    };
    let checkNoticeStartTime = (rule, value, callback) => {  // 校验通知时间
      if (value) {
        if (this.bulletinForm.safeTaskEmailNotice.startUnit === 1) {
          if (parseInt(value) < 1 || parseInt(value) > 9999) {
            callback(new Error('请输入1~9999的正整数！'));
          } else {
            callback()
          }
        } else if (this.bulletinForm.safeTaskEmailNotice.startUnit === 2) {
          if (parseInt(value) < 1 || parseInt(value) > 23) {
            callback(new Error('请输入大于等于1小于等于23的正整数！'));
          } else {
            callback()
          }
        } else if (this.bulletinForm.safeTaskEmailNotice.startUnit === 3) {
          if (parseInt(value) < 15 || parseInt(value) > 60) {
            callback(new Error('请输入大于等于15小于等于60的正整数！'));
          } else {
            callback()
          }
        }
      }
    };
    let checkNoticeEndTime = (rule, value, callback) => {  // 校验通知时间
      if (value) {
        if (this.bulletinForm.safeTaskEmailNotice.endUnit === 1) {
          if (parseInt(value) < 1 || parseInt(value) > 9999) {
            callback(new Error('请输入1~9999的正整数！'));
          } else {
            callback()
          }
        } else if (this.bulletinForm.safeTaskEmailNotice.endUnit === 2) {
          if (parseInt(value) < 1 || parseInt(value) > 23) {
            callback(new Error('请输入大于等于1小于等于23的正整数！'));
          } else {
            callback()
          }
        } else if (this.bulletinForm.safeTaskEmailNotice.endUnit === 3) {
          if (parseInt(value) < 15 || parseInt(value) > 60) {
            callback(new Error('请输入大于等于15小于等于60的正整数！'));
          } else {
            callback()
          }
        }
      }
    };
    let maxValue = (rule, value, callback) => {  // 最大值
      if (value !== '') {
        if (value <= 9999) {
          callback()
        } else {
          callback(new Error('最大长度为4'));
        }
      } else {
        callback()
      }
    };
    return {
      bulletinForm: {
        typeUuid: '', // 通报类型（菜单）
        cycleTaskStatus: 0, // 是否周期任务
        startTime: null,
        endTime: null,
        orderStartTime: null,  // 启动时间
        onceTaskTime: '',  // 单词任务时间
        excutorType: 1,  // 下发方式
        departUuidList: [],  // 部门
        roleUuidList: [],  // 角色
        userUuidList: [], // 人员
        safeTaskEmailNotice: { // 邮件通知
          startNoticeStatus: 1,
          startValue: 1,
          startUnit: 1,
          endNoticeStatus: 1,
          endValue: 1,
          endUnit: 1
        },
        tScheduleTime: {
          timeType: 1,
          day: 1,
          week: 1,
          month: 1,
          year: 1,
          dayOfWeek: [2],
          dayOfMonth: [1],
          monthOfYear: 1,
          isForever: 0
        },
        safeTaskAttrValues: []
      },
      tScheduleTime: {
        timeType: 1,
        day: 1,
        week: 1,
        month: 1,
        year: 1,
        dayOfWeek: [2],
        dayOfMonth: [1],
        monthOfYear: 1,
        isForever: 0
      },
      immediatelyIssued: true, // 立即下发
      immediatelyStart: false, // 立即启动
      nerverEnd: false, // 永不结束
      showPeriodItem: false,
      isNeedItil: 0,  // 是否流程
      isCycle: false,  // 是否周期任务
      departFlag: false,
      roleFlag: false,
      userFlag: false,
      neveCheckValue: '',
      bulletinRules: {
        typeUuid: [Validaters.SelectValNotNull],
        startTime: [{required: true, message: '不能为空', trigger: 'blur'},
          {validator: checkTaskStartTime, trigger: 'blur'},
          Validaters.LargerNowDate
        ],
        orderStartTime: [
          {required: true, message: '不能为空', trigger: 'blur'},
          Validaters.LargerNowDate
        ],
        endTime: [{required: true, message: '不能为空', trigger: 'blur'},
          {validator: checkTaskEndTime, trigger: 'blur'},
          Validaters.LargerNowDate
        ],
        departUuidList: [{type: 'array', required: true, message: '不能为空', trigger: 'change'}],
        roleUuidList: [{type: 'array', required: true, message: '不能为空', trigger: 'change'}],
        onceTaskTime: [Validaters.NotNull, Validaters.integerNum, {
          validator: maxValue,
          trigger: 'blur'
        }],
        'safeTaskEmailNotice.startValue': [Validaters.NotNull, Validaters.integerNum, {
          validator: checkNoticeStartTime,
          trigger: 'blur'
        }],
        'safeTaskEmailNotice.endValue': [Validaters.NotNull, Validaters.integerNum, {
          validator: checkNoticeEndTime,
          trigger: 'blur'
        }]
      }
    }
  },
  components: {},
  created() {
    if (Object.keys(this.rowData).length !== 0) {
      this.getEditData()
    }
    this.getOptionData()
    this.$nextTick(() => {
      this.getUserList();
    })
  },
  mounted() {
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
    'bulletinForm.typeUuid': {
      // immediate: true,
      handler(val) {
        if (val) {
          this.safeTypeList.map(v => {
            if (v.uuid === val) {
              this.customData = v.safeTypeAttrs
              this.isNeedItil = v.needItil
            }
          })
        }
      }
    },
    'bulletinForm.cycleTaskStatus': {
      deep: true,
      handler: function (val) {
        val === 0 ? this.showPeriodItem = false : this.showPeriodItem = true
      }
    },
    immediatelyIssued: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.bulletinForm.startTime = null
          this.$set(this.bulletinRules.startTime[0], 'required', false)
          if (this.$refs.taskForm) {
            this.$refs.taskForm.clearValidate('startTime');
          }
        } else {
          this.$set(this.bulletinRules.startTime[0], 'required', true);
        }
        if (this.isNeedItil === 0) {
          this.immediatelyStart = true
        }
      }
    },
    immediatelyStart: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.bulletinForm.orderStartTime = null
          this.$set(this.bulletinRules.orderStartTime[0], 'required', false)
          if (this.$refs.taskForm) {
            this.$refs.taskForm.clearValidate('orderStartTime');
          }
        } else {
          this.$set(this.bulletinRules.orderStartTime[0], 'required', true);
        }
      }
    },
    nerverEnd: {
      handler: function (val) {
        if (val) {
          this.bulletinForm.endTime = null
          this.$set(this.bulletinRules.endTime[0], 'required', false)
          if (this.$refs.taskForm) {
            this.$refs.taskForm.clearValidate('endTime');
          }
        } else {
          this.$set(this.bulletinRules.endTime[0], 'required', true);
        }
      }
    },
    'bulletinForm.startTime': {
      deep: true,
      handler: function (val) {
        if (val) {
          this.immediatelyIssued = false
        } else {
          this.immediatelyIssued = true
        }
        if (this.isNeedItil === 0) {
          this.bulletinForm.orderStartTime = this.bulletinForm.startTime
        }
      }
    },
    'bulletinForm.orderStartTime': {
      deep: true,
      handler: function (val) {
        val ? this.immediatelyStart = false : this.immediatelyStart = true
      }
    },
    'bulletinForm.endTime': {
      deep: true,
      handler: function (val) {
        val ? this.nerverEnd = false : this.nerverEnd = true
      }
    },
    'bulletinForm.excutorType': {
      deep: true,
      handler: function (val) {
        if (val === 1) {
          if (this.$refs.objectForm) {
            this.$refs.objectForm.clearValidate('departUuidList');
          }
        } else if (val === 2) {
          if (this.$refs.objectForm) {
            this.$refs.objectForm.clearValidate('roleUuidList');
          }
        } else {
          this.$nextTick(() => {
            this.getUserList();
          })
          if (this.$refs.objectForm) {
            this.$refs.objectForm.clearValidate('roleUuidList');
            this.$refs.objectForm.clearValidate('departUuidList');
          }
        }
      }
    }
  },
  methods: {
    getEditData() { // 获取编辑数据
      this.customData = this.rowData.safeTaskAttrValues
      this.rowData.startTime = this.rowData.startTime !== null ? parseNumAllTime(this.rowData.startTime) : null;
      this.rowData.orderStartTime = this.rowData.orderStartTime !== null ? parseNumAllTime(this.rowData.orderStartTime) : null;
      this.rowData.endTime = this.rowData.endTime !== null ? parseNumAllTime(this.rowData.endTime) : null;

      if (this.rowData.tScheduleTime !== null) {
        this.rowData.tScheduleTime.isForever = 1
      }
      this.bulletinForm = intersectObj(this.bulletinForm, this.rowData) // 给表单赋值
      if (this.bulletinForm.excutorType === 3) { // 回显选中的人员
        this.selections = this.rowData.userList
      }
      setTimeout(() => {
        this.bulletinForm.orderStartTime = this.rowData.orderStartTime // 修改启动时间（阻止watch监听下发时间和启动时间一致）
      }, 1000)
    },
    getOptionData() {
      $axios.get(`/safetyPlatform/bulletinIssuedTask/toCreateBulletinIssuedTask`).then(({data}) => {
        this.safeTypeList = data.safeTypeList.filter(item => {
          return (item.bulletinName === '等保工作-简化版') || (item.bulletinName === '等保工作-最佳实践')
        })
        this.safeRoleList = data.safeRoleList.filter(v => {
          if (v.roleName === '等保工作人员') {
            return v
          }
        })
        this.departmentList = data.departmentList
        this.bulletinForm.typeUuid = this.bulletinTypeUuid
      })
    },
    getUserList() { // 人员列表
      let params = {
        searchKey: this.searchKey,
        roleType: 3
      }
      this.ajaxObj.params.condition = params;
      this.ajaxObj.checkedUuidArr = this.selections;
    },
    selectionChange(selections) { // 选择的数据
      this.selections = selections;
    },
    validateForm() { // 自定义属性验证
      let validRes = false;
      this.$refs['customRef'].$refs['customForm'].validate((valid) => {
        if (valid) validRes = true;
      });
      return validRes;
    },
    saveRelease() {
      let vm = this;
      vm.flag = true
      let params = cloneDeep(vm.bulletinForm)
      let customForm = vm.$refs['customRef'].customForm
      params.safeTaskAttrValues = this.customData.map(item => { // 重组通报内容自定义表单属性
        for (let key in customForm) {
          if (item.uuid === key) {
            let newData = {
              attrUuid: item.uuid,
              attrName: item.attrName,
              attrDesc: item.attrDesc,
              attrType: item.attrType,
              isRequired: item.isRequired,
              attrValue: customForm[key]
            };
            if (Object.keys(this.rowData).length !== 0) { // 编辑
              newData.uuid = item.uuid;
              newData.taskUuid = item.taskUuid;
              newData.attrUuid = item.attrUuid;
            }
            if (item.attrType === 6 && vm.$refs['customRef'].resList !== null) { // 如果是附件
              // newData.attachmentUuidList = [vm.$refs['customRef'].fileList.safeAttachmentUuid]
              newData.attachmentUuidList = vm.$refs['customRef'].fileList.map(v => (v.response ? v.response.safeAttachmentUuid : v.safeAttachmentUuid))
            }
            return newData
          }
        }
      });
      params.startTime = timeStamp(params.startTime)
      params.orderStartTime = timeStamp(params.orderStartTime)
      params.endTime = timeStamp(params.endTime)
      if (params.startTime !== null && params.orderStartTime === null) {
        vm.$message({type: 'warning', message: '设定下发时间后不可以立即启动'});
        vm.activeNames = 'bulletinTask'
        return
      }
      if (this.bulletinForm.excutorType === 3) { // 通报对象人员判断
        if (this.selections.length !== 0) {
          params.userUuidList = this.selections.map(item => item.uuid)
        } else {
          vm.$message({type: 'warning', message: '请选择人员'});
          vm.activeNames = 'bulletinObject'
          return
        }
      }
      params = this.formattScheduleTime(Object.assign({}, params))// 重组周期任务参数
      if (params.endTime === null) {
        params.tScheduleTime.isForever = 1
      }
      if (this.incidentUuid !== '') { // 如果是从事件中心进来
        params.incidentUuid = this.incidentUuid
      }
      if (params.cycleTaskStatus === 1) { // 计算周期天数
        let dayCount = 0
        for (let key in params.tScheduleTime) {
          if (key === 'day') {
            dayCount = params.tScheduleTime[key]
          } else if (key === 'week') {
            dayCount = parseInt(params.tScheduleTime[key]) * 7
          } else if (key === 'month') {
            dayCount = parseInt(params.tScheduleTime[key]) * 31
          } else if (key === 'year') {
            dayCount = parseInt(params.tScheduleTime[key]) * 365
          }
        }
        if (params.onceTaskTime > dayCount) {
          vm.activeNames = 'bulletinTask'
          vm.$message({type: 'warning', message: '单次任务持续时间应小于等于周期'});
          vm.flag = false
          return;
        }
      }
      vm.$refs['contentForm'].validate((valid1) => {
        if (valid1) {
          if (vm.validateForm()) { // 自定义属性验证
            vm.$refs['taskForm'].validate((valid2) => {
              if (valid2) {
                vm.$refs['objectForm'].validate((valid3) => {
                  if (valid3) {
                    vm.$refs['noticeForm'].validate((valid4) => {
                      if (valid4) {
                        if (Object.keys(this.rowData).length !== 0) {
                          vm.axiosUrl = '/safetyPlatform/bulletinIssuedTask/updateBulletinIssuedTask'
                          params.uuid = this.rowData.uuid
                        }
                        let attrValue = params.safeTaskAttrValues[0].attrValue
                        let obj = {
                          logTemplate: Object.keys(this.rowData).length !== 0 ? `编辑|等保工作(${attrValue})` : `下发|等保工作(${attrValue})`
                        }
                        $axios.post(vm.axiosUrl, params, obj).then(({data}) => {
                          if (data.state) {
                            vm.$emit('updateTable')
                            vm.$message({type: 'success', message: data.errormsg});
                            vm.dialogFlag = false;
                            vm.flag = false
                          } else {
                            vm.$message({type: 'error', message: data.errormsg})
                            vm.flag = false
                          }
                        });
                      } else {
                        vm.activeNames = 'bulletinNotice'
                        vm.$message({type: 'error', message: '请正确填写信息'});
                        vm.flag = false
                      }
                    })
                  } else {
                    vm.activeNames = 'bulletinObject'
                    vm.$message({type: 'error', message: '请正确填写信息'});
                    vm.flag = false
                  }
                })
              } else {
                vm.activeNames = 'bulletinTask'
                vm.$message({type: 'error', message: '请正确填写信息'});
                vm.flag = false
              }
            })
          } else {
            vm.activeNames = 'bulletinContent'
            vm.$message({type: 'error', message: '请正确填写信息'});
            vm.flag = false
          }
        } else {
          vm.activeNames = 'bulletinContent'
          vm.$message({type: 'error', message: '请正确填写信息'});
          vm.flag = false
        }
      })
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
      if (newForm.cycleTaskStatus === 0) {
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
    delNotNeedKey(arr, target) {
      for (var key in target) {
        if (arr.indexOf(key) < 0) {
          delete target[key]
        }
      }
      return target
    }
  }
}
