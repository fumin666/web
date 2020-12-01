<!--
 * @Author: 高建鹏
 * @Version: //Q4资产发现
 * @Description:扫描结果
 * @Position:资产发现-》开始扫描操作->结果
 * @Date: 2019-11-05 14:42:42
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="resultScanFlag" width="800px" title="扫描发现" :before-close="dialogClose">
    <s-row class="resultScanFlag_title">
      <i class="iconfont icon-zhengchang"></i>
      <span style="margin-left:60px;">扫描完成，共扫描<span class="font"> {{countInfo.finishCount||0}} </span>IP地址，已识别<span class="font"> {{countInfo.distinguishDeviceNum||0}} </span>个资产</span>
    </s-row>
    <s-row class="step6">
      <s-col :span="7">
        <img src="/static/images/assetpolling/findAgain/result/resultscan.svg" style="width:100%;margin-top: 60px;">
      </s-col>
      <s-col :span="17" class="step6">
        <s-row>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon1.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ user }}</span>
              <span class="item-title">发起者</span>
            </div>
          </s-col>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon5.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ runStartTime | formatTime }}</span>
              <span class="item-title">发起时间</span>
            </div>

          </s-col>
        </s-row>
        <s-row>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon2.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ countInfo.finishCount||0 }}个</span>
              <span class="item-title">共扫描地址数</span>
            </div>
          </s-col>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon6.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ runEndTime | formatTime }}</span>
              <span class="item-title">结束时间</span>
            </div>
          </s-col>
        </s-row>
        <s-row>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon3.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ countInfo.snmpResponseNum||0 }}个</span>
              <span class="item-title">SNMP响应个数</span>
            </div>
          </s-col>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon7.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ duration | parseTime}}</span>
              <span class="item-title">运行时长</span>
            </div>
          </s-col>
        </s-row>
        <s-row>
          <s-col class="step6-item" :span="12">
            <div class="item-left">
              <img src="/static/images/assetpolling/findAgain/result/resulticon4.svg">
            </div>
            <div class="item-right">
              <span class="item-content">{{ countInfo.distinguishDeviceNum||0 }}个</span>
              <span class="item-title">辨识资产数</span>
            </div>
          </s-col>
        </s-row>
      </s-col>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="downloadResult">下载结果</s-button>
      <s-button @click="dialogClose">完成</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import Bus from '@/plugins/eventBus';
  import { mapState } from 'vuex';
  import $axios from 'sunflower-ajax';

  export default {
    data () {
      return {
        resultScanFlag: true,
        user: '',
        countInfo: {},
        datakey: {
          itCompName: '资产名称',
          ipAddress: 'IP地址',
          citypeName: '设备类型',
          product: '设备型号'
        }
      }
    },
    computed: {
      ...mapState({
        runStartTime: state => state.assetFindAgain.runStartTime,
        runEndTime: state => state.assetFindAgain.runEndTime
      }),
      duration() {
        return this.runEndTime.getTime() - this.runStartTime.getTime();
      }
      // countInfo() {
        // return this.$store.state.assetFindAgain.step2.step2Data;
      // }
    },
    created() {
      $axios.get('/resourcemanager/discovery/getItcompScanMsg/itcompScan').then((res) => {
        if (res.data) {
          console.log(res.data);
          this.countInfo = res.data
        }
      });
      this.user = window.localStorage.getItem('userName');
      $axios.log({
        logTemplate: '再次发现',
        result: '成功'
      });
      this.$store.commit('setRunEndTime', new Date());
      Bus.$emit('refreshAssetAll');// 资产发现有结果时刷新资产管理一级页面，在src\home\AssetsManage\AssetDifference.vue中监听
    },
    filters: {
      formatTime(val) {
        function addZero(t) {
          return t > 9 ? t : '0' + t
        }
        if (Object.prototype.toString.apply(val).indexOf('Date') !== -1) {
          let year = val.getFullYear()
          let month = addZero(val.getMonth() + 1)
          let date = addZero(val.getDate())
          let hour = addZero(val.getHours())
          let minutes = addZero(val.getMinutes())
          let second = addZero(val.getSeconds())
          return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second;
        }
        return '';
      },
      parseTime: function(val) {
        let time = Math.round(val / 1000);
        let s = time % 60;
        let m = Math.floor(time / 60) % 60;
        let h = Math.floor(Math.floor(time / 60) / 60);
        return `${h}小时${m}分钟${s}秒`;
      }
    },
    methods: {
      downloadResult() {  // return this.$store.state.assetFindAgain.step2.step2Data;
        let data = this.countInfo.views;
        if (data.length) {
          let str = '';
          data.map(item => {
            for (let i in item) {
              if (i in this.datakey) {
                str = `${str}${this.datakey[i]}:${item[i]} `
              }
            }
            str = str + '\n';
          })
          // 下载文件方法
          let funDownload = function (content, filename) {
              var eleLink = document.createElement('a');
              eleLink.download = filename;
              eleLink.style.display = 'none';
              // 字符内容转变成blob地址
              var blob = new Blob([content]);
              eleLink.href = URL.createObjectURL(blob);
              // 触发点击
              document.body.appendChild(eleLink);
              eleLink.click();
              // 然后移除
              document.body.removeChild(eleLink);
          };

          if ('download' in document.createElement('a')) {
              funDownload(str, '扫描结果.txt');
          } else {
            this.$message({type: 'warning', message: '浏览器不支持'})
          }
        } else {
          this.$message({type: 'warning', message: '无扫描结果！'})
        }
      },
      dialogClose() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="stylus">
.step6 .step6-item .item-right {
  float: unset;
  height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 30px auto 0 10px;
}
.step6 .step6-item .item-left {
  margin: 12px 10px 10px 5px;
  img{
    width:45px;
  }
}
.step6 .step6-item .item-right {
  .item-title{
    font-family: PingFang SC;
    font-size: 12px;
    opacity: 0.45;
  }
  .item-content{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-family: PingFang SC;
    font-size: 16px;
    opacity: 0.85;
  }
}
</style>
