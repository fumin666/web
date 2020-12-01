/**
* Created by dgunzi on 2019/02/27.
* 激活和升级
*/
<template>
  <div>
    <s-row>
      <s-button icon="info" title="产品注册" @click="showRegister">产品注册</s-button>
      <s-button icon="update" title="系统升级" @click="showUpgrade">系统升级</s-button>
    </s-row>
    <s-row class="blockTitle">注册信息</s-row>
    <s-row :gutter="16">
      <s-col span="12">
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">客户名称</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.customerName }}</s-col>
        </s-row>
        <s-row>
          <s-col class="item-name" span="8">产品序列号</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.snNumber }}</s-col>
        </s-row>
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">产品版本</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.prodctVersion }}</s-col>
        </s-row>
        <s-row>
          <s-col class="item-name" span="8">内部版本</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.innerVersion }}</s-col>
        </s-row>
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">版本类型</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.verType }}</s-col>
        </s-row>
        <s-row>
          <s-col class="item-name" span="8">注册状态</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.regStatus }}</s-col>
        </s-row>
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">使用时限</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.workDays }}</s-col>
        </s-row>
      </s-col>
    </s-row>
    <s-row class="blockTitle">模块信息</s-row>
    <s-row :gutter="16">
      <s-col span="12">
        <s-row  class="bg-purple">
          <s-col class="item-name" span="8">IAM数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.iamCount }}</s-col>
        </s-row>
        <s-row>
          <s-col class="item-name" span="8">CMDB数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.cmdbAccount }}</s-col>
        </s-row>
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">资产监控数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.devCount }}</s-col>
        </s-row>
        <s-row>
          <s-col class="item-name" span="8">数据库审计数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.dbaCount }}</s-col>
        </s-row>
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">运维审计数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.opCount }}</s-col>
        </s-row>
        <s-row>
          <s-col class="item-name" span="8">日志审计数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.logNodeCount }}</s-col>
        </s-row>
        <s-row class="bg-purple">
          <s-col class="item-name" span="8">移动设备数</s-col>
          <s-col class="item-value" span="16">{{ registerInfo.modelCount.mobileCount }}</s-col>
        </s-row>
      </s-col>
    </s-row>
    <!--产品注册-->
    <s-dialog
      v-model="registerDialog"
      v-if="registerDialog"
      width="700px"
      title="产品注册">
      <product-registration ref="registration"></product-registration>
      <template slot="footer">
        <s-button @click="handleRegister">注册</s-button>
        <s-button type="cancel" @click="registerDialog = false">取消</s-button>
      </template>
    </s-dialog>
    <!--系统升级-->
    <s-dialog
      v-model="sysUpgradeDialog"
      v-if="sysUpgradeDialog"
      width="1000px"
      title="系统升级">
      <system-upgrade></system-upgrade>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import ProductRegistration from './ProductRegistration'
  import SystemUpgrade from './SystemUpgrade.vue'

  export default {
    name: 'ActiveAndUpdate',
    data() {
      return {
        // 注册信息
        registerInfo: {
          modelCount: {}
        },
        // 注册对话框
        registerDialog: false,
        // 系统升级
        sysUpgradeDialog: false
      }
    },
    created() {
      this.getRegisterInfo();
    },
    components: {
      ProductRegistration,
      SystemUpgrade
    },
    methods: {
      // 获取系统注册信息
      getRegisterInfo() {
        $axios.get('/configcenter/license/getLicenseInfo').then(({data}) => {
          data.prodctVersion === null ? data.prodctVersion = 'V3.2' : data.prodctVersion = data.prodctVersion.replace(/(\.0)+$/, '')
          this.registerInfo = data;
        })
      },
      // 注册对话框
      showRegister() {
        this.registerDialog = true
      },
      // 注册确定操作
      handleRegister() {
        let _self = this
        _self.$refs['registration'].$refs['registerForm'].validate((valid) => {
          if (valid) {
            // handle register
            $axios.post('/configcenter/license/activeLicense', _self.$refs['registration'].register).then(({data}) => {
              if (data.result) {
                this.$message.success(data.errormsg);
                this.registerDialog = false;
                this.getRegisterInfo();
              } else {
                this.$message.error(data.errormsg);
              }
            })
          }
        })
      },
      // 升级对话框
      showUpgrade() {
        this.sysUpgradeDialog = true
      }
    }
  }
</script>

<style scoped>
  .blockTitle {
    margin: 10px 0px;
  }

  .bg-purple {
    padding: 0px;
  }

  .item-name {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    padding-left: 20px;
  }

  .item-value {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    padding-left: 20px;
  }
</style>
