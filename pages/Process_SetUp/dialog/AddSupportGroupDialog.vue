<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="100px"  class="apply-special-table">
    <s-row>
      <s-col span="18">
        <s-form-item prop="groupName" label="支持组名称:">
          <s-input v-model="form.groupName" :maxlength="25"></s-input>
        </s-form-item>
        <s-form-item prop="supportLevel" label="支持组层级:">
          <s-select v-model="form.supportLevel" style="width: 100%">
            <s-option v-for="item in supportLevelList" :label="item.name" :value="item.valueInt" :key="item.valueInt"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="companyName" label="公司名称:">
          <s-select v-model="form.companyName" style="width: 100%">
            <s-option v-for="item in companyNameList" :label="item.departName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="departmentUuid" label="组织名称:">
          <s-select v-model="form.departmentUuid" style="width: 100%">
            <s-option v-for="item in organizaitonNameList" :label="item.departName" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="activeStatus" label="状态:">
          <s-select v-model="form.activeStatus" style="width: 100%">
            <s-option v-for="item in activeStatus" :label="item.value" :value="item.uuid" :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="iamUserInfoList" label="成员:" >
          <s-button @click="addPersonInfo" icon="plus">添加</s-button>
          <s-table-page
            ref="multipleTable"
            :data="form.iamUserInfoList"
            style="width:100%"
            @selection-change="handleSelectionChange"
          >
            <s-table-column prop="userRealName" label="姓名"></s-table-column>
            <s-table-column label="操作" width="90">
              <template slot-scope="scope">
                <i class="iconfont icon-delete" title="删除" @click="deleteRow(scope.row)"></i>
              </template>
            </s-table-column>
          </s-table-page>
        </s-form-item>
      </s-col>
    </s-row>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';
  import Bus from '@/plugins/eventBus';
  export default {
    data() {
      return {
        form: {
          id: '',
          companyName: '',
          departmentUuid: '',
          groupName: '',
          supportLevel: '',
          activeStatus: '',
          iamUserInfoList: []
        },
        rules: {
          companyName: [Validaters.NotNull],
          departmentUuid: [Validaters.NotNull],
          groupName: [Validaters.NotNull],
          supportLevel: [Validaters.NotNull],
          activeStatus: [Validaters.NotNull]
        },
        supportLevelList: [],
        companyNameList: [],
        selections: [],
        organizaitonNameList: [],
        personelTemplate: {},
        activeStatus: [
          {
            value: '启用',
            uuid: 1
          },
          {
            value: '禁用',
            uuid: 0
          }
        ]
      }
    },
    methods: {
      addPersonInfo() {
        this.$emit('add-personInfo', this.personelTemplate);
      },
      deleteRow(row) {
        for (let i in this.form.iamUserInfoList) {
          if (this.form.iamUserInfoList[i].uuid === row.uuid) {
            this.form.iamUserInfoList.splice(i, 1);
          }
        }
      },
      handleSelectionChange(selections) {
        this.selections = selections;
      },
      temDialogPerson(selTemplate) {
        this.personelTemplate = selTemplate;
        this.form.iamUserInfoList = this.form.iamUserInfoList.concat(this.personelTemplate.list);
      }
    },
    created() {
      $axios.get('/itilWorkflowConfig/getItilConfigBasicData').then((res) => {
        if (res.status === 200) {
          this.supportLevelList = res.data.supportLevelList
          this.form.supportLevel = this.supportLevelList[0].valueInt
        }
      })
      $axios.post('/itilWorkflowConfig/getAllCompanyInfo').then((res) => {
        if (res.status === 200) {
          this.companyNameList = res.data;
        }
      })
      this.form.activeStatus = this.activeStatus[0].uuid;
      Bus.$on('finish', this.temDialogPerson);
    },
    watch: {
      'form.companyName': {
        handler: function(val) {
          let uuid = val;
          if (val !== '') {
            $axios.post('/itilWorkflowConfig/getAllOrganizationByCompanyUuid/' + uuid).then((res) => {
              if (res.status === 200) {
                this.organizaitonNameList = res.data;
              }
            })
          }
        },
        deep: true
      }
    }
  }
</script>
