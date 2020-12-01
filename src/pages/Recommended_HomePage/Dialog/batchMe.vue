<template>
  <div>
    <s-dialog v-model="dialogFlag" title="我申请"  width="70%">
          <s-table-page :data='lists'
                    :has-action-col='false'
                    :header-search='getSearchDef()'
                    >
            <s-table-column
              prop="taskName"
              label="任务名称">
            </s-table-column>
            <s-table-column
              prop="userRealName"
              label="任务创建者">
            </s-table-column>
            <s-table-column
              prop="beginTime"
              label="开始时间">
            </s-table-column>
            <s-table-column
              prop="endTime"
              label="结束时间">
            </s-table-column>
            <s-table-column
              prop="lastTime"
              label="上次执行完成时间"
              :formatter="formatterStatus">
            </s-table-column>
            <s-table-column
              label="下次执行时间">
              <template slot-scope="scope">
                <span v-if="Date.parse(new Date(scope.row.endTime)) - Date.parse(new Date(scope.row.nextTime)) > 0">
                  {{scope.row.nextTime}}
                </span>
                <span v-else>任务结束</span>
              </template>
            </s-table-column>
            <s-table-column
              prop="taskStatus"
              label="状态"
              :formatter="taStatus">
            </s-table-column>
            <s-table-column label="操作"  width="150">
              <template slot-scope="scope" >
                <i class="iconfont icon-eye" @click="viewListHandle(scope.row)" title="查看详情"></i>
                <i v-if="isShowCarry(scope.row)" class="iconfont icon-carry-out" @click="carryHandle(scope.row)" title="立即执行"></i>
                <i class="iconfont icon-delete" @click="delListHandle(scope.row)" title="删除"></i>
              </template>
            </s-table-column>
          </s-table-page>
    </s-dialog>
        <!--查看详情-->
    <s-dialog
      v-model="viewInfoDialog"
      v-if="viewInfoDialog"
      width="900px"
      title="申请详情">
      <view-list :viewdata="viewdata"></view-list>
    </s-dialog>
  </div>
</template>

<script>
  import viewList from './ViewBatchDialog'
  import {isArray} from 'lodash';
  import $axios from 'sunflower-ajax'

  export default {
    components: {
      viewList
    },
    data() {
      return {
        dialogFlag: false,
        viewInfoDialog: false,

        lists: [],
        viewdata: {},

        tableData: [],
        form: {
          type: '',
          time: ''
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getLists()
    },
    methods: {
      getSearchDef() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['taskName', 'userRealName', 'beginTime', 'endTime', 'lastTime', 'nextTime']
        }
      },
      getLists() {
        $axios.get('/operationBatchExcute/getBatchExcuteTaskList').then((res) => {
          this.lists = res.data
        });
      },
      formatterStatus(item) {
        return (item.lastTime.substr(0, 4) === '1970') ? '' : item.lastTime
      },
      taStatus(item) {
        switch (item.taskStatus) {
          case 1: return '正在上传脚本'
          case 2: return '等待执行'
          case 3: return '正在执行'
          case 4: return '执行完成(正常)'
          case 5: return '执行完成(异常)'
          case 6: return '等待审批'
          case 7: return '审批通过'
          case 8: return '审批拒绝'
          case 9: return '上传脚本失败'
        }
      },
      isShowCarry(row) {
        if (row.taskStatus === 2 || row.taskStatus === 4 || row.taskStatus === 5) {
          if (Date.parse(new Date(row.nextTime)) > Date.parse(new Date(row.endTime))) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      },
      viewListHandle(row, type) {
        let infoUuid = ''
        type === 1 ? infoUuid = row.taskUuid : infoUuid = row.uuid
        $axios.get(`/operationBatchExcute/getAddFormInfo/${infoUuid}`).then(res => {
          this.viewInfoDialog = true
          this.viewdata = res.data
        })
      },
      carryHandle(row) {
        this.$confirm('确定立即执行？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/operationBatchExcute/exeBatchExcuteTask/${row.uuid}`).then((res) => {
            if (res.data.status === 'true') {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getLists()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }).catch(() => {});
      },
      delListHandle(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let form = [];
          let formName = [];
          if (isArray(row)) {
            let uuids = []
            let names = []
            for (let v of row) {
              uuids.push(v.uuid)
              names.push({
                name: v.taskName
              })
            }
            form = uuids
            formName = names
          } else {
            form.push(row.uuid)
            formName.push({
              name: row.taskName
            })
          }
          $axios.post('/operationBatchExcute/delBatchExcuteTask', form, {
            data: formName,
            logTemplate: '删除|申请列表>设置任务(#name#)'
          }).then((res) => {
            if (res.data === true) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getLists();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              });
            }
          });
        }).catch(() => {});
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>
