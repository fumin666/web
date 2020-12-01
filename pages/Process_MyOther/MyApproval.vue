<template>
  <div style="margin:10px 5px 0 5px;" class="myother">
    <search-box :search-action="search" :show="true">
      <template slot="leftBtn">
        <s-button @click="batchallow" :disabled="allowButton" icon="correct">通过</s-button>
        <s-button @click="batchrefuse" :disabled="refuseButton" icon="ban">拒绝</s-button>
      </template>
      <template slot="form">
        <s-form :inline="true" :model="searchForm" class="demo-form-inline" label-width="110px">
                    <s-form-item label="审批状态:">
                      <s-select v-model="searchForm.approveResult" style="width: 145px">
                        <s-option label="通过" :value="1"></s-option>
                        <s-option label="拒绝" :value="0"></s-option>
                        <s-option label="未审批" :value="2"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="工单类型:">
                      <s-select v-model="searchForm.orderType" style="width: 145px">
                        <s-option v-for="(value, key, index) in orderTypeMap" :key="index" :value="parseInt(key)"
                                  :label="value"></s-option>
                      </s-select>
                    </s-form-item>
                    <s-form-item label="提交时间:">
                      <s-date-picker
                        style="width: 145px"
                        type="datetime"
                        placeholder="选择起始时间"
                        v-model="searchForm.commitTimeStart"
                        :editable="false"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="disableAfterToday1"
                        @change="getDateRangeStart">
                      </s-date-picker>
                      ~

                      <s-date-picker
                      style="width: 145px"
                      type="datetime"
                      placeholder="选择结束时间"
                      v-model="searchForm.commitTimeEnd"
                      :editable="false"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="disableAfterToday2"
                      @change="getDateRangeEnd">
                    </s-date-picker>
                    </s-form-item>
        </s-form>
      </template>
      <template slot="btn-next">
        <s-button @click="reset()">重置</s-button>
      </template>
    </search-box>
    <s-table-page :data="list"
                 @selection-change="selectionChange">
      <s-table-column type="selection" width="45">
      </s-table-column>
      <s-table-column prop="sercode" label="工单编号" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="goDetail(scope.row.orderType, scope.row.orderUuid)"  href="javascript:;">{{ scope.row.sercode }}</a>
        </template>
      </s-table-column>
      <s-table-column prop="titile" label="工单简要描述" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="orderType" label="工单类型" show-overflow-tooltip>
        <!--<template slot-scope="scope">
          <span v-text="approorderType[scope.row.orderType]"></span>
        </template>-->
      </s-table-column>
      <s-table-column prop="approveStatus" label="审批状态" show-overflow-tooltip>
        <!--<template slot-scope="scope">
            <span v-text="approveStatus[scope.row.approveResult]"></span>
          </template>-->
      </s-table-column>
      <s-table-column prop="userStatus" label="流程状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getStatus(scope.row.orderType, scope.row.userStatus)}}
          </template>
      </s-table-column>
      <s-table-column prop="executeSort" label="审批顺序" show-overflow-tooltip>
      </s-table-column>
     <s-table-column prop="createUserName" label="提交人" :show-overflow-tooltip="false" :showTooltipWhenOverflow="false">
         <template slot-scope="scope">
           <NameCardClick :useruuid="scope.row.createUser" :placement="'top-start'">
             <div>{{scope.row.userRealName}}</div>
           </NameCardClick>
         </template>
      </s-table-column>
      <s-table-column prop="createTime" label="提交时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="操作" width="150">
        <template slot-scope="scope">
          <i :class="'iconfont icon-correct ' + (disabled ? 'disabled': '')" :disabled="delIsShow(scope.row)" @click="allow(scope.row, disabled)" title="通过"></i>
          <i :class="'iconfont icon-ban ' + (disabled ? 'disabled': '')"  @click="refuse(scope.row, disabled)" title="拒绝"></i>
        </template>
      </s-table-column>
    </s-table-page>
    <s-dialog
      v-if="Closedialog"
      v-model="Closedialog"
      title="拒绝"
      width="500px"
    >
      <close-dialog ref="closeData"></close-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="closeOK()">确定</s-button>
        <s-button type="cancel" @click="Closedialog= false">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import CloseDialog from './components/CloseDialog';
  import $axios from 'sunflower-ajax';
  import {NameCardClick} from '@/components/nameCard/NameCard';
  //  import Bus from '@/plugins/eventBus';

  export default {
    components: {
      SearchBox,
      // DateRange,
      CloseDialog,
      NameCardClick
    },
    data() {
      return {
        searchForm: {
          approveResult: 2,
          orderType: null,
          commitTimeStart: '',
          commitTimeEnd: ''
        },
        orderTypeMap: {},
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
        list: [],
        selections: [],
        isShowButton: false,
        Closedialog: false,
        refuseuuid: '',
        approorderType: ['事件流程', '问题流程', '变更流程', '发布流程', '特殊运维流程', '创建知识流程', '修订知识流程', '销毁知识流程'],
        approveStatus: ['通过', '拒绝', '未审批'],
        refuseButton: false,
        allowButton: false,
        disabled: false
      }
    },
    computed: {
    },
    created() {
      this.getOrderType().then(() => { this.search() })
    },
    mounted() {
     this.getDateRangeStart(this.searchForm.commitTimeStart)
     this.getDateRangeEnd(this.searchForm.commitTimeEnd)
    },
    methods: {
      getOrderType() {
        return $axios.get('ItilCommonWorkflow/getApproveOrderType').then(res => {
            this.orderTypeMap = res.data;
            return this.orderTypeMap;
        })
      },
      delIsShow(row) {
        if (row.approveStatus !== '未审批') {
          this.disabled = true
        } else {
          this.disabled = false
        }
      },
      getStatus(orderType, status) {
        let data = []
        switch (orderType) {
          case '事件': // 事件
            data = this.$store.state.processCenter.status[0]
            /* data = ['新建', '已指派', '待决', '进行中', '已解决', '已关闭', '已取消'] */
            return data[status]
          case '问题': // 问题
            data = this.$store.state.processCenter.status[1]
            return data[status]
          case '变更': // 变更
            data = this.$store.state.processCenter.status[2]
            return data[status - 1]
          case '任务': // 任务
            data = this.$store.state.processCenter.status[3]
            return data[status - 1]
          case '知识': // 知识
            data = this.$store.state.processCenter.status[4]
            return data[status - 1]
          case '发布':  // 发布
            data = this.$store.state.processCenter.status[5];
            return data[status];
          case '服务请求': // 服务请求
            data = this.$store.state.processCenter.status[6]
            return data[status]
        }
      },
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
      search() {
      this.refuseButton = false
        this.allowButton = false
        let params = {
          approveResult: this.searchForm.approveResult,
          orderType: this.searchForm.orderType,
          commitTimeStart: parseInt(new Date(this.searchForm.commitTimeStart).getTime() / 1000),
          commitTimeEnd: parseInt(new Date(this.searchForm.commitTimeEnd).getTime() / 1000)
        }
        $axios.post('/itilWorkflowCenter/getItilApproveOrderList', params).then(({data}) => {
          this.list = data.map(item => Object.assign(item.approveDetail, {createTime: item.createTime}, {orderType: item.orderType},
            {titile: item.titile}, {sercode: item.sercode}, {userRealName: item.commituser ? item.commituser.userRealName : ''}, {createUser: item.commituser ? item.commituser.uuid : ''},
            {approveStatus: item.approveStatus}, {userStatus: item.orderStatus})
         )
          switch (this.searchForm.approveResult) {
            case 0:
              this.refuseButton = true
              this.allowButton = true
              break;
            case 1:
              this.refuseButton = true
              this.allowButton = true
              break;
          }
        })
      },
      reset() {
        this.searchForm = {
          commitTimeStart: '',
          commitTimeEnd: ''
        }
      },
      dialogallow(params) {
        this.$confirm('确定通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/itilWorkflowCenter/approvePass', params).then((res) => {
            if (res.data.state === true) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.search()
            } else {
              this.$message({
                type: 'error',
                message: '审批通过/拒绝失败，请刷新重试！'
              })
            }
          })
        }).catch(() => {});
      },
      batchallow() {
        if (this.selections.length === 0) {
          this.$message('请至少选择一条数据')
        } else {
          let params = this.selections.map(item => {
            return item.uuid
          })
          this.dialogallow(params)
        }
      },
      allow(row, disabled) {
      if (disabled) return;
       this.dialogallow([row.uuid])
      },
      refuse(row, disabled) {
        if (disabled) return;
        this.refuseuuid = row.uuid
        this.Closedialog = true
       },
      batchrefuse() {
          this.refuseuuid = ''
          if (this.selections.length === 0) {
            this.$message('请至少选择一条数据')
          } else {
            this.Closedialog = true
          }
      },
      diolagRequse(params) {
        this.$refs.closeData.$refs.closeform.validate((valid) => {
        if (valid) {
            $axios.post('/itilWorkflowCenter/approveRefuse', params).then((res) => {
              if (res.data.state === true) {
                this.$message({
                  type: 'success',
                  message: '拒绝成功'
                })
                this.Closedialog = false
                this.search()
              } else {
                this.$message({
                  type: 'error',
                  message: '拒绝失败'
                })
                this.Closedialog = false
              }
            })
        } else {
        this.$message({
        type: 'error',
        message: '拒绝原因不能为空'
        })
        }
      })
      },
      closeOK() {
      if (this.refuseuuid === '') {
        let params = {}
        let reason = this.$refs.closeData.closeform.reason
       this.selections.map(item => {
           params[item.uuid] = reason
        })
       /* let uuidArray = this.selections.map(item => {
         return item.commituser.uuid
        })
        for (let i in uuidArray) {
        console.log(uuidArray[i])
        params.i = reason
        } */
       this.diolagRequse(params)
      } else {
        this.diolagRequse({[this.refuseuuid]: this.$refs.closeData.closeform.reason})
      }
      },
      approve(name) {
        switch (name) {
          case 'allow':
            this.batchallow()
            break;
          case 'refuse':
            this.batchrefuse()
        }
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      batchClose() {
        this.Closedialog = true
      },
      batchAttention() {
      },
      goto(path) {
        this.$router.push(path)
      },
      goDetail(orderType, orderUuid) {
        switch (orderType) {
          case '事件':
            this.goto('/ProcessCenter/eventDetail/' + orderUuid);
            break;
          case '问题':
            this.goto('/ProcessCenter/problemDetail/' + orderUuid);
            break;
          case '变更':
            this.goto('/ProcessCenter/modifyDetail/' + orderUuid);
            break;
          case '任务':
            this.goto('/ProcessCenter/taskOrderDetail/' + orderUuid);
            break;
          case '知识':
            this.goto('/ProcessCenter/knowDetail/' + orderUuid);
            break;
          case '发布':
            this.goto('/ProcessCenter/publishDetail/' + orderUuid)
            break;
          case '服务请求':
            this.goto('/ProcessCenter/requestServiceDetail/' + orderUuid);
            break;
        }
      }
    }
  }
</script>

<style lang="stylus">
  .myother
    .reButton
      float: right;
      margin-right: 16px;
      margin-top: -38px;
   .disabled
    color: gray !important
    cursor: not-allowed !important

</style>

