<template>
  <s-tab class="alarm-view">
    <s-tab-pane label="告警属性">
      <div class="title">常规属性</div>
      <s-form :model="info" label-width="100px">
        <s-form-item label="名称">
          <s-input v-model="info.name" disabled></s-input>
        </s-form-item>
        <s-form-item label="描述">
          <s-input v-model="info.description" type="textarea" disabled></s-input>
        </s-form-item>
      </s-form>
    </s-tab-pane>
    <s-tab-pane label="告警方式">
      <s-scrollbar wrap-style="max-height: 600px;">
        <div class="title">
          <span>客户端</span>
          <s-switch v-model="info.isOpenClient" :active-value="1" :inactive-value="0" disabled></s-switch>
        </div>
        <s-table v-show="info.isOpenClient" :data="listClient">
          <s-table-column label="用户名" prop="userLoginName"></s-table-column>
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
          <s-table-column label="手机号" prop="userPhone"></s-table-column>
        </s-table>
        <div class="title">
          <span>邮件</span>
          <s-switch v-model="info.isOpenEmail" :active-value="1" :inactive-value="0" disabled></s-switch>
        </div>
        <s-table v-show="info.isOpenEmail" :data="listEmail">
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="Email" prop="userMail"></s-table-column>
        </s-table>
        <div class="title">
          <span>短信</span>
          <s-switch v-model="info.isOpenMessage" :active-value="1" :inactive-value="0" disabled></s-switch>
        </div>
        <s-table v-show="info.isOpenMessage" :data="listMessage">
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="手机号" prop="userPhone"></s-table-column>
        </s-table>
        <div class="title">
          <span>微信</span>
          <s-switch v-model="info.isOpenWeChat" :active-value="1" :inactive-value="0" disabled></s-switch>
        </div>
        <s-table v-show="info.isOpenWeChat" :data="listWeChat">
          <s-table-column label="真实姓名" prop="userRealName"></s-table-column>
          <s-table-column label="微信号" prop="userWechat"></s-table-column>
        </s-table>
      </s-scrollbar>
    </s-tab-pane>
    <s-tab-pane label="告警策略">
      <div class="title">工作时间</div>
      <s-form :model="info" label-width="150px">
        <s-form-item label="工作起始时间">
          <s-time-picker format="HH:mm" v-model="info.startTime" disabled></s-time-picker>
        </s-form-item>
        <s-form-item label="工作结束时间">
          <s-time-picker format="HH:mm" v-model="info.endTime" disabled></s-time-picker>
        </s-form-item>
        <s-form-item label="工作模式">
          <s-select v-model="info.workMode" style="width: 193px" disabled>
            <s-option label="工作时间报警" :value="1"></s-option>
            <s-option label="非工作时间报警" :value="2"></s-option>
            <s-option label="全天报警" :value="3"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
    </s-tab-pane>
  </s-tab>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    props: {
      data: String,
      userList: Array
    },

    data() {
      return {
        info: {},
        listClient: [],
        listEmail: [],
        listMessage: [],
        listWeChat: []
      }
    },

    methods: {
      getInfo() {
        $axios.get(`/infoSend/getInfoSendVoByInfoSendUuid/${this.data}`).then((res) => {
          if (res.data && typeof res.data === 'object') {
            this.info = res.data;
            this.info.startTime = new Date(2017, 1, 1, res.data.startDateHour, res.data.startDateMinute);
            this.info.endTime = new Date(2017, 1, 1, res.data.endDateHour, res.data.endDateMinute);
            this.resetData();
          }
        });
      },
      resetData() {
        let arr = [
          { str: 'Client', arr: this.listClient },
          { str: 'Email', arr: this.listEmail },
          { str: 'Message', arr: this.listMessage },
          { str: 'WeChat', arr: this.listWeChat }
        ];
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
                userMail: valArr[i]
              });
            } else if (str === 'Message') {
              arr.push({
                userRealName: keyArr[i],
                userPhone: valArr[i]
              });
            } else {
              arr.push({
                userRealName: keyArr[i],
                userWechat: valArr[i]
              });
            }
          }
        }
      }
    },

    created() {
      this.getInfo();
    }
  }
</script>

<style>
  .alarm-view .s-table {
    margin-bottom: 20px;
  }
</style>
