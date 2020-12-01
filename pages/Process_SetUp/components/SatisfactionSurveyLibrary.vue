<template>
  <s-row class="satisfaction-survey-library" style="height: 100%;">
    <!--左侧问卷树-->
    <s-col :span="4">
      <div class="satisfaction-library-left">
        <div class="satisfaction-library-left-header">
          <h3>问卷库</h3>
          <i class="iconfont icon-order-add" @click="handlePaperAdd"></i>
        </div>
        <div class="satisfaction-library-left-body">
          <div
            v-for="(li, idx) in lists"
            :key="idx">
            <span @click="handlePaperClick(li.value)">{{li.label}}</span>
            <i
              class="iconfont icon-delete"
              v-if="idx > 0"
              @click="handlePaperDelete(li.value)"/>
          </div>
        </div>
      </div>
    </s-col>
    <!--右侧问卷内容-->
    <s-scrollbar wrap-style="height: calc(100vh - 180px);">
      <s-col :span="20" :class="{'satisfaction-library-modify': mode === 'modify'}" class="satisfaction-library-right">
        <div class="satisfaction-library-right-header">
          <s-button
            v-if="mode === 'view'"
            icon="edit"
            @click="handleTRBtnClick">编辑</s-button>
          <div v-if="mode === 'modify'">
            <s-button @click="handleNewQue('singlechoice')">单选题</s-button>
            <s-button @click="handleNewQue('multichoice')">多选题</s-button>
            <s-button @click="handleNewQue('text')">文本</s-button>
            <s-button @click="handleNewQue('point')">评分</s-button>
          </div>
          <s-button
            icon="arrow-left"
            title="返回"
            @click="goHistory"/>
        </div>
        <h2>
          <s-input
            v-if="mode === 'modify'"
            v-model.trim="paperInfo.title"
            @blur="handleTitleBlur"/>
          <template v-else>{{paperInfo.title}}</template>
        </h2>
        <div v-for="item in paperInfo.questionList" :key="item.orderNumber">
          <satisfaction-question
            v-if="mode === 'view'"
            :item="item"
            :length="paperInfo.questionList.length"
            @move-top="handleMoveTop"
            @move-bottom="handleMoveBottom"
            @delete="handleDelete"
            @update-item="handleUpdateItem"/>
          <satisfaction-question-modify
            v-if="mode === 'modify'"
            :item="item"
            :length="paperInfo.questionList.length"
            @move-top="handleMoveTop"
            @move-bottom="handleMoveBottom"
            @delete="handleDelete"
            @update-item="handleUpdateItem"/>
        </div>

        <div style="text-align: center">
          <s-button @click="handleTRBtnClick" v-if="mode === 'modify'">完成</s-button>
        </div>
      </s-col>
    </s-scrollbar>
  </s-row>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { map2Arr } from 'sunflower-common-utils';
  import SatisfactionQuestion from './SatisfactionQuestion';
  import SatisfactionQuestionModify from './SatisfactionQuestionModify';

  export default {
    components: {
      SatisfactionQuestion,
      SatisfactionQuestionModify
    },

    data() {
      return {
        lists: [],
        paperInfo: {},
        mode: 'view',
        newQue: {
          questionType: null,
          questionContent: '',
          orderNumber: null,
          answerInfoList: [],
          surveyUuid: null,
          answer: ''
        },
        currentPaperUuid: ''
      }
    },

    created() {
      this.getTree();
    },

    methods: {
      getTree(uuid) {
        $axios.get('/satisfiedsurvey/getAllPaper').then((res) => {
          this.lists = map2Arr(res.data);
          if (uuid) {
            this.currentPaperUuid = uuid;
          } else {
            this.currentPaperUuid = this.lists[0].value;
          }
          this.getPaperSurveyQue();
        });
      },

      getPaperSurveyQue() {
        $axios.get(`/satisfiedsurvey/getPaperSurveyIncludeQuestion/${this.currentPaperUuid}`).then((res) => {
          for (let i = 0; i < res.data.paperInfo.questionList.length; i++) {
            if (res.data.paperInfo.questionList[i].questionType === 'multichoice') {
              res.data.paperInfo.questionList[i].answer = [];
            } else {
              res.data.paperInfo.questionList[i].answer = '';
            }
            let que = res.data.paperInfo.questionList[i];
            if (que.questionType !== 'text') {
              for (let j = 0; j < que.answerInfoList.length; j++) {
                que.answerInfoList[j].mode = 'view';
              }
            }
          }
          res.data.paperInfo.questionList.sort((a, b) => {
            return a.orderNumber - b.orderNumber;
          });
          this.paperInfo = res.data.paperInfo;
        })
      },

      handlePaperClick(uuid) {
        if (this.mode === 'modify') {
          this.$confirm('正在进行编辑，是否离开？', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.getTree(uuid);
            this.mode = 'view';
          }).catch(() => {});
        } else {
          this.currentPaperUuid = uuid;
          this.getPaperSurveyQue();
        }
      },

      handleTRBtnClick() {
        if (this.mode === 'view') { // 进入编辑模式
          this.mode = 'modify';
        } else { // 进行保存操作
          if (this.paperInfo.title.length > 0 && this.paperInfo.title.length < 21) {
            console.log(this.paperInfo.title);
            for (let i = 0; i < this.paperInfo.questionList.length; i++) {
              // 循环检查题目长度
              console.log(this.paperInfo.questionList[i].questionContent.length)
              let question = this.paperInfo.questionList[i];
              if (question.questionContent.length === 0) {
                this.$message({type: 'error', message: `第${i + 1}道题的题目不能为空`});
                return false;
              } else if (question.questionContent.length > 50) {
                this.$message({type: 'error', message: `第${i + 1}道题的题目长度不能超过50个字符`});
                return false;
              }
              if (question.questionType !== 'text') {
                // 循环检查选项长度
                for (let j = 0; j < question.answerInfoList.length; j++) {
                  let answerContent = question.answerInfoList[j].answerContent;
                  if (answerContent.length === 0) {
                    this.$message({type: 'error', message: `第${i + 1}道题的选项${j + 1}不能为空`});
                    return false;
                  } else if (answerContent.length > 50) {
                    this.$message({type: 'error', message: `第${i + 1}道题的选项${j + 1}长度不能超过50个字符`});
                    return false;
                  }
                }
              }
            }
            if (this.paperInfo.surveyUuid.length > 0) {
              $axios.post('/satisfiedsurvey/updatePaperSurvey', this.paperInfo, {
                data: [],
                logTemplate: '编辑|满意度调查>问卷库'
              }).then(res => {
                if (res.data === true) {
                  this.$message({type: 'success', message: '保存成功'});
                  this.getTree();
                  this.mode = 'view';
                } else {
                  this.$message({type: 'error', message: '保存失败'});
                }
              });
            } else {
              $axios.post('/satisfiedsurvey/addPaperSurvey', this.paperInfo, {
                data: [],
                logTemplate: '添加|满意度调查>问卷库'
              }).then(({ data }) => {
                if (data === true) {
                  this.$message({type: 'success', message: '新建问卷成功'});
                  this.getTree();
                  this.mode = 'view';
                } else {
                  this.$message({type: 'error', message: '新建问卷失败'});
                }
              });
            }
          } else if (this.paperInfo.title.length > 20) {
            this.$message({type: 'error', message: '问卷名长度不能超过20个字符'});
            return false;
          } else {
            this.$message({type: 'error', message: '请输入问卷名称'});
            return false;
          }
        }
      },

      handleMoveTop(idx) {
        if (this.paperInfo.questionList[idx - 1]) {
          let questionA = Object.assign({}, this.paperInfo.questionList[idx - 1], {orderNumber: idx + 1});
          let questionB = Object.assign({}, this.paperInfo.questionList[idx], {orderNumber: idx});
          this.paperInfo.questionList.splice(idx - 1, 1, questionB);
          this.paperInfo.questionList.splice(idx, 1, questionA);
        }
      },

      handleMoveBottom(idx) {
        if (this.paperInfo.questionList[idx + 1]) {
          let questionA = Object.assign({}, this.paperInfo.questionList[idx], {orderNumber: idx + 2});
          let questionB = Object.assign({}, this.paperInfo.questionList[idx + 1], {orderNumber: idx + 1});
          this.paperInfo.questionList.splice(idx, 1, questionB);
          this.paperInfo.questionList.splice(idx + 1, 1, questionA);
        }
      },

      handleDelete(idx) {
        this.paperInfo.questionList.splice(idx, 1);
        for (let i = idx; i < this.paperInfo.questionList.length; i++) {
          this.paperInfo.questionList[i].orderNumber --;
        }
      },

      handlePaperAdd() {
        this.$prompt('请输入问卷名称', '新增', {
          inputValidator: function(val) {
            if (val !== null && val.replace(/(^\s*)(\s*$)/g, '').length > 0) {
              return true;
            } else {
              return false;
            }
          },
          inputErrorMessage: '问卷名称不能为空'
        }).then(({ value }) => {
          this.lists.push({
            label: value.replace(/(^\s*)(\s*$)/g, ''),
            value: ''
          });
          this.paperInfo = {
            title: value.replace(/(^\s*)(\s*$)/g, ''),
            surveyUuid: '',
            questionList: [
              {
                answerInfoList: [
                  {
                    mode: 'modify',
                    itemOrder: 0,
                    answerContent: '选项一',
                    uuid: ''
                  }
                ],
                orderNumber: 1,
                questionContent: '新建题目',
                questionType: 'singlechoice',
                questionUuid: '',
                surveyUuid: '',
                answer: ''
              }
            ]
          };
          this.mode = 'modify';
        }).catch(() => {});
      },

      handlePaperDelete(uuid) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/satisfiedsurvey/deletePaperSurvey/${uuid}`).then((res) => {
            if (res.data.result === true) {
              this.$message({type: 'success', message: '删除问卷成功'});
              this.getTree();
            } else {
              this.$message({type: 'error', message: res.data.message});
            }
          });
        }).catch(() => {});
      },

      handleNewQue(type) {
        let questionList = this.paperInfo.questionList;
        let question = {
          orderNumber: questionList[questionList.length - 1].orderNumber + 1,
          questionContent: '新建题目',
          questionType: type,
          surveyUuid: this.paperInfo.surveyUuid,
          answer: '',
          answerInfoList: []
        };
        if (type === 'singlechoice') {
          question.answerInfoList.push({
            mode: 'modify',
            itemOrder: 0,
            answerContent: '选项一'
          });
        } else if (type === 'multichoice') {
          question.answer = [];
          question.answerInfoList.push({
            mode: 'modify',
            itemOrder: 0,
            answerContent: '选项一'
          });
        } else if (type === 'point') {
          question.answerInfoList.push({
            mode: 'modify',
            itemOrder: 0,
            answerContent: '选项一',
            points: 1
          });
        }
        this.paperInfo.questionList.push(question);
        this.$message({type: 'success', message: '添加题目成功'});
      },

      handleUpdateItem(item) {
        this.paperInfo.questionList.splice(item.orderNumber - 1, 1, item);
      },

      goHistory() {
        if (this.mode === 'modify') {
          this.$confirm('正在进行编辑，是否离开？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('go', 'history');
          }).catch(() => {});
        } else {
          this.$emit('go', 'history');
        }
      },

      handleTitleBlur() {
        if (this.paperInfo.title.length > 20) {
          this.$message({type: 'error', message: '问卷名长度不能超过20个字符'});
        }
      }
    }
  }
</script>

<style>
  .satisfaction-library-left {
    padding-right: 12px;
  }
  .satisfaction-library-left-header {
    position: relative;
  }
  .satisfaction-library-left-header h3 {
    font-size: 16px;
    height: 32px;
    line-height: 32px;
  }
  .satisfaction-library-left-header .iconfont {
    font-size: 24px;
    position: absolute;
    right: 6px;
    top: 3px;
  }
  .satisfaction-library-left-body>div {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    display: flex;
  }
  .satisfaction-library-left-body>div:hover .iconfont {
    display: inline;
  }
  .satisfaction-library-left-body span {
    flex: 1
  }
  .satisfaction-library-left-body .iconfont {
    width: 48px;
    text-align: center;
    display: none;
  }

  .satisfaction-library-right {
    position: relative;
  }
  .satisfaction-library-right-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .satisfaction-library-right>h2 {
    font-size: 28px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    margin-bottom: 20px;
  }
  .satisfaction-library-right>h2 .s-input {
    font-size: 28px;
    width: 40%;
    min-width: 200px;
  }
  .satisfaction-library-right .s-table .s-input {
    width: 80%;
  }
</style>
