<template>
  <s-tab  :animated="false" v-model="activeTab" class="alarm-add">
    <s-tab-pane label="告警属性" name="prop">
      <div class="title">常规属性</div>
      <s-form
        :model="addAlarmForm"
        :rules="rules"
        label-width="100px"
        ref="formStepA">
        <s-form-item label="名称" prop="name">
          <s-input v-model.trim="addAlarmForm.name" :disabled="addAlarmForm.isExpireRemind === 1 ? true : false"></s-input>
        </s-form-item>
        <s-form-item label="描述" prop="description">
          <s-input v-model="addAlarmForm.description" type="textarea" :disabled="addAlarmForm.isExpireRemind === 1 ? true : false"></s-input>
        </s-form-item>
      </s-form>
    </s-tab-pane>
    <s-tab-pane label="告警方式" name="style" v-if="addAlarmForm.isExpireRemind === 1">
      <s-alert title="请至少选择一种告警方式" type="info" :closable="false" v-show="!boolStyle" style="margin-bottom: 5px"></s-alert>
      <s-radio-group v-model="addAlarmForm.remindType">
        <s-radio :label="1">资产所属配置管理员</s-radio>
        <s-tooltip style="margin-right: 10px;" content="选择资产所属的配置管理员，即代表会为每个资产的配置管理员，以下述方式进行资产服务到期提示。" placement="top-end">
          <i class="iconfont icon-help"></i>
        </s-tooltip>
        <s-radio :label="0">自定义提醒人员</s-radio>
        <s-tooltip content="选择自定义提醒人员，即代表可为所有资产，配置一个或多个不同的服务到期提醒方式和人员。" placement="top-end">
          <i class="iconfont icon-help"></i>
        </s-tooltip>
      </s-radio-group>
      <s-scrollbar wrap-style="max-height: 600px;" v-if="addAlarmForm.remindType === 1">
        <div class="addAlarmFormContent">
          <div class="title">
            <span>客户端</span>
            <s-switch v-model="addAlarmForm.isOpenClientServe" :active-value="1" :inactive-value="0"></s-switch>
          </div>
          <div class="title">
            <span>邮件</span>
            <s-switch v-model="addAlarmForm.isOpenEmailServe" :active-value="1" :inactive-value="0"></s-switch>
          </div>
          <div class="title">
            <span>短信</span>
            <s-switch v-model="addAlarmForm.isOpenMessageServe" :active-value="1" :inactive-value="0"></s-switch>
          </div>
          <div class="title">
            <span>微信</span>
            <s-switch v-model="addAlarmForm.isOpenWeChatServe" :active-value="1" :inactive-value="0"></s-switch>
          </div>
        </div>
      </s-scrollbar>
      <s-scrollbar wrap-style="max-height: 600px;" v-else>
        <div class="addAlarmFormContent">
        <div class="title">
          <span>客户端</span>
          <s-switch v-model="addAlarmForm.isOpenClient" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenClient">
          <s-button @click="linkClient" icon="link">添加引用</s-button>
          <s-button @click="delClientList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenClient" :data="listClient" @selection-change="handleClientSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="用户名" prop="userLoginName"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
          <s-table-column label="手机号" prop="userPhone">
            <template slot-scope="scope">
              <span>{{scope.row.userPhone | capitalize()}}</span>
            </template>
          </s-table-column>
        </s-table>
        <div class="title">
          <span>邮件</span>
          <s-switch v-model="addAlarmForm.isOpenEmail" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenEmail">
          <s-button @click="showMyEmail" icon="plus">手动增加</s-button>
          <s-button @click="linkEmail" icon="link">添加引用</s-button>
          <s-button @click="delEmailList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenEmail" :data="listEmail" @selection-change="handleEmailSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
        </s-table>
        <div class="title">
          <span>短信</span>
          <s-switch v-model="addAlarmForm.isOpenMessage" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenMessage">
          <s-button @click="showMyMessage" icon="plus">手动增加</s-button>
          <s-button @click="linkMessage" icon="link">添加引用</s-button>
          <s-button @click="delMessageList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenMessage" :data="listMessage" @selection-change="handleMessageSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="手机号" prop="userPhone">
            <template slot-scope="scope">
              <span>{{scope.row.userPhone | capitalize()}}</span>
            </template>
          </s-table-column>
        </s-table>
        <div class="title">
          <span>微信</span>
          <s-switch v-model="addAlarmForm.isOpenWeChat" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenWeChat">
          <s-button @click="showMyWeChat" icon="plus">手动增加</s-button>
          <s-button @click="linkWeChat" icon="link">添加引用</s-button>
          <s-button @click="delWeChatList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenWeChat" :data="listWeChat" @selection-change="handleWeChatSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="微信号" prop="userWechat">
            <template slot-scope="scope">
              <span>{{scope.row.userWechat | capitalizeWechat()}}</span>
            </template>
          </s-table-column>
        </s-table>
        </div>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="告警方式" name="style" v-else>
      <s-alert title="请至少选择一种告警方式" type="info" :closable="false" v-show="!boolStyle" style="margin-bottom: 5px"></s-alert>
      <s-scrollbar wrap-style="max-height: 600px;">
        <div class="addAlarmFormContent">
        <div class="title">
          <span>客户端</span>
          <s-switch v-model="addAlarmForm.isOpenClient" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenClient">
          <s-button @click="linkClient" icon="link">添加引用</s-button>
          <s-button @click="delClientList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenClient" :data="listClient" @selection-change="handleClientSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="用户名" prop="userLoginName"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
          <s-table-column label="手机号" prop="userPhone">
            <template slot-scope="scope">
              <span>{{scope.row.userPhone | capitalize()}}</span>
            </template>
          </s-table-column>
        </s-table>
        <div class="title">
          <span>邮件</span>
          <s-switch v-model="addAlarmForm.isOpenEmail" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenEmail">
          <s-button @click="showMyEmail" icon="plus">手动增加</s-button>
          <s-button @click="linkEmail" icon="link">添加引用</s-button>
          <s-button @click="delEmailList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenEmail" :data="listEmail" @selection-change="handleEmailSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
        </s-table>
        <div class="title">
          <span>短信</span>
          <s-switch v-model="addAlarmForm.isOpenMessage" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenMessage">
          <s-button @click="showMyMessage" icon="plus">手动增加</s-button>
          <s-button @click="linkMessage" icon="link">添加引用</s-button>
          <s-button @click="delMessageList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenMessage" :data="listMessage" @selection-change="handleMessageSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="手机号" prop="userPhone">
            <template slot-scope="scope">
              <span>{{scope.row.userPhone | capitalize()}}</span>
            </template>
          </s-table-column>
        </s-table>
        <div class="title">
          <span>微信</span>
          <s-switch v-model="addAlarmForm.isOpenWeChat" :active-value="1" :inactive-value="0"></s-switch>
        </div>
        <s-row v-show="addAlarmForm.isOpenWeChat">
          <s-button @click="showMyWeChat" icon="plus">手动增加</s-button>
          <s-button @click="linkWeChat" icon="link">添加引用</s-button>
          <s-button @click="delWeChatList" icon="delete">删除引用</s-button>
        </s-row>
        <s-table v-show="addAlarmForm.isOpenWeChat" :data="listWeChat" @selection-change="handleWeChatSelect">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="微信号" prop="userWechat">
            <template slot-scope="scope">
              <span>{{scope.row.userWechat | capitalizeWechat()}}</span>
            </template>
          </s-table-column>
        </s-table>
        </div>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="告警策略" name="rule" class="tab-alarm-cel">
      <div class="title">工作时间</div>
      <s-form
        :model="addAlarmForm"
        label-width="150px"
        ref="formStepC">
        <s-form-item label="服务到期前" prop="advanceDays" required v-if="addAlarmForm.isExpireRemind === 1">
          <s-input-number v-model.number="addAlarmForm.advanceDays" :min="1" :max="99" @change="changeNum"></s-input-number><span style="margin: -20px 0 0 10px;vertical-align: middle;display: inline-block;">天提醒</span>
          <div class="s-form-my-error" v-show="isShowErrorNum1">请选择服务到期提醒时间</div>
        </s-form-item>
        <s-form-item label="工作模式" prop="workMode">
          <s-select v-model="addAlarmForm.workMode" @change="modeChange" :disabled="addAlarmForm.isExpireRemind === 1 ? true : false">
            <s-option label="工作时间报警" :value="1"></s-option>
            <s-option label="非工作时间报警" :value="2"></s-option>
            <s-option label="全天报警" :value="3"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="工作起始时间" v-if="addAlarmForm.isExpireRemind !== 1" prop="_startTime" :required="isRequired" ref="start">
          <s-time-picker v-model="addAlarmForm._startTime" format="HH:mm" placeholder="工作起始时间" @change="getStartTime" :disabled="addAlarmForm.workMode === 3"></s-time-picker>
          <div class="s-form-my-error" v-show="isShowErrorBegin">请选择起始时间</div>
        </s-form-item>
        <s-form-item label="工作结束时间" v-if="addAlarmForm.isExpireRemind !== 1" prop="_endTime" :required="isRequired" ref="end">
          <s-time-picker v-model="addAlarmForm._endTime" format="HH:mm" placeholder="工作结束时间" @change="getEndTime" :disabled="addAlarmForm.workMode === 3"></s-time-picker>
          <div class="s-form-my-error" v-show="isShowErrorEnd">请选择结束时间</div>
        </s-form-item>
      </s-form>
    </s-tab-pane>
  </s-tab>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {batchUuid, delArray, delDiffArray} from 'sunflower-common-utils'

  export default {
    data() {
      return {
        activeTab: 'prop',
        addAlarmForm: {
          clientUuid: '9fca2edf48e844eca579f2d37ee5db8d',
          name: '',
          remindType: 0,
          isExpireRemind: null,
          advanceDays: 2,
          description: '',
          _startTime: '',
          startDateHour: '',
          startDateMinute: '',
          _endTime: '',
          endDateHour: '',
          endDateMinute: '',
          workMode: 1,
          isOpenClient: 0,
          isOpenClientServe: 0,
          isOpenEmail: 0,
          isOpenEmailServe: 0,
          isOpenMessage: 0,
          isOpenMessageServe: 0,
          isOpenWeChat: 0,
          isOpenWeChatServe: 0,
          sysUserClientUuids: '',
          sysUserEmailUuids: '',
          sysUserMessageUuids: '',
          sysUserWeChatUuids: '',
          manualAddEmailAddresss: '',
          manualAddEmailRealNames: '',
          manualAddMessageAddresss: '',
          manualAddMessageRealNames: '',
          manualAddWeChatAccounts: '',
          manualAddWeChatRealNames: ''
        },
        listClient: [],
        listEmail: [],
        listMessage: [],
        listWeChat: [],
        delClient: [],
        delEmail: [],
        delMessage: [],
        delWeChat: [],
        rules: {
          name: [
            {required: true, message: '请输入告警名称', trigger: 'blur'},
            {max: 20, message: '最长输入20个字符', trigger: 'blur'},
            {max: 20, message: '最长输入20个字符', trigger: 'blur'}
          ],
          description: [
            {max: 120, message: '最多输入120个字符', trigger: 'blur'}
          ],
          workMode: [
            {type: 'number', required: true, message: '请设置报警模式', trigger: 'change'}
          ]
        },
        currentUserType: 'client',
        info: {},
        isRequired: true,
        isShowErrorBegin: false,
        isShowErrorNum1: false,
        isShowErrorEnd: false
      }
    },

    props: {
      data: String,
      userList: Array,
      isExpireRemind: Number
    },
    filters: {
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
    computed: {
      boolStyle() {
        if (this.addAlarmForm.remindType === 1) {
          return this.addAlarmForm.isOpenClientServe || this.addAlarmForm.isOpenEmailServe || this.addAlarmForm.isOpenMessageServe || this.addAlarmForm.isOpenWeChatServe;
        } else {
          return this.addAlarmForm.isOpenClient || this.addAlarmForm.isOpenEmail || this.addAlarmForm.isOpenMessage || this.addAlarmForm.isOpenWeChat
        }
      }
    },
    methods: {
      getStartTime(val) {
        if (val) {
          let tmp = this.addAlarmForm;
          tmp.startDateHour = val.getHours();
          tmp.startDateMinute = val.getMinutes();
          this.isShowErrorBegin = false;
        } else {
          this.addAlarmForm.startDateHour = '';
          this.addAlarmForm.DateMinute = '';
          if (this.isRequired) {
            this.isShowErrorBegin = true;
          }
        }
      },
      getEndTime(val) {
        if (val) {
          let tmp = this.addAlarmForm;
          tmp.endDateHour = val.getHours();
          tmp.endDateMinute = val.getMinutes();
          this.isShowErrorEnd = false;
        } else {
          this.addAlarmForm.endDateHour = '';
          this.addAlarmForm.endDateMinute = '';
          if (this.isRequired) {
            this.isShowErrorEnd = true;
          }
        }
      },
      handleClientSelect(val) {
        this.delClient = val;
      },
      handleEmailSelect(val) {
        this.delEmail = val;
      },
      handleMessageSelect(val) {
        this.delMessage = val;
      },
      handleWeChatSelect(val) {
        this.delWeChat = val;
      },
      showMyEmail() {
        this.$emit('showMyEmail');
      },
      showMyMessage() {
        this.$emit('showMyMessage');
      },
      showMyWeChat() {
        this.$emit('showMyWeChat');
      },
      linkClient() {
        this.$emit('showUser', {
          hasSelectUser: this.listClient,
          userType: 'listClient'
        });
        this.currentUserType = 'listClient';
      },
      linkEmail() {
        this.$emit('showUser', {
          hasSelectUser: this.listEmail,
          userType: 'listEmail'
        });
        this.currentUserType = 'listEmail';
      },
      linkMessage() {
        this.$emit('showUser', {
          hasSelectUser: this.listMessage,
          userType: 'listMessage'
        });
        this.currentUserType = 'listMessage';
      },
      linkWeChat() {
        this.$emit('showUser', {
          hasSelectUser: this.listWeChat,
          userType: 'listWeChat'
        });
        this.currentUserType = 'listWeChat';
      },
      delClientList() {
        if (this.delClient.length < 1) {
          this.$message({type: 'info', message: '请选择要删除的数据'});
        } else {
          this.$confirm('是否删除引用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delArray(this.listClient, this.delClient, 'uuid');
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {});
        }
      },
      delEmailList() {
        if (this.delEmail.length < 1) {
          this.$message({type: 'info', message: '请选择要删除的数据'});
        } else {
          this.$confirm('是否删除引用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delDiffArray(this.listEmail, this.delEmail);
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {});
        }
      },
      delMessageList() {
        if (this.delMessage.length < 1) {
          this.$message({type: 'info', message: '请选择要删除的数据'});
        } else {
          this.$confirm('是否删除引用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delDiffArray(this.listMessage, this.delMessage);
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {});
        }
      },
      delWeChatList() {
        if (this.delWeChat.length < 1) {
          this.$message({type: 'info', message: '请选择要删除的数据'});
        } else {
          this.$confirm('是否删除引用?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delDiffArray(this.listWeChat, this.delWeChat);
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {});
        }
      },
      formatStyleData() {
        let tmp = this.addAlarmForm;
        tmp.sysUserClientUuids = batchUuid('uuid', this.listClient).toString();
        let arrEmailAddress = [];
        let arrEmailRealNames = [];
        let arrUserEmailUuids = [];
        let arrMessageAddress = [];
        let arrMessageRealNames = [];
        let arrUserMessageUuids = [];
        let arrWxAddress = [];
        let arrWxRealNames = [];
        let arrUserWxUuids = [];
        for (let i = 0; i < this.listEmail.length; i++) {
          if (this.listEmail[i].tmp) {
            arrEmailAddress.push(this.listEmail[i].userMail);
            arrEmailRealNames.push(this.listEmail[i].userRealName);
          } else {
            arrUserEmailUuids.push(this.listEmail[i].uuid);
          }
        }
        for (let i = 0; i < this.listMessage.length; i++) {
          if (this.listMessage[i].tmp) {
            arrMessageAddress.push(this.listMessage[i].userPhone);
            arrMessageRealNames.push(this.listMessage[i].userRealName);
          } else {
            arrUserMessageUuids.push(this.listMessage[i].uuid);
          }
        }
        for (let i = 0; i < this.listWeChat.length; i++) {
          if (this.listWeChat[i].tmp) {
            arrWxAddress.push(this.listWeChat[i].userWechat);
            arrWxRealNames.push(this.listWeChat[i].userRealName);
          } else {
            arrUserWxUuids.push(this.listWeChat[i].uuid);
          }
        }
        tmp.manualAddEmailAddresss = arrEmailAddress.toString();
        tmp.manualAddEmailRealNames = arrEmailRealNames.toString();
        tmp.sysUserEmailUuids = arrUserEmailUuids.toString();
        tmp.manualAddMessageAddresss = arrMessageAddress.toString();
        tmp.manualAddMessageRealNames = arrMessageRealNames.toString();
        tmp.sysUserMessageUuids = arrUserMessageUuids.toString();
        tmp.manualAddWeChatAccounts = arrWxAddress.toString();
        tmp.manualAddWeChatRealNames = arrWxRealNames.toString();
        tmp.sysUserWeChatUuids = arrUserWxUuids.toString();
        this.$emit('readyPost');
      },
      // 编辑
      getInfo() {
        $axios.get(`/infoSend/getInfoSendVoByInfoSendUuid/${this.data}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.info = res.data;
            this.resetData();
            let a = this.addAlarmForm;
            let b = res.data;
            a.name = b.name;
            a.description = b.description;
            a._startTime = new Date(2017, 1, 1, b.startDateHour, b.startDateMinute);
            a._endTime = new Date(2017, 1, 1, b.endDateHour, b.endDateMinute);
            a.startDateHour = b.startDateHour;
            a.startDateMinute = b.startDateMinute;
            a.endDateHour = b.endDateHour;
            a.endDateMinute = b.endDateMinute;
            a.workMode = b.workMode;
            a.advanceDays = b.advanceDays;
            a.remindType = b.remindType;
            a.isOpenClient = b.isOpenClient;
            a.isOpenClientServe = b.isOpenClient;
            a.isOpenEmail = b.isOpenEmail;
            a.isOpenEmailServe = b.isOpenEmail;
            a.isOpenMessage = b.isOpenMessage;
            a.isOpenMessageServe = b.isOpenMessage;
            a.isOpenWeChat = b.isOpenWeChat;
            a.isOpenWeChatServe = b.isOpenWeChat;
            if (a.remindType === 1) {
              a.isOpenClient = 0
              a.isOpenEmail = 0
              a.isOpenMessage = 0
              a.isOpenWeChat = 0
              this.listClient = []
              this.listEmail = []
              this.listMessage = []
              this.listWeChat = []
            }
            this.modeChange(b.workMode);
          }
        });
      },
      resetData() {
        let arr = [
          { str: 'Client', arr: this.listClient },
          { str: 'Email', arr: this.listEmail },
          { str: 'Message', arr: this.listMessage },
          { str: 'WeChat', arr: this.listWeChat }
        ]
        for (let i = 0; i < arr.length; i++) {
          this.doLinkData(arr[i].str, arr[i].arr);
          if (i > 0) {
            this.doMyData(arr[i].str, arr[i].arr);
          }
        }
      },
      doLinkData(str, arr) { // 处理引用的数据
        let tmp = 'sysUser' + str + 'Uuids';
        if (this.info[tmp].length > 0) {
          let userArr = this.info[tmp].split(',');
          userArr.splice(0, 1);
          for (let i = 0; i < userArr.length; i++) {
            for (let j = 0; j < this.userList.length; j++) {
              if (userArr[i] === this.userList[j].uuid) {
                arr.push(this.userList[j]);
                break;
              }
            }
          }
        }
      },
      doMyData(str, arr) { // 处理手动增加的数据
        let ppdog = {
          Email: 'manualAddEmailAddresss',
          Message: 'manualAddMessageAddresss',
          WeChat: 'manualAddWeChatAccounts'
        };
        let tmp = 'manualAdd' + str + 'RealNames';
        if (this.info[tmp].length > 0) {
          let keyArr = this.info[tmp].split(',');
          keyArr.splice(0, 1);
          let valArr = this.info[ppdog[str]].split(',');
          valArr.splice(0, 1);
          for (let i = 0; i < keyArr.length; i++) {
            if (str === 'Email') {
              arr.push({
                userRealName: keyArr[i],
                userMail: valArr[i],
                tmp: true
              });
            } else if (str === 'Message') {
              arr.push({
                userRealName: keyArr[i],
                userPhone: valArr[i],
                tmp: true
              });
            } else {
              arr.push({
                userRealName: keyArr[i],
                userWechat: valArr[i],
                tmp: true
              });
            }
          }
        }
      },
      modeChange(val) {
        if (val === 3 && this.addAlarmForm.isExpireRemind !== 1) {
          this.isRequired = false;
          this.isShowErrorBegin = false;
          this.isShowErrorEnd = false;
          this.$refs['start'].validateState = '';
          this.$refs['end'].validateState = '';
          this.addAlarmForm._startTime = '';
          this.addAlarmForm._endTime = '';
          this.addAlarmForm.startDateHour = '';
          this.addAlarmForm.startDateMinute = '';
          this.addAlarmForm.endDateHour = '';
          this.addAlarmForm.endDateMinute = '';
        } else {
          this.isRequired = true;
        }
      },
      changeNum(val) {
        if (!val) {
          this.isShowErrorNum1 = true;
        } else {
          this.isShowErrorNum1 = false;
        }
      },
      CheckformStepC(fun) {
        if (this.addAlarmForm.workMode !== 3) {
          if (!this.addAlarmForm._startTime) {
            this.isShowErrorBegin = true;
            fun(false);
          }
          if (!this.addAlarmForm._endTime) {
            this.isShowErrorEnd = true;
            fun(false);
          }
          if (this.addAlarmForm._startTime && this.addAlarmForm._endTime) {
            fun(true);
          }
        } else {
          fun(true);
        }
      }
    },

    created() {
      if (this.data) { // 修改
        this.getInfo();
        this.addAlarmForm.uuid = this.data;
        this.addAlarmForm.isExpireRemind = this.isExpireRemind;
      }
    }
  }
</script>
