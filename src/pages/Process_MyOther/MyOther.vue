<template>
  <div style="margin:0 20px;" class="myother">
    <s-row style="margin: 15px 0 10px;">
      <s-col :span="22">
        <s-button @click="batchClose" icon="order-close" :disabled="closeDisabled" style="margin-right: 10px;">关单</s-button>
        <s-button @click="batchConcern" icon="star-empty">关注</s-button>
      </s-col>
      <s-col :span="2" style="text-align: right">
        <s-button @click="hideHandler" icon="magnifier"></s-button>
      </s-col>
    </s-row>
    <div class="commonBox" v-show="flag">
      <s-form ref="searchBox" :inline="true" :model="searchForm" class="demo-form-inline" label-width="100px" :rules="searchFormRule">
        <s-row>
          <s-col :span="6">
            <s-form-item label="工单类型:">
              <s-select v-model="searchForm.orderType" @change="getGroup">
                <s-option v-for="(value, key, index) in orderTypeMap" :key="index" :value="parseInt(key)"
                          :label="value"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="分类一级:">
              <s-cascader
                :options="categoryFirstList"
                :props="categoryConfig"
                :value="categoryFirstValue"
                expand-trigger="hover"
                :show-all-levels= "false"
                v-model="searchForm.categoryFirst"
                style="width: 100%"
              >
              </s-cascader>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="受派组:">
              <s-cascader
                :options="assignGroupData"
                :props="GroupConfig"
                :value="GroupDataValue"
                expand-trigger="hover"
                :show-all-levels= "false"
                v-model="searchForm.assignGroup"
                style="width: 100%"
              >
              </s-cascader>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="提交人:">
              <s-select v-model="searchForm.createUser" filterable style="width: 107%;" @focus="getcreateUserData()">
                <s-option v-for="item in createUserData" :label="item.userRealName" :value="item.uuid"
                          :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row>
          <s-col :span="6">
            <s-form-item label="工单编号:" prop="serialCode">
              <s-input v-model="searchForm.serialCode" style="width: 112%;"></s-input>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="分类二级:">
              <s-select v-model="searchForm.categorySecond" @focus="getSecondCategory(searchForm.orderType)">
                <s-option v-for="item in categorySecondList" :label="item.categoryName" :value="item.uuid"
                          :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="受派人:">
              <s-select v-model="searchForm.assignUser" @focus="getUser()">
                <s-option v-for="item in assignUserData" :label="item.userRealName" :value="item.uuid"
                          :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="提交时间大于:">
              <s-date-picker
                type="datetime"
                placeholder="选择大于时间"
                v-model="searchForm.startTime"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                @change="getDateRangeStart"
              >
              </s-date-picker>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row>
          <s-col :span="6">
            <s-form-item label="简要描述:">
              <s-input v-model="searchForm.briefDesc" style="width: 112%;"></s-input>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="分类三级:">
              <s-select v-model="searchForm.categoryThird" @focus="getThirdCategory(searchForm.orderType)">
                <s-option v-for="item in categoryThirdList" :label="item.categoryName" :value="item.uuid"
                          :key="item.uuid"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="工单状态:">
              <s-select v-model="searchForm.status" v-if="searchForm.orderType === 2 || searchForm.orderType === 3 || searchForm.orderType === 4" >
                <s-option v-for="(item, index) in statusData" :label="item" :value="index + 1"
                          :key="index"></s-option>
              </s-select>
              <s-select v-model="searchForm.status" v-else>
                <s-option v-for="(item, index) in statusData" :label="item" :value="index" :key="index"></s-option>
              </s-select>
            </s-form-item>
          </s-col>
          <s-col :span="6">
            <s-form-item label="提交时间小于:">
              <s-date-picker
                type="datetime"
                placeholder="选择小于时间"
                v-model="searchForm.endTime"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                @change="getDateRangeEnd"
              >
              </s-date-picker>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row style="text-align: right; margin-right: 8%;">
          <s-button @click="search()">查询</s-button>
          <s-button @click="reset()">重置</s-button>
        </s-row>
      </s-form>
    </div>
    <RealPageTable :ajax-obj="axiosObj" @selection-change="selectionChange" :callback="handleData">
      <s-table-column type="selection" width="45" v-if="type!=='myHaveDone'">
      </s-table-column>
      <s-table-column prop="serialCode" label="工单编号" show-overflow-tooltip>
        <template slot-scope="scope">
          <a @click="scope.row.taskSource === 6 ? clickToPublishTaskOrder(scope.row) : goDetail(scope.row.orderType, scope.row.uuid)" href="javascript:;">{{ scope.row.serialCode }}</a>
        </template>
      </s-table-column>
      <s-table-column prop="briefDesc" label="工单简要描述" show-overflow-tooltip>
         <template slot-scope="scope">
       {{scope.row.briefDesc || scope.row.title}}
      </template>
        </s-table-column>
      <s-table-column prop="orderType" label="工单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-text="searchorderType[scope.row.orderType]"></span>
        </template>
      </s-table-column>
      <s-table-column prop="status" label="工单状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getStatus(scope.row.orderType, scope.row.status)}}
        </template>
      </s-table-column>
      <s-table-column prop="createUserName" label="提交人" :show-overflow-tooltip="false" :showTooltipWhenOverflow="false">
        <template slot-scope="scope">
          <NameCardClick :useruuid="scope.row.createUser" :placement="'top-start'">
            <div>{{scope.row.createUserName}}</div>
          </NameCardClick>
        </template>
      </s-table-column>
      <s-table-column prop="createTime" label="提交时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="操作">
        <template slot-scope="scope">
          <i class="iconfont" :class="[scope.row.isConcern === 1 ? 'icon-star-full' : 'icon-star-empty']"
             @click="handleConcern(scope.row)"
             :title="scope.row.isConcern === 1 ? '取消关注' : '关注'"></i>
        </template>
      </s-table-column>
    </RealPageTable>
    <s-dialog
      v-if="Closedialog"
      v-model="Closedialog"
      title="关单"
      width="500px"
    >
      <close-dialog ref="closeData" :orderType = "searchForm.orderType"></close-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="closeOK()">确定</s-button>
        <s-button type="cancel" @click="Closedialog= false">关闭</s-button>
      </template>
    </s-dialog>
  </div>
