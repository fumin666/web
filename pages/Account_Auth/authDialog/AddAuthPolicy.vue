<!--
 * @Author: songyf
 * @Date: 2019-10-30
 * @LastEditors: songyf
 * @Description: 账号管理-添加/编辑授权策略管理.
 -->

<template>
  <s-dialog v-model="dialogFlag" :title="isEdit?'编辑':'添加'" width="950px"
            class="auth-policy-box" :before-close="closeAuthDialog">
    <s-form label-width="120px" ref="form" :model="form" :rules="formRule" class="demo-form-inline">
      <s-scrollbar wrap-class="myHeight">
        <s-form-item label="授权清单名称" prop="authName">
          <s-input v-model="form.authName"></s-input>
        </s-form-item>

        <div>
          <p class="title-item">授权人员</p>
          <s-row class="topRow">
            <s-col span="12">
              <s-button @click="addAuthPersonBtn">按人员授权</s-button>
              <s-button @click="addAuthOrganizeBtn">按组织机构授权</s-button>
              <s-button @click="bathDeletePerson">批量删除</s-button>
            </s-col>
            <s-col span="12">
              <div class="input-search">
                <s-input v-model="personSearchKey" @keyup.enter.native="personSearchHandle" placeholder="请输入内容"
                         class="real-search-input"></s-input>
                <i class="iconfont icon-magnifier search-btn" @click="personSearchHandle"></i>
              </div>
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
          <div>
            <s-row class="topRow">
              <s-col span="12">
                <s-button @click="addAuthAssetsBtn">按资产授权</s-button>
                <s-button @click="addAuthOperResponBtn">按运维责任组授权</s-button>
                <s-button @click="bathDeleteAssets">批量删除</s-button>
              </s-col>
              <s-col span="12">
                <div class="input-search">
                  <s-input v-model="assetsSearchKey" @keyup.enter.native="assetsSearchHandle"
                           placeholder="请输入资产名称/ip地址/资产类型/型号" class="real-search-input"></s-input>
                  <i class="iconfont icon-magnifier search-btn" @click="assetsSearchHandle"></i>
                </div>
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
              <s-table-column prop="modelNumber" label="型号" show-overflow-tooltip>
              </s-table-column>
              <s-table-column prop="groupName" label="运维责任组" show-overflow-tooltip>
              </s-table-column>
              <s-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <i class="iconfont icon-delete" @click="deleteAssets(scope.row)" title="删除"></i>
                  <i class="iconfont icon-authorise" @click="authProAccount(scope.row)" title="授权协议与账号"></i>
                </template>
              </s-table-column>
            </RealPageTable>
          </div>
        </div>
      </s-scrollbar>
      <!-- 单选框操作-->
      <s-form-item label="" class="auth-radio">
        <s-radio-group v-model="form.type">
          <div class="fl radio-item">
            <s-radio :label="1">自定义授权</s-radio>
            <s-tooltip placement="top">
              <div slot="content">自定义授权默认只授权资产，可手动进行细粒度设置</div>
              <i class="iconfont icon-weizhi"></i>
            </s-tooltip>
          </div>
          <div class="fl radio-item auth-option">
            <s-radio :label="2">全授权</s-radio>
            <i class="iconfont icon-right arrow" v-if="form.type !== 2"></i>
            <i class="iconfont icon-bottom arrow" v-else></i>
            <s-tooltip placement="top">
              <div slot="content">1: 授权全协议指自动授权资产上所有协议，且该资产上新增协议自动授权；<br/>2: 授权全账号指自动授权资产所有协议上所有账号，且该资产所有协议上新增账号自动授权</div>
              <i class="iconfont icon-weizhi"></i>
            </s-tooltip>
            <s-checkbox-group v-model="form.allAuth" v-if="form.type === 2" :min="1">
              <s-checkbox :label="1">授权全协议</s-checkbox>
              <s-checkbox :label="2" v-if="form.pwdCon !== 1">授权全账号</s-checkbox>
            </s-checkbox-group>
          </div>
          <div class="fl radio-item auth-option" style="width: 140px">
            <s-radio :label="3">部分全授权</s-radio>
            <i class="iconfont icon-right arrow" v-if="form.type !== 3"></i>
            <i class="iconfont icon-bottom arrow" v-else></i>
            <s-tooltip placement="top">
              <div slot="content">1: 部分全授权指可手动授权部分协议上的全部账号，且所选协议上新增账号自动授权<br/>2: "包含协议层"指会将协议与协议下账号都进行授权<br/>3: 必须手动选择资产上一个或多个协议，否则只授权资产</div>
              <i class="iconfont icon-weizhi"></i>
            </s-tooltip>
            <s-checkbox-group v-model="form.partAuth" v-if="form.type === 3">
              <s-checkbox :label="1">包含协议层</s-checkbox>
            </s-checkbox-group>
          </div>
        </s-radio-group>
      </s-form-item>
    </s-form>
    <template slot="footer" class="dialog-footer">
      <s-button @click="saveAuth" :disabled="saveFlag">保存</s-button>
      <s-button @click="seniorSet">高级设置</s-button>
      <s-button type="cancel" @click="closeAuthDialog">取消</s-button>
    </template>

    <!--按人员授权-->
    <auth-person v-model="authPersonFlag" v-if="authPersonFlag" :tempObj="tempObj"
                 @personUpdate="personUpdate"></auth-person>
    <auth-organize v-model="authOrganizeFlag" v-if="authOrganizeFlag" :tempObj="tempObj"
                   @personUpdate="personUpdate"></auth-organize>
    <auth-assets v-model="authAssetsFlag" v-if="authAssetsFlag" :tempObj="tempObj"
                 @assetsUpdate="assetsUpdate"></auth-assets>
    <auth-oper-respon v-model="authOperResponFlag" v-if="authOperResponFlag" :tempObj="tempObj"
                      @assetsUpdate="assetsUpdate"></auth-oper-respon>
    <auth-pro-account v-model="authProAccountFlag" v-if="authProAccountFlag" :tempObj="tempObj"
                      ref="detailTreeTable"
                      :authRowData="authRowData"
                      @updataAssets="getAuthAssetsList"
                      :conditionObj="conditionObj"
                      :authSeniorObj="authSeniorObj"
                      :defaultSelectArr="defaultSelectArr">
    </auth-pro-account>
    <auth-senior-set v-model="authSeniorSetFlag" v-if="authSeniorSetFlag" :tempObj="tempObj"
                     :authSeniorObj="authSeniorObj"
                     @reloadDetaile="getSeniorData"></auth-senior-set>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import authPerson from './AuthPerson'
  import authOrganize from './AuthOrganize'
  import authAssets from './AuthAssets'
  import authOperRespon from './AuthOperRespon'
  import authSeniorSet from './AuthSeniorSet'
  import AuthProAccount from './AuthProAccount';

  export default {
    components: {
      AuthProAccount,
      RealPageTable,
      authPerson,
      authOrganize,
      authAssets,
      authOperRespon,
      authSeniorSet
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      authEditRow: {
        type: Object,
        default: {}
      }
    },
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          let res = value.search(/[^-|\w|\u4e00-\u9fa5]/g);
          if (res > -1) {
            callback(new Error('由中文、字母、数字、-、_组成'));
          } else {
            callback();
          }
        }
      };
      let checkRepeatName = (rule, value, callback) => {
        if (value !== this.editDefaultName) {
          if (value) {
            $axios.post(`operationAuth/isUniqueAuthname/${value}`).then(({data}) => {
              if (data === false) {
                callback(new Error('该名称已经存在'));
              } else {
                callback()
              }
            })
          }
        } else {
          callback()
        }
      };
      return {
        personList: [],
        assetsList: [],
        dialogFlag: false,
        authPersonFlag: false,  // 按人员授权
        authOrganizeFlag: false,  // 按组织机构授权
        authAssetsFlag: false,  // 按资产授权
        authOperResponFlag: false,  // 按运维责任授权
        authProAccountFlag: false,  // 授权协议与账号
        authSeniorSetFlag: false,  // 高级设置
        authSeniorObj: null,  // 高级设置数据
        editDefaultName: '',
        authUserList: [],
        detailTempType: 0, // 细粒度类型(临时)
        tempObj: { // 临时
          uuid: '',
          tempUuid: ''
        },
        personBatchUuids: [], // 选中的uuid集合(人员)
        personSelections: [], // 选中的数据集合(人员)
        personSearchKey: '',   // 搜索(人员)
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
        saveFlag: false,
        form: {
          pwdCon: 0,
          authName: '',
          type: 1,
          allAuth: [1, 2],
          partAuth: []
        },
        formRule: {
          authName: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 50, message: '最大长度为 50', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'},
            {validator: checkRepeatName, trigger: 'blur'}
          ]
        },
        ajaxObjAssets: { // 资产授权
          type: 'post',
          url: '/operationAuth/getTempAuthDeviceList',
          checkedUuidArr: [],
          params: {
            condition: {
              content: '',
              authUuid: '',
              tempUuid: ''
            }
          }
        },
        authRowData: null, // 授权协议与账号 当前行
        assetsBatchUuids: [], // 选中的uuid集合(人员)
        assetsSelections: [], // 选中的数据集合(人员)
        assetsSearchKey: '',   // 搜索(资产)
        conditionObj: null, // 树形表格需要的参数
        defaultSelectArr: [] // 细粒度默认勾选的集合
      }
    },
    created() {
      if (this.isEdit) {
        this.getEditData()
      } else {
        this.getAuthName()
      }
    },
    methods: {
      getEditData() { // 获取编辑数据
        $axios.get(`/operationAuth/getAuthInfoByUuid/${this.authEditRow.uuid}`).then(({data}) => {
          if (data) {
            this.form.authName = data.authName;
            this.tempObj.uuid = data.uuid;
            this.tempObj.tempUuid = data.tempUuid;
            this.editDefaultName = data.authName;
            this.form.pwdCon = data.pwdCon;
            this.form.type = data.type;
            this.form.allAuth = this.form.type === 2 ? data.secondType : [1, 2];
            this.form.partAuth = this.form.type === 3 ? data.secondType : [];
            this.$nextTick(() => {
              this.getAuthPersonList();
              this.getAuthAssetsList();
              this.getSeniorData()
            });
          }
        });
      },
      getAuthName() { // 获取清单名称
        $axios.get('/operationAuth/getInformationForAdd').then((res) => {
          if (res.data) {
            this.form.authName = res.data.name;
            this.tempObj.uuid = res.data.uuid;
            this.tempObj.tempUuid = res.data.tempUuid;
            this.$nextTick(() => {
              this.getAuthPersonList();
              this.getAuthAssetsList();
              this.getSeniorData()
            })
          }
        });
      },
      getSeniorData() { // 获取高级设置
        let vm = this;
        $axios.get(`operationAuth/getAuthGlobalSetting/${vm.tempObj.uuid}/${vm.tempObj.tempUuid}`).then((res) => {
          if (res.data) {
            vm.authSeniorObj = res.data;
            vm.form.pwdCon = vm.authSeniorObj.pwdCon
          }
        });
      },
      addAuthPersonBtn() {
        this.authPersonFlag = true
      },
      addAuthOrganizeBtn() {
        this.authOrganizeFlag = true
      },
      addAuthAssetsBtn() {
        this.authAssetsFlag = true
      },
      addAuthOperResponBtn() {
        this.authOperResponFlag = true
      },
      seniorSet() { // 高级设置
        this.authSeniorSetFlag = true
      },
      /* 人员授权 */
      personSearchHandle() {
        this.getAuthPersonList()
      },
      personUpdate() { // 更新人员数据
        this.getAuthPersonList()
      },
      getAuthPersonList() {
        let params = {
          content: this.personSearchKey,
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        }
        this.ajaxObjPerson.params.condition = params;
        this.ajaxObjPerson.checkedUuidArr = this.personSelections;
      },
      personSelectHandle(selections) { // 选择的数据
        this.personSelections = selections;
      },
      deletePerson(row) { // 删除授权人员
        let vm = this;
        let params = {
          authUuid: vm.tempObj.uuid,
          tempUuid: vm.tempObj.tempUuid,
          relUuidList: [row.uuid]
        }
        vm.$confirm('确定删除选中的数据？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/operationAuth/batchDeleteUser', params).then(({data}) => {
            if (data.state) {
              vm.$message({type: 'success', message: '删除成功'});
              vm.getAuthPersonList();
              vm.personSelections = []
            } else {
              vm.$message({type: 'error', message: '删除失败'});
            }
          });
        }).catch(() => {
        });
      },
      bathDeletePerson() { // 批量删除人员
        let vm = this;
        if (vm.personSelections.length === 0) {
          vm.$message({type: 'warning', message: '请先选择授权人员'});
          return
        } else {
          vm.personBatchUuids = vm.personSelections.map(item => item.uuid)
          let params = {
            authUuid: vm.tempObj.uuid,
            tempUuid: vm.tempObj.tempUuid,
            relUuidList: vm.personBatchUuids
          }
          vm.$confirm('确定删除选中的数据？', '提示', {
            confirmButonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/operationAuth/batchDeleteUser', params).then(({data}) => {
              if (data.state) {
                vm.$message({type: 'success', message: '删除成功'});
                vm.getAuthPersonList();
                vm.personSelections = []
                vm.ajaxObjPerson.checkedUuidArr = vm.personSelections;  // 清空存储的数据
              } else {
                vm.$message({type: 'error', message: '删除失败'});
              }
            });
          }).catch(() => {
          });
        }
      },
      /* 资产授权 */
      getAuthAssetsList() {
        let params = {
          type: 0,
          content: this.assetsSearchKey,
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        };
        this.ajaxObjAssets.params.condition = params;
        this.ajaxObjAssets.checkedUuidArr = this.assetsSelections;
      },
      assetsSearchHandle() { // 查询资产
        this.getAuthAssetsList()
      },
      assetsSelectHandle(val) { // 选择的数据
        this.assetsSelections = val;
      },
      assetsUpdate(data) { // 更新资产数据
        this.getAuthAssetsList()
      },
      deleteAssets(row) { // 删除授权资产
        let vm = this;
        let params = {
          authUuid: vm.tempObj.uuid,
          tempUuid: vm.tempObj.tempUuid,
          relUuidList: [row.uuid]
        }
        vm.$confirm('确定删除选中的数据？', '提示', {
          confirmButonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/operationAuth/batchDeleteTempDevice', params).then(({data}) => {
            if (data.state) {
              vm.$message({type: 'success', message: '删除成功'});
              vm.getAuthAssetsList();
              vm.assetsSelections = []
            } else {
              vm.$message({type: 'error', message: '删除失败'});
            }
          });
        }).catch(() => {
        });
      },
      bathDeleteAssets() { // 批量删除资产
        let vm = this;
        if (vm.assetsSelections.length === 0) {
          vm.$message({type: 'warning', message: '请先选择授权资产'});
          return
        } else {
          vm.assetsBatchUuids = vm.assetsSelections.map(item => item.uuid)
          let params = {
            authUuid: vm.tempObj.uuid,
            tempUuid: vm.tempObj.tempUuid,
            relUuidList: vm.assetsBatchUuids
          };
          vm.$confirm('确定删除选中的数据？', '提示', {
            confirmButonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            $axios.post('/operationAuth/batchDeleteTempDevice', params).then(({data}) => {
              if (data.state) {
                vm.$message({type: 'success', message: '删除成功'});
                vm.getAuthAssetsList();
                vm.assetsSelections = []
                vm.ajaxObjAssets.checkedUuidArr = vm.assetsSelections;  // 清空存储的数据
              } else {
                vm.$message({type: 'error', message: '删除失败'});
              }
            });
          }).catch(() => {
          });
        }
      },
      personListBack(data) {
        this.personList = data
      },
      assetsListBack(data) {
        this.assetsList = data
      },
      getSecondType() {
        let secondType = []
        if (this.form.type === 2) {
          secondType = this.form.allAuth
        } else if (this.form.type === 3) {
          secondType = this.form.partAuth
        }
        return secondType
      },
      saveAuth() { // 保存授权清单
        this.$refs['form'].validate(valid => {
          if (!valid) {
            return;
          }
          let params = {
            uuid: this.tempObj.uuid,
            authName: this.form.authName,
            type: this.form.type,
            secondType: this.getSecondType(),
            tempUuid: this.tempObj.tempUuid
          };
          this.saveFlag = true
          $axios.post('/operationAuth/saveOperationAuth', params, {
            data: [{authName: this.form.authName}],
            logTemplate: `${this.isEdit ? '编辑' : '添加'}|授权策略管理>授权策略(#authName#)>`
          }).then(({data}) => {
            if (data.state) {
              this.$message({type: 'success', message: data.errormsg});
              this.dialogFlag = false;
              this.$emit('authPolicyList');
            } else {
              this.$message({type: 'error', message: data.errormsg})
            }
            this.saveFlag = false
          });
        });
      },
      closeAuthDialog() {
        $axios.get(`/operationAuth/deleteTempAuthInfo/${this.tempObj.uuid}/${this.tempObj.tempUuid}`).then(({data}) => {
          this.dialogFlag = false
        });
      },
      authProAccount(row) { // 授权协议与账号
        this.authProAccountFlag = true
        this.conditionObj = {
          uniqueUuid: row.uuid,
          type: this.form.type,
          secondType: this.getSecondType(),
          authUuid: this.tempObj.uuid,
          tempUuid: this.tempObj.tempUuid
        };
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
      'form.type': {
        immediate: true,
        deep: true,
        handler(val) {
        }
      },
      'authSeniorObj.pwdCon': {
        immediate: true,
        handler(val) {
          if (val === 1) {
            this.form.allAuth = [1]
          }
        }
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

