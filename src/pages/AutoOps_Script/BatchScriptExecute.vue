<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-18 13:56:57
 * @LastEditTime: 2019-09-27 16:48:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section id="batchScriptExecute">
    <div>
      <s-form :inline="true" :model="scriptForm" ref="scriptForm" :rules="scriptFormRules" label-width="80px">
        <s-row>
          <s-form-item label="脚本库" prop="libName">
            <input-tree v-model="scriptForm.libName" :data="scriptLibraryList" :props="myProps" @select-change="getScriptList" style="width: 400px;" name="uuid"></input-tree>
          </s-form-item>
          <s-form-item label="脚本名称" prop="scriptName">
            <s-select v-model="scriptForm.scriptName" clearable style="width: 190px;">
              <s-option v-for="item in scriptList" :label="item.scriptName" :value="item.uuid"
                        :key="item.uuid" style="width: 260px;"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="超时时间" prop="timeOut">
            <s-input v-model="scriptForm.timeOut" placeholder="秒，请输入正整数"></s-input>
          </s-form-item>
        </s-row>
        <s-row>
          <s-col :span="24">
            <s-form-item label="脚本参数" prop="scriptParam" class="scriptParamsInput">
              <s-input v-model="scriptForm.scriptParam" placeholder="请输入脚本参数，多个参数请用空格隔开"></s-input>
            </s-form-item>
          </s-col>
        </s-row>
        <s-form-item label="分组名称" prop="groupName">
          <input-tree v-model="scriptForm.groupName" :data="firstGroupList" :props="myHostProps" @select-change="getHostData" name="uuid" style="width: 300px"></input-tree>
        </s-form-item>
      </s-form>
      <s-scrollbar wrap-style="height: 300px;">
        <div class="inputWrap" style="position: relative;">
          <s-input v-model="assetsSearchKey" @keyup.enter.native="getData" placeholder="请输入内容" class="real-search-input"></s-input>
          <span class="realPageSearch" style="padding-top: 5px;box-sizing: border-box;"><i class="iconfont icon-magnifier" @click="getData"></i></span>
        </div>
        <RealPageTable :ajax-obj="ajaxObj"
                       @selection-change="handleSelectionChange"
                       :showHeaderCheckbox="true">
          <s-table-column type="selection" width="45"></s-table-column>
          <s-table-column prop="itcompname" label="主机名称"></s-table-column>
          <s-table-column prop="controladderss" label="IP"></s-table-column>
          <s-table-column prop="productname" label="操作系统"></s-table-column>
        </RealPageTable>
      </s-scrollbar>
      <div style="text-align: center; margin: 10px 0">
        已选主机 <span>{{assetsAccount}}</span> 台
        <s-button @click="executeScript">脚本执行</s-button>
      </div>
    </div>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import filterMixin from './FilterMixin';

  import InputTree from '@/components/inputTree/InputTree'
  import RealPageTable from '@/components/tableCom/src/RealPageTable.vue'
  import { cloneDeep } from 'lodash';
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
  export default{
    mixins: [filterMixin],
    data() {
      return {
        scriptForm: {
          libName: '',
          scriptName: '',
          timeOut: '',
          scriptParam: '',
          groupName: ''
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
        scriptFormRules: {
          libName: [{required: true, message: '不能为空', blur: 'trigger'}],
          scriptName: [{required: true, message: '不能为空', blur: 'trigger'}],
          timeOut: [
            {required: true, message: '不能为空', blur: 'trigger'},
            {validator: checkInt, trigger: 'blur'}
          ]
        },
        assetsAccount: 0,
        activeName: '',
        scriptLibraryList: [],
        scriptList: [],
        firstGroupList: [],
        scriptData: [],
        ajaxObj: {
          type: 'post',
          url: '/autoMateItcomp/getCanAutoMateItcompInfo',
          params: {
            condition: {
            }
          }
        },
        assetsSearchKey: '',
        firstGroupUuid: '',
        secondGroupUuid: '',
        multipleSelection: []
      }
    },
    props: ['currentItem'],
    components: {

      InputTree,
      RealPageTable
    },
    methods: {
      executeScript() {
        this.$refs['scriptForm'].validate((valid) => {
          if (valid) {
            if (this.multipleSelection.length > 0) {
              let assetUuidList = this.multipleSelection.map((item) => {
                return item.uuid
              })
              let params = {
                assetUuidList,
                scriptLibUuid: this.currentItem.scriptLibUuid,
                scriptUuid: this.currentItem.uuid,
                scriptParam: this.scriptForm.scriptParam,
                timeOut: Number(this.scriptForm.timeOut)
              }
              this.$emit('ExcuteScripDialog', params, this.multipleSelection)
            } else {
              this.$message({message: '请先选择一个主机！', type: 'warning'});
            }
          }
        })
      },
      getSearchDef() {
        return {
          width: 6,
          offset: 19,
          placeholder: '主机名称/IP地址',
          searchProps: ['itcompname', 'controladderss']
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.assetsAccount = this.multipleSelection.length
      },
      getScriptLib() {
        return $axios.get(`/scriptConsole/scriptLibTreeNode`).then((res) => {
          if (res.data instanceof Array && res.data.length > 0) {
            this.scriptLibraryList = res.data
          }
        })
      },
      getScriptList() {
        return $axios.get(`/scriptConsole/getScriptByLibUuid/${this.scriptForm.libName}`).then((res) => {
          if (res.data instanceof Array) {
            this.scriptList = res.data
            // this.scriptForm.scriptName = this.scriptList.length > 0 ? this.scriptList[0].uuid : ''
          }
        })
      },
      getFirstGroup() {
        $axios.get(`/autoMateItcomp/getAutoMGTreeNodeList`).then((res) => {
          if (res.data instanceof Array && res.data.length > 0) {
            this.firstGroupList = res.data
            // this.scriptForm.groupName = this.firstGroupList[0].parentUuid
          }
        })
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
        // $axios.post(`/autoMateItcomp/getAutoMateItcompList`, {condition: {searchStr: '', firstGroupUuid: this.scriptForm.groupName}}).then((res) => {
        //   if (res.data instanceof Array) {
        //     this.scriptData = res.data
        //     this.scriptDataFilter = res.data
        //     this.getScriptLib().then(() => {
        //       this.getScriptList().then(() => {
        //         this.scriptForm.scriptName = this.currentItem.uuid;
        //       })
        //     })
        //   }
        // })
      },
      init() {
        this.scriptForm.libName = this.currentItem.scriptLibUuid
        this.getFirstGroup()
      }
    },
    mounted() {
      this.getData()
      this.getScriptLib().then(() => {
        this.getScriptList().then(() => {
          this.scriptForm.scriptName = this.currentItem.uuid;
        })
      })
    },
    created() {
      this.init()
    },
    watch: {
      'scriptForm.scriptName': {
        immediate: true,
        handler() {
         this.filterHostListLibrary('scriptForm', 'scriptName')
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #batchScriptExecute
    padding-bottom 10px
    .scriptParamsInput
      width 100%
      .s-form-item-content
        width 88%
    .executeScriptBtn
      text-align right
      padding 2px 13px 0 0
    .exeDetail
      .icon-cabinet
        font-size 32px
</style>
