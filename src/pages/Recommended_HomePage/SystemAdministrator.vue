<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-29 13:40:36
 * @LastEditTime: 2019-09-09 17:54:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="diy-sys" style="height:100vh;">
    <s-scrollbar wrap-style="height: 100vh;">
      <s-row >
          <s-col span="12" style="padding:5px;">
            <s-card class="box-card">
              <div class="ben">本机状态</div>
              <div>
                <s-row>
                    <s-col span="8">
                      <div class="Meter" style="">
                        <div style="width:100%;text-align:center">CPU使用率</div>
                        <s-chart style="width:100%;text-align:center" :chart="chart1"></s-chart>
                        <div style="width:100%;text-align:center">CPU核数：<span style="font-weight:bold">{{cpuInfo.cpuNu}}</span></div>
                        <div style="width:100%;text-align:center">CPU使用率：<span style="font-weight:bold">{{cpuInfo.cpuUse}}%</span></div>
                      </div>
                    </s-col>
                    <s-col span="8">
                      <div class="Meter" style="">
                        <div style="width:100%;text-align:center">内存使用率</div>
                        <s-chart style="width:100%;text-align:center" :chart="chart2"></s-chart>
                        <div style="width:100%;text-align:center">内存总量：<span style="font-weight:bold">{{memInfo.memTotal}}</span></div>
                        <div style="width:100%;text-align:center">已使用：<span style="font-weight:bold">{{memInfo.memUsed}}</span></div>
                      </div>
                    </s-col>
                    <s-col span="8">
                        <div style="width:100%;text-align:center">磁盘使用率</div>
                        <s-chart style="width:100%;text-align:center" :chart="chart3"></s-chart>
                        <div style="width:100%;text-align:center">磁盘总量：<span style="font-weight:bold">{{diskInfo.diskTotal}}</span></div>
                        <div style="width:100%;text-align:center">已使用：<span style="font-weight:bold">{{diskInfo.diskUsed}}</span></div>
                    </s-col>
                </s-row>
              </div>
            </s-card>
          </s-col>
          <s-col span="12" style="padding:5px;">
            <s-card class="box-card">
              <div class="ben">系统启动信息 <div class="more" @click="StartUp">更多</div></div>
              <div>
                  <s-table
                    :data="openData"
                    height=280
                    stripe>
                    <s-table-column
                      prop="type"
                      label="类型"
                      >
                    </s-table-column>
                    <s-table-column
                      prop="time"
                      label="时间"
                      >
                    </s-table-column>
                  </s-table>
              </div>
            </s-card>
          </s-col>
      </s-row>
      <s-row >
          <s-col span="12" style="padding:5px;">
            <s-card class="box-card">
              <div class="ben">服务状态</div>
              <div>
                <s-row style="text-align:center;margin-top:60px;">
                    <s-col span="6" >
                      <img src="static\images\diy\denglu.png" alt="" @click="logset"  style="cursor:pointer">
                      <div class="top" @click="logset">登录认证设置</div>
                    </s-col>
                    <s-col span="6">
                      <img src="static\images\diy\youjian.png"  @click="emlset" alt="" style="cursor:pointer">
                      <div class="top" @click="emlset">邮件服务器设置</div>
                    </s-col>
                    <s-col span="6">
                      <img src="static\images\diy\duanxin.png" @click="shortset" alt="" style="cursor:pointer">
                      <div class="top" @click="shortset">短信服务器设置</div>
                    </s-col>
                    <s-col span="6">
                      <img src="static\images\diy\weixin.png" @click="winxinset" alt="" style="cursor:pointer">
                      <div class="top" @click="winxinset">微信服务器设置</div>
                    </s-col>
                </s-row>
              </div>
            </s-card>
          </s-col>
          <s-col span="12" style="padding:5px;">
            <s-card class="box-card">
              <div class="ben">产品信息</div>
              <div>
                <s-scrollbar wrap-style="height: 300px;">
                  <div>
                    <view-module-item v-for="item in datalist"
                                      :key="item.content"
                                      :title="item.name"
                                      v-if="info[item.content] || !item.toggle"
                                      :content="info[item.content] ? info[item.content] : item.default ? item.default : ''">
                    </view-module-item>
                  </div>
                  <s-row>
                    <s-col offset="10" span="4">
                      <s-button style="width:100%;margin-top:20px;" @click="registeraa">注册</s-button>
                    </s-col>
                  </s-row>
                </s-scrollbar>
              </div>
            </s-card>
          </s-col>
      </s-row>
      <s-row >
          <s-col span="12" style="padding:5px;">
            <s-card class="sys-card">
              <div class="ben">系统备份 <div class="more" @click="systemBack">更多</div></div>
              <div>
                  <s-row style="text-align:center;margin-top:100px;">
                    <s-col span="8" >
                      <div class="icon iconfont icon-file" style="font-size:40px;"></div>
                      <div class="sys">最新备份文件</div>
                      <div class="text">{{sysBackupLogs.backupFileName}}</div>
                    </s-col>
                    <s-col span="8">
                      <div class="icon iconfont icon-clock" style="font-size:40px;"></div>
                      <div class="sys">备份时间</div>
                      <div class="text">{{sysBackupLogs.createTime}}</div>
                    </s-col>
                    <s-col span="8">
                      <div class="icon iconfont icon-tag2" style="font-size:40px;"></div>
                      <div class="sys">备份状态</div>
                      <div class="text">{{sysBackupLogs.backStatus}}</div>
                    </s-col>
                </s-row>
              </div>
            </s-card>
          </s-col>
          <s-col span="12" style="padding:5px;">
            <s-card class="sys-card">
              <div class="ben">磁盘告警 <span class="more" @click="alarmcenter">更多</span></div>
              <div>
                  <s-table
                    :data="tableData"
                    stripe>
                    <s-table-column
                      prop="eventLevel"
                      label="级别">
                      <template slot-scope="scope">
                        <span v-text="getLevel(scope.row.eventLevel)"></span>
                      </template>
                    </s-table-column>
                    <s-table-column
                      prop="alarmTime"
                      label="告警时间">
                      <template slot-scope="scope">
                        <div v-text="formatDate(scope.row.alarmTime * 1000)"></div>
                      </template>
                    </s-table-column>
                    <s-table-column
                      prop="eventContent"
                      label="告警内容"
                      >
                    </s-table-column>
                  </s-table>
              </div>
            </s-card>
          </s-col>
      </s-row>
      <start-Up v-model="SysStart" v-if="SysStart" :sysdata=sysdata></start-Up>
      <login-Authentication v-model="loginStart" v-if="loginStart"></login-Authentication>
      <emile-Set v-model="emileStart" v-if="emileStart"></emile-Set>
      <Short-Message v-model="ShortStart" v-if="ShortStart"></Short-Message>
      <Winxin v-model="WinxinStart" v-if="WinxinStart"></Winxin>
      <!--产品注册-->
      <s-dialog
        v-model="registerDialog"
        v-if="registerDialog"
        width="700px"
        title="产品注册">
        <s-form :model="register" :rules="registerRules" ref="registerForm" label-width="120px">
          <s-form-item label="序列号" prop="serialNumber">
            <s-input type="text" v-model="register.serialNumber"></s-input>
          </s-form-item>
          <s-form-item label="请求码" prop="requestCode">
            <!--<s-input type="text" v-model="register.requestCode"-->
            <!--:editable="false"></s-input>-->
            <div
              style="box-sizing: border-box;border: solid 1px #344458; border-radius:4px; height:36px; padding:0 10px;">
              {{ register.requestCode ? register.requestCode : '' }}
            </div>
          </s-form-item>
          <s-form-item label="激活码" prop="activationCode">
            <s-input type="textarea" v-model="register.activationCode"></s-input>
          </s-form-item>
        </s-form>
        <template slot="footer">
          <s-button @click="handleRegister">注册</s-button>
          <s-button type="cancel" @click="registerDialog = false">取消</s-button>
        </template>
      </s-dialog>
    </s-scrollbar>
  </div>
