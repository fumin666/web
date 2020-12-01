<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-08 14:21:42
 * @LastEditTime: 2019-09-06 18:13:38
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <section class="reportTop noPrint">
      <s-row>
        <s-col :span="24">
          <s-form :inline="true" class="search_form" style="margin: 10px 0;">
            <div>
              <s-form-item label="认证方式：">
                <s-select v-model="form.loginTypeUuid" clearable>
                  <s-option v-for="item in loginTypeList" :label="item.loginType" :value="item.uuid" :key="item.uuid"></s-option>
                </s-select>
              </s-form-item>
              <s-form-item label="角色：">
                <s-select v-model="form.userRoleUuid" clearable>
                  <s-option v-for="item in roleList" :label="item.roleName" :value="item.uuid" :key="item.uuid"></s-option>
                </s-select>
              </s-form-item>
            </div>
            <div class="search_btn">
              <s-button icon="magnifier" title="查询" @click="getList()">查询</s-button>
            </div>
          </s-form>
          <s-row style="margin: 15px 0 10px;">
            <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle('excel')">EXCEL报表</s-button>
            <s-button title="WORD报表" icon="word" @click="DownloadHandle('word')">WORD报表</s-button>
            <s-button title="PDF报表" icon="pdf" @click="DownloadHandle('pdf')">PDF报表</s-button>
          </s-row>
        </s-col>
      </s-row>
    </section>
    <s-table-page
      :data="tableData">
      <s-table-column
        prop="userRealName"
        label="姓名">
      </s-table-column>
      <s-table-column
        prop="userLoginName"
        label="账号名称">
      </s-table-column>
      <s-table-column
        prop="loginType"
        label="认证方式">
      </s-table-column>
      <s-table-column
        prop="roleName"
        label="用户角色">
      </s-table-column>
    </s-table-page>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        tableData: [],
        roleList: [],
        loginTypeList: [],
        form: {
          loginTypeUuid: '',
          userRoleUuid: ''
        }
      }
    },
    mounted() {
      this.getList()
      this.getRoleList()
      this.getCertification()
    },
    methods: {
      getList() {
        $axios.post(`/hierarchyProtection/userRoleDegreeValidate`, this.form).then((res) => {
          this.tableData = res.data || []
        })
      },
      getRoleList() {
        $axios.get(`/iamUserInfo/getRoleList`).then((res) => {
          this.roleList = res.data || []
        })
      },
      getCertification() {
        $axios.get(`/sysLoginType/getDoubleLoginType`).then((res) => {
          this.loginTypeList = res.data.SysLoginTypeList || []
        })
      },
      DownloadHandle(type) {
        $axios.post(`/hierarchyProtection/createUserRoleDegreeValidateFile/${type}`, this.form).then((res) => {
          if (res.data) {
            Download(`/hierarchyProtection/exportUserRoleDegreeValidate/${type}`)
          }
        });
      }
    }
  }
</script>
<style lang="stylus">
</style>
