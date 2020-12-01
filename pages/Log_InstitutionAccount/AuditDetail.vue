<template>
  <section class="logSysPrivilege">
    <s-row class="title">
      <i class="iconfont icon-prompt-info"></i>
      资产处存在,系统处不存在的资产账号
    </s-row>
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-page
        :data="audDetail.noSysLogList"

        :header-search="{show:false}"
        :has-action-col=false
      >
        <s-table-column
          label="资产账号名称"
          prop="assetAccountName"
          width="130px"
          show-overflow-tooltip>
        </s-table-column>
        <!--<s-table-column-->
          <!--label="账号角色"-->
          <!--prop="roleName">-->
        <!--</s-table-column>-->
        <s-table-column
          label="IP地址"
          prop="deviceIp"
          width="170px"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="资产名称"
          prop="deviceName"
          show-overflow-tooltip>
        </s-table-column>
        <!--<s-table-column-->
          <!--label="账号类型"-->
          <!--prop="accountType">-->
        <!--</s-table-column>-->
        <s-table-column
          label="稽核时间"
          prop="execTime"
          width="180px">
        </s-table-column>
      </s-table-page>
    </s-scrollbar>
    <s-row class="title" style="margin-top: 10px">
      <i class="iconfont icon-prompt-info"></i>
      系统处存在的资产账号
    </s-row>
    <s-scrollbar wrap-class="logWrapHeight">
      <s-table-page
        :data="audDetail.sysLogList"

        :header-search="{show:false}"
        :has-action-col=false
      >
        <s-table-column
          label="资产账号名称"
          prop="assetAccountName"
          width="130px"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="账号角色"
          prop="roleName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="IP地址"
          prop="deviceIp"
          width="170px">
        </s-table-column>
        <s-table-column
          label="资产名称"
          prop="deviceName"
          show-overflow-tooltip>
        </s-table-column>
        <s-table-column
          label="账号类型"
          prop="accountType"
          show-overflow-tooltip>
        </s-table-column>
        <!--<s-table-column-->
          <!--label="稽核时间"-->
          <!--prop="execTime"-->
          <!--width="180px">-->
        <!--</s-table-column>-->
      </s-table-page>
    </s-scrollbar>
  </section>
</template>

<script>
  // import $axios from 'sunflower-ajax'

  export default {
    components: {

    },
    data() {
      return {
      }
    },
    props: ['audDetail'],
    created() {

    }
  }
</script>
