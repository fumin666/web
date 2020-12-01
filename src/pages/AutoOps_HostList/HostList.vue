<template>
  <section id="hostList" style="margin-top: 10px">
    <s-row class="block">
          <!--<s-button icon="host" @click="syncCMDBHost">从CMDB同步主机</s-button>-->
      <s-form :inline="true" :model="searchForm" class="search_form" ref="searchForm" :rules="searchFormRules" style="margin-bottom: 10px;">
        <div>
          <s-form-item label="资产名称：" prop="condition.itcompname">
            <s-input
              v-model="searchForm.condition.itcompname"
              @keyup.enter.native="getHostList"></s-input>
          </s-form-item>
          <s-form-item label="IP地址：" prop="condition.controladderss">
            <s-input
              v-model="searchForm.condition.controladderss"
              @keyup.enter.native="getHostList"></s-input>
          </s-form-item>
          <s-form-item label="资产类型：" prop="condition.productUuid">
            <s-select
              clearable
              @change="getHostList"
              v-model="searchForm.condition.productUuid">
              <s-option
                v-for="i in systemTypeList"
                :label="i.systemName"
                :value="i.productUuid"
                :key="i.productUuid"></s-option>
            </s-select>
          </s-form-item>
        </div>
        <div class="search_btn">
          <s-button icon="magnifier" @click="getHostList">查询</s-button>
        </div>
      </s-form>
    </s-row>
    <s-row style="margin: 10px 0;">
      <s-button icon="subgroup" @click="batchDivideGroup">批量分组</s-button>
      <s-button icon="script-language" @click="batchScript">批量执行脚本</s-button>
    </s-row>
    <s-row class="block">
      <RealPageTable :ajax-obj="ajaxObj"
        @selection-change="hostListSelectionChange">
        <s-table-column type="selection" width="45" align="center"></s-table-column>
        <!--<s-table-column label="状态" width="70" align="center">
          <template slot-scope="scope">
            <img class="hostStatusIcon" :src="filterStateImg(scope.row.status)"/>
          </template>
        </s-table-column>-->
        <s-table-column label="资产名称" prop="itcompname">
          <template slot-scope="scope">
            <span v-text="scope.row.itcompname"></span>
          </template>
        </s-table-column>
        <s-table-column label="IP地址" prop="controladderss"></s-table-column>
        <s-table-column label="资产类型" prop="productname"></s-table-column>
        <s-table-column label="操作" width="120">
          <template slot-scope="scope">
            <i
              class="iconfont icon-eye"
              title="查看脚本执行结果"
              @click="goToHostDetail(scope.row.uuid)"></i>
            <i
              class="iconfont icon-policy"
              title="执行脚本"
              @click="executeScript(scope.row)"></i>
            <!--<i-->
              <!--:class="`iconfont icon-attended${scope.row.isAttented?'-full':''}`"-->
              <!--:title="scope.row.isAttented?'取消关注':'关注主机'"-->
              <!--@click="focusOrCancel(scope.row)"></i>-->
          </template>
        </s-table-column>
      </RealPageTable>
    </s-row>

    <!--批量分组弹框-->
    <s-dialog
      v-model="batchDivideGroupDialog"
      v-if="batchDivideGroupDialog"
      title="批量分组">
      <s-form
        ref="batchDivideGroupForm"
        :model="batchDivideGroupForm"
        :rules="batchDivideGroupFormRules"
        label-width="100px">
        <s-form-item label="一级分组" prop="firstUuid">
          <s-select
            v-model="batchDivideGroupForm.firstUuid"
            @change="getSecondLevelGroups"
            style="width: 100%;">
            <s-option
              v-for="i in firstLevelGroups"
              :label="i.groupName"
              :value="i.uuid"
              :key="i.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="二级分组" prop="secondUuid">
          <s-select v-model="batchDivideGroupForm.secondUuid" style="width: 100%;">
            <s-option
              v-for="i in secondLevelGroups"
              :label="i.groupName"
              :value="i.uuid"
              :key="i.uuid"></s-option>
          </s-select>
        </s-form-item>
      </s-form>
      <template slot="footer" class="dialog-footer">
        <s-button @click="saveBatchDivideGroup">确定</s-button>
        <s-button type="cancel" @click="batchDivideGroupDialog = false">取消</s-button>
      </template>
    </s-dialog>

    <!--执行脚本弹框-->
    <s-dialog
      v-model="scriptExeDialog"
      v-if="scriptExeDialog"
      top="12vh"
      title="执行脚本"
      width="850px">
      <script-execute
        :type="scriptExeType"
        :exeingHostsData="exeingHostsData"></script-execute>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
import $axios from 'sunflower-ajax';
import Bus from '@/plugins/eventBus';
import { cloneDeep } from 'lodash';
import {Validaters} from 'sunflower-common-utils';
// import searchBox from '@/components/tableCom/src/SearchBox';
import ScriptExecute from './ScriptExecute';
import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'

