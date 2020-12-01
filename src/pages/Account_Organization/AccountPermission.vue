<template>

  <div class="accountPermissionContainer">

    <s-tab v-model="key" :animated="false">
      <s-tab-pane label="可见用户" v-if="judgeRoleBtn('accountManage_visibleUser')">
          <s-table-page :data='userData'
                        :page-layout="getPaginationDef()"
                        :header-search='getUserSearchDef()'
                        height="450">
            <s-table-column
              prop="userLoginName"
              label="账号名称"
            ></s-table-column>
            <s-table-column
              prop="userRealName"
              label="真实姓名"
            ></s-table-column>
            <s-table-column
              prop="departName"
              label="所属机构"
            ></s-table-column>
            <s-table-column
              prop="roleName"
              label="角色"
            ></s-table-column>
            <s-table-column
              prop="statusName"
              label="状态"
            ></s-table-column>
          </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="可见资产" v-if="judgeRoleBtn('accountManage_visibleAsset')">
          <s-table-page :data='itCompData'
                        :page-layout="getPaginationDef()"
                        :header-search='getCompSearchDef()'
                        height="450">
            <s-table-column
              prop="itcompName"
              label="资产名称"
            ></s-table-column>
            <s-table-column
              prop="controlAdderss"
              label="IP地址"
            ></s-table-column>
            <s-table-column
              prop="citypeName"
              label="资产类别"
            ></s-table-column>
            <s-table-column
              prop="modelNumber"
              label="资产型号"
            ></s-table-column>
            <!-- <s-table-column
              prop="businessName"
              label="业务名称"
            ></s-table-column> -->
          </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="角色权限" v-if="judgeRoleBtn('accountManage_roleAuthorization')">
          <s-table-page :data='roleList'
                        :page-layout="getPaginationDef()"
                        height="450">
            <s-table-column prop="roleName" label="角色名称"></s-table-column>
            <s-table-column prop="remark" label="备注"></s-table-column>
            <s-table-column prop="menuName" label="权限"></s-table-column>
          </s-table-page>
      </s-tab-pane>
      <s-tab-pane label="可访问资产" v-if="judgeRoleBtn('accountManage_accessibleAssets')">
          <s-table-page :data='assetData'
                        :header-search='getAssetSearchDef()'
                        :page-layout="getPaginationDef()"
                        height="450">
            <s-table-column
              prop="itcompName"
              label="资产名称"
            ></s-table-column>
            <s-table-column
              prop="controlAdderss"
              label="IP地址"
            ></s-table-column>
            <s-table-column
              prop="citypeName"
              label="资产类别"
            ></s-table-column>
            <s-table-column
              prop="accountName"
              label="登录账号"
            ></s-table-column>
            <s-table-column
              prop="protocolName"
              label="登录协议">
            </s-table-column>·
            <s-table-column
              prop="authNames"
              label="关联授权清单">
            </s-table-column>
          </s-table-page>
      </s-tab-pane>
    </s-tab>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'

  export default {
    data() {
      return {
        key: 0,
        userKeyword: '',
        visibleAssetKeyword: '',
        accessAssetKeyword: '',
        userData: [],
        itCompData: [],
        assetData: [],
        roleList: []
      }
    },
    created() {
      this.getUserData();
    },
    props: {
      uuid: {
        type: String
      }
    },
    methods: {
      getPaginationDef() {
        return 'prev, pager, next'
      },
      getUserSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['userLoginName', 'userRealName', 'departName', 'roleName', 'statusName'] // can be string or Array
        }
      },
      getCompSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'modelNumber', 'businessName'] // can be string or Array
        }
      },
      getAssetSearchDef() {
        return {
          width: 6,
          offset: 18,
          placeholder: '请输入查询条件',
          searchProps: ['itcompName', 'controlAdderss', 'citypeName', 'accountName', 'protocolName', 'authNames'] // can be string or Array
        }
      },
      getUserData() {
        $axios.post(`/iamUserInfo/viewVisibleUsers/${this.uuid}`).then((res) => {
          this.userData = res.data.list;
        });
      },
      getVisibleAssetData() {
        $axios.post(`/iamUserInfo/viewVisibleAssets/${this.uuid}`).then((res) => {
          this.itCompData = res.data.list;
        });
      },
      getCharacterData() {
        $axios.post(`/iamUserInfo/viewRoleByUserUuid/${this.uuid}`).then((res) => {
          this.roleList = res.data.iamRoleInfo
        });
      },
      getAccessAssetData() {
        $axios.post(`/iamUserInfo/viewAisitAssets/${this.uuid}`).then((res) => {
          this.assetData = res.data.list;
        });
      }
    },
    watch: {
      key: function (val) {
        switch (val) {
          case 0:
            this.getUserData();
            break;
          case 1:
            this.getVisibleAssetData();
            break;
          case 2:
            this.getCharacterData();
            break;
          case 3:
            this.getAccessAssetData();
            break;
        }
      }
    }
  }
</script>
