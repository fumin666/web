<template>
  <div class="monitorInfo">
    <s-row :gutter="5" style="margin-top: 15px;">
      <s-col span="10">
        <div class="monitorInfoCol">
          <span class="infoName">资产状态</span>
          <span class="right-float" :class="getFontClass(stateArr[monitorInfo.compentStatus])">
            {{stateArr[monitorInfo.compentStatus]}}
          </span>
        </div>
      </s-col>
      <s-col span="14">
        <div class="monitorInfoCol">
          <span class="infoName">运行时长</span>
          <span class="right-float">{{monitorInfo.runTime}}</span>
        </div>
      </s-col>
    </s-row>
    <s-row :gutter="5" style="margin-top: 5px;">
      <s-col span="10">
        <div class="monitorInfoCol">
          <span class="infoName">PING检测状态</span>
          <span class="right-float" :class="stateArr[monitorInfo.pingStatus]==='正常' ? 'font-normal' : 'font-wrong'">
            {{stateArr[monitorInfo.pingStatus]}}
          </span>
        </div>
      </s-col>
      <s-col span="14">
        <div class="monitorInfoCol">
          <span class="infoName">PING响应时间</span>
          <span class="right-float">{{monitorInfo.responseTime}}</span>
        </div>
      </s-col>
    </s-row>
    <s-row class="chartContainer">
      <s-col span="8" v-if="monitorInfo.cpuUtilization">
        <s-chart :chart="dealChartData(monitorInfo.cpuUtilization, 'cpu')"></s-chart>
        <div class="otherChartInfo">
          <s-row class="infoName">CPU使用率</s-row>
          <!--<s-row>核数{{monitorInfo.cpuInfo.total}}</s-row>-->
          <!--<s-row>使用量{{monitorInfo.cpuInfo.use}}</s-row>-->
        </div>
      </s-col>
      <s-col span="8" v-if="monitorInfo.memoryUtilization">
        <s-chart :chart="dealChartData(monitorInfo.memoryUtilization, 'memory')"></s-chart>
        <div class="otherChartInfo">
          <s-row class="infoName">内存使用率</s-row>
          <!--<s-row>总量{{monitorInfo.memoryInfo.total}}</s-row>-->
          <!--<s-row>已用{{monitorInfo.memoryInfo.use}}</s-row>-->
        </div>
      </s-col>
      <s-col span="8" v-if="monitorInfo.diskUtilization">
        <s-chart :chart="dealChartData(monitorInfo.diskUtilization, 'disk')"></s-chart>
        <div class="otherChartInfo">
          <s-row class="infoName">磁盘使用率</s-row>
          <!--<s-row>总量{{monitorInfo.diskInfo.total}}</s-row>-->
          <!--<s-row>已用{{monitorInfo.diskInfo.use}}</s-row>-->
        </div>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import authCheck from '@/common/mixins/auth.js'

  export default {
    mixins: [authCheck],
    data() {
      return {
        monitorInfo: {
          cpuInfo: {},
          memoryInfo: {},
          diskInfo: {}
        },
        chartArr: [],
        stateArr: ['宕机', '正常', '告警', '异常']
      }
    },
    props: {
      compId: {
        type: String,
        required: true
      }
    },
    created() {
      this.axiosMonitorInfo();
    },
    methods: {
      axiosMonitorInfo() {
        $axios.post(`/resourcemanager/assetmanager/itasset/getMonitorItcompDetailParams/${this.compId}`).then(({data}) => {
          let catalogType = null;
          if (data.panelType === 'hostsystem') {
            catalogType = 'Host';
          } else if (data.panelType === 'network') {
            catalogType = 'netWork';
          }
          $axios.get(`/resourcemanager/assetmanage/assetRuning/getMonitorItcompBaseInfo/${this.compId}/${catalogType}`).then(({data}) => {
            this.monitorInfo = data;
          });
        });
      },
      dealChartData(val, chartName) {
        return {
          name: chartName,
          type: 'ringChart',
          width: '100%',
          height: '160px',
          data: parseFloat(val)
        }
      },
      getFontClass(status) {
        switch (status) {
          case '正常':
            return 'font-normal';
          case '告警':
            return 'font-warning';
          case '宕机':
            return 'font-wrong';
        }
      }
    }
  }
</script>

<style lang="stylus">

</style>
