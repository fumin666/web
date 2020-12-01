/**
* Created by alex on 2019/2/15.
*/
<template>
  <s-form class="s-form-wrapper" ref="addForm" :model="form" :rules="formRules"
          label-width="160px">
    <s-form-item label="采集方式">
      <s-col span="8">
        <s-select v-model="form.siem_collectType">
          <s-option label="FTP" :value="1"></s-option>
        </s-select>
      </s-col>
    </s-form-item>
    <s-form-item label="FTP服务器" prop="siem_ftpService">
      <s-col span="8">
        <s-select v-model="form.siem_ftpService">
          <s-option v-for="item in ftpList" :label="item.archiveDeviceName" :value="item.uuid"  :key="item.uuid"></s-option>
        </s-select>
      </s-col>
    </s-form-item>
    <span class="hgwt">目录名称必须以“/ip#应用类别”或者“/ip”结束，如: /aa/192.168.212.20#mysql或者/aa/192.168.212.20</span>
    <s-form-item label="日志文件根目录" prop="siem_logFilePath">
      <s-col span="8">
        <s-input v-model="form.siem_logFilePath"></s-input>
      </s-col>
    </s-form-item>
    <span class="hgwt">可输入多个文件名称，文件名称之间用“_”分隔，例如：aaa.txt_bbb.out</span>
    <s-form-item label="日志文件名称" prop="siem_logFileName">
      <s-col span="8">
        <s-input v-model="form.siem_logFileName"></s-input>
      </s-col>
    </s-form-item>
    <s-form-item>
      <s-button @click="save('addForm')">保存</s-button>
      <s-button @click="collect">采集</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
 import $axios from 'sunflower-ajax';
 import {Validaters} from 'sunflower-common-utils';
 // let checkFileName = (rule, value, callback) => {
 //   const reg = /^([A-Za-z]{1}:\/[\w\/]*)?\w+\.[a-zA-Z]+$/;
 //   if (value === false) {
 //     callback(new Error('不能为空'));
 //   }
 //   callback();
 // };
 // let checkFilePath = (rule, value, callback) => {
 //   if (value === '') {
 //     callback(new Error('不能为空'));
 //   } else {
 //     callback();
 //   }
 // };
 export default {
   data() {
     return {
       form: {
         siem_ftpService: '',
         siem_collectType: 1,
         siem_logFilePath: '',
         siem_logFileName: ''
       },
       formRules: {
         siem_ftpService: [Validaters.NotNull],
         siem_logFilePath: [Validaters.NotNull],
         siem_logFileName: [Validaters.NotNull]
       },
       ftpList: []
     }
   },
   created() {
     $axios.get('/syslogAuditSetting/getFtpServiceList').then((res) => {
       this.ftpList = res.data
     }).then(() => {
       $axios.get('/syslogAuditSetting/getCollectionSetting').then((res) => {
         this.form.siem_collectType = parseInt(res.data.siem_collectType)
         this.form.siem_ftpService = res.data.siem_ftpService ? res.data.siem_ftpService : this.ftpList[0].uuid
         this.form.siem_logFilePath = res.data.siem_logFilePath
         this.form.siem_logFileName = res.data.siem_logFileName
       })
     })
   },
   methods: {
     save(formName) {
       this.$refs[formName].validate((valid) => {
         if (valid) {
           let obj = {
             data: [],
             logTemplate: '编辑|日志审计配置>日志采集配置'
           }
           $axios.post('/syslogAuditSetting/saveCollectionSetting', this.form, obj).then((res) => {
             if (res.data.state) {
               this.$message.success(res.data.errormsg);
             } else {
               this.$message.error(res.data.errormsg);
             }
           })
         } else {
           this.$message.warning('请完成表单填写!')
           return
         }
       })
     },
     collect() {
       this.$refs['addForm'].validate((valid) => {
         if (!valid) {
           this.$message.warning('请完成表单填写!')
           return
         }
         $axios.post('/syslogAuditSetting/logCollection', this.form).then((res) => {
           if (res.data.state) {
             this.$message.success(res.data.errormsg);
           } else {
             this.$message.error(res.data.errormsg);
           }
         })
       })
     }
   }
 }
</script>
<style>
  .hgwt{
    display:inline-block;
    width:800px;
    font-size:13px;
    color:gray
  }
</style>
