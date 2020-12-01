/**
* Created by alex on 2019/2/20.
*/
<template>
    <s-row id="ViewSource">
      <s-col :span="8">
        <div class="grid-content bg-purple">资产名称</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{data.itcompName}}</div>
      </s-col>
      <s-col :span="8">
        <div class="grid-content bg-purple">IP地址</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{data.controlAdderss}}</div>
      </s-col>
      <s-col :span="8">
        <div class="grid-content bg-purple">资产类型</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{data.citypeName}}</div>
      </s-col>
      <s-col :span="8">
        <div class="grid-content bg-purple">应用类别</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{data.appTypeName}}</div>
      </s-col>
      <s-col :span="8">
        <div class="grid-content bg-purple">采集方式</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{data.collectType | wordFilter}}</div>
      </s-col>
      <s-col :span="8">
        <div class="grid-content bg-purple">日志接收级别</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light">{{data.logLevelStr}}</div>
      </s-col>
      <s-col :span="8">
        <div class="grid-content bg-purple">备注</div>
      </s-col>
      <s-col :span="16">
        <div class="grid-content bg-purple-light" style="word-break: break-word;">{{data.remark}}</div>
      </s-col>
    </s-row>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    filters: {
      wordFilter(n) {
        const arr = ['syslog', 'trap', 'ftp']
        return arr[n - 1]
      }
    }
  }
</script>
<style lang="stylus">
  #ViewSource
   .s-col
     margin-bottom 5px
</style>
