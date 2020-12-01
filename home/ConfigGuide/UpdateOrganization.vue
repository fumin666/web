<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导-更新组织
 * @Date: 2020-01-19 10:09:14
 * @LastEditors: mybells
 -->
<template>
  <div class="update_organization">
    <p class="font_color word">请更新组织机构名称，如不需要更新请直接下一步</p>
    <s-form :rules="rules" ref="updateOrganization" :model="map">
      <s-form-item label="顶级组织机构名称：" prop="departName">
        <s-input v-model="map.departName"></s-input>
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        map: {
          departName: ''
        },
        rules: {
          departName: [
            {required: true, message: '组织机构名称不能为空', trigger: 'blur'},
            { max: 30, message: '长度不能超过30个字符', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      if (this.step3) {
        this.map = Object.assign({}, this.step3);
      } else {
        $axios.get('/firstUsageWizard/getTopDepartName').then((res) => {
          if (res.data) {
            this.map.departName = res.data;
          }
        })
      }
    },
    computed: {
      activeStep: {
        get() {
          return this.$store.state.configGuide.activeStep;
        },
        set(val) {
          this.$store.commit('configGuide/SET_ACTIVESTEP', val);
        }
      },
      step3: {
        get() {
          return this.$store.state.configGuide.step3;
        },
        set(val) {
          this.$store.commit('configGuide/SET_STEP3', val);
        }
      }
    },
    methods: {
      submitForm() {
        this.$refs['updateOrganization'].validate((valid) => {
          if (valid) {
            $axios.get(`/firstUsageWizard/changeTopDepartName/${this.map.departName}`).then((res) => {
              if (res.data.state) {
                this.step3 = this.map;
                this.activeStep++;
              } else {
                this.$message({
                  type: 'warning',
                  message: res.data.errormsg
                })
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请按要求填写信息！'
            })
          }
        });
      }
    }
  }
</script>

<style lang="stylus">
.update_organization{
  padding-right:40px;
  .word{
    margin:20px 0 30px 0;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
  }
  .s-form-item-label{
    float: none;
  }
}
</style>
