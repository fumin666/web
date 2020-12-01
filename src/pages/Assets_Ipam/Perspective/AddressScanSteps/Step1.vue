<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @Description:扫描
 * @Position:IP台账-》子网视角-》IP地址扫描-》扫描
 * @Date: 2019-11-05 14:42:42
 * @LastEditors  : mybells
 -->
<template>
  <s-dialog v-model="startScanFlag" width="700px" title="扫描发现" :before-close="dialogClose">
    <div class="startIpScanDialog">
      <div class="fontscan">
        <div class="title">已用时</div>
        <div class="value">{{scanTime | parseTime}}</div>
      </div>
      <div class="imgscan">
        <img :src="imgsrc">
        <div style="font-size:18px;opacity:0.65;">正在扫描IP地址...<span class="scanProcess">{{progress}}%</span></div>
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
import {cloneDeep} from 'lodash'
import $axios from 'sunflower-ajax';
import scanSocket from '@/components/socketClient/SocketClient'
export default {
  filters: {
    parseTime(val) {
      let time = Number.parseInt(val / 1000);
      let s = time % 60;
      let m = Math.floor(time / 60) % 60;
      let h = Math.floor(Math.floor(time / 60) / 60);
      return `${h}小时${m}分钟${s}秒`;
    }
  },
  data() {
    return {
      disabled: true,
      imgsrc: '',
      startScanFlag: true,
      recodeTimer: '',
      originTime: '',
      socketFlag: false,
      nameSpace: ''
    }
  },
  components: {
    scanSocket
  },
  computed: {
    step1Data: {
      get() {
        return this.$store.state.addressScanSteps.step1.step1Data;
      },
      set(val) {
        this.$store.commit('addressScanSteps/setStep1Data', cloneDeep(val));
      }
    },
    dataList: {
      get() {
        return this.$store.state.addressScanSteps.step1.dataList;
      },
      set(val) {
        this.$store.commit('addressScanSteps/setStep1DataList', cloneDeep(val));
      }
    },
    progress: {
      get() {
        return this.$store.state.addressScanSteps.step1.progress;
      },
      set(val) {
        this.$store.commit('addressScanSteps/setStep1Progress', cloneDeep(val));
      }
    },
    scanTime: {
      get() {
        return this.$store.state.addressScanSteps.step1.scanTime;
      },
      set(val) {
        this.$store.commit('addressScanSteps/setStep1ScanTime', cloneDeep(val));
      }
    }
  },
  created() {
    let mainTheme = localStorage.getItem('theme');
    this.getTheme(mainTheme)
    if (this.step1Data.isfinish) {
      return;
    }
    let vm = this
    // 创建聊天室
    vm.nameSpace = 'scanIpAddress'
    vm.$store.commit('addressScanSteps/settotalCount', 1);
    vm.$store.commit('addressScanSteps/setRunStartTime', new Date());
    vm.originTime = (new Date()).getTime();
    vm.recodeTime();
    $axios.get(`/iamUserInfo/createPageConnection/${vm.nameSpace}`).then((res) => {
      vm.socketFlag = true
      if (vm.step1Data.finishCount < vm.step1Data.totalCount) {
      }
      $axios.post(`/ipamNetsegment/scanIpAddress`, [this.$store.state.addressScanSteps.ipsubnetobj.uuid]).then((res) => {
        if (!res.data.errorMsg) {
          this.disabled = false;
          this.$nextTick(() => {
            this.next();// 打开结果弹窗
          })
          vm.$store.commit('addressScanSteps/setLastdata', res.data);
        } else {
          vm.recodeTimer && clearTimeout(vm.recodeTimer);
          vm.$message.warning(res.data.errorMsg)
          vm.$emit('close')
        }
      });
    });
  },
  methods: {
    messageCallback(data) {
      console.log('ipaddressscan')
      let message = JSON.parse(JSON.parse(data.message));
      if (message.length) {
        let arr = []
        for (let i in message) {
          arr.unshift(message[i]);
        }
        this.dataList = arr;
      }
      let num = this.step1Data.finishCount;
      this.$store.commit('addressScanSteps/setfinishCount', num + 1);

      if (this.step1Data.totalCount === 0) {
        this.progress = 0;
      } else {
        this.progress = Math.floor(this.step1Data.finishCount / this.step1Data.totalCount * 100);
      }
      if (this.step1Data.finishCount === this.step1Data.totalCount) { // 扫描完成
        // this.next();// 打开结果弹窗
        this.$store.commit('addressScanSteps/setisfinish', true);
        clearTimeout(this.recodeTimer);
      }
    },
    recodeTime() {
      this.recodeTimer = setTimeout(() => {
        this.scanTime = (new Date()).getTime() - this.originTime;
        this.recodeTime();
      }, 1000);
    },
    next() {
      this.$store.commit('addressScanSteps/next');
    },
    getTheme(val) {
      if (val === 'dark') {
        this.imgsrc = '/static/images/assetpolling/subnetDarkScan.gif'
      } else {
        this.imgsrc = '/static/images/assetpolling/subnetLightScan.gif'
      }
    },
    dialogClose() {
      this.$confirm('正在扫描中，确认退出？', '提示', {
        confirmButonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.get('/ipamNetsegment/closeScanIpAddress').then((data) => {
          this.$emit('close')
        })
      }).catch(() => {});
    },
    // 取消扫描
    breakScan() {
      $axios.get('/ipamNetsegment/cancelScanIpAddress').then((data) => {
        this.recodeTimer && clearTimeout(this.recodeTimer);
        if (this.$refs.socket) {
          this.$refs.socket.disconnectSocket();
        }
        this.next();// 打开结果弹窗
      })
    }
  },
  watch: {
  '$store.state.theme': function(val) {
      this.getTheme(val)
    }
  },
  beforeDestroy() {
    this.recodeTimer && clearTimeout(this.recodeTimer);
    if (this.$refs.socket) {
      this.$refs.socket.disconnectSocket();
    }
  }
}
</script>
<style lang="stylus">
.startIpScanDialog{
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
