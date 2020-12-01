<!--
 * @Author: 高建鹏
 * @Version: //Q4IP台账
 * @Description:子网扫描step2，开始扫描操作
 * @Date: 2019-11-05 14:42:42
 * @LastEditors  : mybells
 -->
 <template>
  <s-dialog v-model="startScanFlag" width="700px" title="扫描发现" :before-close="dialogClose">
    <div class="startIpScanDialog">
      <div class="fontscan">
        <div class="title">已用时</div>
        <div class="value">{{scanTime|parseTime}}</div>
      </div>
      <div class="imgscan">
        <img :src="imgsrc">
        <div style="font-size:18px;opacity:0.65;">正在扫描子网...<span class="scanProcess">{{progress2}}%</span></div>
        <div style="font-size:18px;opacity:0.65;">正在扫描IP地址...<span class="scanProcess">{{progress3}}%</span></div>
      </div>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="breakScan" :disabled="disabled">取消扫描</s-button>
    </template>

    <scan-socket v-if="subnetSocketFlag" :name-space="subnetNameSpace" ref="subnetsocket" @message-callback="messageCallback2"></scan-socket>
    <scan-socket v-if="ipSocketFlag" :name-space="ipNameSpace" ref="ipsocket" @message-callback="messageCallback3"></scan-socket>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {cloneDeep} from 'lodash'
