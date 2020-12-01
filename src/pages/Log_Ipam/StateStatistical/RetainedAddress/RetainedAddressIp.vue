<!--
 * @Description: 【报表中心】-【IPAM报表】-【保留的IP地址统计】-【IP地址视角】
 * @Author: 仝希博
 * @LastEditors  : mybells
 * @Date: 2019-04-19 17:11:29
 -->

<template>
  <div class="change1">
    <section class="reportTop noPrint">
      <s-row>
        <s-col :span="24">
          <s-form :inline="true" class="search_form" style="margin: 10px 0;">
            <div>
              <s-form-item label='子网地址：'>
                <s-select v-model="form.subNetAddress" clearable placeholder="请选择" >
                  <s-option v-for="item in subnetData" :key="item.uuid" :label="item.subNetAddress" :value="item.subNetAddress"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label='IP地址：'>
                <s-input v-model="form.ipAddress"></s-input>
              </s-form-item>
              <s-form-item label='IP地址状态：'>
                <s-select v-model="form.ipAddressStatus" clearable placeholder="请选择" >
                  <s-option label="暂态" :value="0"></s-option>
                  <s-option label="未使用" :value="1"></s-option>
                  <s-option label="已使用" :value="2"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="更新时间：">
                <s-date-picker v-model="form.modifyStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
                </s-date-picker>
                ~
                <s-date-picker v-model="form.modifyEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
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
        prop="ipAddressStatusStr"
        label="状态">
        <template slot-scope="scope">
          <span :style="color(scope.row.ipAddressStatus)">{{scope.row.ipAddressStatusStr}}</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="ipAddress"
        label="IP地址">
      </s-table-column>
      <s-table-column
        prop="subNetAddress"
        label="子网地址">
      </s-table-column>
      <s-table-column
        prop="ipAddressRetainStr"
        label="保留类型">
      </s-table-column>
      <s-table-column
        prop="lastModifyTimeStr"
        label="最后更新时间"
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
    props: {
      subnetobj: {
        type: Object
      }
    },
    data () {
      return {
        tableData: [],
        form: {
        subNetAddress: '',
        ipAddressStatus: null,
        ipAddressRetain: 1,
        ipAddress: '',
        modifyStartTime: '',
        modifyEndTime: ''
        },
        subnetData: []
      }
    },
    created() {
      this.getSubnetType()
    },
    mounted() {
      if (Object.keys(this.subnetobj).length) {
        this.form.subNetAddress = this.subnetobj.subNetAddress;
      }
      this.getList()
    },
    methods: {
      getSubnetType() {
        $axios.post(`/ipamNetsegment/getAllIpamNetSegmentList`).then((res) => {
            if (res.data) {
              this.subnetData = res.data || []
            }
        })
      },
      // 根据状态值判断颜色
      color(text) {
        if (text === 1) {
          return {color: 'yellowgreen', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
        } else if (text === 2) {
          return {color: 'red', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
        } else if (text === 0) {
          return {color: 'orange', fontSize: '12px', padding: '3px 8px', border: '1px solid', height: '24px', lineHeight: '24px', borderRadius: '3px'}
        }
      },
      getDateRangeStart(value) {
        let start = this.form.modifyStartTime ? new Date(this.form.modifyStartTime).getTime() : 0
        let end = this.form.modifyEndTime ? new Date(this.form.modifyEndTime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.modifyStartTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.modifyStartTime ? new Date(this.form.modifyStartTime).getTime() : 0
        let end = this.form.modifyEndTime ? new Date(this.form.modifyEndTime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.modifyEndTime = '';
          }
        }
      },
      getList() {
        let parms = Object.assign({}, this.form)
        parms.modifyStartTime = new Date(parms.modifyStartTime).getTime() / 1000
        parms.modifyEndTime = new Date(parms.modifyEndTime).getTime() / 1000
        $axios.post(`/ipamReport/retainIpOfSelf`, parms).then((res) => {
          this.tableData = res.data || []
        })
      },
      DownloadHandle(type) {
        this.$confirm(`确定将【保留的IP地址-IP地址视角】统计报表以${type}格式导出？`, '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          this.form.exportType = type
          this.form.spare = 1
          $axios.post(`/ipamReport/retainIpOfSelfExport`, this.form).then(res => {
              if (res.data === true) {
                  Download(`ipamReport/retainIpOfSelfDownload/${type}`)
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
