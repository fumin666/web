<template>
  <section>
    <s-form :model="staffForm" :rules="staffRule" ref="staffForm" label-width="125px">
      <s-form-item label="账号名称" prop="accountNameRule" class="is-required">
        <s-radio-group v-model="staffForm.accountNameRule">
          <s-radio label="0">邮件前缀</s-radio>
          <s-radio label="1">真实姓名</s-radio>
          <s-radio label="2" v-if="isWorkNumber">工号</s-radio>
          <s-radio label="3">自定义</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="自定义规则" prop="prefix" v-if="RuleShow">
        前缀&nbsp;
        <s-input v-model="staffForm.prefix" style="width: 120px"></s-input>
        +&nbsp;
        <s-select v-model="staffForm.digits" style="width: 80px" placeholder="位数">
          <s-option label="3" :value="3" :key="3"></s-option>
          <s-option label="4" :value="4" :key="4"></s-option>
          <s-option label="5" :value="5" :key="5"></s-option>
        </s-select>
        &nbsp;位随机数
      </s-form-item>
      <s-form-item label="默认口令" prop="defaultpwd">
        <s-input v-model="staffForm.defaultpwd"></s-input>
      </s-form-item>
      <s-form-item label="口令使用期限" prop="pwdtime" class="pwdtime is-required">
        <div style="float: left">
          <s-input-number style="width: 250px" v-model="staffForm.pwdtime" :min="0" :max="1000000000" :disabled="staffForm.pwdtime===0"></s-input-number>
        </div>
        <div style="float: left;margin-left: 8px;line-height: 36px">
          <span class="unit">天</span>
          <s-checkbox v-model="staffForm.pwdtime" :true-label="0" :false-label="1">永久使用</s-checkbox>
        </div>
      </s-form-item>
      <s-form-item label="下次登录修改口令">
        <s-radio-group v-model="staffForm.userChangePasswd">
          <s-radio :label="1">是</s-radio>
          <s-radio :label="0">否</s-radio>
        </s-radio-group>
      </s-form-item>
      <s-form-item label="账号到期时间" prop="maturitytime">
        <s-date-picker style="width: 250px" class="fl"
                       type="datetime"
                       :editable="false"
                       value-format="yyyy-MM-dd HH:mm:ss"
                       format="yyyy-MM-dd HH:mm:ss"
                       :disabled="neveCheckValue"
                       placeholder="选择日期"
                       :picker-options="pickerOptions"
                       v-model="staffForm.maturitytime"></s-date-picker>
        <div style="float: left;margin-left: 8px; line-height: 36px">
          <s-checkbox v-model="neveCheckValue" @change="neveCheck">永不过期</s-checkbox>
        </div>
      </s-form-item>
      <s-form-item label="IP规则" prop="iprules" class="ip-rule-box">
        <s-select style="width: 200px" v-model="staffForm.ipType" placeholder="请选择规则">
          <s-option label="允许登录" value="1"></s-option>
          <s-option label="拒绝登录" value="0"></s-option>
        </s-select>
        <s-input v-model="staffForm.iprules" style="width: 285px"></s-input>
        <s-tooltip class="tip" content="多个IP(段)以英文逗号分割(例如: 192.168.1.*,192.168.[2,3].[1-5,15,25,35,45]);'*'表示不对登录IP地址做限制" placement="right">
          <i class="iconfont icon-help"></i>
        </s-tooltip>
      </s-form-item>
      <s-form-item label="多点并发数" prop="Multipoint_concurrency">
        <s-input v-model="staffForm.Multipoint_concurrency" style="width: 95%"></s-input>
        <s-tooltip class="tip" content="该字段标识了同一账号在同一资产上可登录的浏览器个数;'*'表示不对多点并发数做限制" placement="right">
          <i class="iconfont icon-help"></i>
        </s-tooltip>
      </s-form-item>
      <s-form-item label="多次并发数" prop="Multicount_concurrency">
        <s-input v-model="staffForm.Multicount_concurrency" style="width: 95%"></s-input>
        <s-tooltip class="tip" content="该字段标识了同一账号在不同资产上可登录的个数;'*'表示不对多次并发数做限制" placement="right">
          <i class="iconfont icon-help"></i>
        </s-tooltip>
      </s-form-item>
      <s-form-item label="状态">
        <s-select v-model="staffForm.status" @change="changeStatus">
          <s-option v-for="item in status" :label="item.name" :value="item.val" :key="item.id"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
    <s-row>
      <div style="float: right">
        <s-button @click="submitForm">确定</s-button>
        <s-button type="cancel" @click="cancel">取消</s-button>
      </div>
    </s-row>
  </section>
