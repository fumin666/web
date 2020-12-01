<template>
  <section id="assignTaskOrder">
    <s-form
      ref="assignTaskOrder"
      :model="assignTaskOrderForm"
      :rules="assignTaskOrderFormRules"
      label-width="120px">
      <s-form-item label="支持组名称：" prop="groupUuid">
        <s-select v-model="assignTaskOrderForm.groupUuid">
          <s-option v-for = "item in assignGroups" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="受派人名称：" prop="userUuid">
        <s-select v-model="assignTaskOrderForm.userUuid">
          <s-option v-for = "item in assignUsers" :label="item.userRealName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <s-row style="text-align: right;">
      <s-button @click="saveAssignTaskOrder">保存</s-button>
      <s-button type="cancel" @click="cancelAssignTaskOrder">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/ecmascript-6">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        assignGroups: [],
        assignUsers: [],
        assignTaskOrderForm: {
          groupUuid: '',
          userUuid: ''
        },
        assignTaskOrderFormRules: {
          groupUuid: [{required: true, message: '不能为空', trigger: 'blur'}],
          userUuid: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      taskOrderUuid: {
        type: String,
        required: true
      },
      companyUuid: {
        type: String,
        required: true
      }
    },
    watch: {
      'assignTaskOrderForm.groupUuid'(newVal) {
        this.assignTaskOrderForm.userUuid = ''
        $axios.get(`/itilPublishOrder/getAllPublishTaskAssignUserByGroup/${newVal}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.assignUsers = data
          }
        })
      }
    },
    methods: {
      saveAssignTaskOrder() {
        this.$refs.assignTaskOrder.validate((valid) => {
          if (valid) {
            $axios.get(`/itilChangeOrder/changeTaskAssign/${this.taskOrderUuid}/${this.assignTaskOrderForm.groupUuid}/${this.assignTaskOrderForm.userUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '发布任务单指派成功！'
                })
                this.$emit('closeAssignTaskOrder')
              } else {
                this.$message({
                  type: 'error',
                  message: data.errormsg
                })
              }
            })
          } else {
            return false
          }
        })
      },
      cancelAssignTaskOrder() {
        this.$emit('closeAssignTaskOrder')
      }
    },
    created() {
      $axios.get(`/itilPublishOrder/getAllPublishTaskAssignGroup/${this.companyUuid}`).then(({data}) => {
        if (data && data instanceof Array) {
          this.assignGroups = data
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #assignTaskOrder
    .s-form-item
      margin-left 60px
</style>
