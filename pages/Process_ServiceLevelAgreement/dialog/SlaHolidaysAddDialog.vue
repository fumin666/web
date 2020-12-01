<template>
  <s-dialog v-model="dialogFlag" :title="isSee ? '查看节假日详情' : (isEdit ? '编辑节假日' : '创建节假日')" width="600px" class="slaHolidaysAddDialog">
    <s-scrollbar wrap-class="adDomainAddScrollbar">
      <s-form :model="slaHolidaysForm" :rules="slaHolidaysRule" ref="slaHolidaysForm" label-width="120px">
        <s-form-item label="节假日名称" prop="holidayName">
          <s-select :disabled="isSee" v-model="holidayName" style="width:90%">
            <s-option label="元旦节" value="元旦节"></s-option>
            <s-option label="春节" value="春节"></s-option>
            <s-option label="清明节" value="清明节"></s-option>
            <s-option label="劳动节" value="劳动节"></s-option>
            <s-option label="端午节" value="端午节"></s-option>
            <s-option label="中秋节" value="中秋节"></s-option>
            <s-option label="国庆节" value="国庆节"></s-option>
            <s-option label="其他" value="其他"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="其他节假日" prop="holidayName" v-if="holidayName === '其他'">
          <s-input :disabled="isSee" v-model="slaHolidaysForm.holidayName" style="width:90%"></s-input>
        </s-form-item>
        <s-form-item label="假期时长" prop="holidayName">
          <s-input-number :disabled="isSee" v-model="slaHolidaysForm.daynumber" @change="daynumberChange" :step="1" :min="1" :max="15" style="width:90%"></s-input-number>
        </s-form-item>
        <s-form-item label="开始日期/时间" prop="startTime">
          <s-date-picker :disabled="isSee" v-model="slaHolidaysForm.startTime" type="date" :clearable="false" placeholder="选择开始时间" :editable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width:90%"></s-date-picker>
        </s-form-item>
        <s-form-item label="截止日期/时间" prop="endTime">
          <s-date-picker :disabled="isSee" v-model="slaHolidaysForm.endTime" type="date" :clearable="false" placeholder="选择截止时间" :editable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width:90%"></s-date-picker>
        </s-form-item>
        <s-form-item label="描述" prop="holidayDesc">
          <s-input :disabled="isSee" v-model="slaHolidaysForm.holidayDesc" type="textarea" style="width:90%"></s-input>
        </s-form-item>
        <s-form-item label="状态" prop="isEnable">
          <s-switch :disabled="isSee" v-model="slaHolidaysForm.isEnable" :active-value="1" :inactive-value="0"></s-switch>
        </s-form-item>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button :disabled="dialogDisabled" v-if="!isSee" @click="dialogOk">保存</s-button>
      <s-button v-if="isSee" @click="dialogFlag=false">关闭</s-button>
      <s-button v-if="!isSee" type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
export default {
  data() {
    return {
      data: [],
      dialogFlag: false,
      dialogDisabled: false,
      ischange: false,
      holidayName: null,
      slaHolidaysForm: {
        holidayName: '',
        startTime: '',
        endTime: '',
        daynumber: 0,
        holidayDesc: '',
        isEnable: 1
      },
      slaHolidaysRule: {
        holidayName: [
          Validaters.NotNull,
          Validaters.Max(30)
        ],
        startTime: [
          Validaters.NotNull
        ],
        endTime: [
          Validaters.NotNull
        ],
        daynumber: [
          Validaters.NotNull,
          Validaters.Number
        ],
        holidayDesc: [
          Validaters.Max(120)
        ],
        isEnable: [
          Validaters.NotNull,
          Validaters.Number
        ]
      }
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
      return Object.keys(this.row).length > 0;
    }
  },
  created() {
    if (this.isEdit) {
      $axios.get(`/itilSla/getItilSlaHoliday/${this.row.uuid}`).then(({data}) => {
        this.data = {...data}
        for (let i in this.slaHolidaysForm) {
          this.slaHolidaysForm[i] = this.data[i];
          if (i === 'holidayName') {
            this.holidayName = this.data[i]
          }
        }
      })
    }
  },
  methods: {
    dialogOk() {
      let form = this.$refs['slaHolidaysForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let params = {...this.slaHolidaysForm};
        this.dialogDisabled = true;
        if (this.isEdit) {
          params['uuid'] = this.data.uuid;
          $axios.post('/itilSla/updateSlaHoliday', params, {
            data: [params],
            logTemplate: '编辑|服务时间>节假日(#holidayName#)'
          }).then((res) => {
            this.dialogDisabled = false;
            if (res.data.state === true) {
              this.$message({showClose: true, message: '更新成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        } else {
          // 新建服务时间
          $axios.post('/itilSla/saveSlaHoliday', params, {
            data: [params],
            logTemplate: '添加|服务时间>节假日(#holidayName#)'
          }).then((res) => {
            this.dialogDisabled = false;
            if (res.data.state === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        }
      })
    },
    disableAfterToday: {
      disabledDate(time) {
        return time.getTime() >= Date.now();
      }
    },
    daynumberChange(val) {
      this.slaHolidaysForm.daynumber = val;
    },
    dateFormat(date, format) {
      let fmt = format || 'yyyy-MM-dd'
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
      }
      return fmt
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.dialogFlag = val;
      }
    },
    holidayName(val) {
      if (val === '其他') {
        this.slaHolidaysForm.holidayName = '';
      } else {
        this.slaHolidaysForm.holidayName = val;
      }
    },
    'slaHolidaysForm.daynumber'(val) {
      if (!this.slaHolidaysForm.startTime) return null;
      if (!this.ischange) {
        var d = new Date(this.slaHolidaysForm.startTime);
        d.setDate(d.getDate() + parseInt(val) - 1);
        var m = d.getMonth() + 1;
        var newDateStr = d.getFullYear() + '-' + m + '-' + d.getDate();
        this.slaHolidaysForm.endTime = this.dateFormat(new Date(newDateStr));
        setTimeout(() => {
          this.ischange = false
        }, 200);
      }
    },
    'slaHolidaysForm.startTime'(val) {
      if (!this.ischange) {
        this.ischange = true;
        var d = new Date(val);
        d.setDate(d.getDate() + parseInt(this.slaHolidaysForm.daynumber) - 1);
        var m = d.getMonth() + 1;
        var newDateStr = d.getFullYear() + '-' + m + '-' + d.getDate();
        this.slaHolidaysForm.endTime = this.dateFormat(new Date(newDateStr));
        setTimeout(() => {
          this.ischange = false
        }, 200);
      }
    },
    'slaHolidaysForm.endTime'(val) {
      if (!this.ischange) {
        var d = new Date(val);
        d.setDate(d.getDate() - parseInt(this.slaHolidaysForm.daynumber) + 1);
        var m = d.getMonth() + 1;
        var newDateStr = d.getFullYear() + '-' + m + '-' + d.getDate();
        this.slaHolidaysForm.startTime = this.dateFormat(new Date(newDateStr));
        setTimeout(() => {
          this.ischange = false
        }, 200);
      }
    },
    dialogFlag(val) {
      this.$emit('input', val);
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
