<template>
  <section class="monitorDetail">
    <s-scrollbar wrap-style="max-height:660px;">
      <s-tab  @on-click="tabClick">
        <s-tab-pane label="事件详情" :key="0">
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">事件摘要：</div>
            </s-col>
            <s-col :span="19">
              <s-tooltip :content="detailData.incidentContent"><div class="grid-content bg-purple-light incidentSummary">{{detailData.incidentContent}}</div></s-tooltip>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">当前状态：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.isRecoveryStr}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">事件级别：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.levelStr}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">总次数：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.count}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">更新时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.modifyTimeStr}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">产生时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.createTimeStr}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">资产类型：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.ciTypeName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">IP地址：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.controlAdderss}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">规则名称：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.thresholdName}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">监控项类别：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.typeStr}}</div>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">触发条件：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.groupDesc}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">当前值：</div>
            </s-col>
            <s-col :span="7">
              <s-tooltip :content="detailCurrentValue">
                <div class="grid-content bg-purple-light overFlowTip">{{detailCurrentValue}}</div>
              </s-tooltip>
            </s-col>
            <s-col :span="5">
              <div class="grid-content bg-purple">规则组名称：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.groupName}}</div>
            </s-col>
          </s-row>
        </s-tab-pane>
        <s-tab-pane label="事件记录" :key="1">
          <s-table-page
            :data="eventHistory"
            :header-search='getListSearchDef()'
            >
            <s-table-column
              label="创建时间"
              prop="createTime_Str"
              width="180"
              show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              label="事件内容"
              prop="incidentContent"
              show-overflow-tooltip>
            </s-table-column>
          </s-table-page>
        </s-tab-pane>
      </s-tab>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">

  import $axios from 'sunflower-ajax'
  export default{
    data() {
      return {
        eventHistory: [],
        knowledgeList: [],
        detailCurrentValue: ''      // 详情 "当前值"字段
      }
    },

    props: {
      detailData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      tabClick() {},
      /* 时间格式化(s->yy-mm-dd hh:mm:ss) */
      formatDate(seconds) {
        let date = new Date()
        date.setTime(seconds * 1000)
        let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
        let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
        return dateStr
      },
      //  改密任务列表 表格搜索
      getListSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['createTime_Str', 'incidentContent']
        }
      }
    },
    created() {
      // 首先转换事件详情中的当前值
      if (this.detailData.currentValue) {
        let sendData = [this.detailData.currentValue.replace('[', '').replace(']', '')]
        $axios.post('/incidentCount/getCurrentValueChina', sendData).then((res) => {
          if (res.data && typeof res.data === 'string') {
            if (this.detailData.type === 2) {
              this.detailCurrentValue = ['ping不通', 'ping通'][res.data];
            } else if (this.detailData.type === 3) {
              this.detailCurrentValue = this.detailData.currentValue === '0' ? '凭证检测不通' : '凭证检测通'
            } else {
              this.detailCurrentValue = `[${res.data}]`;
            }
          }
        });
      }
      // 获取事件记录
      $axios.get(`/incidentCount/getIncidentInfoByIncidentCountUuid/${this.detailData.uuid}`).then(res => {
        let resData = res.data
        if (resData && resData instanceof Array) {
          resData.forEach(item => {
            this.$set(item, 'createTime_Str', this.formatDate(item.createTime));
          });
          this.eventHistory = resData
        }
      })
    }
  }
</script>

<style lang="stylus">
  .monitorDetail
    .incidentSummary
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
</style>
