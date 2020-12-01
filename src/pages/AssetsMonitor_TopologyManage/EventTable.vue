/**
* Created by dgunzi on 2019/01/18.
*/
<template>
  <div id="event">
    <div class="inputWrap" style="position: relative;">
      <s-input v-model="searchContent" @keyup.enter.native="init" placeholder="请输入内容" class="real-search-input" style="margin-bottom: 10px;"></s-input>
      <span class="realPageSearch" ><i class="iconfont icon-magnifier" @click="init"></i></span>
    </div>
    <RealPageTable
      ref="eventTable"
      height="210"
      :ajax-obj="ajaxObj"
      >
      <s-table-column
        label="标识"
        width="70" align="center">
        <template slot-scope="scope">
          <incident-icon :level="scope.row.level"></incident-icon>
        </template>
      </s-table-column>
      <s-table-column
        prop="levelStr"
        label="事件级别"
        width="100" align="center">
      </s-table-column>
      <s-table-column
        prop="modifyTimeStr"
        label="更新时间"
        width="120" show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="controlAdderss"
        label="IP地址"
        width="150" show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="itcompName"
        label="资产名称"
        width="120" show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="incidentContent"
        label="事件摘要" show-overflow-tooltip>
      </s-table-column>
      <s-table-column
        prop="date"
        label="事件状态"
        width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">未处理</span><span v-else>已处理</span>
        </template>
      </s-table-column>
      <s-table-column
        prop="count"
        label="事件累计"
        width="120" align="center">
      </s-table-column>
    </RealPageTable>
  </div>
</template>
<script>
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  // import { getIncidentList } from './api/topology_api'
  import {cloneDeep, debounce} from 'lodash';
  import incidentIcon from '@/components/incident/incidentIcon'
  export default {
    data () {
      return {
        tableData: [],
        searchContent: '',
        ajaxObj: {
          type: 'post',
          url: '/incidentCount/getIncidentCountByTopoviewInfoUuid',
          params: {
            condition: {
              topoviewInfoUuid: '',
              showapp: null
            }
          }
        }
      }
    },
    created() {
      this.$nextTick(() => {
        this.init();
      })
    },
    methods: {
      init: debounce(function() {
        let condition = {
          topoviewInfoUuid: window.paramSubTopo,
          showapp: this.config.showapp,
          searchContent: this.searchContent
        }
        this.ajaxObj.params.condition = cloneDeep(condition)
      }, 500),
      getHeaderSearch() {
        return {
          width: 10,
          placeholder: '请输入资产名称、IP地址',
          searchProps: ['itcompName', 'controlAdderss']
        }
      }
    },
    components: {
      incidentIcon,
      RealPageTable
    },
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    watch: {
      config: function (val, oldVal) {
        this.init();
      }
    }
  }
</script>

