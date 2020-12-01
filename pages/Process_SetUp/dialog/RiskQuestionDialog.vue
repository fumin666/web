<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="120px">
    <div>
      <s-row>
        <s-col span="18">
          <s-form-item prop="questionSort" label="编号:">
            <s-input v-model="form.questionSort" disabled></s-input>
          </s-form-item>
          <s-form-item prop="question" v-if="!isEdit" label="问题:">
            <s-input v-model="form.question"></s-input>
          </s-form-item>
          <s-form-item prop="question" v-if="isEdit" label="问题:">
            <s-input v-model="form.question" disabled></s-input>
          </s-form-item>
        </s-col>
      </s-row>
    </div>

    <div style="margin-top: 10px">
      <s-row>
        <s-col span="24">
          <s-row style="display: flex;">
            <span style="font-size: 14px; font-weight: 600">答案</span>
          </s-row>
          <s-row style="margin-top: 10px;">
            <s-button icon="plus" @click="addAnswer">添加</s-button>
            <s-button icon="batch-del" @click="" style="margin-left: 5px;">批量删除</s-button>
          </s-row>
          <s-row style="margin-top: 10px;">
            <s-table
              ref="answerTable"
              :data="answersArr"
              style="width:100%"
              @selection-change="handleSelectionChange"
              
            >
              <s-table-column type="selection"></s-table-column>
              <s-table-column type="index" label="序号" ></s-table-column>
              <s-table-column prop="answer" label="答案" >
                <template slot-scope="scope">
                  <s-input v-model="scope.row.answer" :maxlength="100"></s-input>
                </template>
              </s-table-column>
              <s-table-column prop="answerScore" label="风险值" >
                <template slot-scope="scope">
                  <s-input v-model="scope.row.answerScore" @blur = "inputFunc(scope.row.answerScore)" ></s-input>
                </template>
              </s-table-column>
              <s-table-column label="操作">
                <template slot-scope="scope">
                  <i class="iconfont icon-delete" title="删除" @click="delAnswer(scope)"></i>
                </template>
              </s-table-column>
            </s-table>
          </s-row>
        </s-col>
      </s-row>
    </div>
  </s-form>
</template>

<script>
//  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash'
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  export default{
    data() {
      return {
        form: {
          uuid: '',
          question: '',
          questionSort: '',
          itilQuestionnaireAnswerList: []
        },
        rules: {
          question: [Validaters.NotNull]
        },
        selections: [],
        answerIndex: '',
        isEdit: false,
        answersArr: []
      }
    },
    methods: {
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      addAnswer() {
        if (this.answersArr.length < 5) {
          let param = {
            answer: '',
            answerScore: ''
          };
          this.answersArr.push(param);
        } else {
          this.$message({
            message: '最多只能添加5条答案',
            type: 'warning'
          });
        }
      },
      delAnswer(row) {
        this.answersArr.splice(row.$index, 1);
      },
      inputFunc(val) {
        let reg = /^(([1-9]?[0-9])|(100)?)$/;
        if (!reg.test(val)) {
          for (let i in this.answersArr) {
            if (this.answersArr[i].answerScore === val) {
              this.answersArr[i].answerScore = '';
              this.$message({
                message: '风险值只能为0到100的正整数',
                type: 'error'
              })
            }
          }
        }
      }
    },
    props: {
      editData: {
        type: Object
      },
      changeData: {
        type: Object
      }
    },
    mounted() {
      if (this.editData !== undefined) {
        this.form = intersectObj(this.form, this.editData);
        if (this.editData.itilQuestionnaireAnswerList.length > 0) {
          this.answersArr = cloneDeep(this.editData.itilQuestionnaireAnswerList);
        }
      }
      if (this.changeData !== undefined) {
        this.isEdit = true;
        this.form = intersectObj(this.form, this.changeData);
        this.answersArr = cloneDeep(this.changeData.itilQuestionnaireAnswerList);
      }
    }
  }
</script>
