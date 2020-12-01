/**
* Created by songyf on 2019/4/2.
* 资产管理详情-资产账号-关联弹窗
*/
<template>
  <div class="AccountAssociateForm">
    <s-form :model="accountAssociateForm" :rules="accountAssociateRules" ref="accountAssociateForm" label-width="130px">
      <s-collapse v-model="activeNames">
        <s-collapse-item title="关联管理账号" name="1">
          <s-form-item label="协议/端口" prop="port" >
            <s-select v-model="accountAssociateForm.port" placeholder="请选择"  @change="selectChangePort">
              <s-option
                v-for="item in portOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="管理账户" prop="account">
            <s-select v-model="accountAssociateForm.account" placeholder="请选择">
              <s-option
                v-for="item in accountOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="link账号归属">
            <s-radio class="radio" v-model="accountAssociateForm.radio" label="0">私有</s-radio>
            <s-radio class="radio" v-model="accountAssociateForm.radio" label="1">公有</s-radio>
          </s-form-item>
        </s-collapse-item>
        <s-collapse-item title="关联其他账号" name="2">
          <s-form-item label="资产IP" prop="assetsIP">
            <s-select v-model="accountAssociateForm.assetsIP" placeholder="请选择" @change="selectChangeAssetsIP">
              <s-option
                v-for="item in assetsIPOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="协议/端口" prop="otherPort">
            <s-select v-model="accountAssociateForm.otherPort" placeholder="请选择" @change="selectChangeOtherPort">
              <s-option
                v-for="item in otherPortOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="账户名称" prop="otherAccount">
            <s-select v-model="accountAssociateForm.otherAccount" placeholder="请选择">
              <s-option
                v-for="item in otherAccountOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </s-option>
            </s-select>
          </s-form-item>
        </s-collapse-item>
      </s-collapse>
      <s-row class="footerRow">
        <s-button @click="saveAccountAccociate('accountAssociateForm')">保存</s-button>
        <s-button type="cancel" @click="cancelAccountAssociate">取消</s-button>
      </s-row>
    </s-form>

  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep, isEmpty} from 'lodash';

  export default {
    data() {
      return {
        activeNames: ['1', '2'],
        dialogFlag: false,
        portOptions: [],
        assetsIPOptions: [],
        otherPortOptions: [],
        accountOptions: [], // 关联账户option
        otherAccountOptions: [], // 关联账户option
        accountAssociateForm: {
          port: '',
          account: '',
          otherPort: '',
          otherAccount: '',
          radio: '0',
          assetsIP: ''
        },
        accountAssociateRules: {
          port: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          account: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          otherPort: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          otherAccount: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          assetsIP: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
      }
    },
    props: {
      associated: {},
      accountData: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 取消
      cancelAccountAssociate() {
        this.$emit('closeAssociatedDialog')
      },
      selectChangePort(val) {
        $axios.get(`/linkAccount/getAccountListByPortFilterByRole/${val}`).then((res) => {
          if (res.data) {
            this.accountOptions = res.data;
          }
        });
      },
      selectChangeAssetsIP (val) {
        $axios.get(`/linkAccount/getDatabaseProtocolByItcomp/${val}`).then((res) => {
          if (res.data) {
            this.otherPortOptions = res.data;
          }
        });
      },
      selectChangeOtherPort(val) {
        $axios.get(`/linkAccount/getAccountListByPortFilterByRole/${val}`).then((res) => {
          if (res.data) {
            this.otherAccountOptions = res.data;
          }
        });
      },
      saveAccountAccociate(formName) { // 保存
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let param = {
              deviceUuid: this.accountData.assetsUuid,
              linkAccountUuid: this.accountData.uuid,
              portUuid: this.accountAssociateForm.port,
              adminAccountUuid: this.accountAssociateForm.account,
              destDeviceUuid: this.accountAssociateForm.assetsIP,
              destPortUuid: this.accountAssociateForm.otherPort,
              destAccountUuid: this.accountAssociateForm.otherAccount,
              dblinkOwn: parseInt(this.accountAssociateForm.radio)
            };
            $axios.post(`/linkAccount/saveAccountLink`, param).then((res) => {
              if (res.data.state === true) {
                this.$message({showClose: true, message: '保存成功', type: 'success'});
              } else {
                this.$message({showClose: true, message: '保存失败', type: 'error'});
              }
            });
            this.$emit('closeAssociatedDialog')
          }
        });
      },
      initData(val) { // 初始化数据
        if (isEmpty(val.portUuid) === false) { // 如果是编辑
          this.accountAssociateForm.port = val.portUuid;
          this.accountAssociateForm.otherPort = val.destPortUuid;
          this.accountAssociateForm.account = val.adminAccountUuid;
          this.accountAssociateForm.otherAccount = val.destAccountUuid;
          this.accountAssociateForm.assetsIP = val.destDeviceUuid;
          this.accountAssociateForm.radio = val.dblinkOwn.toString();
          this.portOptions = val.portOptions;
        } else {
          this.portOptions = cloneDeep(val);
          this.accountAssociateForm.port = val ? val[0].value : '';
        }
        this.selectChangePort(this.accountAssociateForm.port);
        this.selectChangeAssetsIP(this.accountAssociateForm.assetsIP);
        this.selectChangeOtherPort(this.accountAssociateForm.otherPort);
      },
      getAssetsIPOptions (val) { // 获取资产ip下拉数据
        $axios.get(`linkAccount/getItcompIncludeDatabaseProtocol`).then((res) => {
          if (isEmpty(res.data) === false) {
            this.assetsIPOptions = res.data;
            this.initData(val)
          }
        });
      }
    },
    created () {
      this.getAssetsIPOptions()
    },
    watch: {
      // 'accountAssociateForm.port'() {
      //   this.accountAssociateForm.otherPort = this.accountAssociateForm.port;
      // },
      associated(val, oldVal) {
        this.initData(val)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .AccountAssociateForm
    .footerRow{
      text-align : right;
      margin : 15px 0 5px 0
    }
</style>

