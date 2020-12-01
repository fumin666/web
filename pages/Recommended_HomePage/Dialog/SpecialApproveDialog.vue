<template>
  <s-tab style="height: 400px;">
    <s-tab-pane label="工单审批">
      <s-form :label-position="labelPosition" label-width="130px">
        <s-form-item label="审批结果：">
          <s-select v-model="addForm.applyStatus" placeholder="请选择" style="width:90%">
            <s-option v-for="(item, index) in AuditMapSelectSerialize(model.specialApplyAuditMap)" :label="item.label" :key="index" :value="item.value">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="审批意见：">
          <s-input type="textarea" v-model="order.auditOpinion" style="width:90%"  :rows="6" :maxlength="120" placeholder="最大长度为 120 个字符"></s-input>
        </s-form-item>
      </s-form>
    </s-tab-pane>
    <s-tab-pane label="审批详情">
      <s-table-page :data='addForm.approveDetials' >
        <s-table-column
          prop="approvalTime"
          label="审批时间">
        </s-table-column>
        <s-table-column
          prop="approvalUserName"
          label="审批人">
        </s-table-column>
        <s-table-column
          prop="applyStatus"
          label="审批状态">
        </s-table-column>
        <s-table-column
          prop="approvalComments"
          label="审批意见">
        </s-table-column>
      </s-table-page>
    </s-tab-pane>
    <s-tab-pane label="工单信息">
      <s-scrollbar wrap-style="height:370px;">
        <s-form ref="addSpecialForm" :rules="rules" :model="addForm" label-width="80px">
          <s-form-item label="标题" prop="specialoperName">
            <p>{{addForm.specialoperName}}</p>
          </s-form-item>
          <s-form-item label="运维类型" prop="specialoperTypeUuid">
            <p>{{addForm.specialoperTypeUuid}}</p>
          </s-form-item>
          <s-form-item label="开始时间" prop="startTimeStr">
            <p>{{addForm.startTimeStr}}</p>
          </s-form-item>
          <s-form-item label="结束时间" prop="endTimeStr">
            <p>{{addForm.endTimeStr}}</p>
          </s-form-item>
          <s-form-item label="申请理由" prop="specialoperCont">
            <p style="width:98%;overflow: hidden;word-wrap: break-word;">{{addForm.specialoperCont}}</p>
          </s-form-item>
          <s-form-item label="选择资产" prop="scriptDir" class="apply-special-table">
            <s-table-page ref="hostList" :data='hostList'   :pagination-def="getPaginationDef()" :header-search='getNewSearchDef()' @selection-change="handleSelectionChange" style="width:98%">
              <s-table-column
                type="selection"
                width="45">
              </s-table-column>
              <s-table-column prop="device_account" label="账号">
              </s-table-column>
              <s-table-column prop="device_name" label="名称">
              </s-table-column>
              <s-table-column prop="device_ip" label="IP地址" width="160">
              </s-table-column>
              <s-table-column prop="device_port" label="端口" show-overflow-tooltip>
              </s-table-column>
              <s-table-column prop="device_protocol" label="协议" show-overflow-tooltip>
              </s-table-column>
              <s-table-column prop="clipboardName" label="剪贴板" show-overflow-tooltip>
              </s-table-column>
              <s-table-column prop="diskMapping" label="磁盘映射" show-overflow-tooltip>
              </s-table-column>
            </s-table-page>
          </s-form-item>
          <s-form-item v-show="cmdShow" label="选择命令" prop="scriptDir" class="apply-special-table">
            <s-table-page ref="cmdList" :data='cmdList'   :pagination-def="getPaginationDef()" :header-search='getNewSearchDef1()' @selection-change="handleCmdChange" style="width:98%">
              <s-table-column
                type="selection"
                width="45">
              </s-table-column>
              <s-table-column prop="accountName" label="账号">
              </s-table-column>
              <s-table-column prop="deviceIp" label="IP地址" width="160">
              </s-table-column>
              <s-table-column prop="commandname" label="命令">
              </s-table-column>
              <s-table-column prop="commandParam" label="参数">
              </s-table-column>
              <s-table-column prop="commandtypeName" label="匹配类型">
              </s-table-column>
              <s-table-column prop="commandBwTypeName" label="命令类型">
              </s-table-column>
            </s-table-page>
          </s-form-item>
          <s-form-item label="附件">
            <s-table ref="documentsTable" :data="fileList" style="width:98%;margin-top:20px;">
              <!-- <s-table-column type="selection" width="45">
              </s-table-column> -->
              <s-table-column prop="fileName" label="文档名称">
                <template slot-scope="scope">
                  <a @click="downloadHandler(scope.row.uuid)" style="color:#1675cb;cursor: pointer;">{{scope.row.fileName}}</a>
                </template>
              </s-table-column>
              <s-table-column prop="userName" label="创建人">
              </s-table-column>
              <s-table-column prop="creatTimeStr" label="创建时间">
              </s-table-column>
            </s-table>
          </s-form-item>
        </s-form>
      </s-scrollbar>
    </s-tab-pane>
  </s-tab>
