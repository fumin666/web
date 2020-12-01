<!--
 * @Description: 【子网视角】
 * @Position: 【报表中心】-【IPAM报表】-【未使用IP地址统计】-【子网视角】
 * @Date: 2019-04-24 13:20:42
 * @LastEditTime: 2019-09-12 13:31:50
 -->
<template>
<div class="subnetview">
  <section class="reportTop noPrint">
    <s-row>
      <s-col :span="24">
        <s-form :inline="true" class="search_form" style="margin: 10px 0;">
          <div>
            <s-form-item label="扫描时间：">
              <s-date-picker v-model="form.scanStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
              </s-date-picker>
              ~
              <s-date-picker v-model="form.scanEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
              </s-date-picker>
            </s-form-item>
          </div>
          <div class="search_btn">
            <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
          </div>
        </s-form>
        <s-row style="margin: 15px 0 10px;">
          <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
          <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
          <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
        </s-row>
      </s-col>
    </s-row>
  </section>
  <s-table-page :data="tableData">
    <s-table-column prop="subNetAddress" label="子网地址">
      <template slot-scope="scope">
        <a @click="goDetail(scope.row)" href="javascript:void(0);" class="ipamColor">{{ scope.row.subNetAddress }}</a>
      </template>
    </s-table-column>
    <s-table-column prop="subNetName" label="子网名称"></s-table-column>
    <s-table-column prop="subNetCIDR" label="CIDR"></s-table-column>
    <s-table-column prop="subNetMask" label="子网掩码"></s-table-column>
    <s-table-column prop="mxHostCount" label="IP地址数"></s-table-column>
    <s-table-column prop="usage" label="使用率">
      <template slot-scope="scope">
        <span>{{ scope.row.usage+"%"}}</span>
      </template>
    </s-table-column>
    <s-table-column prop="available" label="未使用"></s-table-column>
    <!-- <s-table-column prop="transient" label="暂态"></s-table-column> -->
    <s-table-column prop="lastMonitorTimeStr" label="最后扫描时间" width="200"></s-table-column>
  </s-table-page>
</div>
</template>

<script>
import $axios from 'sunflower-ajax'
import {Download} from 'sunflower-common-utils'

export default {
  data() {
    return {
      tableData: [],
      form: {
        scanStartTime: '',
        scanEndTime: ''
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getDateRangeStart(value) {
      let start = this.form.scanStartTime ? new Date(this.form.scanStartTime).getTime() : 0
      let end = this.form.scanEndTime ? new Date(this.form.scanEndTime).getTime() : 0
      if (end) {
        if (start > end) {
          this.$message({
            type: 'warning',
            message: '开始时间必须小于结束时间！'
          })
          this.form.scanStartTime = '';
        }
      }
    },
    getDateRangeEnd(value) {
      let start = this.form.scanStartTime ? new Date(this.form.scanStartTime).getTime() : 0
      let end = this.form.scanEndTime ? new Date(this.form.scanEndTime).getTime() : 0
      if (start) {
        if (start > end) {
          this.$message({
            type: 'warning',
            message: '结束时间必须大于开始时间！'
          })
          this.form.scanEndTime = '';
        }
      }
    },
    getList() {
      let params = {
        condition: {
          scanStartTime: Number.isNaN(parseInt(new Date(this.form.scanStartTime).getTime())) ? 0 : parseInt(new Date(this.form.scanStartTime).getTime() / 1000),
          scanEndTime: Number.isNaN(parseInt(new Date(this.form.scanEndTime).getTime())) ? 0 : parseInt(new Date(this.form.scanEndTime).getTime() / 1000)
        },
        currentPage: 1
      }
      $axios.post(`/ipamReport/unUsedOrAllIpOfSubnet`, params).then((res) => {
        this.tableData = res.data || [];
      })
    },
    goDetail(rows) {
      this.$emit('skipTotab2', rows)
    },
    DownloadHandle(type) {
      let params = {
          scanStartTime: Number.isNaN(parseInt(new Date(this.form.scanStartTime).getTime())) ? 0 : parseInt(new Date(this.form.scanStartTime).getTime() / 1000),
          scanEndTime: Number.isNaN(parseInt(new Date(this.form.scanEndTime).getTime())) ? 0 : parseInt(new Date(this.form.scanEndTime).getTime() / 1000),
          exportType: type,
          ipStatus: 'unUsed'
      }
      this.$confirm(`确定将【未使用IP地址统计-子网视角】统计报表以${type}格式导出？`, '提示', {
        confirmButtonText: '确定',
        cancelButtListonText: '取消',
        type: 'warning'
      }).then(() => {
          $axios.post(`/ipamReport/unUsedOrAllIpOfSubnetExport`, params).then(res => {
              if (res.data === true) {
                Download(`/ipamReport/unUsedOrAllIpOfSubnetExportDownload/unUsed/${type}`)
              } else {
                this.$message({
                  type: 'error',
                  message: `${type}导出失败`
                })
              }
          })
      }).catch(() => {});
    }
  }
}
</script>
