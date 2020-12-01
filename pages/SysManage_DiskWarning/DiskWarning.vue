/*
* @Author: Null
* @Date: Null
* @Last Modified by: shifeng
* @Last Modified time: 2019-01-22 15:44:18
*/

<template>
  <section id="disk-warning" style="margin:0">
    <s-row type="flex" justify="center" :gutter="8">
      <s-col :span="12">
        <s-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-pie-chart"></i>
              磁盘资产
            </span>
          </div>
          <s-row type="flex" justify="center" align="middle" style="text-align: center">
            <s-col :span="8">
              <div style="margin-top: 22px">保留分区使用率</div>
              <s-chart :chart="chart1"></s-chart>
              <div>已使用量:{{this.diskInfo.holdUsed | unitFilter}}</div>
              <div>可用总量:{{this.diskInfo.holdTotal | unitFilter}}</div>
            </s-col>
            <s-col :span="8">
              <div style="margin-top: 22px">数据分区使用率</div>
              <s-chart :chart="chart2"></s-chart>
              <div>已使用量:{{this.diskInfo.dataUsed | unitFilter}}</div>
              <div>可用总量:{{this.diskInfo.dataTotal | unitFilter}}</div>
            </s-col>
            <s-col :span="8">
              <div style="margin-top: 22px">挂载分区使用率</div>
              <s-chart :chart="chart3"></s-chart>
              <div>已使用量:{{this.diskInfo.mountUsed | unitFilter}}</div>
              <div>可用总量:{{this.diskInfo.mountTotal | unitFilter}}</div>
            </s-col>
          </s-row>
        </s-card>
      </s-col>
      <s-col class="disk-warn-set" :span="12">
        <s-card class="box-card" style="height: 300px;">
          <div slot="header" class="clearfix">
            <span class="card-title">
              <i class="iconfont icon-set"></i>
              磁盘预警值设置
            </span>
          </div>
          <s-form :inline="true" label-position="right" ref="diskSetForm" :model="clearForm" :rules="diskRules">
            <s-col :span="10" class="disk-form-item" style="padding-left: 52px">
              <s-form-item label="类型" prop="type">
                <s-select v-model="clearForm.type" style="width:120px;" @change="selectType">
                  <s-option label="百分比" :value="0"></s-option>
                  <s-option label="磁盘大小" :value="1"></s-option>
                </s-select>
              </s-form-item>
            </s-col>
            <s-col :span="14" class="disk-form-item">
              <s-form-item v-if='itemShow' label="已使用磁盘百分比 >=" prop="valuePerc">
                <s-input v-model="clearForm.valuePerc" style="width:160px;">
                  <template slot="append">%</template>
                </s-input>
              </s-form-item>
              <s-form-item v-if='!itemShow' label="已使用磁盘大小 >=" prop="valueSize">
                <s-input v-model="clearForm.valueSize" style="width:160px;">
                  <template slot="append">G</template>
                </s-input>
              </s-form-item>
            </s-col>
            <div style="font-weight: bold;padding-bottom: 10px;">
              <span class="card-title">
                <i class="iconfont icon-set"></i>
                磁盘转存清理设置
              </span>
            </div>
            <s-col :span="10" class="disk-form-item">
              <s-form-item label="备份服务器" prop="archiveDeviceUuid">
                <s-select v-model="clearForm.archiveDeviceUuid" placeholder="请选择" style="width:120px;">
                  <s-option v-for="item in serverList" :key="item.id" :value="item.uuid" :label="`${item.archiveDeviceIp}(${item.archiveDeviceName})`"></s-option>
                </s-select>
              </s-form-item>
            </s-col>
            <s-col :span="14" class="disk-form-item">
              <s-form-item label="历史数据保留天数" prop="saveDays">
                <s-input v-model="clearForm.saveDays"></s-input>
              </s-form-item>
            </s-col>
            <s-col :span="13" class="disk-form-item">
              <s-form-item label="转存失败是否强制清理" prop="isClear">
                <s-radio-group v-model="clearForm.isClear">
                  <s-radio :label="1">是</s-radio>
                  <s-radio :label="2">否</s-radio>
                </s-radio-group>
              </s-form-item>
            </s-col>
            <s-col :span="11" class="disk-form-item">
              <s-form-item label="启动">
                <s-switch v-model="clearForm.autoFlag" :active-value="1" :inactive-value="2"></s-switch>
              </s-form-item>
            </s-col>
            <s-col :span="10" :offset="8">
              <s-form-item>
                <s-button @click="saveDiskSet" icon="correct">提交</s-button>
              </s-form-item>
            </s-col>
          </s-form>
        </s-card>
      </s-col>
    </s-row>
    <s-row :gutter="12" style="margin-top: 20px">
      <s-col :span="8">
        <div class="warn-set-div">
          <div class="defaultBgColor warn-set-legend">
            <s-checkbox v-model="form.email" @change="saveInitMail"></s-checkbox>
            <span class="field-title">启用邮件告警</span>
          </div>
          <s-row v-if="mailShow">
            <s-button @click="citeUserInfo(1)" icon="user">引用用户信息</s-button>
            <s-button @click="handMovement(1)" icon="plus">手动添加</s-button>
            <s-scrollbar wrap-class="scrollTableHeight">
              <s-table :data="emailList">
                <s-table-column label="email" prop="userEmail"></s-table-column>
                <s-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <i title='删除' class="iconfont icon-delete" @click="handleDel(scope.row, 1)"></i>
                  </template>
                </s-table-column>
              </s-table>
            </s-scrollbar>
          </s-row>
          <s-row v-else type="flex" justify="center" align="middle" style="height: 100%">
            <s-col>暂未开启</s-col>
          </s-row>
        </div>
      </s-col>
      <s-col :span="8">
        <div class="warn-set-div">
          <div class="defaultBgColor warn-set-legend">
            <s-checkbox v-model="form.shortMessage" @change="saveInitMsg"></s-checkbox>
            <span class="field-title">启用短信告警</span>
          </div>
          <s-row v-if="msgShow">
            <s-button @click="citeUserInfo(2)" icon="user">引用用户信息</s-button>
            <s-button @click="handMovement(2)" icon="plus">手动添加</s-button>
            <s-scrollbar wrap-class="scrollTableHeight">
              <s-table :data="shortMessageList">
                <s-table-column label="电话号码" prop="userTel">
                  <template slot-scope="scope">
                    <span>{{scope.row.userTel | capitalize()}}</span>
                  </template>
                </s-table-column>
                <s-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <i title='删除' class="iconfont icon-delete" @click="handleDel(scope.row, 2)"></i>
                  </template>
                </s-table-column>
              </s-table>
            </s-scrollbar>
          </s-row>
          <s-row v-if="!msgShow" type="flex" justify="center" align="middle" style="height: 100%">
            <s-col>暂未开启</s-col>
          </s-row>
        </div>
      </s-col>
      <s-col :span="8">
        <div class='warn-set-div'>
          <div class="defaultBgColor warn-set-legend">
            <s-checkbox v-model="form.wechat" @change="saveInitWechat"></s-checkbox>
            <span class="field-title">启用微信告警</span>
          </div>
          <s-row v-if="wechatShow">
            <s-button @click="citeUserInfo(3)" icon="user">引用用户信息</s-button>
            <s-button @click="handMovement(3)" icon="plus">手动添加</s-button>
            <s-scrollbar wrap-class="scrollTableHeight">
              <s-table :data="wechatList">
                <s-table-column label="微信号" prop="userWeChat">
                  <template slot-scope="scope">
                    <span>{{scope.row.userWeChat | capitalizeWechat()}}</span>
                  </template>
                </s-table-column>
                <s-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <i title='删除' class="iconfont icon-delete" @click="handleDel(scope.row, 3)"></i>
                  </template>
                </s-table-column>
              </s-table>
            </s-scrollbar>
          </s-row>
          <s-row v-if="!wechatShow" type="flex" justify="center" align="middle" style="height: 100%">
            <s-col>暂未开启</s-col>
          </s-row>
        </div>
      </s-col>
    </s-row>
    <!--手动添加-->
    <s-dialog v-model="handDialog" v-if="handDialog" title="手动添加">
      <hand-use :showType="showType" ref="chooseUserByHand"></hand-use>
      <template slot="footer">
        <s-button @click="saveUserByHand">保存</s-button>
        <s-button type="cancel" @click="handDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--用户列表-->
    <s-dialog v-model="userListDialog" width=800px v-if="userListDialog" title="用户列表">
      <user-list :showType="showType" ref="userlist"></user-list>
      <template slot="footer">
        <s-button @click="saveUser">保存</s-button>
        <s-button type="cancel" @click="userListDialog = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>
