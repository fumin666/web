<!--变更风险问卷维护-->
<template>
  <s-row>
    <s-col span="12" style="padding-right: 5px;">
      <s-row>
        <h1 style="padding-bottom: 5px"><i class="iconfont icon-help"></i> 问题列表</h1>
      </s-row>
      <div style="min-height: 500px;">
        <s-row>
          <s-button icon="plus" @click="showAddDialog">添加</s-button>
          <s-button icon="import" @click="importBatch">导入</s-button>
          <s-button icon="batch-del" @click="batchDelQuestions">批量删除</s-button>
        </s-row>
        <s-table
          ref="multipleTable"
          :data="questionList"
          style="width:100%; margin-top: 10px;"
          @selection-change="handleSelectionChange"

          @row-click="rowClick"
          highlight-current-row
          height="400"
          :rowStyle="rowStyle"
        >
          <s-table-column type="selection" :selectable="selectQuestion"></s-table-column>
          <s-table-column prop="questionSort" label="编号">
            <template slot-scope="scope" v-if="scope.row.questionSort !== 0">
              {{scope.row.questionSort}}
            </template>
          </s-table-column>
          <s-table-column prop="question" label="问题描述" ></s-table-column>
          <s-table-column prop="questionWeight" label="权重（%）" ></s-table-column>
          <s-table-column prop="answerCount" label="答案个数" ></s-table-column>
          <s-table-column label="操作" width="120px">
            <template slot-scope="scope" v-if="scope.row.questionSort !== 0">
              <i class="iconfont icon-edit" title="修改" @click="changeQuestion(scope.row)"></i>
              <i class="iconfont icon-delete" title="删除" @click="delQuestion(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table>

        <s-row style="position: absolute;left: 0; bottom: 10px;width: 100%;">
          <s-col span="2" style="margin-left: 10px;">
            <div style="text-align: center;line-height: 30px;">权重值:</div>
          </s-col>
          <s-col span="1">
            <!--<s-input type="number" id="rowQuestionWeight" :step="1"  :min="1" :max="100" v-model="rowQuestionWeight" v-on:input ="inputFunc" rowQuestionWeight></s-input>-->
            <input class="s-input-inner" id="rowQuestionWeight" type="text" v-model="rowQuestionWeight"/>
          </s-col>
          <s-col span="1">
            <div style="line-height: 30px;">%</div>
          </s-col>
          <s-col span="2">
            <s-button @click="saveQuestionWeight">保存</s-button>
          </s-col>
        </s-row>
      </div>

      <!--添加问题列表-->
      <s-dialog
        v-model="addQuestionDialog"
        v-if="addQuestionDialog"
        width="700px"
        title="添加"
        append-to-body>
        <s-form :model="form" :rules="rules" ref="addQuestionDialog" label-width="100px">
          <div style="padding-left: 50px;">
            <s-row>
              <s-col span="18">
                <s-form-item prop="questionSort" label="编号:">
                  <s-input v-model="form.questionSort" disabled></s-input>
                </s-form-item>
                <s-form-item prop="question" label="问题描述:">
                  <s-input type="textarea" :maxlength="100" :rows="3" placeholder="请输入问题描述" v-model="form.question"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
          </div>
        </s-form>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveAddQuestion">保存</s-button>
          <s-button type="cancel" @click="cancelAddQuestion">取消</s-button>
        </template>
      </s-dialog>

      <!--编辑问题列表-->
      <s-dialog
        v-model="changeQuestionDialog"
        v-if="changeQuestionDialog"
        width="700px"
        title="编辑"
        append-to-body>
        <change-risk-question :editData="questionInfo" ref="editQuestionDialog"></change-risk-question>
        <template slot="footer" class="dialog-footer">
          <s-button @click="saveEditQuestion">保存</s-button>
          <s-button type="cancel" @click="cancelEditQuestion">取消</s-button>
        </template>
      </s-dialog>

    </s-col>
    <s-col span="12" style="padding-left: 5px;">
      <s-row>
        <h1 style="padding-bottom: 5px"><i class="iconfont icon-knowledge-base"></i> 答案列表</h1>
      </s-row>
      <div style="min-height: 500px;">
        <s-row v-show="rowData.questionSort !== 0">
          <s-button icon="plus" @click="editAnswer">添加</s-button>
          <s-button icon="batch-del" @click="batchDelAnswer">批量删除</s-button>
        </s-row>
        <s-row style="opacity: 0;" v-show="rowData.questionSort === 0">
          <s-button icon="plus">添加</s-button>
        </s-row>
        <s-table
          ref="multipleTable"
          :data="answerList"
          style="width:100%; margin-top: 10px;"

          height="400"
          v-show="rowData.questionSort === 0"
        >
          <s-table-column type="index" label="编号"></s-table-column>
          <s-table-column prop="answer" label="答案描述" ></s-table-column>
        </s-table>

        <s-table
          ref="multipleTable"
          :data="answerList"
          style="width:100%; margin-top: 10px;"
          @selection-change="handleSelectionAnswer"

          height="400"
          v-show="rowData.questionSort !== 0"
        >
          <s-table-column type="selection"></s-table-column>
          <s-table-column type="index" label="编号"></s-table-column>
          <s-table-column prop="answer" label="答案描述" ></s-table-column>
          <s-table-column prop="answerScore" label="风险值" ></s-table-column>
          <s-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <i class="iconfont icon-edit" title="修改" @click="editAnswer(scope)"></i>
              <i class="iconfont icon-delete" title="删除" @click="delAnswer(scope.row)"></i>
            </template>
          </s-table-column>
        </s-table>

        <!--编辑答案列表-->
        <s-dialog
          v-model="changeAnswerDialog"
          v-if="changeAnswerDialog"
          width="700px"
          title="修改"
          append-to-body>
          <change-risk-question :changeData="rowData" ref="changeAnswerDialog"></change-risk-question>
          <template slot="footer" class="dialog-footer">
            <s-button @click="saveEditAnswer">保存</s-button>
            <s-button type="cancel" @click="cancelEditAnswer">取消</s-button>
          </template>
        </s-dialog>

        <!--导入-->
        <import-dialog v-if="importDialogFlag" v-model="importDialogFlag"
                       :upload-obj="uploadObj" :down-obj="downObj" @reload="getData" :fileTypes="['xls', 'xlsx']"></import-dialog>
      </div>
    </s-col>
  </s-row>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import changeRiskQuestion from '../dialog/RiskQuestionDialog.vue';
  import importDialog from '@/components/importDialog/ImportDialog';
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        questionList: [],
        selections: [],
        answerList: [],
        answerSelections: [],
        addQuestionDialog: false,
        changeQuestionDialog: false,
        changeAnswerDialog: false,
        form: {
          questionSort: '',
          question: ''
        },
        rules: {
          question: [Validaters.NotNull]
        },
        questionInfo: {},
        rowQuestionWeight: '',
        rowData: {},
        importDialogFlag: false,
        uploadObj: {},
        downObj: {},
        rowUuid: '',
        rowIndex: ''
      }
    },
    components: {
      changeRiskQuestion,
      importDialog
    },
    methods: {
      inputFunc() {
        let x = document.getElementById('rowQuestionWeight').value;
        if (this.rowUuid !== '') {
          for (let i in this.questionList) {
            if (this.questionList[i].uuid === this.rowUuid) {
              this.rowIndex = i;
            }
          }
          this.questionList[this.rowIndex].questionWeight = x;
        }
      },
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      handleSelectionAnswer(selections) {
        this.answerSelections = selections;
      },
      getData() {
        $axios.post('/itilWorkflowConfig/getItilChangeQuestionnaireList').then((res) => {
          if (res.status === 200) {
            this.questionList = res.data;
            this.rowData = res.data[0];
            this.answerList = this.rowData.itilQuestionnaireAnswerList;
            this.rowUuid = '';
            this.rowQuestionWeight = '';
          }
        })
      },
      showAddDialog() {
        let _index = this.questionList.length - 1;
        if (this.questionList[_index].answerCount === 0) {
          this.$message({
            message: '上一问题至少需要添加一个答案，否则不允许新建下一个问题！',
            type: 'error'
          });
        } else {
          this.addQuestionDialog = true;
          $axios.post('/itilWorkflowConfig/getItilQuestionCode').then((res) => {
            if (res.status === 200) {
              this.form.questionSort = res.data;
              this.form.question = '';
            }
          })
        }
      },
      saveAddQuestion() {
        this.$refs['addQuestionDialog'].validate(valid => {
          if (!valid) return;
          $axios.post('/itilWorkflowConfig/saveOrUpdateQuestionnaireQuestion', this.form, {
            data: [this.form],
            logTemplate: '添加|变更风险问卷'
          }).then((res) => {
            if (res.data.state === true) {
              this.$message({message: res.data.data, type: 'success'});
              this.getData();
              this.addQuestionDialog = false;
            } else {
              this.$message({message: res.data.data, type: 'error'});
            }
          })
        })
      },
      cancelAddQuestion() {
        this.addQuestionDialog = false;
      },
      delQuestion(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('/itilWorkflowConfig/deleteItilQuestionnaireQuestion/' + uuid, {
            data: [],
            logTemplate: '删除|变更风险问卷'
          }).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      batchDelQuestions() {
        if (this.selections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个问题', type: 'error'});
        } else {
          let arr = [];
          for (let i in this.selections) {
            arr.push(this.selections[i].uuid);
          }
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('itilWorkflowConfig/batchDelItilQuestionnaireQuestion', arr, {
              data: [],
              logTemplate: '删除|变更风险问卷'
            }).then(res => {
              if (res.status === 200) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getData();
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
          }).catch(() => {});
        }
      },
      changeQuestion(row) {
        this.questionInfo = row;
        this.changeQuestionDialog = true
      },
      cancelEditQuestion() {
        this.changeQuestionDialog = false;
      },
      rowClick(row, event, column) {
        this.rowUuid = '';
        this.rowQuestionWeight = '';
        this.rowData = row;
        this.answerList = Object.assign({}, this.rowData).itilQuestionnaireAnswerList;
        this.rowQuestionWeight = row.questionWeight;
        this.rowUuid = row.uuid;
      },
      saveEditQuestion() {
        this.$refs['editQuestionDialog'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['editQuestionDialog'].form;
          form.itilQuestionnaireAnswerList = this.$refs['editQuestionDialog'].answersArr;
          if (form.itilQuestionnaireAnswerList.length > 0) {
            for (let i in form.itilQuestionnaireAnswerList) {
              form.itilQuestionnaireAnswerList[i].answerSort = parseInt(i) + 1;
              if (form.itilQuestionnaireAnswerList[i].answer === '' || form.itilQuestionnaireAnswerList[i].answerScore === '') {
                this.$message({message: '答案跟风险值不能为空', type: 'error'});
                return;
              }
              if (form.itilQuestionnaireAnswerList[i].answerScore > 100 || form.itilQuestionnaireAnswerList[i].answerScore < 0) {
                this.$message({message: '请填写风险值为0到100的数字', type: 'error'});
                return;
              };
            }
            $axios.post('/itilWorkflowConfig/saveOrUpdateItilQuestionnaireAnswer', form, {
              data: [],
              logTemplate: '编辑|变更风险问卷'
            }).then((res) => {
              if (res.data.state === true) {
                this.$message({message: res.data.data, type: 'success'});
                this.getData();
                this.changeQuestionDialog = false;
              } else {
                this.$message({message: res.data.data, type: 'error'});
              }
            })
          } else {
            this.$message({message: '请至少填写一条答案', type: 'error'});
          }
        })
      },
      rowStyle(row, rowIndex) {
        if (rowIndex === 0) {
          return 'background-color: rgba(128,128,128,0.4)'
        } else {
          return ''
        }
      },
      selectQuestion(row, index) {
        if (index === 0) {
          return false;
        } else {
          return true;
        }
      },
      editAnswer(row) {
        this.changeAnswerDialog = true;
      },
      saveEditAnswer() {
        this.$refs['changeAnswerDialog'].$refs['Form'].validate(valid => {
          if (!valid) return;
          let form = this.$refs['changeAnswerDialog'].form;
          form.itilQuestionnaireAnswerList = this.$refs['changeAnswerDialog'].answersArr;
          if (form.itilQuestionnaireAnswerList.length > 0) {
            for (let i in form.itilQuestionnaireAnswerList) {
              form.itilQuestionnaireAnswerList[i].answerSort = parseInt(i) + 1;
              if (form.itilQuestionnaireAnswerList[i].answer === '' || form.itilQuestionnaireAnswerList[i].answerScore === '') {
                this.$message({message: '答案跟风险值不能为空', type: 'error'});
                return;
              }
              if (form.itilQuestionnaireAnswerList[i].answerScore > 100 || form.itilQuestionnaireAnswerList[i].answerScore < 0) {
                this.$message({message: '请填写风险值为0到100的数字', type: 'error'});
                return;
              };
            }
            $axios.post('/itilWorkflowConfig/saveOrUpdateItilQuestionnaireAnswer', form).then((res) => {
              if (res.data.state === true) {
                this.$message({message: res.data.data, type: 'success'});
                this.getData();
                this.changeAnswerDialog = false;
              } else {
                this.$message({message: res.data.data, type: 'error'});
              }
            })
          } else {
            this.$message({message: '请至少填写一条答案', type: 'error'});
          }
        })
      },
      cancelEditAnswer() {
        this.changeAnswerDialog = false;
      },
      delAnswer(row) {
        let uuid = row.uuid;
        this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          $axios.get('itilWorkflowConfig/deleteQuestionnaireAnswer/' + uuid).then(res => {
            if (res.data === true) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData();
            } else {
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }
          })
        }).catch(() => {});
      },
      batchDelAnswer() {
        if (this.answerSelections.length === 0) {
          this.$message({showClose: true, message: '至少选中一个答案', type: 'error'});
        } else {
          let arr = [];
          for (let i in this.answerSelections) {
            arr.push(this.answerSelections[i].uuid);
          }
          this.$confirm('确定删除？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
            $axios.post('/itilWorkflowConfig/batchDelItilQuestionnaireAnswer', arr).then(res => {
              if (res.data === true) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.getData();
              } else {
                this.$message({
                  message: '删除失败',
                  type: 'error'
                })
              }
            })
          }).catch(() => {});
        }
      },
      importBatch() {
        this.uploadObj = {
          type: 'post',
          url: '/itilWorkflowConfig/importItilQuestionnaire'
        };
        this.downObj = {
          text: '导入模版',
          url: '/itilWorkflowConfig/itilQuestionnaireImprotTemplate'
        };
        this.importDialogFlag = true;
      },
      saveQuestionWeight() {
        for (let k in this.questionList) {
          if (this.questionList[k].answerCount === 0) {
            this.$message({
              message: '有问题答案为空，请进行添加。',
              type: 'error'
            });
            return;
          }
          if (this.questionList[k].questionWeight === '') {
            this.$message({
              message: '有问题权重值为空，请进行添加。',
              type: 'error'
            });
            return;
          }
          if (this.questionList[k].questionWeight < 0) {
            this.$message({
              message: '权重值不能小于0，请修改权重。',
              type: 'error'
            });
            return;
          }
        }
        let newArr = [];
        for (let i = 1; i < this.questionList.length; i++) {
          let param = {};
          param.uuid = this.questionList[i].uuid;
          param.questionWeight = this.questionList[i].questionWeight;
          newArr.push(param);
        }
        $axios.post('/itilWorkflowConfig/checkAllQuestionWeight', newArr).then((res) => {
          if (res.data.state === true) {
            this.$message({
              message: res.data.data,
              type: 'success'
            });
            this.getData();
          } else {
            this.$message({
              message: res.data.data,
              type: 'error'
            });
          }
        })
      }
    },
    created() {
      this.getData();
    },
    watch: {
      rowQuestionWeight(val) {
        let reg = /^(([1-9]?[0-9])|(100)?)$/;
        if (this.rowUuid !== '') {
          if (!reg.test(val)) {
            this.rowQuestionWeight = '';
          }
          for (let i in this.questionList) {
            if (this.questionList[i].uuid === this.rowUuid) {
              this.rowIndex = i;
            }
          }
          this.questionList[this.rowIndex].questionWeight = this.rowQuestionWeight;
        }
      }
    }
  }
</script>
