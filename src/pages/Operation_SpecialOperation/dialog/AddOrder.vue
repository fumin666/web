<!--
 * @Author: songyf
 * @LastEditors: 高建鹏
 * @Description: 添加工单
 * @Date: 2019-4-17
 * @LastEditTime: 2019-05-08 18:44:27
 -->
<template>
  <div class="orderDialog">
    <s-scrollbar wrap-class="step-height" key="step2scrollbar">
      <s-row class="header">添加授权工单</s-row>
      <s-form :model="form" :rules="rules" ref="addOrderForm" label-width="130px">
        <s-form-item label="工单号" prop="orderNumber">
          <s-input v-model="form.orderNumber" placeholder="请输入"></s-input>
        </s-form-item>
        <s-form-item label="开始时间" prop="startTime">
          <s-date-picker v-model="form.startTime" type="datetime" :editable="false" @change="getStartTime" placeholder="开始时间">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="结束时间" prop="endTime">
          <s-date-picker v-model="form.endTime" type="datetime" :editable="false" @change="getEndTime" placeholder="结束时间">
          </s-date-picker>
        </s-form-item>
        <s-form-item label="备注" prop="remark">
          <s-input v-model="form.remark" type="textarea" placeholder="最多可输入120字" :rows="5"></s-input>
        </s-form-item>
      </s-form>
      <s-row class="title">选择运维人员</s-row>
      <!--运维人员-->
      <auth-link-user ref="viewLinkUser"  :isOrder="isOrder" @showUserDetails="showUserDetails" @showOrgDetails="showOrgDetails"></auth-link-user>
      <s-row class="title">选择主机</s-row>
      <!--资产-->
      <auth-link-device
        ref="linkDev"
        @showProtocolDetails="showProtocolDetails"
        @showDeviceAccount="showDeviceAccount"
        @showDeviceUpDown="showDeviceUpDown"></auth-link-device>
      <!--人员详情-->
      <s-dialog
        v-model="bloomUser"
        v-if="bloomUser"
        title="人员详情"
        append-to-body>
        <user-details :data="currentUser"></user-details>
      </s-dialog>
      <!--组织机构详情-->
      <s-dialog
        v-model="bloomOrg"
        v-if="bloomOrg"
        title="机构详情"
        append-to-body>
        <org-details :data="currentOrgUuid"></org-details>
      </s-dialog>
      <!--资产账号分配-->
      <s-dialog
        v-model="bloomDeviceAccount"
        v-if="bloomDeviceAccount"
        title="资产账号分配"
        append-to-body
      >
        <device-account ref="deviceAccount" :data="{authUuid: currentListUuid, portUuid: currentPortUuid, protocolUuid: currentProtocolUuid}" :selectedAccountArr="selectedAccount" :isOrder="isOrder"></device-account>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveDeviceAccount">确定</s-button>
          <s-button type="cancel" @click="bloomDeviceAccount = false">取消</s-button>
        </template>
      </s-dialog>
      <!--资产剪贴板上下行-->
      <s-dialog
        v-model="bloomDeviceUpDown"
        v-if="bloomDeviceUpDown"
        title="高级设置"
        append-to-body>
        <device-up-down ref="deviceUpDown" :data="updownObj"></device-up-down>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveDeviceUpDown">保存</s-button>
          <s-button type="cancel" @click="bloomDeviceUpDown = false">取消</s-button>
        </template>
      </s-dialog>
      <!--协议详情-->
      <s-dialog
        v-model="bloomProtocol"
        v-if="bloomProtocol"
        title="协议详情"
        append-to-body>
        <protocol-details :data="currentProtocolUuid"></protocol-details>
      </s-dialog>
    </s-scrollbar>
    <s-row class="footerRow">
      <s-button @click="saveOrderInfo">保存</s-button>
      <s-button type="cancel" @click="cancelOrder">取消</s-button>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import AuthLinkUser from '../../Account_Auth/AuthLinkUser'
  import UserDetails from '../../Account_Auth/UserDetails'
  import OrgDetails from '../../Account_Auth/OrgDetails'
  import AuthLinkDevice from '../../Account_Auth/AuthLinkDevice'
  import DeviceAccount from '../../Account_Auth/DeviceAccount'
  import DeviceUpDown from '../../Account_Auth/DeviceUpDown'
  import ProtocolDetails from '../../Account_Auth/ProtocolDetails'

  export default {
    data() {
      return {
        dialogFlag: false,
        bloomUser: false,
        bloomOrg: false,
        isOrder: true,
        bloomProtocol: false,
        bloomDeviceAccount: false,
        bloomDeviceUpDown: false,
        updownObj: {},
        currentUser: {},
        currentOrgUuid: '',
        currentProtocolUuid: '',
        currentDeviceUuid: '',
        currentPortUuid: '',
        currentListUuid: '',
        form: {
          orderNumber: '',
          startTime: null,
          endTime: null,
          remark: null
        },
        rules: {
          orderNumber: [Validaters.NotNull],
          startTime: [Validaters.NotNull],
          endTime: [Validaters.NotNull],
          remark: [Validaters.Max(120)]
        },
        selectedAccount: [], // 资产账号分配选中集合
        // selectedAccountUuidObj: {// 资产账号分配选中
        //   deviceUuid: '',
        //   portUuid: '',
        //   accountUuidList: []
        // },
        operationGlobalSettingsArr: [], // 高级设置集合
        deviceList: {} // 关联的资产，协议端口，账号
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      obj: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      isEdit() {
        return Object.keys(this.obj).length > 0;
      }
    },
    created() {
      if (this.isEdit) {
        Object.keys(this.form).forEach((key) => {
          if (this.obj[key] === null || this.obj[key] === undefined) {
            this.form[key] = null;
          } else {
            this.form[key] = this.obj[key];
          }
        });
        this.form['uuid'] = this.obj['uuid']
      }
    },
    methods: {
      saveOrderInfo() { // 工单管理保存
        let vm = this;
        let arrDevUuid = [];
        let authDeviceHaveShareoptionList = {};
        let orderForm = vm.$refs['addOrderForm'];
        let operationUserUuid = {operationUserUuid: vm.$refs['viewLinkUser'].selectedOperations}; // 获取选中运维人员
        let updown = vm.$refs['linkDev'].updown;
        if (updown.all) {
           authDeviceHaveShareoptionList = {
             operationGlobalSettings: {
               clipboardUp: updown.cutup ? 1 : 0,
               clipboardDown: updown.cutdown ? 1 : 0,
               diskMappingUp: updown.diskup ? 1 : 0,
               diskMappingDown: updown.diskdown ? 1 : 0
             }
          };
        }
        let selectedDev = vm.$refs['linkDev'].$refs['authLinkDevice'].getAllSelectedData();
        for (let i = 0; i < selectedDev.length; i++) {
          arrDevUuid.push({
            deviceUuid: selectedDev[i].deviceuuid,
            portUuid: selectedDev[i].portuuid,
            accountUuidList: [],
            operationGlobalSettings: null
          });
        }
        arrDevUuid.forEach((v) => {
          if (this.selectedAccount.length > 0) {
            this.selectedAccount.forEach((item) => {
              if (v.portUuid === item.portUuid) {
                v.accountUuidList = item.accountUuidList
              }
            });
          }
        });
        arrDevUuid.forEach((v) => {
          if (this.operationGlobalSettingsArr.length > 0) {
            this.operationGlobalSettingsArr.forEach((m) => {
              if (v.portUuid === m.portUuid) {
                v.operationGlobalSettings = m.operationGlobalSettings
              }
            })
          }
        });
        vm.deviceList = {
          deviceList: arrDevUuid
        };
        orderForm.validate((valid) => {
          if (!valid) {
            return false;
          }
          let formData = {
            orderNumber: vm.form.orderNumber,
            startTime: vm.timeStamp(vm.form.startTime),
            endTime: vm.timeStamp(vm.form.endTime),
            remark: vm.form.remark
          };
          let formParam = Object.assign({}, formData, operationUserUuid, authDeviceHaveShareoptionList, vm.deviceList);
          if (operationUserUuid.operationUserUuid === '') {
            this.$message({type: 'warning', message: '请选择运维人员'});
          } else if (Object.values(vm.deviceList)[0].length === 0) {
            this.$message({type: 'warning', message: '请至少选择一个主机'});
          } else {
            $axios.post('/orderOperation/saveOrderOperation', formParam, {
              data: [formData],
              logTemplate: '添加|工单运维(#orderNumber#)'
            }).then(({data}) => {
              if (data.state === true) {
                vm.$message({message: data.errormsg, type: 'success'});
                vm.$emit('closeOrderDialog', formParam)
              } else {
                vm.$message({showClose: true, message: data.errormsg, type: 'error'});
              }
            })
          }
        });
      },
      cancelOrder() {
        this.$emit('closeOrderDialog')
      },
      showProtocolDetails(uuid) {
        this.bloomProtocol = true;
        this.currentProtocolUuid = uuid;
      },
      showDeviceAccount(deviceuuid, portuuid, protocoluuid) {
        this.bloomDeviceAccount = true;
        this.currentDeviceUuid = deviceuuid;
        this.currentPortUuid = portuuid;
        this.currentProtocolUuid = protocoluuid;
      },
      showDeviceUpDown(row) {
        this.updownObj = row;
        this.bloomDeviceUpDown = true;
      },
      saveDeviceAccount() {
        let vm = this;
        let selectedAccountUuidObj = {
          deviceUuid: '',
          portUuid: '',
          accountUuidList: []
        };
        let selectedAccount = vm.$refs['deviceAccount'].selectedAccount;
        let selectedAccountUuidArr = [];
        if (selectedAccount.length > 0) {
          selectedAccount.forEach((v) => {
            selectedAccountUuidArr.push(v.uuid)
          });
          selectedAccountUuidObj = {
            deviceUuid: vm.currentDeviceUuid,
            portUuid: vm.currentPortUuid,
            accountUuidList: selectedAccountUuidArr
          };
        }
        vm.selectedAccount.forEach((v, i) => {
          if (v.portUuid === vm.currentPortUuid) {
            vm.selectedAccount.splice(i, 1);
          }
        });
        if (selectedAccountUuidArr.length > 0) {
          vm.selectedAccount.push(selectedAccountUuidObj);
        }
        vm.$message({type: 'success', message: '资产账号选择完成'});
        vm.bloomDeviceAccount = false;
      },
      saveDeviceUpDown() { // 高级设置保存
        let data = this.$refs['deviceUpDown'].deviceForm;
        let operationGlobalSettings = {};
        if (!this.updownObj.authDeviceHaveShareoptionList) {
          this.updownObj.authDeviceHaveShareoptionList = {};
        }
        this.updownObj.authDeviceHaveShareoptionList.clipboardUp = data.clipboardUp;
        this.updownObj.authDeviceHaveShareoptionList.clipboardDown = data.clipboardDown;
        this.updownObj.authDeviceHaveShareoptionList.diskMappingUp = data.diskMappingUp;
        this.updownObj.authDeviceHaveShareoptionList.diskMappingDown = data.diskMappingDown;
        operationGlobalSettings = {
          portUuid: this.updownObj.portuuid,
          operationGlobalSettings: {
            clipboardUp: data.clipboardUp,
            clipboardDown: data.clipboardDown,
            diskMappingUp: data.diskMappingUp,
            diskMappingDown: data.diskMappingDown
          }
        };
        this.operationGlobalSettingsArr.push(operationGlobalSettings);
        this.bloomDeviceUpDown = false;
      },
      dialogOk() {
        let form = this.$refs['addApproverForm'];
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {...this.form, startTime: this.timeStamp(this.form.startTime), endTime: this.timeStamp(this.form.endTime)};
          $axios.post('/specialOperationApply/saveOrEditProxyApprover', params).then(({data}) => {
            if (data.state === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: data.errormsg, type: 'error'});
            }
          })
        })
      },
      // 限制搜索时间函数
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.form.endTime.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.form.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.startTime = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.form.startTime.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.form.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.endTime = val;
        }
      },
      timeStamp(date) {
        if (typeof date === 'string') {
          date = new Date(date);
        }
        return Math.round(date.getTime() / 1000);
      },
      showUserDetails(row) {
        this.bloomUser = true;
        this.currentUser = row;
      },
      showOrgDetails(uuid) {
        this.bloomOrg = true;
        this.currentOrgUuid = uuid;
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
    },
    components: {
      AuthLinkUser,
      UserDetails,
      OrgDetails,
      AuthLinkDevice,
      DeviceAccount,
      DeviceUpDown,
      ProtocolDetails
    }
  }
</script>

<style lang="stylus">
  .orderDialog .step-height {
    max-height: 560px
    padding-right: 17px
  }
  .orderDialog .footerRow {
    text-align: right
    margin-top: 15px
  }
  .orderDialog .header {
    font-size: 16px;
    font-weight: 600;
    height: 36px;
  }
  .orderDialog .title {
    font-weight: 600;
    height: 36px;
    line-height: 36px;
    color: #4d4d4d;
    font-size: 14px;
    margin-bottom: 5px;
    padding-left: 5px;
  }
  .orderDialog .title:before{
    display: inline-block;
    content: "*";
    color: #f51131;
    margin-right: 4px;
  }
</style>
