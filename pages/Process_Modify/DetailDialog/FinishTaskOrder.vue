<template>
  <section id="finishTaskOrder">
    <s-form
      :model="finishTaskOrderForm"
      :rules="finishTaskOrderFormRules"
      ref="finishTaskOrderForm"
      label-width="140px">
      <s-form-item label="执行结果描述：" prop="taskResult">
        <s-input v-model="finishTaskOrderForm.taskResult" type="textarea" :rows="4"></s-input>
      </s-form-item>
    </s-form>
    <s-row style="text-align: right;">
      <s-button @click="saveFinishTaskOrder">保存</s-button>
      <s-button type="cancel" @click="cancelFinishTaskOrder">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default {
    data () {
      return {
        finishTaskOrderForm: {
          taskResult: ''
        },
        finishTaskOrderFormRules: {
          taskResult: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      taskOrderUuid: {
        type: String,
        required: true
      }
    },
    methods: {
      saveFinishTaskOrder() {
        this.$refs.finishTaskOrderForm.validate((valid) => {
          if (valid) {
            $axios.get(`/itilChangeOrder/changeTaskComplete/${this.taskOrderUuid}/${this.finishTaskOrderForm.taskResult}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '该任务单已完成！'
                })
                this.$emit('closeFinishTaskOrder')
              } else {
                this.$message({
                  type: 'success',
                  message: '操作失败，请重试！'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      cancelFinishTaskOrder() {
        this.$emit('closeFinishTaskOrder')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
