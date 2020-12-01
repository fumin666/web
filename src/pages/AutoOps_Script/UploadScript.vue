<template>
  <div>
    <s-scrollbar wrap-style="max-height: 520px;">
      <s-form :inline="true" :model="uploadForm" :rules="uploadFormRules" ref="uploadForm">
        <s-row type="flex" justify="between">
          <s-col :span="12">
            <s-form-item label="选择文件" class="FormLine1" prop="fileName">
              <s-input v-model="uploadForm.fileName" placeholder="请选择文件" style="width: 224px;" disabled></s-input>
            </s-form-item>
          </s-col>
          <s-col :span="12">
            <s-form-item label="">
              <s-upload class="upload"
                        ref="upload"
                        :action="uploadUrl"
                        multiple
                        :on-success="uploadSuccess"
                        :on-remove="uploadRemove"
                        :before-upload="beforeUpload"
                        :file-list="shareFileInfoList"
                        :with-credentials="true"
                        :show-file-list="false">
                <s-button slot="trigger" icon="upload-pic">上传文件</s-button>
              </s-upload>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row>
          <s-col :span="12">
            <s-form-item label="目标路径" class="FormLine2" prop="destPath" tip="windows路径示例：c:\folder\   Linux示例：/c/folder/">
              <s-input  v-model="uploadForm.destPath" @keyup.enter.native="filterList" @blur="filterList" placeholder="请填写文件分发目标路径" style="width: 224px;"></s-input>
            </s-form-item>
          </s-col>
          <s-col :span="12">
            <s-form-item label="文件重名" style="margin-right: 50px" prop="isCover">
              <s-checkbox v-model="uploadForm.isCover">忽略</s-checkbox>
            </s-form-item>
            <s-form-item label="路径不存在" prop="isCreateDir">
              <s-checkbox v-model="uploadForm.isCreateDir">创建</s-checkbox>
            </s-form-item>
          </s-col>
        </s-row>
        <s-row><s-form-item label="选择资产"></s-form-item></s-row>
        <s-form-item label="分组名称">
          <input-tree v-model="groupName" :data="firstGroupList" :props="myHostProps" @select-change="getHostData" name="uuid"></input-tree>
        </s-form-item>
      </s-form>
      <div class="inputWrap" style="position: relative;">
        <s-input v-model="assetsSearchKey" @keyup.enter.native="getData" placeholder="请输入内容" class="real-search-input"></s-input>
        <span class="realPageSearch" style="padding-top: 5px;box-sizing: border-box;"><i class="iconfont icon-magnifier" @click="getData"></i></span>
      </div>
      <RealPageTable :ajax-obj="ajaxObj"
                     @selection-change="handleSelectionChange"
                     :showHeaderCheckbox="true">
        <s-table-column type="selection" width="45"></s-table-column>
        <s-table-column label="主机名称" prop="itcompname">
          <!--<template slot-scope="scope">-->
            <!--<span class="cellClick" @click="goToHostDetail(scope.row.uuid)">{{scope.row.itcompname}}</span>-->
          <!--</template>-->
        </s-table-column>
        <s-table-column prop="controladderss" label="IP"></s-table-column>
        <s-table-column prop="productname" label="操作系统"></s-table-column>
      </RealPageTable>
    </s-scrollbar>
    <div style="text-align: right; margin-top: 40px">
      <!--已选主机 <span>{{assetsAccount}}</span> 台-->
      <s-button @click="executeShare">执行分发</s-button>
      <s-button @click="cancelRun" type="cancel">取消</s-button>
    </div>
    <s-dialog
      v-model="scriptExeDialog"
      v-if="scriptExeDialog"
      title="脚本上传与分发执行结果详情"
      width="650px">
      <share-execute ref="scriptexecute" :executeResult="ExeParam" :multipleSelectionHost="multipleSelection" @changeHistory="getHistoryList"></share-execute>
    </s-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus';
  import shareExecute from './ShareExecute.vue'
  // import {sTimeLine, sTimeLineItem} from '@/components/timeline'
  import InputTree from '@/components/inputTree/InputTree'
  import {cloneDeep} from 'lodash';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
    export default {
      components: {
        // Bus,
        shareExecute,
        // sTimeLine,
        // sTimeLineItem,
        InputTree,
        RealPageTable
      },
      data () {
        return {
          uploadForm: {
            fileName: '',
            destPath: '',
            selectAsset: '',
            isCover: 0,
            isCreateDir: 0
          },
          uploadFormRules: {
            destPath: [{required: true, message: '不能为空', blur: 'trigger'}],
            fileName: [{required: true, message: '请至少选择一个文件', blur: 'trigger'}],
            selectAsset: [{required: true, message: '请至少选择一个主机', blur: 'trigger'}]
          },
          myProps: {
            children: 'childrenList',
            label: 'name',
            value: 'uuid'
          },
          myHostProps: {
            children: 'childrenList',
            label: 'name'
          },
          firstGroupUuid: '',
          secondGroupUuid: '',
          assetsAccount: 0,
          scriptExeDialog: false,
          updataFlag: false,
          ExeParam: [],
          groupName: '',
          firstGroupList: [],
          shareFileInfoList: [],
          assetUuidList: [],
          multipleSelection: [],
          historyList: [],
          assetsSearchKey: '',
          ajaxObj: {
            type: 'post',
            url: '/autoMateItcomp/getCanAutoMateItcompInfo',
            params: {
              condition: {
              }
            }
          },
          treeScrollHeight: 500
        }
      },
      computed: {
        uploadUrl() {
          return `${$axios.basePath()}/fileUpload//uploadAutoMateShareFile`
        }
      },
      mounted() {
        this.getData()
        this.initDivHeight();
        window.addEventListener('resize', this.initDivHeight);
      },
      destroyed() {
        window.removeEventListener('resize', this.initDivHeight);
      },
      methods: {
        initDivHeight () {
        },
        // 路由跳转至主机详情
        goToHostDetail(uuid) {
          this.$router.push({path: '/AutoOpsCenter/hostList/hostDetail', query: {uuid}})
        },
        goto(path) {
          this.$router.push(path)
        },
        // 根据输入的参数过滤主机数据
        filterList() {
          this.$nextTick(() => {
            // let winReg = /^[a-zA-Z]:(\\\\[\w]+)+$/ // 验证是否是windows路径的正则
            let winReg = /^[a-zA-Z]:[\\/]((?! )(?![^\\/]*\s+[\\/])[\w -]+[\\/])*(?! )(?![^.]+\s+\.)[\w -]+\\$/ // 验证是否是windows路径的正则
            let linuxReg = /^(\/[\w -]+)*\/$/ // 验证是否是Linux路径的正则
            if (winReg.test(this.uploadForm.destPath.trim())) {
              this.updataFlag = true
              console.log(this.updataFlag)
              this.assetUuidList = this.assetUuidList.filter((item, index) => {
                return item.productname === 'Windows'
              })
            } else if (linuxReg.test(this.uploadForm.destPath.trim())) {
              this.updataFlag = true
              this.assetUuidList = this.assetUuidList.filter((item, index) => {
                return item.productname !== 'Windows'
              })
            } else {
              this.updataFlag = false
              this.$message.warning('请输入正确的目标路径！')
            }
          })
        },
        handleSelectionChange(val) {
          this.multipleSelection = val
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
        // 主机数据
        getData() {
          let params = {
            searchStr: this.assetsSearchKey,
            firstGroupUuid: this.firstGroupUuid,
            secondGroupUuid: this.secondGroupUuid
          }
          this.ajaxObj.params.condition = cloneDeep(params);
        },
        // 主机分组树
        getFirstGroup() {
          $axios.get(`/autoMateItcomp/getAutoMGTreeNodeList`).then((res) => {
            if (res.data instanceof Array && res.data.length > 0) {
              this.firstGroupList = res.data
              // this.groupName = this.firstGroupList[0].parentUuid
            }
          })
        },
        executeScript: function () {
          $axios.post(`/immediateExcuteTask/startImmediateExcuteFileShareTask`, this.ExeParam, {
            data: [],
            logTemplate: '执行|单次任务>脚本上传与分发'
          }).then((res) => {
            if (res.data.status === true) {
              this.$confirm('脚本分发需要一段时间，请在任务结束后查看结果详情', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              }).then(() => {
                this.cancelRun()
              }).catch(() => {});
              // this.scriptExeDialog = true
              this.$nextTick(() => {
                this.$refs.scriptexecute.getAutoScriptTask(res.data.autoMateTaskUuid)
              })
            } else {
              this.$message.error(res.data.errorMsg)
            }
          })
        },
        // 立即执行分发
        executeShare() {
          if (this.updataFlag) {
            this.$refs['uploadForm'].validate((valid) => {
              if (valid) {
                if (this.multipleSelection.length > 0) {
                  let assetUuidList = this.multipleSelection.map((item) => {
                    return item.uuid
                  })
                  let shareFileInfoList = this.shareFileInfoList.map((item) => {
                    return {
                      fileSourcePath: item.response.fileSourcePath,
                      fileName: item.name,
                      fileSize: item.size
                    }
                  })
                  this.ExeParam = Object.assign({}, this.uploadForm, {shareFileInfoList, assetUuidList})
                  this.ExeParam.isCover = Number(this.ExeParam.isCover) === 0 ? 1 : 0  // 传递数字
                  this.ExeParam.isCreateDir = Number(this.ExeParam.isCreateDir)
                  delete this.ExeParam['fileName']
                  this.executeScript()
                  this.$refs['uploadForm'].resetFields() // 重置表单
                  this.shareFileInfoList = [] // 清空所选文件
                  this.groupName = ''
                } else {
                  this.$message({message: '请先选择一个主机！', type: 'warning'});
                }
              }
            })
          } else {
            this.$message.warning('请输入正确的目标路径！')
          }
        },
        cancelRun() {
          this.$emit('cancelUpload')
        },
        // 上传文件
        uploadSuccess(res, file, fileList) {
          if (res.state === 'true') {
            this.shareFileInfoList = fileList
            this.uploadForm.fileName += `${file.name};`
          } else {
            this.$message({type: 'error', message: res.errormsg});
          }
        },
        beforeUpload(file) {
          if (file.name.indexOf(' ') > -1) {
            this.$message({type: 'error', message: `${file.name}上传失败，文件名不能包含空格！`})
            return false // 停止上传
          }
        },
        uploadRemove(file, fileList) {
          this.shareFileInfoList = fileList;
        },
        uploadError() {
          this.$message({type: 'error', message: '上传失败'});
        },
        // 历史记录
        getHistoryList() {
          $axios.get(`/automateLog/getCurrentUserFileShareTaskLog`).then((res) => {
            if (res.data && res.data instanceof Array) {
              this.historyList = res.data
            }
          })
        },
        // 通过bus更新历史记录
        updateHistory(history) {
          this.historyList.push(history)
        }
      },
      created() {
        this.getFirstGroup()
        this.getData()
        this.getHistoryList()
        Bus.$on('changeHistory', this.updateHistory);
      }
    }
</script>

<style scoped>

</style>
