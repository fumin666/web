<!--
 * @Author: songyf
 * @Date: 2019-11-6
 * @LastEditors: songyf
 * @Description: 账号管理-查看清单.
 -->
<template>
  <s-dialog v-model="dialogFlag" title= "查看授权清单" width="930px" class="auth-policy-box">
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
        <RealPageTable :ajax-obj="ajaxObjPerson">
          <s-table-column prop="userRealName" label="真实姓名" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="userLoginName" label="账号名称" show-overflow-tooltip>
          </s-table-column>
          <s-table-column prop="departName" label="组织机构" show-overflow-tooltip>
          </s-table-column>
        </RealPageTable>
      </div>
      <div>
        <p class="title-item">授权资产</p>
        <div>
          <s-row class="topRow">
            <s-col span="24" class="fr">
              <s-input v-model="assetsSearchKey" @input="assetsSearchHandle" placeholder="请输入资产名称/ip地址/资产类型/型号" class="real-search-input" icon="magnifier"></s-input>
            </s-col>
          </s-row>
          <!--真分页表格-->
          <RealPageTable :ajax-obj="ajaxObjAssets">
            <s-table-column prop="itcompName" label="资产名称" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="controlAdderss" label="IP地址" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="citypeName" label="资产类型" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="modelNumber" label="型号" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="groupName" label="运维责任组" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="protocolName" label="协议" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="port" label="端口" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="accountName" label="账号名称" show-overflow-tooltip>
            </s-table-column>
            <s-table-column prop="accountRole" label="账号角色" show-overflow-tooltip>
            </s-table-column>
            <s-table-column
              label="操作"
              width="100">
              <template slot-scope="scope">
                <i class="iconfont icon-association"
                   @click="associatedBtn(scope.row)"
                   v-if="qqArr.indexOf(scope.row.protocolUuid) > -1 && scope.row.accountName"
                   title="关联实例">
                </i>
                <i class="iconfont icon-set"
                   @click="seniorSetBtn(scope.row)"
                   v-if="scope.row.protocolUuid === '00000000000000000000000000000077' || (scope.row.protocolClass === 2 && scope.row.protocoltype === 1)"
                   title="剪贴板/磁盘映射">
                </i>
              </template>
            </s-table-column>
          </RealPageTable>
        </div>
      </div>
    </s-scrollbar>
    <!-- 单选框操作-->
    <s-form label-width="120px" ref="form" :model="form" class="demo-form-inline">
      <s-form-item label="" class="auth-radio">
        <s-radio-group v-model="form.type">
          <div class="fl radio-item">
            <s-radio :label="1" :disabled="isView">自定义授权</s-radio>
            <s-tooltip placement="top">
              <div slot="content">自定义授权默认只授权资产，可手动进行细粒度设置</div>
              <i class="iconfont icon-weizhi"></i>
            </s-tooltip>
          </div>
          <div class="fl radio-item auth-option">
            <s-radio :label="2" :disabled="isView">全授权</s-radio>
            <i class="iconfont icon-right arrow" v-if="form.type !== 2"></i>
            <i class="iconfont icon-bottom arrow" v-else></i>
            <s-tooltip placement="top">
              <div slot="content">1: 授权全协议指自动授权资产上所有协议，且该资产上新增协议自动授权；<br/>2: 授权全账号指自动授权资产所有协议上所有账号，且该资产所有协议上新增账号自动授权</div>
              <i class="iconfont icon-weizhi"></i>
            </s-tooltip>
            <s-checkbox-group v-model="form.allAuth" v-if="form.type === 2" :min="1" :disabled="isView">
              <s-checkbox :label="1">授权全协议</s-checkbox>
              <s-checkbox :label="2" v-if="form.pwdCon !== 1">授权全账号</s-checkbox>
            </s-checkbox-group>
          </div>
          <div class="fl radio-item auth-option" style="width: 140px">
            <s-radio :label="3" :disabled="isView">部分全授权</s-radio>
            <i class="iconfont icon-right arrow" v-if="form.type !== 3"></i>
            <i class="iconfont icon-bottom arrow" v-else></i>
            <s-tooltip placement="top">
              <div slot="content">1: 部分全授权指可手动授权部分协议上的全部账号，且所选协议上新增账号自动授权<br/>2: "包含协议层"指会将协议与协议下账号都进行授权<br/>3: 必须手动选择资产上一个或多个协议，否则只授权资产</div>
              <i class="iconfont icon-weizhi"></i>
            </s-tooltip>
            <s-checkbox-group v-model="form.partAuth" v-if="form.type === 3" :disabled="isView">
              <s-checkbox :label="1">包含协议层</s-checkbox>
            </s-checkbox-group>
          </div>
        </s-radio-group>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="seniorSet">高级设置</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>

    <auth-senior-set v-model="authSeniorSetFlag"
                     v-if="authSeniorSetFlag"
                     :tempObj="tempObj"
                     :isView="isView"
                     :authSeniorObj="authViewObj">
    </auth-senior-set>
    <!--资产组织机构剪贴板上下行-->
    <s-dialog
      v-model="bloomDeviceOrgUpDown"
      v-if="bloomDeviceOrgUpDown"
      append-to-body
      title="剪贴板/磁盘映射">
      <device-up-down ref="deviceOrgUpDown" :data="dbData" :isView="isView" :rowData="rowData"></device-up-down>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveDeviceOrgUpDown" v-if="!isView">保存</s-button>
        <s-button type="cancel" @click="bloomDeviceOrgUpDown = false">取消</s-button>
      </template>
    </s-dialog>
    <!--数据库实例-->
    <s-dialog
      v-model="bloomDb"
      v-if="bloomDb"
      append-to-body
      title="关联实例">
      <db-dialog :data="dbData" ref="addDb" :rowData="rowData" :isView="isView"></db-dialog>
      <template slot="footer" class="dialog-footer">
        <s-button @click="addDbOk" v-if="!isView">保存</s-button>
        <s-button type="cancel" @click="bloomDb = false">取消</s-button>
      </template>
    </s-dialog>
  </s-dialog>
