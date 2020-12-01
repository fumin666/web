<!--
 * @Author: mybells
 * @Version://Q1IAM模块功能增强
 * @Description:业务权限管理-》应用授权认证日志
 * @Date: 2020-02-12 09:41:00
 * @LastEditors: mybells
 -->

<template>
  <div>
    <s-row style="margin-bottom: 15px;">
      <s-form :inline="true" :model="form" class="search_form">
        <div>
          <s-form-item label="账号名称：">
            <s-input v-model="form.authAccount" placeholder="请输入" @keyup.enter.native="searchList"></s-input>
          </s-form-item>
          <s-form-item label="客户端IP：">
            <s-input v-model="form.clientIp" placeholder="请输入" @keyup.enter.native="searchList"></s-input>
          </s-form-item>
          <s-form-item label="应用系统：">
            <s-select v-model="form.clientId" filterable clearable placeholder="请选择">
              <s-option v-for="(item, index) in appNameList" :key="index" :label="item.appName" :value="item.clientId"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="时间：">
          <s-date-picker
            v-model="form.startTime"
            type="datetime" placeholder="请选择"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :value-format-flag="true"
            @change="getStartTime">
          </s-date-picker>
          <span>~</span>
          <s-date-picker
            v-model="form.endTime"
            type="datetime" placeholder="请选择"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            :value-format-flag="true"
            @change="getEndTime">
          </s-date-picker>
        </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" title="查询" @click="searchList">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-row style="margin-bottom: 10px;">
      <s-button @click="exportFile('pdf')">PDF报表</s-button>
      <s-button @click="exportFile('excel')">EXCEL报表</s-button>
      <s-button @click="exportFile('word')">WORD报表</s-button>
    </s-row>
    <s-row>
      <RealPageTable :ajax-obj="ajaxObj">
        <s-table-column label="账号名称" prop='authAccount'></s-table-column>
        <s-table-column label="应用系统" prop='authAppName'></s-table-column>
        <s-table-column label="客户端ID" prop='clientId'></s-table-column>
        <s-table-column label="客户端IP" prop='clientIp'></s-table-column>
        <s-table-column label="认证时间" prop='authTime'></s-table-column>
        <s-table-column label="认证结果" prop='authDetail'></s-table-column>
      </RealPageTable>
    </s-row>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import {Download} from 'sunflower-common-utils'

  export default {
    components: {
      RealPageTable
    },
    data() {
      return {
        form: {
          authAccount: null,
          clientIp: null,
          clientId: null,
          startTime: '',
          endTime: ''
        },
        ajaxObj: {
          type: 'post',
          url: '/oauthAuthLog/getAuthLogList',
          params: {
            condition: {
            }
          }
        },
        appNameList: []
      }
    },
    created() {
      $axios.get('/oauthClient/getAllOAuthAppSystem').then(res => {
        this.appNameList = res.data || [];
      })
    },
    mounted() {
      this.axiosList();
    },
    methods: {
      /* 查询 */
      searchList() {
        this.axiosList();
      },
      axiosList() {
        let params = Object.assign({}, this.form);
        params.startTime = new Date(this.form.startTime).getTime() / 1000;
        params.endTime = new Date(this.form.endTime).getTime() / 1000;
        this.ajaxObj.params.condition = params;// 请求接口
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.form.endTime.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.form.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.startTime = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.form.startTime.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.form.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.form.endTime = val;
        }
      },
      exportFile(type) {
        let params = Object.assign({}, this.form);
        params.exportType = type;
        $axios.post('/oauthAuthLog/exportAuthLogList', params).then(res => {
          Download(`/download/downloadFile/accountAuthLog`);
        })
      }
    }
  }
</script>
