<template>
  <div class="satisfaction-survey-submit">
    <header>
      <div>
        <img src="static/images/logo/logo.svg"/>
      </div>
    </header>
    <div class="satisfaction-survey-submit-body">
      <h2>{{paperInfo.title}}</h2>
      <div
        class="question"
        v-for="item in paperInfo.questionList"
        :key="item.orderNumber">
        <h3>{{item.orderNumber}}. {{item.questionContent}}</h3>
        <div v-if="item.questionType === 'singlechoice' || item.questionType === 'point'">
          <s-radio
            v-for="answer in item.answerInfoList"
            :key="answer.id"
            :label="answer.answerUuid"
            v-model="item.answer">{{answer.answerContent}}</s-radio>
        </div>
        <div v-else-if="item.questionType === 'multichoice'">
          <s-checkbox-group v-model="item.answer">
            <s-checkbox
              v-for="answer in item.answerInfoList"
              :key="answer.id"
              :label="answer.answerUuid">{{answer.answerContent}}</s-checkbox>
          </s-checkbox-group>
        </div>
        <div v-else-if="item.questionType === 'text'">
          <s-input
            type="textarea"
            :rows="6"
            v-model="item.answer"/>
        </div>
      </div>
      <div class="submit">
        <s-button @click="submit" :disabled="percentage !== 100">提交</s-button>
      </div>
    </div>
    <div class="satisfaction-survey-percentage">
      <s-progress :percentage="percentage"></s-progress>
    </div>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        paperUuid: this.$route.params.paperUuid,
        userUuid: this.$route.params.userUuid,
        historyUuid: this.$route.params.historyUuid,
        paperInfo: {
          questionList: []
        }
      }
    },

    computed: {
      percentage() {
        let complete = 0;
        if (this.paperInfo.questionList && this.paperInfo.questionList.length > 0) {
          for (let i = 0; i < this.paperInfo.questionList.length; i++) {
            if (this.paperInfo.questionList[i].answer.length > 0) {
              complete++;
            }
          }
          return parseInt(complete / this.paperInfo.questionList.length * 100);
        } else {
          return 0;
        }
      }
    },

    created() {
      this.getPaper();
    },

    methods: {
      getPaper() {
        $axios.get(`/satisfiedsurvey/getPaperSurveyIncludeQuestion/${this.paperUuid}`).then((res) => {
          for (let i = 0; i < res.data.paperInfo.questionList.length; i++) {
            if (res.data.paperInfo.questionList[i].questionType === 'multichoice') {
              res.data.paperInfo.questionList[i].answer = [];
            } else {
              res.data.paperInfo.questionList[i].answer = '';
            }
          }
          res.data.paperInfo.questionList.sort((a, b) => a.orderNumber - b.orderNumber);
          this.paperInfo = res.data.paperInfo;
        });
      },

      submit() {
        let data = [];
        for (let i = 0; i < this.paperInfo.questionList.length; i++) {
          data.push({
            questionUuid: this.paperInfo.questionList[i].questionUuid,
            resultContent: this.paperInfo.questionList[i].answer.toString(),
            userUuid: this.userUuid,
            historyUuid: this.historyUuid
          });
        }
        $axios.post('/satisfiedsurvey/savePaperResult', data).then((res) => {
          if (res.data.result === true) {
            this.$message({type: 'success', message: '提交问卷成功'});
          } else {
            this.$message({type: 'error', message: res.data.message});
          }
        });
      }
    }
  }
</script>

<style>
  .satisfaction-survey-submit {
    min-height: 100vh;
  }
  .satisfaction-survey-submit header div {
    width: 100%;
    height: 35px;
  }
  .satisfaction-survey-submit header div img{
    width: 100%;
    height: 35px;
  }
  .satisfaction-survey-submit-body {
    width: 800px;
    margin: 0 auto 60px auto;
  }
  .satisfaction-survey-submit-body h2 {
    font-size: 18px;
    font-weight: bolder;
    text-align: center;
    border-bottom: 1px solid #ccc;
    height: 46px;
    line-height: 46px;
  }
  .satisfaction-survey-submit-body .question h3 {
    font-weight: bold;
    height: 40px;
    line-height: 40px;
  }
  .satisfaction-survey-submit-body .s-radio,
  .satisfaction-survey-submit-body .s-checkbox {
    display: block;
    margin: 6px 0 6px 30px;
  }
  .satisfaction-survey-submit-body .submit {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .satisfaction-survey-percentage {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .satisfaction-survey-percentage .s-progress {
    line-height: 60px;
  }
  .satisfaction-survey-submit .s-textarea {
    width: calc(100% - 30px);
    margin-left: 30px;
  }
</style>