</template>

<script>
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  // import DateRange from '@/components/tableCom/src/DateRange';
  import CloseDialog from './components/SearchClose';
  import $axios from 'sunflower-ajax';
  import detailMixin from '@/pages/Process_Modify/ModifyDetailMixin'
  //  import Bus from '@/plugins/eventBus';
  import {NameCardClick} from '@/components/nameCard/NameCard';
  import {cloneDeep} from 'lodash';
  import processRoleMixin from '@/home/ProcessCenter/processRoleMixin.js'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

  export default {
    mixins: [processRoleMixin, detailMixin],
    components: {
      // SearchBox,
      // DateRange,
      CloseDialog,
      NameCardClick,
      RealPageTable
    },
    data() {
      return {
        searchForm: {
          orderType: 0,
          serialCode: '',
          categoryFirst: [],
          categorySecond: '',
          categoryThird: '',
          assignUser: '',
          assignGroup: [],
          createUser: '',
          status: null,
          startTime: '',
          endTime: '',
          briefDesc: ''
        },
        axiosObj: {
          type: 'post',
          url: '/ItilCommonWorkflow/serachOrder',
          params: {
            condition: {}
          }
        },
        orderTypeMap: {},
        GroupConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
        },
        categoryConfig: {
          label: 'name',
          value: 'uuid',
          children: 'childrenList'
          },
        categoryFirstValue: [],
        GroupDataValue: [],
        searchFormRule: {},
        selections: [],
        isShowButton: false,
        Closedialog: false,
        categoryFirstList: [],   // 一级列表
        categorySecondList: [],  // 二级列表
        categoryThirdList: [],
        assignGroupData: [],
        assignUserData: [],
        statusData: [],
        searchorderType: ['事件', '问题', '变更', '任务', '知识', '发布', '服务请求'],
        createUserData: [],
        // 当前用户组
        userGroups: [],
        closeDisabled: false,
        flag: false
      }
    },
    computed: {
      type() {
        let path = this.$route.path;
        return path.slice(path.lastIndexOf('/') + 1);
      },
      rolePro() {
        return this.$store.state.processCenter.rolePro;
      }
    },
    watch: {
      'searchForm.orderType'(val) {
        this.searchForm.categoryFirst = []
        this.searchForm.categorySecond = ''
        this.searchForm.categoryThird = ''
        switch (val) {
          case 0:
            this.statusData = this.$store.state.processCenter.status[0]
            this.searchForm.status = null
            break;
          case 1:
            this.statusData = this.$store.state.processCenter.status[1]
            this.searchForm.status = null
            break;
          case 2:
            this.statusData = this.$store.state.processCenter.status[2]
            this.searchForm.status = null
            break;
          case 3:
            this.statusData = this.$store.state.processCenter.status[3]
            this.searchForm.status = null
            break;
          case 4:
            this.statusData = this.$store.state.processCenter.status[4]
            this.searchForm.status = null
            break;
          case 5:
            this.statusData = this.$store.state.processCenter.status[5]
            this.searchForm.status = null
            break;
          case 6:
            this.statusData = this.$store.state.processCenter.status[6]
            this.searchForm.status = null
            break;
        }
      }
    },
    created() {
      this.statusData = this.$store.state.processCenter.status[0]
     // this.getItilCategory(1)
      this.getGroup()
      this.getOrderType().then(() => { this.search() })
      this.getcreateUserData()
      this.getUserGroups()
    },
    mounted() {
      this.getDateRangeStart(this.searchForm.startime)
      this.getDateRangeEnd(this.searchForm.endtime)
    },
    methods: {
      getOrderType() {
        return $axios.get('ItilCommonWorkflow/getOrderType').then(res => {
          this.orderTypeMap = res.data;
          return this.orderTypeMap;
        })
      },
      getUserGroups() {
        // 获取当前用户组
        $axios.get('/ItilCommonWorkflow/getGroupListByUser').then(({data}) => {
          this.userGroups = data.map(item => item.uuid)
        })
      },
      getcreateUserData() {
        $axios.get('/iamUserInfo/getIamUserInfoListForItil').then(({data}) => {
          this.createUserData = data
        })
      },
      getStatus(orderType, status) {
        let data = []
        switch (orderType) {
          case 0: // 事件
            data = this.$store.state.processCenter.status[0]
            /* data = ['新建', '已指派', '待决', '进行中', '已解决', '已关闭', '已取消'] */
            return data[status]
          case 1: // 问题
            data = this.$store.state.processCenter.status[1]
            return data[status]
          case 2: // 变更
            data = this.$store.state.processCenter.status[2]
            return data[status - 1]
          case 3: // 任务
            data = this.$store.state.processCenter.status[3]
            return data[status - 1]
          case 4: // 知识
            data = this.$store.state.processCenter.status[4]
            return data[status - 1]
          case 5: // 发布
            data = this.$store.state.processCenter.status[5]
            return data[status]
          case 6: // 服务请求
            data = this.$store.state.processCenter.status[6]
            return data[status]
        }
      },
      clickToPublishTaskOrder(row) {
        this.$emit('goPublishTask', row)
      },
      getDateRangeStart(value) {
        let start = this.searchForm.startime ? new Date(this.searchForm.startime).getTime() : 0
        let end = this.searchForm.endtime ? new Date(this.searchForm.endtime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.searchForm.startime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.searchForm.startime ? new Date(this.searchForm.startime).getTime() : 0
        let end = this.searchForm.endtime ? new Date(this.searchForm.endtime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.searchForm.endtime = '';
          }
        }
      },
      search() {
        let params = Object.assign({}, this.searchForm, {
          startTime: new Date(this.searchForm.startTime).getTime() / 1000,
          endTime: new Date(this.searchForm.endTime).getTime() / 1000,
          categoryFirst: this.searchForm.categoryFirst.length === 1 ? this.searchForm.categoryFirst[0] : this.searchForm.categoryFirst[1],
          assignGroup: this.searchForm.assignGroup.length === 1 ? this.searchForm.assignGroup[0] : this.searchForm.assignGroup[1]
        })
        this.$nextTick(() => {
          this.axiosObj.params.condition = Object.assign({}, params);
        })
        this.flag = false
      },
      handleData(value) { // 返回数据中orderType是null，不同工单类型返回的status不一样，需要手动赋值。
        let pageList = []
        switch (this.searchForm.orderType) {
          case 0:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.incidentStatus,
              orderType: 0
            }))
            break;
          case 1:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.problemStatus,
              orderType: 1
            }))
            break;
          case 2:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.changeStatus,
              orderType: 2
            }))
            break;
          case 3:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.taskStatus,
              orderType: 3
            }))
            break;
          case 4:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.knowledgeStatus,
              orderType: 4
            }))
            break;
          case 5:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.publishStatus,
              orderType: 5
            }))
            break;
          case 6:
            pageList = value.pageList.map(item => Object.assign({}, item, {
              status: item.status,
              orderType: 6
            }))
            break;
        }
        pageList = pageList.sort(function (a, b) {
          return a.createTime > b.createTime ? -1 : a.createTime < b.createTime ? 1 : 0
        })
        return pageList
      },
      hideHandler() {
        this.flag = !this.flag
      },
      reset() {
        let obj = cloneDeep(this.searchForm.orderType)
        let categoryFirst = []
        let assignGroup = []
        this.searchForm = {
          orderType: obj,
          categoryFirst: categoryFirst,
          assignGroup: assignGroup,
          startTime: '',
          endTime: ''
        };
      },
      selectionChange(selections) {
        this.selections = selections;
      },
      batchClose() {
        if (this.selections.length === 0) {
          this.$message({
            type: 'error',
            message: '请至少选择一条数据'
          })
        } else {
          let type = this.selections[0].serialCode.slice(0, 2);
          if (type === 'SJ') {
            if (this.rolePro.incident < 2 || this.selections.some(item => item.incidentStatus !== 4)) {
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            }
          } else if (type === 'BG') {
            if (this.rolePro.change < 2 || this.selections.some(item => item.changeStatus !== 8)) {
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            }
          } else if (type === 'WT') {
            if (this.rolePro.problem <= 2 || this.selections.some(item => this.userGroups.indexOf(item.managerGroup) === -1 && this.userGroups.indexOf(item.professerGroup) === -1 || item.problemStatus !== 5)) {
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            }
          } else if (type === 'RW') {
            if (this.selections.some(item => item.assignUser !== this.$store.state.userData.uuid || item.taskStatus !== 4)) {
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            }
          } else if (type === 'FB') {
            if (this.selections.some(item => !((item.coordinateUser === this.$store.state.userData.uuid || item.managerUser === this.$store.state.userData.uuid) && item.publishStatus === 9))) {
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            }
          } else if (type === 'RE') {
            if (this.selections.some(item => { return item.desiUuid === '5c350009600748dfacaffd8a5734d255' || item.desiUuid === '2c350009600748dfacaffd8a5734d222' })) {
              // 服务请求离职和调岗不能关闭
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            } else if (this.selections.some(item => !(((this.userGroups.indexOf(item.managerGroup) > -1 && this.rolePro.service === 2) || this.$store.state.userData.uuid === item.assigneUser) && item.status === 5))) {
              this.$message({type: 'warning', message: '您没有权限关闭这些工单!'})
              return;
            }
          }
          this.Closedialog = true
        }
      },
      batchConcern() {
        if (this.selections.length === 0) {
          this.$message({
            type: 'error',
            message: '请至少选择一条数据'
          })
        } else {
          let testdata = this.selections.filter(item => {
            return (item.isConcern === 0)
          })
          if (testdata.length === 0) {
            this.search()
          } else {
            let params = testdata.map(item => {
              return {
                orderUuid: item.uuid,
                orderType: item.orderType
              }
            })
            $axios.post('/ItilCommonWorkflow/batchConcernIncidentOrder', params).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: data.errormsg
                })
                this.search()
              } else {
                this.$message({
                  type: 'error',
                  message: '关注失败'
                })
              }
            })
          }
        }
      },
      handleConcern(row) {
        if (row.isConcern !== 1) {
          this.$confirm('确定关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${row.uuid}/${row.orderType}`).then(({data}) => {
              if (data) {
                this.$message({
                  type: 'success',
                  message: '关注成功'
                })
              }
              row.concernUuid = data
              this.search()
            })
          }).catch(() => {});
        } else {
          this.$confirm('确定取消关注此单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${row.concernUuid}`).then(({data}) => {
              if (data.state === true) {
                this.$message({
                  type: 'success',
                  message: '取消关注成功'
                })
                this.search()
              } else {
                this.$message({
                  type: 'error',
                  message: '取消关注失败'
                })
              }
            })
          }).catch(() => {});
        }
      },
      getItilCategory(ownerType) {
        $axios.post(`ItilCommonWorkflow/getCompanyAndCategory/${ownerType}`).then(({data}) => {
            this.categoryFirstList = data
        });
      },
      getSecondCategory(ownerType) {
        if (this.searchForm.categoryFirst) {
          $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
            ownerType: ownerType,
            categoryFirst: this.searchForm.categoryFirst.length === 0 ? null : this.searchForm.categoryFirst[1],
            companyUuid: this.searchForm.categoryFirst[0]
          }).then(({data}) => {
            if (data && data.length > 0) {
              this.categorySecondList = data
            }
          });
        } else {
          this.$message({
            type: 'error',
            message: '请先选择上一级！'
          });
        }
      },
      getThirdCategory(ownerType) {
        if (this.searchForm.categorySecond && this.searchForm.categoryFirst) {
          $axios.post(`/ItilCommonWorkflow/getItilCategorySelect`, {
            ownerType: ownerType,
            categoryFirst: this.searchForm.categoryFirst.length === 0 ? null : this.searchForm.categoryFirst[1],
            categorySecond: this.searchForm.categorySecond,
            companyUuid: this.searchForm.categoryFirst[0]
          }).then(({data}) => {
            if (data && data.length > 0) {
              this.categoryThirdList = data
            }
          });
        } else {
          this.$message({
            type: 'error',
            message: '请先选择上一级！'
          });
        }
      },
      getGroup() {
        if (this.searchForm.orderType === 4) {
          this.closeDisabled = true
        } else {
          this.closeDisabled = false
        }
        $axios.get(`ItilCommonWorkflow/getCompanyAndSupportGroup/${this.searchForm.orderType} `).then((res) => {
          this.assignGroupData = res.data
          this.searchForm.assignGroup = []
        })
        this.getItilCategory(this.searchForm.orderType)
      },
      getUser() {
      if (this.searchForm.assignGroup.length !== 0) {
          $axios.get(`itilWorkflowConfig/getIamUserInfoListByGroupUuid/${this.searchForm.assignGroup.length === 1 ? this.searchForm.assignGroup[0] : this.searchForm.assignGroup[1]}`).then((res) => {
            this.assignUserData = res.data
          })
        } else {
          this.$message({
            type: 'error',
            message: '请先选择受派组！'
          });
        }
      },
      diolagRequse(params) {
        $axios.post('/itilIncidentCenter/batchIncidentOrderClose', params).then((res) => {
          if (res.data === 'true') {
            this.$message({
              type: 'success',
              message: '关单成功'
            })
            this.Closedialog = false
            this.search()
          } else {
            this.$message({
              type: 'error',
              message: '关单失败'
            })
          }
        })
      },
      closeOK() {
        let params = this.selections.map(item => {
          return {
            orderUuid: item.uuid,
            orderType: item.orderType,
            closeCode: item.orderType === 5 ? this.$refs.closeData.Searchcloseform.reason - 1 : this.$refs.closeData.Searchcloseform.reason
          }
        })
        this.diolagRequse(params)
      },
      goto(path) {
        this.$router.push(path)
      },
      goDetail(orderType, uuid) {
        switch (orderType) {
          case 0:
            this.goto('/ProcessCenter/eventDetail/' + uuid);
            break;
          case 1:
            this.goto('/ProcessCenter/problemDetail/' + uuid);
            break;
          case 2:
            this.goto('/ProcessCenter/modifyDetail/' + uuid);
            break;
          case 3:
            this.goto('/ProcessCenter/taskOrderDetail/' + uuid);
            break;
          case 4:
            this.goto('/ProcessCenter/knowDetail/' + uuid);
            break;
          case 5:
            this.goto('/ProcessCenter/publishDetail/' + uuid);
            break;
          case 6:
            this.goto('/ProcessCenter/requestServiceDetail/' + uuid);
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
      margin-right: -55px;
      margin-top: -80px;

</style>
