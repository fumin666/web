<template>
  <s-form ref="radiusForm" :model="radiusForm" :rules="radiusRule" label-width="120px">
    <s-row class="title">
      <i class="iconfont icon-tag"></i>
      <span>{{radiusTypeTxt}}Radius认证服务器属性</span>
    </s-row>
    <s-form-item label="服务器域名:">
      <s-input v-model="radiusForm.domain" :maxlength="30" placeholder="最大长度为30个字符"></s-input>
    </s-form-item>
    <s-form-item label="服务器地址:" prop="ip">
      <s-input v-model="radiusForm.ip"></s-input>
    </s-form-item>
    <s-form-item label="端口:" prop="port">
      <s-input v-model.number="radiusForm.port"></s-input>
    </s-form-item>
    <s-form-item label="预共享秘钥:" prop="key">
      <s-input v-model="radiusForm.key" type="password"></s-input>
    </s-form-item>
    <s-form-item label="重复秘钥:" prop="repeatKey">
      <s-input v-model="radiusForm.repeatKey" type="password"></s-input>
    </s-form-item>
    <s-form-item label="加密方式:" prop="encryption">
      <s-select v-model="radiusForm.encryption">
        <s-option value="pap" label="pap"></s-option>
        <s-option value="chap" label="chap"></s-option>
        <s-option value="mschap" label="mschap"></s-option>
        <s-option value="eap-md5" label="eap-md5"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="状态:">
      <s-select v-model.number="radiusForm.status">
        <s-option :value="1" label="激活"></s-option>
        <s-option :value="0" label="未激活"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item>
      <s-button class="rightBtn" @click="saveRadiusForm">保存</s-button>
    </s-form-item>
  </s-form>
</template>

<script type="text/babel">
  import {Validaters} from 'sunflower-common-utils';
  import $axios from 'sunflower-ajax';

  export default{
    data () {
      var validKey = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else {
          if (this.radiusForm.repeatKey !== '') {
            this.$refs.radiusForm.validateField('repeatKey');
            callback();
          } else {
            callback();
          }
        }
      };
      var validRepeatKey = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空'));
        } else if (value !== this.radiusForm.key) {
          callback(new Error('两次输入的秘钥不一致!'));
        } else {
          callback();
        }
      };
      return {
        radiusTypeTxt: this.radiusType === 1 ? '主' : '备',
        postType: 0,      // 保存(0)/更新(1)
        postUrl: '',
        radiusForm: {
          domain: '',
          ip: '',
          port: '',
          key: '',
          repeatKey: '',
          encryption: '',
          status: 1,
          type: this.radiusType,
          uuid: ''
        },
        radiusRule: {
          ip: [
            Validaters.IP
          ],
          port: [
            {required: true, type: 'number', message: '请输入数字', trigger: 'blur'}
          ],
          key: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: validKey, trigger: 'blur'}
          ],
          repeatKey: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: validRepeatKey, trigger: 'blur'}
          ]
        }
      }
    },
    props: [
      'radiusType'
    ],
    methods: {
      initRadiusForm() {
        // 初始化Radius设置
        $axios.post('/iamSysRadiusInfo/getRadiusInfo', this.radiusForm).then((res) => {
          let data = res.data
          let mainRadius = data.mainRadiusInfo
          let spareRadius = data.radiusInfo
          if (this.radiusType === 1) {
            if (mainRadius !== null) {
              this.radiusForm = mainRadius
              this.radiusForm.repeatKey = mainRadius.key
              this.radiusForm.uuid = mainRadius.uuid
              this.postType = 1
            }
          } else {
            if (spareRadius !== null) {
              this.radiusForm = spareRadius
              this.radiusForm.repeatKey = spareRadius.key
              this.radiusForm.uuid = spareRadius.uuid
              this.postType = 1
            }
          }
        })
      },
      // 保存‘radius设置’
      saveRadiusForm() {
        this.$refs['radiusForm'].validate((valid) => {
          if (valid) {
            if (this.postType === 0) {
              this.postUrl = '/iamSysRadiusInfo/saveRadiusInfo'
            } else {
              this.postUrl = '/iamSysRadiusInfo/updateRadiusInfo'
            }
            $axios.post(this.postUrl, this.radiusForm, {
              data: [],
              logTemplate: `设置|登录认证配置>Radius设置>${this.radiusTypeTxt}Radius服务器认证属性`
            }).then((res) => {
              let resData = res.data
              if (resData === 'success') {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.initRadiusForm()
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                })
              }
            })
          } else {
            return false
          }
        });
      }
    },
    mounted() {
      this.initRadiusForm()
    }
  }
</script>

