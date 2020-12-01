<template>
  <div>
    <s-table-page :data='eventListData'
                 ref="eventTable"
                 :row-actions='getEventRowActionsDef()'
                 :header-search='getEventSearchDef()'
                 v-loading="loading2"
                 element-loading-text="加载中"
                  height="545">
      <s-table-column
        prop="levelStr"
        label="标识"
        width="80" align="center">
        <template slot-scope="scope">
          <img :src="filterIncidentImg(scope.row.level)" alt="" class="stateImg">
        </template>
      </s-table-column>
      <s-table-column
        prop="incidentContent"
        label="事件摘要"
        width="200">
      </s-table-column>
      <s-table-column
        prop="createTimeStr"
        label="创建时间"
        width="170">
      </s-table-column>
      <s-table-column
        prop="modifyTimeStr"
        label="更新时间"
        width="170">
      </s-table-column>
      <s-table-column
        prop="dateRange"
        label="持续时间"
        width="120">
      </s-table-column>
      <s-table-column
        prop="itcompName"
        label="资产名称"
        width="170">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script>
    import $axios from 'sunflower-ajax'
    import Bus from '@/plugins/eventBus'
    export default {
      name: 'EventList',
      data() {
        return {
          eventListData: [],           // 事件列表
          loading2: true
        }
      },
      props: {
        uuid: {
          type: String,
          default() {
            return ''
          }
        }
      },
      mounted () {
        this.showEventList();
      },
      methods: {
        showEventList() {
          $axios.post('/incidentCount/incidentGroupList', {'isRecoveryIncident': 0, 'assetUuid': this.uuid, 'currentPage': 1, 'orderByClause': 'id'}).then(({data}) => {
            this.eventListData = data;
            this.loading2 = false;
          });
        },
        getEventSearchDef() {
          return {
            width: 4,
            offset: 8,
            placeholder: '请输入查询条件',
            searchProps: ['itcompName', 'incidentContent'] // can be string or Array
          }
        },
        getEventRowActionsDef() {
          return [{
            icon: 'eye',
            click(row) {
              Bus.$emit('monitor-detail', row, false);
            },
            name: '查看'
          }]
        },
        filterIncidentImg(val) {
          switch (val) {
            case 0:
              return '/static/images/incident/weizhi.png';
            case 1:
              return '/static/images/incident/zhengchang.png';
            case 2:
              return '/static/images/incident/tishi.png';
            case 3:
              return '/static/images/incident/jinggao.png';
            case 4:
              return '/static/images/incident/ciyao.png';
            case 5:
              return '/static/images/incident/zhuyao.png';
            case 6:
              return '/static/images/incident/yanzhong.png';
          }
        }
      }
    }
</script>

<style>
  .s-col-offset-8{
    margin-left: 815px;
  }
</style>
