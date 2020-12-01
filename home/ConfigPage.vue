<!--
 * @Author: mybells
 * @Version://Q1UE问题优化
 * @Description:配置向导模块页面
 * @Date: 2020-01-16 16:23:37
 * @LastEditors: mybells
 -->
<template>
  <div class="configpage">
    <s-collapse v-model="activeName" accordion style="margin-top:10px;">
      <s-collapse-item name="1">
        <template slot="title">
          <span>基础信息&emsp;&emsp;&emsp;&emsp;&emsp;【配置基础必备数据，您可以通过以下向导步骤进行数据初始化操作。】</span>
        </template>
        <collapse-content title="组织机构添加" description="[根据公司组织架构，添加组织机构上下级，可以用模板批量导入]">
          <s-button @click="base_orz_add" icon="export">进入</s-button>
        </collapse-content>
        <collapse-content title="人员账号添加" description="[可以手动添加人员账号，也可以用模板批量导入，支持LDAP导入、AD域导入]">
          <s-button @click="base_admin_add" icon="export">进入</s-button>
        </collapse-content>
        <collapse-content title="资产信息添加" description="[在这里，您可以配置资产通用属性、资产特殊属性、资产生命周期状态、和资产之间关联关系，可以手动添加，也可以通过模板导入资产信息，也可以使用“扫描发现”功能进行资产信息初始化]">
          <s-button @click="base_asset_add" icon="export">进入</s-button>
          <s-button @click="base_scan">扫描发现</s-button>
        </collapse-content>
      </s-collapse-item>
      <s-collapse-item name="2" v-if="ImpAuth">
        <template slot="title"><!-- ImpAuth -->
          <span>资产监控&emsp;&emsp;&emsp;&emsp;&emsp;【主机系统、主机硬件、网络、中间件、数据库、终端、存储等资产的监控开启和规则配置，您可以根据向导步骤进行操作。】</span>
        </template>
        <collapse-content description="[您可以通过“一键开启监控”按钮将主机服务器、网络、中间件、数据库、终端、存储等资产开启监控；您可以通过“高级配置”按钮进入到功能列表，可以根据您实际业务要求的做相应调整修改。]">
          <s-button @click="monitor_open">一键开启监控</s-button>
          <s-button @click="monitor_config">高级配置</s-button>
        </collapse-content>
      </s-collapse-item>
      <s-collapse-item name="3" v-if="OmaAuth"><!-- OmaAuth -->
        <template slot="title">
          <span>运维审计&emsp;&emsp;&emsp;&emsp;&emsp;【运维资产的授权策略配置、资产的账户与协议配置、您可以根据向导步骤进行操作。】</span>
        </template>
        <collapse-content title="授权策略管理" description="[通过建立授权清单，将人员和资产、资产账号和资产协议进行授权配置]">
          <s-button @click="operation_auth" icon="export">进入</s-button>
        </collapse-content>
      </s-collapse-item>
      <s-collapse-item name="4" v-if="DbaAuth"><!-- DbaAuth -->
        <template slot="title">
          <span>数据库审计&emsp;&emsp;&emsp;&emsp;【数据库审计的开启，一级审计规则配置，您可以根据向导步骤进行操作。】</span>
        </template>
        <collapse-content description="[您可以通过“一键开启审计”按钮将数据库资产开启审计，您也可以通过“高级配置”按钮进入到功能列表，根据您的实际业务要求进行调整修改。]">
          <s-button @click="db_open">一键开启审计</s-button>
          <s-button @click="db_config">高级配置</s-button>
        </collapse-content>
      </s-collapse-item>
      <s-collapse-item name="5" v-if="SiemAuth"><!-- SiemAuth -->
        <template slot="title">
          <span>日志审计&emsp;&emsp;&emsp;&emsp;&emsp;【日志审计的开启、以及审计规则配置，您可以根据向导步骤进行操作。】</span>
        </template>
        <collapse-content description="[您可以通过“一键开启审计”按钮将数据库资产开启审计，您也可以通过“高级配置”按钮进入到功能列表，根据您的实际业务要求进行调整修改。]">
          <s-button @click="log_open">一键开启审计</s-button>
          <s-button @click="log_config">高级配置</s-button>
        </collapse-content>
      </s-collapse-item>
      <s-collapse-item name="6" v-if="AutoAuth"><!-- AutoAuth -->
        <template slot="title">
          <span>自动化运维&emsp;&emsp;&emsp;&emsp;【自动化采集参数的配置，您可以根据向导步骤进行操作。】</span>
        </template>
        <collapse-content title="参数配置" description="[端口配置、会话设置、服务器脚本配置]">
          <s-button @click="auto_config" icon="export">进入</s-button>
        </collapse-content>
      </s-collapse-item>
      <s-collapse-item name="7" v-if="WorkFlowAuth"><!-- WorkFlowAuth -->
        <template slot="title">
          <span>流程中心&emsp;&emsp;&emsp;&emsp;&emsp;【ITIL最佳时间的流程设置，包括：人员角色、三级分类、自动分派、审批映射、流程模块、变更风险评估问卷、服务级别SLA、满意度等，您可以根据向导步骤进行操作。】</span>
        </template>
        <collapse-content title="流程设置" description="[配置支持组、三级分类、自动分派、审批映射、模板维护、变更风险问卷、发布管理、满意度、服务级别SLA]">
          <s-button @click="process_config" icon="export">进入</s-button>
        </collapse-content>
      </s-collapse-item>
    </s-collapse>
    <find-again-dialog :findAgainDialogFlag.sync="findAgainDialogFlag" v-if="findAgainDialogFlag">
    </find-again-dialog>
  </div>
