/**
* Created by alex on 2019/2/14.
*/
<template>
  <section id="log-colletor-download" style="margin:0">
    <s-card class="box-card">
      <div slot="header" class="clearfix">
        <span>evtsys</span>
      </div>
      <ul class="item-main">
        <li class="item-state">说明：用于采集接收Windows服务器系统日志</li>
        <li class="item-download">下载：
          <span @click="download(0)"><i class="iconfont icon-download"></i>Evtsys_4.5.1_32-Bit</span>
          <span @click="download(1)"><i class="iconfont icon-download"></i>Evtsys_4.5.1_64-Bit</span>
        </li>
      </ul>
    </s-card>
    <s-card class="box-card">
      <div slot="header" class="clearfix">
        <span>syslog</span>
      </div>
      <ul class="item-main">
        <li class="item-state">说明：用于采集接收Linux服务器系统日志</li>
        <li class="item-download">下载：
          <span @click="download(6)"><i class="iconfont icon-download"></i>Ubuntu</span>
          <span @click="download(7)"><i class="iconfont icon-download"></i>CentOS</span>
        </li>
      </ul>
    </s-card>
    <s-card class="box-card">
      <div slot="header" class="clearfix">
        <span>filebeat</span>
      </div>
      <ul class="item-main">
        <li class="item-state">说明：用于采集接收服务器上应用的日志</li>
        <li class="item-download">下载：
          <span @click="download(2)"><i class="iconfont icon-download"></i>LINUX 32-BIT</span>
          <span @click="download(3)"><i class="iconfont icon-download"></i>LINUX 64-BIT</span>
          <span @click="download(4)"><i class="iconfont icon-download"></i>WINDOWS 32-BIT</span>
          <span @click="download(5)"><i class="iconfont icon-download"></i>WINDOWS 64-BIT</span>
        </li>
      </ul>
    </s-card>
    <s-card class="box-card">
      <div slot="header" class="clearfix">
        <span>配置手册</span>
      </div>
      <ul class="item-main">
        <li class="item-state">说明：日志接收配置说明</li>
        <li class="item-download">下载：
          <span @click="download(8)"><i class="iconfont icon-download"></i>日志配置说明</span>
        </li>
      </ul>
    </s-card>
  </section>
</template>

<script type="text/babel">
  import {Download} from 'sunflower-common-utils'
  export default {
    components: {
      // Download
    },
    methods: {
      download(type) {
        Download(`/systemmanager/systemsetting/downLoadBeat/${type}`);
      }
    }
  }
</script>
