<!--模板维护-->
<template>
  <s-row>
    <s-col :span="(EventAuth && ChangeAuth) ? 12 : 24" style="padding-right: 5px;" v-if="EventAuth">
        <s-row>
          <s-button @click="createMould" icon="blackboard">创建事件单模板</s-button>
          <s-button @click="batchDel" icon="batch-del">批量删除</s-button>
        </s-row>
        <s-table-page
          ref="multipleTable"
          :data="EventDataList"
          style="width:100%"
          @selection-change="handleSelectionChange"
        >
          <s-table-column type="selection" width="80" ></s-table-column>
          <s-table-column prop="templateName" label="模板名称"></s-table-column>
          <s-table-column prop="briefDesc" label="简要描述"></s-table-column>
          <s-table-column label="操作" width="200">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" @click="editEvent(scope.row)" title="修改"></i>
              <i class="iconfont icon-delete" @click="delEvent(scope.row)" title="删除"></i>
            </template>
          </s-table-column>
        </s-table-page>
    </s-col >
    <s-col :span="(EventAuth && ChangeAuth) ? 12 : 24" style="padding-left: 5px;" v-if="ChangeAuth">
        <s-row>
          <s-button @click="createChangeList" icon="blackboard">创建变更单模板</s-button>
          <s-button @click="batchDelChange" icon="batch-del">批量删除</s-button>
        </s-row>
        <s-table-page
          ref="multipleTable"
          :data="ChangeDataList"
          style="width:100%"
          @selection-change="changeSelectionChange"
        >
          <s-table-column type="selection" width="80" ></s-table-column>
          <s-table-column prop="templateName" label="模板名称"></s-table-column>
          <s-table-column prop="briefDesc" label="简要描述"></s-table-column>
          <s-table-column label="操作" width="200">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" @click="editChangeOrder(scope.row)" title="修改"></i>
              <i class="iconfont icon-delete" @click="delChangeOrder(scope.row)" title="删除"></i>
            </template>
          </s-table-column>
        </s-table-page>
    </s-col>

    <!--创建事件单模板-->
    <s-dialog
      v-model="eventMould"
      v-if="eventMould"
      width="700px"
      title="创建事件单模板"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <event-mould-dialog ref="eventMould"></event-mould-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEvent">保存</s-button>
        <s-button type="cancel" @click="cancelEvent">取消</s-button>
      </template>
    </s-dialog>

    <!--修改事件单模板-->
    <s-dialog
      v-model="changeEventMould"
      v-if="changeEventMould"
      width="700px"
      title="修改事件单模板"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <change-event-mould :changeData="eventData" ref="changeEventMould"></change-event-mould>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEventChange">保存</s-button>
        <s-button type="cancel" @click="cancelEventChange">取消</s-button>
      </template>
    </s-dialog>

    <!--创建变更单模板-->
    <s-dialog
      v-model="changeList"
      v-if="changeList"
      width="700px"
      title="创建变更单模板"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <change-list-dialog ref="changeList"
                            @show-riskTemplate="showRiskTemplate"></change-list-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveChangeList">保存</s-button>
        <s-button type="cancel" @click="cancelChangeList">取消</s-button>
      </template>
    </s-dialog>

    <!--编辑变更单模板-->
    <s-dialog
      v-model="editChangeList"
      v-if="editChangeList"
      width="700px"
      title="编辑变更单模板"
      append-to-body>
      <s-scrollbar wrap-style="height: 400px;">
        <edit-change-list-dialog :editChangeData="editChangeData" ref="editChangeList"
                                 @show-riskTemplate="showRiskTemplate"></edit-change-list-dialog>
      </s-scrollbar>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveEditChangeList">保存</s-button>
        <s-button type="cancel" @click="cancelEditChangeList">取消</s-button>
      </template>
    </s-dialog>

    <!--变更风险问卷弹窗-->
    <change-risk-question
      v-model="changeRiskQuestion"
      v-if="changeRiskQuestion"
      :cur-template="riskTemplate"
      ref="changeRiskQuestion">
    </change-risk-question>
  </s-row>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import eventMouldDialog from '../dialog/EventMouldDialog.vue';
  import changeListDialog from '../dialog/ChangeListDialog.vue';
  import changeEventMould from '../dialog/ChangeEventMouldDialog.vue';
  import editChangeListDialog from '../dialog/EditChangeListDialog.vue';
  import changeRiskQuestion from '@/home/ProcessCenter/ProcessCreatOrder/ChangeRiskQuestionDialog';
  // import authCheck from '@/common/mixins/auth.js'
  import { getPrivilege } from 'sunflower-common-utils'
  export default {
    // mixins: [authCheck],
    data() {
      return {
        EventDataList: [],
        ChangeDataList: [],
        eventMould: false,
        changeList: false,
        changeEventMould: false,
        eventData: {},
        EventAuth: false, // 事件单权限
        ChangeAuth: false, // 变更单权限
        eventSelections: [],
        changeSelections: [],
        changeUuid: '',
        editChangeList: false,
        riskTemplate: {},
        changeRiskQuestion: false,
        editChangeData: {}
      }
    },
    components: {
      eventMouldDialog,
      changeListDialog,
      changeEventMould,
      editChangeListDialog,
      changeRiskQuestion
    },
    created() {
      this.getData();
      $axios.get('/ItilCommonWorkflow/getOrderType').then(res => {
        let data = []
        for (let i in res.data) {
          data.push(res.data[i])
        }
        this.EventAuth = getPrivilege(['事件'], data)
        this.ChangeAuth = getPrivilege(['变更'], data)
      })
    },
    methods: {
      handleSelectionChange(selections) {
        this.eventSelections = selections;
      },
      changeSelectionChange(selections) {
        this.changeSelections = selections;
      },
      createMould() {
        this.eventMould = true;
      },
      editEvent(row) {
        this.eventData = row;
        this.changeEventMould = true;
      },
      delEvent(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilWorkflowConfig/deleteItilIncidentTemplate/' + uuid, {
            data: [row],
            logTemplate: '删除|模板维护>事件模板(#templateName#)'
          }).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      batchDel() {
        if (this.eventSelections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个事件单模板', type: 'error'});
        } else {
          let arr = [];
          for (let i in this.eventSelections) {
            arr.push(this.eventSelections[i].uuid);
          }
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('/itilWorkflowConfig/batchDeleteItilIncidentTemplate', arr, {
              data: this.eventSelections,
              logTemplate: '删除|模板维护>事件模板(#templateName#)'
            }).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getData();
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
          }).catch(() => {});
        }
      },
      saveEvent() {
        this.$refs['eventMould'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['eventMould'].form;
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilIncidentTemplate', form, {
            data: [form],
            logTemplate: '添加|模板维护>事件模板(#templateName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.eventMould = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      saveEventChange() {
        this.$refs['changeEventMould'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeEventMould'].form;
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilIncidentTemplate', form, {
            data: [form],
            logTemplate: '编辑|模板维护>事件模板(#templateName#)'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.changeEventMould = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelEventChange() {
        this.changeEventMould = false;
      },
      getData() {
        $axios.post('/itilWorkflowConfig/getIncidentAndChangeTemplateList').then((res) => {
          if (res.status === 200) {
            this.EventDataList = res.data.incident;
            this.ChangeDataList = res.data.change;
          }
        })
      },
      cancelEvent() {
        this.eventMould = false;
      },
      createChangeList() {
        this.changeList = true;
      },
      saveChangeList() {
        this.$refs['changeList'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeList'].form;
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilChangeTemplate', form).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.changeList = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelChangeList() {
        this.changeList = false;
      },
      editChangeOrder(row) {
        this.editChangeData = row;
        this.editChangeList = true;
      },
      showRiskTemplate(template) {
        this.changeRiskQuestion = true;
        this.riskTemplate = template;
      },
      delChangeOrder(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilWorkflowConfig/deleteItilChangeTemplate/' + uuid).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      saveEditChangeList() {
        this.$refs['editChangeList'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['editChangeList'].form;
          $axios.post('/itilWorkflowConfig/saveOrUpdateItilChangeTemplate', form).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.editChangeList = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelEditChangeList() {
       this.editChangeList = false;
      },
      batchDelChange() {
        if (this.changeSelections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个变更单模板', type: 'error'});
        } else {
          let arr = [];
          for (let i in this.changeSelections) {
            arr.push(this.changeSelections[i].uuid);
          }
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('/itilWorkflowConfig/batchDeleteItilChangeTemplate', arr).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getData();
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
          }).catch(() => {});
        }
      }
    }
  }
</script>
