/**
* Created by liushupeng on 2019/2/21.//Q4高级搜索优化
*/
<template>
  <!--脚本运维记录-->
  <div>
    <s-row>
      <s-card class="box-card different-view-card">
        <div slot="header" class="clearfix">
          <span class="card-title">
            脚本运维记录
          </span>
        </div>
      </s-card>
      <s-row>
        <s-form :inline="true" :model="searchForm" class="search_form" label-width="65px">
          <div>
            <s-form-item label="脚本名称:" prop="">
              <s-input @keyup.enter.native="search" v-model="searchForm.scriptName" style="width:185px;"></s-input>
            </s-form-item>
            <s-form-item label="执行结果:" prop="result">
              <s-input @keyup.enter.native="search" v-model="searchForm.result" style="width:185px;"></s-input>
            </s-form-item>
            <s-form-item label="执行者:" prop="excuteUserName">
              <s-input @keyup.enter.native="search" v-model="searchForm.excuteUserName" style="width:185px;"></s-input>
            </s-form-item>
            <s-form-item label="执行时间:">
              <s-date-picker
                type="datetime"
                v-model="startTime"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="disableAfterToday1"
                style="width:185px;"
              >
              </s-date-picker>
              ~
              <s-date-picker
                type="datetime"
                v-model="endTime"
                :editable="false"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                :picker-options="disableAfterToday2"
                style="width:185px;"
              >
              </s-date-picker>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" @click="search">查询</s-button>
          </div>
        </s-form>
      </s-row>
    </s-row>
    <s-table
      :data="dataList">
      <s-table-column prop="scriptName" label="脚本名称" ></s-table-column>
      <s-table-column prop="startTime" label="执行时间" ></s-table-column>
      <s-table-column prop="result" label="执行结果" >
        <template slot-scope="scope">
          {{scope.row.result | filterResult}}
        </template>
      </s-table-column>
      <s-table-column prop="excuteUserName" label="执行者" ></s-table-column>
    </s-table>
    <s-pagination
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </s-pagination>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  // import searchBox from '@/components/tableCom/src/SearchBox'
  export default {
    name: 'ScriptOperationRecord',
    data() {
      return {
        searchForm: {
          startTime: '',
          endTime: '',
          scriptName: '',
          result: '',
          excuteUserName: ''
        },
        startTime: '',
        endTime: '',
        dataList: [],
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        },
        currentPage: 1,
        pageSize: 10,
        total: 0
      }
    },
    created() {
      let param = {
        assetUuid: this.uuid,
        startTime: '',
        endTime: '',
        scriptName: '',
        result: '',
        excuteUserName: ''
      }
      this.getData(param, this.currentPage, this.pageSize)
    },
    props: {
      uuid: {
        type: String,
        default: ''
      }
    },
    filters: {
      filterResult(val) {
        let result = val
        if (result && result.indexOf('</br>') !== -1) {
          result = val.replace(/<[^>]+>/g, '');
        }
        return result
      }
    },
    methods: {
      getData(msg, currentPage, pageSize) {
        $axios.post('/automateLog/searchScriptTaskLogList', {
          condition: msg,
          currentPage: currentPage,
          pageSize: pageSize
        }).then(res => {
          this.dataList = res.data.pageList;
          this.total = res.data.totalCount
        })
      },
      // 分页
      handleSizeChange (pageSize) {
        let options = Object.assign({}, {assetUuid: this.uuid}, this.searchForm)
        this.pageSize = pageSize
        this.getData(options, this.currentPage, this.pageSize)
      },
      handleCurrentChange (currentPage) {
        let options = Object.assign({}, {assetUuid: this.uuid}, this.searchForm)
        this.currentPage = currentPage
        this.getData(options, this.currentPage, this.pageSize)
      },
      search() {
        let params = {
          startTime: this.startTime !== null ? parseInt(new Date(this.startTime).getTime() / 1000) : null,
          endTime: this.endTime !== null ? parseInt(new Date(this.endTime).getTime() / 1000) : null
        }
        if (params.startTime !== null && params.endTime !== null) {
          if (params.startTime >= params.endTime) {
            params.startTime = null;
            this.$message('开始日期不能大于等于结束日期');
            return;
          }
        }
        if ((params.startTime === null && params.endTime !== null)) {
          this.$message('请选择正确的开始日期和结束日期');
          return;
        }
        if ((params.startTime !== null && params.endTime === null)) {
          this.$message('请选择正确的开始日期和结束日期');
          return;
        }
        this.searchForm.startTime = params.startTime;
        this.searchForm.endTime = params.endTime;
        let options = Object.assign({assetUuid: this.uuid}, this.searchForm);
        this.getData(options, this.currentPage, this.pageSize)
      }
    },
    components: {
      // sPageInfiniteTable,
      // searchBox
    }
  }
</script>

<style>
</style>
