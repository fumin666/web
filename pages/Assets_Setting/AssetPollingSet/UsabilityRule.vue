<template>
  <div class="assetAudit">
    <s-tab>
      <s-tab-pane label="IP地址可用性规则">
        <s-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <s-form-item style="font-size:15px"><b class="ipamColor"><s-row>IP地址分配</s-row></b> </s-form-item>
          <s-form-item><s-row>当IP地址关联了IT资产,则其状态由“未使用”变为“已使用”</s-row></s-form-item>
          <s-form-item style="font-size:15px"><b><s-row>IP地址回收</s-row></b> </s-form-item>
          <s-form-item>
              <s-row>(1) 当“已使用”IP地址解除与IT资产关联关系时，设置IP地址的状态为“暂态”。</s-row>
          </s-form-item>
          <s-form-item>
              <s-row>(2) 当“暂态”IP地址状态持续&nbsp;&nbsp;&nbsp;<s-input-number v-model="ruleForm.availableday" :min="1" :max="30" style="width:120px;position:relative;top:8px;"></s-input-number> 天,设置IP地址的状态为“未使用”。</s-row>
          </s-form-item>
          <s-form-item>
            <s-button @click="submitForm('ruleForm')">保存</s-button>
          </s-form-item>
        </s-form>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        ruleForm: {
          transientday: '',
          availableday: '',
          transientUuid: '',
          availableUuid: ''

        },
        rules: {

        }
      }
    },
    methods: {
      getList() {
        $axios.post(`/ipamIpAddressView/getIpamSetting`).then((res) => {
            res.data.forEach((val) => {
                if (val.configKey === 'tempStatus') {
                    this.ruleForm.transientday = val.configValue
                    this.ruleForm.transientUuid = val.uuid
                } else if (val.configKey === 'availableStatus') {
                    this.ruleForm.availableday = val.configValue
                    this.ruleForm.availableUuid = val.uuid
                }
            })
        })
      },
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let ipaminfo = []
            let transArr = {configValue: this.ruleForm.transientday, uuid: this.ruleForm.transientUuid}
            let availableArr = {configValue: this.ruleForm.availableday, uuid: this.ruleForm.availableUuid}
            ipaminfo.push(transArr)
            ipaminfo.push(availableArr)
            $axios.post(`/ipamIpAddressView/uptIpamSetting`, ipaminfo, {
              data: [],
              logTemplate: '编辑|IPAM设置'
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({type: 'success', message: '编辑成功!'});
              }
            })
          } else {
                this.$message({type: 'error', message: '编辑失败!'});
          }
        });
      }
    },
    created() {
      this.getList()
    }
  }
</script>

<style lang="stylus">
.assetAudit{
  .s-form-item-content{
    margin-left:50px !important;
    font-size: 15px;
  }
}
.footerRow{
  // margin-left :600px;
}
</style>
