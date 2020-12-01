<!--
 * @Author: songyf
 * @Date: 2020-2-11
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-通报类型设计器
 -->
<template>
  <section id="designer">
    <s-row class="title-bar">
      <s-col :span="4">
        <h2 class="designer-title">
          <div class="title-img">
            <img src="/static/images/processServiceRequest/serviceDesign.png"/>
            <div style="margin-top: 10px;">
              通报类型设计器
            </div>
          </div>
        </h2>
      </s-col>
      <s-col :span="20">
        <h4 class="producer">
          <img src="/static/images/processServiceRequest/designWarn.png" style="width:14px; height: 14px"/>
          通报类型设计器将会指导您完成通报类型从创建到部署的全部过程。您可以点击【上一步】或【下一步】进行不同的操作设置。
        </h4>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="4" style="margin-top: 40px">
        <s-steps :current="currentMenuIdx" direction="vertical" class="step-box" finish-status="success"
                 style="height: 250px;padding-left: 19%;box-sizing: border-box">
          <s-step v-for="(list,idx) in menuList" :title="list" :key="idx"></s-step>
        </s-steps>
      </s-col>
      <s-col :span="19">
        <section class="right-content-ctn">
          <keep-alive>
            <component :is="currentMenu"
                       :currentIndex="currentMenuIdx"
                       :bulletinUuid="bulletinUuid"
                       :bulletinState="bulletinState"
                       ref="currentMenu"></component>
          </keep-alive>
          <s-row class="bottom-tool-bar" v-if="currentMenuIdx!==0">
            <s-button @click="intoProcess" v-if="currentMenuIdx===3" type="cancel">生成流程图</s-button>
            <s-button @click="preStep" type="cancel">上一步</s-button>
            <s-button
              :disabled="saveDisabled && currentMenuIdx===3"
              @click="nextStep">{{currentMenuIdx===3 || (currentMenuIdx===2 && isNeedItil=== false)?'完成':'下一步'}}
            </s-button>
            <s-button @click="cancel" type="cancel">取消</s-button>
          </s-row>
        </section>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus';
  import $axios from 'sunflower-ajax';
  import {step0, step1, step2, step3} from './DesignerSteps/index';