</template>

<script>
import $axios from 'sunflower-ajax';
import { intersectObj, Validaters } from 'sunflower-common-utils';
export default {
  data() {
    let validatorNum = function (rule, value, callback) {
      if (value.trim() === '*') {
        callback();
        return;
      };
      if (Validaters.isNum(value)) {
        callback();
      } else {
        callback(new Error(`只能填写数字`));
      }
    };
    // 校验正整数(包含0)
    let checkInt = (rule, value, callback) => {
      if (value || value === 0) {
        let reg = /^([1-9]\d*|[0]{1,1})$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正整数值'));
        } else {
          callback();
        }
      } else {
        callback(new Error('不能为空'));
      }
    };
    return {
      neveCheckValue: false, // 永不过期开关
      activeName: '1',
      status: [
        {name: '激活', val: 1},
        {name: '未激活', val: 0},
        {name: '锁定', val: 2},
        {name: '注销', val: 3},
        {name: '待开启', val: 5},
        {name: '离职', val: 7}
      ],
      staffForm: {
        accountNameRule: '0',
        defaultpwd: '',
        pwdtime: 7,
        userChangePasswd: 1, // 下次登录是否修改口令
        ipType: '1', // 规则类型
        maturitytime: null,
        iprules: '*',
        Multipoint_concurrency: '*',
        Multicount_concurrency: '*',
        status: '',
        custom: ''
      },
      staffRule: {
        defaultpwd: [Validaters.NotNull],
        pwdtime: [Validaters.NotNull, {validator: checkInt, trigger: 'blur'}],
        iprules: [{validator: Validaters.OMAIP, trigger: 'blur'}],
        Multipoint_concurrency: [{validator: validatorNum, trigger: 'blur'}],
        Multicount_concurrency: [{validator: validatorNum, trigger: 'blur'}]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      RuleShow: false,
      isWorkNumber: 1,
      wkUuid: '954e9cffc6894affa850b0655cd7ea7b'
    }
  },
  created() {
    this.init()
  },
  methods: {
    neveCheck(val) { // 永不过期控制
      this.staffForm.maturitytime = val ? 0 : null
    },
    init() {
      $axios.get(`/userProperties/viewUserProperty/${this.wkUuid}`).then(({data}) => { // 判断是否添加工号
         this.isWorkNumber = data.applyFlag
      });
      $axios.get('systemmanager/sysConfig/getDefaultUserInfoAccount').then(({data}) => {
        this.staffForm = {...intersectObj(this.staffForm, data), userChangePasswd: parseInt(data.userChangePasswd)}
        this.staffForm.status = parseInt(this.staffForm.status)
        if (this.staffForm.maturitytime) {
          this.neveCheckValue = false
        } else {
          this.neveCheckValue = true
        }
        if (this.staffForm.custom !== null) {
          this.$set(this.staffForm, 'digits', parseInt(data.custom.split(',')[1]));
          this.staffForm.prefix = this.staffForm.custom.split(',')[0]
        } else {
          this.$set(this.staffForm, 'digits', 3);
          this.staffForm.prefix = ''
        }
      });
      $axios.get('/login/isGoogleAuthLoginType').then(({data}) => {
        if (data) {
          this.status = [
            {name: '待开启', val: 5},
            {name: '未激活', val: 0},
            {name: '锁定', val: 2}
          ];
          this.staffForm.status = 5
        } else {
          this.status = [
            {name: '激活', val: 1},
            {name: '未激活', val: 0},
            {name: '锁定', val: 2}
          ]
          this.staffForm.status = 1
        }
      });
    },
    submitForm() {
      let form = this.staffForm
      if (form.accountNameRule === '3') {
        if (form.prefix !== '') {
          form.custom = form.prefix.toString() + ',' + form.digits.toString()
        } else {
          this.$message.error('请填写自定义规则');
          return false
        }
      }
      this.$refs['staffForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        $axios.post('systemmanager/sysConfig/saveDefaultUserInfoAccount', form, {
          data: [{name: form.accountNameRule}],
          logTemplate: '编辑|人员管理>账号生成规则'
        }).then((res) => {
          if (res.data.result === true) {
            this.$message.success('保存成功');
            this.$emit('createAccountHandle')
          } else {
            this.$message.error(res.data.message);
          }
        })
      })
    },
    cancel() {
      this.$emit('createAccountHandle')
    }
  },
  watch: {
    'staffForm.accountNameRule': {
      handler(value) {
        if (value === '3') {
          this.RuleShow = true
        } else {
          this.RuleShow = false
        }
      }
    }
  }
}
</script>

