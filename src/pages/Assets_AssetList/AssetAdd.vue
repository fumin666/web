<!--
 * @Author: 高建鹏
 * @Version: //Q4资产添加/编辑
 * @Description:资产添加编辑页面
 * @Position:资产列表-》添加/编辑
 * @Date: 2019-09-27 21:28:25
 * @LastEditors: mybells
 -->
<template>
  <section id="assetAdd">
    <asset-add-form ref="assetAddForm" :assetUuidProp="assetUuid" @getAssetData="getAssetData" @getAssetSaveUuid="getAssetSaveUuid" @getAttrvalueView="getAttrvalueView" @getCitypeUuid="getCitypeUuid" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})">
    </asset-add-form>

    <s-tab v-model="activeTab">

      <s-tab-pane label="特殊属性" name="pane1" v-if="judgeRoleBtn('assetsManage_specialAttr') || isConfigAdminCheck(curAsset.monitorItcomp || {})">
        <special-attr v-if="activeTab === 'pane1'" :addAssetUuid="assetUuid" :citypeUuid="citypeUuid" :attrvalueView="attrvalueView" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid"></special-attr>
      </s-tab-pane>
      <s-tab-pane label="位置信息" name="pane2" v-if="judgeRoleBtn('assetsManage_locationInfo') || isConfigAdminCheck(curAsset.monitorItcomp || {})">
        <location-info v-if="activeTab === 'pane2'" :addAssetUuid="assetUuid" @validAssetAddForm="validAssetAddForm" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid"></location-info>
      </s-tab-pane>
      <s-tab-pane label="关联关系" name="pane3" v-if="judgeRoleBtn('assetsManage_correlation') || isConfigAdminCheck(curAsset.monitorItcomp || {})">
        <conn-relation v-if="activeTab === 'pane3'" :addAssetUuid="assetUuid" :citypeUuid="citypeUuid" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid"></conn-relation>
      </s-tab-pane>
      <s-tab-pane label="资产账号" name="pane4" v-if="judgeRoleBtn('assetsManage_accountManage')">
        <asset-account v-if="activeTab === 'pane4'" :addAssetUuid="assetUuid" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid"></asset-account>
      </s-tab-pane>
      <s-tab-pane label="协议设置" name="pane5" v-if="judgeRoleBtn('assetsManage_assetListAgreementSet')">
        <protocol-set v-if="activeTab === 'pane5'" :addAssetUuid="assetUuid"  :curAsset="curAsset.monitorItcomp" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid"></protocol-set>
      </s-tab-pane>
      <s-tab-pane label="文档" name="pane6" v-if="judgeRoleBtn('assetsManage_document') || isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid">
        <asset-file v-if="activeTab === 'pane6'" :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})"></asset-file>
      </s-tab-pane>
      <s-tab-pane label="生命周期" name="pane7" v-if="judgeRoleBtn('assetsManage_lifecycle') || isConfigAdminCheck(curAsset.monitorItcomp || {})">
        <asset-lifecycle v-if="activeTab === 'pane7'" :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})" :key="assetUuid"></asset-lifecycle>
      </s-tab-pane>
      <!-- <s-tab-pane label="数据库实例管理" name="pane8" v-if = "showDbManage">
        <Db-Management v-if="activeTab === 'pane8'" :addAssetUuid="assetUuid" :curAsset="curAsset" :permission="isConfigAdminCheck(curAsset.monitorItcomp || {})"></Db-Management>
      </s-tab-pane> -->

    </s-tab>
  </section>
</template>

<script>
import $axios from 'sunflower-ajax'
import SpecialAttr from './AssetAddTabs/SpecialAttr'
import LocationInfo from './AssetAddTabs/LocationInfo'
import ConnRelation from './AssetAddTabs/ConnRelation'
import AssetAccount from './AssetAddTabs/AssetAccount'
import ProtocolSet from './AssetAddTabs/ProtocolSet'
import AssetFile from './AssetAddTabs/AssetFile'
import AssetAddForm from './AssetAddForm.vue'
import AssetLifecycle from './AssetAddTabs/AssetLifecycle.vue'
// import DbManagement from './AssetAddTabs/DbManagement.vue'
import roleCheckMixin from '@/common/mixins/roleCheckMixin';

export default {
  mixins: [roleCheckMixin],
  data() {
    return {
      tabNameArr: [// 页签名字的集合(顺序和页签一致)
        'assetsManage_specialAttr',
        'assetsManage_locationInfo',
        'assetsManage_correlation',
        'assetsManage_accountManage',
        'assetsManage_assetListAgreementSet',
        'assetsManage_document',
        'assetsManage_lifecycle'
      ],
      assetUuid: '',        // 资产uuid，tab添加判断用
      attrvalueView: {},    // 特殊属性用
      activeTab: 'pane1',
      citypeUuid: '',        // 关联关系用
      curAsset: {},
      showSpecialAttr: false,
      showDbManage: false, // 数据库实例
      showAgreeAssociated: false // 协议设置页签关联按钮
    }
  },
  components: {
    SpecialAttr,
    LocationInfo,
    ConnRelation,
    AssetAccount,
    ProtocolSet,
    AssetFile,
    AssetAddForm,
    AssetLifecycle
    // DbManagement
  },
  methods: {
    // 验证'assetAddForm'表单
    validAssetAddForm(callback, uuidRequired) {
      this.$refs.assetAddForm.validAssetAddForm(callback, uuidRequired);
    },
    // 保存通用属性时，将保存生成的资产uuid传给tabs
    getAssetSaveUuid(val) {
      this.assetUuid = val
    },
    // 获取特殊属性信息（传至"特殊属性"tab）
    getAttrvalueView(val) {
      this.attrvalueView = Object.assign({}, val)
    },
    getCitypeUuid(val) {
      this.citypeUuid = val;
    },
    getAssetData(val) {
      this.curAsset = val || {}
    }
  },
  created() {
    let {params} = this.$route
    if (params && params.assetUuid) {
      this.assetUuid = params.assetUuid
    }
    this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
    // 根据参数设置当前tab页
    if (params && params.tabIndex) {
      this.activeTab = `pane${parseInt(params.tabIndex) + 1}`;
    }
    if (this.$route.name === 'AssetsAll_assetAdd') {
      this.isEdit = false;
      let {query} = this.$route;
      let addType = query.addType[query.addType.length - 1];
      let dataList = [];
      let initDataList = [];
      $axios.post('resourcemanager/assetmanager/itasset/findAddSelect').then((res) => {
        initDataList = res.data.citypeList;
        for (let i in initDataList) {
          if (initDataList[i].uuid === addType) {
            dataList = initDataList[i].typeAttributeList;
          }
        }
        if (dataList.length > 0) {
          this.showSpecialAttr = true
        }
      })
    }
  },
  beforeDestroy() {
    this.$store.commit('setSpecialAttrDataList', [])
  },
  watch: {
    'attrvalueView': function (val) {
      if (val && Object.keys(val).length > 0) {
        this.showSpecialAttr = true;
      }
    },
    citypeUuid (val) {
      if (val === 'b90897142ef14a84a33a1535b397fdd0') {
        this.showDbManage = true;
        this.showAgreeAssociated = false;
      } else {
        this.showDbManage = false;
        this.showAgreeAssociated = true;
      }
    }
  }
}
</script>

<style lang="stylus">
#assetAdd {
  padding: 15px;
  padding-top: 0;

  .footerBar {
    text-align: right;
    margin-top: 30px;
    padding-right: 10px;
  }
}
</style>
