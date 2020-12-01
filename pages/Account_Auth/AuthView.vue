<!--
 * @Author: songyf
 * @Date: 2019-11-6
 * @LastEditors: songyf
 * @Description: 账号管理-查看清单.
 -->
<template>
  <div class="auth-policy-box">
    <s-scrollbar wrap-class="myHeight">
      <div>
        <s-row>
          <s-col :span="4">
            <div class="grid-content bg-purple">授权清单名称</div>
          </s-col>
          <s-col :span="8">
            <div class="grid-content bg-purple-light" v-text="authViewObj.authName"></div>
          </s-col>
          <s-col :span="4">
            <div class="grid-content bg-purple">清单类型</div>
          </s-col>
          <s-col :span="8">
            <div class="grid-content bg-purple-light" v-text="authViewObj.listTypeStr"></div>
          </s-col>
        </s-row>
        <s-row>
          <s-col :span="4">
            <div class="grid-content bg-purple">访问规则</div>
          </s-col>
          <s-col :span="8">
            <div class="grid-content bg-purple-light" v-text="authViewObj.loginRules"></div>
          </s-col>
          <s-col :span="4">
            <div class="grid-content bg-purple">密码会同</div>
          </s-col>
          <s-col :span="8">
            <div class="grid-content bg-purple-light" v-text="authViewObj.pwdConStr"></div>
          </s-col>
        </s-row>
        <s-row>
          <s-col :span="4">
            <div class="grid-content bg-purple">备注</div>
          </s-col>
          <s-col :span="20">
            <div class="grid-content bg-purple-light" v-text="authViewObj.authCont"></div>
          </s-col>
        </s-row>
      </div>
      <div>
        <p class="title-item">授权人员</p>
        <s-row class="topRow">
          <s-col span="24" class="fr">
            <s-input v-model="personSearchKey" @input="personSearchHandle" placeholder="请输入内容" class="real-search-input" icon="magnifier"></s-input>
          </s-col>
        </s-row>
        <!--真分页表格-->
        <RealPageTable :ajax-obj="ajaxObjPerson"
                       :isChecked="true"
                       @load-callback="personListBack"
                       @selection-change="personSelectHandle">
          <s-table-column type="selection" width="80"></s-table-column>
          <s-table-column prop="userRealName" label="真实姓名" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="userLoginName" label="账号名称" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="departName" label="组织机构" show-overflow-tooltip>
          </s-table-column>
          <s-table-column label="操作" width="120">
            <template slot-scope="scope">
              <i class="iconfont icon-delete" @click="deletePerson(scope.row)" title="删除"></i>
            </template>
          </s-table-column>
        </RealPageTable>
      </div>
      <div>
        <p class="title-item">授权资产</p>
        <div  v-if="fineGrainedType === 0">
          <s-row class="topRow">
            <s-col span="24" class="fr">
              <s-input v-model="assetsSearchKey" @input="assetsSearchHandle" placeholder="请输入内容" class="real-search-input" icon="magnifier"></s-input>
            </s-col>
          </s-row>
          <!--真分页表格-->
          <RealPageTable :ajax-obj="ajaxObjAssets"
                         :isChecked="true"
                         @load-callback="assetsListBack"
                         @selection-change="assetsSelectHandle">
            <s-table-column type="selection" width="80"></s-table-column>
            <s-table-column prop="itcompName" label="资产名称" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="controlAdderss" label="IP地址" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="citypeName" label="资产类型" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="groupName" label="运维责任组" show-overflow-tooltip>
            </s-table-column>
            <s-table-column label="操作" width="120">
              <template slot-scope="scope">
                <i class="iconfont icon-delete" @click="deleteAssets(scope.row)" title="删除"></i>
              </template>
            </s-table-column>
          </RealPageTable>
        </div>
        <!--树形表格-->
        <auth-assets-detail
          ref="detailTreeTable"
          v-else
          @detailAuthAssets="addAuthAssetsBtn"
          @detailOperRespon="addAuthOperResponBtn"
          :conditionObj="conditionObj">
        </auth-assets-detail>
      </div>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    components: {
      RealPageTable
    },
    props: {
      authViewRow: {
        type: Object
      }
    },
    data() {
      return {
        authViewObj: {
          authName: '',
          listTypeStr: '',
          loginRules: '',
          pwdConStr: '',
          authCont: ''
        },
        fineGrainedType: 0, // 细粒度类型
        ajaxObjPerson: {
          type: 'post',
          url: '/operationAuth/getTempAuthUserList',
          checkedUuidArr: [],
          params: {
            condition: {
              content: '',
              authUuid: '',
              tempUuid: ''
            }
          }
        },
        ajaxObjAssets: { // 资产授权
          type: 'post',
          url: '/operationAuth/getTempAuthDeviceList',
          checkedUuidArr: [],
          params: {
            condition: {
              type: this.fineGrainedType,
              content: '',
              authUuid: '',
              tempUuid: ''
            }
          }
        }
      }
    },
    mounted() {
      this.getViewData();
      this.$nextTick(() => {
        this.getAuthPersonList();
        this.getAuthAssetsList();
      })
    },
    methods: {
      /* 获取查看清单信息 */
      getViewData() {
        $axios.get(`/operationAuth/viewOperationAuthInfo/${this.authViewRow.uuid}`).then(({data}) => {
          if (data) {
            this.authViewObj.authName = data.authName;
            this.authViewObj.listTypeStr = data.listTypeStr;
            this.authViewObj.loginRules = data.loginRules;
            this.authViewObj.pwdConStr = data.pwdConStr;
            this.authViewObj.authCont = data.authCont;
          }
        });
      },
      /* 人员授权 */
      getAuthPersonList() {
        let params = {
          content: this.personSearchKey,
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        }
        this.ajaxObjPerson.params.condition = params;
        this.ajaxObjPerson.checkedUuidArr = this.personSelections;
      },
      /* 资产授权 */
      getAuthAssetsList() {
        let params = {
          type: this.fineGrainedType,
          content: this.assetsSearchKey,
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        };
        this.ajaxObjAssets.params.condition = params;
        this.ajaxObjAssets.checkedUuidArr = this.assetsSelections;
      }
    },
    watch: {
      authViewRow(val) {
        this.row = val;
      }
    }
  }
</script>
<style lang="stylus">
  .auth-policy-box
    .myHeight
      max-height: 500px
      min-height: 300px
      padding-right 17px
    .title-item
      margin 10px 0
      font-size 16px
      font-weight bold

</style>
