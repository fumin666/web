<template>
  <s-form
    ref="synTokenFrom"
    :model="synTokenFrom"
    :rules="synTokenFromRules"
    label-width="120px">
    <s-form-item label="令牌序列编号">
      <s-input v-model="synTokenFrom.tokenId" readonly></s-input>
    </s-form-item>
    <s-form-item label="认证码1" prop="authenCode1">
      <s-input v-model="synTokenFrom.authenCode1"></s-input>
    </s-form-item>
    <s-form-item label="认证码2" prop="authenCode2">
      <s-input v-model="synTokenFrom.authenCode2"></s-input>
    </s-form-item>
    <s-form-item>
      <s-button @click="saveSynTokenFrom">确定</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'

  export default{
    data() {
      return {
        synTokenFrom: {                   // 令牌同步表单
          authenCode1: '',
          authenCode2: '',
          tokenId: this.tokenId
        },
        // 表单规则
        synTokenFromRules: {
          authenCode1: [{required: true, message: '不能为空', trigger: 'blur'}],
          authenCode2: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      tokenId: {
        type: String,
        required: true
      }
    },
    methods: {
    // 令牌同步保存
    saveSynTokenFrom() {
      this.$refs['synTokenFrom'].validate(valid => {
        if (valid) {
          $axios.post('/systemmanager/sysInteriorTokenList/synToken', this.synTokenFrom, {
            data: [{tokenId: this.tokenId}],
            logTemplate: '同步|登录认证配置>动态口令牌>令牌(#tokenId#)'
          }).then(res => {
            let resData = res.data
            if (resData.status === 'success') {
              this.$message({
                type: 'success',
                message: resData.message
              })
              Bus.$emit('sysTokenSuccess')
            } else {
              this.$message({
                type: 'error',
                message: resData.message
              })
            }
          })
        } else {
          return false
        }
      })
    }
    },
    created() {

    }
  }
</script>

