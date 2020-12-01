<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:41
 * @LastEditTime: 2019-09-26 19:16:40
 * @LastEditors: Please set LastEditors
 -->
<template>
  <s-dialog v-model="dialogFlag" title="协议测试工具" width="800px" id="treatyTestDialog">
    <s-tab :animated="false">
      <s-tab-pane label="ping">
        <s-row class="title">
          <s-button icon="bulletin" class="s-button-icon-only"></s-button>ping测试
          <s-col class="tip">Tip: ping测试选项卡用于测试资产的通断情况</s-col>
        </s-row>
        <s-form :model="pingForm" :rules="pingRules" ref="pingForm" label-width="120px">
          <s-form-item label="ping测试" prop="ip">
            <s-input v-model="pingForm.ip"></s-input>
            <s-input style="display:none"></s-input>
          </s-form-item>
          <s-form-item v-if="pingedFlag">
            <s-scrollbar wrap-class="treatyTestDialogScrollbar" key="tab1Scroll">
              <s-row v-for="(item,name) in pingResult" :key="name" :class="{'state': stateClass(name, pingResult)}">
                <s-col span="8">{{name}}</s-col>
                <s-col span="8">{{item}}
                </s-col>
              </s-row>
            </s-scrollbar>
          </s-form-item>
          <s-form-item>
            <s-button @click="run('ping')">运行</s-button>
            <s-button @click="reset('ping')">重置</s-button>
          </s-form-item>
        </s-form>
      </s-tab-pane>
      <s-tab-pane label="Trace Router">
        <s-row class="title">
          <s-button icon="bulletin" class="s-button-icon-only"></s-button>Trace Router
          <s-col class="tip">Tip: tracert 命令跟踪 TCP/IP 数据包从该计算机到其他远程计算机所采用的路径</s-col>
        </s-row>
        <s-form :model="traceForm" :rules="pingRules" ref="traceForm" label-width="120px">
          <s-form-item label="目标IP地址" prop="ip">
            <s-input v-model="traceForm.ip"></s-input>
            <s-input style="display:none"></s-input>
          </s-form-item>
          <s-form-item v-if="tracedFlag">
            <s-scrollbar wrap-class="treatyTestDialogScrollbar" key="tab2Scroll">
              <s-row v-for="(item,name) in traceResultState" :key="name" :class="{'state': stateClass(name, traceResultState)}">
                <s-col span="8">{{name}}</s-col>
                <s-col span="8">{{item}}
                </s-col>
              </s-row>
              <s-row v-html="tranceResultContent"></s-row>
            </s-scrollbar>
          </s-form-item>
          <s-form-item>
            <s-button @click="run('trace')">运行</s-button>
            <s-button @click="reset('trace')">重置</s-button>
          </s-form-item>
        </s-form>
      </s-tab-pane>
      <s-tab-pane label="SSH">
        <s-row class="title">
          <s-button icon="bulletin" class="s-button-icon-only"></s-button>SSH
          <s-col class="tip">Tip: SSH选项卡用于测试连接远程资产</s-col>
        </s-row>
        <s-form :model="sshForm" :rules="sshRules" ref="sshForm" label-width="120px">
          <s-form-item label="IP地址" prop="host">
            <s-input v-model="sshForm.host"></s-input>
          </s-form-item>
          <s-form-item label="端口号" prop="port">
            <s-input v-model="sshForm.port"></s-input>
          </s-form-item>
          <s-form-item label="超时时间" prop="timeOut">
            <s-input v-model="sshForm.timeOut"></s-input>
          </s-form-item>
          <s-form-item label="用户名" prop="userName">
            <s-input v-model="sshForm.userName"></s-input>
          </s-form-item>
          <s-form-item label="密码" prop="password">
            <s-input v-model="sshForm.password" type="password"></s-input>
          </s-form-item>
          <s-form-item v-if="sshedFlag">
            <s-row v-for="(item,name) in sshResult" :key="name" :class="{'state': stateClass(name, sshResult)}">
              <s-col span="8">{{name}}</s-col>
              <s-col span="8">{{item}}
              </s-col>
            </s-row>
          </s-form-item>
          <s-form-item>
            <s-button @click="run('ssh')">运行</s-button>
            <s-button @click="reset('ssh')">重置</s-button>
          </s-form-item>
        </s-form>
      </s-tab-pane>
      <s-tab-pane label="SNMPTest">
        <s-row class="title">
          <s-button icon="bulletin" class="s-button-icon-only"></s-button>SNMPTest
          <s-col class="tip">Tip: SNMP用于检测资产是否安装了SNMP服务以及设置参数的可用性</s-col>
        </s-row>
        <s-form :model="snmpForm" :rules="snmpRules" ref="snmpForm" label-width="120px">
          <s-form-item label="IP地址" prop="ip">
            <s-input v-model="snmpForm.ip"></s-input>
          </s-form-item>
          <s-form-item label="端口" prop="port">
            <s-input v-model="snmpForm.port"></s-input>
          </s-form-item>
          <s-form-item label="凭证">
            <s-radio-group v-model="snmpForm.cre_snmptest">
              <s-radio class="radio" :label="1">v1</s-radio>
              <s-radio class="radio" :label="2">v2</s-radio>
              <s-radio class="radio" :label="3">v3</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item label="共同体名称" prop="community" v-if="snmpForm.cre_snmptest!==3">
            <s-input v-model="snmpForm.community"></s-input>
          </s-form-item>
          <s-form-item label="用户名" prop="userName" v-if="snmpForm.cre_snmptest===3">
            <s-input v-model="snmpForm.userName"></s-input>
          </s-form-item>
          <s-form-item label="密码" prop="password" v-if="snmpForm.cre_snmptest===3">
            <s-input v-model="snmpForm.password" type="password"></s-input>
          </s-form-item>
          <s-form-item label="认证协议" v-if="snmpForm.cre_snmptest===3">
            <s-select v-model="snmpForm.entry">
              <s-option label="MD5" value="1"></s-option>
              <s-option label="SHA" value="2"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item v-if="snmpedFlag">
            <s-row v-for="(item,name) in snmpResult" :key="name" :class="{'state': stateClass(name, snmpResult)}">
              <s-col span="8">{{name}}</s-col>
              <s-col span="8">{{item}}
              </s-col>
            </s-row>
          </s-form-item>
          <s-form-item>
            <s-button @click="run('snmp')">运行</s-button>
            <s-button @click="reset('snmp')">重置</s-button>
          </s-form-item>
        </s-form>
      </s-tab-pane>
    </s-tab>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { encryptPwd, Validaters } from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash';

  export default {
    data() {
      return {
        dialogFlag: false,
        pingForm: {
          ip: ''
        },
        pingRules: {
          ip: [Validaters.NotNull, Validaters.oneIP]
        },
        pingResult: {},
        pingedFlag: false,
        traceForm: {
          ip: ''
        },
        traceResultState: {},
        tranceResultContent: '',
        tracedFlag: false,
        sshForm: {
          host: '',
          port: '22',
          timeOut: '10000',
          userName: '',
          password: ''
        },
        sshRules: {
          host: [Validaters.NotNull, Validaters.IP],
          port: [
            Validaters.NotNull,
            Validaters.Number
          ],
          timeOut: [Validaters.NotNull],
          userName: [Validaters.NotNull],
          password: [Validaters.NotNull]
        },
        sshResult: {},
        sshedFlag: false,
        snmpForm: {
          ip: '',
          port: '161',
          cre_snmptest: 1,
          community: '',
          userName: '',
          password: '',
          entry: '1'
        },
        snmpRules: {
          ip: [Validaters.NotNull, Validaters.IP],
          port: [Validaters.NotNull],
          community: [Validaters.NotNull],
          userName: [Validaters.NotNull],
          password: [
            Validaters.NotNull,
            Validaters.Min(8)
          ]
        },
        snmpResult: {},
        snmpedFlag: false
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      stateClass(name, obj) {
        return Object.keys(obj).indexOf(name) === 0;
      },
      axiosRun(urlTail, param, callback = () => {}) {
        let Loading = this.$loading({
          target: '#treatyTestDialog .s-dialog-body',
          customClass: 'loadingClass'
        });
        $axios.post(`/systemmanager/otherConfig/${urlTail}`, param).then(({data}) => {
          Loading.close();
          callback(data);
        });
      },
      run(flag) {
        this.$refs[`${flag}Form`].validate(valid => {
          if (!valid) return;
          let urlTail = '';
          let param = '';
          let callback = () => {};
          switch (flag) {
            case 'ping':
              urlTail = 'runPingOrder';
              param = {'ip': this.pingForm.ip};
              callback = response => {
                this.pingedFlag = true;
                if (response && response.hasOwnProperty('failed')) {
                  this.pingResult = {
                    'Ping请求数据失败': ''
                  };
                } else {
                  this.pingResult = {
                    '命令执行完成:': '✔',
                    '本次请求平均时间:': response['PING_AVERAGE_TIME'] + 's',
                    '丢包率:': response['PING_LOST_PACKETE_RATE'] + '%',
                    '丢包数:': response['PING_LOST_PACKETS'],
                    '最大响应时间:': response['PING_MAX_RESPONSE_TIME'] + 's',
                    '最小响应时间:': response['PING_MIN_RESPONSE_TIME'] + 's'
                  }
                }
              };
              break;
            case 'trace':
              urlTail = 'getTraceResult';
              param = {'ip': this.traceForm.ip};
              callback = response => {
                this.tracedFlag = true;
                if (!response) {
                  this.traceResultState = {
                    'Trace请求数据失败': ''
                  };
                  this.tranceResultContent = '';
                } else if (response.indexOf('不支持Trace命令') !== -1) {
                  this.traceResultState = {};
                  this.tranceResultContent = response;
                } else {
                  this.traceResultState = {
                    '命令执行完成:': '✔'
                  };
                  this.tranceResultContent = response.replace(/\n/g, '<br/>');
                }
              };
              break;
            case 'ssh':
              urlTail = 'testSSHProtocol';
              param = cloneDeep(this.sshForm);
              param.password = encryptPwd(param.password);
              callback = response => {
                this.sshedFlag = true;
                if (response !== 'failed') {
                  this.sshResult = {
                    '命令执行完成:': '✔',
                    '检测SSH连接成功': ''
                  };
                } else {
                  this.sshResult = {
                    '命令执行完成:': '✔',
                    '检测SSH连接失败': ''
                  };
                }
              };
              break;
            case 'snmp':
              urlTail = 'testSNMP';
              param = cloneDeep(this.snmpForm);
              param.password !== '' && (param.password = encryptPwd(param.password));
              callback = response => {
                this.snmpedFlag = true;
                if (response !== 'failed') {
                  this.snmpResult = {
                    '命令执行完成:': '✔',
                    '检测snmp连接成功': ''
                  };
                } else {
                  this.snmpResult = {
                    '命令执行完成:': '✔',
                    '检测snmp连接失败': ''
                  };
                }
              };
              break;
          }
          this.axiosRun(urlTail, param, callback);
        });
      },
      reset(flag) {
        switch (flag) {
          case 'ping':
            this.pingForm = {
              ip: ''
            };
            this.pingResult = {};
            this.pingedFlag = false;
            break;
          case 'trace':
            this.traceForm = {
              ip: ''
            };
            this.traceResultState = {};
            this.tranceResultContent = '';
            this.tracedFlag = false;
            break;
          case 'ssh':
            this.sshForm = {
              host: '',
              port: '22',
              timeOut: '10000',
              userName: '',
              password: ''
            };
            this.sshResult = {};
            this.sshedFlag = false;
            break;
          case 'snmp':
            this.snmpForm = {
              ip: '',
              port: '161',
              cre_snmptest: 1,
              community: '',
              userName: '',
              password: '',
              entry: '1'
            };
            this.snmpResult = {};
            this.snmpedFlag = false;
            break;
        }
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
