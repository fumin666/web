<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置
 -->
<template>
  <section class="safety-bulletin-type-set">
    <div class="btn-box">
      <s-button icon="plus" @click="">通报下发</s-button>
      <s-button icon="batch-del" @click="">批量删除</s-button>
      <s-input placeholder="请输入搜索内容" v-model="searchKey" class="real-search-input" icon="magnifier" @input="searchHandle"></s-input>
    </div>

    <RealPageTable :ajax-obj="ajaxObj"
                   :showHeaderCheckbox="false"
                   @selection-change="selectionChange">
      <s-table-column type="selection" width="45" :reserve-selection="true">
      </s-table-column>
      <s-table-column prop="userRealName" label="通报ID" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="userLoginName"
                      label="通报主题"
                      show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="是否周期任务" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="开始时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="结束时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="周期" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="下发方式" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="状态" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="authView(scope.row)"></i>
          <i class="iconfont icon-edit" title="查看任务执行历史记录" @click="authEdit(scope.row)"></i>
          <i class="iconfont icon-edit" title="编辑" @click="authEdit(scope.row)"></i>
          <i class="iconfont icon-edit" title="查看最近一次任务执行结果" @click="authEdit(scope.row)"></i>
          <i class="iconfont icon-delete" title="删除" @click="authDelete(scope.row)"></i>
        </template>
      </s-table-column>
    </RealPageTable>
  </section>
</template>

<script>

  // import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    components: {
      RealPageTable
    },
    data() {
      return {
        ajaxObj: {
          type: 'post',
          url: '/operationAuth/getUserForOperation',
          checkedUuidArr: [], // 初始要回显选中的行
          params: {
            currentPage: 1,
            pageSize: 10,
            condition: {
              content: '',
              authUuid: '',
              tempUuid: ''
            }
          }
        },
        filters: [
          {text: '是', value: '1'},
          {text: '否', value: '0'}
        ]
      }
    },
    props: {
    },
    watch: {
    },
    mounted() {
      this.$nextTick(() => {
        this.getList();
      })
    },
    methods: {
      getList() {
        let params = {
          content: this.searchKey,
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        }
        this.ajaxObj.params.condition = params;
        this.ajaxObj.checkedUuidArr = this.selections;
      },
      selectionChange(val) {
        console.log(val);
      },
      filterTag(value, row) {
        return row.levelStr === value
      }
    }
  }
</script>

<style lang="stylus">
  .safety-bulletin-type-set
    margin 20px 0
    .btn-box
      margin-bottom 10px
</style>
