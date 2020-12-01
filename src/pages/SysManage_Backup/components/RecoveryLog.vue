<!--
 * @Author: shifeng
 * @Email: shifeng199307@gmail.com
 * @Date: 2019-02-14 10:43:10
 * @LastEditors: shifeng
 * @LastEditEmail: shifeng199307@gmail.com
 * @LastEditTime: 2019-02-22 10:24:09
 * @Description: 恢复日志tab
 -->

<template>
  <div class="backup-rec">
    <!-- 头部搜索框 -->
      <s-form :inline="true" :model="searchForm" class="search_form"  style="margin-bottom:10px" label-width='105px'>
        <div>
          <s-form-item label="文件名：">
            <s-input v-model="searchForm.fileName"></s-input>
          </s-form-item>
          <s-form-item label="状态：">
            <s-select v-model="searchForm.status" clearable>
              <s-option label="执行中" :value="0"></s-option>
              <s-option label="成功" :value="1"></s-option>
              <s-option label="失败" :value="2"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="恢复结束时间：">
            <s-date-picker v-model="searchForm.startTime" placeholder="请选择开始时间" type="datetime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getStartTime">
            </s-date-picker>~
            <s-date-picker v-model="searchForm.endTime" placeholder="请选择结束时间" type="datetime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :value-format-flag="true" @change="getEndTime">
            </s-date-picker>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="listSearch">查询</s-button>
        </div>
      </s-form>
    <!-- 表格 -->
    <s-table-page :data="backupRecLogList"  :header-search="{show: false}" >
      <s-table-column label="文件名" prop="fileName"></s-table-column>
      <s-table-column label="恢复开始时间" prop="startTime"></s-table-column>
      <s-table-column label="恢复结束时间" prop="endTime"></s-table-column>
      <s-table-column label="状态" prop="status" :formatter="formatterStatus"></s-table-column>
    </s-table-page>

  </div>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';

// import {Validaters} from 'sunflower-common-utils';
// import {Download} from 'sunflower-common-utils'

export default {

  data() {
    return {
      backupRecLogList: [], // 备份恢复日志列表
      searchForm: {
        startTime: '',  // 开始时间
        endTime: '', // 结束时间
        status: null, // 状态
        fileName: '' // 文件名
      }
    }
  },
  created() {
    this.getBackupRecLogList();
  },
  methods: {
    // 获取备份恢复日志列表
    getBackupRecLogList() {
      let params = {
        condition: {},
        currentPage: 1,
        orderByClause: 'id',
        pageSize: 10
      };
      params.condition = this.searchForm;
      params.condition.status = params.condition.status !== '' ? params.condition.status : null
      $axios.post(`/systemmanager/sysBackupLog/restoreLogList`, params).then(({data}) => {
        this.backupRecLogList = data;
      })
    },
    listSearch() {
      this.getBackupRecLogList();
    },
    // 开始时间校验
    getStartTime(val) {
      let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
      let endValue = new Date(Date.parse(this.searchForm.endTime.replace(/-/g, '/'))).getTime();
      if (beginVal >= endValue) {
        this.startTimeValue = '';
        this.$message('开始日期不能大于等于结束日期！');
        return false;
      } else {
        this.startTimeValue = val;
      }
    },
    // 结束时间校验
    getEndTime(val) {
      let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
      let beginValue = new Date(Date.parse(this.searchForm.startTime.replace(/-/g, '/'))).getTime();
      if (endVal <= beginValue) {
        this.endTimeValue = '';
        this.$message('开始日期不能大于等于结束日期！');
        return false;
      } else {
        this.endTimeValue = val;
      }
    },
    // 转换
    formatterStatus: function (row, column) {
      return row.status === 0 ? '执行中' : row.status === 1 ? '成功' : row.status === 2 ? '失败' : ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.backup-rec .searchFormChunk {
  .s-form-item {
    margin-bottom: 0;
  }

  .right {
    float: right;
    margin-top: 4px;
  }
}
</style>
