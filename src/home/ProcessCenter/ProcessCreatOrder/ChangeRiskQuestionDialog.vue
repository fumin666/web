<template>
  <s-dialog
    v-model="dialogFlag"
    v-if="dialogFlag"
    width="700px"
    append-to-body
    title="变更风险问卷">
    <s-scrollbar wrap-style="height: 400px;">
      <s-form :model="form" ref="form" label-width="240px">
        <s-row v-for="(item, index) in form.dataList" :key="index">
          <s-form-item v-if="index == 0" :label="form.dataList[0].question">
            <s-radio-group v-model="item.answerUuid">
              <s-radio :label="item.itilQuestionnaireAnswerList[0].uuid">是</s-radio>
              <s-radio :label="item.itilQuestionnaireAnswerList[1].uuid">否</s-radio>
            </s-radio-group>
          </s-form-item>
          <s-form-item v-if="index != 0" :label="`${index}.${item.question}`">
            <s-select v-model="item.answerUuid" :disabled="comDisabled" style="width: 80%;">
              <s-option v-for="opt in item.itilQuestionnaireAnswerList" :label="opt.answer" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
        </s-row>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">保存</s-button>
      <s-button type="cancel" @click="dialogFlag = false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus';
  export default {
    data() {
      return {
        form: {
          dataList: []
        },
        dialogFlag: false,
        selTemplate: {}
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curTemplate: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      getData() {
        $axios.get('/itilChangeOrder/toQuestionnaire').then((res) => {
          this.form.dataList = res.data;
          for (let i in this.form.dataList) {
            this.$set(this.form.dataList[i], 'answerUuid', this.form.dataList[i].itilQuestionnaireAnswerList[0].uuid);
          }
        })
      },
      dialogOk() {
        if (this.form.dataList[0].answerUuid === this.form.dataList[0].itilQuestionnaireAnswerList[0].uuid) {
          this.selTemplate.riskLevel = 4;
          this.selTemplate.changePath = 1;
          Bus.$emit('finish0', this.selTemplate);
          this.dialogFlag = false;
        } else {
          let newFormData = [];
          for (let i = 1; i < this.form.dataList.length; i++) {
            let param = {};
            param.answerUuid = this.form.dataList[i].answerUuid;
            param.questionUuid = this.form.dataList[i].uuid;
            newFormData.push(param)
          }
          $axios.post('/itilChangeOrder/getQuestionnarieResult', newFormData).then((res) => {
            this.selTemplate.riskLevel = res.data.riskLevel;
            this.selTemplate.changePath = res.data.changePath;
            Bus.$emit('finish0', this.selTemplate);
            this.dialogFlag = false;
          })
        }
      }
    },
    created() {
      this.getData();
    },
    computed: {
      comDisabled() {
        if (this.form.dataList[0].answerUuid === this.form.dataList[0].itilQuestionnaireAnswerList[0].uuid) {
          return true;
        } else {
          return false;
        }
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    }
  }
</script>

<style lang="stylus">

</style>
