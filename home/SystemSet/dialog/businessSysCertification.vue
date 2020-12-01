<template>
  <div class="high-level-set">
    <div class="bussiness-title">业务系统</div>
    <s-table-page :data='approveList'  :header-search='getSearchApproveDef()'
                  :header-actions='getApproveListActionsDef()' :row-actions='getApproveRowActionsDef()' actions-col-width="150">
      <s-table-column prop="businessIp" label="IP" show-overflow-tooltip width="150">
      </s-table-column>
      <s-table-column prop="businessName" label="名称" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="secret" label="签名" show-overflow-tooltip width="300">
      </s-table-column>
      <s-table-column prop="secretStatus" label="签名状态" show-overflow-tooltip width="100">
        <template slot-scope="scope">
          <s-switch :title="scope.row.secretStatus?'有效':'失效'" size="small" v-model="scope.row.secretStatus" :active-value="1"
                    :inactive-value="0" @change="changeSwitch(scope.row.uuid,scope.row.secretStatus)"></s-switch>
        </template>
      </s-table-column>
      <s-table-column prop="createTime" label="创建时间" show-overflow-tooltip width="200">
      </s-table-column>
      <s-table-column prop="updateTime" label="更新时间" show-overflow-tooltip width="200">
      </s-table-column>
    </s-table-page>
    <div class="bussiness-title">代理</div>
    <s-table-page :data='approveProxyList'  :hasActionCol='false'
                  :header-search="{show: false}">
      <s-table-column prop="agentAddress" label="IP" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="agentStatus" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <img
            :src="scope.row.agentStatus?'../../../static/images/resourcemanage/deviceOnline.png':'../../../static/images/resourcemanage/deviceOffline.png'"
            :title="scope.row.agentStatus?'在线':'离线'" class="stateImg">
        </template>
      </s-table-column>
      <s-table-column prop="createTime" label="创建时间" show-overflow-tooltip>
      </s-table-column>
      <s-table-column prop="updateTime" label="更新时间" show-overflow-tooltip>
      </s-table-column>
      <!-- <s-table-column label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <i class="iconfont icon-eye" @click="ApproveProxyEyeHandle(scope.row)"></i>
          <i class="iconfont icon-edit" @click="ApproveProxyEditHandle(scope.row)"></i>
          <i class="iconfont icon-delete" @click="deleteApproveProxy(scope.row)"></i>
        </template>
      </s-table-column> -->
    </s-table-page>
    <!--编辑业务认证-->
    <s-dialog v-model="editApproveDialog" v-if="editApproveDialog" width="700px"
              :title="check?'查看':(addCheckBool?'新增':'编辑')">
      <approve-edit-manage :ApproveEditData="ApproveEditData" :activeItem='activeNames' :ischeck="check" ref="editApprove"></approve-edit-manage>
      <template slot="footer" v-if="!check">
        <s-button @click="saveApprove">保存</s-button>
        <s-button type="cancel" @click="editApproveDialog = false;addCheckBool = false">取消</s-button>
      </template>
    </s-dialog>
  </div>

