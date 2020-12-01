/**
* Created by liushupeng on 2019/2/21.//Q4高级搜索优化
*/
<template>
  <!--审计记录(中间件资产)-->
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
        <s-form :inline="true" :model="searchForm" class="search_form">
          <div>
            <s-form-item label="业务名称:" prop="">
              <s-input @keyup.enter.native="search" ></s-input>
            </s-form-item>
            <s-form-item label="登录名:" prop="">
              <s-input @keyup.enter.native="search" ></s-input>
            </s-form-item>
            <s-form-item label="客户端IP:" prop="">
              <s-input @keyup.enter.native="search" ></s-input>
            </s-form-item>
            <s-form-item label="开始时间:">
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
            <s-button icon="magnifier" @click="search">查询</s-button>
          </div>
        </s-form>
      </s-row>
    </s-row>
    <s-table-page
      ref="multipleTable"
      :data="dataList"
      style="width:100%"
    >
      <s-table-column prop="" label="业务名称" ></s-table-column>
      <s-table-column prop="" label="登录名" ></s-table-column>
      <s-table-column prop="" label="客户端IP" ></s-table-column>
      <s-table-column prop="" label="开始时间" ></s-table-column>
      <s-table-column prop="" label="操作" >
        <template slot-scope="scope" width="200">
          <i class="iconfont icon-eye" title="查看" @click="checkDetail(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script>
  // import searchBox from '@/components/tableCom/src/SearchBox'
//  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        searchForm: {
          sessionTypeUuid: '',
          clientIp: '',
          oprateUserUuid: '',
          protocolName: '',
          accountName: '',
          startTime: '',
          endTime: ''
        },
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() >= Date.now();
          }
        },
        disableAfterToday2: {
          disabledDate(time) {
            return time.getTime() >= Date.now()
          }
        }
      }
    },
    methods: {
      checkDetail() {
      },
      search() {
      }
    },
    components: {
      // searchBox
    }
  }
</script>

<style>
</style>
