/*
* @Author: 付敏
* @Description:Q4报表中心资产监控
* @Position:
* @Date: 2019-10-22 09:28:40
* @LastEditors: 付敏
*/
<template>
  <s-col :span="20" style="margin-top: 6%;padding: 0 20px;height: 97%;">
    <s-row>
      <s-col class="MonitorBox" v-for="(item, index) in monitorChart" :key="index">
        <div class="monitor-mod">
          <div class="f-col icon"><img :src="item.icon" alt="" width="80%" height="100%"></div>
          <div class="f-col-fit">
            <div class="citypeName">{{item.citypeName}}</div>
            <div id="numHost">{{item.ciCount}}</div>
          </div>
          <div class="battery-item">
            <span class="battery-title">异常</span>
            <normal-common :item="item" :currentData="item.offlineCount" currentStyle="down"></normal-common>
            <div class="battery-num">{{item.offlineCount}}</div>
          </div>
          <div class="battery-item">
            <span class="battery-title">告警</span>
            <normal-common :item="item" :currentData="item.alertCount" currentStyle="warn"></normal-common>
            <div class="battery-num">{{item.alertCount}}</div>
          </div>
          <div class="battery-item">
            <span class="battery-title">正常</span>
            <normal-common :item="item" :currentData="item.normalCount" currentStyle="normal"></normal-common>
            <div class="battery-num">{{item.normalCount}}</div>
          </div>
        </div>
      </s-col>
    </s-row>
  </s-col>
</template>
<script>
  import $axios from 'sunflower-ajax';
  import NormalCommon from './BaseCommon/NormalCommon'
    export default {
      data() {
        return {
          monitorChart: []
        }
      },
      components: {
        NormalCommon
      },
      methods: {
      },
      mounted() {
        $axios.get('/monitorcitype/getStatCountCitype').then((res) => {
          this.monitorChart = res.data.slice(0, 5)
        });
      }
    }
</script>

<style>
  .MonitorBox{
    border-right: 1px dashed rgba(0, 0, 0, 0.1);
    float: left;
    width: 16%;
    padding: 0 15px;
  }
  .MonitorBox:first-child {
    padding-left: 0;
  }
  .MonitorBox:last-child {
    border-right: none;
  }
  .monitor-mod .f-col{
    margin: 0;
    padding: 0;
    float: left;
    overflow: hidden;
  }
  .monitor-mod .icon{
    width: 57px;
    height: 48px;
    margin-bottom: 20px;
  }
  .monitor-mod .f-col-fit{
    text-align: left;
    padding-left: 12px;
    margin: 0;
    overflow: hidden;
    zoom: 1;
  }
  .monitor-mod .f-col-fit div:nth-child(1) {
    font-size: 14px;
    color: #000;
    opacity: 0.65;
    height: 32px;
  }
  .monitor-mod .f-col-fit div:nth-child(2) {
    font-size: 20px;
    color: #000;
    opacity: 0.85;
  }
  .monitor-mod .battery-item {
    width: 56%;
    height: 26px;
    border-radius: 2px;
    position: relative;
    margin: 14px 0 0 18px;
    clear: both;
    font-size: 0;
    padding: 4px 0 0 22px;
  }
  .monitor-mod .battery-item .battery-title {
    font-size: 14px;
    position: absolute;
    left: 20px;
    top: 4px;
    color: #000;
    opacity: .45;
  }
  .monitor-mod .battery-item li {
    width: 4px;
    height: 8px;
    background: rgba(0, 0, 0, 0.05);
    margin-top: 5%;
    display: inline-block;
    overflow: hidden;
  }
  .monitor-mod .battery-item li span {
    display: block;
    width: 100%;
    height: 100%;
    background: transparent;
  }
  .monitor-mod .battery-item .battery-num {
    position: absolute;
    left: -3px;
    top: 4px;
    font-size: 14px;
    color: #000;
    opacity: 0.85;
  }
</style>
