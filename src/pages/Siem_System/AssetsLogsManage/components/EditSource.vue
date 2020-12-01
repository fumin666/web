/**
* Created by alex on 2019/2/20.
*/
<template>
  <s-form ref="formRef" :model="form" :rules="rules" label-width="120px" id="edit-source">
    <s-form-item label="资产名称">{{editData.itcompName}}</s-form-item>
    <s-form-item label="IP地址">{{editData.controlAdderss}}</s-form-item>
    <s-form-item label="资产类型">{{editData.citypeName}}</s-form-item>
    <s-form-item label="应用类别" prop="appTypeUuid" v-if="sourceTypeShow">
      <s-select v-model="form.appTypeUuid">
        <s-option v-for="(item, index) in typeList" :label="item.typeName" :value="item.uuid" :key="index"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="采集方式" prop="collectType">
      <s-radio-group v-model="form.collectType">
        <s-radio :label="1">syslog</s-radio>
        <s-radio :label="2">trap</s-radio>
        <s-radio :label="3">ftp</s-radio>
      </s-radio-group>
    </s-form-item>
    <s-form-item label="日志接收级别">
      <s-radio-group v-model="form.logLevelType">
        <s-radio :label="1">系统默认</s-radio>
        <s-radio :label="2">自定义</s-radio>
      </s-radio-group>
    </s-form-item>
    <s-form-item label="" prop="logLevel">
      <s-checkbox-group v-model="form.logLevel">
        <s-checkbox label="0" :disabled="isDisable">应急</s-checkbox>
        <s-checkbox label="1" :disabled="isDisable">警报</s-checkbox>
        <s-checkbox label="2" :disabled="isDisable">致命</s-checkbox>
        <s-checkbox label="3" :disabled="isDisable">错误</s-checkbox>
        <s-checkbox label="4" :disabled="isDisable">警告</s-checkbox>
        <s-checkbox label="5" :disabled="isDisable">提示</s-checkbox>
        <s-checkbox label="6" :disabled="isDisable">信息</s-checkbox>
        <s-checkbox label="7" :disabled="isDisable">诊断</s-checkbox>
        <s-checkbox label="8" :disabled="isDisable">未知</s-checkbox>
      </s-checkbox-group>
    </s-form-item>
    <s-form-item label="备注" prop="remark">
      <s-input type="textarea" :rows="3" v-model="form.remark"></s-input>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import {intersectObj} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        isDisable: true,
        sourceTypeShow: false,
        form: {
          appTypeUuid: '',
          collectType: 1,
          logLevelType: 1,
          logLevel: '',
          remark: '',
          uuid: ''
        },
        ruleTemp: [{ type: 'array', required: true, message: '至少选择一个', trigger: 'change' }],
        rules: {
          appTypeUuid: [{ required: true, message: '不能为空', trigger: 'blur' }],
          logLevel: [],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        typeList: []
      }
    },
    methods: {
      sourceShow() {
        const uuid = this.editData.citypeUuid
        $axios.get(`/syslogAuditSetting/logSourceIsApp/${uuid}`).then((res) => {
          if (res.data === 1) {
            this.sourceTypeShow = true
            this.getSourceType()
          } else {
            this.sourceTypeShow = false
          }
        })
      },
      getSourceType() {
        $axios.get('/syslogAuditSetting/getAppTypeList').then((res) => {
          this.typeList = res.data
        })
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    mounted() {
      if (this.editData !== undefined) {
        this.form = intersectObj(this.form, this.editData);
        if (this.form.logLevel !== '') {
          this.form.logLevel = this.form.logLevel.split('|')
        }
      }
      this.sourceShow()
    },
    watch: {
      'form.logLevelType': {
        deep: true,
        handler: function(val) {
          if (val === 2) {
            this.rules.logLevel = this.ruleTemp
            this.isDisable = false
          } else {
            this.rules.logLevel = []
            this.isDisable = true
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
  #edit-source
    .s-checkbox + .s-checkbox
      margin-right 0
</style>
