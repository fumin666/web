<template>
  <section class="operational-approval">
    <header id="headBar" class="noPrint">
      <s-row type="flex" justify="between" align="middle" class="header-bg">
        <s-col :span="8" class="left-info">
          <div class="logo-icon" :title="systemName">
            <img src="static/images/logo/logo.svg"/>
          </div>
        </s-col>
        <s-col :span="8" class="right-info">
          <s-row type="flex" justify="center" align="middle" :gutter="16">
            <span class="title">运维审批</span>
          </s-row>
        </s-col>
      </s-row>
    </header>
    <section class="wrap">
      <div class="">
        <s-form :model="approvalForm" ref="approvalForm" :rules="approvalForm" label-width="90px">
          <s-form-item label="运维号：">
            {{approvalForm.specialCode}}
          </s-form-item>
          <s-form-item label="审批：">
            <s-select v-model="approvalForm.approvalStatus">
              <s-option v-for="(option,index) in statusOptions" :label="option.name" :value="option.value" :key="index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="审批意见：">
            <s-input type="textarea" v-model="approvalForm.comments" :rows="6" :maxlength="120" placeholder="最大长度为 120 个字符"></s-input>
            <p>审批意见最大长度为 120 个字符</p>
          </s-form-item>
          <s-form-item label="">
            <s-button @click="saveApproval()">确定</s-button>
          </s-form-item>
        </s-form>
      </div>
    </section>
  </section>
</template>

<script type="text/babel">
  import {getConfig} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax';
  export default {
    data () {
      return {
        systemName: getConfig('systemName'),
        applyuuid: '',
        approvaluuid: '',
        approvaluseruuid: '',
        applyCommandUuidList: [],
        applyResourceUuidList: [],
        statusOptions: [],
        approvalForm: {
          specialCode: '',
          approvalStatus: 1,
          comments: ''
        }
      }
    },
    created () {
      this.getData();
    },
    methods: {
      getData () {
        this.approvaluuid = this.$router.currentRoute.params.approvaluuid;
        this.applyuuid = this.$router.currentRoute.params.applyuuid;
        this.approvaluseruuid = this.$router.currentRoute.params.approvaluseruuid;
        $axios.get(`/specialOperationApply/getEmailSpecialApplyDealOrder/${this.applyuuid}/${this.approvaluuid}/${this.approvaluseruuid}`).then(({data}) => {
          let objStatus = data.specialApplyAuditMap;
          if (Object.keys(objStatus).length !== 0) {
            for (let key in objStatus) { // 遍历审批意见下拉框的数据
              this.statusOptions.push({name: key, value: objStatus[key]})
            }
          }
          this.approvalForm.specialCode = data.specialCode;
          this.applyCommandUuidList = data.relcommandList;
          this.applyResourceUuidList = data.relresourceList;
        })
      },
      saveApproval () {
        let vm = this;
        $axios.get(`/specialOperationApply/checkEmailApproval/${vm.approvaluuid}`).then(({data}) => {
          if (data.state === true) {
            vm.jumpAddress();
          } else {
            vm.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      },
      jumpAddress() {  // 成功跳转
        let vm = this;
        let applyCommandUuidArr = [];
        let applyResourceUuidArr = [];
        vm.applyCommandUuidList.forEach((v) => {
          applyCommandUuidArr.push(v.uuid)
        });
        vm.applyResourceUuidList.forEach((v) => {
          applyResourceUuidArr.push(v.uuid)
        });
        let param = {
          applyUuid: vm.applyuuid,
          applyCommandUuidList: applyCommandUuidArr,
          applyResourceUuidList: applyResourceUuidArr,
          applyStatus: vm.approvalForm.approvalStatus,
          approvalUuid: vm.approvaluuid,
          comments: vm.approvalForm.comments,
          poxyUuid: '',
          emailUser: vm.approvaluseruuid
        };
        $axios.post('/specialOperationApply/dealSpecialApply', param).then(({data}) => {
          if (data.state === true) {
            vm.$router.push({name: 'ApprovalSuccess', params: {errormsg: data.errormsg}})
          } else {
            vm.$message({showClose: true, message: data.errormsg, type: 'error'});
          }
        })
      }
    }
  }
</script>

<style>
  .operational-approval .title{
    padding-right: 30px;
    color: #fff;
    line-height: 35px;
  }
  .operational-approval .wrap{
    width: 700px;
    margin: 60px auto;
  }
  .operational-approval .s-form-item-label{
    text-align: right!important;
    font-weight: 600;
  }
</style>
