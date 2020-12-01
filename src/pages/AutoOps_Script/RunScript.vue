<template>
  <div>
    <s-scrollbar wrap-style="max-height: 620px;">
      <s-collapse v-model="activeName" accordion>
        <s-collapse-item title="选择脚本" name="1">
          <s-form :inline="true" :model="form" ref="form" :rules="formRules" label-width="80px" >
            <s-row>
              <s-form-item label="脚本库" class="scriptParamsForm1" prop="scriptLibUuid">
                <input-tree v-model="form.scriptLibUuid" :data="scriptLibraryList" :props="myProps" @select-change="getScriptList" style="width: 400px;" name="uuid"></input-tree>
              </s-form-item>
            </s-row>
            <s-row>
              <s-form-item label="脚本名称" prop="scriptUuid" style="width: 100%">
                <s-select v-model="form.scriptUuid" style="width: 400px;" @change="changeOwnType" collapse-tags multiple>
                  <s-option v-for="(item, index) in scriptList" :value="item.uuid" :label="item.scriptName" :key="index + item.uuid" style="width: 400px;"></s-option>
                </s-select>
              </s-form-item>
            </s-row>
            <s-row>
              <s-table-page
                :data="paramList"
                style="width: 100%">
                <s-table-column
                  prop="scriptName"
                  label="脚本名称">
                </s-table-column>
                <s-table-column
                  prop="scriptFileSuffix"
                  label="脚本类型"
                  width="120">
                </s-table-column>
                <s-table-column
                  label="脚本参数">
                  <template slot-scope="scope">
                    <s-input placeholder="请输入脚本参数" v-model="scope.row.scriptParam"></s-input>
                  </template>
                </s-table-column>
                <s-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <i class="iconfont icon-delete" title="删除" @click="deleteScipt(scope.row.uuid)"></i>
                  </template>
                </s-table-column>
              </s-table-page>
            </s-row>
            <s-row>
              <s-form-item label="超时时间" class="scriptParamsForm1" prop="timeOut">
                <s-input v-model="form.timeOut" placeholder="秒，请输入正整数"></s-input>
              </s-form-item>
            </s-row>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="选择资产" name="2">
          <span style="margin-right: 12px;">分组名称</span>
          <input-tree v-model="groupName" :data="firstGroupList" :props="myHostProps" @select-change="getHostData" name="uuid"></input-tree>
          <div class="inputWrap" style="position: relative;">
            <s-input v-model="assetsSearchKey" @keyup.enter.native="getData" placeholder="请输入内容" class="real-search-input"></s-input>
            <span class="realPageSearch"><i class="iconfont icon-magnifier" @click="getData"></i></span>
          </div>
          <RealPageTable :ajax-obj="ajaxObj"
                         @selection-change="handleSelectionChange"
                         :showHeaderCheckbox="true">
            <s-table-column type="selection" width="45"></s-table-column>  <!--:selectable="getDisabled"-->
            <s-table-column prop="itcompname" label="主机名称"></s-table-column>
              <!--<template slot-scope="scope">-->
                <!--<span class="cellClick" @click="goToHostDetail(scope.row.uuid)">{{scope.row.itcompname}}</span>-->
              <!--</template>-->
            <s-table-column prop="controladderss" label="IP"></s-table-column>
            <s-table-column prop="productname" label="操作系统"></s-table-column>
          </RealPageTable>
        </s-collapse-item>
      </s-collapse>
    </s-scrollbar>
    <div style="text-align: right; margin-top: 40px">
      <!--已选主机 <span>{{assetsAccount}}</span> 台-->
      <s-button @click="executeScript">脚本执行</s-button>
      <s-button @click="cancelRun" type="cancel">取消</s-button>
    </div>
    <s-dialog
    v-model="scriptExeDialog"
    v-if="scriptExeDialog"
    title="脚本执行"
    append-to-body
    width="850px">
    <script-execute ref="scriptexecute" :executeResult="scriptExeParam" :multipleSelectionHost="multipleSelection"></script-execute>
  </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  // import Bus from '@/plugins/eventBus';
  import ScriptExecute from './ScriptExecute';
  import filterMixin from './FilterMixin';
  // import {sTimeLine, sTimeLineItem} from '@/components/timeline'
  import InputTree from '@/components/inputTree/InputTree'
  import {cloneDeep} from 'lodash';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  // 校验正整数
  let checkInt = (rule, value, callback) => {
    if (value || value === 0) {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正整数值'));
      } else {
        callback();
      }
    } else {
      callback(new Error('不能为空'));
    }
  };
  export default {
    mixins: [filterMixin],
    components: {
      // Bus,
      ScriptExecute,
      // sTimeLine,
      // sTimeLineItem,
      InputTree,
      RealPageTable
    },
    data () {
      return {
        form: {
          scriptLibUuid: '',
          scriptUuid: [],
          timeOut: '',
          scriptParamList: '',
          scriptParam: ''
        },
        formRules: {
          scriptLibUuid: [{required: true, message: '不能为空', blur: 'trigger'}],
          scriptUuid: [{type: 'array', required: true, message: '不能为空', trigger: 'change'}],
          timeOut: [
            {required: true, message: '不能为空', blur: 'trigger'},
            {validator: checkInt, trigger: 'blur'}
          ]
        },
        assetsAccount: 0,
        groupName: '',
        assetUuidList: [],
        scriptLibraryList: [],
        scriptList: [],
        paramList: [],
        scriptByUuid: [],
        firstGroupList: [],
        scriptExeDialog: false,
        multipleSelection: [],
        myProps: {
          children: 'childrenList',
          label: 'name',
          value: 'uuid'
        },
        myHostProps: {
          children: 'childrenList',
          label: 'name'
        },
        activeName: '1',
        assetsSearchKey: '',
        ajaxObj: {
          type: 'post',
          url: '/autoMateItcomp/getCanAutoMateItcompInfo',
          params: {
            condition: {
            }
          }
        },
        firstGroupUuid: '',
        secondGroupUuid: '',
        scriptExeParam: {} // 脚本执行弹框参数
      }
    },
    mounted() {
      this.getData()
      window.addEventListener('resize', this.initDivHeight);
    },
    destroyed() {
      window.removeEventListener('resize', this.initDivHeight);
    },
    created() {
      this.init()
    },
    methods: {
      changeOwnType(val) { // 所选的脚本uuid
        this.scriptByUuid = val
        this.getScriptByUuid(this.scriptByUuid)
      },
      getScriptByUuid(uuid) {
        $axios.post('/scriptConsole/getScriptByUuidList', uuid).then(res => {
          this.paramList = res.data
        })
      },
      deleteScipt(uuid) { // 删除参数
        this.$confirm('确认删除吗?', '忽略', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i in this.paramList) {
            if (this.paramList[i].uuid === uuid) {
              this.paramList.splice(i, 1)
              this.form.scriptUuid.splice(i, 1)
            }
          }
        }).catch(() => {});
      },
      initDivHeight () {
      },
      getDisabled() {
        return this.disbledHost
      },
      // 路由跳转至主机详情
      goToHostDetail(uuid) {
        this.$router.push({path: '/AutoOpsCenter/hostList/hostDetail', query: {uuid}})
      },
      goto(path) {
        this.$router.push(path)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.assetsAccount = this.multipleSelection.length
      },
      getHostData(nodeData) {
        if (nodeData.parent === '' || nodeData.parent === null) {
          this.firstGroupUuid = nodeData.uuid
          this.secondGroupUuid = ''
        } else {
          this.firstGroupUuid = ''
          this.secondGroupUuid = nodeData.uuid
        }
        this.getData()
      },
      getData() {
        let params = {
          searchStr: this.assetsSearchKey,
          firstGroupUuid: this.firstGroupUuid,
          secondGroupUuid: this.secondGroupUuid
        }
        this.ajaxObj.params.condition = cloneDeep(params);
      },
      getFirstGroup() {
        $axios.get(`/autoMateItcomp/getAutoMGTreeNodeList`).then((res) => {
          if (res.data instanceof Array && res.data.length > 0) {
            this.firstGroupList = res.data
            // this.groupName = this.firstGroupList[0].parentUuid
          }
        })
      },
      executeScriptDialog: function() {
        $axios.post(`/immediateExcuteTask/startImmediateExcuteScriptTask`, this.scriptExeParam, {
          data: [],
          logTemplate: '执行|单次任务>执行脚本'
        }).then((res) => {
          if (res.data && res.data.status === true && res.data.autoMateTaskInfo instanceof Array) {
            // this.scriptExeDialog = true
            // this.$nextTick(() => {
            //   res.data.autoMateTaskInfo.forEach(item => {
            //     this.$refs.scriptexecute.getAutoScriptTask(item)
            //     this.$refs['form'].resetFields() // 重置表单
            //   })
            // })
            this.$confirm('脚本执行需要一段时间，请在任务结束后查看结果详情', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
              this.cancelRun()
            }).catch(() => {});
          } else {
            this.$message({message: res.data.errorMsg, type: 'error'})
          }
        })
      },
      executeScript() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.multipleSelection.length > 0) {
              // this.scriptExeDialog = true
              let assetUuidList = this.multipleSelection.map((item) => {
                return item.uuid
              })
              let scriptUuidList = []
              this.paramList.map(item => {
                scriptUuidList.push({
                  scriptUuid: item.uuid,
                  scriptParam: item.scriptParam
                })
              })
              this.scriptExeParam = {
                assetUuidList,
                scriptLibUuid: this.form.scriptLibUuid,
                scriptUuidList: scriptUuidList,
                timeOut: Number(this.form.timeOut)
              }
              this.executeScriptDialog()
            } else {
              this.activeName = '2'
              this.$message({message: '请先选择一个主机！', type: 'warning'});
            }
          } else {
            this.activeName = '1'
            this.$message({message: '请按要求填写！', type: 'warning'});
          }
        })
      },
      cancelRun() {
        this.$emit('cancelRun')
      },
      // 所有脚本库列表
      getScriptLibList() {
        $axios.get('/scriptConsole/scriptLibTreeNode').then((res) => {
          if (res.data) {
            this.scriptLibraryList = res.data
          } else {
            return false
          }
        })
      },
      // 脚本库对应的所有脚本
      getScriptList() {
        $axios.get(`/scriptConsole/getScriptByLibUuid/${this.form.scriptLibUuid}`).then((res) => {
          this.form.scriptUuid = []
          if (res.data instanceof Array) {
            this.scriptList = res.data
            if (this.scriptList.length > 0) {
              this.form.scriptUuid.push(this.scriptList[0].uuid)
            }
            this.changeOwnType(this.form.scriptUuid)
          } else {
            return false
          }
        })
      },
      init() {
        this.getScriptLibList()
        this.getFirstGroup()
      }
    },
    watch: {
    }
  }
</script>

<style scoped>

</style>
