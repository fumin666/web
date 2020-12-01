<template>
  <s-dialog v-model="dialogFlag" :title="isSee ? '查看加班记录详情' : (isEdit ? '编辑加班记录' : '新增加班记录')" width="600px" class="slaOvertimeAddDialog">
    <s-scrollbar wrap-class="adDomainAddScrollbar">
      <s-form :model="slaOvertimeForm" :rules="slaOvertimeRule" ref="slaOvertimeForm" label-width="120px">
        <s-form-item label="加班描述" prop="overtimeDesc">
          <s-input :disabled="isSee" v-model="slaOvertimeForm.overtimeDesc" style="width:90%"></s-input>
        </s-form-item>
        <s-form-item label="开始日期/时间" prop="startTime">
          <s-date-picker :disabled="isSee" v-model="slaOvertimeForm.startTime" type="date" placeholder="选择开始时间" :picker-options="pickerOptions1" :editable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width:90%"></s-date-picker>
        </s-form-item>
        <s-form-item label="截止日期/时间" prop="endTime">
          <s-date-picker :disabled="isSee" v-model="slaOvertimeForm.endTime" type="date" placeholder="选择截止时间" :picker-options="pickerOptions2" :editable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width:90%"></s-date-picker>
        </s-form-item>
        <s-form-item label="备注" prop="remark">
          <s-input :disabled="isSee" v-model="slaOvertimeForm.remark" type="textarea" style="width:90%"></s-input>
        </s-form-item>
        <s-form-item label="状态" prop="isEnable">
          <s-switch :disabled="isSee" v-model="slaOvertimeForm.isEnable" :active-value="1" :inactive-value="0"></s-switch>
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
    const that = this;
    return {
      data: [],
      dialogFlag: false,
      dialogDisabled: false,
      ischange: false,
      slaOvertimeForm: {
        overtimeDesc: '',
        startTime: '',
        endTime: '',
        remark: '',
        isEnable: 1
      },
      slaOvertimeRule: {
        overtimeDesc: [
          Validaters.NotNull,
          Validaters.Max(30)
        ],
        startTime: [
          Validaters.NotNull
        ],
        endTime: [
          Validaters.NotNull
        ],
        remark: [
          Validaters.Max(120)
        ],
        isEnable: [
          Validaters.NotNull,
          Validaters.Number
        ]
      },
      pickerOptions1: {
        disabledDate(time) {
          var d = new Date(that.slaOvertimeForm.endTime);
          d.setDate(d.getDate());
          var m = d.getMonth() + 1;
          var newDateStr = d.getFullYear() + '-' + m + '-' + d.getDate();
          return time.getTime() >= new Date(newDateStr).getTime();
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          var d = new Date(that.slaOvertimeForm.startTime);
          d.setDate(d.getDate());
          var m = d.getMonth() + 1;
          var newDateStr = d.getFullYear() + '-' + m + '-' + (d.getDate() - 1);
          return time.getTime() <= new Date(newDateStr).getTime();
        }
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
      $axios.get(`/itilSla/getItilSlaOvertime/${this.row.uuid}`).then(({data}) => {
        this.data = {...data}
        for (let i in this.slaOvertimeForm) {
          this.slaOvertimeForm[i] = this.data[i];
        }
      })
    }
  },
  methods: {
    dialogOk() {
      let form = this.$refs['slaOvertimeForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let params = {...this.slaOvertimeForm};
        this.dialogDisabled = true;
        if (this.isEdit) {
          // 编辑
          params['uuid'] = this.data.uuid;
          $axios.post('/itilSla/updateSlaOvertime', params, {
            data: [params],
            logTemplate: '编辑|服务时间>加班(#overtimeDesc#)'
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
          // 新建
          $axios.post('/itilSla/saveSlaOvertime', params, {
            data: [params],
            logTemplate: '添加|服务时间>加班(#overtimeDesc#)'
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
    // 'slaOvertimeForm.startTime'(val) {
    //   if (!this.ischange) {
    //     this.ischange = true;
    //     var d = new Date(val);
    //     d.setDate(d.getDate());
    //     var m = d.getMonth() + 1;
    //     var newDateStr = d.getFullYear() + '-' + m + '-' + d.getDate();
    //     this.slaOvertimeForm.endTime = this.dateFormat(new Date(newDateStr));
    //     setTimeout(() => {
    //       this.ischange = false
    //     }, 200);
    //   }
    // },
    // 'slaOvertimeForm.endTime'(val) {
    //   if (!this.ischange) {
    //     var d = new Date(val);
    //     d.setDate(d.getDate());
    //     var m = d.getMonth() + 1;
    //     var newDateStr = d.getFullYear() + '-' + m + '-' + d.getDate();
    //     this.slaOvertimeForm.startTime = this.dateFormat(new Date(newDateStr));
    //     setTimeout(() => {
    //       this.ischange = false
    //     }, 200);
    //   }
    // },
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
