<template>
  <div class="satisfaction-question-modify">
    <div class="satisfaction-question-modify-header">
      <div>
        <span style="font-size: 14px; color: rgb(139, 132, 132)">题型类别</span>
        <s-select v-model="item.questionType" @change="handleChange">
          <s-option label="单选题" value="singlechoice"></s-option>
          <s-option label="多选题" value="multichoice"></s-option>
          <s-option label="文本" value="text"></s-option>
          <s-option label="评分" value="point"></s-option>
        </s-select>
      </div>
      <div>
        <i class="iconfont icon-delete" title="删除" @click="handleActionsDelete"></i>
        <i class="iconfont icon-arrow-bottom" title="下移" @click="handleActionsMoveBottom"></i>
        <i class="iconfont icon-arrow-top" title="上移" @click="handleActionsMoveTop"></i>
      </div>
    </div>
    <div class="satisfaction-question-modify-body">
      <s-form label-width="28px" style="width: 600px">
        <s-form-item :label="String(item.orderNumber)">
          <s-input v-model.trim="item.questionContent" @blur="handleQuestionBlur"></s-input>
        </s-form-item>
      </s-form>
      <!--单选题-->
      <template v-if="item.questionType === 'singlechoice'">
        <div v-for="(answer, idx) in item.answerInfoList" :class="['answer-item', answer.mode === 'modify' ? 'modify' : '']" @click="handleAnswerClick(idx, $event)">
          <s-radio
            v-show="answer.mode === 'view'"
            v-model="item.answer"
            :key="answer.id"
            :label="answer.answerUuid ? answer.answerUuid : idx">{{answer.answerContent}}</s-radio>
          <s-input v-model="answer.answerContent" v-show="answer.mode === 'modify'" @blur="handleAnswerBlur(idx)"></s-input>
          <div class="action">
            <i class="iconfont icon-plus" @click="handleAnswerAdd(answer.itemOrder)"></i>
            <i class="iconfont icon-minus" @click="handleAnswerDelete(answer.itemOrder)"></i>
            <i class="iconfont icon-arrow-bottom" @click="handleAnswerMoveBottom(answer.itemOrder)"></i>
            <i class="iconfont icon-arrow-top" @click="handleAnswerMoveTop(answer.itemOrder)"></i>
          </div>
        </div>
      </template>
      <!--多选题-->
      <template v-else-if="item.questionType === 'multichoice'">
        <div v-for="(answer, idx) in item.answerInfoList" :class="['answer-item', answer.mode === 'modify' ? 'modify' : '']" @click="handleAnswerClick(idx, $event)">
          <s-checkbox-group v-model="item.answer">
            <s-checkbox
              v-show="answer.mode === 'view'"
              :key="answer.id"
              :label="answer.answerUuid ? answer.answerUuid : idx">{{answer.answerContent}}</s-checkbox>
            <s-input v-model="answer.answerContent" v-show="answer.mode === 'modify'" @blur="handleAnswerBlur(idx)"></s-input>
          </s-checkbox-group>
          <div class="action">
            <i class="iconfont icon-plus" @click="handleAnswerAdd(answer.itemOrder)"></i>
            <i class="iconfont icon-minus" @click="handleAnswerDelete(answer.itemOrder)"></i>
            <i class="iconfont icon-arrow-bottom" @click="handleAnswerMoveBottom(answer.itemOrder)"></i>
            <i class="iconfont icon-arrow-top" @click="handleAnswerMoveTop(answer.itemOrder)"></i>
          </div>
        </div>
      </template>
      <!--文本-->
      <s-input
        v-model="item.answer"
        type="textarea"
        :rows="6"
        v-if="item.questionType === 'text'"></s-input>
      <!--评分-->
      <template v-if="item.questionType === 'point'">
        <div v-for="(answer, idx) in item.answerInfoList" :class="['answer-item points', answer.mode === 'modify' ? 'modify' : '']" @click="handleAnswerClick(idx, $event)">
          <s-radio
            v-show="answer.mode === 'view'"
            v-model="item.answer"
            :key="answer.id"
            :label="answer.answerUuid ? answer.answerUuid : idx">{{answer.answerContent}}</s-radio>
          <s-input v-model="answer.answerContent" v-show="answer.mode === 'modify'" @blur="handleAnswerBlur(idx)"></s-input>
          <s-input-number
            v-model="answer.points"
            :min="0"
            :step="1"
            controls-position="bothSide"
            size="small"/>
          <div class="action">
            <i class="iconfont icon-plus" @click="handleAnswerAdd(answer.itemOrder)"></i>
            <i class="iconfont icon-minus" @click="handleAnswerDelete(answer.itemOrder)"></i>
            <i class="iconfont icon-arrow-bottom" @click="handleAnswerMoveBottom(answer.itemOrder)"></i>
            <i class="iconfont icon-arrow-top" @click="handleAnswerMoveTop(answer.itemOrder)"></i>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: { // 题目对象
        type: Object,
        required: true
      },
      length: { // 题目长度
        type: Number,
        required: true
      }
    },

    data() {
      return {
        //
      }
    },

    methods: {
      handleActionsDelete() {
        this.$emit('delete', this.item.orderNumber - 1);
      },

      handleActionsMoveTop() {
        this.$emit('move-top', this.item.orderNumber - 1);
      },

      handleActionsMoveBottom() {
        this.$emit('move-bottom', this.item.orderNumber - 1);
      },

      handleAnswerAdd(order) {
        this.item.answerInfoList.splice(order + 1, 0, { answerContent: '', itemOrder: order + 1, mode: 'modify', uuid: '', points: 1 });
        for (let i = order + 2; i < this.item.answerInfoList.length; i++) {
          this.item.answerInfoList[i].itemOrder ++;
        }
      },

      handleAnswerDelete(order) {
        this.item.answerInfoList.splice(order, 1);
        for (let i = order; i < this.item.answerInfoList.length; i++) {
          this.item.answerInfoList[i].itemOrder --;
        }
      },

      handleAnswerMoveTop(order) {
        if (this.item.answerInfoList[order - 1]) {
          this.item.answerInfoList[order].itemOrder --;
          this.item.answerInfoList[order - 1].itemOrder ++;
          this.item.answerInfoList[order] = this.item.answerInfoList.splice(order - 1, 1, this.item.answerInfoList[order])[0];
        }
      },

      handleAnswerMoveBottom(order) {
        if (this.item.answerInfoList[order + 1]) {
          this.item.answerInfoList[order].itemOrder ++;
          this.item.answerInfoList[order + 1].itemOrder --;
          this.item.answerInfoList[order + 1] = this.item.answerInfoList.splice(order, 1, this.item.answerInfoList[order + 1])[0];
        }
      },

      handleAnswerClick(idx, evt) {
        if (evt.target.className === 's-radio__label' || evt.target.className === 's-checkbox-label') {
          this.item.answerInfoList[idx].mode = 'modify';
        }
      },

      handleAnswerBlur(idx) {
        if (this.item.answerInfoList[idx].answerContent.length > 20) {
          this.$message({type: 'error', message: '选项长度不能超过20个字符'});
        } else {
          this.item.answerInfoList[idx].mode = 'view';
        }
      },

      handleQuestionBlur() {
        if (this.item.questionContent.length > 20) {
          this.$message({type: 'error', message: '题目长度不能超过20个字符'});
        }
      },

      handleChange(type) {
        if (type === 'singlechoice') {
          this.item.answer = '';
          this.item.answerInfoList = [{
            mode: 'modify',
            itemOrder: 0,
            answerContent: '选项一'
          }];
        } else if (type === 'multichoice') {
          this.item.answer = [];
          this.item.answerInfoList = [{
            mode: 'modify',
            itemOrder: 0,
            answerContent: '选项一'
          }];
        } else if (type === 'point') {
          this.item.answer = '';
          this.item.answerInfoList = [{
            mode: 'modify',
            itemOrder: 0,
            answerContent: '选项一',
            points: 1
          }];
        } else {
          this.item.answer = '';
          this.item.answerInfoList = [];
        }
      }
    }
  }
