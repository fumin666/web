<template>
  <section id="quoteKnowledge">
    <s-row>
      <s-col :span="4" class="grid-content bg-purple">文章编号：</s-col>
      <s-col :span="6" class="grid-content bg-purple-light">
        {{knowledge.serialCode}}
      </s-col>
      <s-col :span="4" class="grid-content bg-purple">版本号：</s-col>
      <s-col :span="3" class="grid-content bg-purple-light">
        {{knowledge.knowledgeVersion}}
      </s-col>
      <s-col :span="4" class="grid-content bg-purple">引用次数：</s-col>
      <s-col :span="3" class="grid-content bg-purple-light">
        {{knowledge.citeTimes}}
      </s-col>
    </s-row>

    <s-scrollbar wrap-style="max-height: 400px;">
      <div>问题描述：</div>
      <s-row>
        <s-col
          :span="24"
          class="grid-content bg-purple-light detailDesc">
          {{knowledge.detailDesc}}
        </s-col>
      </s-row>

      <div>解决方案：</div>
      <s-row>
        <s-col
          :span="24"
          class="grid-content bg-purple-light solution"
          v-html="knowledge.solutionContent" >
        </s-col>
      </s-row>
    </s-scrollbar>

    <s-row style="text-align: right;">
      <s-button @click="saveQuote">引用</s-button>
      <s-button @click="cancelQuote">取消</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{
    data() {
      return {}
    },
    props: {
      knowledge: {
        type: Object,
        required: true
      }
    },
    methods: {
      // 保存引用
      saveQuote() {
        let orderUuid = this.$route.query.orderUuid;
        let orderType = this.$route.query.orderType;
        $axios.get(`/itilKnowledgeOrder/citeKnowledgeOrder/${this.knowledge.uuid}/${orderUuid}/${orderType}`).then(({data}) => {
          if (data && data.state) {
            // 向localStorage临时写入QUOTE-FRESH字段，触发onstorage事件
            window.localStorage.setItem('QUOTE-FRESH', new Date().getTime());
            this.$message.success('知识引用成功！');
            this.$emit('closeDialog', false);
          } else {
            this.$message.error('引用失败，请重试！');
          }
        });
      },
      // 取消引用
      cancelQuote() {
        this.$emit('closeDialog', true);
      }
    },
    created() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #quoteKnowledge
    .detailDesc,.solution
      min-height 120px
</style>
