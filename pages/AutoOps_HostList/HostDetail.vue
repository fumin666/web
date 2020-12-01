<template>
  <section id="hostDetail">
    <s-row class="title-txt">
      <s-col :span="12">
        <div class="title">
          <i class="iconfont icon-host"></i>主机详情
        </div>
      </s-col>
      <s-col :span="12">
      </s-col>
    </s-row>

    <s-collapse v-model="activeItems">
      <s-collapse-item name="1">
        <template slot="title">
          <span class="collapseItemTitle">基础信息</span>
        </template>
        <s-row>
          <s-col :span="6">
            <div style="text-align:center;margin-left: -15px;">
              <img :src="hostSysImgSrc" :alt="hostDetail.productname"/>
              <!--<div
                :style="{color: calHostStatus(hostDetail.status).color}">
                {{calHostStatus(hostDetail.status).text}}
              </div>-->
              <div>主机名：{{hostDetail.itcompname}}</div>
            </div>
          </s-col>
          <s-col :span="18">
            <s-row>
              <s-col :span="2" class="grid-content">操作系统：</s-col>
              <s-col :span="6" class="grid-content">{{hostDetail.productname}}</s-col>
              <s-col :span="2" class="grid-content">IP地址：</s-col>
              <s-col :span="6" class="grid-content">{{hostDetail.controladderss}}</s-col>
              <s-col :span="2" class="grid-content">CPU：</s-col>
              <s-col :span="6" class="grid-content">{{hostDetail.cpu}} 核</s-col>
            </s-row>
            <s-row>
              <s-col :span="2" class="grid-content">内存：</s-col>
              <s-col :span="6" class="grid-content">{{hostDetail.memory}} M</s-col>
              <s-col :span="2" class="grid-content">磁盘：</s-col>
              <s-col :span="6" class="grid-content">{{hostDetail.disk}} GB</s-col>
              <s-col :span="8">
                <s-button @click="scriptExecute">脚本执行</s-button>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
      </s-collapse-item>
      <!--<s-collapse-item name="2">
        <template slot="title">
          <span class="collapseItemTitle">监控信息</span>
        </template>
      </s-collapse-item>-->
      <s-collapse-item name="3">
        <template slot="title">
          <span class="collapseItemTitle">脚本运维记录</span>
        </template>
        <s-row>
          <s-scrollbar wrap-class="scriptExeHistoryListCtn">
            <s-col
              :span="24"
              v-if="scriptExeHistoryList.length === 0"
              style="text-align: center;">暂无数据
            </s-col>
            <s-col
              v-else
              :span="3"
              v-for="(i, idx) in scriptExeHistoryList"
              :key="idx">
              <div
                class="scriptItem" title="点击可查看脚本执行历史记录"
                @click="viewScriptExeHistory(i)">
                <div class="scriptItemIcon">
                  <img :src="`./static/images/autoOps/script-icon-${sysTheme}.png`" :alt="`脚本-${i.scriptName}`"/>
                  <span class="scriptStatus" :style="{background: calScriptStatus(i.excuteStatus).color}">
                    {{ calScriptStatus(i.excuteStatus).text }}
                  </span>
                </div>
                <div class="scriptTip" title="脚本名称">{{i.scriptName}}</div>
                <div class="scriptTip" title="创建时间">{{i.createTime}}</div>
              </div>
            </s-col>
          </s-scrollbar>
        </s-row>
      </s-collapse-item>
    </s-collapse>

    <s-dialog
      v-model="scriptHistoryDialog"
      v-if="scriptHistoryDialog"
      title="脚本执行历史记录"
      width="800px">
      <script-exe-history :historyDetail="historyDetail"></script-exe-history>
    </s-dialog>

    <s-dialog
      v-model="scriptExeDialog"
      v-if="scriptExeDialog"
      title="执行脚本"
      width="850px">
      <script-execute
        type="single"
        :exeingHostsData="exeingHostsData"
        @freshScriptHistory="getHostDetail()"></script-execute>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import mixins from './MethodsMixin';
  import ScriptExeHistory from './ScriptExeHistory';
  import ScriptExecute from './ScriptExecute';

  export default{
    data() {
      return {
        activeItems: ['1', '2', '3'],
        hostDetail: {},               // 主机详情
        scriptExeHistoryList: [],     // 脚本运维历史记录列表
        scriptExeDialog: false,       // 执行脚本弹框
        exeingHostsData: [],          // 当前要执行脚本的主机列表
        scriptHistoryDialog: false,   // 某条脚本执行记录详情弹框
        historyDetail: {}             // 某条脚本执行记录的详情
      }
    },
    mixins: [mixins],
    components: {
      ScriptExecute,
      ScriptExeHistory
    },
    computed: {
      sysTheme() {
        let theme = window.localStorage.getItem('theme');
        return (!theme || theme !== 'dark') ? 'chalk' : 'dark'
      },
      hostSysImgSrc() {
        switch (this.hostDetail.productname) {
          case 'Windows': return './static/images/topologyicon/default/Windows.png';
          case 'RedhatLinux':
          case 'ifcos':
            return './static/images/topologyicon/default/Linux.png';
          case 'Solaris': return './static/images/topologyicon/default/Solaris.png';
          case 'AIX': return './static/images/topologyicon/default/AIX.png';
        }
      }
    },
    methods: {
      // 获取主机详情
      getHostDetail() {
        $axios.get(`/autoMateItcomp/getAutoMateItcompInfo/${this.$route.query.uuid}`).then(({data}) => {
          if (data && data.uuid) {
            this.hostDetail = data;     // 主机详情
            this.scriptExeHistoryList = data.taskLogList ? data.taskLogList : [];     // 主机的脚本运行历史记录
          }
        })
      },
      // 执行脚本
      scriptExecute() {
        this.exeingHostsData = [this.hostDetail]
        this.scriptExeDialog = true;
      },
      // 查看某条脚本运行记录的详情
      viewScriptExeHistory(hisDetail) {
        this.historyDetail = hisDetail;
        this.scriptHistoryDialog = true;
      }
    },
    created() {
      this.getHostDetail();     // 获取主机详情
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #hostDetail
    margin-top -8px
    padding-left 10px
    .icon-cabinet
      font-weight bold
      font-size 18px
      margin-right 5px
    .title
      font-weight bold
      font-size 16px
      height 32px
      line-height 32px
      padding-left 10px
    .collapseItemTitle
      font-weight bold
    .s-collapse
      .scriptItem
        text-align center
        cursor pointer
        .scriptTip
          padding 0 4px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
    .scriptItemIcon
      position relative
      display inline-block
    .scriptStatus
      display inline-block
      width 54px
      height 22px
      line-height 22px
      border-radius 3px
      font-size 14px
      color #fff
      text-align center
      position absolute
      top 6px
      right -24px
    .scriptExeHistoryListCtn
      max-height calc(100vh - 390px)
</style>
