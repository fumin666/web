<template>
  <section id="feedback">
    <s-form
      ref="feedbackForm"
      :model="feedbackForm"
      :rules="feedbackFormRules"
      label-width="95px">
      <s-row>
        <s-col :span="10">
          <s-form-item label="文章编号：" required>
            <s-input v-model="detailForm.serialCode" disabled></s-input>
          </s-form-item>
        </s-col>
        <s-col :span="7">
          <s-form-item label="版本号：" required>
            <s-input v-model="detailForm.knowledgeVersion" disabled></s-input>
          </s-form-item>
        </s-col>
        <s-col :span="7">
          <s-form-item label="引用次数：" required>
            <s-input v-model="detailForm.citeTimes" disabled></s-input>
          </s-form-item>
        </s-col>
      </s-row>
      <s-form-item label="标题：" required>
        <s-input v-model="detailForm.briefDesc" disabled></s-input>
      </s-form-item>
      <s-form-item label="知识评分：" prop="score" required>
        <s-rate
          v-model="feedbackForm.score"
          show-text
          :texts="[1,2,3,4,5]"
          text-template="{value}"></s-rate>
      </s-form-item>
      <s-form-item label="反馈内容：" prop="discuss">
        <s-input
          v-model="feedbackForm.discuss"
          type="textarea" :rows="5" resize="none"></s-input>
      </s-form-item>

      <s-row style="text-align: right;">
        <s-button @click="saveFeedback">保存</s-button>
        <s-button type="cancel" @click="cancelFeedback">取消</s-button>
      </s-row>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { intersectObj } from 'sunflower-common-utils'

  export default{
    data() {
      let checkScore = (rule, value, callback) => {
        if (value <= 0) callback(new Error('请选择评分'));
        else callback();
      };

      return {
        detailForm: {
          serialCode: '',
          knowledgeVersion: '',
          citeTimes: '',
          briefDesc: ''
        },
        feedbackForm: {
          score: 0,
          discuss: '',
          knowledgeUuid: '',
          knowledgeVersion: ''
        },
        feedbackFormRules: {
          score: [{validator: checkScore, trigger: 'blur'}],
          discuss: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      }
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // 保存反馈评分
      saveFeedback() {
        this.$refs.feedbackForm.validate(valid => {
          if (valid) {
            $axios.post('/itilKnowledgeOrder/saveKnowledgeDiscuss', this.feedbackForm).then(({data}) => {
              if (data.state) {
                this.$message.success('评分成功！');
                this.$emit('closeDialog', false);
              } else {
                this.$message.error('评分失败，请重试！');
              }
            });
          } else {
            return false;
          }
        });
      },
      // 取消反馈评分
      cancelFeedback() {
        this.$emit('closeDialog', true);
      }
    },
    created() {
      this.detailForm = intersectObj(this.detailForm, this.detail);     // 获取编号/版本号/引用次数/标题信息
      this.$set(this.feedbackForm, 'knowledgeUuid', this.detail.uuid);  // 知识库uuid
      this.$set(this.feedbackForm, 'knowledgeVersion', this.detail.knowledgeVersion);     // 版本号
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #feedback
    .s-form
      .s-rate
        line-height 38px
</style>
