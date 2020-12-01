<!--
 * @Description: IP地址变更统计
 * @Author: 仝希博
 * @LastEditors: 高建鹏
 * @Date: 2019-04-19 17:11:29
 -->

<template>
  <div>
    <section class="reportTop noPrint">
      <s-row>
        <s-col :span="24">
          <s-form :inline="true" class="search_form" style="margin: 10px 0;">
            <div>
              <s-form-item label='子网地址：'>
                <s-select v-model="form.subnetAddress" clearable placeholder="请选择" >
                  <s-option v-for="item in subnetData" :key="item.uuid" :label="item.subNetAddress" :value="item.subNetAddress"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label='IP地址：'>
                <s-input v-model="form.ipAddress"></s-input>
              </s-form-item>
              <s-form-item label='变更类型：'>
                <s-select v-model="form.changeType" clearable placeholder="请选择" >
                  <s-option label="状态变更" value="状态变更"></s-option>
                  <s-option label="关联资产变更" value="关联资产变更"></s-option>
                  <s-option label="其他信息变更" value="其他信息变更"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="变更时间：">
                <s-date-picker v-model="form.changeStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
                </s-date-picker>
                ~
                <s-date-picker v-model="form.changeEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
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
    <s-table-page
      :data="tableData">
      <s-table-column
        prop="ipAddress"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="subnetAddress"
        label="子网地址">
      </s-table-column>
      <s-table-column
        prop="changeType"
        label="变更类型">
      </s-table-column>
      <s-table-column
        prop="changeBefore"
        label="变更前">
      </s-table-column>
      <s-table-column
        prop="changeAfter"
        label="变更后">
      </s-table-column>
      <s-table-column
        prop="operateBy"
        label="操作人">
      </s-table-column>
      <s-table-column
        prop="changeTime"
        label="变更时间"
        width="200">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  // import SelectTime from '@/components/selectTime/SelectTime.vue'

  export default {
    components: {
      // SelectTime
    },
    data () {
      return {
        tableData: [],
        subnetData: [],
        form: {
          ipAddress: '',
          subnetAddress: '',
          changeType: '',
          changeStartTime: '',
          changeEndTime: ''
        }
      }
    },
    props: ['changeType'],
    created() {
      if (this.changeType === 'ZTBG') {
        this.form.changeType = '状态变更';
      } else if (this.changeType === 'GLZCBG') {
        this.form.changeType = '关联资产变更'
      }
    },
    mounted() {
      this.getList()
      this.getSubnetType()
    },
    methods: {
      getSubnetType() {
        $axios.post(`/ipamNetsegment/getAllIpamNetSegmentList`).then((res) => {
            if (res.data) {
              this.subnetData = res.data || []
            }
        })
      },
      getDateRangeStart(value) {
        let start = this.form.changeStartTime ? new Date(this.form.changeStartTime).getTime() : 0
        let end = this.form.changeEndTime ? new Date(this.form.changeEndTime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.changeStartTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.changeStartTime ? new Date(this.form.changeStartTime).getTime() : 0
        let end = this.form.changeEndTime ? new Date(this.form.changeEndTime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.changeEndTime = '';
          }
        }
      },
      getList() {
          let parms = {
            condition: Object.assign({}, this.form)
          }
          parms.condition.changeStartTime = parseInt(new Date(parms.condition.changeStartTime).getTime() / 1000)
          parms.condition.changeEndTime = parseInt(new Date(parms.condition.changeEndTime).getTime() / 1000)
          $axios.post(`/ipamReport/ipAddressChangeHistory`, parms).then((res) => {
            this.tableData = res.data || []
        })
      },
      DownloadHandle(type) {
        this.$confirm(`确定将【IP地址变更】统计报表以${type}格式导出？`, '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          this.form.exportType = type
          $axios.post(`/ipamReport/ipAddressChangeHistoryExport`, this.form).then(res => {
              if (res.data === true) {
                  Download(`ipamReport/ipAddressChangeHistoryDownload/${type}`)
              }
          })
        }).catch(() => {});
      }
    }
  }
</script>
<style lang="stylus">
  .change1
    padding: 0 30px
</style>
