<template>
  <section id="dataBaseDetail">
    <s-scrollbar wrap-style="max-height:450px;">
      <s-tab>
        <s-tab-pane
          label="基本信息">
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">数据库名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{rowData.dbi_name || ''}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">数据库IP：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{rowData.dbi_ip || ''}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">客户端IP：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{rowData.client_ip || ''}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">客户端MAC：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{rowData.client_mac || ''}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作类型：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.opt_type_str || ''}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">数据库登录名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{rowData.account_name || ''}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">执行时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{rowData.start_time || ''}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">结果行数：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">
                {{selected_.selected_rows !=='' && selected_.selected_rows !== null && selected_.selected_rows !== undefined ? selected_.selected_rows : ''}}
              </div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作系统用户名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-text="detailData2.host_account_name || ''"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">结束时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{formatDate(detailData.end_time) || ''}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">影响行数：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">
                {{detailData.affect_rows !=='' && detailData.affect_rows !== null && detailData.affect_rows !== undefined ? detailData.affect_rows : ''}}
              </div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作系统资产名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-text="rowData.host_name || ''"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">耗时(微秒)：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.exec_duration || ''}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">返回长度：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">
                {{selected_.selected_size !=='' && selected_.selected_size !== null && selected_.selected_size !== undefined ? selected_.selected_size : ''}}
              </div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">执行结果：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light">{{rowData.is_successful==='true'?'成功':'失败'}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">事件描述：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-text="rowData.alarm_value || ''"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作描述：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-html="sqlDetail.opt_desc || ''"></div>
            </s-col>
          </s-row>
        </s-tab-pane>
        <s-tab-pane
          :vif="rowData.sql_id!=='0000000000000000'"
          label="SQL详情">
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">SQL语句：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-text="sqlDetail.sql_content || ''"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">SQL命令：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-text="sqlDetail.sql_command || ''"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">绑定变量：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light wrap" v-text="sqlDetail.bind_param || ''"></div>
            </s-col>
          </s-row>
        </s-tab-pane>
        <!--<s-tab-pane
          label="结果及审计">
        </s-tab-pane>-->
      </s-tab>
    </s-scrollbar>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        detailData: {},
        selected_: {},
        detailData2: {},
        sqlDetail: {},
        ruleDesc: ''
      }
    },
    props: {
      rowData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
      formatDate(seconds) {
        if (seconds) {
          let date = new Date()
          date.setTime(seconds * 1000)
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
      }
    },
    created() {
      /**
       * 操作系统用户名
       */
      $axios.get(`/dbaIncident/getMongdb/t_data_dbsession/dbs_id/${this.rowData.dbs_id}`).then(res => {
        if (res.data instanceof Array && res.data.length > 0) {
          let resData = res.data[0]
          this.detailData2 = resData
        }
      })
      /**
       * 获取详情信息
       */
      // 如果该事件sql_id不为下值，请求接口获取sql_id !== 0000000000000000时存在的字段值
      if (this.rowData.sql_id !== '0000000000000000') {
        $axios.get(`/dbaIncident/getMongdb/t_data_dbsql/sql_id/${this.rowData.sql_id}`).then(res => {
          if (res.data instanceof Array && res.data.length > 0) {
            let resData = res.data[0]
            this.detailData = resData
            if (this.detailData.hasOwnProperty('opt_type')) {
              $axios.get(`/dbaIncident/getOperationType/${this.detailData.opt_type}`).then(res => {
                let resData = res.data
                if (resData && resData instanceof Array) {
                  this.$set(this.detailData, 'opt_type_str', resData[0].name)
                }
              })
            }
          }
        })
        // 获取结果行数/返回长度
        $axios.get(`/dbaIncident/getMongdb/t_data_alarm_dbsql/alarm_id/${this.rowData.alarm_id}`).then(({data}) => {
          if (data instanceof Array && data.length > 0) {
            this.selected_ = data[0]
          }
        })
        // 事件描述
        /* $axios.get(`/auditPolicyRule/getAuditPolicyByUuid/${this.rowData.policy_uuid}`).then(res => {
         let resData = res.data
         if (resData) {
         this.ruleDesc = resData.ruleDesc
         }
         }) */
        // 操作描述/sql详情
        $axios.get(`/dbaIncident/view/${this.rowData.dbs_id}/${this.rowData.sql_id}`).then(res => {
          let resData = res.data
          if (resData) {
            this.sqlDetail = resData
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #dataBaseDetail
    .footerRow
      margin-top 15px
      text-align rigth
</style>
