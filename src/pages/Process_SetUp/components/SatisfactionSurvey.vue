<template>
  <div class="satisfaction-survey">
    <!--工单满意度历史-->
    <satisfaction-survey-history
      v-if="currentView === 'history'"
      :log-list="logList"
      @open-config="bloomConfig = true"
      @go="go"
      @view="view"/>
    <!--问卷发送历史记录-->
    <satisfaction-survey-log
      :log-list="logList"
      v-if="currentView === 'log'"
      @go="go"
      @view="view"/>
    <satisfaction-survey-library
      v-if="currentView === 'library'"
      @go="go"/>
    <s-dialog
      v-model="bloomConfig"
      v-if="bloomConfig"
      title="问卷发送设置"
      append-to-body>
      <satisfaction-survey-config ref="surveyConfig" @closeDialog="closeBloomDialog" @view="view"/>
      <template slot="footer" class="dialog-footer">
        <s-button @click="handleConfigSave">保存</s-button>
        <s-button type="cancel" @click="bloomConfig = false">取消</s-button>
      </template>
    </s-dialog>
    <s-dialog
      width="800px"
      v-model="bloomView"
      v-if="bloomView"
      title="查看问卷">
      <satisfaction-survey-view
        :paper-uuid="currentPaperUuid"
        :received-uuid="currentReceivedUuid"
        :history-uuid="currentHistoryUuid"
        :view-mode="viewMode"/>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import SatisfactionSurveyHistory from './SatisfactionSurveyHistory';
  import SatisfactionSurveyLog from './SatisfactionSurveyLog';
  import SatisfactionSurveyLibrary from './SatisfactionSurveyLibrary';
  import SatisfactionSurveyConfig from './SatisfactionSurveyConfig';
  import SatisfactionSurveyView from './SatisfactionSurveyView';

  export default {
    components: {
      SatisfactionSurveyHistory,
      SatisfactionSurveyLog,
      SatisfactionSurveyLibrary,
      SatisfactionSurveyConfig,
      SatisfactionSurveyView
    },

    data() {
      return {
        currentView: 'history', // 当前视图 history log library
        bloomConfig: false,
        bloomView: false,
        logList: [],
        currentPaperUuid: '',
        currentReceivedUuid: '',
        currentHistoryUuid: '',
        viewMode: 'question'
      }
    },

    created() {
      this.getLogList();
    },

    methods: {
      // 问卷发送历史记录查询
      getLogList() {
        $axios.get('/satisfiedsurvey/getPaperSendHisotory').then((res) => {
          this.logList = res.data;
        });
      },

      handleConfigSave() {
        this.$refs['surveyConfig'].saveConfig();
      },

      closeBloomDialog() {
        this.bloomConfig = false;
      },

      go(view) {
        this.currentView = view;
      },

      view({paperUuid, recieverUuid, historyUuid, viewMode}) {
        this.currentPaperUuid = paperUuid;
        this.currentReceivedUuid = recieverUuid;
        this.currentHistoryUuid = historyUuid;
        this.viewMode = viewMode;
        this.bloomView = true;
      }
    }
  }
</script>

<style>
  .satisfaction-survey .iconfont:hover {
    cursor: pointer;
  }
</style>
