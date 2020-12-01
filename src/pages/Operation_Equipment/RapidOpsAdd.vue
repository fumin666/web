<template>
  <section>
    <s-form ref="rapid" :model="form" :rules="rules" label-width="120px" @submit.native.prevent>
      <s-form-item v-if="userShow" label="用户名" prop="accountName">
        <s-col span="20" >
          <s-input v-model="form.accountName"></s-input>
        </s-col>
      </s-form-item>
      <s-form-item label="密码" prop="accountPwd">
        <s-col span="20" >
          <s-input type="password" v-model="form.accountPwd"></s-input>
        </s-col>
      </s-form-item>
      <div v-if="isOpen === 1">
        <span style="margin-right: 44px">半自动代填</span>
        <s-radio-group v-model="form.isAutoRecord">
          <s-radio :label="1">开启</s-radio>
          <s-radio :label="0">关闭</s-radio>
        </s-radio-group>
      </div>
    </s-form>
  </section>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      let validNotNull = { required: true, message: '不能为空', trigger: 'blur' };
      return {
        form: {
          accountName: '',
          accountPwd: '',
          isAutoRecord: 1
        },
        rules: {
          accountName: [
            validNotNull,
            { max: 30, message: '最大长度为30', trigger: 'blur' }
          ],
          accountPwd: [
            validNotNull,
            { max: 30, message: '最大长度为30', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      if (this.form.isAutoRecord === 1 && this.isOpen === 1) {
        $axios.get(`/basicOperation/getAccountByMaintain/${this.decisionData.uuid}/2`).then((res) => {
          this.form.accountName = res.data.accountName;
          this.form.accountPwd = res.data.accountPass;
          this.form.isAutoRecord = res.data.isAutoRecord;
        })
      } else {
        this.form.isAutoRecord = null
      }
    },
    props: {
      decisionData: {
        type: Object
      },
      userShow: {
        type: Boolean,
        default: true
      },
      isOpen: {
        type: Number
      }
    }
  }
</script>
