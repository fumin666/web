/**
* 资产管理列表页面
* Created by songyf on 2019/07/18.
*/
<template>
  <s-tab v-model="activeTab" style="min-height: 500px;">
    <s-tab-pane label="特殊属性" name="pane0" v-if="judgeRoleBtn('assetsManage_omaSpecialAttr')">
      <special-attr v-if="activeTab === 'pane0'" :addAssetUuid="assetUuid" :citypeUuid="citypeUuid" :attrvalueView="attrvalueView" :permission="isConfigAdminCheck(curAsset || {})"></special-attr>
    </s-tab-pane>
    <s-tab-pane label="位置信息" name="pane1" v-if="judgeRoleBtn('assetsManage_omaLocationInfo')">
      <location-info v-if="activeTab === 'pane1'" :addAssetUuid="assetUuid" @validAssetAddForm="validAssetAddForm" :permission="isConfigAdminCheck(curAsset || {})"></location-info>
    </s-tab-pane>
    <s-tab-pane label="关联关系" name="pane2" v-if="judgeRoleBtn('assetsManage_omaCorrelation')">
      <conn-relation v-if="activeTab === 'pane2'" :addAssetUuid="assetUuid" :citypeUuid="citypeUuid" :permission="isConfigAdminCheck(curAsset || {})"></conn-relation>
    </s-tab-pane>
    <s-tab-pane label="文档" name="pane3" v-if="judgeRoleBtn('assetsManage_omaDocument')">
      <asset-file v-if="activeTab === 'pane3'" :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(curAsset || {})"></asset-file>
    </s-tab-pane>
    <s-tab-pane label="生命周期" name="pane4" v-if="judgeRoleBtn('assetsManage_omaLifecycle')">
      <asset-lifecycle v-if="activeTab === 'pane4'" :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(curAsset || {})"></asset-lifecycle>
    </s-tab-pane>
  </s-tab>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import SpecialAttr from '../AssetAddTabs/SpecialAttrAsset'
  import LocationInfo from '../AssetAddTabs/LocationInfo'
  import ConnRelation from '../AssetAddTabs/ConnRelation'
  import AssetFile from '../AssetAddTabs/AssetFile'
  import AssetLifecycle from '../AssetAddTabs/AssetLifecycle.vue'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';
    export default {
      mixins: [roleCheckMixin],
      props: {
        curAsset: {
          type: Object,
          required: true
        }
      },
      components: {
        SpecialAttr,
        LocationInfo,
        ConnRelation,
        AssetFile,
        AssetLifecycle
      },
      data() {
        return {
          tabNameArr: ['assetsManage_specialAttr', 'assetsManage_locationInfo', 'assetsManage_correlation', 'assetsManage_document', 'assetsManage_lifecycle'], // 页签名字的集合(顺序和页签一致)
          activeTab: 'pane1',
          assetUuid: '',        // 资产uuid，tab添加判断用
          attrvalueView: {},    // 特殊属性用
          citypeUuid: '',        // 关联关系用
          showSpecialAttr: false
        }
      },
      created() {
        this.activeTab = this.tabIndexName(this.tabNameArr) // 返回第一个为true页签的index
        // 根据参数设置当前tab页
        if (this.curAsset && this.curAsset.tabIndex) {
          this.activeTab = this.curAsset.tabIndex;
        }
        if (this.curAsset && this.curAsset.uuid) {
          this.assetUuid = this.curAsset.uuid
          this.citypeUuid = this.curAsset.citypeUuid
        }
        $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${this.assetUuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            this.attrvalueView = data.attributeMap;
          }
        });
      },
      beforeDestroy() {
        this.$store.commit('setSpecialAttrDataList', [])
      },
      watch: {
        'attrvalueView': function (val) {
          if (val && Object.keys(val).length > 0) {
            this.showSpecialAttr = true;
          }
        }
      },
      methods: {
        validAssetAddForm(callback, uuidRequired) {
          this.$refs.assetAddForm.validAssetAddForm(callback, uuidRequired);
        }
      }
    }
</script>

<style scoped>

</style>
