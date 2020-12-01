/*
create by YOU
*/
<template>
  <s-dialog v-if="dialogFlag" v-model="dialogFlag" width="800px" height="500px" title="关系列表" key="add-relation-dialog" append-to-body>
    <s-scrollbar wrap-style="max-height: 500px;">
      <s-row style="margin-bottom: 10px;">
        <s-col :span="14" style="height: 40px; line-height: 40px;">
          <s-radio v-model="addWay" label="1">关系类型</s-radio>
          <s-select v-model="crelation" value-key="uuid" placeholder="请选择" :disabled="addWay !== '1'">
            <s-option
              v-for="item in coptions"
              :label="item.relationName + '--' + item.citypeName"
              :key="item.uuid"
              :value="item">
            </s-option>
          </s-select>
        </s-col>
        <s-col :span="10" style="height: 40px; line-height: 40px;">
          <s-radio v-model="addWay" label="2">搜索其他配置项以便创建关系</s-radio>
        </s-col>
      </s-row>
      <div v-if="addWay === '1'">
        <s-radio-group style="width: 100%;" v-model="currentRow" v-if="relationSelect.relationDefine === '1'">
          <s-table
            ref="singleTable"
            :data="configitemdataClone"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%" height="280">
            <s-table-column width="90px" align="center" label="单选">
              <template slot-scope="scope">
                <s-radio :label="scope.row">&nbsp;</s-radio>
              </template>
            </s-table-column>
            <s-table-column label="名称">
              <template slot-scope="scope">
                <span v-html="scope.row.ciname"></span>
              </template>
            </s-table-column>
            <s-table-column property="ciType" label="类型">
            </s-table-column>
            <s-table-column property="ip" label="IP地址">
            </s-table-column>
          </s-table>
        </s-radio-group>
        <div v-else>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;flex-direction: row-reverse">
            <s-input icon="magnifier" v-model="searchStr" style="width: 250px" placeholder="请选择名称、类型、IP地址查询" ></s-input>
          </div>
          <s-table
            ref="multipleTable"
            :data="computedData"
            @selection-change="handleSelectionChange"
            style="width: 100%" height="280">
            <s-table-column
              type="selection"
              width="90">
            </s-table-column>
            <s-table-column
              prop="ciname"
              label="名称">
            </s-table-column>
            <s-table-column property="ciType" label="类型">
            </s-table-column>
            <s-table-column property="ip" label="IP地址">
            </s-table-column>
          </s-table>
        </div>
      </div>
      <div v-else>
        <div style="margin: 10px 0;">搜索并选择配置项</div>
        <div style="margin:0 5%;">
          <s-form ref="searchForm" :model="searchForm" :rules="serachFormRules" :inline="true">
            <s-form-item label="配置项三级分类" prop="selectedClassify">
              <select-tree
                v-model="searchForm.selectedClassify"
                url="/resourcemanager/configurationmanage/citype/getCitypeTree"
                name="selectedClassify"
                @selectTreeChange="handleSelectTreeChange">
              </select-tree>
            </s-form-item>
            <s-form-item label="" prop="value">
              <s-input v-model="searchForm.value" placeholder="请输入资产名称"></s-input>
            </s-form-item>
            <s-form-item>
              <s-button @click="onSearch">查询</s-button>
            </s-form-item>
          </s-form>
          <div style="text-align: center; margin-bottom: 10px;">
            <s-transfer
              style="text-align: left; display: inline-block"
              :titles="['搜索到的配置项', '选中的配置项']"
              v-model="selectedSearchData" :data="searchData">
              <span slot-scope="{option}" :title="option.label">{{option.label}}</span>
            </s-transfer>
          </div>
          <s-form :model="this" :rules="typeRules" ref="userDefineCrelation">
            <s-form-item label="关系类型" label-width="100px" prop="userDefineCrelation">
              <s-select v-model="userDefineCrelation" value-key="uuid" placeholder="选择关系类型">
                <s-option
                  v-for="item in userDefineCoptions"
                  :label="item.forwardRelationtype.relationName"
                  :value="item"
                  :disabled="!(item.forwardRelationtype.status)"
                  :key="item.relationTypeUuid">
                </s-option>
              </s-select>
            </s-form-item>
          </s-form>

        </div>
      </div>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer">
      <s-button :disabled="locked === 2" @click="submit(true)">继续添加</s-button>
      <s-button :disabled="locked === 2" @click="submit">保存</s-button>
      <s-button @click="addCancel" type="cancel">关闭</s-button>
    </template>
  </s-dialog>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {cloneDeep} from 'lodash'
  import selectTree from '@/components/selectTree/SelectTree.vue'
  export default{
    components: {
      selectTree
    },
    data() {
      return {
        searchStr: '',
        dialogFlag: false,
        addWay: '1',
        systemRelations: [],
        userDefineRelations: [],
        crelation: '',
        userDefineCrelation: '',
        form2: {},
        locked: 1,
        threeLevelClassify: [],
        searchForm: {
          selectedClassify: '',
          value: ''
        },
        serachFormRules: {
          selectedClassify: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        typeRules: {
          userDefineCrelation: [{required: true, message: '不能为空', trigger: 'blur', type: 'object'}]
        },
        searchData: [],
        selectedSearchData: [],
        userDefineCoptions: [],
        configitemdataClone: []
      }
    },
    watch: {
      configitemdata(val) {
        this.configitemdataClone = cloneDeep(val)
      },
      dialogFlag(val) {
        if (val) {
          this.locked = 1
          this.addWay = '1'
          this.getUserDefineCoptions()
          this.crelation = this.coptions[0]
          this.searchData = []
          this.selectedSearchData = []
        } else {
          this.$emit('close')
        }
        this.$emit('input', val)
      },
      value(val) {
        this.dialogFlag = val
        if (val) {
          this.systemRelations = []
          this.userDefineRelations = []
          this.userDefineCrelation = []
          this.searchData = []
          this.selectedSearchData = []
          this.userDefineCoptions = []
        }
      },
      'crelation': function (val) {
        // 将选择数据传出去，再改变外边的列表值
        this.$emit('selectChange', val)
      }
    },
    computed: {
      computedData() {
        let searchStr = this.searchStr
        if (searchStr) {
          return this.configitemdataClone.filter((item) => {
            let keys = Object.keys(item)
            for (let i = 0; i < keys.length; i++) {
              if (keys[i] === 'ciname' || keys[i] === 'ciType' || keys[i] === 'ip') {
                if (item[keys[i]] && item[keys[i]].toString().indexOf(searchStr) !== -1) {
                  return true
                }
              }
            }
            return false
          })
        }
        return this.configitemdataClone
      }
    },
    methods: {
      getUserDefineCoptions() {
        $axios.get('/resourcemanager/configurationmanage/relationtype/list').then(({data}) => {
          this.userDefineCoptions = data
        })
      },
      handleSelectTreeChange(val) {
        this.searchForm.selectedClassify = val.uuid;
        this.onSearch();
      },
      onSearch() {
        this.$refs.searchForm.validate((valid) => {
          if (valid) {
            let ciUuid = this.compId;
            if (this.isRoot || this.tipNode.id === undefined) {
              ciUuid = this.compId;
            } else {
              ciUuid = this.tipNode.id;
            }
            // let ciUuid = vm.tipNode.id && vm.isRoot ? vm.compId : vm.tipNode.id // 点击左上角添加关系
            let {
              selectedClassify,
              value
            } = this.searchForm
            let requestData = {
              citypeuuid: selectedClassify,
              ciuuid: ciUuid,
              searchStr: value
            }
            $axios.post(`/resourcemanager/configurationmanage/relationtype/getcmdbCilistBySearchStr`, requestData).then(({data}) => {
              if (data && data.map) {
                this.searchData = data.map((item) => {
                  return {
                    key: item.uuid,
                    label: item.ciname + `(${item.ip})`
                  }
                })
              } else {
                this.searchData = []
              }
            })
          }
        })
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      submit(flag) {
        if (this.addWay === '1') {
          this.addSubmit(flag)
        } else {
          this.searchSubmit(flag)
        }
        this.searchStr = ''
      },
      addCancel() {
        this.dialogFlag = false;
        this.searchStr = ''
      },
      searchSubmit(flag) {
        if (this.selectedSearchData.length < 1) {
          this.$message('选中配置项列表不能为空!')
          return
        }
        this.$refs.userDefineCrelation.validate(valid => {
          if (valid) {
            let relationTypeUuid = this.userDefineCrelation.forwardUuid
            let ciUuid = this.compId;
            if (this.isRoot || this.tipNode.id === undefined) {
              ciUuid = this.compId;
            } else {
              ciUuid = this.tipNode.id;
            }
            let data = {
              datalist: this.selectedSearchData.map((item) => {
                return {
                  ciUuid,
                  relationTypeUuid,
                  relCiuuid: item,
                  citypeRelationuuid: null
                }
              }),
              defautType: null,
              relationDefine: 0
            }
            if (flag !== true) {
              this.dialogFlag = false;
            }
            $axios.post('/resourcemanager/configurationmanage/relationtype/savecirelation', data, {
              data: [this.assetData],
              logTemplate: '添加|资产(#controlAdderss#/#itcompName#)>添加关联关系'
            }).then(({data}) => {
              if (data.state === true) {
                this.searchData = []
                this.$emit('submit')
                this.$message.success('保存成功!')
                this.$emit('close')
              } else {
                this.$message.error('保存失败!')
              }
            })
          } else {
            this.$message.warning('请选择关系类型!')
          }
        })
      },
      addSubmit (flag) {
        var cirelationArray = [];
        if (this.relationSelect.relationDefine === '1') { // 单选
          let cirelationship = {};
          cirelationship.relationTypeUuid = this.relationSelect.relationTypeUuid;
          cirelationship.relCiuuid = this.currentRow.uuid;
          // cirelationship.ciUuid = this.$route.params.compId;
          if (this.isRoot || this.tipNode.id === undefined) {
            cirelationship.ciUuid = this.compId;
          } else {
            cirelationship.ciUuid = this.tipNode.id;
          }
          cirelationship.citypeRelationuuid = this.relationSelect.uuid;
          cirelationArray.push(cirelationship);
        }
        if (this.relationSelect.relationDefine === '0') { // 多选
          for (let i = 0, l = this.multipleSelection.length; i < l; i++) {
            let cirelationship = {};
            cirelationship.relationTypeUuid = this.relationSelect.relationTypeUuid;  // 关系类型的uuid
            cirelationship.relCiuuid = this.multipleSelection[i].uuid;               // 关联配置项的uuid
            // cirelationship.ciUuid = this.$route.params.compId;
            if (this.isRoot || this.tipNode.id === undefined) {                                     // 配置项的uuid
              cirelationship.ciUuid = this.compId;
            } else {
              cirelationship.ciUuid = this.tipNode.id;
            }
            cirelationship.citypeRelationuuid = this.relationSelect.uuid;            // 配置项类型的关系uuid
            cirelationArray.push(cirelationship);
          }
        }
        if (cirelationArray.length === 0) {
          this.$message({message: '请先选择要添加的关系', type: 'info'});
          return;
        }
        var cirelationParam = {};
        cirelationParam.datalist = cirelationArray;
        cirelationParam.defautType = this.relationSelect.defaultType;
        cirelationParam.relationDefine = parseInt(this.relationSelect.relationDefine);
        this.locked++;
        if (flag !== true) {
          this.dialogFlag = false;
        }
        // 防止快速点击产生多次重复请求
        if (this.locked === 2) {
          $axios.post('/resourcemanager/configurationmanage/relationtype/savecirelation', cirelationParam).then(({data}) => {
            this.locked--;
            if (data.state === true) {
              this.$emit('submit')
              this.$message.success('保存成功!')
              this.$emit('close')
              if (flag === true) {
                let configitemdataCloneUuids = []
                this.configitemdataClone.forEach((item, index) => {
                  configitemdataCloneUuids[index] = item.uuid
                })
                if (this.currentRow) {
                  this.configitemdataClone.splice(configitemdataCloneUuids.indexOf(this.currentRow.uuid), 1)
                }
                if (this.multipleSelection) {
                  let multipleSelectionUuids = this.multipleSelection.map(item => item.uuid)
                  this.configitemdataClone = this.configitemdataClone.filter(item => {
                    if (multipleSelectionUuids.indexOf(item.uuid) === -1) {
                      return true
                    }
                  })
                }
              }
            } else {
              this.$message({showClose: true, message: '关系添加失败', type: 'error'});
            }
          });
        }
      }
    },
    props: {
      isRoot: true,
      value: false,
      compId: '',
      assetData: {
        type: Object,
        default() {
          return {}
        }
      },
      tipNode: {
        type: Object,
        default() {
          return {}
        }
      },
      coptions: {
        type: Array,
        default() {
          return []
        }
      },
      relationSelect: {
        type: Object,
        default () {
          return {}
        }
      },
      configitemdata: {
        type: Array,
        default() {
          return []
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
