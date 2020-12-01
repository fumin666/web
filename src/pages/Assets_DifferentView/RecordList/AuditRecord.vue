/**
* Created by liushupeng on 2019/2/20.资产管理-》系统配置-》资产详情//Q4高级搜索优化
*/
<template>
<!--审计记录（数据库资产）-->
<div>
    <s-row>
        <s-card class="box-card different-view-card">
            <div slot="header" class="clearfix">
                <span class="card-title">
            审计记录
          </span>
            </div>
        </s-card>
        <s-row>
          <s-form :inline="true" class="search_form" label-width="100px">
            <div>
              <s-form-item label="数据库名称:">
                  <s-select v-model="dbval" style="width:185px;">
                      <s-option v-for="item in selectDbName" :label="item.dbi_name" :value="item.dbi_uuid" :key="item.dbi_uuid"></s-option>
                  </s-select>
              </s-form-item>
              <s-form-item label="客户端IP:" prop="">
                  <s-input @keyup.enter.native="search" v-model="clientIp" style="width:185px;"></s-input>
              </s-form-item>
              <s-form-item label="数据库登录名:" prop="">
                  <s-input @keyup.enter.native="search" v-model="accountName" style="width:185px;"></s-input>
              </s-form-item>
              <s-form-item label="操作指令:" prop="">
                  <s-select v-model="statusValue" style="width:185px;" filterable clearable>
                      <s-option v-for="item in selectOrder" :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key" :value="item.dbo_id" :key="item.dbo_id"></s-option>
                  </s-select>
              </s-form-item>
              <s-form-item label="开始时间:">
                  <s-date-picker style="width:185px;" v-model="startTimeValue" type="datetime" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getStartTime">
                  </s-date-picker>
                  <span> ~ </span>
                  <s-date-picker style="width:185px;" v-model="endTimeValue" type="datetime" :editable="editable" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getEndTime">
                  </s-date-picker>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" @click="search">查询</s-button>
            </div>
          </s-form>
        </s-row>
    </s-row>

    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" ref="multipleTable" key="multipleTable">
        <s-table-column label="数据库名称" prop="dbi_name" show-overflow-tooltip></s-table-column>
        <s-table-column prop="client_ip" label="客户端IP"></s-table-column>
        <s-table-column label="数据库登录名" show-overflow-tooltip>
            <template slot-scope="scope">
                <div v-if="scope.row.account_name === ''">已连接用户</div>
                <div v-else> {{scope.row.account_name}} </div>
            </template>
        </s-table-column>
        <s-table-column label="操作指令" prop="dbo_name" show-overflow-tooltip></s-table-column>
        <s-table-column label="开始时间" prop="start_time"></s-table-column>
        <s-table-column label="执行状态">
            <template slot-scope="scope">
                <div v-if="scope.row.is_successful">成功</div>
                <div v-else>失败</div>
            </template>
        </s-table-column>
        <s-table-column label="操作">
            <template slot-scope="scope">
                <i class="iconfont icon-eye" title="查看" @click="checkHandle(scope.$index, scope.row)"></i>
            </template>
        </s-table-column>
    </page-infinite-table>
    <s-dialog v-model="bloomSql" v-if="bloomSql" title="详细信息" key="bloomSql" width="1000px">
        <sql-detail ref="sql-detail" :sql="sqlMsg" @setSqlList="getSqlList"></sql-detail>
    </s-dialog>
</div>
</template>

<script>
// import searchBox from '@/components/tableCom/src/SearchBox'
import $axios from 'sunflower-ajax'
import SqlDetail from '@/pages/Log_OperationData/SqlDetail'