/*  const formType = { // 1-文本,2-多行文本,3-列表,4-数值,5-日期,6-附件
    udf_char_single_line: 1,
    udf_char_multiple_line: 2,
    udf_char_list: 3,
    udf_long: 4,
    udf_date: 5,
    udf_file: 6
  }; */
  export default {
    data() {
      return {
        bulletinState: null, // 获取编辑数据
        menuList: ['设计器概述', '通报类型定义', '表单定义', '流程设计'],
        currentMenuIdx: 0,
        saveDisabled: false,  // 保存按钮是否禁灰不可用
        isNeedItil: true,  // 是否需要走流程
        mixinData: {
          step1: null,
          step2: null,
          step3: null
        },
        bulletinUuid: '', // 通报类型uuid
        axiosUrl: '/safetyPlatform/safetyBulletin/save' // 创建
      }
    },
    computed: {
      currentMenu() {
        return `step${this.currentMenuIdx}`;
      },
      SRC() {
        let theme = localStorage.getItem('theme');
        return {
          bg: theme === 'dark' ? 'dark-bg' : 'topbg',
          icon: theme || 'fanta'  // fanta为默认主题
        }
      }
    },
    methods: {
      // 取消
      cancel() {
        this.$confirm('离开本页面将导致所有已填数据丢失，确定离开？？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.get(`/safetyPlatform/safetyBulletin/deleteItilNodeBySafeType/${this.bulletinUuid}`).then(({data}) => {
          })
          this.$router.push(`/SafetyBulletin/safetyBulletin_tbconfig`);
        }).catch(() => {});
      },
      // 返回上一步
      preStep() {
        this.getStepData();
        if (this.currentMenuIdx > 0) this.currentMenuIdx -= 1;
      },
      // 下一步/保存
      nextStep() {
        this.getStepData();
        if (this.currentMenuIdx < 3) { // 下一步
          // step1-服务目录操作判断
          if (this.currentMenuIdx === 1) {
            this.validateStep1();
          } else if (this.currentMenuIdx === 2) {
            if (this.$refs.currentMenu.$refs.dragForm.dropLists.length > 0) {
              if (this.isNeedItil) {
                this.currentMenuIdx += 1;
              } else {
                this.saveAxiosData()
              }
            } else {
              this.$message.warning('请定义通报类型提交表单字段！');
            }
          } else {
            this.currentMenuIdx += 1;
          }
        } else { // 保存
          this.saveAxiosData()
        }
      },
      intoProcess() {
        this.$refs.currentMenu.intoProcess()
      },
      saveAxiosData() { // 通报类型设计器终极保存
        // 接口上传数据初始化
        let saveData = {
          safeType: {}, // 通报类型定义
          safeTypeAttrList: [] // 表单定义
        };
        /* **step1-通报类型定义** */
        let stepFormData = this.mixinData.step1
        saveData.safeType = {
          uuid: this.bulletinUuid,
          bulletinName: stepFormData.bulletinName,
          needItil: stepFormData.needItil,
          remark: stepFormData.remark
        };
        /* **step2-定义表单** */
        saveData.safeTypeAttrList = this.mixinData.step2.map(item => {
          let data = {
            typeUuid: this.bulletinUuid,
            uuid: item.uuid,
            attrName: item.attrName,
            attrDesc: item.attrDesc,
            attrType: item.attrType,
            isRequired: item.isRequired,
            attrValue: item.attrValue,
            isTheme: item.isTheme,
            isDefault: item.isDefault
          }
          if (item.attrType === 3) {
            data.dropDownOptionList = item.dropDownOptionList.map(list => {
              return {selectName: list.selectName}
            })
          }
          return data
        });
        if (this.currentMenuIdx !== 2 && this.mixinData.step3.length === 0) {
          this.$message({
            type: 'warning',
            message: '请先添加流程结点！'
          })
          return
        }
        let str = ''
        str = `添加|通报类型(${saveData.safeType.bulletinName})`
        if (this.bulletinState !== null) { // 如果存在就是编辑
          this.axiosUrl = '/safetyPlatform/safetyBulletin/update';
          saveData.safeType.uuid = this.bulletinState.safeType.uuid
          str = `编辑|通报类型(${this.bulletinState.safeType.bulletinName})`
        }
        // 先将保存按钮置灰，防止多次保存
        this.saveDisabled = true;
        // 保存设计器
        $axios.post(this.axiosUrl, saveData, {
          data: [saveData],
          logTemplate: str
        }).then(({data}) => {
          if (data.state === true) {
            this.$message.success(data.errormsg);
            this.saveDisabled = false;
            this.$store.commit('setEditBulletin', null);  // 清楚存放在vuex里的编辑数据
            this.$router.push(`/SafetyBulletin/safetyBulletin_tbconfig`);
          } else {
            this.$message.error(data.errormsg);
            this.saveDisabled = false;
          }
        });
      },
      // 切换菜单时，获取即将离开菜单中的数据
      getStepData() {
        switch (this.currentMenuIdx) {
          case 1:
            this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.stepForm1;
            break;
          case 2:
            this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.$refs.dragForm.dropLists;
            break;
          case 3:
            this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.nodeData;
            break;
        }
      },
      /**
       * 检测step1-服务目录数据是否合法，是否已选择要配置的"服务请求"
       * 从而判断是否阻止跳转
       */
      validateStep1() {
        this.$refs.currentMenu.$refs.stepForm1.validate(valid => {
          if (valid) {
            console.log(this.$refs.currentMenu.$refs);
            if (this.$refs.currentMenu.$refs.stepForm1.model.needItil === 0) {
              this.isNeedItil = false
            } else {
              this.isNeedItil = true
            }
            this.currentMenuIdx += 1;
          } else {
            this.$message.warning('请按要求填写信息！');
          }
        })
      },
      beforeunloadHandler (e) {
        e = e || window.event
        if (e) {
          e.returnValue = '关闭提示'
        }
        return '关闭提示'
      }
    },
    /**
     * 路由离开当前页面丢失数据信息提示
     */
    beforeRouteLeave(to, from, next) {
      if (from.path.indexOf('/safetyBulletin_designer') !== -1 && to.path.indexOf('/diy') !== -1) {
        next();
      } else if (from.path.indexOf('/safetyBulletin_designer') !== -1 && to.path.indexOf('/safetyBulletin_tbconfig') === -1) {
        this.$confirm('离开本页面将导致所有已填数据丢失，确定离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next();
        }).catch(() => {
        });
      } else {
        next();
      }
    },
    created() {
      // 根据路由参数设判断是否为编辑
      if (this.$route.query.uuid !== undefined) {
        $axios.get(`/safetyPlatform/safetyBulletin/getTbDetail/${this.$route.query.uuid}`).then(({data}) => {
          if (data) {
            this.$store.commit('setEditBulletin', data);
            this.bulletinState = this.$store.state.safetyBulletin.editDesigner;
            this.bulletinUuid = this.bulletinState.safeType.uuid
            // this.intoProcess()
          }
        });
      } else { // 添加
        $axios.get(`/safetyPlatform/safetyBulletin/toCreateSafeTypeUuid`).then(({data}) => {
          this.bulletinUuid = data
        })
      }
      /**
       * 监听键盘/浏览器刷新按钮刷新页面事件，给出提示
       */
      let _this = this;
      window.onbeforeunload = (e) => {
        // 判断路由，防止从当前页跳出至其他路由时，第一次依旧有系统弹框提示。
        if (_this.$route.path.indexOf('/safetyBulletin_designer') !== -1) {
          e = e || window.event;
          let returnTxt = '离开本页面将导致所有已填数据丢失，确定离开？';
          // 兼容IE8和Firefox 4之前的版本
          if (e) e.returnValue = returnTxt;
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return returnTxt;
        }
      };
      /**
       * 监听step0中"创建"/"编辑弹框下一步"事件
       */
      Bus.$on('goToStep1', () => {
        this.currentMenuIdx = 1;
      });
    },
    components: {
      step0,
      step1,
      step2,
      step3
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #designer
    .title-bar
      height: 130px;
      margin-top: 10px;
      margin-bottom: -30px;

      .designer-title
        font-size 18px
        font-weight bold
        height 100px

        .title-img
          padding-top 30px
          text-align center

          img
            vertical-align middle

      .producer
        font-size 15px
        line-height 60px

        .icon-help
          font-size 18px

    ul.designer-menu
      li
        height 38px
        line-height 38px
        font-size 15px
        border-left 3px solid transparent
        padding-left 30px

    .step-box
      .s-step-main
        margin-top 8px

    .right-content-ctn
      margin-top -45px
      min-height calc(100vh - 230px)
      padding 20px 40px
      margin-right 15px

      .step-title
        font-size 15px
        font-weight bold
        margin-bottom 30px

      .bottom-tool-bar
        margin-top 60px
</style>
