/*
 * @Author: YOU
 * @Date: Null
 * @Last Modified by: tongxb
 * @Last Modified time: 2019-10-30 13:55:37
 */

<template>
  <div>
    <s-form :inline='true' class="search_form"  style="margin-bottom:10px" label-width='105px'>
      <div>
        <s-form-item label='归档方式：'>
          <s-select v-model="form.archiveMode">
            <s-option label="自动丢弃" :value="0"></s-option>
            <s-option label="本地归档" :value="1"></s-option>
            <s-option label="FTP归档" :value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label='归档服务器IP：'>
          <s-input v-model="form.serviceIp"></s-input>
        </s-form-item>
        <s-form-item label='状态：'>
          <s-select v-model="form.status">
            <s-option v-for="item in statusData" :label="item.name" :value="item.valueInt" :key="item.value"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label='创建时间：'>
          <s-date-picker v-model="form.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="form.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="getData">查询</s-button>
      </div>
    </s-form>
    <s-table-page :data="data" >
      <s-table-column prop="modeStr" show-overflow-tooltip label="归档方式">
      </s-table-column>
      <s-table-column prop="typeStr" show-overflow-tooltip label="归档类型">
      </s-table-column>
      <s-table-column prop="archServer" show-overflow-tooltip label="归档服务器IP">
      </s-table-column>
      <s-table-column prop="ftpIp" show-overflow-tooltip label="FTP服务器IP">
      </s-table-column>
      <s-table-column prop="archiveTime" show-overflow-tooltip label="创建时间">
      </s-table-column>
      <s-table-column show-overflow-tooltip label="归档内容">
        <template slot-scope="scope">
          <span v-if="scope.row.siemMod !== 3">日志审计信息 </span>
          <span v-if="scope.row.dbaMod !== 3">数据库审计信息 </span>
          <span v-if="scope.row.impMod !== 3">资产监控信息 </span>
          <span v-if="scope.row.omaMod !== 3">运维审计信息</span>
        </template>
      </s-table-column>
      <s-table-column prop="dataBeginTime" show-overflow-tooltip label="归档内容开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.dataBeginTime=="1970-01-01 08:00:00"?'--':scope.row.dataBeginTime}}</span>
        </template>
      </s-table-column>
      <s-table-column prop="dataEndTime" show-overflow-tooltip label="归档内容结束时间">
      </s-table-column>
      <s-table-column prop="archivePath" show-overflow-tooltip label="归档路径">
      </s-table-column>
      <s-table-column prop="statusStr" show-overflow-tooltip label="状态">
      </s-table-column>
      <s-table-column show-overflow-tooltip label="操作">
        <template slot-scope="scope">
          <i v-if="scope.row.status === 2 && scope.row.archiveMode === 1" class="iconfont icon-delete" title="删除" @click="deleteHandler(scope.row)"></i>
          <i v-if="scope.row.status === 2 && scope.row.archiveMode === 1" class="iconfont icon-download" title="下载" @click="downloadHandler(scope.row)"></i>
          <i v-if="scope.row.status === 2" class="iconfont icon-back-square" title="恢复" @click="restore(scope.row)"></i>
        </template>
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
import {Download} from 'sunflower-common-utils'

import $axios from 'sunflower-ajax'
export default {
  data() {
    return {
      data: [],
      month: '',
      months: [],
      searchStr: '',
      form: {
        serviceIp: null,
        archiveMode: null,
        startTime: '',
        endTime: '',
        status: null
      },
      statusData: []
    }
  },
  components: {

  },
  created() {
    this.getData()
    $axios.get('/archInfo/getArchiveStatusEnumList').then(({data}) => {
      this.statusData = data
    })
  },
  computed: {
  },
  methods: {
    getDateRangeStart(value) {
      let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
      let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
      if (end) {
        if (start >= end) {
          this.$message({
            type: 'warning',
            message: '开始时间必须小于结束时间！'
          })
          this.form.startTime = '';
        }
      }
    },
    getDateRangeEnd(value) {
      let start = this.form.startTime ? new Date(this.form.startTime).getTime() : 0
      let end = this.form.endTime ? new Date(this.form.endTime).getTime() : 0
      if (start) {
        if (start >= end) {
          this.$message({
            type: 'warning',
            message: '结束时间必须大于开始时间！'
          })
          this.form.endTime = '';
        }
      }
    },
    getData() {
      let params = {
        condition: Object.assign({}, this.form),
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        pageList: [],
        distinct: false,
        orderByClause: ''
      }
      params.condition.startTime = (new Date(this.form.startTime).getTime()) / 1000
      params.condition.endTime = (new Date(this.form.endTime).getTime()) / 1000
      $axios.post('/archLog/getArchLogs', params).then(({data}) => {
        this.data = data
      })
    },
    downloadHandler(row) {
      Download(`archLog/download/${row.id}`)
    },
    restore(row) { // 恢复
      $axios.get(`/archInfo/restore/${row.uuid}`).then(({data}) => {
        if (data) {
          this.$message({message: '正在恢复，请稍后', type: 'success'});
        }
      })
    },
    deleteHandler(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.get(`/archLog/delete/${row.id}`).then(({data}) => {
          if (data === true) {
            this.$message.success('删除成功')
            this.getData(this.month)
          } else {
            this.$message.error('删除失败')
          }
        })
      }).catch(() => {});
    }
  }
};
</script>

