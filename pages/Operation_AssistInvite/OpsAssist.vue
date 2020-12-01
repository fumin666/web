
<template>
  <div>
    <s-form ref="addForm" :model="form" label-width="120px" class="accountAddForm" :rules="rules">
      <s-form-item v-for="(value, key) in inputList" :key="key" :label="value" :prop="key">
        <s-input v-if="key !== 'strPw'" v-model="form[key]"></s-input>
        <s-input v-if="key === 'strPw'" type="password" v-model="form[key]"></s-input>
      </s-form-item>
      <s-form-item v-show="iColorDepthList" label="颜色深度" prop="iColorDepth">
        <s-select v-model="form.iColorDepth">
          <s-option v-for="(value, key) in iColorDepthList" :key="key" :label="value" :value="key"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item v-show="iWhichWHList" label="分辨率" prop="iWhichWH">
        <s-select v-model="form.iWhichWH">
          <s-option v-for="(value, key) in iWhichWHList" :key="key" :label="value" :value="key"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item v-show="strConsoleList" label="console命令" prop="strConsole">
        <s-select v-model="form.strConsole">
          <s-option v-for="(value, key) in strConsoleList" :key="key" :label="value" :value="key"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item v-show="strDBnameList" label="数据库" prop="strDBname">
        <s-select v-model="form.strDBname">
          <s-option v-for="item in strDBnameList" :key="item.id" :label="item" :value="item"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  const validNotNull = { required: true, message: '不能为空', trigger: 'blur' }
  export default {
    data() {
      return {
        inputList: [],
        person: [],
        iWhichWHList: {},
        iColorDepthList: {},
        strConsoleList: {},
        strDBnameList: [],
        userUuid: '',
        form: {
          iWhichWH: '',
          iColorDepth: '',
          strConsole: '',
          strPw: '',
          strAccount: '',
          strDBname: '',
          uuid: this.uuid,
          sessionUuid: this.sessionUuid
        },
        rules: {
          strAccount: [
            validNotNull
          ],
          strPw: [
            validNotNull
          ]
        }
      }
    },
    props: {
      uuid: {
        type: String
      },
      sessionUuid: {
        type: String
      }
    },
    created() {
      $axios.get(`/invitHelp/getReceiveInitInfo/${this.uuid}`).then((res) => {
        this.inputList = res.data.input
        this.iWhichWHList = res.data.select.iWhichWH || false
        this.iColorDepthList = res.data.select.iColorDepth || false
        this.strConsoleList = res.data.select.strConsole || false
        this.strDBnameList = res.data.select.strDBname || false
        this.form.iColorDepth = (res.data.select.iColorDepth !== undefined) ? Object.keys(res.data.select.iColorDepth)[0] : ''
        this.form.strConsole = (res.data.select.strConsole !== undefined) ? Object.keys(res.data.select.strConsole)[0] : ''
        this.form.strDBname = (res.data.select.strDBname !== undefined) ? Object.keys(res.data.select.strDBname)[0] : ''
        this.form.iWhichWH = (res.data.select.iWhichWH !== undefined) ? Object.keys(res.data.select.iWhichWH)[0] : ''
        this.person = res.data.person
      })
    }
  }
</script>
