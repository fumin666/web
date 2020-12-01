<template>
  <div class="pollingResult">
    <s-row class="searchBtChunk">
      <s-col class="left">
        <s-button icon="batch-del" @click="del">批量删除</s-button>
      </s-col>
      <s-col class="right">
        <s-button icon="inquire" @click="searchChunkFlag=!searchChunkFlag"></s-button>
      </s-col>
    </s-row>
    <s-row class="searchFormChunk" v-show="searchChunkFlag">
      <s-form :inline="true" :model="searchForm" class="demo-form-inline">
        <s-form-item label="IP地址">
          <s-input @keyup.enter.native="search" v-model="searchForm.ipAddress"></s-input>
        </s-form-item>
        <s-form-item label="资产名称">
          <s-input @keyup.enter.native="search" v-model="searchForm.assetName"></s-input>
        </s-form-item>
        <s-form-item label="资产类别">
          <s-select v-model="searchForm.assetType" clearable>
            <s-option label="Linux" value="Linux"></s-option>
            <s-option label="Solaris" value="Solaris"></s-option>
            <s-option label="Aix" value="Aix"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="执行时间">
          <date-range v-model="searchForm.excuteTime" :value-format-flag="true"></date-range>
        </s-form-item>
        <s-form-item label="巡检名称">
          <s-input @keyup.enter.native="search" v-model="searchForm.inspectName"></s-input>
        </s-form-item>
        <s-form-item class="right">
          <s-button @click="search">查询</s-button>
        </s-form-item>
      </s-form>
    </s-row>
    <page-infinite-table loading-text="正在加载中" ref="infiniteTable" border :start-ajax="startAjax"
           :ajax-obj="axiosResultObj" @selection-change="selectionChange">
      <s-table-column type="selection" width="45" align="center"></s-table-column>
      <s-table-column label="IP地址" prop="ipAddr" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产名称" prop="assetName" show-overflow-tooltip></s-table-column>
      <s-table-column label="资产类别" prop="assetType"></s-table-column>
      <s-table-column label="执行时间" prop="excutetime" show-overflow-tooltip></s-table-column>
      <s-table-column label="巡检名称" prop="inspectName"></s-table-column>
      <s-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="rowSee(scope.row)"></i>
          <i class="iconfont icon-delete" @click="rowDel(scope.row)"></i>
        </template>
      </s-table-column>
    </page-infinite-table>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  import DateRange from '@/components/tableCom/src/DateRange';
  // import InputTree from '@/components/inputTree/InputTree';
  import pageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'

  //  import {cloneDeep} from 'lodash';

  export default {
    data: function () {
      return {
        searchChunkFlag: false,
        searchForm: {
          ipAddress: '',
          assetName: '',
          assetType: '',
          excuteTime: [],
          inspectName: ''
        },
        startAjax: false,
        axiosResultObj: {
          type: 'post',
          url: '/assetInspectHistory/list',
          params: {
            condition: {}
          }
        },
        selections: [],
        criteria: { // 根据分页、查询条件查询列表的参数
          condition: {},
          currentPage: 1,
          orderByClause: '',
          pageSize: 20,
          totalCount: 0
        }
      }
    },
    created() {
      if (this.$route.query && this.$route.query.ip) { // 从资产面板跳转过来
        this.searchForm = Object.assign(this.searchForm, {
          ipAddress: this.$route.query.ip
        });
        this.axiosResultObj.params.condition = Object.assign(this.axiosResultObj.params.condition, this.searchForm);
        this.startAjax = true;
      }
      this.axiosResultObj.params.condition = Object.assign(this.axiosResultObj.params.condition, this.searchForm);
      this.startAjax = true;
    },
    methods: {
      selectionChange(selections) {
        this.selections = selections;
      },
      search () {
        let obj = {};
        for (let i in this.searchForm) {
          if (i !== 'excuteTime') {
            obj[i] = this.searchForm[i];
          } else {
            obj.excuteTime_start = this.searchForm[i][0];
            obj.excuteTime_end = this.searchForm[i][1];
          }
        }
        this.axiosResultObj.params.condition = obj;
        this.startAjax = true;
      },
      del() {
        if (this.selections.length <= 0) {
          this.$message({message: '请先选择巡检结果', type: 'warning'});
          return;
        }
        this.axiosDel(this.selections);
      },
      rowSee(row) {
        this.$router.push(this.$route.path + '/pollingResultDetail/' + row.uuid)
      },
      rowDel(row) {
        this.axiosDel([row]);
      },
      axiosDel(arr) {
        this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.post('/assetInspectHistory/delete', arr.map(item => item.uuid)).then(({data}) => {
            if (data === true) {
              this.$message({message: '删除成功', type: 'success'});
              this.$refs.infiniteTable.reInfinite();
            } else {
              this.$message({message: '删除失败', type: 'error'});
            }
          })
        }).catch(() => {});
      }
    },
    components: {
      // SearchBox,
      DateRange,
      // InputTree,
      pageInfiniteTable
    }
  }
</script>

<style lang="stylus">
 /* .pollingResult
    .searchFormChunk
      padding: 10px 15px 0 15px
      border: solid 3px rgb(29, 37, 51)
      border-radius: 5px
      background: rgb(0, 1, 10)
      box-shadow: 0 0 50px rgba(0, 141, 230, 0.15) inset
      margin-bottom 8px
      .s-form-item
        margin-bottom 20px
      .s-tree
        background: #000008;
        border: 1px solid #000008
    .searchBtChunk
      margin-bottom 8px
    .left
      float: left
    .right
      float: right */
</style>
