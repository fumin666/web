/**
 * @author fumin
 * @date 2019/10/29
 * @Description: 备注管理
*/
<template>
<div>
  <s-form :inline="true" :rules="formRule" :model="searchForm" label-width="110px" class="search_form" style="margin: 10px 0;">
    <div>
      <s-form-item label="主机名/IP:" prop="assetParam">
        <s-input v-model="searchForm.assetParam" placeholder="请输入" style="width:170px;"></s-input>
      </s-form-item>
      <s-form-item label="操作时间:">
        <s-date-picker
          style="width: 170px"
          type="datetime"
          placeholder="选择起始时间"
          v-model="searchForm.startTime"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          :picker-options="disableAfterToday1"
          @change="getDateRangeStart">
        </s-date-picker>
        ~
        <s-date-picker
          style="width: 170px"
          type="datetime"
          placeholder="选择结束时间"
          v-model="searchForm.endTime"
          :editable="false"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          :picker-options="disableAfterToday2"
          @change="getDateRangeEnd">
        </s-date-picker>
      </s-form-item>
      <s-form-item label="异常信息及描述:" prop="alarmDesc">
        <s-input v-model="searchForm.alarmDesc" placeholder="请输入" style="width:170px;"></s-input>
      </s-form-item>
    </div>
    <div class="search_btn">
      <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
    </div>
  </s-form>
  <s-dropdown @on-click="batchHandler">
    <s-button icon="backup">
      批量操作<i class="iconfont icon-bottom"></i>
    </s-button>
    <s-dropdown-menu slot="list">
      <s-dropdown-item @click.native="editBatch" name="blank">批量编辑</s-dropdown-item>
      <s-dropdown-item @click.native="deleteBatch" name="offline">批量删除</s-dropdown-item>
    </s-dropdown-menu>
  </s-dropdown>
  <RealPageTable :ajax-obj="axiosHistoryObj" @selection-change="selectionChange" :actions-col-width="`150px`">
    <s-table-column type="selection" width="45"></s-table-column>
    <s-table-column label="异常ID" prop="alarmId"></s-table-column>
    <s-table-column label="主机名" prop="assetName"></s-table-column>
    <s-table-column label="IP地址" prop="assetIp"></s-table-column>
    <s-table-column label="操作时间" prop="commentTime"></s-table-column>
    <s-table-column label="操作人" prop="commentBy"></s-table-column>
    <s-table-column label="异常信息及描述" prop="alarmDesc"></s-table-column>
    <s-table-column label="备注内容" prop="comment"></s-table-column>
    <s-table-column label="操作">
      <template slot-scope="scope">
        <i class="iconfont icon-edit" title="编辑" @click="editDialog(scope.row)"> </i>
        <i class="iconfont icon-delete" title="删除" @click="deleteDialog(scope.row)"> </i>
      </template>
    </s-table-column>
  </RealPageTable>
  <!--编辑备注弹框-->
  <s-dialog
    v-model="desDialogFlag"
    v-if="desDialogFlag"
    :title="flag ? '备注编辑' : '备注批量编辑'"
    top="10vh"
    width="800px" append-to-body>
    <des-dialog :viewObj="desObj" ref="desDialog" :current="current"></des-dialog>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk(desObj)">保存</s-button>
      <s-button type="cancel" @click="desDialogCancel">取消</s-button>
    </template>
  </s-dialog>