import scanSocket from './ScanSocket'
export default {
  data() {
    return {
      disabled: true,
      imgsrc: '',
      startScanFlag: true,
      subnetSocketFlag: false,
      subnetNameSpace: '',

      ipSocketFlag: false,
      ipNameSpace: '',
      recodeTimer: '',
      originTime: ''
    }
  },
  components: {
    scanSocket
  },
  filters: {
    parseTime(val) {
      let time = Number.parseInt(val / 1000);
      let s = time % 60;
      let m = Math.floor(time / 60) % 60;
      let h = Math.floor(Math.floor(time / 60) / 60);
      return `${h}小时${m}分钟${s}秒`;
    }
  },
  computed: {
    step2Data: {
      get() {
        return this.$store.state.scanningSteps.step2.step2Data;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep2Data', cloneDeep(val));
      }
    },
    progress2: {
      get() {
        return this.$store.state.scanningSteps.step2.progress;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep2Progress', cloneDeep(val));
      }
    },
    scanTime: {
      get() {
        return this.$store.state.scanningSteps.step2.scanTime;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep2ScanTime', cloneDeep(val));
      }
    },
    dataList2: {
      get() {
        return this.$store.state.scanningSteps.step2.dataList;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep2DataList', cloneDeep(val));
      }
    },

    step3Data: {
      get() {
        return this.$store.state.scanningSteps.step3.step3Data;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep3Data', cloneDeep(val));
      }
    },
    progress3: {
      get() {
        return this.$store.state.scanningSteps.step3.progress;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep3Progress', cloneDeep(val));
      }
    },
    dataList3: {
      get() {
        return this.$store.state.scanningSteps.step3.dataList;
      },
      set(val) {
        this.$store.commit('scanningSteps/setStep3DataList', cloneDeep(val));
      }
    }
  },
  created() {
    let mainTheme = localStorage.getItem('theme');
    this.getTheme(mainTheme)
    // 开始计时
    this.$store.commit('scanningSteps/setRunStartTime', new Date());
    this.originTime = (new Date()).getTime();
    this.recodeTime();
    // 创建聊天室
    this.subnetNameSpace = 'scanSubNet'
    this.connected2(true)
  },
  methods: {
    connected2(val) {
      if (val) {
        if (this.$store.state.scanningSteps.step1.scanway1.scanmode === 2) {
          let param = {
            communityIDs: this.$store.state.scanningSteps.step1.step1List.map(function (item) {
              return item.uuid;
            }),
            seedIP: this.$store.state.scanningSteps.step1.scanway1.seed
          };
          this.postdata2(param)
        } else {
          let param = {
            communityIDs: this.$store.state.scanningSteps.step1.step1List.map(function (item) {
              return item.uuid;
            })
          };
          this.postdata2(param)
        }
      }
    },
    postdata2(param) {
      $axios.post(`/ipamNetsegment/getNetSegmentScanTime`, param).then((res) => {
        this.$store.commit('scanningSteps/set2totalCount', res.data);
      }).then(() => {
        $axios.get('/iamUserInfo/createPageConnection/scanSubNet').then((data) => {
          this.subnetSocketFlag = true;// 和后台建立连接后才能连接socketioclient
          if (this.step2Data.finishCount < this.step2Data.totalCount) {

          }
          $axios.post(`/ipamNetsegment/scanNetSegment`, param).then((res) => {
            if (res.data.state) {
              this.disabled = false;
            } else {
              this.recodeTimer && clearTimeout(this.recodeTimer);
              this.$nextTick(() => {
                this.$message({
                  type: 'error',
                  message: res.data.errormsg
                })
              })
              this.$emit('close')
              // let mainTheme = localStorage.getItem('theme');
              // if (mainTheme === 'dark') {
              //   this.imgsrc = '/static/images/assetpolling/findAgain/darkScanStatic.svg'
              // } else {
              //   this.imgsrc = '/static/images/assetpolling/findAgain/lightScanStatic.svg'
              // }
            }
          });
        });
      });
    },
    messageCallback2(data) {
      let message = JSON.parse(JSON.parse(data.message));
      console.log('subnetScan')
      if (message.length) {
        let arr = cloneDeep(this.dataList2);
        for (let i in message) {
          arr.unshift(message[i]);
        }
        this.dataList2 = arr;
      }
      let num = this.step2Data.finishCount;
      this.$store.commit('scanningSteps/set2finishCount', num + 1);

      if (this.step2Data.totalCount === 0) {
        this.progress2 = 0;
      } else {
        this.progress2 = Math.floor(this.step2Data.finishCount / this.step2Data.totalCount * 100);
      }
      if (this.step2Data.finishCount === this.step2Data.totalCount) { // 扫描完成
        this.$store.commit('scanningSteps/set2isfinish', true);
        if (this.$refs.subnetsocket) {
          this.$refs.subnetsocket.disconnectSocket();
        }
        this.subnetSocketFlag = false;
        this.nextIpScan();// 开始IP扫描
      }
    },
    recodeTime() {
      this.recodeTimer = setTimeout(() => {
        this.scanTime = (new Date()).getTime() - this.originTime;
        this.recodeTime();
      }, 1000);
    },
    /* ip地址扫描**************************** */
    nextIpScan() {
      $axios.get(`/ipamNetsegment/canScanIpam/scanIpAddress`).then((res) => {
        if (res.data.state) {
          this.ipNameSpace = 'scanIpAddress';
          this.connected3(true)
        } else {
          this.$message.warning(res.data.errormsg)
        }
      });
    },
    connected3(val) {
      if (val) {
        let param = this.$store.state.scanningSteps.step2.dataList.map(function (item) {
          return item.uuid;
        });
        this.$store.commit('scanningSteps/set3totalCount', param.length);
        $axios.get('/iamUserInfo/createPageConnection/scanIpAddress').then((data) => {
          this.ipSocketFlag = true;// 和后台建立连接后才能连接socketioclient
          $axios.post(`/ipamNetsegment/scanIpAddress`, param).then((res) => {
            if (res.status === 200) {
              this.$store.commit('scanningSteps/setLastdata', res.data);
            } else {
              clearTimeout(this.recodeTimer);
              this.$nextTick(() => {
                this.$message({
                  type: 'error',
                  message: '扫描失败'
                })
              })
              this.$emit('close')
            }
          });
        });
      }
    },
    messageCallback3(data) {
      let message = JSON.parse(JSON.parse(data.message));
      console.log('ipscan')
      if (message.length) {
        let arr = cloneDeep(this.dataList3);
        for (let i in message) {
          arr.unshift(message[i]);
        }
        this.dataList3 = arr;
      }
      let num = this.step3Data.finishCount;
      this.$store.commit('scanningSteps/set3finishCount', num + 1);

      if (this.step3Data.totalCount === 0) {
        this.progress3 = 0;
      } else {
        this.progress3 = Math.floor(this.step3Data.finishCount / this.step3Data.totalCount * 100);
      }
      if (this.step3Data.finishCount === this.step3Data.totalCount) { // 扫描完成
        this.$store.commit('scanningSteps/set3isfinish', true);
        if (this.$refs.ipsocket) {
          this.$refs.ipsocket.disconnectSocket();
        }
        this.ipSocketFlag = false;
        this.$nextTick(() => {
          this.$message({
            type: 'success',
            message: '扫描成功'
          })
        })
        this.recodeTimer && clearTimeout(this.recodeTimer);
        this.$store.commit('scanningSteps/next');
      }
    },
    dialogClose() {
      this.$confirm('正在扫描中，确认退出？', '提示', {
        confirmButonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.get('/ipamNetsegment/closeScanNetSegment').then((data) => {})
        this.$emit('close')
      }).catch(() => {});
    },
    // 取消扫描
    breakScan() {
      $axios.get('/ipamNetsegment/cancelScanNetSegment').then((data) => {
        this.recodeTimer && clearTimeout(this.recodeTimer);
        if (this.$refs.subnetsocket) {
          this.$refs.subnetsocket.disconnectSocket();
        }
        if (this.$refs.ipsocket) {
          this.$refs.ipsocket.disconnectSocket();
        }
        this.$store.commit('scanningSteps/next');// 打开结果弹窗
      })
    },
    getTheme(val) {
      if (val === 'dark') {
        this.imgsrc = '/static/images/assetpolling/subnetDarkScan.gif'
      } else {
        this.imgsrc = '/static/images/assetpolling/subnetLightScan.gif'
      }
    }
  },
  watch: {
  '$store.state.theme': function(val) {
      this.getTheme(val)
    }
  },
  beforeDestroy() {
    this.recodeTimer && clearTimeout(this.recodeTimer);
    if (this.$refs.subnetsocket) {
      this.$refs.subnetsocket.disconnectSocket();
    }
    if (this.$refs.ipsocket) {
      this.$refs.ipsocket.disconnectSocket();
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
