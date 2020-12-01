<template>
  <section id="feedbackScore">
    <s-table-page
      :data="feedbackScoreLists"
      :header-search="defSearch()"
      :row-actions="defRowActions()"
      actions-col-width="40px">
      <s-table-column label="版本号" prop="knowledgeVersion" width="80"></s-table-column>
      <s-table-column label="反馈内容" prop="discuss" width="200"></s-table-column>
      <s-table-column label="评分" width="180" class="rateCol">
        <template slot-scope="scope">
          <s-rate
            v-model="scope.row.score"
            disabled show-text text-template="{value}">
          </s-rate>
        </template>
      </s-table-column>
      <s-table-column label="反馈时间" prop="createTime"></s-table-column>
      <s-table-column label="反馈人" prop="createUserName"></s-table-column>
    </s-table-page>

    <s-dialog
      v-model="viewFeedbackDialog"
      v-if="viewFeedbackDialog"
      title="反馈评分详情"
      width="700px"
      ref="viewFeedbackDialog">
      <view-feedback :feedbackDetail="rowData"></view-feedback>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  import ViewFeedback from '../DetailDialog/ViewFeedback';

  export default{
    components: {

      ViewFeedback
    },
    data() {
      return {
        uuid: this.$route.params.uuid,
        feedbackScoreLists: [],
        rowData: {},
        viewFeedbackDialog: false
      }
    },
    props: {
      isFreshTable: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isFreshTable(newVal) {
        if (newVal) {
          this.getFeedbackScoreLists();     // 刷新反馈信息列表
        }
      }
    },
    methods: {
      defSearch() {
        return {
          width: 8,
          offset: 16,
          placeholder: '请输入查询条件',
          searchProps: ['knowledgeVersion', 'discuss', 'scope', 'createTime', 'createUserName']
        }
      },
      // 行内操作初始化
      defRowActions() {
        let _this = this;
        return [{
          name: '查看',
          icon: 'eye',
          click(row) {
            _this.rowData = row;
            _this.viewFeedbackDialog = true;
          }
        }]
      },
      // 获取反馈信息列表
      getFeedbackScoreLists() {
        $axios.get(`/itilKnowledgeOrder/getKnowledgeDiscussList/${this.uuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.feedbackScoreLists = data;
          }
        });
      }
    },
    created() {
      this.getFeedbackScoreLists();     // 获取反馈信息列表
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #feedbackScore
    .s-table
      .s-rate .s-rate__item .iconfont
        margin-right 8px
</style>
