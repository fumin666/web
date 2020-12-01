<template>
  <s-dialog v-model="dialogFlag" title="登录业务属性" width="800px">
    <s-form :model="deployForm" :rules="deployRules" ref="deployForm" label-width="235px">
      <s-form-item label="SQL模式"></s-form-item>
      <s-form-item label="匹配方式">
        <s-col span="11">
          <s-select v-model="deployForm.bizPatternType">
            <s-option v-for="(option, index) in modelOptions" :key="'id' + index" :label="option.name" :value="option.value"></s-option>
          </s-select>
        </s-col>
      </s-form-item>
      <s-form-item label="匹配条件（留空则匹配任意SQL）" prop="bizPattern">
        <s-input v-model="deployForm.bizPattern" type="textarea"></s-input>
      </s-form-item>
      <s-form-item label="用户ID名称">
        <s-col span="11">
          <s-select v-model="deployForm.useridPattern">
            <s-option v-for="(option, index) in userOptions" :key="'id' + index" :label="option" :value="index"></s-option>
          </s-select>
        </s-col>
        <s-col span="11" :offset="2" v-show="deployForm.useridPattern !== '空或NULL'">
          <s-input v-model="deployForm.useridKey"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item label="用户名位置">
        <s-col span="11">
          <s-select v-model="deployForm.usernamePattern">
            <s-option v-for="(option, index) in userOptions" :key="'position' + index" :label="option" :value="index"></s-option>
          </s-select>
        </s-col>
        <s-col span="11" :offset="2" v-show="deployForm.usernamePattern !== '空或NULL'">
          <s-input v-model="deployForm.usernameKey"></s-input>
        </s-col>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        dialogFlag: false,
        deployForm: {
          apputDetailId: '',
          bizPatternType: '',
          bizPattern: '',
          useridPattern: '',
          useridKey: '',
          usernamePattern: '',
          usernameKey: ''
        },
        deployRules: {
          bizPattern: [Validaters.Max(4096)]
        },
        modelOptions: [],
        userOptions: []
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      current: {
        type: Object
      }
    },
    computed: {
      isEdit() {
        return Object.keys(this.current).length > 0;
      }
    },
    created() {
      if (this.isEdit) {
        for (let i in this.deployForm) {
          this.deployForm[i] = this.current[i];
        }
      }
      $axios.get(`/sysDbauditBusiness/getSqlSetting`).then(({data}) => {
        this.modelOptions = data.modeList;
        this.userOptions = data.positionList;
        if (!this.isEdit) {
          this.deployForm.bizPatternType = data.modeList[0].value;
          let firstName = Object.keys(data.positionList)[0];
          this.deployForm.useridPattern = data.positionList[firstName];
          this.deployForm.usernamePattern = data.positionList[firstName];
        }
      });
    },
    methods: {
      dialogOk() {
        this.$refs['deployForm'].validate(valid => {
          if (!valid) {
            return;
          }
          if (this.deployForm.useridPattern !== '空或NULL' && !this.deployForm.useridKey) {
            this.$message({showClose: true, message: '请输入用户ID位置!', type: 'error'});
            return;
          }
          if (this.deployForm.usernamePattern !== '空或NULL' && !this.deployForm.usernameKey) {
            this.$message({showClose: true, message: '请输入用户名位置!', type: 'error'});
            return;
          }
          let param = Object.assign({}, this.deployForm);
          param.appId = this.$route.params.appId;
          $axios.post(`/sysDbauditBusiness/saveSqlBusiness`, param).then(({data}) => {
            if (data === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: '保存失败!', type: 'error'});
            }
          });
        });
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