</template>
<script type="text/babel">
  // import SelectAsset from '../components/SelectAsset.vue'
  // import BackupServer from '../BackupServer'
  // import addRule from '../components/addRule.vue'
  import $axios from 'sunflower-ajax'
  // import {cloneDeep} from 'lodash'
  // import {decryptPwd, encryptPwd} from 'sunflower-common-utils'
  // import AddIpRule from '../components/AddIpRule.vue'
  // import EyeManage from '../components/EyeManage.vue'
  // import AdvanceProxySet from '../components/AdvanceProxySet.vue'
  import authCheck from '@/common/mixins/auth.js'
  // import EditManage from '../components/EditManage.vue'
  import ApproveEditManage from '../components/ApproveEditManage.vue'
  // import {Validaters} from 'sunflower-common-utils';

  export default {
    mixins: [authCheck],
    components: {
      // BackupServer,
      // addRule,
      // SelectAsset,
      // AddIpRule,
      // EyeManage,
      // AdvanceProxySet,
      // EditManage,
      ApproveEditManage
    },
    data() {
      return {
        check: true, // 查看业务系统
        activeNames: ['1'],
        addCheckBool: false, // 新增业务系统
        ApproveEditData: {},
        editApproveDialog: false, // 业务认证
        editData: '',
        approveProxyList: [],
        approveList: []
      }
    },
    created() {
      this.getApproveList()
      this.getApproveProxyList()
    },
    methods: {
      changeHandler(val, item) {
        val.configValue = '';
      },
      selection(key) {
        this.pane = key
        console.log(key)
      },
      // 获取业务系统列表
      getApproveList() {
        $axios.post('/agentBusinessSystem/getAllBusinessSystemInfo').then(({data}) => {
          if (data.length) {
            this.approveList = data;
          } else {
            this.approveList = [];
          }
        })
      },
      // 获取业务系统代理列表
      getApproveProxyList() {
        $axios.post('/agentBusinessSystem/getAllBusinessAgentInfo').then(({data}) => {
          if (data.length) {
            this.approveProxyList = data;
          } else {
            this.approveProxyList = [];
          }
        })
      },
      // 业务认证编辑保存
      saveApprove() {
        // const baseData = this.$refs['editApprove'].dataList;
        const editData = this.$refs['editApprove'].manageEdit;
        delete editData.updateTime;
        delete editData.createTime;
        if (editData.businessIp === '' || editData.businessName === '' || editData.secret === '') {
          this.activeNames = ['1']
        } else if (editData.businessDatabaseInfoList === null || editData.businessDatabaseInfoList.length === 0) {
          this.$message.error('关联数据库不能为空')
          this.activeNames = ['2']
          return
        }
        if (editData.businessName.length > 255) {
          this.$message.error('名称长度不能超过255')
          return
        }
        const form = this.$refs['editApprove'].$refs['manageEdit'];
        form.validate(valid => {
          if (!valid) return;
          if (editData.uuid) { // 编辑
            $axios.post('/agentBusinessSystem/editBusinessSystemInfo', editData).then(({data}) => {
              if (data === 'success') {
                this.editApproveDialog = false;
                this.$message.success('修改成功');
                this.getApproveList();
                this.getApproveProxyList();
              } else {
                this.$message.error('修改失败')
              }
            })
          } else { // 新增
            this.addCheckBool = false;
            $axios.post('/agentBusinessSystem/addBusinessSystemInfo', editData).then(({data}) => {
              if (data === 'success') {
                this.editApproveDialog = false;
                this.$message.success('保存成功');
                this.getApproveList();
                this.getApproveProxyList();
              } else {
                this.$message.error('保存失败')
              }
            })
          }
        })
      },
      // 业务系统认证操作
      getApproveRowActionsDef() {
        let vm = this;
        return [
          {
            icon: 'eye',
            name: '查看',
            click(row) {
              $axios.post(`/agentBusinessSystem/viewBusinessSystemInfo`, [row.uuid]).then(({
                                                                                             data
                                                                                           }) => {
                if (data.businessDatabaseInfoList === null) {
                  data.businessDatabaseInfoList = [];
                }
                vm.ApproveEditData = data;
                vm.check = true;
                vm.editApproveDialog = true;
              })
            }
          },
          {
            icon: 'edit',
            name: '修改',
            click(row) {
              $axios.post(`/agentBusinessSystem/viewBusinessSystemInfo`, [row.uuid]).then(({
                                                                                             data
                                                                                           }) => {
                if (data.businessDatabaseInfoList === null) {
                  data.businessDatabaseInfoList = [];
                }
                vm.ApproveEditData = data;
                vm.check = false;
                vm.editApproveDialog = true;
              })
            }
          }, {
            icon: 'delete',
            name: '删除',
            click(row) {
              vm.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                $axios.post(`/agentBusinessSystem/delBusinessSystemInfo`, [row.uuid]).then((res) => {
                  if (res.data === 'success') {
                    vm.$message({type: 'success', message: '删除成功'});
                    vm.getApproveList();
                    vm.getApproveProxyList();
                  } else {
                    vm.$message({type: 'error', message: '删除失败'});
                  }
                });
              }).catch(() => {
              });
            }
          }]
      },
      // 改变业务系统一列的状态
      changeSwitch(uuid, val) {
        $axios.post('/agentBusinessSystem/updateSecretStatus', [uuid, val]).then(({data}) => {
          if (data === 'success') {
            this.$message.success('状态改变成功');
          } else {
            this.$message.error('状态改变失败');
            this.getApproveList();
          }
        })
      },
      // 业务系统认证按钮新增
      getApproveListActionsDef() {
        let self = this
        return {
          width: 6,
          actions: [{
            name: '新增',
            click() {
              self.addCheckBool = true;
              self.check = false;
              self.ApproveEditData = {};
              self.editApproveDialog = true
            },
            icon: 'plus'
          }]
        }
      },
      // 业务系统认证查询
      getSearchApproveDef() {
        return {
          width: 4,
          offset: 14,
          placeholder: '请输入查询内容',
          searchProps: ['businessIp', 'businessName', 'secret', 'secretStatus', 'createTime', 'updateTime']
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .high-level-set {
    margin: 0 20px;

    .params-list {
      .iconfont {
        cursor: pointer;
        margin-left: 5px;
      }
    }
    .bussiness-title{
      padding 10px 0
    }
    .s-form-wrapper {
      width: 800px;
    }

  }

  .setScore-box-card {
    border: none;
  }

  .card-title {

    .grade-title {
      font-weight: 700;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      margin-bottom: 5px;
    }

  }

  @keyframes loading-diandiandian {
    from {
      width: 0;
    }

    to {
      width: 20px;
    }
  }

  @keyframes animation1 {
    0% {
      transform: translate(-10px, 0) scale(1, 1);
    }

    25% {
      transform: translate(0, 0) scale(1.5, 1.5);
    }

    50% {
      transform: translate(10px, 0) scale(1, 1);
    }

    75% {
      transform: translate(0, 0) scale(0.2, 0.2);
    }

    100% {
      transform: translate(-10px, 0) scale(1, 1);
    }
  }

  @keyframes animation2 {
    0% {
      transform: translate(10px, 0) scale(1, 1);
    }

    25% {
      transform: translate(0, 0) scale(0.2, 0.2);
    }

    50% {
      transform: translate(-10px, 0) scale(1, 1);
    }

    75% {
      transform: translate(0, 0) scale(1.5, 1.5);
    }

    100% {
      transform: translate(10px, 0) scale(1, 1);
    }
  }

  .network-test-loading2 {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 10px;
    margin-left: 10px;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .network-test-loading2:before, .network-test-loading2:after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 14px;
    height: 14px;
    margin-left: -7px;
    margin-top: -7px;
    border-radius: 7px;
    border-bottom: 1px solid #fff;
  }

  .network-test-loading2:before {
    animation: rotate 0.8s ease-out infinite;
  }

  .network-test-loading2:after {
    animation: rotate 0.8s linear infinite;
  }

  #index-body {

    .s-card.app-center {

      .s-card-header {
        padding-left: 10px !important;
        padding-right: 10px;
      }

      .s-card-body {
        padding-left: 10px;
        padding-right: 10px;
      }

    }
  }
</style>
