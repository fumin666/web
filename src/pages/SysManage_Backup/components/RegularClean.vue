<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-02-14 10:43:20
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-02-23 16:26:14
 * @Description: 定时清理tab
 -->

<template>
  <div class="regular-clean">
    <s-form ref="regularCleanForm" :model="regularCleanForm" :rules="regularCleanRules" label-width="120px">
      <s-form-item label="清除频率" prop="frequency">
        <span class="otherSmalllText">每</span>
        <s-input-number v-model="regularCleanForm.frequency" style="width:150px;margin:0 10px;" :min="1" :max="10"></s-input-number>
        <span class="otherSmalllText">天</span>
      </s-form-item>
      <s-form-item label="保留天数" prop="holdDay">
        <s-input-number v-model="regularCleanForm.holdDay" style="width:150px;margin: 0 10px 0 28px;" :min="1" :max="10"></s-input-number>
        <span class="otherSmalllText">天</span>
      </s-form-item>
      <s-form-item label="启动" prop="isOpen">
        <s-switch v-model="regularCleanForm.isOpen"></s-switch>
      </s-form-item>
      <s-button @click="regularCleanFormOk">保存</s-button>
    </s-form>
  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      // 定时清理表单
      regularCleanForm: {
        frequency: 0, // 清除频率 单位天
        holdDay: 0, // 保留天数
        isOpen: false // 启动
      },
      regularCleanRules: {
        frequency: [Validaters.NotNull],
        holdDay: [Validaters.NotNull]
      }
    }
  },
  created() {
    this.getRegularCleanFormData();
  },
  methods: {
    // 获取备份清理回显数据
    getRegularCleanFormData() {
      $axios.get(`/systemmanager/sysBackupLog/getAutoCleanConf`).then(({data}) => {
        let obj = {};
        for (let key in data) {
          if (key === 'isOpen') {
            obj[key] = (parseInt(data[key]) === 1); // 如果是isopen 转成boolen值
          } else {
            obj[key] = parseInt(data[key]);         // 如果是别的key 转成int值
          }
        }
        this.regularCleanForm = obj;
      })
    },
    // 提交备份清理表单数据
    regularCleanFormOk() {
      let formEl = this.$refs.regularCleanForm;
      formEl.validate(valid => {
        // 进行校验，如果没有通过则终止函数
        if (!valid) return;
        // 展开，去掉地址引用
        let params = {...this.regularCleanForm, isOpen: this.regularCleanForm.isOpen ? 1 : 0};
        // 添加日志
        let logParam = {
          data: [],
          logTemplate: '设置|定时清除'
        };
        // 发送请求
        $axios.post(`/systemmanager/sysBackupLog/autoCleanConf`, params, logParam).then(({data}) => {
          if (data.state === true) {
            this.$message({showClose: true, message: '保存成功', type: 'success'});
          } else {
            this.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        });
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.regular-clean {
  margin: 0px 10px;
}
</style>
