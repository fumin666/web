<template>
  <div id="traceForm" class="content">
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
  import { getTraceResult } from './api/topology_api'
  export default {
    data() {
      return {
        title: 'Trace命令执行中，请稍等...',
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
      getTraceResult({'ip': this.ip}).then((response) => {
        if (!response || response === '') {
          this.title = 'Trace请求数据失败';
        } else {
          this.title = 'Trace命令执行完成';
          var dataStr = response.replace(/\n/g, '</div><div class="console-item">');
          this.result = '<div class="console-item">' + dataStr + '</div>';
        }
      });
    }
  }
</script>
<style>
  #traceForm {
    display: block;
    min-height: 0px;
    height: 240px;
    width: 545px;
  }
  #traceForm .box-card{
    height: 260px;
  }
  #traceForm .console {
    height: 230px;
    padding: 10px;
    overflow: auto;
  }
  #traceForm .console-item{
    /*height: 25px;*/
    line-height: 25px;
  }
</style>
