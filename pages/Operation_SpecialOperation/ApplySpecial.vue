<template>
  <s-scrollbar class="addSpecialFormClass" wrap-style="padding-right: 10px; max-height: 600px;" @onScroll="hideSelect">
    <s-form ref="addSpecialForm" :rules="rules" :model="addForm" label-width="120px">
      <s-form-item label="标题" prop="specialoperName">
        <s-input v-model="addForm.specialoperName"></s-input>
      </s-form-item>
      <s-form-item label="运维类型" prop="specialoperTypeUuid">
        <s-select v-model="addForm.specialoperTypeUuid" @change="showCmd" ref="hideSelect">
          <s-option v-for="item in opsType" :key="item.id" :label="item.specialoperTypeName" :value="item.uuid" ></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="开始时间" prop="startTimeStr">
        <s-date-picker :editable="false" type="datetime" placeholder="选择日期" v-model="addForm.startTimeStr" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" @change="getStartTime"></s-date-picker>
      </s-form-item>
      <s-form-item label="结束时间" prop="endTimeStr">
        <s-date-picker :editable="false" type="datetime" placeholder="选择日期" v-model="addForm.endTimeStr" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" @change="getEndTime"></s-date-picker>
      </s-form-item>
      <s-form-item label="申请理由" prop="specialoperCont">
        <s-input type="textarea" v-model="addForm.specialoperCont" :maxlength="120" :rows="5" placeholder="最多可输入120字" ></s-input>
      </s-form-item>
      <s-form-item label="选择资产" prop="scriptDir" class="apply-special-table scriptDirx is-required">
        <div class="input-search fr" style="width: 280px; margin-bottom: 10px">
          <s-input placeholder="请输入内容" v-model="searchKeyAsset" class="real-search-input"
                   @keyup.enter.native="getHostList"></s-input>
          <i class="iconfont icon-magnifier search-btn" @click="getHostList"></i>
        </div>
        <RealPageTable :ajax-obj="ajaxObjAsset"
                       :showHeaderCheckbox="true"
                       @selection-change="selectAsset" @successFun="successFunx">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="itcompName"
            label="名称"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            width="160">
          </s-table-column>
          <s-table-column
            prop="itcompPort"
            label="端口">
          </s-table-column>
          <s-table-column
            prop="protocolName"
            label="协议"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="clipboard"
            label="剪贴板"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="disk_mapping"
            label="磁盘映射"
            show-overflow-tooltip>
          </s-table-column>
        </RealPageTable>
      </s-form-item>
      <s-form-item v-show="cmdShow" label="选择命令" prop="scriptDir" class="apply-special-table scriptDiry">
        <s-table-page :data='cmdList'
                      ref="cmdList"
                      @successFun="successFuny"
                      :pagination-def="getPaginationDef()"
                      :header-search='getNewSearchDef1()'
                      @selection-change="handleCmdChange">
          <s-table-column
            type="selection"
            width="45">
          </s-table-column>
          <s-table-column
            prop="accountName"
            label="账号"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="controlAdderss"
            label="IP地址"
            width="160">
          </s-table-column>
          <s-table-column
            prop="commandname"
            label="命令">
          </s-table-column>
          <s-table-column
            prop="commandparam"
            label="参数"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="commandinfoTypeName"
            label="匹配类型"
            show-overflow-tooltip>
          </s-table-column>
          <s-table-column
            prop="commandtypeName"
            label="命令类型"
            show-overflow-tooltip>
          </s-table-column>
        </s-table-page>
      </s-form-item>
      <s-form-item label="上传附件">
        <s-upload
          ref="upload"
          :action="upLoadUrl"
          :auto-upload="false"
          :on-success="uploadSuccess"
          :on-change="handleChange">
          <s-button>上传附件</s-button>
        </s-upload>
      </s-form-item>
    </s-form>
  </s-scrollbar>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  export default {
    components: {
      RealPageTable
    },
    data() {
      return {
        isFirst: true,
        upLoadUrl: '',
        uploadSuccessMark: false,
        addForm: {
          specialoperName: '',
          specialoperTypeUuid: '',
          specialoperCont: '',
          startTimeStr: '',
          endTimeStr: '',
          relresourceList: [],
          relfileList: [],
          relcommandList: []
        },
        selectionsCommand: [], // 勾选的命令
        fileNum: 0,
        fileList: [],
        opsType: [],
        hostList: [],
        cmdList: [],
        cmdShow: true,
        searchKeyAsset: '',
        ajaxObjAsset: {
          type: 'post',
          url: '/specialOperationApply/getWebDeviceInfo',
          checkedUuidArr: [],
          params: {
            condition: {
            }
          }
        },
        selectionsAsset: [],
        rules: {
          specialoperName: [
            {required: true, message: '请输入名称', trigger: 'blur'},
            {
              pattern: /^[\w\u4e00-\u9fa5\.\-]{1,30}$/,
              message: '名称为中文、字母、数字、及符号[_-.]组合，且长度不超过30个字符',
              trigger: 'blur'
            }
          ],
          startTimeStr: [
            { required: true, message: '请选择正确日期', trigger: 'change' }
          ],
          endTimeStr: [
            { required: true, message: '请选择正确日期', trigger: 'change' }
          ],
          specialoperCont: [
            { max: 120, message: '最大长度为120个字符', trigger: 'blur' }
          ]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() <= Date.now() - 24 * 60 * 60 * 1000
          }
        }
      }
    },

    created() {
      this.upLoadUrl = $axios.basePath() + '/specialOperationApply/uploadSpecialApplyFile'
      this.getSpecialApplySelect()
      this.$nextTick(() => {
        this.getHostList()
      });
    },
    methods: {
      successFunx() {
        if (this.isFirst) {
          this.isFirst = false;
          return;
        }
        this.$nextTick(() => {
          document.querySelector('.addSpecialFormClass>.s-scrollbar-wrap').scrollTop = document.querySelector('.scriptDirx').offsetTop
        })
      },
      successFuny() {
        if (this.isFirst) {
          this.isFirst = false;
          return;
        }
        this.$nextTick(() => {
          document.querySelector('.addSpecialFormClass>.s-scrollbar-wrap').scrollTop = document.querySelector('.scriptDiry').offsetTop
        })
      },
      getStartTime(val) {
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.addForm.endTimeStr.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.addForm.startTimeStr = '';
          this.$message('开始日期不能大于结束日期！');
          return false;
        } else {
          this.addForm.startTimeStr = val;
        }
      },
      getEndTime(val) {
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.addForm.startTimeStr.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.addForm.endTimeStr = '';
          this.$message('开始日期不能大于结束日期！');
          return false;
        } else {
          this.addForm.endTimeStr = val;
        }
      },
      uploadSuccess(res) {
        this.uploadSuccessMark = true
        this.fileNum ++
        if (res.success !== undefined) {
          this.addForm.relfileList.push(res.success[0])
        }
        if (this.fileNum === this.fileList.length) {
          this.fileNum = 0
          this.$emit('saveApp');
        }
      },
      getPaginationDef() {
        return {
          layout: 'prev, pager, next'
        }
      },
      selectAsset(val) {
        let vm = this;
        vm.selectionsAsset = val
        let uuids = []
        let newObj
        vm.cmdList = []
        vm.addForm.relresourceList = []
        for (let v of vm.selectionsAsset) {
          uuids.push(v.accountUuid)
          newObj = {
            accountUuid: v.accountUuid,
            deviceUuid: v.itcompUuid,
            portUuid: v.portUuid,
            maintainedDeviceUuid: v.uuid
          }
          vm.addForm.relresourceList.push(newObj)
        }
        $axios.post('/specialOperationApply/getSpecialCommondinfo', uuids).then((res) => {
          vm.cmdList = res.data
          let filterCmd = []
          vm.cmdList.forEach(v => {
            vm.selectionsCommand.forEach(m => {
              if (v.uuid === m.uuid) {
                filterCmd.push(v)
              }
            })
          })
          vm.selectionsCommand = filterCmd;
          vm.$nextTick(() => {
            vm.cmdList.forEach(item => {
              vm.selectionsCommand.forEach(selItem => {
                if (selItem.uuid === item.uuid) {
                  vm.$refs.cmdList.toggleRowSelection(item);
                }
              })
            });
          })
        })
      },
      handleCmdChange(val) {
        if (val.length !== 0) {
          this.selectionsCommand.push(...val)
          this.selectionsCommand = this.selectionsCommand.reduce( // 去重
            (all, next) => all.some((atom) => atom['uuid'] === next['uuid']) ? all : [...all, next], []);
        }
      },
      getHostList() {
        let params = {
          content: this.searchKeyAsset
        }
        this.ajaxObjAsset.params.condition = params;
        this.ajaxObjAsset.checkedUuidArr = this.selectionsAsset
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
      getSpecialApplySelect() {
        $axios.get('/specialOperationApply/getSpecialApplySelect').then((res) => {
          let typeList = res.data.specialOperCommonSettings.specialoperTypelist
          this.opsType = typeList
          this.addForm.specialoperTypeUuid = typeList[0].uuid
          for (let v of typeList) {
            if (v.defaultType === 1) {
              this.addForm.specialoperTypeUuid = v.uuid
            }
          }
        })
      },
      changeFile(file) {
        this.addForm.myfile = file
      },
      handleChange(file, fileList) {
        let fileTypes = ['asp', 'php', 'jsp', 'exe']
        let type = file.name.split('.').pop();
        let message = `不能上传asp、php、jsp、exe类型的文件`;
        if (file.size > (50 * 1048576)) {
          this.$message({message: '大小不能超过50M', type: 'error'});
          fileList.pop();
        }
        if (fileTypes.indexOf(type) !== -1) {
          this.$message({
            type: 'error',
            message: message
          });
          fileList.pop();
        }
        this.fileList = fileList
      },
      hideSelect() {
        this.$refs['hideSelect'].visible = false
      },
      getNewSearchDef1() {
        return {
          width: 6,
          placeholder: '查询条件',
          searchProps: ['accountName', 'controlAdderss', 'commandname', 'commandparam', 'commandinfoTypeName', 'commandtypeName']
        }
      }
    }
  }
</script>
