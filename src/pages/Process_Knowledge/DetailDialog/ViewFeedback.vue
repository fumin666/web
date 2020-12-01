<template>
  <section id="viewFeedBack">
    <s-row>
      <s-col :span="4" class="grid-content bg-purple">文章编号：</s-col>
      <s-col :span="6" class="grid-content bg-purple-light">
        {{feedbackDetail.itilKnowledgeOrder.serialCode}}
      </s-col>
      <s-col :span="4" class="grid-content bg-purple">版本号：</s-col>
      <s-col :span="3" class="grid-content bg-purple-light">
        {{feedbackDetail.knowledgeVersion}}
      </s-col>
      <s-col :span="4" class="grid-content bg-purple">引用次数：</s-col>
      <s-col :span="3" class="grid-content bg-purple-light">
        {{feedbackDetail.itilKnowledgeOrder.citeTimes}}
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="4" class="grid-content bg-purple">标题：</s-col>
      <s-col :span="20" class="grid-content bg-purple-light">
        {{feedbackDetail.itilKnowledgeOrder.briefDesc}}
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="4" class="grid-content bg-purple">知识评分：</s-col>
      <s-col :span="20" class="grid-content bg-purple-light score">
        <s-rate
          v-model="feedbackDetail.score"
          disabled
          show-text
          text-template="{value}">
        </s-rate>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="4" class="grid-content bg-purple">反馈内容：</s-col>
      <s-col :span="20" class="grid-content bg-purple-light discuss">
        {{feedbackDetail.discuss}}
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  export default{
    data() {
      return {}
    },
    props: {
      feedbackDetail: {
        type: Object,
        required: true
      }
    },
    methods: {},
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #viewFeedBack
    .score .s-rate
      line-height 36px
    .discuss
      word-break break-word
</style>