</template>

<script type="text/babel">
import roleCheckMixin from '@/common/mixins/roleCheckMixin.js'
import auth from '@/common/mixins/auth.js'
import collapseContent from './ConfigGuide/CollapseContent'
import $axios from 'sunflower-ajax'
import FindAgainDialog from '@/pages/Assets_FindAgain/FindAgainDialog';

export default {
  name: 'ConfigPage',
  mixins: [auth, roleCheckMixin],
  components: {
    collapseContent,
    FindAgainDialog
  },
  data() {
    return {
      activeName: '1',
      findAgainDialogFlag: false

    }
  },
  created() {
  },
  methods: {
    /* 基础信息 */
    base_orz_add() {
      this.$router.push('/ConfigPage/orgTopo');
      this.clearSub('enterDepartment');
    },
    base_admin_add() {
      this.$router.push('/ConfigPage/assetStaff');
      this.clearSub('enterUser');
    },
    base_asset_add() {
      this.$router.push('/ConfigPage/assets_list?name=服务器&all=1');
      this.clearSub('enterAssit');
    },
    base_scan() {
      this.findAgainDialogFlag = true;
      this.clearSub('assetDiscovery');
    },
    /* 资产监控 */
    monitor_open() {
      this.$confirm('是否一键开启所有资产的监控', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.post('/resourcemanager/assetmanager/itasset/monitorAllAssets').then((res) => {
          if (res.data.state) {
            this.$message({
              type: 'success',
              message: '开启成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.errormsg
            });
          }
        })
      }).catch(() => {});
      this.clearSub('openAssetMonitor');
    },
    monitor_config() {
      this.$router.push('/ConfigPage/assetsMonitor_list');
      this.clearSub('assetMonitorSetting');
    },
    /* 运维审计 */
    operation_auth() {
      this.$router.push('/ConfigPage/account_auth');
      this.clearSub('enterOperationAuth');
    },
    /* 数据库审计 */
    db_open() {
      this.$confirm('是否一键开启所有数据库的审计', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.get('/sysDbauditObject/openDbAndMidWareAudit').then((res) => {
          if (res.data.state) {
            this.$message({
              type: 'success',
              message: '开启成功'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.data.errormsg
            });
          }
        })
      }).catch(() => {});
      this.clearSub('openDatabaseAudit');
    },
    db_config() {
      this.$router.push('/ConfigPage/db_setting');
      this.clearSub('datebaseAuditSetting');
    },
    /* 日志审计 */
    log_open() {
      this.$confirm('是否一键开启所有资产的日志审计', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $axios.get('/resourcemanager/assetmanager/itasset/logAuditAllAssets').then((res) => {
          if (res.data.result === 'success_on') {
            this.$message({ showClose: true, message: '开启日志审计成功！', type: 'success' });
          } else {
            let tip = '';
            if (res.data.fail1sb !== undefined && res.data.fail1sb !== null) {
              tip = `设备【${res.data.fail1sb.join(',')}】因没有配置IP，`;
            }
            if (res.data.fail2sb !== undefined && res.data.fail2sb !== null) {
              tip += `设备【${res.data.fail2sb.join(',')}】因日志审计数达到上限，`
            }
            this.$message({ duration: 5000, showClose: true, message: `${tip}开启日志审计失败！`, type: 'error' });
          }
        })
      }).catch(() => {});
      this.clearSub('openLogAudit');
    },
    log_config() {
      this.$router.push('/ConfigPage/log_setting');
      this.clearSub('logAuditSetting');
    },
    /* 自动化运维 */
    auto_config() {
      this.$router.push('/ConfigPage/config_collect');
      this.clearSub('enterAutoOperationSetting');
    },
    /* 流程中心 */
    process_config() {
      this.$router.push('/ConfigPage/Process_setup');
      this.clearSub('enterItilSetting');
    },
    clearSub(operationKey) {
      $axios.get(`/firstUsageWizard/updateConfigurationWizardMark/${operationKey}`).then(res => {
        $axios.get(`/firstUsageWizard/getConfigurationWizardMarks`).then((res) => { // Q1UE问题优化
          this.$store.commit('SET_MENU', res.data);
        })
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    // 系统管理员有权限访问配置向导页面
    next(vm => {
      if (vm.isSystemAdmin) {
        next()
      } else {
        next('/')
      }
    })
  }
}
</script>
<style lang="stylus">
.configpage {
}
</style>
