<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @Description: 添加代理审批人
 * @Date: 2019-02-28 13:32:29
 * @LastEditTime: 2019-03-07 16:11:23
 -->

<template>
  <s-dialog v-model="dialogFlag" :title="isEdit ? '编辑代理审批人' : '添加代理审批人'" width="660px" class="addApproverDialog" append-to-body>
    <s-form :model="form" :rules="rules" ref="addApproverForm" label-width="130px">
      <s-form-item label="开始时间" prop="startTime">
        <s-date-picker v-model="form.startTime" type="datetime" :editable="false" @change="getStartTime">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="结束时间" prop="endTime">
        <s-date-picker v-model="form.endTime" type="datetime" :editable="false" @change="getEndTime">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="代理审批人" prop="proxyUuid">
        <s-select v-model="form.proxyUuid">
          <s-option v-for="(item, index) in approverList" :key="index" :label="item.userRealName" :value="item.uuid">
          </s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="状态" prop="status">
        <s-select v-model="form.status">
          <s-option label="激活" :value="1"></s-option>
          <s-option label="未激活" :value="0"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="备注" prop="remark">
        <s-input v-model="form.remark" type="textarea"></s-input>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      dialogFlag: false,
      form: {
        startTime: null,
        endTime: null,
        proxyUuid: null,
        status: 0,
        remark: null
      },
      rules: {
        startTime: [Validaters.NotNull],
        endTime: [Validaters.NotNull],
        proxyUuid: [Validaters.SelectValNotNull],
        status: [Validaters.NotNull],
        remark: [Validaters.Max(120)]
      },
      approverList: [] // 代理审批人列表
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    obj: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.obj).length > 0;
    }
  },
  created() {
    if (this.isEdit) {
      Object.keys(this.form).forEach((key) => {
        if (this.obj[key] === null || this.obj[key] === undefined) {
          this.form[key] = null;
        } else {
          this.form[key] = this.obj[key];
        }
      })
      this.form['uuid'] = this.obj['uuid']
    }
    this.getApproverList();  // 获取代理审批人列表
  },
  methods: {
    // 获取代理审批人列表
    getApproverList() {
      $axios.post('/specialOperationApply/getProxyAuditList', {}).then(({data}) => {
        if (data) {
          this.approverList = data
        }
      })
    },
    dialogOk() {
      let form = this.$refs['addApproverForm'];
      form.validate((valid) => {
        if (!valid) {
          return false;
        }
        let params = {...this.form, startTime: this.timeStamp(this.form.startTime), endTime: this.timeStamp(this.form.endTime)};
        let approverRow = this.approverList.find(item => {
          return this.form.proxyUuid === item.uuid
        })
        let obj = {
          data: [approverRow],
          logTemplate: this.isEdit ? '编辑|运维审批>添加代理审批人(#userRealName#)' : '添加|运维审批>添加代理审批人(#userRealName#)'
        }
        $axios.post('/specialOperationApply/saveOrEditProxyApprover', params, obj).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '保存成功!', type: 'success'});
            this.$emit('reload');
            this.dialogFlag = false;
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      })
    },
    // 限制搜索时间函数
    getStartTime(value) {
      let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
      let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
      if (end) {
        if (start > end) {
          this.$message({
            type: 'warning',
            message: '开始时间必须小于结束时间！'
          })
          this.form.startTime = null;
        }
      }
    },
    getEndTime(value) {
      let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
      let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
      if (start) {
        if (start > end) {
          this.$message({
            type: 'warning',
            message: '结束时间必须大于开始时间！'
          })
          this.form.endTime = null;
        }
      }
    },
    timeStamp(date) {
      if (typeof date === 'string') {
        date = new Date(date);
      }
      return Math.round(date.getTime() / 1000);
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
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
</style>
