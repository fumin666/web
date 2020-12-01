<template>
  <section id="policyAudit">
    <s-form :inline="true" :model="searchForm" label-width="80px" :rules="searchFormRules" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="策略：" prop="policy_uuid" style="margin-bottom: 0;margin-right: 8px;">
          <s-select v-model="searchForm.policy_uuid"
                    @change="changeListValue">
            <s-option
              v-for="(list, $index) in policyLists"
              :label="list.value"
              :value="list.name"
              :key="$index"
            ></s-option>
          </s-select>
          <i class="iconfont icon-message" title="点击查看详情" @click="showPolicyDetail(searchForm.policy_uuid)"></i>
        </s-form-item>
        <s-form-item label="登录名：">
          <s-input v-model="searchForm.account_name"></s-input>
        </s-form-item>
        <s-form-item label="登录IP：" prop="client_ip">
          <s-input v-model="searchForm.client_ip"></s-input>
        </s-form-item>
        <s-form-item label="客户端MAC：" prop="client_mac" label-width="100px">
          <s-input v-model="searchForm.client_mac" style="width: 165px;"></s-input>
        </s-form-item>
        <s-form-item label="数据库名：">
          <s-select v-model="searchForm.dbi_uuid">
            <s-option
              v-for="item in dbNameList"
              :label="item.dbi_name"
              :value="item.dbi_uuid"
              :key="item.dbi_uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="数据库IP：" prop="dbi_ip">
          <s-input v-model="searchForm.dbi_ip"></s-input>
        </s-form-item>
        <s-form-item label="操作指令：">
          <s-select v-model="searchForm.dbo_id">
            <template v-for="item in operationOrderList">
              <s-option v-if="item.dbo_id === 0"
                        :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key"
                        :value="''"
                        :key="item.dbo_id"></s-option>
              <s-option v-else
                        :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key"
                        :value="item.dbo_id"
                        :key="item.dbo_id"></s-option>
            </template>
          </s-select>
        </s-form-item>
        <s-form-item label="表：">
          <s-input v-model="searchForm.tables"></s-input>
        </s-form-item>
        <s-form-item label="字段：">
          <s-input v-model="searchForm.fields"></s-input>
        </s-form-item>
        <s-form-item label="时间：" prop="timeRange">
          <s-date-picker
            v-model="searchForm.start_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            type="datetime"
            :editable="false"
            @change="getStartTime">
          </s-date-picker>
          <span>到</span>
          <s-date-picker
            v-model="searchForm.end_time"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            type="datetime"
            :editable="false"
            @change="getEndTime">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>

    <page-infinite-table
      ref="infiniteTable"
      key="infiniteTable"
      loading-text="正在加载中"
      :ajax-obj="ajaxObj"
      :startAjax="startAjaxFlag">
      <s-table-column label="登录名" prop="account_name"></s-table-column>
      <s-table-column label="登录IP" prop="client_ip"></s-table-column>
      <s-table-column label="客户端MAC" prop="client_mac"></s-table-column>
      <s-table-column label="数据库名" prop="dbi_name"></s-table-column>
      <s-table-column label="数据库IP" prop="dbi_ip"></s-table-column>
      <s-table-column label="操作指令" prop="dbo_id">
        <template slot-scope="scope">
          <span v-text="optIdToKey[scope.row.dbo_id]"></span>
        </template>
      </s-table-column>
      <s-table-column label="表" prop="tables"></s-table-column>
      <s-table-column label="字段" prop="fields"></s-table-column>
      <s-table-column label="SQL模式">
        <template slot-scope="scope">
          <span v-if="showSqlDetail" v-text="scope.row.pattern_str" @click="checkPolicy(scope.row)" class="score-td"></span>
          <span v-if="!showSqlDetail" v-text="scope.row.pattern_str"></span>
        </template>
      </s-table-column>
      <s-table-column label="执行条数" prop="occurs"></s-table-column>
    </page-infinite-table>

    <s-dialog
      title="策略信息"
      v-model="policyDetailDialog"
      v-if="policyDetailDialog"
      ref="policyDetailDialog"
      key="policyDetailDialog">
      <s-row v-for="(value, key, $index) in policyDetail" :key="$index">
        <s-col :span="8">
          <div class="grid-content bg-purple overFlowTip">{{key}}</div>
        </s-col>
        <s-col :span="16">
          <s-tooltip :content="value">
            <div class="grid-content bg-purple-light overFlowTip">{{value}}</div>
          </s-tooltip>
        </s-col>
      </s-row>
    </s-dialog>
    <s-dialog
      title="详情"
      v-model="checkPolicyDialog"
      v-if="checkPolicyDialog"
      ref="checkPolicyDialog"
      key="checkPolicyDialog"
      width="1000px">
      <check-policy :showResultSet="showResultSet" :condition="condition"></check-policy>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import checkPolicy from './CheckPolicy.vue'
  import {Validaters} from 'sunflower-common-utils';
  // import searchBox from '@/components/tableCom/src/SearchBox'
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  export default{
    data() {
      return {
        showSqlDetail: 0,               // 是否显示sql模式详情
        currentListUuid: '',            // 当前下拉框中的uuid
        policyLists: [],                // 搜索条件-策略下拉选项列表
        policyDetail: {},               // 策略选中项弹框详情
        policyDetailDialog: false,      // 策略选中项详情弹框
        checkPolicyDialog: false,       // 策略查看详情
        dbNameList: [],                 // 数据库名下拉选项列表
        operationOrderList: [],         // 操作指令下拉选项列表
        optIdToKey: {},                 // 操作指令dbo_id --> dbo_key映射
        searchForm: {                   // 搜索/查询条件
          policy_uuid: '',
          account_name: '',
          client_ip: '',
          client_mac: '',
          dbi_uuid: '',
          dbi_ip: '',
          dbo_id: '',
          tables: '',
          fields: '',
          start_time: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
          end_time: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`
        },
        searchFormRules: {            // 搜索表单规则校验
          client_ip: [Validaters.IP],
          dbi_ip: [Validaters.IP]
        },
        disAfterToday: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        // 无限分页请求参数
        startAjaxFlag: false,
        ajaxObj: {
          type: 'post',
          url: '/auditPolicyRule/auditLogList',
          params: {
            condition: {}
          }
        },
        condition: ''
      }
    },
    components: {
      checkPolicy,
      // searchBox,
      pageInfiniteTable
    },
    methods: {
      // 获取当日凌晨时间
      getTodayZeroTime() {
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      },
      getTodayEndTime() {
        let date = new Date()
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
      },
      // 时间格式化(Date -> yyyy-MM-dd HH:mm:ss)
      formatDate(date) {
        if (date) {
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
      },
      /**
       * 开始/结束时间范围合理性约束
       */
      // 开始时间
      getStartTime(val) {
        if (!val || !this.searchForm.end_time) return
        let beginVal = new Date(val).getTime();
        let endValue = new Date(this.searchForm.end_time).getTime();
        if (beginVal >= endValue) {
          this.$message.error('开始时间不能大于等于结束时间！');
          return false;
        }
      },
      // 结束时间
      getEndTime(val) {
        if (!val || !this.searchForm.start_time) return
        let endValue = new Date(val).getTime();
        let beginVal = new Date(this.searchForm.start_time).getTime();
        if (endValue <= beginVal) {
          this.$message.error('开始时间不能大于等于结束时间！');
          return false;
        }
      },
      // 下拉框的值发生改变
      changeListValue(val) {
        this.currentListUuid = val
      },
      // 无限分页搜索、查询
      search() {
        $axios.get(`/auditPolicyRule/getAuditPolicyByUuid/${this.currentListUuid}`).then(({data}) => {
          this.showSqlDetail = data.isAuditSqlDetail
          this.currentUuid = this.currentListUuid
          this.showResultSet = data.isAuditSqlr
        })
        // this.$refs.searchForm.validate(valid => {
        //   if (valid) {
            this.ajaxObj.params.condition = Object.assign({}, this.searchForm, {
              start_time: new Date(this.searchForm.start_time).getTime() / 1000,
              end_time: Math.ceil(new Date(this.searchForm.end_time).getTime() / 1000)
            })
            this.startAjaxFlag = true
        //   } else {
        //     return false
        //   }
        // })
      },
      // 获取策略下拉选项列表
      getPolicyLists() {
        return new Promise((resolve, reject) => {
          $axios.get('/auditPolicyRule/getAllAuditPolicyName').then(({data}) => {
            if (data && data instanceof Array) {
              this.policyLists = data
              this.searchForm.policy_uuid = data[0].name
              this.currentListUuid = data[0].name
              this.currentUuid = data[0].name
              // 获取当前策略是否允许查看sql模式详情
              $axios.get(`/auditPolicyRule/getAuditPolicyByUuid/${this.searchForm.policy_uuid}`).then(({data}) => {
                this.showSqlDetail = data.isAuditSqlDetail
                this.showResultSet = data.isAuditSqlr
              })
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      // 获取策略下拉选中值的"策略详情"
      showPolicyDetail(uuid) {
        $axios.get(`/auditPolicyRule/getAuditPolicyShowByUuid/${uuid}`).then(({data}) => {
          if (data && data instanceof Object && data.code !== -404) {
            if (Object.keys(data).length === 0) {
              this.$message.info('暂无详情信息！')
            } else {
              this.policyDetail = data
              this.policyDetailDialog = true
            }
          } else {
            this.$message.error('数据获取失败，请刷新重试！')
          }
        })
      },
      // 获取数据库名/操作指令-下拉选项列表
      getDbNameOperationOrder() {
        $axios.get('/dbOperation/getOperationTypes').then(({data}) => {
          if (data && data instanceof Array) {
            this.operationOrderList = data;
            data.forEach((item, index) => {
              this.optIdToKey[item.dbo_id] = item.dbo_key
            })
          }
        });
        $axios.get('/dbOperation/getAlldbNames').then(({data}) => {
          if (data && data instanceof Array) {
            this.dbNameList = data;
          }
        })
      },
      // 获取初始化数据
      initFreshData() {
        // 获取数据库名/操作类型下拉选项
        this.getDbNameOperationOrder()
        // 获取策略名并开始默认查询
        this.getPolicyLists().then((data) => {
          this.ajaxObj.params.condition = Object.assign({}, this.searchForm, {
            start_time: new Date(this.searchForm.start_time).getTime() / 1000,
            end_time: Math.ceil(new Date(this.searchForm.end_time).getTime() / 1000)
          })
          this.startAjaxFlag = true
        })
      },
      // 查看
      checkPolicy(row) {
        this.checkPolicyDialog = true
        this.condition = {
          policy_eid: row.policy_eid,
          start_time: this.searchForm.start_time,
          end_time: this.searchForm.end_time
        }
      }
    },
    created() {
      // 获取初始化数据
      this.initFreshData()
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #policyAudit
    .s-search-group-wrapper
      padding-bottom 10px
</style>
