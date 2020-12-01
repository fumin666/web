<template>
  <section class="sqlModelAudit content">
    <s-form :inline="true" class="search_form" label-width="120px" style="margin: 10px 0;">
      <div>
        <s-form-item label="操作类型：">
          <s-select v-model="operationCateValue">
            <s-option v-for="item in operationCate" :label="item.name" :value="item.id" :key="item.id"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item>
          <s-select v-model="operationsValue">
            <s-option v-for="item in operations"
                      :label="item.dbo_expand ? item.dbo_key + ' ' + item.dbo_expand : item.dbo_key" :value="item.dbo_id"
                      :key="item.dbo_id"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="表名：">
          <s-input v-model="tables"></s-input>
        </s-form-item>
        <s-form-item label="精确匹配：">
          <s-radio-group v-model="tables_match">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-form-item label="字段：">
          <s-input v-model="fields"></s-input>
        </s-form-item>
        <s-form-item label="精确匹配：" label-width="80px">
          <s-radio-group v-model="fields_match">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
        </s-form-item>
        <s-form-item label="模式包含：">
          <s-input v-model="pattern_str"></s-input>
        </s-form-item>
        <s-form-item label="正则匹配：">
          <s-radio-group v-model="pattern_str_match">
            <s-radio :label="1">是</s-radio>
            <s-radio :label="0">否</s-radio>
          </s-radio-group>
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
          <span> 到 </span>
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
    <s-form :inline="true">
      <s-form-item>
        <s-checkbox v-model="check">隐藏表和内容为空的SQL数据</s-checkbox>
      </s-form-item>
      <s-form-item>
        <s-button :class="{ activeClass : isActiveClass.isActiveClass1 }" title="基本SQL模式" @click="search('1')">基本SQL模式
        </s-button>
        <s-button :class="{ activeClass : isActiveClass.isActiveClass2 }" title="TOPSQL模式" @click="search('2')">
          TOPSQL模式
        </s-button>
        <s-button :class="{ activeClass : isActiveClass.isActiveClass3 }" title="新型SQL模式" @click="search('3')">新型SQL模式
        </s-button>
      </s-form-item>
    </s-form>
    <page-infinite-table loading-text="正在加载中" :ajax-obj="axiosHistoryObj" :startAjax="getHistoryFlag"
                         ref="infiniteTable">
      <s-table-column label="操作指令" prop="dbo_type" width="150px" show-overflow-tooltip></s-table-column>
      <s-table-column label="表" prop="tables" width="200px" show-overflow-tooltip></s-table-column>
      <s-table-column label="字段" prop="fields" width="300px" show-overflow-tooltip></s-table-column>
      <s-table-column label="SQL模式" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--给右键传参数通过open，在context-menu中
          @ctx-open="onCtxOpen，
          @ctx-cancel="resetCtxLocals"，
          @ctx-close="onCtxClose"
          这三个方法都可以接收到-->
          <div class="score-td" @click="patternDetail(scope.row.pattern_md5)"
               @contextmenu.prevent="$refs.ctxMenu.open($event, {pattern_md5: scope.row.pattern_md5, sqlDetail: scope.row.pattern_str})">
            {{scope.row.pattern_str}}
          </div>
        </template>
      </s-table-column>
      <s-table-column label="最后访问时间" prop="update_time" width="200px"></s-table-column>
    </page-infinite-table>
    <!--右键-->
    <context-menu id="context-menu" ref="ctxMenu" @ctx-open="onCtxOpen">
      <li @click="showSqlDetail()">查看详情</li>
      <li @click="notAuditHandle()">添加为智能免审计</li>
    </context-menu>
    <!--显示sql详情的dialog-->
    <s-dialog
      v-model="checkSql"
      v-if="checkSql"
      title="查看详情"
      key="checkSql">
      <s-scrollbar wrap-style="max-height: 400px;">
        <div v-html="sqlDetail"></div>
      </s-scrollbar>
    </s-dialog>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'

  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  import contextMenu from 'vue-context-menu'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  export default {
    components: {

      pageInfiniteTable,
      contextMenu
      // searchBox
    },
    data() {
      return {
        showSearch: false,
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
        start_time: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 00:00:00`,
        end_time: `${new Date().getFullYear()}-${1 + new Date().getMonth()}-${new Date().getDate()} 23:59:59`,
        OperationLists: [],
        getHistoryFlag: false,
        axiosHistoryObj: {
          type: 'post',
          url: '/dbSqlModel/list',
          params: {
            condition: {}
          }
        },
        check: true,
        toggle: 1,
        isHidden: 1,
        isActiveClass: {
          isActiveClass1: true,
          isActiveClass2: false,
          isActiveClass3: false
        },
        editable: false,
        pattern_md5: '',   // 右键需要传的参数
        sqlDetail: '',    // 右键查看详情内容
        checkSql: false
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
      // 点击sql模式打开新的标签页并定位到操作审计上,将点击的哪一行的数据放到url中
      patternDetail(val) {
        const startTime = this.start_time ? Date.parse(new Date(Date.parse(this.start_time.replace(/-/g, '/')))) : 0;
        const endTime = this.end_time ? Date.parse(new Date(Date.parse(this.end_time.replace(/-/g, '/')))) : 0;
        // let url = window.location.href;
        // if (window.location.href.indexOf('?') > -1) { // 判断url是否有参数
        //   url = window.location.href.split('?')[0]
        // }
        this.$emit('formsql', {pattern_md5: val, start: startTime / 1000, end: endTime / 1000})
        // window.open(`${url}?pattern_md5=${val}&start=${startTime / 1000}&end=${endTime / 1000}`);
      },
      search(val = 1) {
        let vm = this;
        let isActiveClass = {
          isActiveClass1: false,
          isActiveClass2: false,
          isActiveClass3: false
        };
        vm.isActiveClass = isActiveClass;
        vm.isActiveClass['isActiveClass' + val || 1] = true;
        let param = {
          ishidden: vm.isHidden,
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
        vm.toggle = val;
        switch (val) {
          case '2':
            param.topsql = Number(1);
            break;
          case '3':
            param.newsql = Number(1);
            break;
        }
        ;
        vm.axiosHistoryObj.params.condition = Object.assign({}, param);
        vm.getHistoryFlag = true;
      },
      getStartTime(val) {
        let beginVal = val ? new Date(Date.parse(val.replace(/-/g, '/'))).getTime() : 0;
        let endValue = this.end_time ? new Date(Date.parse(this.end_time.replace(/-/g, '/'))).getTime() : 0;
        if (beginVal >= endValue) {
          this.start_time = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.start_time = val;
        }
      },
      getEndTime(val) {
        let endVal = val ? new Date(Date.parse(val.replace(/-/g, '/'))).getTime() : 0;
        let beginValue = this.start_time ? new Date(Date.parse(this.start_time.replace(/-/g, '/'))).getTime() : 0;
        if (endVal <= beginValue) {
          this.end_time = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.end_time = val;
        }
      },
      // 右键
      notAuditHandle() {
        let vm = this;
        vm.$confirm('确定添加？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post(`/sysIgnoreAudit/addIgnore/${vm.pattern_md5}`).then(function (res) {
            // console.log(res.data)
            if (res.data.result) {
              vm.$message({type: 'success', message: '添加成功!'})
            } else {
              vm.$message({type: 'error', message: `${res.data.msg}`})
            }
          })
        }).catch(() => {});
      },
      showSqlDetail () {
        this.checkSql = true
      },
      onCtxOpen(pattern) {
        // console.log('open', pattern)
        this.pattern_md5 = pattern.pattern_md5
        this.sqlDetail = pattern.sqlDetail
      }
    },
    watch: {
      operationCateValue: {
        handler: function () {
          var vm = this;
          vm.operationsValue = '';
          $axios.get('/dbauditOperation/getOperations/' + vm.operationCateValue).then((res) => {
            vm.operations = res.data;
          });
        }
      },
      check: function () {
        let vm = this;
        if (vm.check === true) {
          vm.isHidden = 1;
          this.search(vm.toggle)
        } else {
          vm.isHidden = 0;
          this.search(vm.toggle);
        }
      }
    },
    created() {
      this.search('1');
      this.getOperationCate();
    }
  }
</script>
