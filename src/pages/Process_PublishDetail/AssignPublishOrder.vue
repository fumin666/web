<template>
  <section id="assignPublishOrder">
    <s-form
      ref="assignPublishOrder"
      :model="assignPublishOrderForm"
      :rules="assignPublishOrderFormRules"
      label-width="120px">
      <s-form-item label="支持组名称：" prop="groupUuid">
        <s-select v-model="assignPublishOrderForm.groupUuid">
          <s-option v-for = "item in assignGroups" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="受派人名称：" prop="userUuid">
        <s-select v-model="assignPublishOrderForm.userUuid">
          <s-option v-for = "item in assignUsers" :label="item.userRealName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <s-row style="text-align: right;">
      <s-button @click="saveAssignPublishOrder">保存</s-button>
      <s-button type="cancel" @click="cancelAssignPublishOrder">取消</s-button>
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
        assignPublishOrderForm: {
          groupUuid: '',
          userUuid: ''
        },
        assignPublishOrderFormRules: {
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
      },
      orderUuid: {
        type: String,
        required: true
      }
    },
    watch: {
      'assignPublishOrderForm.groupUuid'(newVal) {
        this.assignPublishOrderForm.userUuid = ''
        $axios.get(`/itilPublishOrder/getAllPublishTaskAssignUserByGroup/${newVal}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.assignUsers = data
          }
        })
      }
    },
    methods: {
      saveAssignPublishOrder() {
        this.$refs.assignPublishOrder.validate((valid) => {
          if (valid) {
            $axios.get(`/itilChangeOrder/changeTaskAssign/${this.taskOrderUuid}/${this.assignPublishOrderForm.groupUuid}/${this.assignPublishOrderForm.userUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '任务单指派成功！'
                })
                this.$emit('cancelAssignPublishOrder');
                this.$emit('refreshTaskOrderList', this.orderUuid);
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
      cancelAssignPublishOrder() {
        this.$emit('cancelAssignPublishOrder')
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
  #assignPublishOrder
    .s-form-item
      margin-left 60px
</style>
