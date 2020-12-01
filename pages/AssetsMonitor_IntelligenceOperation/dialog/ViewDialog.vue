<template>
  <div>
    <div class="assetView">
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
      <s-form label-width="120px">
        <s-form-item label="发生时间:">
          <s-input v-model="viewObj.createTimeStr" disabled></s-input>
        </s-form-item>
        <s-form-item label="持续时间:">
          <s-input v-model="viewObj.durationStr" disabled></s-input>
        </s-form-item>
        <s-form-item label="告警信息及描述:">
          <s-input type="textarea" v-model="alarmInfo.eventDesc" disabled></s-input>
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
        alarmInfo: {}
      }
    },
    props: {
      viewObj: {
        type: Object,
        default: {}
      }
    },
    watch: {
    },
    methods: {
      getAssetInfo() {
        $axios.get(`/aiopsMonitorAlarm/viewItcompAlarm/${this.viewObj.uuid}`).then(res => {
          this.assetInfo = res.data.assetInfo;
          this.alarmInfo = res.data.alarmInfo;
        })
      }
    },
    created() {
      this.getAssetInfo()
    }
  }
</script>

<style lang="stylus">
  .assetView{
    overflow: hidden;
    margin-top: 15px;
  }
  .assetCol{
    margin-bottom: 10px;
  }
</style>