</template>

<script type="text/babel">
  import {Download} from 'sunflower-common-utils'

  export default {
    props: ['model', 'tableRowData'],
    data() {
      let _this = this
      return {
        addForm: {
          applyUuid: _this.tableRowData.applyUuid, // 特殊运维申请清单
          applyCommandUuidList: [], // 命令列表
          applyResourceUuidList: [], // 资产列表
          applyStatus: '', // 0-未审批，1-审批通过，2-审批拒绝，3-审批拟通过，4-审批拟拒绝
          approvalUuid: _this.tableRowData.approvalUuid, // 待审批单uuid
          approvalType: _this.tableRowData.approvalType, // 待审批单类型
          comments: '', // 审批意见
          poxyUuid: _this.tableRowData.poxyUuid, // 代理信息的uud,当为代理审批的时候，需要回传此参数
          taskId: '',
          audit1: null,
          audit1Ch: null,
          specialoperName: _this.model.summary,
          specialoperTypeUuid: _this.model.property,
          specialoperCont: _this.model.applyReason,
          startTimeStr: _this.model.startTime,
          endTimeStr: _this.model.endTime,
          relresourceList: [],
          relfileList: [],
          relcommandList: [],
          approveDetials: _this.model.auditDetailList
        },
        order: {
          audit1: '',
          auditOpinion: ''
        },
        labelPosition: 'left',
        fileList: _this.model.relfileList,
        opsType: [],
        hostList: [],
        cmdList: [],
        cmdShow: true,
        rules: {
          specialoperName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          startTimeStr: [
            { required: true, message: '请选择正确日期', trigger: 'change' }
          ],
          endTimeStr: [
            { required: true, message: '请选择正确日期', trigger: 'change' }
          ]
        },
        TrueFalse: [{ label: '通过', value: 1 }, { label: '拒绝', value: 2 }, { label: '拟通过', value: 3 }, { label: '拟拒绝', value: 4 }]
      }
    },

    watch: {
      'addForm.applyStatus'(val) {
        if (val === null) {
          return
        }
        let arr = this.AuditMapSelectSerialize(this.model.specialApplyAuditMap);
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].value === val) {
            this.order.audit1 = arr[i].label
            this.addForm.audit1Ch = arr[i].label
          }
        }
      }
    },
    mounted() {
      console.log(this.model);
      this.hostList = this.model.relresourceList;
      this.cmdList = this.model.relcommandList;
      this.$nextTick(() => {
        this.hostListSelect(this.model.relresourceList);
        this.cmdListSelect(this.model.relcommandList);
      })
    },
    methods: {
      downloadHandler(uuid) {
        this.$confirm('确定下载？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
          Download(`/specialOperationApply/downLoadApplyFile/${uuid}`)
        }).catch(() => {});
      },
      hostListSelect(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.hostList.toggleRowSelection(row);
          });
        } else {
          this.$refs.hostList.clearSelection();
        }
      },
      cmdListSelect(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.cmdList.toggleRowSelection(row);
          });
        } else {
          this.$refs.cmdList.clearSelection();
        }
      },
      getPaginationDef() {
        return {
          layout: 'prev, pager, next'
        }
      },
      getNewSearchDef() {
        return {
          width: 6,
          placeholder: '查询条件',
          searchProps: ['device_account', 'device_name', 'device_ip', 'device_port', 'device_protocol', 'clipboard', 'diskMapping']
        }
      },
      getNewSearchDef1() {
        return {
          width: 6,
          placeholder: '查询条件',
          searchProps: ['accountName', 'deviceIp', 'commandname', 'commandParam', 'commandtypeName', 'commandBwType']
        }
      },
      beforeUpload(file) {
        if (this.addForm.relfileList.length === 5) {
          this.$message({ message: '最多只能上传五个附件', type: 'error' });
          this.$refs.upload.uploadFiles.pop();
          return false
        }
        if (file.size > (50 * 1048576)) {
          this.$message({ message: '附件大小不能超过50M', type: 'error' });
          this.$refs.upload.uploadFiles.pop();
          return false
        }
      },
      uploadSuccess(res) {
        this.addForm.relfileList.push(res.success[0])
      },
      handleSelectionChange(val) {
        let arr = [];
        val.forEach(row => {
          arr.push(row.uuid)
        })
        this.addForm.applyResourceUuidList = arr;
      },
      handleCmdChange(val) {
        let arr = [];
        val.forEach(row => {
          arr.push(row.uuid)
        })
        this.addForm.applyCommandUuidList = arr;
      },
      showCmd(val) {
        let vm = this
        for (let item of vm.opsType) {
          if (item.uuid === val) {
            if (item.specialoperCategory === 0) {
              vm.$nextTick(() => {
                vm.cmdShow = false
              })
            } else {
              vm.$nextTick(() => {
                vm.cmdShow = true
              })
            }
          }
        }
      },
      getBeginTime(val) {
        this.addForm.startTimeStr = val
      },
      getEndTime(val) {
        this.addForm.endTimeStr = val
      },
      changeFile(file) {
        this.addForm.myfile = file
      },
      selectSerialize(data) {
        let arr = []
        let labelArr = [];
        let valueArr = [];
        for (let item in data) {
          labelArr.push(item)
        }
        for (let i = 0; i < labelArr.length; i++) {
          valueArr.push(data[labelArr[i]])
        }
        for (let j = 0; j < labelArr.length; j++) {
          arr.push({
            value: valueArr[j],
            label: labelArr[j]
          })
        }
        return arr
      },
      AuditMapSelectSerialize(data) {
        let arr = []
        let labelArr = [];
        let valueArr = [];
        for (let item in data) {
          labelArr.push(item)
        }
        for (let i = 0; i < labelArr.length; i++) {
          valueArr.push(data[labelArr[i]])
        }
        for (let j = 0; j < labelArr.length; j++) {
          arr.push({
            value: valueArr[j],
            label: labelArr[j]
          })
        }
        arr = arr.sort(this.keysrt('value', false))
        return arr
      },
      keysrt(key, desc) {
        return function (a, b) {
          return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
      },
      commentsSerialize(data) {
        switch (data) {
          case 'auditOpinion':
            data = '审批意见';
            break;
          case 'audit1':
            data = '审批结果';
            break;
          default:
            data = ''
        }
        return data;
      },
      submitFormSerialize(data) {
        let strArr = this.selectSerialize(data);
        let arr = [];
        for (let i = 0; i < strArr.length; i++) {
          if (strArr[i].value !== '') {
            arr.push(this.commentsSerialize(strArr[i].label) + '#' + strArr[i].value)
          }
        }
        return arr
      }
    },
    beforeUpdate() {
      this.addForm.comments = this.order.auditOpinion
      this.$emit('submitForm', this.addForm)
    }
  }
</script>
