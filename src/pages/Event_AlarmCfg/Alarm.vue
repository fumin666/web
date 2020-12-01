<template>
  <section class="alarm-cfg">
    <s-table-page
      :data="alarmCfgList"
      :header-actions="getListActionsDef()"
      :header-search="getSearchDef()"
      @selection-change="handleAlarmListChange"
      key="alarmCfgList">
      <s-table-column type="selection" width="45" :selectable="getDisabled"></s-table-column>
      <s-table-column label="名称" prop="name"></s-table-column>
      <s-table-column label="通知方式" prop="sendMode"></s-table-column>
      <s-table-column label="描述" prop="description"></s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="view(scope.row)"> </i>
          <i class="iconfont icon-edit" title="编辑" @click="modify(scope.row)"> </i>
          <i class="iconfont icon-delete" title="删除" v-if="scope.row.isInit !== 1" @click="del(scope.row)"> </i>
        </template>
      </s-table-column>
    </s-table-page>
    <!--添加-->
    <s-dialog
      v-model="bloomAdd"
      v-if="bloomAdd"
      :title="dialogTitle"
      append-to-body>
      <alarm-add ref="addAlarm"
                 @showMyEmail="bloomEmail = true"
                 @showMyMessage="bloomMessage = true"
                 @showMyWeChat="bloomWeChat = true"
                 @showUser="showUser"
                 @readyPost="readyPost">
      </alarm-add>
      <template slot="footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="bloomAdd = false">取消</s-button>
      </template>
    </s-dialog>
    <!--添加引用-->
    <s-dialog v-model="bloomUser" v-if="bloomUser" title="账号" width="800px" append-to-body>
      <my-user :data="userList" :has-select="hasSelectUser" :type="userType" ref="myUser"></my-user>
      <template slot="footer">
        <s-button @click="myUserOk">确定</s-button>
        <s-button type="cancel" @click="bloomUser = false">取消</s-button>
      </template>
    </s-dialog>
    <!--手动邮件-->
    <s-dialog v-model="bloomEmail" v-if="bloomEmail" title="邮件" append-to-body>
      <my-email ref="myEmail"></my-email>
      <template slot="footer">
        <s-button @click="myEmailOk">确定</s-button>
        <s-button type="cancel" @click="bloomEmail = false">取消</s-button>
      </template>
    </s-dialog>
    <!--手动短信-->
    <s-dialog v-model="bloomMessage" v-if="bloomMessage" title="短信" append-to-body>
      <my-message ref="myMessage"></my-message>
      <template slot="footer">
        <s-button @click="myMessageOk">确定</s-button>
        <s-button type="cancel" @click="bloomMessage = false">取消</s-button>
      </template>
    </s-dialog>
    <!--手动微信-->
    <s-dialog v-model="bloomWeChat" v-if="bloomWeChat" title="微信" append-to-body>
      <my-we-chat ref="myWeChat"></my-we-chat>
      <template slot="footer">
        <s-button @click="myWeChatOk">确定</s-button>
        <s-button type="cancel" @click="bloomWeChat = false">取消</s-button>
      </template>
    </s-dialog>
    <!--查看告警-->
    <s-dialog v-model="bloomView" v-if="bloomView" title="查看告警" append-to-body>
      <alarm-view :data="currentAlarmUuid" :remindType="remindType" :isExpireRemind="isExpireRemind" :userList="userList"></alarm-view>
    </s-dialog>
    <!--修改告警-->
    <s-dialog v-model="bloomModify" v-if="bloomModify" title="修改告警" append-to-body>
      <alarm-add ref="modifyAlarm"
                 :data="currentAlarmUuid"
                 :isExpireRemind="isExpireRemind"
                 :userList="userList"
                 @showMyEmail="bloomEmail = true"
                 @showMyMessage="bloomMessage = true"
                 @showMyWeChat="bloomWeChat = true"
                 @showUser="showUser"
                 @readyPost="readyPost">
      </alarm-add>
      <template slot="footer">
        <s-button @click="addOk">确定</s-button>
        <s-button type="cancel" @click="bloomModify = false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import AlarmAdd from './AlarmAdd'
  import MyUser from './MyUser'
  import MyEmail from './MyEmail'
  import MyMessage from './MyMessage'
  import MyWeChat from './MyWeChat'
  import {batchUuid} from 'sunflower-common-utils'
  import AlarmView from './AlarmView'

  export default {
    components: {

      AlarmAdd,
      MyUser,
      MyEmail,
      MyMessage,
      MyWeChat,
      AlarmView
    },

    data() {
      return {
        dialogTitle: '添加',
        alarmCfgList: [],
        userList: [],
        delAlarmList: [],
        bloomAdd: false,
        bloomUser: false,
        bloomEmail: false,
        bloomMessage: false,
        bloomWeChat: false,
        bloomView: false,
        bloomModify: false,
        hasSelectUser: [],
        userType: '',
        currentAlarmUuid: '',
        isExpireRemind: null,
        remindType: null,
        currentMode: 'addAlarm',
        url: {
          addAlarm: '/infoSend/save',
          modifyAlarm: '/infoSend/upt'
        }
      }
    },

    methods: {
      getDisabled(row) {
        if (row.isInit === 1) {
          return false
        } else {
          return true
        }
      },
      getList() {
        $axios.get('/infoSend/list').then((res) => {
          if (res.data && res.data instanceof Array) {
            this.alarmCfgList = res.data;
          }
        });
      },
      getUsers() {
        $axios.post('/iamUserInfo/list', {}).then((res) => {
          if (res.data && res.data instanceof Array) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].userPhone = res.data[i].userCellphone;
            }
            this.userList = res.data;
          }
        });
      },
      getListActionsDef() {
        let vm = this;
        return {
          width: 12,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              vm.currentMode = 'addAlarm';
              vm.bloomAdd = true;
              vm.dialogTitile = '添加';
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              vm.batchDel();
            }
          }]
        }
      },
      batchDel() {
        if (this.delAlarmList.length > 0) {
          this.$confirm('确定删除选中的数据?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/infoSend/deleteInfoSend', batchUuid('uuid', this.delAlarmList), {
              data: this.delAlarmList,
              logTemplate: '删除|告警方式配置(#name#)'
            }).then((res) => {
              if (res.data && res.data === true) {
                this.$message({type: 'success', message: '删除告警设置成功'});
                this.getList();
              }
            });
          }).catch(() => {});
        } else {
          this.$message({type: 'info', message: '请选择要删除的数据'});
        }
      },
      getSearchDef() {
        return {
          width: 4,
          offset: 8,
          placeholder: '请输入告警名称查询',
          searchProps: ['name']
        }
      },
      view(row) {
        this.currentAlarmUuid = row.uuid;
        this.isExpireRemind = row.isExpireRemind
        this.remindType = row.remindType
        this.bloomView = true;
      },
      modify(row) {
        this.currentMode = 'modifyAlarm';
        this.currentAlarmUuid = row.uuid;
        this.isExpireRemind = row.isExpireRemind
        this.bloomModify = true;
      },
      del(row) {
        this.$confirm('确定删除此条告警设置？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = [];
          data.push(row.uuid);
          $axios.post('/infoSend/deleteInfoSend', data, {
            data: [{name: row.name}],
            logTemplate: '删除|告警方式配置(#name#)'
          }).then((res) => {
            if (res.data && res.data === true) {
              this.$message({type: 'success', message: '删除告警设置成功'});
              this.getList();
            }
          });
        }).catch(() => {});
      },
      handleAlarmListChange(val) {
        this.delAlarmList = val;
      },
      addOk() {
        let tmp = this.$refs[this.currentMode];
        tmp.$refs.formStepA.validate((valid) => {
          if (valid) {
            if (tmp.boolStyle) {
              if (tmp.addAlarmForm.isExpireRemind !== 1) {
                delete tmp.addAlarmForm.remindType
                delete tmp.addAlarmForm.advanceDays
              }
              if (tmp.addAlarmForm.isOpenClient === 1 && tmp.addAlarmForm.remindType !== 1 && tmp.listClient.length === 0) {
                this.$message({type: 'error', message: '请选择客户端列表'});
                tmp.activeTab = 'style';
                return false;
              }
              if (tmp.addAlarmForm.isOpenEmail === 1 && tmp.addAlarmForm.remindType !== 1 && tmp.listEmail.length === 0) {
                this.$message({type: 'error', message: '请选择邮件列表'});
                tmp.activeTab = 'style';
                return false;
              }
              if (tmp.addAlarmForm.isOpenMessage === 1 && tmp.addAlarmForm.remindType !== 1 && tmp.listMessage.length === 0) {
                this.$message({type: 'error', message: '请选择短信列表'});
                tmp.activeTab = 'style';
                return false;
              }
              if (tmp.addAlarmForm.isOpenWeChat === 1 && tmp.addAlarmForm.remindType !== 1 && tmp.listWeChat.length === 0) {
                this.$message({type: 'error', message: '请选择微信列表'});
                tmp.activeTab = 'style';
                return false;
              }
              if (tmp.addAlarmForm.isExpireRemind === 1 && tmp.addAlarmForm.remindType === 1) {
                tmp.addAlarmForm.isOpenClient = tmp.addAlarmForm.isOpenClientServe
                tmp.addAlarmForm.isOpenEmail = tmp.addAlarmForm.isOpenEmailServe
                tmp.addAlarmForm.isOpenMessage = tmp.addAlarmForm.isOpenMessageServe
                tmp.addAlarmForm.isOpenWeChat = tmp.addAlarmForm.isOpenWeChatServe
              }
              delete tmp.addAlarmForm.isOpenClientServe
              delete tmp.addAlarmForm.isOpenEmailServe
              delete tmp.addAlarmForm.isOpenMessageServe
              delete tmp.addAlarmForm.isOpenWeChatServe
              tmp.CheckformStepC((_valid) => {
                if (_valid) {
                  tmp.formatStyleData();
                } else {
                  tmp.activeTab = 'rule';
                  return false;
                }
              });
            } else {
              tmp.activeTab = 'style';
              return false;
            }
          } else {
            tmp.activeTab = 'prop';
            return false;
          }
        });
      },
      readyPost() {
        let _data = this.$refs[this.currentMode].addAlarmForm;
        $axios.post(this.url[this.currentMode], _data, {
          data: [{name: this.$refs[this.currentMode].addAlarmForm.name}],
          logTemplate: this.currentMode === 'addAlarm' ? '添加|告警方式配置(#name#)' : '编辑|告警方式配置(#name#)'
        }).then((res) => {
          if (res.data.false) {
            this.$message({type: 'error', message: res.data.false});
            return false;
          } else {
            if (this.currentMode === 'addAlarm') {
              this.$message({type: 'success', message: '添加告警成功'});
              this.bloomAdd = false;
            } else {
              this.$message({type: 'success', message: '修改告警成功'});
              this.bloomModify = false;
            }
            this.getList();
          }
        });
      },
      myUserOk() {
        let tmp = this.$refs[this.currentMode];
        let data = this.$refs['myUser'].$refs['myUserList'].getAllSelectedData();
        tmp[tmp.currentUserType] = data;
        this.bloomUser = false;
      },
      myEmailOk() {
        this.$refs.myEmail.$refs.myEmailForm.validate((valid) => {
          if (valid) {
            this.$refs[this.currentMode].listEmail.push(this.$refs.myEmail.myEmailForm);
            this.bloomEmail = false;
          } else {
            return false;
          }
        });
      },
      myMessageOk() {
        this.$refs.myMessage.$refs.myMessageForm.validate((valid) => {
          if (valid) {
            this.$refs[this.currentMode].listMessage.push(this.$refs.myMessage.myMessageForm);
            this.bloomMessage = false;
          } else {
            return false;
          }
        });
      },
      myWeChatOk() {
        this.$refs.myWeChat.$refs.myWeChatForm.validate((valid) => {
          if (valid) {
            this.$refs[this.currentMode].listWeChat.push(this.$refs.myWeChat.myWeChatForm);
            this.bloomWeChat = false;
          } else {
            return false;
          }
        });
      },
      showUser(val) {
        this.bloomUser = true;
        this.hasSelectUser = val.hasSelectUser;
        this.userType = val.userType;
      }
    },

    mounted() {
      this.getList();
      this.getUsers();
    }
  }
</script>
<style>
  .alarm-cfg .s-select {
    width: 100px;
  }
</style>

