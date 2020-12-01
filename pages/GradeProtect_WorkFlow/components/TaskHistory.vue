<template>
    <div class="assetList">
        <s-table-page :data='tableData'>
          <s-table-column prop="taskSort" label="任务排序"></s-table-column>
          <s-table-column prop="taskId" label="任务ID">
              <template slot-scope="scope">
                <template>
                  <a v-text="scope.row.taskId" class="ip" style="color:#199fed;text-decoration: none;" href="javascript:;" @click="gotoItemInfo(scope.row)"></a>
                </template>
              </template>
          </s-table-column>
          <s-table-column prop="taskTitle" label="任务标题"></s-table-column>
          <s-table-column prop="nodeName" label="节点名称"></s-table-column>
          <s-table-column prop="taskStatus" label="任务状态" :formatter='taStatus'>
          </s-table-column>
          <s-table-column prop="assignUserName" label="处理人真实名称"></s-table-column>
        </s-table-page>
        <s-dialog
            v-model="workDialog"
            v-if="workDialog"
            width="600px"
            class="createProcess"
            title="工作信息详情">
            <template slot="footer" class="dialog-footer">
                <s-button @click="workDialog = false">保存</s-button>
                <s-button type="cancel" @click="workDialog = false">关闭</s-button>
            </template>
        </s-dialog>
        <safeTask v-model="editSafetaskDialog" v-if="editSafetaskDialog" :editData='editData' :title='title' :orderUuid='orderUuid' :currentNodeUuid='currentNodeUuid' @safeTask='safeTask'></safeTask>
    </div>
</template>
<script>
import $axios from 'sunflower-ajax'
import SafeTask from '@/pages/Safety_BulletinTask/components/SafeTask';
export default {
    data() {
        return {
            tableData: [
            ],
            distart: false,
            workDialog: false,
            editSafetaskDialog: false,
            title: '编辑',
            editData: [],
            value1: false,
            flag: false
        }
    },
    components: {
        SafeTask
    },
    created() {
      console.log(this.disButton)
        this.getData()
    },
    props: {
        orderUuid: String,
        curNodeUuid: String,
        refer: Boolean,
        disButton: Boolean
    },
    watch: {
      refer: {
        immediate: true,
        handler(val) {
          if (val === true) {
              this.getData()
              this.$emit('refstate', false)
          }
        }
      },
      disButton: {
        immediate: true,
        handler(val) {
          this.flag = val
        }
      }
    },
    methods: {
        eyes() {
            this.workDialog = true
        },
        taStatus(row) {
          switch (row.taskStatus) {
            case 1: return '新建'
            case 2: return '进行中'
            case 3: return '已完成'
          }
        },
        del(val) {
            $axios.get(`/safetyPlatform/safeOrderTask/deleteSafeOrderTask/${val.uuid}`).then(res => {
                if (res.data.state) {
                    this.$message({message: '删除成功!', type: 'success'});
                    this.getData()
                }
            })
        },
        delsort(row) {
          let sort = row.taskSort + 1
          $axios.get(`/safetyPlatform/safeOrderTask/sortSafeOrderTask/${this.orderUuid}/${this.curNodeUuid}/${row.uuid}/${sort}`).then(res => {
            if (res.data.state) {
                this.$message({message: '排序成功!', type: 'success'});
                this.getData()
            }
          })
        },
        addsort(row) {
          let sort = row.taskSort
          if (row.taskSort >= 1) {
            sort = sort - 1
          } else {
            return
          }
          $axios.get(`/safetyPlatform/safeOrderTask/sortSafeOrderTask/${this.orderUuid}/${this.curNodeUuid}/${row.uuid}/${sort}`).then(res => {
            if (res.data.state) {
                this.$message({message: '排序成功!', type: 'success'});
            }
          })
        },
        runTask(val) {
            $axios.get(`/safetyPlatform/safeOrderTask/startCurTaskList/${this.orderUuid}/${this.curNodeUuid}`).then(res => {
                if (res.data.state) {
                    this.$message({message: '启动成功!', type: 'success'});
                    this.flag = true
                    this.getData()
                    this.$emit('refstate', false)
                }
            })
        },
        gotoItemInfo(row) { // 跳转至面板业
          this.$router.push(`/GradeProtect/safetyBulletin_dispose/${row.uuid}`);
        },
        getData() {
            $axios.get(`/safetyPlatform/safeOrderTask/getOrderTaskHisList/${this.orderUuid}`).then(res => {
                this.tableData = res.data
            })
        },
        edit(val) {
            this.title = 'title'
            this.editData = val
            this.editSafetaskDialog = true
        },
        safeTask(val) {
            this.getData()
        }
    }
}
</script>
