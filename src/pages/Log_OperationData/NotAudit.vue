<template>
  <section class="notAudit content">
    <s-form :inline="true" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="操作类型：">
          <s-select v-model="operationCateValue">
            <s-option v-for="item in operationCate" :label="item.name" :value="item.id" :key="item.id"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-select v-model="operationsValue">
            <s-option v-for="item in operations" :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key" :value="item.dbo_id" :key="item.dbo_id"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="表名：" style="margin-left:100px">
          <s-input v-model="tables"></s-input>
        </s-form-item>
        <s-form-item label="精确匹配：" style="margin-right:100px">
          <s-radio-group v-model="tables_match">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-form-item>
          <s-form>
            <s-form-item label="字段：">
              <s-input v-model="fields"></s-input>
            </s-form-item>
            <s-form-item label="精确匹配：" style="margin-right:100px">
              <s-radio-group v-model="fields_match">
                <s-radio :label="1">是</s-radio>
                <s-radio :label="0">否</s-radio>
              </s-radio-group>
            </s-form-item>
          </s-form>
        </s-form-item>
        <s-form-item>
          <s-form :inline="true">
            <s-form-item label="模式包含：">
              <s-input v-model="pattern_str" style="width: 400px"></s-input>
            </s-form-item>
            <s-form-item label="正则匹配：" style="margin-right:100px">
              <s-radio-group v-model="pattern_str_match">
                <s-radio :label="1">是</s-radio>
                <s-radio :label="0">否</s-radio>
              </s-radio-group>
            </s-form-item>
          </s-form>
        </s-form-item>
        <s-form-item label="最后访问时间：">
          <s-date-picker
            v-model="start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            :editable="editable"
            @change="getStartTime">
          </s-date-picker>
          <span>到</span>
          <s-date-picker
            v-model="end_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            :editable="editable"
            @change="getEndTime">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag" ref="infiniteTable">
      <s-table-column label="操作指令" prop="dbo_type" show-overflow-tooltip></s-table-column>
      <s-table-column label="表" prop="tables" show-overflow-tooltip></s-table-column>
      <s-table-column label="字段" prop="fields" show-overflow-tooltip></s-table-column>
      <s-table-column label="SQL模式" prop="pattern_str" show-overflow-tooltip></s-table-column>
      <s-table-column label="是否启用" show-overflow-tooltip>
        <template slot-scope="scope">
          <s-switch v-model="scope.row.is_active" size="small" @change="handleSwitchChange(scope.row)" :active-value="true"
                    :inactive-value="false" :disabled="canAddIgnore"></s-switch>
        </template>
      </s-table-column>
      <s-table-column label="停止时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.off_time === '1970-01-01 08:00:00'">--</div>
          <div v-else>{{scope.row.off_time}}</div>
        </template>
      </s-table-column>
      <s-table-column label="免审计条数(累计)" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="checkDetail(scope.row)" class="score-td">{{scope.row.ignore_count}}</span>
        </template>
      </s-table-column>
      <s-table-column label="来源" prop="client_ip" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.is_default === true">自动学习</div>
          <div v-else>SQL模式审计</div>
        </template>
      </s-table-column>
    </page-infinite-table>
    <s-dialog
      v-model="bloomDetail"
      v-if="bloomDetail"
      title="详细信息"
      key="bloomDetail"
      width="1150px">
      <not-audit-detail ref="not-audit-detail" :auditMessage="auditMessage"></not-audit-detail>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import NotAuditDetail from './NotAuditDetail'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  export default {
    components: {

      pageInfiniteTable,
      NotAuditDetail
      // searchBox
    },
    data() {
      return {
        operationCateValue: '',
        operationCate: [],
        operationsValue: '',
        operations: [],
        tables: '',
        fields: '',
        fields_match: 0,
        tables_match: 0,
        pattern_str: '',
        pattern_str_match: 0,
        start_time: '',
        end_time: '',
        OperationLists: [],
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbSqlModel/list',
          params: {
            condition: {}
          }
        },
        isIgnore: 1,
        editable: false,  // 不可编辑时间
        bloomDetail: false, // 点击累计数详情弹框
        auditMessage: {}, // 点击免审计条数传的参数
        canAddIgnore: false  // 只能免审计的switch是否禁灰
      }
    },
    methods: {
      getOperationCate() {
        let vm = this;
        $axios.get('/dbauditOperationCate/list').then((res) => {
          if (res.data instanceof Array) {
            vm.operationCate = res.data;
          }
        });
      },
      search() {
        let vm = this;
        let param = {
          isIgnore: vm.isIgnore,
          topsql: 0,
          newsql: 0,
          dbo_id: Number(vm.operationsValue === '' ? -1 : vm.operationsValue),
          end_time: vm.end_time,
          fields: vm.fields,
          fields_match: Number(vm.fields_match),
          pattern_str: vm.pattern_str,
          pattern_str_match: Number(vm.pattern_str_match),
          start_time: vm.start_time,
          tables: vm.tables,
          tables_match: Number(vm.tables_match)
        };
        vm.axiosHistoryObj.params.condition = Object.assign({}, param);
        vm.getHistoryFlag = true;
        // 判断智能免审计是否可开启
        $axios.get('/sysIgnoreAudit/isIgnore').then((res) => {
          vm.canAddIgnore = res.data;
        });
      },
      // 展示详情页
      checkDetail(row) {
        let vm = this;
        vm.bloomDetail = true;
        vm.auditMessage = {
          pattern_md5: row.pattern_md5
        }
      },
      // 是否启用的提示
      handleSwitchChange(row) {
        let self = this
        this.$nextTick(function () {
          let text = '';
          let activeText = '';
          if (row.is_active) {
            text = '启用'
            activeText = 'on'
          } else {
            text = '关闭'
            activeText = 'off'
          }
          self.$confirm('确定' + text + '?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post(`/sysIgnoreAudit/switchIgnore/${row.pattern_md5}/${activeText}`).then(function (res) {
              // console.log(res.data)
              if (res.data) {
                self.$message({message: text + '成功!', type: 'success'})
              } else {
                self.$message({message: text + '失败!', type: 'error'})
                self.$set(row, 'is_active', !row.is_active)
                self.data = Object.assign([], self.data)
              }
            })
          }).catch(function () {
            // console.log(row.is_active)
            // 若取消，则讲switch状态置反，不需要重新请求
            self.$set(row, 'is_active', !row.is_active)
            self.data = Object.assign([], self.data)
          });
        })
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.end_time.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.start_time = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.start_time = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.start_time.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.end_time = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.end_time = val;
        }
      }
    },
    watch: {
      operationCateValue: {
        handler: function() {
          var vm = this;
          vm.operationsValue = '';
          $axios.get('/dbauditOperation/getOperations/' + vm.operationCateValue).then((res) => {
            vm.operations = res.data;
          });
        }
      }
    },
    created() {
      this.search();
      this.getOperationCate();
    }
  }
</script>
