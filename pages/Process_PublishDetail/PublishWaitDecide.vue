<template>
  <section id="changeWaitDec">
    <s-scrollbar wrap-style="max-height:500px;">
      <s-form ref="waitDecideForm" :model="waitDecideForm" :rules="waitDecideFormRules" label-width="100px">
        <s-form-item label="待决原因：" prop="pendingReason">
          <s-select v-model="waitDecideForm.pendingReason">
            <s-option
              v-for="(value, key) in waitDecideReason"
              :label="value"
              :value="key"
              :key="key"></s-option>
          </s-select>
        </s-form-item>
      </s-form>

      <s-row style="text-align: right;">
        <s-button @click="saveWaitDecide">保存</s-button>
        <s-button type="cancel" @click="cancelWaitDecide">取消</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        waitDecideForm: {
          pendingReason: ''
        },
        waitDecideFormRules: {
          pendingReason: [{
            required: true, message: '不能为空', trigger: 'blur'
          }]
        }
      }
    },
    props: {
      orderUuid: {
        type: String,
        required: true
      },
      publishStatus: {
        type: Number,
        required: true
      },
      waitDecideReason: {
        type: Object,
        required: true
      }
    },
    methods: {
      saveWaitDecide() {
        this.$refs.waitDecideForm.validate((valid) => {
          if (valid) {
            $axios.get(`/itilPublishOrder/publishOrderPending/${this.orderUuid}/${this.waitDecideForm.pendingReason}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '待决操作成功！'
                });
                this.$emit('closeWaitDec')
              } else {
                this.$message({
                  type: 'error',
                  message: '待决操作失败，请重试！'
                });
              }
            })
          } else {
            return false
          }
        })
      },
      cancelWaitDecide() {
        this.$emit('closeWaitDec', 'cancle')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #changeWaitDec
    .s-radio + .s-radio
      margin-top 10px
      margin-left 0
</style>
