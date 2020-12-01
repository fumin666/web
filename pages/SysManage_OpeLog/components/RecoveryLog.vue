/*
create by YOU
*/
<template>
  <div>
    <s-form :inline='true' class="search_form"  style="margin-bottom:10px" label-width='85px'>
      <div>
        <s-form-item label='恢复时间：'>
          <s-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始日期" value-format="yyyy-MM-dd HH:mm:ss">
          </s-date-picker> ~
          <s-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </s-date-picker>
        </s-form-item>
        <s-form-item label='状态：'>
          <s-select v-model="form.status">
            <s-option v-for="item in statusData" :label="item.name" :value="item.valueInt" :key="item.valueInt"></s-option>
          </s-select>
        </s-form-item>
      </div>
      <div class="search_btn">
        <s-button icon='magnifier' @click="getData">查询</s-button>
      </div>
    </s-form>
    <s-table-page
      :='false' :header-search="{show: false}"
      :data="data">
      <s-table-column
        prop="createDate"
        show-overflow-tooltip
        label="恢复时间">
      </s-table-column>
      <s-table-column
        prop="archServer"
        show-overflow-tooltip
        label="恢复服务器IP">
      </s-table-column>
      <s-table-column
        prop="startTime"
        show-overflow-tooltip
        label="恢复内容开始时间">
      </s-table-column>
      <s-table-column
        prop="endTime"
        show-overflow-tooltip
        label="恢复内容结束时间">
      </s-table-column>
      <s-table-column
        prop="recoverFile"
        show-overflow-tooltip
        label="文档文件名称">
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
          startTime: '',
          endTime: '',
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
        $axios.post('/archLog/getArchiveRecover', params).then(({data}) => {
          this.data = data
        })
      }
    }
  };
</script>

