<template>
  <section class="logSqlDetail">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-tab @on-click="showTab">
        <s-tab-pane label="基本信息">
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">数据库名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.dbi_name"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">数据库IP：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.dbi_ip"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">客户端IP：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.client_ip"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">客户端MAC：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.client_mac"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作类型：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.opt_name"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">数据库登录名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.account_name"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">执行时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.start_time"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">结果行数：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.result_num"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作系统用户名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.host_account_name"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">结束时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.end_time"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">影响行数：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.affect_rows"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作系统资产名：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.host_name"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">耗时(微秒)：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.exec_duration"></div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">返回长度：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light" v-html="sql.dbSqlModel.return_data_len"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">执行结果：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-if="sql.dbSqlModel.is_successful">成功</div>
              <div class="grid-content bg-purple-light" v-else>失败</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">操作描述：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-html="sql.opt_desc"></div>
            </s-col>
          </s-row>
        </s-tab-pane>
        <s-tab-pane label="SQL详情" :show1="show1">
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">SQL语句：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-html="sql.sql_content"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">SQL命令：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-html="sql.sql_command"></div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">绑定变量：</div>
            </s-col>
            <s-col :span="19">
              <div class="grid-content bg-purple-light" v-html="sql.bind_param"></div>
            </s-col>
          </s-row>
        </s-tab-pane>
        <s-tab-pane label="结果集" v-if="showResultSet" :show2="show2">
          <s-table-page
            :data="groups.datas"
            :header-search="{show: false}"
            style="width:100%">
            <s-table-column show-overflow-tooltip v-for="(item) in groups.fields" :label="item" :key="item" :prop="item"></s-table-column>
          </s-table-page>
        </s-tab-pane>
      </s-tab>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'

  export default {
    components: {
    },
    data() {
      return {
        policyLists: [],
        groups: {
          datas: [],
          fields: []
        },
        show0: false,
        show1: false,
        show2: false
      }
    },
    props: ['sql', 'showResultSet'],
    methods: {
      showTab(val) {
        this.$emit('setSqlList', val);
      }
    },
    mounted() {
    }
  }
</script>