<style lang="stylus">
#disk-warning
  .s-form-item
    margin-bottom: 18px;
</style>
<script type="text/babel">
  import HandUse from './HandUseUser'
  import UserList from './UseUser'
  import $axios from 'sunflower-ajax'
  import {isEmpty} from 'lodash'
  let validateMin = (rule, value, callback) => {
    let reg = /(^[1-8][0-9]$)|(^90$)/;
    let num = parseFloat(value)
    if (!reg.test(num)) {
      callback(new Error('请输入10到90之间的整数值'));
    } else {
      callback()
    }
  }
  let validateDay = (rule, value, callback) => {
    let reg = /(^1(([0-7][0-9])|80)$)|(^[1-9][0-9]$)|(^[1-9]$)/;
    let num = parseFloat(value)
    if (!reg.test(num)) {
      callback(new Error('请输入1到180之间的整数值'));
    } else {
      callback()
    }
  }
  // let isNumber = (rule, value, callback) => {
  //   if (isNaN(value)) {
  //     callback(new Error('请输入数字'))
  //   } else {
  //     callback()
  //   }
  // }
  let isNum = (rule, value, callback) => {
    let reg = /^\d+$/;
    if (!reg.test(value)) {
      callback(new Error(`请输入整数`));
    } else {
      callback()
    }
  }
  export default {
    data() {
      let validateSize = (rule, value, callback) => {
        let minDisk = parseInt(this.totalCheckDisk / 1024 / 1024 * 0.1)
        let maxDisk = parseInt(this.totalCheckDisk / 1024 / 1024 * 0.9)
        let v = parseInt(value)
        if (v > maxDisk || v < minDisk) {
          callback(new Error(`磁盘大小范围在${minDisk}G-${maxDisk}G`))
        } else {
          callback()
        }
      }
      return {
        form: {
          email: true,
          shortMessage: true,
          wechat: true
        },
        emailList: [],
        shortMessageList: [],
        wechatList: [],
        chart1: {
          name: 'chart1',
          type: 'ringChart',
          width: '100%',
          height: '150px',
          data: 0
        },
        chart2: {
          name: 'chart2',
          type: 'ringChart',
          width: '100%',
          height: '150px',
          data: 0
        },
        chart3: {
          name: 'chart3',
          type: 'ringChart',
          width: '100%',
          height: '150px',
          data: 0
        },
        clearForm: {
          type: 0,
          valuePerc: '',
          isClear: 2,
          valueSize: '',
          saveDays: '',
          autoFlag: 2,
          archiveDeviceUuid: ''
        },
        handDialog: false,
        userListDialog: false,
        showType: '',
        itemShow: true,
        serverList: [],
        diskInfo: {
          dataTotal: '11',
          dataUsed: '0',
          mountTotal: '11',
          mountUsed: '0',
          holdTotal: '11',
          holdUsed: '0'
        },
        totalCheckDisk: '',
        mailShow: true,
        msgShow: true,
        wechatShow: true,
        diskRules: {
          valuePerc: [
            {validator: validateMin, trigger: 'blur'},
            {validator: isNum, trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          valueSize: [
            {validator: validateSize, trigger: 'blur'},
            {validator: isNum, trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          archiveDeviceUuid: [{required: true, message: '不能为空', trigger: 'blur'}],
          saveDays: [
            {validator: validateDay, trigger: 'blur'},
            // {validator: isNumber, trigger: 'blur'},
            {validator: isNum, trigger: 'blur'},
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        flag: false
      }
    },
    components: {
      HandUse,
      UserList
    },
    filters: {
      unitFilter(n) {
        let num = n
        if ((num / 1024 / 1024) > 1) {
          let datanum = (num / 1024 / 1024)
          return datanum.toFixed(2) + 'G'
        } else {
          let datanum = (num / 1024 / 1024)
          return datanum.toFixed(2) + 'MB'
        }
      },
      capitalize: (value) => {
        if (!value) return ''
        if (value.length > 3) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      },
      capitalizeWechat: (value) => {
        if (!value) return ''
        if (value.length > 0) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      }
    },
    methods: {
      saveAlarmInfo(mode, value) {
        $axios.get(`/diskAlarmConf/changeMode/${mode}/${value}`).then((res) => {
          if (value === 'on') {
            if (res.data === true) {
              switch (mode) {
                case 'email': this.mailShow = true; break;
                case 'sms': this.msgShow = true; break;
                case 'wechat': this.wechatShow = true; break;
              }
            }
          }
          if (value === 'off') {
            if (res.data === true) {
              switch (mode) {
                case 'email': this.mailShow = false; break;
                case 'sms': this.msgShow = false; break;
                case 'wechat': this.wechatShow = false; break;
              }
            }
          }
        })
      },
      saveInitWechat() {
        if (this.form.wechat === true) {
          this.saveAlarmInfo('wechat', 'on')
        }
        if (this.form.wechat === false) {
          this.saveAlarmInfo('wechat', 'off')
        }
      },
      saveInitMsg() {
        if (this.form.shortMessage === true) {
          this.saveAlarmInfo('sms', 'on')
        }
        if (this.form.shortMessage === false) {
          this.saveAlarmInfo('sms', 'off')
        }
      },
      saveInitMail() {
        if (this.form.email === true) {
          this.saveAlarmInfo('email', 'on')
        }
        if (this.form.email === false) {
          this.saveAlarmInfo('email', 'off')
        }
      },
      getDiskInfo() {
        $axios.get('/diskAlarmConf/getConfInfo').then((res) => {
          if (!isEmpty(res.data.confInfo)) {
            res.data.confInfo.autoFlag = res.data.autoFlag;
            this.clearForm = Object.assign({}, res.data.confInfo)
          }
          this.totalCheckDisk = res.data.diskTotal
          this.emailList = res.data.emailList
          this.shortMessageList = res.data.phoneList
          this.wechatList = res.data.wechatList
          if (!isEmpty(res.data.diskInfo)) {
            this.diskInfo = res.data.diskInfo
          }
          if (this.diskInfo.holdTotal === '0') {
            this.chart1.data = 0
          } else {
            let datanum = (this.diskInfo.holdUsed / this.diskInfo.holdTotal * 100)
            this.chart1.data = this.chart1.data = datanum.toFixed(3);
          }
          if (this.diskInfo.dataTotal === '0') {
            this.chart2.data = 0
          } else {
            let datanum = (this.diskInfo.dataUsed / this.diskInfo.dataTotal * 100);
            this.chart2.data = datanum.toFixed(3);
          }
          if (this.diskInfo.mountTotal === '0') {
            this.chart3.data = 0
          } else {
            let datanum = (this.diskInfo.mountUsed / this.diskInfo.mountTotal * 100);
            this.chart3.data = datanum.toFixed(3);
          }
          (res.data.chkSel.isEmail === 0) ? this.form.email = false : this.form.email = true;
          (res.data.chkSel.isSms === 0) ? this.form.shortMessage = false : this.form.shortMessage = true;
          (res.data.chkSel.isWechat === 0) ? this.form.wechat = false : this.form.wechat = true;
        });
      },
      saveDiskSet() {
        let form = this.$refs['diskSetForm']
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          $axios.post('/diskAlarmConf/saveDiskMointorConf', this.clearForm, {
            logTemplate: '设置'
          }).then((res) => {
            if (res.data === true) {
              this.$message({message: '保存成功', type: 'success'});
            } else {
              this.$message({message: '保存失败', type: 'error'});
            }
          })
        })
      },
      getBackupServerList() {
        $axios.get('/archiveDevice/getList').then((res) => {
          if (res.data.length !== 0) {
            this.serverList = res.data
            this.clearForm.archiveDeviceUuid = res.data[0].uuid
          }
        })
      },
      handleDel(row, type) {
        const vm = this
        vm.$confirm('确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/diskAlarmConf/delAlarmInfo/${row.uuid}`).then((res) => {
            if (res.data === true) {
              vm.$message({type: 'success', message: '删除成功'});
              switch (type) {
                case 1: vm.getMailList(); break;
                case 2: vm.getCellphoneList(); break;
                case 3: vm.getWechatList(); break;
              }
            }
          });
        }).catch(() => {});
      },
      getMailList() {
        $axios.get('/diskAlarmConf/getConfInfo').then((res) => {
          this.emailList = res.data.emailList
        });
      },
      getCellphoneList() {
        $axios.get('/diskAlarmConf/getConfInfo').then((res) => {
          this.shortMessageList = res.data.phoneList
        });
      },
      getWechatList() {
        $axios.get('/diskAlarmConf/getConfInfo').then((res) => {
          this.wechatList = res.data.wechatList
        });
      },
      citeUserInfo(type) {
        this.showType = type
        this.userListDialog = true
      },
      handMovement(type) {
        this.showType = type
        this.handDialog = true
      },
      saveUser() {
        let form = {
          checkUser: this.$refs['userlist'].checkUser
        }
        switch (this.showType) {
          case 1:
            $axios.post('/diskAlarmConf/addEmails', form).then((res) => {
              let infoType
              res.data.code === '0' ? infoType = 'success' : infoType = 'error'
              this.$message({message: res.data.msg, type: infoType});
              this.getMailList()
              this.userListDialog = false
            });
            break;
          case 2:
            $axios.post('/diskAlarmConf/addPhones', form).then((res) => {
              let infoType
              res.data.code === '0' ? infoType = 'success' : infoType = 'error'
              this.$message({message: res.data.msg, type: infoType});
              this.getCellphoneList()
              this.userListDialog = false
            });
            break;
          case 3:
            $axios.post('/diskAlarmConf/addWechats', form).then((res) => {
              let infoType
              res.data.code === '0' ? infoType = 'success' : infoType = 'error'
              this.$message({message: res.data.msg, type: infoType});
              this.getWechatList()
              this.userListDialog = false
            });
            break;
        }
      },
      saveUserByHand() {
        const formObj = this.$refs['chooseUserByHand'].$refs['addForm']
        switch (this.showType) {
          case 1:
            let mailForm = {
              checkUser: [this.$refs['chooseUserByHand'].form.mail]
            }
            formObj.validate(valid => {
              if (!valid) return;
              $axios.post('/diskAlarmConf/addEmails', mailForm).then((res) => {
                let infoType
                res.data.code === '0' ? infoType = 'success' : infoType = 'error'
                this.$message({message: res.data.msg, type: infoType});
                this.getMailList()
                this.handDialog = false
              });
            })
            break;
          case 2:
            let cellForm = {
              checkUser: [this.$refs['chooseUserByHand'].form.cellPhone]
            }
            formObj.validate(valid => {
              if (!valid) return;
              $axios.post('/diskAlarmConf/addPhones', cellForm).then((res) => {
                let infoType
                res.data.code === '0' ? infoType = 'success' : infoType = 'error'
                this.$message({message: res.data.msg, type: infoType});
                this.getCellphoneList()
                this.handDialog = false
              });
            })
            break;
          case 3:
            let weChatForm = {
              checkUser: [this.$refs['chooseUserByHand'].form.weChat]
            }
            formObj.validate(valid => {
              if (!valid) return;
              $axios.post('/diskAlarmConf/addWechats', weChatForm).then((res) => {
                let infoType
                res.data.code === '0' ? infoType = 'success' : infoType = 'error'
                this.$message({message: res.data.msg, type: infoType});
                this.getWechatList()
                this.handDialog = false
              });
            })
            break;
        }
      },
      selectType() {
        this.flag = true
      }
    },
    created() {
      this.getBackupServerList()
      this.getDiskInfo()
    },
    watch: {
      'clearForm.type': {
        deep: true,
        handler(val) {
          if (val === 1) {
            this.itemShow = false;
            if (this.flag) {
              this.clearForm.valueSize = ''
            }
          } else {
            this.itemShow = true;
            if (this.flag) {
              this.clearForm.valuePerc = ''
            }
          }
          this.$refs.diskSetForm.clearValidate('valuePerc');
          this.$refs.diskSetForm.clearValidate('valueSize');
        }
      },
      form: {
        deep: true,
        handler(val) {
          (val.email === false) ? this.mailShow = false : this.mailShow = true;
          (val.shortMessage === false) ? this.msgShow = false : this.msgShow = true;
          (val.wechat === false) ? this.wechatShow = false : this.wechatShow = true;
        }
      }
    }
  }
</script>
