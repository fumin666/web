<template>
  <section>
    <s-col span="4">
      <s-menu :active-name="activeTab" @on-select="selection" style="font-size:14px">
        <s-menu-item name="pane1" v-if="judgeRoleBtn('assetsManage_agreementSet')">
          <i class="iconfont icon-protocol-audit"></i>
          协议设置
        </s-menu-item>
        <s-menu-item name="pane2" v-if="judgeRoleBtn('assetsManage_operResponsibilityGroup')">
          <i class="iconfont icon-oper"></i>
          运维责任组
        </s-menu-item>
        <s-menu-item name="pane3" v-if="judgeRoleBtn('assetsManage_locationManage')">
          <i class="iconfont icon-position"></i>
          位置管理
        </s-menu-item>
        <s-menu-item name="pane4" v-if="judgeRoleBtn('assetsManage_adManagement')">
          <i class="iconfont icon-set-place"></i>
          AD域管理
        </s-menu-item>
        <s-menu-item name="pane5" v-if="judgeRoleBtn('assetsManage_docManagement')">
          <i class="iconfont icon-set-configure"></i>
          文档管理
        </s-menu-item>
        <s-menu-item name="pane6" v-if="judgeRoleBtn('assetsManage_dbaAuditConf')">
          <i class="iconfont icon-asset-change"></i>
          数据库审计配置
        </s-menu-item>
        <s-menu-item name="pane7" v-if="judgeRoleBtn('assetsManage_logAuditConf')">
          <i class="iconfont icon-log-audit"></i>
          日志审计配置
        </s-menu-item>
        <s-menu-item name="pane8" v-if="judgeRoleBtn('assetsManage_assetInspectionScore')">
          <i class="iconfont icon-star-empty"></i>
          资产巡检打分设置
        </s-menu-item>
        <s-menu-item name="pane9" v-if="judgeRoleBtn('assetsManage_ipamSet')">
          <i class="iconfont icon-config-ip"></i>
          IPAM设置
        </s-menu-item>
      </s-menu>
    </s-col>
    <s-col span="20" style="padding-left:20px;">
      <s-scrollbar wrap-style="maxHeight:calc(100vh - 190px);">
        <asset-protocol v-if="activeTab === 'pane1'"></asset-protocol>
        <asset-operation-resp v-if="activeTab === 'pane2'"></asset-operation-resp>
        <asset-location v-if="activeTab === 'pane3'"></asset-location>
        <AssetADDomain v-if="activeTab === 'pane4'"></AssetADDomain>
        <asset-doc-manage v-if="activeTab === 'pane5'"></asset-doc-manage>
        <asset-audit v-if="activeTab === 'pane6'"></asset-audit>
        <assets-logs-manage v-if="activeTab === 'pane7'"></assets-logs-manage>
        <asset-polling-set v-if="activeTab === 'pane8'"></asset-polling-set>
        <Usability-Rule v-if="activeTab === 'pane9'"></Usability-Rule>
      </s-scrollbar>
    </s-col>
  </section>
</template>

<script>
import AssetProtocol from '@/pages/Assets_Protocol/AssetProtocol'
import AssetOperationResp from '@/pages/Assets_Setting/AssetOperationResp/AssetOperationResp'
import AssetLocation from '@/pages/Assets_Location/LocationList'
import AssetADDomain from '@/pages/Assets_Setting/AssetADDomain/AssetADDomain'
import AssetDocManage from '@/pages/Assets_DocManage/AssetDocList'
import AssetAudit from '@/pages/Assets_Audit/AssetAudit'
import AssetsLogsManage from '@/pages/Siem_System/AssetsLogsManage/LogManageMain'
import AssetPollingSet from './AssetPollingSet/AssetPollingSet.vue'
import UsabilityRule from './AssetPollingSet/UsabilityRule.vue'
import authCheck from '@/common/mixins/auth.js'
export default {
  mixins: [authCheck],
  data() {
    return {
      tabNameArr: [
        'assetsManage_agreementSet',
        'assetsManage_operResponsibilityGroup',
        'assetsManage_locationManage',
        'assetsManage_adManagement',
        'assetsManage_docManagement',
        'assetsManage_dbaAuditConf',
        'assetsManage_logAuditConf',
        'assetsManage_assetInspectionScore',
        'assetsManage_ipamSet'], // 页签名字的集合(顺序和页签一致)
      activeTab: 'pane1'
    }
  },
  components: {
    AssetProtocol,
    AssetOperationResp,
    AssetLocation,
    AssetADDomain,
    AssetDocManage,
    AssetAudit,
    AssetsLogsManage,
    AssetPollingSet,
    UsabilityRule
  },
  created() {
    this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    if (this.$route.params.tabParam === 'logAudit') { // 上一页返回的路由参数
      this.activeTab = 'pane7'
    }
  },
  methods: {
    selection(key) {
      this.activeTab = key
    }
  }
}
</script>

<style lang="stylus"></style>