import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
import Bus from '@/plugins/eventBus'
export default {
    components: {

        // searchBox,
        SqlDetail,
        pageInfiniteTable
    },
    data() {
        return {
            sss: '',
            assetUuid: this.$route.params.assetUuid,
            dbiUuid: '',
            dbval: '',
            dbname: '',
            selectDbName: [],
            dbIp: '',
            clientIp: '',
            accountName: '',
            statusValue: '', // 操作指令
            startTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
            endTimeValue: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
            OperationLists: [],
            bloomSql: false,
            sqlMsg: {},
            session_index: '',
            selectOrder: [],
            editable: false,
            getHistoryFlag: false, // 控制加载
            axiosHistoryObj: {
                type: 'post',
                url: '/dbOperation/list',
                params: {
                    condition: {}
                }
            },
            row: {
                dbs_id: '',
                sql_id: ''
            }
        }
    },
    created() {
        this.getSelect();
    },
    props: {
        uuid: {
            type: String,
            default: ''
        }
    },
    methods: {
        checkHandle(index, row) {
            let vm = this;
            vm.row.dbs_id = row.dbs_id;
            vm.row.sql_id = row.sql_id;
            $axios.get('/dbOperation/view/' + row.dbs_id + '/' + row.sql_id).then((res) => {
                vm.sqlMsg = res.data;
                vm.session_index = res.data.session_index;
                vm.bloomSql = true;
            });
        },
        getSqlList(val) {
            if (val === 2) {
                $axios.get(`/dbSession/sqlResult/${this.row.sql_id}/${this.session_index}`).then((res) => {
                    if (res.data.datas !== null) {
                        this.$refs['sql-detail'].groups = res.data
                    }
                });
            }
        },
        // selectChangeDbName() {
        //     let arr = this.selectDbName;
        //     if (arr.length) {
        //         arr.forEach(function(obj) {
        //             if (this.dbval === obj.dbi_uuid) {
        //                 this.dbname = obj.dbi_name;
        //             }
        //         })
        //     }
        // },
        // 获取搜索框数据库名称和操作指令
        getSelect() {
          var vm = this;
          $axios.get('/dbOperation/getOperationTypes').then((res) => {
            if (res.data instanceof Array) {
              vm.selectOrder = res.data;
            }
          });
          $axios.get('/dbOperation/getAlldbNames').then((res) => {
            if (res.data instanceof Array) {
              let selectDbNameAsset = [];
              res.data.forEach((v, i) => { // 过滤请求的数据
                if (v.asset_uuid === vm.assetUuid) {
                  selectDbNameAsset.push(v);
                }
                vm.selectDbName = selectDbNameAsset;
              });
              if (vm.selectDbName.length) {
                  vm.dbval = vm.selectDbName[0].dbi_uuid;
              }
              vm.search();
            }
          });
        },
        // 查询
        search() {
            var vm = this;
            if (vm.dbval) {
                vm.axiosHistoryObj.params.condition = Object.assign({}, {
                    start_time: vm.startTimeValue,
                    end_time: vm.endTimeValue,
                    account_name: vm.accountName, // 数据库登录名
                    client_ip: vm.clientIp, // 客戶端Ip
                    dbi_uuid: vm.dbval, // 数据库登录名
                    dbi_ip: vm.dbIp, // 数据库ip
                    dbo_id: this.statusValue === '' ? -1 : vm.statusValue // 操作指令
                });
                Bus.$emit('setDbiUuid', vm.dbval);
                vm.getHistoryFlag = true;
            }
        },
        getStartTime(val) {
            let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
            let endValue = new Date(Date.parse(this.endTimeValue.replace(/-/g, '/'))).getTime();
            if (beginVal >= endValue) {
                this.startTimeValue = '';
                this.$message('开始日期不能大于等于结束日期！');
                return false;
            } else {
                this.startTimeValue = val;
            }
        },
        getEndTime(val) {
            let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
            let beginValue = new Date(Date.parse(this.startTimeValue.replace(/-/g, '/'))).getTime();
            if (endVal <= beginValue) {
                this.endTimeValue = '';
                this.$message('开始日期不能大于等于结束日期！');
                return false;
            } else {
                this.endTimeValue = val;
            }
        }
    }
}
</script>

<style>
</style>
