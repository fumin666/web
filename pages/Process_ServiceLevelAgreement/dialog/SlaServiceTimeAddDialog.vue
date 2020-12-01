<template>
  <s-dialog v-model="dialogFlag"
            :title="isSee ? '查看服务时间详情' : (isEdit ? '编辑服务时间' : '创建服务时间')"
            width="600px"
            class="slaServiceTimeAddDialog">
    <s-scrollbar wrap-class="adDomainAddScrollbar">
      <s-form :model="slaServiceTimeForm"
              :rules="slaServiceTimeRule"
              ref="slaServiceTimeForm"
              label-width="120px">
        <s-form-item label="服务时间名称"
                     prop="servicetimeTitle">
          <s-input :disabled="isSee"
                   v-model="slaServiceTimeForm.servicetimeTitle"
                   style="width:90%"></s-input>
        </s-form-item>
        <s-form-item label="服务时间"
                     prop="servicetimeName">
          <s-select :disabled="isSee"
                    v-model="slaServiceTimeForm.servicetimeName"
                    style="width:90%">
            <s-option label="5*8"
                      value="5*8"></s-option>
            <s-option label="7*24"
                      value="7*24"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item v-if="slaServiceTimeForm.servicetimeName !== '7*24'"
                     label="上班时间"
                     prop="startTime">
          <s-time-picker :disabled="isSee"
                         v-model="slaServiceTimeForm.startTime"
                         :picker-options="startTimeOptions"
                         placeholder="选择上班时间"
                         :editable="false"
                         value-format="HH:mm:ss"
                         format="HH:mm:ss"
                         style="width:90%"></s-time-picker>
        </s-form-item>
        <s-form-item v-if="slaServiceTimeForm.servicetimeName !== '7*24'"
                     label="下班时间"
                     prop="endTime">
          <s-time-picker :disabled="isSee"
                         v-model="slaServiceTimeForm.endTime"
                         :picker-options="endTimeOptions"
                         placeholder="选择下班时间"
                         :editable="false"
                         value-format="HH:mm:ss"
                         format="HH:mm:ss"
                         style="width:90%"></s-time-picker>
        </s-form-item>
        <s-form-item v-if="slaServiceTimeForm.servicetimeName !== '7*24'"
                     label="午休开始时间"
                     prop="restStartTime">
          <s-time-picker :disabled="isSee"
                         v-model="slaServiceTimeForm.restStartTime"
                         :picker-options="restStartTime"
                         placeholder="选择午休开始时间"
                         :editable="false"
                         value-format="HH:mm:ss"
                         format="HH:mm:ss"
                         style="width:90%"></s-time-picker>
        </s-form-item>
        <s-form-item v-if="slaServiceTimeForm.servicetimeName !== '7*24'"
                     label="午休结束时间"
                     prop="restEndTime">
          <s-time-picker :disabled="isSee"
                         v-model="slaServiceTimeForm.restEndTime"
                         :picker-options="restEndTime"
                         placeholder="选择午休结束时间"
                         :editable="false"
                         value-format="HH:mm:ss"
                         format="HH:mm:ss"
                         style="width:90%"></s-time-picker>
        </s-form-item>
        <s-form-item label="描述"
                     prop="servicetimeDesc">
          <s-input :disabled="isSee"
                   v-model="slaServiceTimeForm.servicetimeDesc"
                   type="textarea"
                   style="width:90%"></s-input>
        </s-form-item>
        <s-form-item label="状态"
                     prop="isEnable">
          <s-switch :disabled="isSee"
                    v-model="slaServiceTimeForm.isEnable"
                    :active-value="1"
                    :inactive-value="0"></s-switch>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer"
              class="dialog-footer">
      <s-button :disabled="dialogDisabled"
                v-if="!isSee"
                @click="dialogOk">保存</s-button>
      <s-button v-if="isSee"
                @click="dialogFlag=false">关闭</s-button>
      <s-button type="cancel" v-if="!isSee"
                @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax'