export default {
  data() {
    return {
      systemTypeList: [],       // 搜索框主机系统名称下拉选项
      // 搜索框
      searchForm: {
        currentPage: 1,
        pageSize: 15,
        // 主机列表分页查询数据
        condition: {
          firstGroupUuid: '',   // 左侧树对应一级分组
          secondGroupUuid: '',  // 左侧树对应二级分组
          productUuid: '',      // 主机系统名
          itcompname: '',       // 主机名
          controladderss: ''    // IP地址
        }
      },
      ajaxObj: {
        type: 'post',
        url: '/autoMateItcomp/getCanAutoMateItcompInfo',
        params: {
          condition: {
            firstGroupUuid: '',   // 左侧树对应一级分组
            secondGroupUuid: '',
            productUuid: '',      // 主机系统名
            itcompName: '',       // 主机名
            controlAdderss: ''    // IP地址
          }
        }
      },
      // 搜索框验证规则
      searchFormRules: {
        'condition.controladderss': [Validaters.IP]
      },
      hostListData: [],         // 主机列表数据
      loading: true,            // loading加载遮罩
      hostListSelections: [],   // 主机列表多选值
      tableHeight: 500,
      // ***批量分组相关数据***
      batchDivideGroupDialog: false,    // 批量分组弹框
      firstLevelGroups: [],             // 一级分组下拉选项
      secondLevelGroups: [],            // 二级分组下拉选项
      batchDivideGroupForm: {           // 批量分组表单
        firstUuid: '',
        secondUuid: '',
        itcompUuids: []
      },
      batchDivideGroupFormRules: {      // 批量分组表单校验
        firstUuid: [{required: true, message: '不能为空', trigger: 'change'}],
        secondUuid: [{required: true, message: '不能为空', trigger: 'change'}]
      },
      // ***脚本执行相关数据***
      scriptExeType: '',              // 脚本执行类型(批量/单个)
      scriptExeDialog: false,         // 脚本执行弹框
      exeingHostsData: []             // 将要执行脚本的主机列表数据
    }
  },
  components: {
    // searchBox,
    ScriptExecute,
    RealPageTable
  },
  watch: {
    '$route'(to, from) {
      if (to.query.uuid) {
        for (let key in this.searchForm.condition) {
          this.searchForm.condition[key] = '';
        }
      }
      this.getHostList();
    },
    // 解决批量分组弹框关闭内部数据不重置为初始值的bug
    batchDivideGroupDialog(newVal) {
      !newVal && this.$refs.batchDivideGroupForm.resetFields();
    }
  },
  methods: {
    // table高度计算
    doLayout() {
      this.$nextTick(() => {
        let totalHeight = document.body.offsetHeight;
        // let headHeight = document.querySelector('#headBar').offsetHeight;
        let footHeight = document.querySelector('.s-footer').offsetHeight;
        // let toolBarHeight = document.querySelector('#hostList .tool-bar').offsetHeight;
        let bodyHeight = totalHeight - footHeight;
        // 40 是底部pagination的高度
        this.tableHeight = bodyHeight - 82;
      });
    },
    // 获取查询表单"主机系统名称"下拉选项
    getSystemTypeList() {
      $axios.get('/autoMateItcomp/getSystemTypeList').then(({data}) => {
        if (data && data instanceof Array) {
          this.systemTypeList = data;
        }
      })
    },
    // 获取主机列表数据
    getHostList() {
      let query = this.$route.query;
      let params = {
        firstGroupUuid: this.searchForm.condition.firstGroupUuid,
        secondGroupUuid: this.searchForm.condition.secondGroupUuid,
        productUuid: this.searchForm.condition.productUuid,
        itcompName: this.searchForm.condition.itcompname,
        controlAdderss: this.searchForm.condition.controladderss
      }
      if (query.level === '1') {
        params.firstGroupUuid = query.uuid;
      } else if (query.level === '2') {
        params.secondGroupUuid = query.uuid;
      }
      this.$nextTick(() => {
        this.ajaxObj.params.condition = cloneDeep(params);
      })
    },
    // 获取用户关注的主机列表
    getMyFocusHostList() {
      $axios.get('/autoMateItcomp/getAttentedItcompList').then(({data}) => {
        if (data && data instanceof Array) {
          this.hostListData = data;
          this.loading = false;
        }
      })
    },
    // 主机状态图标匹配
    filterStateImg(val) {
      switch (val) {
        case 0: return '../../../static/images/resourcemanage/deviceOffline.png';
        case 1: return '../../../static/images/resourcemanage/deviceOnline.png';
        case 2: return '../../../static/images/resourcemanage/deviceWarn.png';
        default: return '../../../static/images/resourcemanage/deviceOnline.png';
      }
    },
    // 主机列表表格多选
    hostListSelectionChange(val) {
      this.hostListSelections = val;
    },
    // 从CMDB同步主机
    syncCMDBHost() {
    },
    // 打开批量分组弹框
    batchDivideGroup() {
      if (this.hostListSelections.length > 0) {
        // 获取一级分组下拉选项
        $axios.get('/autoMateItcomp/getFirstGroup').then(({data}) => {
          if (data && data instanceof Array) {
            this.firstLevelGroups = data;
            this.batchDivideGroupDialog = true;
          }
        });
      } else {
        this.$message.warning('请至少选择一项要分组的主机！');
      }
    },
    // 获取批量分组的二级分组下拉选项
    getSecondLevelGroups(fistLevelGroupUuid) {
      $axios.get(`/autoMateItcomp/getSecondGroup/${fistLevelGroupUuid}`).then(({data}) => {
        if (data && data instanceof Array) {
          this.secondLevelGroups = data;
          this.batchDivideGroupForm.secondUuid = '';
        }
      });
    },
    // 保存批量分组
    saveBatchDivideGroup() {
      this.$refs.batchDivideGroupForm.validate(valid => {
        if (valid) {
          this.batchDivideGroupForm.itcompUuids = this.hostListSelections.map(i => i.uuid);
          $axios.post('/autoMateItcomp/addGroupItcomp', this.batchDivideGroupForm).then(({data}) => {
            if (data.state) {
              // 刷新主机列表
              this.$route.query.key === 'myFocus'
                ? this.getMyFocusHostList()
                : this.getHostList();
              Bus.$emit('freshGroupsTree');
              this.batchDivideGroupDialog = false;
              this.$message.success('保存成功！');
            } else {
              this.$message.error('保存失败，请刷新重试！');
            }
          })
        } else {
          return false;
        }
      })
    },
    // 批量脚本
    batchScript() {
      // this.$router.push('hostList/batchScript')
      if (this.hostListSelections.length > 0) {
        this.scriptExeType = 'batch';
        this.exeingHostsData = this.hostListSelections.concat([]);
        this.scriptExeDialog = true;
      } else {
        this.$message.warning('请至少选择一项执行脚本的主机！');
      }
    },
    // 开启某主机监控
    openHostMonitor(row) {
    },
    // 表格行内操作 - 执行脚本
    executeScript(row) {
      this.scriptExeType = 'single';
      this.exeingHostsData = [row];
      this.scriptExeDialog = true;
    },
    // 关注或者取消关注主机
    focusOrCancel(row) {
      if (row.isAttented === 1) {
        // 已经关注，取消关注
        $axios.get(`/autoMateCount/singleCancelAttentedAsset/${row.uuid}`).then(({data}) => {
          if (data.state) {
            // 在"所有主机列表"和"我关注的主机"列表都可以取消关注，所以需要判断刷新哪一个列表
            this.$route.query.key === 'myFocus'
              ? this.getMyFocusHostList()
              : this.getHostList();
            this.$message.success('已取消关注！');
          } else {
            this.$message.error('取消关注失败，请刷新重试！');
          }
        })
      } else {
        // 未关注，关注主机
        $axios.get(`/autoMateCount/singleAddAttentedAsset/${row.uuid}`).then(({data}) => {
          if (data && data.state === true) {
            /**
             * 在HostList.vue页面中添加"我关注的主机"只可能是在"所有主机列表"中点击关注主机，
             * 因为"我关注的主机"列表只能取消关注，所以此处刷新所有主机列表即可
             */
            this.getHostList();
            this.$message.success('关注成功！');
          } else {
            this.$message.error('关注失败，请刷新重试！');
          }
        })
      }
    },
    // 路由跳转至主机详情
    goToHostDetail(uuid) {
      this.$router.push({path: '/AutoOpsCenter/hostList/hostDetail', query: {uuid}})
    }
  },
  created() {
    this.getSystemTypeList();     // 获取查询表单"主机系统名称"下拉选项

    let query = this.$route.query;
    // 获取主机列表(所有/我关注的主机)
    if (query.key && query.key === 'myFocus') {
      this.getMyFocusHostList();   // 获取我关注的主机列表
    } else {
      // 查询全部主机列表
      this.$route.query.uuid = 'unknown'
      this.$route.query.level = '1' // 默认查询未知的主机
      this.getHostList();
    }
  },
  mounted() {
    this.doLayout();
    window.addEventListener('resize', this.doLayout);
  },
  destroyed() {
    window.removeEventListener('resize', this.doLayout);
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#hostList
  padding-left 10px
  .block
    margin-bottom 0
    .tool-bar
      margin-bottom 5px !important
      .handler-btns
        margin-bottom 5px
      .s-search-group-wrapper
        padding-bottom 10px
  .declareState
    font-size 14px
    margin-right 20px
    height 32px
    line-height 33px
    span
      margin-right 8px
  img.hostStatusIcon
    vertical-align middle
    margin-right 3px
  #hostListTable
    .s-table-row
      .cell .s-progress-bar
        width 100%
        padding-right 35px
        margin-right -45px
  .link
    cursor pointer
    &:hover
      text-decoration underline
</style>
