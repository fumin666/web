/*
create by YOU
*/
<template>
  <div>
    <s-form :inline="true" class="search_form" style="margin-bottom:10px">
      <div>
        <s-form-item label='告警服务器IP：'>
          <s-input v-model="form.condition.alarmIp"></s-input>
        </s-form-item>
        <s-form-item label='告警时间：'>
          <s-date-picker v-model="form.condition.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="form.condition.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon="magnifier" @click="search">查询</s-button>
      </div>
    </s-form>
    <s-table
      :data="data">
      <s-table-column label="告警时间" prop="alarmTime" show-overflow-tooltip></s-table-column>
      <!--<s-table-column label="告警服务类型" prop="alarmService" show-overflow-tooltip></s-table-column>-->
      <s-table-column label="告警服务器IP" prop="alarmIp" show-overflow-tooltip></s-table-column>
      <s-table-column label="告警模块" prop="alarmType" show-overflow-tooltip></s-table-column>
      <s-table-column label="告警内容" prop="alarmContent" show-overflow-tooltip></s-table-column>
    </s-table>
    <s-pagination
      style="margin-top: 10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="form.currentPage"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="form.total">
    </s-pagination>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    components: {},
    data() {
      return {
        data: [],
        form: {
          condition: {
            alarmIp: null,
            startTime: '',
            endTime: ''
          },
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      }
    },
    created() {
      this.getData()
    },
    methods: {
      getData() {
        let parms = {
          condition: Object.assign({}, this.form.condition),
          currentPage: this.form.currentPage,
          pageSize: this.form.pageSize,
          total: this.form.total
        }
        parms.condition.startTime = parms.condition.startTime ? new Date(this.form.condition.startTime).getTime() / 1000 : null
        parms.condition.endTime = parms.condition.endTime ? new Date(this.form.condition.endTime).getTime() / 1000 : null
        $axios.post('/systemmanager/sysConfig/getHaLogs', parms).then(({data}) => {
          this.data = data.list
          this.form.total = data.total
        })
      },
      getDateRangeStart(value) {
        let start = this.form.condition.startTime ? new Date(this.form.condition.startTime).getTime() / 1000 : null
        let end = this.form.condition.endTime ? new Date(this.form.condition.endTime).getTime() / 1000 : null
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.condition.startTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.condition.startTime ? new Date(this.form.condition.startTime).getTime() / 1000 : null
        let end = this.form.condition.endTime ? new Date(this.form.condition.endTime).getTime() / 1000 : null
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.condition.endTime = '';
          }
        }
      },
      // 分页
      handleSizeChange (pageSize) {
        this.form.pageSize = pageSize
        this.getData()
      },
      handleCurrentChange (currentPage) {
        this.form.currentPage = currentPage
        this.getData()
      },
      search() {
        this.getData()
      }
    }
  };
</script>
