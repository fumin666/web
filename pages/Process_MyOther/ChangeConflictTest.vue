<template>
<div id="conflictTest">
  <s-table-page
  :data="list"
  style="margin: 20px 20px 0 20px">
    <s-table-column type="index" width="95" label="序号"></s-table-column>
    <s-table-column prop="orderCode" label="变单编号" show-overflow-tooltip>
      <template slot-scope="scope">
        <a @click="goChange(scope.row)"  href="javascript:;">{{ scope.row.orderCode }}</a>
      </template>
    </s-table-column>
    <s-table-column prop="title" label="简要描述" show-overflow-tooltip>
    </s-table-column>
    <s-table-column prop="planStartTime" label="计划开始时间" show-overflow-tooltip>
    </s-table-column>
    <s-table-column prop="planEndTime" label="计划结束时间" show-overflow-tooltip>
    </s-table-column>
    <s-table-column prop="adminUserName" label="变更管理员" show-overflow-tooltip>
    </s-table-column>
    <s-table-column prop="submitUser" label="提交人" show-overflow-tooltip>
    </s-table-column>
    <s-table-column label="操作" width="160">
      <template slot-scope="scope">
        <s-button :disabled="isDisabled(scope.row)" size="mini" @click="editchange(scope.row)">消除冲突</s-button>
      </template>
    </s-table-column>
  </s-table-page>
  <s-dialog v-model="changeDialog"
            v-if="changeDialog"
            width="500px"
            title="消除冲突">
           <conflict-dialog :uuid="orderUuid" ref="conflict"></conflict-dialog>
    <template slot="footer" class="dialog-footer">
      <s-button @click="save()">保存</s-button>
      <s-button type="cancel" @click="changeDialog = false">取消</s-button>
    </template>
  </s-dialog>
</div>
</template>

<script type="text/ecmascript-6">
import $axios from 'sunflower-ajax';
import ConflictDialog from './components/ChangeDialog.vue';
 export default {
   components: {
     ConflictDialog
   },
   data() {
     return {
       list: [],
       changeDialog: false,
       orderUuid: ''
      // isDisabled: false
     }
   },
   created() {
     this.getData()
   },
   methods: {
     getData() {
       $axios.get('/itilWorkflowCenter/getAllConflictOrders').then((res) => {
         this.list = res.data
       })
     },
     isDisabled(row) {
       if ((row.managerUserUuid === this.$store.state.userData.uuid) || (row.adminUserUuid === this.$store.state.userData.uuid)) {
         return false
       }
        return true
     },
     goto(path) {
       this.$router.push(path)
     },
     goChange(row) {
       this.goto('modifyDetail/' + row.uuid);
     },
     editchange(row) {
      this.orderUuid = row.uuid
       this.changeDialog = true
     },
     save() {
       this.$refs['conflict'].$refs['changeform'].validate((valid) => {
         if (valid) {
           let form = this.$refs['conflict'].changeform
            let startTime = parseInt(new Date(form.startTime).getTime() / 1000)
            let endTime = parseInt(new Date(form.endTime).getTime() / 1000)
           $axios.get(`/itilWorkflowCenter/checkIsConflict/${this.orderUuid}/${startTime}/${endTime}`).then(({data}) => {
             if (data.state === true) {
               this.$message({
                 type: 'error',
                 message: '时间' + data.errormsg + '请重新选择时间'
               })
             } else if (data.state === false) {
               $axios.get(`/itilChangeOrder/changeOrderPlan/${this.orderUuid}/${form.startTime}/${form.startTime}`).then(({data}) => {
                  if (data.state === true) {
                  this.changeDialog = false
                    this.$message({
                      type: 'success',
                      message: '操作成功'
                    })
                    this.getData()
                  } else {
                    this.$message({
                      type: 'error',
                      message: '操作失败'
                    })
                  }
               })
             }
           })
         } else {
         return false
         }
       })
     }
   }
 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
