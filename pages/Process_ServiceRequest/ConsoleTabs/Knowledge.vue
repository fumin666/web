<template>
  <section class="c-knowledge" style="width: 100%;overflow: hidden">
    <s-row class="main-content" :gutter="15">
      <s-col :span="3" id="leftTreeMenu">
        <s-tree
          ref="tree"
          :data="leftTreeMenu"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          :default-checked-keys="['knowledge']"
          style="background-color: transparent; padding-bottom: 10px"
          @node-click="clickTreeNode">
            <span class="custom-tree-node" slot-scope="{ node, data }" :title="node.label"
                  style="font-size: 14px;vertical-align: middle;color: #3d454c">
              <span class="treeContentLabel">{{ node.label }}</span>
              <input class="treeNodeKey" type="hidden" :value="`${data.ownerUuid}_${data.uuid}`"/>
            </span>
        </s-tree>
      </s-col>
      <s-col :span="21">
        <s-table-page
          :data="knowledgeList"
          
          :header-search="defSearch()"
          >
          <s-table-column label="知识库文章编号" prop="serialCode" width="140"></s-table-column>
          <s-table-column label="知识库标题" prop="briefDesc" width="160"></s-table-column>
          <s-table-column label="提交时间" prop="createTime"></s-table-column>
          <s-table-column label="知识库类别" prop="knowledgeTypeName"></s-table-column>
          <s-table-column label="分类一级" prop="categoryFirstName"></s-table-column>
          <s-table-column label="操作" width="170">
            <template slot-scope="scope">
              <span class="actionCol">
                <i class="iconfont icon-eye" title="查看" @click="viewKnowledgeDetail(scope.row)"></i>
                <i
                  :class="['iconfont', scope.row.isConcern?'icon-star-full':'icon-star-empty']"
                  :title="scope.row.isConcern?'取消关注':'关注'"
                  @click="attendOrCancelKnowledge(scope.row)">
                </i>
                <i class="iconfont icon-back-square" title="反馈" @click="feedback(scope.row)"></i>
              </span>
            </template>
          </s-table-column>
        </s-table-page>
      </s-col>
    </s-row>

    <!--反馈评分-->
    <s-dialog
      ref="feedbackDialog"
      v-model="feedbackDialog"
      v-if="feedbackDialog"
      title="反馈评分"
      width="750px">
      <feedback :detail="rowData" @closeDialog="closeFeedback"></feedback>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  
  import Feedback from '@/pages/Process_Knowledge/DetailDialog/Feedback';

  export default {
    components: {
      Feedback
    },
    data () {
      return {
        /* 知识库分类左侧树数据 */
        leftTreeMenu: [],             // 左侧知识库分类树
        defaultProps: {
          label: 'name',
          children: 'childrenList'
        },
        curTreeNodeUuid: '',
        /* 知识库表格列表数据 */
        knowledgeList: [],            // 知识库表格列表
        feedbackDialog: false,        // 知识库反馈评分弹框
        rowData: {},                  // 表格行内操作行内数据
        /* 动态高度计算数据 */
        scrollbarHeight: 500,
        spanLeft: 4,
        spanRight: 19
      }
    },
    methods: {
      // 表头查询定义
      defSearch() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['serialCode', 'briefDesc', 'createTime', 'knowledgeTypeName', 'categoryFirstName'] // can be string or Array
        }
      },
      // 获取左侧树数据
      getKnowledgeLeftTree() {
        $axios.get('/itilKnowledgeOrder/knowledgeCategoryCountTree/0').then(({data}) => {
          if (data && data instanceof Array) {
            this.leftTreeMenu = data;
          }
        });
      },
      // 查询/搜索知识库列表
      getKnowledgeList() {
        let search = {
          status: 5,
          categoryUuid: this.curTreeNodeUuid,
          searchStr: ''
        };
        $axios.post('/itilKnowledgeOrder/searchKnowledge', search).then(({data}) => {
          if (data && data instanceof Array) {
            this.knowledgeList = data;
          }
        });
      },
      // 左侧树节点点击事件
      clickTreeNode (node) {
        this.curTreeNodeUuid = node.uuid;
        this.getKnowledgeList();
      },
      // 查看知识库详情
      viewKnowledgeDetail(row) {
        this.$router.push(`knowDetail/${row.uuid}`);
      },
      // 关注知识库
      attendOrCancelKnowledge(row) {
        if (!row.isConcern) {
          // 关注该知识库
          $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${row.uuid}/4`).then(({data}) => {
            if (typeof data === 'string') {
              this.getKnowledgeList();
              this.$message.success('该工单关注成功！');
            } else {
              this.$message.error('关注失败，请重试！');
            }
          });
        } else {
          // 取消关注该知识库
          $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${row.concernUuid}`).then(({data}) => {
            if (data.state === true) {
              this.getKnowledgeList();
              this.$message.success('该工单关注已取消！');
            } else {
              this.$message.error('取消关注失败，请重试！');
            }
          });
        }
      },
      // 知识库反馈
      feedback(row) {
        this.rowData = row;
        this.feedbackDialog = true;
      },
      // 关闭知识库反馈弹框
      closeFeedback(cancel) {
        this.feedbackDialog = false;
        !cancel && this.getKnowledgeList();
      }
    },
    created() {
      this.getKnowledgeLeftTree();      // 获取左侧知识库分类树数据
      this.getKnowledgeList();          // 查询全部知识库
    },
    mounted() {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .Process_knowledge
    padding 15px
    .main-content
      .tableToolBar
        .s-form .s-form-item
          margin-bottom 0
      .sc-table
        .actionCol
          .iconfont
            margin-right 10px
</style>
