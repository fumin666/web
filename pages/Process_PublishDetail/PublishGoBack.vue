<template>
  <section id="orderGoBack">
    <s-scrollbar wrap-style="max-height:500px;">
      <s-form ref="goBackForm" :model="goBackForm" :rules="goBackFormRules" label-width="100px">
        <s-form-item>
          确定将此变更工单回退至 <span class="orderStatus" v-text="stage"></span> 阶段 <span class="orderStatus" v-text="status"></span> 状态？
        </s-form-item>
        <s-form-item label="回退理由：" prop="rollbackReason">
          <s-input type="textarea" :rows="5" v-model="goBackForm.rollbackReason"></s-input>
        </s-form-item>
      </s-form>

      <s-row style="text-align: right;">
        <s-button @click="saveGoBack">保存</s-button>
        <s-button type="cancel" @click="cancelGoBack">取消</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        goBackForm: {
          rollbackReason: ''
        },
        stage: '',
        status: '',
        goBackFormRules: {
          rollbackReason: [
            { required: true, message: '回退理由', trigger: 'blur' },
            { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      orderData: {
        type: Object,
        required: true
      }
    },
    methods: {
      getGoBcakMsg() {
        $axios.get(`/itilPublishOrder/getPublishRollbackInfo/${this.orderData.uuid}`).then(res => {
          this.stage = res.data.stage;
          this.status = res.data.status;
        })
      },
      saveGoBack() {
        this.$refs.goBackForm.validate((valid) => {
          if (valid) {
            $axios.get(`/itilPublishOrder/publishOrderRollback/${this.orderData.uuid}/${this.goBackForm.rollbackReason}`).then(res => {
              if (res.data.state === true) {
                this.$message({
                  type: 'success',
                  message: '回退成功！'
                });
                this.$emit('closeBack')
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.errormsg
                })
              }
            })
          } else {
            return false
          }
        })
      },
      cancelGoBack() {
        this.$emit('closeBack', 'cancle')
      }
    },
    created() {
      this.getGoBcakMsg();
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #orderGoBack
    .orderStatus
      color #20a8f7
      font-weight bold
</style>
