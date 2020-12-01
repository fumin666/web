<template>
  <s-row class="interlligentTab"
         :gutter="10">
    <s-col span="8">
      <div class="container">
        <div class="header">
          <div>
            <i class="iconfont icon-business-server"></i>
            <span class="title">免审计设置</span>
          </div>
          <s-switch v-model="model1.infoValue"
                    active-value="1"
                    inactive-value="0"
                    class="switch"></s-switch>
        </div>
        <div class="body">
          <div class="desc">用于是否需要开启智能免审计功能</div>
          <div class="btn">
            <s-button @click="save1">保存</s-button>
          </div>
        </div>
      </div>
    </s-col>
    <s-col span="8">
      <div class="container">
        <div class="header">
          <div>
            <i class="iconfont icon-oper-equip"></i>
            <span class="title">参数设置</span>
          </div>
        </div>
        <div class="body">
          <s-row class="opera">
            <s-form :model="model2"
                    :rules="model2Rules"
                    :inline="true"
                    ref="model2Form">
              <span class="text">周期</span>
              <s-form-item prop="infoValue1">
                <s-input v-model="model2.infoValue1"
                         :step="1"
                         :min="1"
                         :max="2147483647"
                         style="width:100%;"></s-input>
              </s-form-item>
              <span class="text">天内，</span><br />
              <span class="text">每天pattern出现次数的均值>=</span>
              <s-form-item prop="infoValue2">
                <s-input v-model="model2.infoValue2"
                         :step="1"
                         :min="1"
                         :max="2147483647"
                         style="width:100%;"></s-input>
              </s-form-item>
              <span class="text">条时免审计</span>
            </s-form>
          </s-row>
          <div class="btn">
            <s-button @click="save2">保存</s-button>
          </div>
        </div>
      </div>
    </s-col>
    <s-col span="8">
      <div class="container">
        <div class="header">
          <div>
            <i class="iconfont icon-tool"></i>
            <span class="title">调试设置</span>
          </div>
          <s-switch v-model="model3.infoValue"
                    class="switch"
                    active-value="1"
                    inactive-value="0"></s-switch>
        </div>
        <div class="body">
          <div class="desc">pattern统计数据缓存到文件，每天缓存一次，便于后续查看</div>
          <div class="btn">
            <s-button @click="save3">保存</s-button>
          </div>
        </div>
      </div>
    </s-col>
  </s-row>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
function validatorIsNumber(rule, value, callback) {
  if (!value) {
    callback();
    return;
  }
  let reg = /^\d+$/;
  if (!reg.test(value)) {
    callback(new Error(`请输入大于等于1的正整数`));
  }
  callback();
}

export default {
  data() {
    return {
      model1: {
        id: '',
        infoValue: '0'
      },
      model2: {
        id: '',
        infoValue1: 3,
        infoValue2: '500'
      },
      model3: {
        id: '',
        infoValue: '0'
      },
      model2Rules: {
        infoValue1: [
          Validaters.NotNull,
          { validator: validatorIsNumber, trigger: 'blur' },
          Validaters.MaxNum(2147483647), // 限制最大值为int32的最大值
          Validaters.MinNum(1)
        ],
        infoValue2: [
          Validaters.NotNull,
          { validator: validatorIsNumber, trigger: 'blur' },
          Validaters.MaxNum(2147483647), // 限制最大值为int32的最大值
          Validaters.MinNum(1)
        ]
      }
    }
  },
  created() {
    $axios.get('/sysIgnoreAudit/getSwitch').then(({data}) => {
      for (let i in this.model1) {
        this.model1[i] = data[i];
      }
    });
    $axios.get('/sysIgnoreAudit/getParam').then(({data}) => {
      this.model2.id = data.id;
      let infoValue = data.infoValue.split(',');
      this.model2.infoValue1 = infoValue[0];
      this.model2.infoValue2 = infoValue[1] || '500';
    });
    $axios.get('/sysIgnoreAudit/getDebug').then(({data}) => {
      for (let i in this.model1) {
        this.model3[i] = data[i];
      }
    });
  },
  methods: {
    save1() {
      let flag = '开关'
      this.axiosSave(this.model1, flag)
    },
    save2() {
      this.$refs.model2Form.validate(valid => {
        if (!valid) return;
        let param = {
          id: this.model2.id,
          infoValue: this.model2.infoValue1 + ',' + this.model2.infoValue2
        };
        let flag = '参数'
        this.axiosSave(param, flag)
      });
    },
    save3() {
      let flag = '调试'
      this.axiosSave(this.model3, flag)
    },
    axiosSave(param, flag) {
      let obj = {
        data: [],
        logTemplate: `保存|智能免审计(${flag})`
      }
      $axios.post('/sysIgnoreAudit/update', param, obj).then(({data}) => {
        if (data === true) {
          this.$message({message: '保存成功', type: 'success'});
        } else {
          this.$message({message: '保存失败', type: 'error'});
        }
      })
    }
  }
}
</script>

<style lang="stylus">
.interlligentTab .s-input-number.is-controls-right .s-input-inner {
  padding: 5px;
}

.interlligentTab .s-input {
  width: auto !important;
}

/* .interlligentTab
    .s-row
      margin-bottom 0
    .container
      border: 1px solid #1E3444
      .header
        display flex
        align-items center
        height 90px
        background #03111E
        border-bottom 1px solid #1E3444
        i
          font-size: 55px
          font-weight 600
          color: #1976C4
          margin-right 10px
        .title
          font-size 18px
          font-weight 600
          line-height 30px
        .desc
          font-size 12px
          line-height 20px
          color: #B5C0CE
      .body
        height: 170px
        padding 30px 10px 10px 10px
        display flex
        flex-direction column
        justify-content space-between
        font-size 14px
        .opera
          line-height 30px
          .text
            line-height 36px
          .s-form-item
            margin-bottom 10px
            margin-right 0
          .s-input
            width: auto
            vertical-align middle
        .btn
          text-align center
        input[type=number]
          -moz-appearance: textfield
          &::-webkit-inner-spin-button, &::-webkit-outer-spin-button
            -webkit-appearance: none
            margin: 0
*/
</style>
