<template>
  <s-dialog v-model="dialogFlag" title="指派给我" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" ref="form" :rules="rules" label-width="120px">
        <s-form-item label="问题经理组" prop="managerGroup">
          <s-select v-model="form.managerGroup" :disabled="managerDisabled">
            <s-option v-for="(item, index) in config.managerGroup" :key="index" :value="item.uuid"
                      :label="item.groupName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题经理名称" prop="managerUser">
          <s-select v-model="form.managerUser" :disabled="true">
            <s-option v-for="(item, index) in config.managerUser" :key="index" :value="item.uuid"
                      :label="item.userRealName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题专家组" prop="professerGroup">
          <s-select v-model="form.professerGroup" :disabled="professerDisabled">
            <s-option v-for="(item, index) in config.professerGroup" :key="index" :value="item.uuid"
                      :label="item.groupName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题专家名称" prop="professerUser">
          <s-select v-model="form.professerUser" :disabled="true">
            <s-option v-for="(item, index) in config.professerUser" :key="index" :value="item.uuid"
                      :label="item.userRealName"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
    </s-row>
    <template slot="footer" class="dialog-footer">
      <s-button @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import {cloneDeep, pick} from 'lodash'
  import $axios from 'sunflower-ajax';
  //  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        flag: 'manager',
        inited: false,
        managerDisabled: true,
        professerDisabled: true,
        dialogFlag: false,
        form: {
          managerGroup: '',
          managerUser: '',
          professerGroup: '',
          professerUser: ''
        },
        rules: {},
        rulesList: {
          manager: {
            managerGroup: [{required: true, message: '不能为空', trigger: 'blur'}],
            managerUser: [{required: true, message: '不能为空', trigger: 'blur'}]
          },
          professer: {
            professerGroup: [{required: true, message: '不能为空', trigger: 'blur'}],
            professerUser: [{required: true, message: '不能为空', trigger: 'blur'}]
          }
        },
        config: {}
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: String,
      ouTconfig: {
        type: Object,
        default() {
          return {
            managerGroup: [],
            managerUser: [],
            professerGroup: [],
            professerUser: []
          }
        }
      }
    },
    created() {
      $axios.get('/itilProblemOrder/getAssignToMeList/' + this.uuid).then(({data}) => {
        if (data.managerGroup && data.managerGroup.length > 0) {
          this.config.managerGroup = data.managerGroup
          this.form.managerGroup = this.config.managerGroup[0].uuid
          this.form.managerUser = data.user.uuid
          this.managerDisabled = false
          this.rules = this.rulesList.manager
          this.getUserByGroup(this.form.managerGroup, 'managerUser').then(_ => {
            this.inited = true
          })
          this.flag = 'manager'
        } else if (data.professerGroup && data.professerGroup.length > 0) {
          this.config.professerGroup = data.professerGroup
          this.form.professerGroup = this.config.professerGroup[0].uuid
          this.form.professerUser = data.user.uuid
          this.professerDisabled = false
          this.rules = this.rulesList.professer
          this.getUserByGroup(this.form.professerGroup, 'professerUser').then(_ => {
            this.inited = true
          })
          this.flag = 'professer'
        }
      })
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let form = this.flag === 'manager' ? pick(this.form, ['managerGroup', 'managerUser']) : pick(this.form, ['professerGroup', 'professerUser'])
            form.uuid = this.uuid
            $axios.post('/itilProblemOrder/saveAssignToMe', form).then(({data}) => {
              this.$emit('submit', 'getData')
              this.dialogFlag = false
              if (data.state === true) {
                this.$message.success(data.errormsg)
              } else {
                this.$message.error(data.errormsg)
              }
            })
          }
        })
      },
      // 根据支持组uuid查询用户列表
      getUserByGroup(uuid, key) {
        let url = key === 'managerUser' ? '/itilProblemOrder/getProblemManagerByGroup/' : '/itilProblemOrder/getProblemProfesserByGroup/'
        return $axios.get(url + uuid).then(({data}) => {
          if (key) {
            this.$set(this.config, key, data)
          }
          return data
        })
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
      },
      ouTconfig: {
        immediate: true,
        handler(val) {
          this.config = cloneDeep(val)
        }
      }
    }
  }
</script>

<style lang="stylus">

</style>
