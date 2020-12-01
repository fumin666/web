/*
create by YOU
*/
<template>
  <div>
    <s-form :inline='true' class="search_form"  style="margin-bottom:10px" label-width='85px'>
      <div>
        <s-form-item label='归档方式：'>
          <s-select v-model="form.archiveMode">
            <s-option label="自动丢弃" :value="0"></s-option>
            <s-option label="本地归档" :value="1"></s-option>
            <s-option label="FTP归档" :value="2"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label='状态：'>
          <s-select v-model="form.status">
            <s-option v-for="item in statusData" :label="item.name" :value="item.valueInt" :key="item.valueInt"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label='清理时间：'>
          <s-date-picker v-model="form.cleanStartTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始时间" :editable="false" @change="getDateRangeStart">
          </s-date-picker>
          ~
          <s-date-picker v-model="form.cleanEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" :editable="false" @change="getDateRangeEnd">
          </s-date-picker>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="getData">查询</s-button>
      </div>
    </s-form>
    <s-table-page
      :data="data">
      <s-table-column
        prop="modeStr"
        show-overflow-tooltip
        label="归档方式">
      </s-table-column>
      <s-table-column
        prop="archServer"
        show-overflow-tooltip
        label="清理服务器IP">
      </s-table-column>
      <s-table-column
        prop="cleanTime"
        show-overflow-tooltip
        label="清理时间">
      </s-table-column>
      <s-table-column
        prop="dataBeginTime"
        show-overflow-tooltip
        label="清理内容开始时间">
        <template slot-scope="scope">
          <span>{{scope.row.dataBeginTime=="1970-01-01 08:00:00"?'--':scope.row.dataBeginTime}}</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="dataEndTime"
        show-overflow-tooltip
        label="清理内容结束时间">
      </s-table-column>
      <s-table-column
        prop="statusStr"
        show-overflow-tooltip
        label="状态">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        data: [],
        form: {
          archiveMode: null,
          cleanStartTime: '',
          cleanEndTime: '',
          status: null
        },
        statusData: []
      }
    },
    created() {
      this.getData()
      $axios.get('/archInfo/getArchiveStatusEnumList').then(({data}) => {
        this.statusData = data
      })
    },
    methods: {
      getDateRangeStart(value) {
        let start = this.form.cleanStartTime ? new Date(this.form.cleanStartTime).getTime() : 0
        let end = this.form.cleanEndTime ? new Date(this.form.cleanEndTime).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.form.cleanStartTime = '';
          }
        }
      },
      getDateRangeEnd(value) {
        let start = this.form.cleanStartTime ? new Date(this.form.cleanStartTime).getTime() : 0
        let end = this.form.cleanEndTime ? new Date(this.form.cleanEndTime).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.form.cleanEndTime = '';
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
        params.condition.cleanStartTime = (new Date(this.form.cleanStartTime).getTime()) / 1000
        params.condition.cleanEndTime = (new Date(this.form.cleanEndTime).getTime()) / 1000
        $axios.post('/archLog/getArchCleanLog', params).then(({data}) => {
          this.data = data
        })
      }
    }
  };
</script>
