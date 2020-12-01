/**
 * @author fumin
 * @date 2019/7/29
 * @Description: 报表中心 >运维审计报表 -> 智能审计 -> 评分规则弹框
*/
<template>
  <div>
    <section class="logSessionDetail">
      <s-row><span class="title">命令的风险级别分值设置</span></s-row>
      <s-row>
        <span v-for="(i,index) in commandRiskNew" :key="index">
          <s-button size="mini">{{ i.configName }}</s-button>
          <!--只有系统管理员和审计管理员可以编辑，其他权限只读，不能编辑-->
          <s-form style="display: inline-block;margin: 0 10px">
            <s-form-item><s-input v-model="i.configValue" style="width: 60px;"></s-input></s-form-item>
          </s-form>
        </span>
        <s-button @click="saveScore">保存</s-button>
      </s-row>
    </section>
    <section class="logSessionDetail">
      <s-row><span class="title">评分规则说明</span></s-row>
      <s-row>1）如果任何一个会话，执行了会话阻断命令，即智能评分为0分；</s-row>
      <s-row>2）如果没有执行任何会话阻断命令，则根据会话中执行的命令的风险级别所对应的分值，从100分中扣除，所得智能评分；</s-row>
      <s-row>3）优，80< 评分 <=100；</s-row>
      <s-row>4）良，60< 评分 <=80；</s-row>
      <s-row>5）差，评分 <=60。</s-row>
    </section>
  </div>
</template>

<script>
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';
  import $axios from 'sunflower-ajax'
  // import {Validaters} from 'sunflower-common-utils';
    export default {
      mixins: [roleCheckMixin],
       data() {
         return {
           value: '',
           params: {sysConfig: []},
           isAuditAdmin: false,
           isEditScore: false,
           commandRiskNew: [] // 风险等级
         }
       },
      methods: {
        getRisk() {
          $axios.get('/operationLogStat/getInitCmdRiskValue').then((res) => {
            this.commandRiskNew = res.data
          })
        },
        saveScore() { // 保存对风险级别的设置
          this.params.sysConfig = this.commandRiskNew
          for (let i = 0; i < this.commandRiskNew.length; i++) {
            // 不能包含特殊字符并且不能包含中文和英文 在0-99的数字
            if (this.commandRiskNew[i].configValue.indexOf('.') === -1 && (parseInt(this.commandRiskNew[i].configValue) >= 0) && (parseInt(this.commandRiskNew[i].configValue) <= 99)) {
              if (/['"(\u4e00-\u9fa5)@#$%&a-zA-Z\^*]/.test(this.commandRiskNew[i].configValue)) {
                this.isEditScore = false
                this.$message.warning('请输入0-99的整数')
                return
              } else if ((i > 0) && (parseInt(this.commandRiskNew[i].configValue) >= parseInt(this.commandRiskNew[i - 1].configValue))) {
                this.isEditScore = false
                this.$message.warning('等级低的分值不能大于或等于等级高的分值！')
                return
              } else {
                this.isEditScore = true
              }
            } else {
              this.isEditScore = false
              this.$message.warning('请输入0-99的整数')
              return
            }
          }
          if (this.isEditScore) {
            $axios.post('/operationLogStat/mondifyCmdRiskValue', this.params).then((res) => {
              if (res.data.state) {
                this.$message({showClose: true, message: '保存成功', type: 'success'});
              } else {
                this.$message({showClose: true, message: '保存失败', type: 'error'});
              }
            })
          }
        }
      },
      created() {
        this.getRisk()
        if (this.$store.state.userData.roleUuidsStr === 'tsecondroleinfo00000000000000002') {
          this.isAuditAdmin = true
        }
      }
    }
</script>

<style scoped>

</style>
