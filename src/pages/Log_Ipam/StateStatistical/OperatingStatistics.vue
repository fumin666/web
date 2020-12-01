<!--
 * @Description: IPAM操作统计
 * @Author: 仝希博
 * @LastEditors: 高建鹏
 * @Date: 2019-04-19 17:43:14
 -->

<template>
  <div>
    <section class="reportTop noPrint">
      <s-row>
        <s-col :span="24">
          <s-form :inline="true" class="search_form" style="margin: 10px 0;">
            <div>
              <s-form-item label='操作人：'>
                <s-select v-model="form.operateBy" clearable placeholder="请选择" >
                  <s-option v-for="(item, index) in userName" :key="index" :label="item" :value="item"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label='执行动作：'>
                <s-select v-model="form.executionAction" clearable placeholder="请选择" >
                  <s-option label="增加" :value="1"></s-option>
                  <s-option label="修改" :value="2"></s-option>
                  <s-option label="删除" :value="3"></s-option>
                  <s-option label="子网扫描" :value="4"></s-option>
                  <s-option label="IP扫描" :value="5"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="执行时间：">
                <s-date-picker v-model="form.operateStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
                </s-date-picker>
                ~
                <s-date-picker v-model="form.operateEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
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
        prop="operateTimeStr"
        width="200"
        label="时间">
      </s-table-column>
      <s-table-column
        prop="operateBy"
        width="200"
        label="操作人">
      </s-table-column>
      <s-table-column
        prop="executionActionStr"
        width="300"
        label="执行动作">
      </s-table-column>
      <s-table-column
        prop="operateObject"
        width="120"
        label="操作对象">
      </s-table-column>
      <s-table-column
        prop="operateContent"
        label="操作内容">
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
        userName: [],
        form: {
          operateBy: '',
          operateStartTime: '',
          operateEndTime: '',
          executionAction: ''
        },
        param: {
          realName: ''
        }
      }
    },
    mounted() {
      this.getList()
      this.getUserName()
    },
    methods: {
      getDateRangeStart(value) {
        let start = this.form.operateStartTime ? new Date(this.form.operateStartTime).getTime() : 0
        let end = this.form.operateEndTime ? new Date(this.form.operateEndTime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.operateStartTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.operateStartTime ? new Date(this.form.operateStartTime).getTime() : 0
        let end = this.form.operateEndTime ? new Date(this.form.operateEndTime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.operateEndTime = '';
          }
        }
      },
      getList() {
          let parms = {
            condition: Object.assign({}, this.form)
          }
          parms.condition.operateStartTime = parseInt(new Date(parms.condition.operateStartTime).getTime() / 1000)
          parms.condition.operateEndTime = parseInt(new Date(parms.condition.operateEndTime).getTime() / 1000)
          $axios.post(`/ipamReport/ipOperationHistory`, parms).then((res) => {
            this.tableData = res.data || []
          })
      },
      getUserName() {
          $axios.post(`/iamUserInfo/getIamUserNameByRealNameLike`, this.param).then((res) => {
            this.userName = res.data || []
          })
      },
      DownloadHandle(type) {
        this.$confirm(`确定将【IPAM操作】统计报表以${type}格式导出？`, '提示', { confirmButtonText: '确定', cancelButtListonText: '取消', type: 'warning' }).then(() => {
          this.form.exportType = type
          $axios.post(`/ipamReport/ipOperationHistoryExport`, this.form).then(res => {
              if (res.data === true) {
                Download(`ipamReport/ipOperationHistoryDownload/${type}`)
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
