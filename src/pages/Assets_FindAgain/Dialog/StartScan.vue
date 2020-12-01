<!--
 * @Author: 高建鹏
 * @Version: //Q4资产发现
 * @Description:开始扫描页
 * @Position:资产发现-》开始扫描操作
 * @Date: 2019-11-05 14:42:42
 * @LastEditors: mybells
 -->
<template>
  <s-dialog v-model="startScanFlag" width="700px" title="扫描发现" :before-close="dialogClose">
    <div class="startScanDialog">
      <div class="fontscan">
        <div class="title">共需扫描</div>
        <div class="value">{{ step2Data.totalCount||'—' }}</div>
        <div class="title">已扫描</div>
        <div class="value">{{step2Data.finishCount||'—'}}</div>
        <div class="title">已用时</div>
        <div class="value">{{scanTime | parseTime}}</div>
      </div>
      <div class="imgscan">
        <img :src="imgsrc" alt="">
        <div style="font-size:18px;opacity:0.65;">扫描资产中...<span class="scanProcess">{{progress}}%</span></div>
      </div>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="breakScan" :disabled="disabled">取消扫描</s-button>
    </template>

    <scan-socket v-if="socketFlag" :name-space="nameSpace" ref="socket"
                 @message-callback="messageCallback">
    </scan-socket>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash'
  import scanSocket from '@/components/socketClient/SocketClient'
  export default {
    components: {
      scanSocket
    },
    filters: {
      parseTime: function(val) {
        let time = Number.parseInt(val / 1000);
        let s = time % 60;
        let m = Math.floor(time / 60) % 60;
        let h = Math.floor(Math.floor(time / 60) / 60);
        return `${h}小时${m}分钟${s}秒`;
      }
    },
    props: {

    },
    data() {
      return {
        disabled: true,
        imgsrc: '',
        startScanFlag: true,
        namespace: '',
        timer: '',
        recodeTimer: '',
        originTime: '',
        socketFlag: false,
        nameSpace: ''
      }
    },
    created() {
      let mainTheme = localStorage.getItem('theme');
      this.getTheme(mainTheme)
      if (this.scanType === 2) {
        this.gatewayScan();
      } else if (this.scanType === 3) {
        this.seedScan();
      } else {
        this.handlerScan();
      }
      if (!this.originTime) {
        this.$store.commit('setRunStartTime', new Date());
        this.originTime = (new Date()).getTime();
        this.recodeTime();
      }
    },
    computed: {
      scanType: {
        get() {
          return this.$store.state.assetFindAgain.scanType;
        },
        set(val) {
          this.$store.commit('scanType', val);
        }
      },
      seedIP: {
        get() {
          return this.$store.state.assetFindAgain.step1.seedIP;
        },
        set(val) {
          this.$store.commit('setSeedIP', val);
        }
      },
      stepList2: {
        get() {
          return this.$store.state.assetFindAgain.step1.stepList2;
        },
        set(val) {
          this.$store.commit('setStepList2', val);
        }
      },
      step2Data: {
        get() {
          return this.$store.state.assetFindAgain.step2.step2Data;
        },
        set(val) {
          this.$store.commit('setStep2Data', val);
        }
      },
      dataList: {
        get() {
          return this.$store.state.assetFindAgain.step2.dataList;
        },
        set(val) {
          this.$store.commit('setDataList', val);
        }
      },
      progress: {
        get() {
          return this.$store.state.assetFindAgain.step2.progress;
        },
        set(val) {
          this.$store.commit('setStep2Progress', val);
        }
      },
      scanTime: {
        get() {
          return this.$store.state.assetFindAgain.step2.scanTime;
        },
        set(val) {
          this.$store.commit('setStep2ScanTime', val);
        }
      }
    },
    methods: {
      // 全网扫描
      gatewayScan() {
        let param = this.$store.state.assetFindAgain.step1.step1List.map(function (item) {
          return item.uuid;
        });
        // 获取网关的所有网段
        $axios.post('/resourcemanager/discovery/scanNetSegmentByGateway', param).then(({data}) => {
          if (data.msg) {
            this.$message({showClose: true, message: data.msg, type: 'warning'});
            this.$emit('close')
          } else {
            $axios.post('/resourcemanager/discovery/listNetSegments').then((response) => {
              let {status, data} = response;
              if (status !== 200) {
                this.$message({showClose: true, message: '获取网关所有网段失败！', type: 'warning'});
                this.$emit('close')
              } else {
                let listData = data || [];
                this.next(listData.map((item) => item.uuid));
              }
            })
          }
        });
      },
      // 种子扫描
      seedScan() {
        let param = {
          communityIDs: this.$store.state.assetFindAgain.step1.step1List.map(function (item) {
            return item.uuid;
          }),
          seedIP: this.seedIP
        };
        // 获取种子的所有网段
        $axios.post('/resourcemanager/discovery/scanNetSegmentBySeed', param).then(({data}) => {
          if (data.msg) {
            this.$message({showClose: true, message: data.msg, type: 'warning'});
            this.$emit('close')
          } else {
            $axios.post('/resourcemanager/discovery/listNetSegments').then((response) => {
              let {status, data} = response;
              if (status !== 200) {
                this.$message({showClose: true, message: '获取种子所有网段失败！', type: 'warning'});
                this.$emit('close')
              } else {
                let listData = data || [];
                this.next(listData.map((item) => item.uuid));
              }
            })
          }
        });
      },
      // 手动扫描
      handlerScan() {
        if (this.stepList2.length) {
          this.next(this.stepList2.map((item) => item.uuid));
        }
      },
      // next：通过凭证和网段准备创建scoket
      next(uuidList) {
        // this.namespace = Number.parseInt(new Date().getTime() / 1000);
        this.namespace = 'itcompScan'
        this.$store.commit('setNamespace', this.namespace);
        let param = {
          commUuidList: this.$store.state.assetFindAgain.step1.step1List.map(function (item) {
            return item.uuid;
          }),
          netsegmentList: uuidList
        };
        $axios.post(`/resourcemanager/discovery/scanItcomp/${this.namespace}`, param).then(({data}) => {
          // this.$store.commit('next');// 打开结果弹窗
          if (data.state) {
            this.disabled = false;
            this.step2();
          } else {
            this.$message({type: 'warning', message: data.errormsg})
            this.$emit('close')
          }
        });
      },
      // really开始扫描，创建聊天室
      step2() {
        !this.scanTime && (this.scanTime = 0);
        // 创建聊天室
        this.nameSpace = 'itcompScan'
        $axios.get('/iamUserInfo/createPageConnection/itcompScan').then(({data}) => {
          this.socketFlag = true
        });
      },
      dialogClose() {
        this.$confirm('正在扫描中，确认退出？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get('/resourcemanager/discovery/closeScanAssets').then((data) => {})
          this.$emit('close')
        }).catch(() => {});
      },
      // 取消扫描
      breakScan() {
        $axios.get('/resourcemanager/discovery/cancelScanAssets').then(({data}) => {
          this.recodeTimer && clearTimeout(this.recodeTimer);
          if (this.$refs.socket) {
            this.$refs.socket.disconnectSocket();
          }
          this.$store.commit('next');// 打开结果弹窗
        });
      },
      // socket回调函数
      messageCallback(data) {
        let message = JSON.parse(data.message);
        let arr = ['itCompName', 'ipAddress', 'citypeName', 'product']
        for (let i in message) {
          if (arr.indexOf(i) === -1) {
            this.step2Data[i] = message[i];
          }
        }
        if (message.hasOwnProperty('view') && message.view !== null) {
          let arr = cloneDeep(this.dataList);
          arr.unshift(message.view);
          this.dataList = arr;
        }
        if (this.step2Data.totalCount === 0) {
          this.progress = 0;
        } else {
          this.progress = Math.floor(this.step2Data.finishCount / this.step2Data.totalCount * 100);
        }
        if (message.isfinish && message.totalCount === message.finishCount && message.totalCount !== 0) { // 扫描完成
          this.$store.commit('next');// 打开结果弹窗
        }
      },
      recodeTime() {
        this.recodeTimer = setTimeout(() => {
          this.scanTime = (new Date()).getTime() - this.originTime;
          this.recodeTime();
        }, 1000);
      },
      getTheme(val) {
        if (val === 'dark') {
          this.imgsrc = '/static/images/assetpolling/findAgain/darkScan.gif'
        } else {
          this.imgsrc = '/static/images/assetpolling/findAgain/lightScan.gif'
        }
      }
    },
    beforeDestroy() {
      this.recodeTimer && clearTimeout(this.recodeTimer);
      if (this.$refs.socket) {
        this.$refs.socket.disconnectSocket();
      }
    },
    watch: {
    '$store.state.theme': function(val) {
        this.getTheme(val)
      }
    }
  }
</script>

<style lang="stylus">
.startScanDialog{
  .fontscan{
    position:absolute;
    left:30px;
    top:30px;
    .title{
      font-family: PingFang SC;
      font-size: 14px;
      margin-bottom: 4px;
      opacity: 0.45;
    }
    .value{
      font-family: PingFang SC;
      font-size: 16px;
      opacity: 0.85;
      margin-bottom: 20px;
    }
  }
  .imgscan{
    width: 220px;
    height: 260px;
    margin: 25px auto 20px auto;
    text-align: center;
    .scanProcess{
      font-family: PingFang SC;
      font-size: 20px;
      color: #FF9023;
    }
  }
}
</style>
