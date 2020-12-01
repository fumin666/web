<template>
  <s-dialog v-model="dialogFlag" title="Remote Ping">
    <div id="remotePingForm" class="content">
      <s-form :inline="true" ref="remotePingForm" :rules="rules" :model="form" v-if="!resultback">
        <s-form-item label="目的IP地址" prop="destIp">
          <s-input v-model="form.destIp"></s-input>
        </s-form-item>
        <s-form-item label="超时时间(毫秒)" prop="timeOut">
          <s-input v-model="form.timeOut"></s-input>
        </s-form-item>
        <s-form-item label="发包大小" prop="packetSize">
          <s-input v-model="form.packetSize"></s-input>
        </s-form-item>
        <s-form-item label="发包数量" prop="packetNum">
          <s-input v-model="form.packetNum"></s-input>
        </s-form-item>
      </s-form>
      <s-card  class="box-card" style="width:100%;" v-if="resultback">
        <div slot="header" class="clearfix">
        <span class="card-title">
          <i class="iconfont icon-log"></i>
          {{ title }}
        </span>
        </div>
        <div class="console" v-html="result"></div>
      </s-card>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk" v-if="!resultback">执行</s-button>
      <s-button @click="dialogBack" v-if="resultback">返回</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils'
  import { remotePing } from './api/topology_api'
  export default {
    data() {
      return {
        dialogFlag: false,
        resultback: false,
        title: 'Remote Ping命令执行中...',
        result: '',
        form: {
          destIp: '',
          timeOut: '1000',
          packetSize: '111',
          packetNum: '10',
          itCompId: ''
        },
        rules: {
          destIp: [
            Validaters.NotNull,
            Validaters.IP
          ],
          timeOut: [
            Validaters.NotNull,
            Validaters.Number
          ],
          packetSize: [
            Validaters.NotNull,
            Validaters.Number
          ],
          packetNum: [
            Validaters.NotNull,
            Validaters.Number
          ]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      itCompId: {
        type: String,
        required: true
      }
    },
    methods: {
      changeData (data) {
        var temp = '<div class="console-item">统计信息：' + data['statistics'] + '</div><div class="console-item">往返行程的估计时间(以毫秒为单位): ' + data['time'] + '</div>';
        return temp;
      },
      dialogBack () {
        this.resultback = false;
      },
      dialogOk() {
        this.$refs.remotePingForm.validate(valid => {
          if (!valid) {
            return false;
          }
          this.resultback = true;
          this.form.itCompId = this.itCompId;
          remotePing(this.form).then((response) => {
            this.title = 'Remote Ping命令执行完成';
            if (response == null) {
              this.title = 'Remote Ping请求数据失败';
            } else {
              if (response.flag === '0') {
                this.result = '<div class="console-item">' + response.error + '</div>';
              } else if (response.flag === '1') {
                this.result = this.changeData(response);
              } else {
                this.result = '<div class="console-item">' + response.issupport + '</div>';
              }
            }
          });
        });
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
        this.$emit('input', val);
      }
    }
  }
</script>

<style>
  #remotePingForm {
    display: block;
    min-height: 0px;
    height: 240px;
    width: 550px;
  }
  #remotePingForm .box-card{
    height: 260px;
  }
  #remotePingForm .console {
    height: 230px;
    padding: 10px;
    overflow: auto;
  }
  #remotePingForm .console-item{
    height: 25px;
    line-height: 25px;
  }
  #remotePingForm .s-form-item {
    width: 500px;
  }
  #remotePingForm .s-form-item-label{
    width: 140px;
  }
  #remotePingForm .s-form-item-content{
    width: 350px;
  }
</style>
