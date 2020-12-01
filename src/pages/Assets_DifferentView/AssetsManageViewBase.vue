/**
* Created by dgunzi on 2019/05/17.
*/
<template>
  <div id="assetsManageViewContent">
    <div class="OperationViewContent">
      <div class="perspectives-row">
        <AssetDetailConstructor>
          <div class="right-content monitorDetail" style="padding:5px 10px;">
            <s-tab v-model="activeTab">
              <!--资产账号-->
              <s-tab-pane label="资产账号" name="tab1">
                <asset-account v-if="activeTab === 'tab1'" :assetName="assetName" :addAssetUuid="assetUuid" :curAsset="assetData" :permission="isConfigAdminCheck(assetData)"></asset-account>
              </s-tab-pane>
              <!--协议设置-->
              <s-tab-pane label="协议设置" name="tab2">
                <protocol-set v-if="activeTab === 'tab2'" :assetName="assetName" :addAssetUuid="assetUuid"  :curAsset="assetData" :permission="isConfigAdminCheck(assetData)"></protocol-set>
              </s-tab-pane>
              <!--关联关系-->
              <s-tab-pane label="关联关系" name="tab5">
                <conn-relation v-if="activeTab === 'tab5'" :assetName="assetName" :addAssetUuid="assetUuid" :citypeUuid="citypeUuid" :permission="isConfigAdminCheck(assetData)"></conn-relation>
              </s-tab-pane>
              <!--特殊属性-->
              <s-tab-pane label="特殊属性" name="tab4">
                <special-attr v-if="activeTab === 'tab4'" :assetName="assetName" :addAssetUuid="assetUuid" :attrvalueView="attrvalueView" :permission="isConfigAdminCheck(assetData)"></special-attr>
              </s-tab-pane>
              <!--位置信息-->
              <s-tab-pane label="位置信息" name="tab3">
                <location-info v-if="activeTab === 'tab3'" :assetName="assetName"  :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(assetData)"></location-info>
              </s-tab-pane>
              <!--文档-->
              <s-tab-pane label="文档" name="tab6">
                <asset-file v-if="activeTab === 'tab6'" :assetName="assetName" :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(assetData)"></asset-file>
              </s-tab-pane>
              <!--生命周期-->
              <s-tab-pane label="生命周期" name="tab7">
                <asset-lifecycle v-if="activeTab === 'tab7'" :assetName="assetName" :addAssetUuid="assetUuid" :permission="isConfigAdminCheck(assetData)"></asset-lifecycle>
              </s-tab-pane>
            </s-tab>
          </div>
        </AssetDetailConstructor>
      </div>
    </div>
  </div>
</template>

<script>
  import AssetDetailConstructor from './common_components/AssetDetailConstructor';
  import $axios from 'sunflower-ajax'
  import AssetAccount from '@/pages/Assets_AssetList/AssetAddTabs/AssetAccount'
  import SpecialAttr from '@/pages/Assets_AssetList/AssetAddTabs/SpecialAttr'
  import LocationInfo from '@/pages/Assets_AssetList/AssetAddTabs/LocationInfo'
  import ConnRelation from '@/pages/Assets_AssetList/AssetAddTabs/ConnRelation'
  import AssetFile from '@/pages/Assets_AssetList/AssetAddTabs/AssetFile'
  import AssetLifecycle from '@/pages/Assets_AssetList/AssetAddTabs/AssetLifecycle.vue'
  import ProtocolSet from '@/pages/Assets_AssetList/AssetAddTabs/ProtocolSet'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin';

  export default {
      mixins: [roleCheckMixin],
      name: 'AssetsManageView',
      data() {
          return {
            assetName: true, // 是否从资产名称进入
            /* 基础信息参数 */
            assetUuid: this.$route.params.assetUuid,
            attrvalueView: {},    // 特殊属性用
            citypeUuid: '',        // 关联关系用
            activeTab: 'tab1',
            assetData: {}
          }
      },
      components: {
        AssetDetailConstructor,
        AssetAccount,
        SpecialAttr,
        LocationInfo,
        ConnRelation,
        AssetFile,
        AssetLifecycle,
        ProtocolSet
      },
      created() {
        $axios.post(`/resourcemanager/assetmanager/itasset/getitAsset/${this.assetUuid}`).then(({data}) => {
          if (data && data instanceof Object) {
            this.attrvalueView = data.attributeMap;
            this.citypeUuid = data.citypeUuid;
            this.assetData = data;
          }
        });
      },
      methods: {
        // 验证'assetAddForm'表单
        validAssetAddForm(callback, uuidRequired) {
          this.$refs.assetAddForm.validAssetAddForm(callback, uuidRequired);
        },
        getAssetData(val) {
          this.assetData = val || {}
        }
      }
  }
</script>

<style scoped>
</style>
