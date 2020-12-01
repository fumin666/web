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
      companyUuid: {
        type: String
      },
      orderType: {
      type: Number
      }
    },
 methods: {
   getGroup() {
      if (this.orderType === 0) {
        $axios.get(`/itilIncidentCenter/getGroup/${this.companyUuid}`).then((res) => {
          this.assignGroupData = res.data
        })
      } else {
        $axios.get(`/itilChangeOrder/getAllChangeTaskAssignGroup/${this.companyUuid}`).then((res) => {
          this.assignGroupData = res.data
        })
      }
   },
   getUser() {
     if (this.orderType === 0) {
       if (this.deleateForm.assignGroup) {
         $axios.get(`/itilIncidentCenter/getIncidentOrderUser/${this.deleateForm.assignGroup}`).then((res) => {
           this.assignUserData = res.data
         })
       } else {
         this.$message({
           type: 'error',
           message: '请先选择授派组！'
         });
       }
     } else {
       if (this.deleateForm.assignGroup) {
         $axios.get(`/itilChangeOrder/getAllChangeChangeTaskAssignUserByGroup/${this.deleateForm.assignGroup}`).then((res) => {
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
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
