<template>
  <div>
    <div class="satisfaction-question">
      <h3>{{item.orderNumber}}. {{item.questionContent}} <span class="multichoice" v-if="item.questionType === 'multichoice'">[多选题]</span></h3>
      <div v-if="item.questionType === 'singlechoice' || item.questionType === 'point'">
        <s-radio
          disabled
          v-for="(answer, idx) in item.answerInfoList"
          :key="answer.id"
          :label="answer.answerUuid ? answer.answerUuid : idx"
          v-model="item.answer">{{answer.answerContent}}</s-radio>
      </div>
      <div v-else-if="item.questionType === 'text'">
        <s-input
          disabled
          type="textarea"
          :rows="6"
          v-model="item.answer"/>
      </div>
      <div v-else-if="item.questionType === 'multichoice'">
        <s-checkbox-group
          v-model="item.answer">
          <s-checkbox
            disabled
            v-for="(answer, idx) in item.answerInfoList"
            :key="answer.id"
            :label="answer.answerUuid ? answer.answerUuid : idx">{{answer.answerContent}}</s-checkbox>
        </s-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style>
  .satisfaction-question {
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
    min-height: 140px;
  }
  .satisfaction-question .s-radio ,
  .satisfaction-question .s-checkbox {
    display: block;
    margin-left: 30px;
    margin-bottom: 12px;
    font-weight: normal;
  }
  .satisfaction-question .s-textarea {
    width: 600px;
    margin-left: 30px;
  }
  .satisfaction-question>h3 {
    font-size: 14px;
    padding-bottom: 10px;
    font-weight: normal;
    margin: 0;
  }
</style>