</div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'

  import DesDialog from './dialog/EditDesDialog';
  import { cloneDeep } from 'lodash';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    data () {
      return {
        axiosHistoryObj: {
          type: 'post',
          url: '/aiopsMonitorAlarm/getAiMonAlarmComments',
          params: {
            condition: {}
          }
        },
        searchForm: {
          assetParam: null,
          alarmDesc: null,
          startTime: null,
          endTime: null
        },
        formRule: {
          assetParam: [{max: 30, message: '不能超过30个字符', blur: 'trigger'}],
          alarmDesc: [{max: 30, message: '不能超过30个字符', blur: 'trigger'}]
        },
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        selections: [],
        desObj: {},
        criteria: {                 // 真分页分页数据
          condition: {},
          currentPage: 1,
          pageSize: 10,
          totalCount: 0
        },
        desDialogFlag: false,
        flag: false,
        current: {}
      }
    },
    mounted() {
      this.getList()
      this.getDateRangeStart(this.searchForm.startTime)
      this.getDateRangeEnd(this.searchForm.endTime)
    },
    components: {
      DesDialog,
      RealPageTable
    },
    methods: {
      getDateRangeStart(value) {
        this.disableAfterToday2 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() < new Date(value).getTime())
          }
        }
      },
      getDateRangeEnd(value) {
        this.disableAfterToday1 = {
          disabledDate(time) {
            return (time.getTime() > Date.now()) || value && (time.getTime() > new Date(value).getTime())
          }
        }
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      // 编辑
      editDialog(row) {
        this.desObj = row.uuid
        this.current = row
        this.desDialogFlag = true
        this.flag = true
      },
      dialogOk(uuid) {
        let params = {
          uuids: [],
          comment: this.$refs.desDialog.form.comment
        }
        let arr = []
        if (this.selections.length > 0) {
          this.selections.map(item => {
            params.uuids.push(item.uuid)
          })
          arr = this.selections
        } else {
          params.uuids = [uuid]
          arr = [this.current]
        }
        this.$refs.desDialog.$refs.form.validate(valid => {
          if (valid) {
            $axios.post('/aiopsMonitorAlarm/batchUpdateAlarmComment', params, {
              data: arr,
              logTemplate: '编辑|备注管理>异常ID(#id#)'
            }).then(res => {
              if (res.data.state) {
                this.$message({
                  showClose: true,
                  message: res.data.errormsg,
                  type: 'success'
                });
              }
              this.getList();
              this.selections = []
              this.desDialogFlag = false
            })
          } else {
            this.$message.warning('请按要求填写！')
          }
        })
      },
      // 批量编辑
      editBatch() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '至少选择一项编辑！',
            type: 'info'
          });
        } else {
          this.desObj = ''
          this.current = this.selections
          this.desDialogFlag = true
          this.flag = false
        }
      },
      // 批量删除
      deleteBatch() {
        if (this.selections.length <= 0) {
          this.$message({
            showClose: true,
            message: '至少选择一项删除！',
            type: 'info'
          });
        } else {
          this.$confirm('确认删除备注?', '提示', {
            confirmButtonText: '保存',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let uuidList = {
              uuids: []
            }
            this.selections.map(item => {
              uuidList.uuids.push(item.uuid)
            })
            $axios.post('/aiopsMonitorAlarm/batchDeleteAlarmComment', uuidList, {
              data: this.selections,
              logTemplate: '删除|备注管理>异常ID(#id#)'
            }).then(({data, status}) => {
              if (status === 200 && data.state === true) {
                this.$message({
                  showClose: true,
                  message: '删除备注成功！',
                  type: 'success'
                });
              } else {
                this.$message({
                  showClose: true,
                  message: '删除备注失败！',
                  type: 'error'
                });
              }
              this.getList();
              this.selections = []
            });
          }).catch(() => {});
        }
      },
      desDialogCancel() {
        this.desDialogFlag = false
      },
      getList() {
        this.criteria.condition = cloneDeep(this.searchForm)
        this.criteria.condition.startTime = parseInt(new Date(this.searchForm.startTime).getTime() / 1000)
        this.criteria.condition.endTime = parseInt(new Date(this.searchForm.endTime).getTime() / 1000)
        this.axiosHistoryObj.params.condition = Object.assign({}, this.criteria.condition);
      },
      // 删除
      deleteDialog(row) {
        this.$confirm('确认删除备注?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/aiopsMonitorAlarm/batchDeleteAlarmComment', {uuids: [row.uuid]}, {
            data: [row],
            logTemplate: '删除|备注管理>异常ID(#id#)'
          }).then(({data, status}) => {
            if (status === 200 && data.state === true) {
              this.$message({
                showClose: true,
                message: '删除备注成功！',
                type: 'success'
              });
              this.getList();
            } else {
              this.$message({
                showClose: true,
                message: '删除备注失败！',
                type: 'error'
              });
            }
          });
        }).catch(() => {});
      },
      batchHandler(name) {
        switch (name) {
          case 'black':
            break;
          case 'offline':
            break;
        }
      }
    }
  }
</script>