</template>

<script>

  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import authSeniorSet from './AuthSeniorSet'
  import DeviceUpDown from '../DeviceUpDown'
  import DbDialog from '../Db'
  export default {
    components: {
      RealPageTable,
      authSeniorSet,
      DeviceUpDown,
      DbDialog
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      authViewRow: {
        type: Object
      }
    },
    data() {
      return {
        dialogFlag: false,
        authSeniorSetFlag: false,
        isView: true,
        authViewObj: {},
        ajaxObjPerson: {
          type: 'post',
          url: 'operationAuth/viewAuthUserListByAuthUuid',
          params: {
            condition: {
              authUuid: '',
              content: ''
            }
          }
        },
        ajaxObjAssets: { // 资产授权
          type: 'post',
          url: 'operationAuth/viewAuthDeviceListByAuthUuid',
          params: {
            condition: {
              authUuid: '',
              content: ''
            }
          }
        },
        personSearchKey: '',
        assetsSearchKey: '',
        qqArr: [
          '00000000000000000000000000000114', // plsql
          '00000000000000000000000000000120', // toadoracle
          '00000000000000000000000000000080',  // ORACLE
          '00000000000000000000000000000113' // mssqlserver
        ],
        bloomDeviceOrgUpDown: false, // 高级设置
        bloomDb: false,
        dbData: null,
        rowData: null,
        form: {
          type: 1,
          allAuth: [1, 2],
          partAuth: []
        },
        tempObj: { // 临时
          uuid: '',
          tempUuid: ''
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
            this.authViewObj = data;
            this.form.type = data.type;
            this.form.allAuth = this.form.type === 2 ? data.secondType : [1, 2];
            this.form.partAuth = this.form.type === 3 ? data.secondType : [];
          }
        });
      },
      /* 人员授权 */
      getAuthPersonList() {
        let params = {
          authUuid: this.authViewRow.uuid,
          content: this.personSearchKey
        }
        this.ajaxObjPerson.params.condition = params;
      },
      /* 资产授权 */
      getAuthAssetsList() {
        let params = {
          authUuid: this.authViewRow.uuid,
          content: this.assetsSearchKey
        };
        this.ajaxObjAssets.params.condition = params;
      },
      /* 人员授权 */
      personSearchHandle() {
        this.getAuthPersonList();
      },
      /* 资产授权 */
      assetsSearchHandle() {
        this.getAuthAssetsList();
      },
      seniorSet() { // 高级设置
        this.authSeniorSetFlag = true
      },
      seniorSetBtn(row) { // 高级设置弹窗
        this.dbData = {
          authUuid: this.authViewRow.uuid,
          uuid: row.uuid,
          tempUuid: null
        };
        this.rowData = row;
        this.bloomDeviceOrgUpDown = true;
      },
      associatedBtn(row) {
        this.dbData = {
          portUuid: row.portUuid,
          authUuid: this.authViewRow.uuid,
          uuid: row.uuid,
          tempUuid: null
        };
        this.rowData = row;
        this.bloomDb = true;
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      },
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
    .auth-radio
      margin-bottom 0
      .radio-item
        width 130px
        margin-right 50px
      .auth-option
        .arrow
          font-size 12px
          margin-right 5px
        .s-checkbox
          display block
          margin-top 5px
      .s-form-item-content
        padding-top 10px
        margin-left 0!important

</style>
