<template>
  <section id="viewVersionRecords">
    <s-tab>
      <s-tab-pane label="内容" name="content">
        <s-scrollbar wrap-style="max-height: 520px;">
          <div>问题描述：</div>
          <s-row>
            <s-col
              :span="24"
              class="grid-content bg-purple-light detailDesc">
              {{record.detailDesc}}
            </s-col>
          </s-row>

          <div>解决方案：</div>
          <s-row>
            <s-col
              :span="24"
              class="grid-content bg-purple-light solution"
              v-html="record.solutionContent" >
            </s-col>
          </s-row>
        </s-scrollbar>
      </s-tab-pane>
      <s-tab-pane label="详情" name="detail">
        <s-scrollbar wrap-style="max-height: 520px;">
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">知识库文章编号：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.serialCode}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">标题：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.briefDesc}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">知识库类别：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.knowledgeTypeName}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">知识分类一级：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.categoryFirstName}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">知识分类二级：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.categorySecondName}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">知识分类三级：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.categoryThirdName}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">应用系统名称：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.appSystemName}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">关键字：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.keyword}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">知识库管理员组：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.adminGroupName}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">知识库管理员：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.adminUserName}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">知识所属组：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.knowledgeGroupName}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">知识拥有者：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.knowledgeUserName}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">IT内部运维使用：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.isItOperation===1?'是':'否'}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">版本号：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.knowledgeVersion}}</s-col>
          </s-row>
          <s-row>
            <s-col :span="4" class="grid-content bg-purple">引用次数：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.citeTimes}}</s-col>
            <s-col :span="4" class="grid-content bg-purple">状态：</s-col>
            <s-col :span="8" class="grid-content bg-purple-light">{{record.knowledgeStatusName}}</s-col>
          </s-row>
        </s-scrollbar>
      </s-tab-pane>
    </s-tab>
  </section>
</template>

<script type="text/babel">
  export default{
    data() {
      return {}
    },
    props: {
      record: {
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
  #viewVersionRecords
    .detailDesc,.solution
      min-height 120px
</style>
