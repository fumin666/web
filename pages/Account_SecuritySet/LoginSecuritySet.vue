<template>
  <section id="LoginSecuritySet" class="login-set">
    <s-row class="radioBar">
      <s-col :span="6" class="grid-content radioTitle">选择密码策略等级：</s-col>
      <s-col :span="18" class="grid-content">
        <s-radio-group v-model="level">
          <s-radio label="0">低</s-radio>
          <s-radio label="1">中</s-radio>
          <s-radio label="2">高</s-radio>
        </s-radio-group>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6" class="grid-content bg-purple">最小口令长度：</s-col>
      <s-col :span="18" class="grid-content bg-purple-light">{{showLevel.passwdLenth}}</s-col>
    </s-row>
    <s-row>
      <s-col :span="6" class="grid-content bg-purple">口令复杂度：</s-col>
      <s-col :span="18" class="grid-content bg-purple-light">{{ pwdComplexity }}</s-col>
    </s-row>
    <s-row>
      <s-col :span="6" class="grid-content bg-purple">认证失败最大次数：</s-col>
      <s-col :span="18" class="grid-content bg-purple-light">
        {{showLevel.passwdFailCnt===0?'无限制':showLevel.passwdFailCnt}}
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6" class="grid-content bg-purple">页面超时（分钟）：</s-col>
      <s-col :span="18" class="grid-content bg-purple-light">
        {{showLevel.pageTimeout}}
      </s-col>
    </s-row>
    <s-row style="text-align: right;">
      <s-button @click="saveLevel">保存</s-button>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';

  export default{
    data() {
      return {
        level: '1',
        showLevel: {},
        lowLevel: {},       // 低安全等级已配置数据
        middleLevel: {},    // 中安全等级已配置数据
        upperLevel: {},     // 高安全等级已配置数据
        pageTimeoutOrigin: {}         // 已配置页面超时数据
      }
    },
    computed: {
      pwdComplexity() {
        let res = [];
        this.showLevel.passwdD && res.push('数字');
        this.showLevel.passwdL && res.push('小写字母');
        this.showLevel.passwdU && res.push('大写字母');
        this.showLevel.passwdS && res.push('特殊字符');
        return res.join('，');
      }
    },
    watch: {
      level(newVal) {
        if (newVal) {
          switch (newVal) {
            case '0': this.showLevel = this.lowLevel; break;
            case '1': this.showLevel = this.middleLevel; break;
            case '2': this.showLevel = this.upperLevel; break;
            default: this.showLevel = this.lowLevel;
          }
          this.$set(this.showLevel, 'pageTimeout', this.pageTimeoutOrigin[newVal]);
        }
      }
    },
    methods: {
      // 获取"密码策略"tab已配置的表单数据
      initPwdFormData() {
        $axios.get('/systemmanager/sysPasswdRule/listBySecurityLevel').then(({data}) => {
          if (data && data instanceof Object) {
            this.lowLevel = data[0];
            this.middleLevel = data[1];
            this.upperLevel = data[2];
            this.showLevel = this.middleLevel;
            // 获取页面超时数据数据
            Promise.all([this.initPageTimeout()]).then(() => {
              this.getEditLevelData();
            });
          }
        });
      },
      // 获取"密码策略"tab已配置的面超时数据
      initPageTimeout() {
        return new Promise((resolve, reject) => {
          $axios.get('/systemmanager/sysConfig/getSessionTimeOut').then(({data}) => {
            if (data && data instanceof Object) {
              this.pageTimeoutOrigin = data;
              // 进入页面，页面超时表单初始化赋值(低安全等级)
              this.$set(this.showLevel, 'pageTimeout', data['1']);
              resolve()
            } else {
              reject()
            }
          });
        });
      },
      // 获取上一次保存的登录安全设置等级
      getEditLevelData() {
        $axios.get('/systemmanager/sysConfig/getDefaultPwdRuleLevel').then(({data}) => {
          if (data && !isNaN(data)) {
            this.level = data;
          }
        });
      },
      // 保存登录安全设置
      saveLevel() {
        $axios.post(`/systemmanager/sysConfig/saveDefaultPwdRuleLevel/${this.level}`, {
          logTemplate: '设置|登录安全设置>登录安全设置'
        }).then(({data}) => {
          if (data === 'success') {
            this.$message.success('保存成功！');
          } else {
            this.$message.error('保存失败，请重试！');
          }
        });
      }
    },
    created() {
      this.initPwdFormData();       // 获取已配置密码策略表单数据
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #LoginSecuritySet
    .radioBar
      margin-bottom 15px
    .radioTitle
      font-size 14px
</style>
