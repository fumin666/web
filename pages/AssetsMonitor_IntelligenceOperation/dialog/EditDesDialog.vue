<template>
  <div>
    <div v-if="viewObj !== ''" class="assetView">
      <s-col :span="5" class="assetCol" style="text-align: center;">
        <s-row><img src="/static/images/topologyicon/default/PCserver.svg" alt="" style="width: 54px;"></s-row>
        <s-row style="margin-top: 10px">主机名：{{assetInfo.itcompname}}</s-row>
      </s-col>
      <s-col :span="19" class="assetCol">
        <s-row style="margin-top: 15px">
          <s-col :span="8">操作系统：{{assetInfo.modelnumber}}</s-col>
          <s-col :span="8">IP地址：{{assetInfo.controladderss}}</s-col>
          <s-col :span="8">内存：{{assetInfo.memory}}M</s-col>
        </s-row>
        <s-row style="margin-top: 15px">
          <s-col :span="8">CPU：{{assetInfo.cpu}}核</s-col>
          <s-col :span="8">磁盘：{{assetInfo.disk}}GB</s-col>
        </s-row>
      </s-col>
    </div>
    <div style="margin-top: 10px;padding: 0 20px 18px;border-bottom: 1px solid rgba(0, 0, 0, 0.15);">
      <s-form label-width="120px" ref="form" :model="form" :rules="ruleForm">
        <s-form-item label="操作人:">
          <s-input v-model="userRealName" disabled></s-input>
        </s-form-item>
        <s-form-item label="操作时间:">
          <s-input v-model="currentDate" disabled></s-input>
        </s-form-item>
        <s-form-item label="备注内容:" prop="comment">
          <s-input type="textarea" v-model="form.comment" :rows="3"></s-input>
        </s-form-item>
      </s-form>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  // import { cloneDeep } from 'lodash';

  export default {
    data() {
      return {
        assetInfo: {},
        userRealName: '',
        currentDate: '',
        form: {
          comment: ''
        },
        ruleForm: {
          comment: [{max: 500, message: '不能超过500个字符', trigger: 'blur'},
            {required: true, message: '备注内容不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      viewObj: {
        type: String,
        default: ''
      },
      current: {
        type: Object,
        default: {}
      }
    },
    watch: {
    },
    methods: {
      formatDate() {
        let date = new Date()
        let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        this.currentDate = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
      },
      getAssetInfo() {
        if (this.viewObj !== '') {
          let params = {
            commentUuid: this.viewObj,
            assetUuid: this.current.assetUuid
          }
          $axios.post(`/aiopsMonitorAlarm/viewAlarmComment`, params).then(res => {
            this.assetInfo = res.data.assetInfo;
          })
        }
      }
    },
    created() {
      this.userRealName = this.$store.state.userData.userRealName;
      this.formatDate()
      this.getAssetInfo()
      if (this.current) {
        this.form.comment = this.current.comment
      }
    }
  }
</script>

<style lang="stylus">
  .assetView{
    overflow: hidden;
  }
  .assetCol{
    margin-bottom: 10px;
  }
</style>
