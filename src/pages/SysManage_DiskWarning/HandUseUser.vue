<template>
  <section>
    <s-form v-if="mailShow" ref="addForm" :model="form" :rules="rule" label-width="120px">
      <s-form-item label="邮箱地址" prop="mail">
        <s-col span="20">
          <s-input v-model="form.mail"></s-input>
          <input v-show="false"></input>
        </s-col>
      </s-form-item>
    </s-form>
    <s-form v-if="cellPhoneShow" ref="addForm" :model="form" :rules="rule" label-width="120px">
      <s-form-item label="手机号码" prop="cellPhone">
        <s-col span="20">
          <s-input v-model="form.cellPhone"></s-input>
          <input v-show="false"></input>
        </s-col>
      </s-form-item>
    </s-form>
    <s-form v-if="weChatShow" ref="addForm" :model="form" :rules="rule" label-width="120px">
      <s-form-item label="微信号" prop="weChat">
        <s-col span="20">
          <s-input v-model="form.weChat"></s-input>
          <s-input v-show="false"></s-input>
        </s-col>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils';
  export default {
    data() {
      return {
        mailShow: false,
        cellPhoneShow: false,
        weChatShow: false,
        form: {
          mail: '',
          cellPhone: '',
          weChat: ''
        },
        rule: {
          mail: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { pattern: /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/, message: '请填写正确格式的email', trigger: 'blur' },
            { max: 60, message: '最大长度60个字符', trigger: 'blur' }
          ],
          cellPhone: [
            { required: true, message: '不能为空', trigger: 'blur' },
            Validaters.Max(20),
            Validaters.MobilePhone
          ],
          weChat: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { max: 60, message: '最大长度60个字符', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      showType: {
        type: Number
      }
    },
    created() {
      this.userShow()
    },
    methods: {
      userShow() {
        switch (this.showType) {
          case 1: this.mailShow = true; break;
          case 2: this.cellPhoneShow = true; break;
          case 3: this.weChatShow = true; break;
        }
      }
    }
  }
</script>
