<template>
  <section id="orderGoBack">
    <s-scrollbar wrap-style="max-height:500px;">
      <s-form ref="goBackForm" :model="goBackForm" :rules="goBackFormRules" label-width="100px">
        <s-form-item>
          确定将此变更工单回退至 <span class="orderStatus" v-text="goBackStatus"></span> 状态？
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
    computed: {
      goBackStatus() {
        if (this.orderData.changeStatus === 2) {
          return '草稿'
        } else if (this.orderData.changeStatus === 8) {
          return '计划'
        }
//        else if (this.orderData.changeStatus === 8) {
//          return '正在执行'
//        }
      }
    },
    methods: {
      saveGoBack() {
        this.$refs.goBackForm.validate((valid) => {
          if (valid) {
            $axios.post(`/itilChangeOrder/changeOrderRollback/`, {
              orderUuid: this.orderData.uuid,
              rollbackReason: this.goBackForm.rollbackReason
            }).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '回退成功！'
                });
                this.$emit('closeBack')
              } else {
                this.$message({
                  type: 'error',
                  message: '回退失败，请重试！'
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #orderGoBack
    .orderStatus
      color #20a8f7
      font-weight bold
</style>
