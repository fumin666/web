/**
* Created by alex on 2019/2/28.
*/
<template>
  <s-scrollbar wrap-class="myHeight">
    <s-row>
      <s-row>
        <s-col :span="3">
          <div class="grid-content bg-purple label">危害级别</div>
        </s-col>
        <s-col :span="10">
          <div class="grid-content bg-purple-light"> <span v-text="gethazardLevel(data.hazardLevel)"></span></div>
        </s-col>
        <s-col :span="3">
          <div class="grid-content bg-purple label">重复次数</div>
        </s-col>
        <s-col :span="8" style="height:36px">
          <div class="grid-content bg-purple-light" >{{data.repeatTimes ? data.repeatTimes : '-----'}}</div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="3">
          <div class="grid-content bg-purple label" >日志级别</div>
        </s-col>
        <s-col :span="10">
          <!--<s-tooltip style="height:36px">
            <div slot="content"><span v-text="getlevel(data.logInfoLevel)"></span></div>-->
          <div class="grid-content bg-purple-light"> {{data.logInfoLevel}}</div>
          <!-- </s-tooltip>-->
        </s-col>
        <s-col :span="3">
          <div class="grid-content bg-purple label" >报告来源</div>
        </s-col>
        <s-col :span="8">
          <div class="grid-content bg-purple-light" >
            {{data.isDefualt === 0 ? '用户分析报告' : data.isDefualt === 1 ? '系统默认分析报告' : ''}}
          </div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="3">
          <div class="grid-content bg-purple label">分析时间段</div>
        </s-col>
        <s-col :span="10" style="height:36px">
          <!-- <s-tooltip style="height:36px">
             <div slot="content">{{data.startTime}} ~ {{data.endTime}}</div>-->
          <div class="grid-content bg-purple-light">{{data.startTime}} ~ {{data.endTime}}</div>
          <!-- </s-tooltip>-->
        </s-col>
        <s-col :span="3">
          <div class="grid-content bg-purple label">生成时间</div>
        </s-col>
        <s-col :span="8">
          <div class="grid-content bg-purple-light">{{data.createTime}}</div>
        </s-col>
      </s-row>
    </s-row>
    <s-row>
      <s-col :span="3">
        <div class="grid-content bg-purple label">日志源列表</div>
      </s-col>
      <s-col :span="21">
        <div class="grid-content bg-purple-light">
          <s-scrollbar wrap-style="max-height: 200px;">
            <span v-for="item in data.logSourceList"><s-tag>{{item}}</s-tag></span>
          </s-scrollbar>
        </div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="3">
        <div class="grid-content bg-purple label">报告内容</div>
      </s-col>
      <s-col :span="21">
        <div class="grid-content bg-purple-light">{{data.content}}</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="24">
        <div class="log-title label">日志统计TOP10列表</div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="24">
        <s-table-page
          :data="data.analysisDetailList"
          :header-search="{show: false}"
          :paginationShow="false"
        >
          <s-table-column label="日志级别" prop="logLevelStr" width="120px"></s-table-column>
          <s-table-column label="日志内容" prop="content"></s-table-column>
          <s-table-column label="危害级别" prop="hazardLevel" width="120px">
            <template slot-scope="scope">
              <span v-text="gethazardLevel(scope.row.hazardLevel)"></span>
            </template>
          </s-table-column>
          <s-table-column label="频次" prop="frequency" width="120px">
            <template slot-scope="scope">
              <a style="cursor: pointer;color: #1675cb" @click="showfreDialog(scope.row)">{{scope.row.frequency}}</a>
            </template>
          </s-table-column>
        </s-table-page>
      </s-col>
    </s-row>
    <s-dialog
      v-model="freDialog"
      v-if="freDialog"
      width="700px"
      title="报告详情"
      append-to-body>
      <fre-dialog :freList="frelist"
                  v-loading="loading"
                  element-loading-text="拼命加载中"></fre-dialog>
    </s-dialog>
  </s-scrollbar>
</template>

<script type="text/ecmascript-6">
  
  import freDialog from './freDialog'
  import $axios from 'sunflower-ajax'
  let formatTime = function (time) {
    let val = new Date(time)

    function addZero(t) {
      return t > 9 ? t : '0' + t
    }

    if (Object.prototype.toString.apply(val).indexOf('Date') !== -1) {
      let year = val.getFullYear()
      let month = addZero(val.getMonth() + 1)
      let date = addZero(val.getDate())
      let hour = addZero(val.getHours())
      let minutes = addZero(val.getMinutes())
      let second = addZero(val.getSeconds())
      return year + '-' + month + '-' + date + ' ' + hour + ':' + minutes + ':' + second;
    }
    return '';
  }
  export default {
    components: {
      freDialog
    },
    data() {
      return {
        logSources: [],
        frelist: [],
        freDialog: false
      }
    },
    methods: {
      formatTime: formatTime,
      gethazardLevel(num) {
        let hazardLevel = ['紧急', '严重', '警告', '提示']
        return num !== null ? hazardLevel[parseInt(num) - 1] : '-----'
      },
      showfreDialog(row) {
        this.frelist = []
        this.freDialog = true
        this.loading = true
        $axios.post(`/syslogReport/getAnalysisResultDetail/${row.uuid}`).then((res) => {
          if (res.status === 200) {
            this.frelist = res.data
            this.loading = false
          }
        })
      }
    },
    props: {
      data: {
        type: Object,
        default: {}
      }
    }
  }
</script>

<style lang="stylus">
  .myHeight
    max-height: 600px
    min-height: 300px
  .log-title
    font-weight: 700;
    height: 36px;
    line-height: 36px;
    color: #5781ad;
    font-size: 16px;
    margin-left: 10px;
</style>