</template>
<script>

import viewModuleItem from '@/components/commonView/DialogViewItem'
import $axios from 'sunflower-ajax'
import startUp from './Dialog/StartUp'
// import ProductRegistration from '../SysManage_ConfigCenter/ProductRegistration'
import loginAuthentication from './Dialog/LoginAuthentication'
import emileSet from './Dialog/EmileSet'
import ShortMessage from './Dialog/ShortMessage'
import Winxin from './Dialog/Winxin'
import {isEmpty} from 'lodash'

export default {
  components: {
    viewModuleItem,
    startUp,
    loginAuthentication,
    emileSet,
    ShortMessage,
    Winxin
    // ProductRegistration
  },
  data() {
    return {
      chart1: {
        name: 'chart1',
        type: 'gaugeChart',
        width: '200px',
        height: '200px',
        data: 50
      },
      chart2: {
        name: 'chart2',
        type: 'gaugeChart',
        width: '200px',
        height: '200px',
        data: 50
      },
      chart3: {
        name: 'chart3',
        type: 'gaugeChart',
        width: '200px',
        height: '200px',
        data: 50
      },
      info: {},
      sysdata: [],
      ListData: {},
      tableData: [],
      openData: [],
      cpuInfo: {
        cpuNu: '',
        cpuUse: ''
      },
      memInfo: {},
      diskInfo: {},
      SysStart: false,
      loginStart: false,
      emileStart: false,
      ShortStart: false,
      WinxinStart: false,
      registerDialog: false,
      sysBackupLogs: {
        backupFileName: '暂无数据',
        createTime: '暂无数据',
        backStatus: '暂无数据'
      },
      datalist: [
          {
            name: '客户名称',
            content: 'customerName'
          },
          {
            name: '版本类型',
            content: 'verType'
          },
          {
            name: '产品序列号',
            content: 'snNumber'
          },
          {
            name: '产品版本',
            content: 'prodctVersion'
          },
          {
            name: '内部版本',
            content: 'innerVersion'
          },
          {
            name: '注册状态',
            content: 'regStatus',
            default: '未注册'
          },
          {
            name: '激活时间',
            content: 'regTime'
          },
          {
            name: '服务时限',
            content: 'serviceDays'
          },
          {
            name: '使用时限',
            content: 'workDays'
          },
          {
            name: 'IAM数',
            content: 'iamCount'
          },
          {
            name: 'CMDB数',
            content: 'cmdbAccount'
          },
          {
            name: '资产监控数',
            content: 'devCount',
            toggle: true
          },
          {
            name: '数据库审计数',
            content: 'dbaCount',
            toggle: true
          },
          {
            name: '运维审计数',
            content: 'opCount',
            toggle: true
          },
          {
            name: '日志审计数',
            content: 'logNodeCount',
            toggle: true
          },
          {
            name: '移动设备数',
            content: 'mobileCount',
            toggle: true
          },
          {
            name: '3D机房',
            content: 'active3dRoom'
          }
        ],
      register: {
        serailNum: '',
        requestCode: '',
        activeCode: ''
      },
      registerRules: {
        serailNum: [
          {required: true, message: '请输入序列号', trigger: 'blur'},
          {
            pattern: /^([\dA-Z]{5}-){4}[\dA-Z]{5}$/,
            message: '请填写正确格式的序列号(5个字母数字组合一组,共5组，中间用\' - \'隔开)',
            trigger: 'blur'
          }
        ],
        requestCode: [
          {required: true, message: '服务端错误，未获取到请求码', trigger: 'blur'}
        ],
        activeCode: [
          {required: true, message: '请输入激活码', trigger: 'blur'},
          {
            pattern: /^([\dA-Z]{5}-){49}[\dA-Z]{5}$/,
            message: '请填写正确格式的序列号(5个字母数字组合一组,共50组，中间用\' - \'隔开)',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
        // 注册确定操作
    handleRegister() {
      let _self = this
      _self.$refs.registerForm.validate((valid) => {
        if (valid) {
          // handle register
          $axios.post('/systemmanager/systemsetting/activeRegister', this.register).then(({data}) => {
            if (data === true) {
              this.registerDialog = false
              this.$message.success('激活成功!');
              this.getRegisterInfo(() => {
                location.reload();
              });
            } else {
              this.$message.error('激活失败，请检查序列号或激活码是否正确!')
            }
          })
        }
      })
    },
    registeraa() {
      this.registerDialog = true
      $axios.get('/systemmanager/systemsetting/getRequestCode').then(({data}) => {
        this.register.requestCode = data
      })
    },
    unitFilter(n) {
      let num = parseInt(n)
      if (parseInt(num / 1024 / 1024) > 1) {
        return parseInt(num / 1024 / 1024) + 'GB'
      } else {
        return parseInt(num / 1024) + 'MB'
      }
    },
    getInfo() {
      $axios.get('/omaIndex/getSystemManagerPage').then((res) => {
        this.ListData = res.data
        this.openData = res.data.rebootLog.slice(0, 8)
        this.sysBackupLogs = res.data.sysBackupInfo
        this.sysBackupLogs.createTime = this.formatDate(res.data.sysBackupInfo.createTime * 1000)
        this.sysdata = res.data.rebootLog
        if (res.data) {
          if (!isEmpty(res.data.systemStatus.cpuInfo)) {
            this.cpuInfo.cpuNu = res.data.systemStatus.cpuInfo.cpuNu
            this.cpuInfo.cpuUse = parseInt(res.data.systemStatus.cpuInfo.cpuUse * 100)
          }
          if (!isEmpty(res.data.systemStatus.memInfo)) {
            this.memInfo.memTotal = this.unitFilter(res.data.systemStatus.memInfo.memTotal)
            this.memInfo.memUsed = this.unitFilter(res.data.systemStatus.memInfo.memUsed)
          }
          if (!isEmpty(res.data.systemStatus.diskInfo)) {
            this.diskInfo.diskTotal = this.unitFilter(res.data.systemStatus.diskInfo.diskTotal)
            this.diskInfo.diskUsed = this.unitFilter(res.data.systemStatus.diskInfo.diskUsed)
          }
          this.chart1.data = parseInt(res.data.systemStatus.cpuInfo.cpuUse * 100)
          this.chart2.data = parseInt(res.data.systemStatus.memInfo.memUsed / res.data.systemStatus.memInfo.memTotal * 100)
          this.chart3.data = parseInt(res.data.systemStatus.diskInfo.diskUsed / res.data.systemStatus.diskInfo.diskTotal * 100)
        }
      })
    },
    getRegisterInfo(callback) {
        $axios.get('/systemmanager/systemsetting/getLicenseInfo').then(({data}) => {
          this.info = data;
          if (callback) {
            callback();
          }
        })
    },
    getIndexInfo() {
        $axios.get('/system/getManagerInfo').then((res) => {
          if (res.data) {
            if (res.data.sysBackupLogs.length !== 0) {
              this.sysBackupLogs = res.data.sysBackupLogs[0]
              this.sysBackupLogs.nextBackTime = res.data.nextBackTime
            }
          }
        })
    },
    getDataAlarmLog() {
      let params = {
            condition: {
              sourceList: ['4']
            },
            currentPage: 1,
            pageSize: 10
          }
        $axios.post('/dataAlarmLog/list', params).then((res) => {
          if (res.data) {
            this.tableData = res.data.slice(0, 5)
          }
        })
    },
    getLevel(num) {
      let level = ['未知', '正常', '提示', '警告', '次要', '主要', '严重'];
      return level[num];
    },
          /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
    formatDate(seconds) {
      if (seconds) {
        let date = new Date()
        date.setTime(seconds)
        let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
        return dateStr
      } else {
        return ''
      }
    },
    systemBack() {
      this.$router.push({name: 'systemSet_backup'})
    },
    alarmcenter() {
      this.$router.push({name: 'eventCenter_alarmEvent', query: {text: '磁盘', value: 4}})
    },
    StartUp() {
      this.SysStart = true
    },
    logset() {
      this.loginStart = true
    },
    emlset() {
      this.emileStart = true
    },
    shortset() {
      this.ShortStart = true
    },
    winxinset() {
      this.WinxinStart = true
    }

  },
  created() {
    this.getRegisterInfo()
    this.getIndexInfo()
    this.getDataAlarmLog()
    this.getInfo()
  }
}
</script>

