<!--
 * @Author: songyf
 * @Date: 2020-2-11
 * @LastEditors: songyf
 * @Description: 安全通报-安全通报任务
 -->
<template>
  <section class="safety-bulletin-type-set">
    <div class="btn-box">
      <s-button icon="plus" @click="">添加</s-button>
      <s-button icon="batch-del" @click="">批量删除</s-button>
      <s-input placeholder="请输入通报类型名称、备注进行查询" v-model="searchKey" class="real-search-input" icon="magnifier" @input="searchHandle"></s-input>
    </div>

    <RealPageTable :ajax-obj="ajaxObj"
                   :showHeaderCheckbox="false"
                   @selection-change="selectionChange">
      <s-table-column type="selection" width="45" :reserve-selection="true">
      </s-table-column>
      <s-table-column prop="userRealName" label="通报类型名称" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="userLoginName" label="是否需要走流程" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="departName" label="备注" show-overflow-tooltip>
      </s-table-column>
      <s-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" title="查看" @click="authView(scope.row)"></i>
          <i class="iconfont icon-edit" title="编辑" @click="authEdit(scope.row)"></i>
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
        }
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
