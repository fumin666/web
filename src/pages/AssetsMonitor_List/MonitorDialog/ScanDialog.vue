<template>
  <div>
    <s-dialog v-model="dialogFlag" :title="scanType" width="700px" id="scanDialog" :before-close="scanOk">
      <s-row class="scanState">
      <!--  <img :src="resultImgUrl" alt="">-->
      <div v-if="scaning" class="scaningImg"></div>
      <div v-else class="scanResultImg"></div>
       <span>{{stateIndicator}}</span>
      </s-row>
      <s-scrollbar wrap-class="scanDialogScrollbar">
        <s-row class="scanContent" v-html="resultData">

        </s-row>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer" v-if="!scaning">
        <s-button @click="scanOk">确定</s-button>
        <s-button type="cancel" @click="scanOk">关闭</s-button>
      </template>
    </s-dialog>
    <scan-socket v-if="socketFlag" :name-space="nameSpace" ref="socket"
             @message-callback="messageCallback"
    ></scan-socket>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import scanSocket from './ScanSocket'
  export default {
    data() {
      return {
        dialogFlag: false,
        socketFlag: false,
        resultImgUrl: '../../../../static/images/frame/dataloading.gif',
        resultData: '',
        scaning: true,
        stateIndicator: '正在扫描中,请耐心等候...',
        timer: null
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      scanType: {
        type: String
      },
      nameSpace: {
        type: String
      },
      comp: {
        type: Object
      }
    },
    created() {
      // 创建聊天室
      $axios.get(`/iamUserInfo/createPageConnection/${this.nameSpace}`).then(({data}) => {
        this.socketFlag = true;
        if (data === true) {
          if (this.scanType === '即时执行') {
            $axios.get(`/resourcemanager/discovery/excuteOnceMonitor/${this.comp.uuid}/${this.nameSpace}`).then(({data}) => {
              if (data.state) {
              } else {
                this.$message({message: data.errormsg, type: 'warning'});
              }
            });
          } else {
            $axios.get(`/resourcemanager/discovery/scanOnceMonitorConfig/${this.comp.uuid}/${this.nameSpace}`).then(({data}) => {
                if (data.state) {
                } else {
                  this.$message({message: data.errormsg, type: 'warning'});
                }
            });
          }
        }
      });
    },
    methods: {
      messageCallback(data) {
        let message = JSON.parse(data.message);
        console.log(message.isfinish)
        if (message.isfinish) {
          this.stateIndicator = '扫描完成';
          this.scaning = false
          this.resultImgUrl = '../../../../static/images/frame/loadingsuccess.png';
        }
        if (this.scanType === '即时执行') {
          if (message.msg) {
            this.resultData += message.msg;
          }
        } else {
          if (message.msg) {
            message.msg.forEach((item) => {
              if (item) {
                this.resultData += item
              }
            })
          }
        }
      },
      scanOk() {
        this.dialogFlag = false;
        this.$emit('reload');
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        if (!val) {
//          this.$refs.socket.disconnectSocket();
          this.timer && clearTimeout(this.timer);
        }
        this.$emit('input', val);
      }
    },
    components: {
      scanSocket
    }
  }
</script>