import {Validaters} from 'sunflower-common-utils'
export default {
  data() {
    return {
      data: [],
      dialogFlag: false,
      dialogDisabled: false,
      slaServiceTimeForm: {
        servicetimeTitle: '',
        servicetimeName: '5*8',
        startTime: '',
        endTime: '',
        restStartTime: '',
        restEndTime: '',
        servicetimeDesc: '',
        isEnable: 1
      },
      slaServiceTimeRule: {},
      rules1: {
        servicetimeTitle: [
          {
            pattern: /^[\u4e00-\u9fa5|\w|\-|\.|\(|\)]+$/,
            message: '由中文、字母、数字、符号[ _ - . ( )]组成',
            trigger: 'blur'
          },
          Validaters.NotNull,
          Validaters.Max(30)
        ],
        servicetimeName: [Validaters.NotNull],
        startTime: [Validaters.NotNull],
        endTime: [Validaters.NotNull],
        restStartTime: [Validaters.NotNull],
        restEndTime: [Validaters.NotNull],
        servicetimeDesc: [Validaters.Max(120)],
        isEnable: [Validaters.NotNull, Validaters.Number]
      },
      rules2: {
        servicetimeName: [Validaters.NotNull],
        servicetimeDesc: [Validaters.Max(120)],
        isEnable: [Validaters.NotNull, Validaters.Number]
      },
      restStartTime: {},
      restEndTime: {}
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object
    },
    list: {
      type: Array
    },
    isSee: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.row).length > 0
    },
    startTimeOptions() {
      if (!this.slaServiceTimeForm.endTime) {
        return `00:00:00 - 23:59:59`
      } else {
        let endTime
        let endTimeArr = this.slaServiceTimeForm.endTime.split(':')
        endTimeArr[0]
        let newDate = new Date(
          null,
          null,
          null,
          parseInt(endTimeArr[0]) - 8, // 产品要求中间最小八小时
          parseInt(endTimeArr[1]),
          parseInt(endTimeArr[2])
        )
        endTime = `${
          newDate.getHours() < 10
            ? `0${newDate.getHours()}`
            : newDate.getHours()
          }:${
          newDate.getMinutes() < 10
            ? `0${newDate.getMinutes()}`
            : newDate.getMinutes()
          }:${
          newDate.getSeconds() < 10
            ? `0${newDate.getSeconds()}`
            : newDate.getSeconds()
          }`
        return {selectableRange: `00:00:00 - ${endTime}`}
      }
    },
    endTimeOptions() {
      if (!this.slaServiceTimeForm.startTime) {
        return {selectableRange: `00:00:00 - 23:59:59`}
      } else {
        let startTime
        let startTimeArr = this.slaServiceTimeForm.startTime.split(':')
        startTimeArr[0]
        let newDate = new Date(
          null,
          null,
          null,
          parseInt(startTimeArr[0]) + 8, // 产品要求中间最小八小时
          parseInt(startTimeArr[1]),
          parseInt(startTimeArr[2])
        )
        startTime = `${
          newDate.getHours() < 10
            ? `0${newDate.getHours()}`
            : newDate.getHours()
          }:${
          newDate.getMinutes() < 10
            ? `0${newDate.getMinutes()}`
            : newDate.getMinutes()
          }:${
          newDate.getSeconds() < 10
            ? `0${newDate.getSeconds()}`
            : newDate.getSeconds()
          }`
        return {selectableRange: `${startTime} - 23:59:59`}
      }
    }
  },
  created() {
    if (this.isEdit) {
      $axios
        .get(`/itilSla/getItilSlaServicetime/${this.row.uuid}`)
        .then(({data}) => {
          this.data = {...data}
          for (let i in this.slaServiceTimeForm) {
            this.slaServiceTimeForm[i] = this.data[i]
          }
        })
    }
  },
  methods: {
    dialogOk() {
      let form = this.$refs['slaServiceTimeForm']
      form.validate(valid => {
        if (!valid) {
          return false
        }
        let params = {...this.slaServiceTimeForm}
        this.dialogDisabled = true
        if (this.isEdit) {
          params['uuid'] = this.data.uuid
          $axios.post('/itilSla/updateServiceTime', params, {
            data: [params],
            logTemplate: '编辑|服务时间>服务时间(#servicetimeTitle#)'
          }).then(res => {
            this.dialogDisabled = false
            if (res.data.state === true) {
              this.$message({
                showClose: true,
                message: '更新成功!',
                type: 'success'
              })
              this.$emit('reload')
              this.dialogFlag = false
            } else {
              this.$message({
                showClose: true,
                message: res.data.errormsg,
                type: 'error'
              })
            }
          })
        } else {
          // 新建服务时间
          $axios.post('/itilSla/saveServiceTime', params, {
            data: [params],
            logTemplate: '添加|服务时间>服务时间(#servicetimeTitle#)'
          }).then(res => {
            this.dialogDisabled = false
            if (res.data.state === true) {
              this.$message({
                showClose: true,
                message: '保存成功!',
                type: 'success'
              })
              this.$emit('reload')
              this.dialogFlag = false
            } else {
              this.$message({
                showClose: true,
                message: res.data.errormsg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    disableAfterToday: {
      disabledDate(time) {
        return time.getTime() >= Date.now()
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val
      }
    },
    'slaServiceTimeForm.servicetimeName': {
      immediate: true,
      handler(val) {
        if (val === '7*24') {
          this.slaServiceTimeRule = this.rules2
          this.slaServiceTimeForm.startTime = ''
          this.slaServiceTimeForm.endTime = ''
          this.slaServiceTimeForm.restStartTime = ''
          this.slaServiceTimeForm.restEndTime = ''
        } else {
          this.slaServiceTimeRule = this.rules1
        }
      }
    },
    'slaServiceTimeForm.startTime'(val) {
      if (!this.slaServiceTimeForm.endTime) {
        this.restStartTime = {selectableRange: `${val} - 23:59:58`}
        this.restEndTime = {selectableRange: `${val} - 23:59:58`}
      } else {
        this.restStartTime = {
          selectableRange: `${val} - ${this.slaServiceTimeForm.endTime}`
        }
        this.restEndTime = {
          selectableRange: `${val} - ${this.slaServiceTimeForm.endTime}`
        }
      }
    },
    'slaServiceTimeForm.endTime'(val) {
      if (!this.slaServiceTimeForm.startTime) {
        this.restStartTime = {selectableRange: `00:00:00 - ${val}`}
        this.restEndTime = {selectableRange: `00:00:00 - ${val}`}
      } else {
        this.restStartTime = {
          selectableRange: `${this.slaServiceTimeForm.startTime} - ${val}`
        }
        this.restEndTime = {
          selectableRange: `${this.slaServiceTimeForm.startTime} - ${val}`
        }
      }
    },
    'slaServiceTimeForm.restStartTime'(val) {
      if (!this.slaServiceTimeForm.endTime) {
        this.restEndTime = {selectableRange: `${val} - 23:59:58`}
      } else {
        this.restEndTime = {
          selectableRange: `${val} - ${this.slaServiceTimeForm.endTime}`
        }
      }
    },
    'slaServiceTimeForm.restEndTime'(val) {
      if (!this.slaServiceTimeForm.startTime) {
        this.restStartTime = {selectableRange: `00:00:00 - ${val}`}
      } else {
        this.restStartTime = {
          selectableRange: `${this.slaServiceTimeForm.startTime} - ${val}`
        }
      }
    },
    dialogFlag(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="stylus">
.adDomainAddDialog {
  .adDomainAddScrollbar {
    padding-right: 17px;
    max-height: 500px;
  }
}
</style>
