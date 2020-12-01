<template>
  <s-scrollbar wrap-style="max-height:500px;">
    <s-form
      ref="assignToMeForm"
      :model="assignToMeForm"
      :rules="assignToMeFormRules"
      label-width="200px">
      <s-form-item label="变更管理员组名称：" prop="groupUuid">
        <s-select v-model="assignToMeForm.groupUuid">
          <s-option v-for="(item, i) in adminGroup" :label="item.groupName" :value="item.uuid" :key="i"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="变更管理员名称：" prop="userUuid">
        <s-select v-model="assignToMeForm.userUuid" disabled>
          <s-option v-for="(item, i) in adminUser" :label="item.userRealName" :value="item.uuid" :key="i"></s-option>
        </s-select>
      </s-form-item>
    </s-form>

    <s-row style="text-align: right;">
      <s-button @click="saveAssignToMe">保存</s-button>
      <s-button type="cancel" @click="cancelAssignToMe">取消</s-button>
    </s-row>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  export default{
    data() {
      return {
        adminGroup: [],         // 变更管理员组
        adminUser: {},          // 变更管理员用户
        assignToMeForm: {
          groupUuid: '',
          userUuid: ''
        },
        assignToMeFormRules: {
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
      }
    },
    methods: {
      saveAssignToMe() {
        this.$refs.assignToMeForm.validate((valid) => {
          if (valid) {
            $axios.get(`/itilChangeOrder/changeOrderAssignMe/${this.orderUuid}/${this.assignToMeForm.groupUuid}/${this.assignToMeForm.userUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '指派成功！'
                });
                this.$emit('closeAssignToMe')
              } else {
                this.$message({
                  type: 'error',
                  message: '指派失败，请重试！'
                })
              }
            })
          } else {
            return false
          }
        })
      },
      cancelAssignToMe() {
        this.$emit('closeAssignToMe', 'cancle')
      }
    },
    created() {
      $axios.get('/ItilCommonWorkflow/getCurrentUserAndGroup').then(({data}) => {
        if (data) {
          this.adminGroup = data.groupList || [];
          this.adminUser = [{
            userRealName: data.user.userRealName,
            uuid: data.user.uuid
          }];
          this.assignToMeForm.userUuid = data.user.uuid
        }
      });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