</script>

<style>
  .satisfaction-question-modify {
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 40px;
  }
  .satisfaction-question-modify-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 44px;
    padding: 0 10px;
  }
  .satisfaction-question-modify-header .iconfont {
    padding-right: 10px;
  }
  .satisfaction-question-modify-body {
    padding: 20px 10px;
  }
  .satisfaction-question-modify-body .s-radio,
  .satisfaction-question-modify-body .s-checkbox {
    display: block;
    margin-left: 30px;
    font-weight: normal;
  }
  .satisfaction-question-modify-body .answer-item {
    width: 600px;
    height: 30px;
    line-height: 30px;
    position: relative;
  }
  .satisfaction-question-modify-body .answer-item.modify:hover {
    border: none;
  }
  .satisfaction-question-modify-body .answer-item.points {
    display: flex;
    flex-direction: row;
  }
  .satisfaction-question-modify-body .answer-item.points .s-radio {
    width: 300px;
  }
  .satisfaction-question-modify-body .answer-item .s-radio {
    line-height: 30px;
  }
  .satisfaction-question-modify-body .answer-item .action {
    position: absolute;
    top: 0;
    right: -80px;
  }
  .satisfaction-question-modify-body .answer-item>.s-input {
    margin-left: 30px;
    width: calc(100% - 30px);
  }
  .satisfaction-question-modify-body .answer-item.points>.s-input {
    width: 300px;
  }
  .satisfaction-question-modify-body .s-textarea {
    width: 570px;
    margin-left: 30px;
  }
  .satisfaction-question-modify-body .s-input-number {
    margin-left: 70px;
  }
  .satisfaction-question-modify-body .s-checkbox-group>.s-input {
    margin-left: 30px;
    width: calc(100% - 30px);
  }
</style>
