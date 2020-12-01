<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:43
 * @LastEditTime: 2019-09-25 18:01:12
 * @LastEditors: Please set LastEditors
 -->
<!--邮件历史查询-->
<template>
  <div>
    <s-form ref="searchBox" :inline="true" :model="searchForm" label-width="80px" class="search_form" style="margin: 10px 0;">
      <div>
        <s-form-item label="工单编号:" prop="orderCode">
          <s-input v-model="searchForm.orderCode"></s-input>
        </s-form-item>
        <s-form-item label="起始时间段:">
          <s-date-picker
            type="datetime"
            v-model="searchForm.startTime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="disableAfterToday1"
            style="width: 40%;"
          >
          </s-date-picker>
          ~
          <s-date-picker
            type="datetime"
            v-model="searchForm.endTime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :picker-options="disableAfterToday2"
            style="width: 40%;"
          >
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" title="查询" @click="search()">查询</s-button>
      </div>
    </s-form>
    <s-page-infinite-table
      ref="infiniteTable"
      :ajax-obj="axiosObj"
      height=550
      :startAjax="getFlag"
      style="width:100%;"
    >
      <s-table-column prop="orderCode" label="工单号"></s-table-column>
      <s-table-column prop="orderTypeName" label="所属流程"></s-table-column>
      <s-table-column prop="orderStatusName" label="流程状态" ></s-table-column>
      <s-table-column prop="recipientName" label="发送对象" ></s-table-column>
      <s-table-column prop="subject" label="邮件标题" ></s-table-column>
      <s-table-column prop="createTime" label="发送时间" ></s-table-column>
      <s-table-column label="发送状态标记" >
        <template slot-scope="scope">
          {{scope.row.result | filterResult}}
        </template>
      </s-table-column>
    </s-page-infinite-table>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import sPageInfiniteTable from '@/components/pageInfiniteTable/PageInfiniteTable'
  // import SearchBox from '@/components/tableCom/src/SearchBox';
  export default {
    data() {
      return {
        dataList: [],
        searchForm: {
          orderCode: '',
          startTime: '',
          endTime: '',
          orderType: '',
          orderStatusName: '',
          recipientName: '',
          subject: '',
          createTime: '',
          result: ''
        },
        getFlag: true,
        showSearch: true,
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
        axiosObj: {
          type: 'post',
          url: '/itilSendLog/searchSendLog',
          params: {
            condition: {

            }
          }
        },
        flag: false
      }
    },
    components: {
      sPageInfiniteTable
      // SearchBox
    },
    methods: {
      getData() {
        $axios.post('/itilSendLog/getAll').then((res) => {
          this.dataList = res.data;
        })
      },
      hideHandler() {
        this.flag = !this.flag
      },
      search() {
        let params = {
          orderCode: this.searchForm.orderCode,
          startTime: this.searchForm.startTime !== null ? parseInt(new Date(this.searchForm.startTime).getTime() / 1000) : null,
          endTime: this.searchForm.endTime !== null ? parseInt(new Date(this.searchForm.endTime).getTime() / 1000) : null
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
        this.axiosObj.params.condition = params;
        this.flag = false
      }
    },
    created() {
      this.getData()
    },
    filters: {
      filterResult(val) {
        switch (val) {
          case 1:
            return '发送成功';
          case 0:
            return '发送失败';
        }
      },
      filterOrderType(val) {
        switch (val) {
          case 0:
            return '事件';
          case 1:
            return '问题';
          case 2:
            return '变更';
          case 3:
            return '任务';
        }
      }
    }
  }
</script>
