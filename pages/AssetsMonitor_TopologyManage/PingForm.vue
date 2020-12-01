<template>
  <div id="pingForm" class="content">
    <s-card  class="box-card" style="width:100%;">
      <div slot="header" class="clearfix">
        <span class="card-title">
          <i class="iconfont icon-log"></i>
          {{ title }}
        </span>
      </div>
      <div class="console" v-html="result"></div>
    </s-card>
  </div>
</template>
<script>
import { getPingResult } from './api/topology_api'
export default {
  data() {
    return {
      title: 'Ping命令执行中，请稍等...',
      result: ''
    }
  },
  props: {
    ip: {
      type: String,
      required: true
    }
  },
  mounted () {
    getPingResult({'ip': this.ip}).then((response) => {
      if (response.hasOwnProperty('failed')) {
        this.title = 'Ping请求数据失败';
        this.result = '资产ping不通';
      } else {
        this.title = 'Ping命令执行完成';
        this.result = this.changeData(response);
      }
    });
  },
  methods: {
    changeData (data) {
      var temp = '<div class="console-item">本次请求平均时间：' + data['PING_AVERAGE_TIME'] + 's</div><div class="console-item">丢包率：' + data['PING_LOST_PACKETE_RATE'] + '%</div><div class="console-item">丢包数：' + data['PING_LOST_PACKETS'] + '</div><div class="console-item">最大响应时间：' + data['PING_MAX_RESPONSE_TIME'] + 's</div><div class="console-item">最小响应时间：' + data['PING_MIN_RESPONSE_TIME'] + 's</div>';
      return temp;
    }
  }
}
</script>
<style>
  #pingForm {
    display: block;
    min-height: 0px;
    height: 240px;
    width: 545px;
  }
  #pingForm .box-card{
    height: 260px;
  }
  #pingForm .console {
    height: 230px;
    padding: 10px;
  }
  #pingForm .console-item{
    height: 25px;
    line-height: 25px;
  }
</style>
