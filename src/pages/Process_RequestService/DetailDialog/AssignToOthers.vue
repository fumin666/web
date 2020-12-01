<template>
  <s-scrollbar wrap-style="max-height:500px;">
    <s-form
      ref="assignToOthersForm"
      :model="assignToOthersForm"
      :rules="assignToOthersFormRules"
      label-width="200px">
      <s-form-item label="请求受派组名称：" prop="groupUuid">
        <s-select v-model="assignToOthersForm.groupUuid">
          <s-option v-for="(item, i) in adminGroup" :label="item.groupName" :value="item.uuid" :key="i"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="请求受派者名称：" prop="userUuid">
        <s-select v-model="assignToOthersForm.userUuid">
          <s-option v-for="(item, i) in adminUser" :label="item.userRealName" :value="item.uuid" :key="i"></s-option>
        </s-select>
      </s-form-item>
    </s-form>

    <s-row style="text-align: right;">
      <s-button @click="saveAssignToOthers">保存</s-button>
      <s-button type="cancel" @click="cancelAssignToOthers">取消</s-button>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        adminGroup: [],         // 请求管理员组
        adminUser: [],          // 请求管理员用户
        assignToOthersForm: {
          groupUuid: '',
          userUuid: ''
        },
        assignToOthersFormRules: {
          groupUuid: [{
            required: true, message: '不能为空', trigger: 'blur'
          }],
          userUuid: [{
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
      companyUuid: {
        type: String,
        required: true
      }
    },
    watch: {
      'assignToOthersForm.groupUuid'(newVal) {
        $axios.get(`/itilServiceRequest/getRequestOrderUser/${newVal}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.adminUser = data;
            this.assignToOthersForm.userUuid = data[0].uuid
          }
        });
      }
    },
    methods: {
      saveAssignToOthers() {
        this.$refs.assignToOthersForm.validate((valid) => {
          if (valid) {
            $axios.get(`/itilServiceRequest/requestOrderOrderAssigneOther/${this.orderUuid}/${this.assignToOthersForm.userUuid}/${this.assignToOthersForm.groupUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '指派成功！'
                });
                this.$emit('closeAssignToOthers')
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
      cancelAssignToOthers() {
        this.$emit('closeAssignToOthers', 'cancle')
      }
    },
    created() {
      $axios.get('/itilServiceRequest/getRequestAcceptListByCompanyUuid/' + this.companyUuid).then(({data}) => {
        if (data && data instanceof Array) {
          this.adminGroup = data
        }
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
