/*
create by YOU
*/
<template>
  <s-dialog v-model="dialogFlag" title="问题单指派给他人" width="600px" class="">
    <s-row style="width: 400px; margin: 20px auto 0;">
      <s-form :model="form" ref="form" :rules="rules" label-width="120px">
        <s-form-item prop="" label-width="0">
          <s-radio class="radio" v-model="radio" label="manager" :disabled="togDisabled">问题经理</s-radio>
        </s-form-item>
        <s-form-item label="问题经理组" prop="managerGroup">
          <s-select v-model="form.managerGroup" :disabled="togDisabled">
            <s-option v-for="(item, index) in config.managerGroup" :key="index" :value="item.uuid"
                      :label="item.groupName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题经理名称" prop="managerUser">
          <s-select v-model="form.managerUser" :disabled="togDisabled">
            <s-option v-for="(item, index) in config.managerUser" :key="index" :value="item.uuid"
                      :label="item.userRealName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="" label-width="0">
          <s-radio class="radio" v-model="radio" label="professer" :disabled="!togDisabled">问题专家</s-radio>
        </s-form-item>
        <s-form-item label="问题专家组" prop="professerGroup">
          <s-select v-model="form.professerGroup" :disabled="!togDisabled">
            <s-option v-for="(item, index) in config.professerGroup" :key="index" :value="item.uuid"
                      :label="item.groupName"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="问题专家名称" prop="professerUser">
          <s-select v-model="form.professerUser" :disabled="!togDisabled">
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
  import {pick} from 'lodash'
  import $axios from 'sunflower-ajax';
  //  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      return {
        inited: false,
        dialogFlag: false,
        radio: 'manager',
        togDisabled: false,
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
        config: {
          managerGroup: [],
          managerUser: [],
          professerGroup: [],
          professerUser: []
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      uuid: String,
      companyUuid: String
    },
    created() {
      $axios.post(`/itilProblemOrder/getAssignToOtherList/${this.uuid}`).then(({data}) => {
        // 当问题专家，设置问题经理组和问题经理为当前问题单的问题经理组和问题经理，设置为不可修改，并且将问题专家组和问题专家设置为空
        if (data.managerGroup) {
          // 问题经理禁用
          this.radio = 'professer'
          this.togDisabled = true
        } else {
          // 问题专家禁用
          this.radio = 'manager'
          this.togDisabled = false
        }
        // 问题经理组
        $axios.get(`/itilProblemOrder/getProblemManagerList/${this.companyUuid}`).then(({data}) => {
          if (data && data.length) {
            this.config.managerGroup = data
            this.form.managerGroup = this.config.managerGroup[0].uuid
            this.config.managerUser = []
            this.$nextTick(() => {
              this.inited = true
            })
            return this.getUserByGroup(this.form.managerGroup, 'managerUser').then(data => {
              this.form.managerUser = data[0].uuid
            })
          }
        })
        // 问题专家组
        $axios.get(`/itilProblemOrder/getProblemProfesserList/${this.companyUuid}`).then(({data}) => {
          if (data && data.length) {
            this.config.professerGroup = data
            this.form.professerGroup = this.config.professerGroup[0].uuid
            this.config.professerUser = []
            this.$nextTick(() => {
              this.inited = true
            })
            return this.getUserByGroup(this.form.professerGroup, 'professerUser').then(data => {
              this.form.professerUser = data[0].uuid
            })
          }
        })
      })
    },
    methods: {
      dialogOk() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let form = this.radio === 'manager' ? pick(this.form, ['managerGroup', 'managerUser']) : pick(this.form, ['professerGroup', 'professerUser'])
            form.uuid = this.uuid
            $axios.post(`/itilProblemOrder/saveAssignToOther`, form).then(({data}) => {
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
      radio: {
        immediate: true,
        handler(val) {
          this.rules = this.rulesList[val]
          this.$nextTick(() => {
            this.$refs.form.resetFields()
          })
        }
      },
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val
        }
      },
      dialogFlag(val) {
        this.$emit('input', val)
      },
      'form.managerGroup': function (val) {
        if (!this.inited) {
          return
        }
        if (val) {
          this.getUserByGroup(val, 'managerUser').then((data) => {
            this.form.managerUser = ''
          })
        }
      },
      'form.professerGroup': function (val) {
        if (!this.inited) {
          return
        }
        if (val) {
          this.getUserByGroup(val, 'professerUser').then((data) => {
            this.form.professerUser = ''
          })
        }
      }
    }
  }
</script>

<style lang="stylus">

</style>
