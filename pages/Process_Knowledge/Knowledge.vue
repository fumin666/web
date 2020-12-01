<template>
  <section class="Process_knowledge">
    <s-row class="main-content" :gutter="10">
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
        <s-row class="tableToolBar">
          <s-col :span="4">
            <s-button
              :disabled="knowledgeAccess"
              @click="createKnowledge">创建</s-button>
          </s-col>
          <s-col :span="20" style="text-align: right;">
            <s-input
              v-model="searchForm.searchStr" @input="searchKnowledgeList"
              placeholder="请输入查询条件"
              style="width: 250px; float: right;"></s-input>
          </s-col>
        </s-row>
        <s-table-page
          :data="knowledgeList">
          <s-table-column label="知识库文章编号" prop="serialCode" width="140"></s-table-column>
          <s-table-column label="知识库标题" prop="briefDesc" width="160"></s-table-column>
          <s-table-column label="提交时间" prop="createTime"></s-table-column>
          <s-table-column label="分类一级" prop="categoryFirstName"></s-table-column>
          <s-table-column label="分类二级" prop="categorySecondName"></s-table-column>
          <s-table-column label="分类三级" prop="categoryThirdName"></s-table-column>
          <s-table-column label="知识库类别" prop="knowledgeTypeName"></s-table-column>
          <s-table-column label="版本号" prop="knowledgeVersion" width="80"></s-table-column>
          <s-table-column label="作者" prop="authorName"></s-table-column>
          <s-table-column label="状态" prop="knowledgeStatus" :filters="filtersState" :filter-method="filterType">
            <template slot-scope="scope">
              <span v-if="scope.row.knowledgeStatus === 1">草稿</span>
              <span v-if="scope.row.knowledgeStatus === 2">已启动</span>
              <span v-if="scope.row.knowledgeStatus === 3">发布审批</span>
              <span v-if="scope.row.knowledgeStatus === 4">待发布</span>
              <span v-if="scope.row.knowledgeStatus === 5">已发布</span>
              <span v-if="scope.row.knowledgeStatus === 6">注销审批</span>
              <span v-if="scope.row.knowledgeStatus === 7">已废弃</span>
              <span v-if="scope.row.knowledgeStatus === 8">已拒绝</span>
              <span v-if="scope.row.knowledgeStatus === 9">已取消</span>
            </template>
          </s-table-column>
          <s-table-column label="引用次数" prop="citeTimes" width="90"></s-table-column>
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

    <!--创建知识库-->
    <s-dialog
      ref="createKnowledgeDialog"
      v-model="createKnowledgeDialog"
      v-if="createKnowledgeDialog"
      title="创建知识库"
      width="750px">
      <create-knowledge ref="createKnowledge"></create-knowledge>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveCreateKnowledge">保存</s-button>
        <s-button type="cancel" @click="createKnowledgeDialog=false">关闭</s-button>
      </template>
    </s-dialog>

    <!--反馈评分-->
    <s-dialog
      ref="feedbackDialog"
      v-model="feedbackDialog"
      v-if="feedbackDialog"
      title="反馈评分"
      width="750px"
      append-to-body>
      <feedback :detail="rowData" @closeDialog="closeFeedback"></feedback>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import CreateKnowledge from '@/home/ProcessCenter/ProcessCreatOrder/KnowDialog';
  import Feedback from './DetailDialog/Feedback';

  export default {
    components: {
      CreateKnowledge,
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
        filtersState: [
          {text: '草稿', value: 1},
          {text: '已启动', value: 2},
          {text: '发布审批', value: 3},
          {text: '待发布', value: 4},
          {text: '已发布', value: 5},
          {text: '注销审批', value: 6},
          {text: '已废弃', value: 7},
          {text: '已拒绝', value: 8},
          {text: '已取消', value: 9}
        ],
        createKnowledgeDialog: false, // 创建知识库弹框
        /* 右侧表格搜索数据 */
        searchForm: {
          state: '',
          searchStr: ''
        },
        states: [],
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
    computed: {
      knowledgeAccess() {
        let knowledge = this.$store.state.processCenter.rolePro.knowledge;
        return knowledge < 0 || knowledge === null;
      }
    },
    methods: {
      filterType(value, row) {
        return row.knowledgeStatus === value
      },
      // 获取左侧树数据
      getKnowledgeLeftTree() {
        $axios.get('/itilKnowledgeOrder/knowledgeCategoryCountTree/1').then(({data}) => {
          if (data && data instanceof Array) {
            this.leftTreeMenu = data;
          }
        });
      },
      // 获取知识库状态下拉选项
      getKnowledgeStates() {
        $axios.get('/itilKnowledgeOrder/getKnowledgeOrderSelectDate').then(({data}) => {
          if (data.itilKnowledgeStatusSelect && data.itilKnowledgeStatusSelect instanceof Array) {
            this.states = data.itilKnowledgeStatusSelect;
          }
        });
      },
      // 查询/搜索知识库列表
      getKnowledgeList(searchData) {
        let search = {
          status: this.searchForm.state || null,
          categoryUuid: this.curTreeNodeUuid,
          searchStr: this.searchForm.searchStr
        };
        $axios.post('/itilKnowledgeOrder/searchKnowledge', searchData || search).then(({data}) => {
          if (data && data instanceof Array) {
            this.knowledgeList = data;
          }
        });
      },
      // 左侧树节点点击事件
      clickTreeNode (node) {
        this.curTreeNodeUuid = node.uuid;
        let searchData = {status: null, categoryUuid: node.uuid, searchStr: ''};
        this.getKnowledgeList(searchData);
      },
      // 表头搜索按钮搜索知识库
      searchKnowledgeList() {
        let searchData = {
          status: this.searchForm.state || null,
          categoryUuid: '',
          searchStr: this.searchForm.searchStr
        };
        this.getKnowledgeList(searchData);
      },
      // 创建知识库
      createKnowledge() {
        this.createKnowledgeDialog = true;
      },
      // 保存创建知识库
      saveCreateKnowledge() {
        this.$refs['createKnowledge'].$refs['knowledgeForm'].validate(valid => {
          if (!valid) return false;
          let form = this.$refs['createKnowledge'].knowledgeForm;
          form.knowledgeType = Number(form.knowledgeType);
          $axios.post('/itilKnowledgeOrder/saveKnowledgeOrder', form, {
            data: [form],
            logTemplate: '创建|知识(#serialCode#)'
          }).then((res) => {
            if (res.status === 200) {
              this.createKnowledgeDialog = false;
              this.$message.success('创建成功!');
              this.getKnowledgeList();
            } else {
              this.$message.error('创建失败，请重试!');
            }
          })
        });
      },
      // 查看知识库详情
      viewKnowledgeDetail(row) {
        this.$router.push(`/ProcessCenter/knowDetail/${row.uuid}`);
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
      },
      // 动态计算左侧树滚动最大高度
      initDivHeight () {
        let leftMenuHeight = document.getElementById('leftTreeMenu').offsetHeight;
        this.scrollbarHeight = leftMenuHeight - 20;
      },
      // 组件挂载时执行左侧树滚动最大高度计算
      hasMounted() {
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
      }
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    created() {
      this.getKnowledgeLeftTree();      // 获取左侧知识库分类树数据
      this.getKnowledgeStates();        // 获取知识库状态下拉选项
      // 查询全部知识库
      this.getKnowledgeList();
    },
    mounted() {
      // let nodes = [...this.leftTreeMenu[0].children, ...this.leftTreeMenu[1].children, ...this.leftTreeMenu[2].children, ...this.leftTreeMenu[3].children, ...this.leftTreeMenu[4].children]
      let nodes = []
      let str = this.$route.path.split('knowledge/')[1]
      for (let i in nodes) {
        if (nodes[i].uuid === str) {
          this.$refs.tree.setCurrentNode(nodes[i])
          break;
        }
      }
      // this.hasMounted()
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
        .tool-bar
          margin-bottom 0
        .actionCol
          .iconfont
            margin-right 10px
</style>
