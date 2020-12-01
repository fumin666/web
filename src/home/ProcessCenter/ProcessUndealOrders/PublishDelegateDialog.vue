<template>
  <div class="deleatedialog">
    <s-form :model="deleateForm" :rules="deleateRules" ref="deleateForm" label-width="100px">
      <s-form-item label="支持组名称" prop="assignGroup">
        <s-select v-model="deleateForm.assignGroup" style="width: 300px" @focus="getGroup()">
          <s-option v-for = "item in assignGroupData" :label="item.groupName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="受派人名称" prop="assignUser">
        <s-select v-model="deleateForm.assignUser" style="width: 300px" @focus="getUser()">
          <s-option v-for = "item in assignUserData" :label="item.userRealName" :value="item.uuid" :key="item.uuid"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import $axios from 'sunflower-ajax'
  export default{
    data() {
      return {
        deleateForm: {
          assignGroup: '',
          assignUser: ''
        },
        assignGroupData: [],
        assignUserData: [],
        deleateRules: {
          assignGroup: [{required: true, message: '不能为空', trigger: 'blur'}],
          assignUser: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      model: {
        type: Object,
        required: true
      }
    },
    methods: {
      getGroup() {
        $axios.get(`/itilPublishOrder/getAllPublishTaskAssignGroup/${this.model.companyUuid}`).then((res) => {
          this.assignGroupData = res.data
        })
      },
      getUser() {
        if (this.deleateForm.assignGroup) {
          $axios.get(`/itilPublishOrder/getAllPublishTaskAssignUserByGroup/${this.deleateForm.assignGroup}`).then((res) => {
            this.assignUserData = res.data
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择授派组！'
          });
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
