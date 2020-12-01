<template>
  <section id="monitorDetail">
    <s-scrollbar wrap-style="max-height:450px;">
      <s-tab @on-click="tabClick">
        <s-tab-pane label="事件详情" :key="0">
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">事件摘要：</div>
            </s-col>
            <s-col :span="19">
              <s-tooltip :content="detailData.incidentContent">
                <div class="grid-content bg-purple-light overFlowTip">{{detailData.incidentContent}}</div>
              </s-tooltip>
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
              <div class="grid-content bg-purple-light">{{detailData.modifyTime_Str || formatDate(detailData.modifyTime)}}</div>
            </s-col>
          </s-row>
          <s-row>
            <s-col :span="5">
              <div class="grid-content bg-purple">产生时间：</div>
            </s-col>
            <s-col :span="7">
              <div class="grid-content bg-purple-light">{{detailData.createTime_Str || formatDate(detailData.createTime)}}</div>
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
              <s-tooltip :content="detailData.thresholdName">
                <div class="grid-content bg-purple-light overFlowTip">{{detailData.thresholdName}}</div>
              </s-tooltip>
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
              <s-tooltip :content="detailData.groupDesc">
                <div class="grid-content bg-purple-light overFlowTip">{{detailData.groupDesc}}</div>
              </s-tooltip>
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
            :header-search='getListSearchDef()'>
            <s-table-column
              label="更新时间"
              prop="createTime_Str"
              width="180"
              sortable
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
        if (seconds) {
          let date = new Date()
          date.setTime(seconds * 1000)
          let _month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
          let _date = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
          let _hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
          let _minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
          let _second = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
          let dateStr = `${date.getFullYear()}-${_month}-${_date} ${_hour}:${_minute}:${_second}`
          return dateStr
        } else {
          return ''
        }
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
      $axios.get(`/incidentCount/getIncidentInfoByIncidentCountUuid/${this.detailData.uuid}`).then(({data}) => {
        if (data && data instanceof Array) {
          let resData = data.reverse()
          resData.forEach(item => {
            this.$set(item, 'createTime_Str', this.formatDate(item.createTime))
          })
          this.eventHistory = resData
        }
      })
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
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #monitorDetail
    .overFlowTip
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .footerRow
      margin-top 15px
      text-align right
      .s-button
        &:nth-of-type(1)
          margin-right 20px
    .s-table
      th,td
        .cell
          padding-left 18px
          padding-right 18px
</style>
