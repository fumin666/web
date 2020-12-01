<template>
  <section class="logPasswordDetail">
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-page
        :data="pwDetail"

        :header-search="getSearchDef()"
        :has-action-col=false
        :pagination-show=false>
        <s-table-column
          label="任务名称"
          prop="taskName"
          width="140px"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="开始时间"
          prop="beginTime"
          width="180px">
        </s-table-column>
        <s-table-column
          label="结束时间"
          prop="endTime"
          width="180px">
        </s-table-column>
        <s-table-column
          label="改密目标机器"
          prop="deviceIp"
          width="170px"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          :label= "check === true ? '验证账号' : '改密账号'"
          prop="accountName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          :label= "check === true ? '验证结果' : '改密结果'"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{scope.row.resultStr}}</div>
          </template>
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'
  // import {batchUuid} from 'sunflower-common-utils'

  export default {
    components: {

    },
    data() {
      return {
      }
    },
    props: ['pwDetail', 'check'],
    methods: {
      getSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询内容',
          searchProps: ['beginTime', 'endTime', 'taskName', 'deviceIp', 'accountName', 'result']
        }
      }
    },
    created() {
      console.log(this.check)
      // this.getList();
    }
  }
</script>
