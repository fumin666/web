<template>
  <s-scrollbar wrap-style="max-height: 600px;">
    <div class="satisfaction-survey-view">
      <h2>{{paperInfo.title}}</h2>
      <satisfaction-question
        v-for="item in paperInfo.questionList"
        :key="item.orderNumber"
        :item="item"
        :length="paperInfo.questionList.length"/>
      <s-button @click="handleExport" v-if="receivedUuid.length > 0">导出问卷</s-button>
    </div>
  </s-scrollbar>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import SatisfactionQuestion from './SatisfactionQuestion';
  import {Download} from 'sunflower-common-utils'

  export default {
    components: {
      SatisfactionQuestion
    },

    props: {
      paperUuid: {
        type: String,
        required: true
      },
      receivedUuid: String,
      historyUuid: String,
      viewMode: {
        type: String,
        default: 'question'
      }
    },

    data() {
      return {
        paperInfo: {}
      }
    },

    created() {
      if (this.viewMode === 'answer') {
        this.getPaperAnswer();
      } else {
        this.getPaperInfo();
      }
    },

    methods: {
      // 获取问题和选项信息
      getPaperInfo() {
        $axios.get(`/satisfiedsurvey/getPaperSurveyIncludeQuestion/${this.paperUuid}`).then(({data}) => {
          this.paperInfo = data.paperInfo;
        });
      },
      // 获取问题和选项及答案
      getPaperAnswer() {
        $axios.post('/satisfiedsurvey/getPaperSurveyIncludeQuestionAndResult', {
          paperUuid: this.paperUuid,
          receivedUuid: this.receivedUuid,
          historyUuid: this.historyUuid
        }).then(({ data }) => {
          if (data && typeof data === 'object') {
            if (data.paperContent && data.resultContents) {
              let question = data.paperContent.questionList;
              for (let i = 0; i < question.length; i++) {
                if (data.resultContents[i] !== undefined) {
                  if (question[i].questionType === 'multichoice') {
                    question[i].answer = data.resultContents[i].resultContent.split(',');
                  } else {
                    question[i].answer = data.resultContents[i].resultContent;
                  }
                } else {
                  question[i].answer = '';
                }
              }
              this.paperInfo = data.paperContent;
            }
          }
        });
      },

      handleExport() {
        Download(`/satisfiedsurvey/downloadSatisfiedResultPdf/${this.paperUuid}/${this.receivedUuid}/${this.historyUuid}`);
      }
    }
  }
</script>

<style>
  .satisfaction-survey-view {
    position: relative;
  }
  .satisfaction-survey-view h2 {
    font-size: 16px;
    height: 32px;
    line-height: 32px;
    font-weight: bolder;
    text-align: center;
  }
  .satisfaction-survey-view .s-button {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
