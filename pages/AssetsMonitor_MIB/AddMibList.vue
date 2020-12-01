<template>
  <section
    class="mibList-add"
    v-loading.fullscreen.lock="fullScreenLoading"
    element-loading-text="保存中，请稍等...">
    <s-scrollbar wrap-class="scrollMaxH">
      <s-row class="title">
        <i class="iconfont icon-tag"></i>
        <span>基本信息</span>
      </s-row>
      <s-row>
        <s-form
          ref="addMibListBase"
          :model="addMibListBase"
          :rules="addMibListBaseRules"
          label-width="120px">
          <!--<s-row>-->
            <!--<s-col span="20">-->
              <!--<s-form-item label="模板名称:" prop="name" tip="最大长度20个字符">-->
                <!--<s-input v-model="addMibListBase.name" :maxlength="20"></s-input>-->
              <!--</s-form-item>-->
            <!--</s-col>-->
          <!--</s-row>-->

          <s-form-item label="资产类型:" prop="citypeUuid">
            <!--<select-tree-->
              <!--v-model="addMibListBase.citypeUuid"-->
              <!--@selectTreeChange="getCiTypeUuid"></select-tree>-->
            <s-cascader
              style="width:210px"
              placeholder="请选择设备的三级分类"
              :options="citypeList"
              v-model="addMibListBase.citypeUuid">
            </s-cascader>
          </s-form-item>

          <s-form-item label="资产厂商:" prop="manufactUuid">
            <select-tree
              style="width:210px"
              ref="manufactTree"
              v-model="addMibListBase.manufactUuid"
              :url="manufactUrl"
              :customName="manufactCustomName"
              @selectTreeChange="getManufact">
            </select-tree>
            <s-button
              v-if="addMibListBase.manufactUuid==='custom'"
              @click="atuoCheckManufact">自动识别
            </s-button>
          </s-form-item>

          <s-row>
            <s-col span="20">
              <s-form-item label="资产型号:" prop="productUuid">
                <s-select
                  ref="productTree"
                  style="width:210px"
                  v-model="addMibListBase.productUuid"
                  @change="getProduct">
                  <s-option
                    v-for="list in productLists"
                    :value="list.uuid"
                    key="list.uuid"
                    :label="list.caption">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
          </s-row>
          <s-row v-if="isProductCustom">
            <s-col span="20">
              <s-form-item class="customType" prop="productName" tip="最大长度20个字符">
                <s-input
                  v-model="addMibListBase.productName"
                  placeholder="请输入型号名称"
                  :maxlength="20"></s-input>
              </s-form-item>
            </s-col>
          </s-row>

          <s-row>
            <s-col span="11">
              <s-form-item label=" 标识符:" tip="最大长度20个字符">
                <s-input v-model="addMibListBase.keyWord" :maxlength="20" style="width:210px"></s-input>
              </s-form-item>
            </s-col>
          </s-row>

          <s-row>
            <s-col span="11">
              <s-form-item label="型号OID:" prop="sysObjectOid" tip="最大长度为100个字符">
                <s-input v-model="addMibListBase.sysObjectOid" :maxlength="100" placeholder="可自动识别" style="width:210px"></s-input>
              </s-form-item>
            </s-col>
            <s-col span="4" class="autoCheck">
              <s-button
                v-if="isProductOid"
                @click="autoCheckOid">自动识别
              </s-button>
            </s-col>
          </s-row>
        </s-form>
      </s-row>

      <s-row class="title">
        <i class="iconfont icon-approve"></i>
        <span>识别监控信息</span>
      </s-row>
      <s-row>
        <s-form ref="monitorInfo" :model="monitorInfo" :rules="monitorInfoRules"  label-width="120px">
          <s-row>
            <s-col span="10">
              <s-form-item label="监控模板:" prop="uuid">
                <s-select
                  v-model="monitorInfo.uuid"
                  style="width:210px">
                  <s-option
                    v-for="list in monitorTemplateLists"
                    :value="list.uuid"
                    key="list.uuid"
                    :label="`${list.productName}【${list.template}】`">
                  </s-option>
                </s-select>
              </s-form-item>
            </s-col>
            <s-col span="14" class="autoCheck">
              <s-button @click="templateCheck">模板检测</s-button>
            </s-col>
          </s-row>
        </s-form>
      </s-row>

      <s-table-page
        v-show="monitorInfo.uuid === 'customTemplate'"
        :data="monitorTypeLists"

        :header-actions='getListActionsDef()'
        :row-actions='getListRowActionsDef()'
        :header-search='getListSearchDef()'
        @selection-change="handleSelectionChange"
        actionColWidth="40px">
        <s-table-column
          type="selection"
          width="50">
        </s-table-column>
        <s-table-column
          label="监控项类型名称"
          prop="chName">
        </s-table-column>
      </s-table-page>

      <s-row class="footerRow">
        <s-button type="cancel" @click="cancelMiblist">取消</s-button>
        <s-button @click="MiblistSave">保存</s-button>
      </s-row>
    </s-scrollbar>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import Bus from '@/plugins/eventBus'
  import selectTree from '@/components/selectTree/SelectTree'

  export default{
    data() {
      let checkCustomProduct = (rule, value, callback) => {
        if (this.isProductCustom === true) {
          if (!value) {
            callback(new Error('不能为空'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        // 三级分类数据
        citypeList: [],
        uuidNameArr: [],
        isSaveDisabled: false,
        fullScreenLoading: false,           // 全屏loading。针对MIB保存速度过慢，无‘保存中’的动态提示bug的修改
        manufactUrl: '/systemmanager/mibtool/getManufactTree',  // 资产厂商请求地址
        productLists: [],           // 资产型号列表
        monitorTemplateLists: [],   // 监控模板列表
        customType: '',             // 资产类型特殊字段(common/custom)
        monitorTypeLists: [],       // 新增监控项类型列表
        monitorTypesFinal: [],      // 新增监控项类型上传数据
        monitorTypeSelections: [],  // 监控项类型多选

        // 厂商自动识别标志。
        isAutoDistinguishManufact: false,
        // 解决MIB"资产厂商"自动识别后，名称回显的问题(自定义选项的自定义name值)
        manufactCustomName: '自定义',

        // 添加MIB基本信息
        addMibListBase: {
          name: '',
          citypeUuid: [],
          manufactUuid: '',
          productUuid: '',
          productName: '',
          keyWord: '',
          sysObjectOid: ''
        },
        // 基本信息表单验证规则
        addMibListBaseRules: {
//          name: [
//            {required: true, message: '不能为空', trigger: 'blur'}
//          ],
          citypeUuid: [
            {type: 'array', required: true, message: '不能为空', trigger: 'blur'}
          ],
          manufactUuid: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          productUuid: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          productName: [
            {validator: checkCustomProduct, trigger: 'blur'}
          ],
          sysObjectOid: [{
            required: true, message: '不能为空', trigger: 'change'
          }, {
            max: 100, message: '最大长度为100个字符', trigger: 'change'
          }, {
            pattern: /^(\d+\.)+\d+$/, message: '格式不正确', trigger: 'change'
          }]
        },

        // 识别监控信息
        monitorInfo: {
          uuid: ''
        },
        // 识别监控信息表单验证规则
        monitorInfoRules: {
          uuid: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      selectTree},
    computed: {
      isProductCustom() {
        if (this.addMibListBase.productUuid === 'custom') {
          return true
        }
      },
      isProductOid() {
        if (this.addMibListBase.productUuid && this.addMibListBase.manufactUuid !== 'custom') {
          return true
        }
      }
    },
    watch: {
      'addMibListBase.manufactUuid': {
        deep: true,
        handler(newVal, oldVal) {
          if (newVal === 'custom' && !this.isAutoDistinguishManufact) {
            this.$message({
              type: 'info',
              message: '请点击“自动识别”，识别资产厂商！'
            })
          }
        }
      }
    },
    methods: {
      // button按钮初始化
      getListActionsDef() {
        let _that = this
        return {
          width: 10,
          actions: [{
            name: '添加',
            icon: 'plus',
            click() {
              if (_that.addMibListBase.citypeUuid) {
                Bus.$emit('showMonitorTypeDialog')
              } else {
                _that.$message({
                  type: 'warning',
                  message: '请先选择资产类型！'
                })
              }
            }
          }, {
            name: '批量删除',
            icon: 'batch-del',
            click() {
              if (_that.monitorTypeSelections.length === 0) {
                _that.$message({
                  type: 'warning',
                  message: '请至少选择一项！'
                })
              } else {
                _that.$confirm('确定删除所选内容？', '删除', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  _that.monitorTypeSelections.forEach((item, index) => {
                    _that.monitorTypeLists.forEach((list, flag) => {
                      if (item.chName === list.chName) {
                        _that.monitorTypeLists.splice(flag, 1)
                      }
                    })
                  })
                  /* for (let i = 0; i < _that.monitorTypeSelections.lenght; i++) {
                   for (let j = 0; j < _that.monitorTypeLists.length; j++) {
                   if (_that.monitorTypeSelections[i].chName === _that.monitorTypeLists[j].chName) {
                   _that.monitorTypeLists.splice(j, 1)
                   break
                   }
                   }
                   } */
                }).catch(() => {
                  _that.$message({
                    type: 'info',
                    message: '已取消！'
                  })
                })
              }
            }
          }]
        }
      },
      // 表格行内操作初始化
      getListRowActionsDef() {
        let _this = this
        let def = [{
          name: '编辑',
          icon: 'edit',
          click(row) {
            Bus.$emit('showEditMonitorType', row)
          }
        }, {
          name: '删除',
          icon: 'delete',
          click(row) {
            _this.$confirm('确定删除所选内容？', '删除', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              _this.monitorTypeLists.forEach((item, index) => {
                if (item.chName === row.chName) {
                  _this.monitorTypeLists.splice(index, 1)
                }
              })
            }).catch(() => {
              _this.$message({
                type: 'info',
                message: '已取消！'
              })
            })
          }
        }]
        return def
      },
      // 表格搜索初始化
      getListSearchDef() {
        return {
          width: 6,
          offset: 8,
          placeholder: '请输入查询条件'
          // searchProps: ['taskName', 'userName', 'firstExecDateStr'] // can be string or Array
        }
      },
      /* 监控项类型多选 */
      handleSelectionChange(val) {
        this.monitorTypeSelections = val
      },

      /* 选择资产类型 */
      getCiTypeUuid(data) {
        // 获取对应配置
        /* $axios.get('/systemmanager/mibtool/getAllConfigTypeMap').then((res) => {
        }) */
        // 获取监控模板
        if (this.addMibListBase.manufactUuid !== '') {
          if (this.addMibListBase.manufactUuid === 'custom') {
            this.monitorTemplateLists = []
            this.monitorTemplateLists.push({
              productName: '通用模板',
              template: '通用模板',
              uuid: 'all_common'
            }, {
              productName: '自定义',
              template: '自定义',
              uuid: 'customTemplate'
            })
            this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
            this.isSaveDisabled = false
          } else {
            $axios.get(`/systemmanager/mibtool/getTemplateList/${this.addMibListBase.citypeUuid}/${this.addMibListBase.manufactUuid}/${this.addMibListBase.productUuid}`).then((res) => {
              let resData = res.data
              if (resData instanceof Array) {
                if (resData.length !== 0) {
                  this.isSaveDisabled = true
                  this.$message({
                    type: 'warning',
                    message: '该型号已经存在监控模版，不能重复添加！'
                  })
                } else {
                  this.isSaveDisabled = false
                }
              } else {
                resData = []
              }
              resData.push({
                productName: '自定义',
                template: '自定义',
                uuid: 'customTemplate'
              })
              this.monitorTemplateLists = resData
              this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
            })
          }
        }
      },
      // 获取设备三级分类树
      getCitypeTreeList() {
        return new Promise((resolve, reject) => {
          $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTree').then(({data}) => {
            if (data && data instanceof Array) {
              this.citypeList = this.circleGetOptions(data).tree
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      // 三级分类数据封装
      circleGetOptions(arr) {
        return {
          uuidName: this.uuidNameArr,
          tree: arr.map(item => {
            let obj = {
              value: item.uuid,
              label: item.name
            };
            this.uuidNameArr.push({
              uuid: item.uuid,
              name: item.name
            })
            if (item.childrenList && item.childrenList.length > 0) {
              obj.children = this.circleGetOptions(item.childrenList).tree
            }
            return obj;
          })
        }
      },
      /*
       *选择资产厂商
       */
      getManufact(data) {
        if (this.addMibListBase.manufactUuid === 'custom') {
          this.productLists = []
          this.productLists.push({
            caption: '自定义',
            id: 'custom',
            keyname: '自定义',
            manufactUuid: 'custom',
            uuid: 'custom'
          })
          this.addMibListBase.productUuid = this.productLists[0].uuid
          if (!this.addMibListBase.citypeUuid) {
            this.$message({
              type: 'warning',
              message: '请先选择资产类型！'
            })
          } else {
            this.monitorTemplateLists = []
            this.monitorTemplateLists.push({
              productName: '通用模板',
              template: '通用模板',
              uuid: 'all_common'
            }, {
              productName: '自定义',
              template: '自定义',
              uuid: 'customTemplate'
            })
            this.isSaveDisabled = false
            this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
          }
        } else {
          // 非自定义厂商 -> 未采用自动  识别获取厂商信息
          this.$nextTick(() => {
//            if (this.isAutoDistinguishManufact !== true) {
              // 获取资产型号
              $axios.get(`/systemmanager/mibtool/getProductList/${this.addMibListBase.manufactUuid}`).then((res) => {
                let resData = res.data
                if (resData) {
                  resData.push({
                    caption: 'common',
                    id: 'common',
                    keyname: 'common',
                    manufactUuid: 'common',
                    uuid: 'common'
                  }, {
                    caption: '自定义',
                    id: 'custom',
                    keyname: '自定义',
                    manufactUuid: 'custom',
                    uuid: 'custom'
                  })
                  this.productLists = resData
                  this.addMibListBase.productUuid = this.productLists[0].uuid
                }
                if (!this.addMibListBase.citypeUuid) {
                  this.$message({
                    type: 'warning',
                    message: '请先选择资产类型！'
                  })
                } else {
                  // 获取监控模板
                  $axios.get(`/systemmanager/mibtool/getTemplateList/${this.addMibListBase.citypeUuid}/${this.addMibListBase.manufactUuid}/${this.addMibListBase.productUuid}`).then((res) => {
                    let resData = res.data
                    if (resData instanceof Array) {
                      if (resData.length !== 0) {
                        this.isSaveDisabled = true
                        this.$message({
                          type: 'warning',
                          message: '该型号已经存在监控模版，不能重复添加！'
                        })
                      } else {
                        this.isSaveDisabled = false
                      }
                    } else {
                      resData = []
                    }
                    resData.push({
                      productName: '自定义',
                      template: '自定义',
                      uuid: 'customTemplate'
                    })
                    this.monitorTemplateLists = resData
                    this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
                  })
                }
              })
//            } else {
//            }
          })
        }
      },

      /*
       * 选择资产型号
       */
      getProduct() {
        if (this.addMibListBase.productUuid !== 'custom') {
          if (this.addMibListBase.productUuid === 'common') {
            this.customType = 'custom'
          } else {
            this.customType = this.addMibListBase.productUuid
          }
          if (!this.addMibListBase.citypeUuid) {
            this.$message({
              type: 'warning',
              message: '请选择资产类型！'
            })
          } else {
            $axios.get(`/systemmanager/mibtool/getTemplateList/${this.addMibListBase.citypeUuid}/${this.addMibListBase.manufactUuid}/${this.customType}`).then((res) => {
              let resData = res.data
              if (resData instanceof Array) {
                if (resData.length !== 0) {
                  this.isSaveDisabled = true
                  this.$message({
                    type: 'warning',
                    message: '该型号已经存在监控模版，不能重复添加！'
                  })
                } else {
                  this.isSaveDisabled = false
                }
              } else {
                resData = []
              }
              resData.push({
                productName: '自定义',
                template: '自定义',
                uuid: 'customTemplate'
              })
              this.monitorTemplateLists = resData
              this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
            })
          }
        } else {
          this.monitorTemplateLists = [{
            productName: '自定义',
            template: '自定义',
            uuid: 'customTemplate'
          }]
          this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
          this.isSaveDisabled = false
        }
      },

      // 自动识别资产厂商
      atuoCheckManufact() {
        if (this.addMibListBase.citypeUuid) {
          Bus.$emit('showAutoCheckManufactDialog')
        } else {
          this.$message({
            type: 'warning',
            message: '请选择资产类型'
          })
        }
      },
      // 自动识别型号OID
      autoCheckOid() {
        Bus.$emit('showAutoCheckOidDialog')
      },
      // 模板检测
      templateCheck() {
        if (this.monitorInfo.uuid === 'customTemplate') {
          this.$message({
            type: 'warning',
            message: '请选择模板'
          })
        } else {
          Bus.$emit('showTemplateCheckDialog', this.monitorInfo.uuid)
        }
      },

      /* ------------------------------
       * MIB添加，保存模板
       */
      // 请求
      MiblistSavePost(sendData) {
        this.fullScreenLoading = true
        $axios.post('/systemmanager/mibtool/saveMibTempalte', sendData, {
          data: [{name: this.addMibListBase.name}],
          logTemplate: '添加|模板(#name#)'
        }).then((res) => {
          let resData = res.data
          if (resData === 'success') {
            Bus.$emit('addMibTemplateSuccess')
            this.fullScreenLoading = false
            this.$message({
              type: 'success',
              message: '添加成功！'
            })
          } else {
            this.fullScreenLoading = false
            this.$message({
              type: 'error',
              message: '添加失败，请重试！'
            })
          }
        })
      },
      // 处理上传数据->保存
      MiblistSave() {
        if (this.isSaveDisabled) {
          this.$message({
            type: 'warning',
            message: '该型号已经存在监控模版，不能重复添加！'
          })
          return
        }
        this.$refs['addMibListBase'].validate((valid) => {
          if (valid) {
            if (this.addMibListBase.manufactUuid === 'custom' && !this.isAutoDistinguishManufact) {
              this.$message({
                type: 'warning',
                message: '请点击“自动识别”，识别资产厂商！'
              })
              return
            }
            // 非自定义资产型号，上传数据去除productName字段
            if (this.addMibListBase.productUuid !== 'custom') {
              this.$delete(this.addMibListBase, 'productName')
            }
            let sendData = {
              monitorTypes: [],
              template: {}
            }
            for (let i in this.addMibListBase) {
              sendData.template[i] = this.addMibListBase[i]
            }
//            if (this.isAutoDistinguishManufact === true) {
//              sendData.template.manufactUuid = 'custom'
//            }
            if (this.monitorInfo.uuid === 'customTemplate') {
              /* ***自定义模板保存*** */
              sendData.monitorTypes = this.monitorTypeLists
            } else {
              this.$set(sendData.template, 'innerTemplateUuid', this.monitorInfo.uuid)
            }
            // 拼装三级数据
            sendData.template.fristTypeUuid = sendData.template.citypeUuid[0]
            sendData.template.secondTypeUuid = sendData.template.citypeUuid[1]
            sendData.template.threeTypeUuid = sendData.template.citypeUuid[2]
            sendData.template.citypeUuid = undefined
            this.MiblistSavePost(sendData)
          } else {
            return false
          }
        })
      },
      cancelMiblist() {
        Bus.$emit('addMibTemplateSuccess')
      }
    },
    mounted() {
      // 监控模板初始化(默认自定义)
      let temArr = []
      temArr.push({
        productName: '自定义',
        template: '自定义',
        uuid: 'customTemplate'
      })
      this.getCitypeTreeList()
      this.monitorTemplateLists = temArr
      this.monitorInfo.uuid = this.monitorTemplateLists[0].uuid
      // 资产厂商自动识别成功
      Bus.$on('confirmDistingushManufact', (data) => {
        if (data) {
          this.isAutoDistinguishManufact = true
          this.addMibListBase.sysObjectOid = data.oid
          // this.addMibListBase.manufactUuid = 'custom'
          this.manufactCustomName = `${data.chinese}（${data.english}）`
          this.$set(this.addMibListBase, 'manufactName', `${data.english}_${data.chinese}`)
        }
      })
      // 型号OID自动识别成功
      Bus.$on('autoCheckOidOver', (data) => {
        if (data) {
          this.addMibListBase.sysObjectOid = data
        }
      })
      // 新增监控项类型成功
      Bus.$on('addMonitorTypeOver', (data) => {
        /* --- 更改后的数据回显 --- */
        if (this.monitorTypeLists.length === 0) {
          this.monitorTypeLists.push(data)
        } else {
          let flag = null
          this.monitorTypeLists.forEach((innerItem, $index) => {
            if (innerItem.chName === data.chName) {
              flag = $index
            }
          })
          if (flag === null) {
            this.monitorTypeLists.push(data)
          } else {
            this.monitorTypeLists.splice(flag, 1, data)
          }
        }
      })
      //
      Bus.$on('editMiblistMonitorTypeOver', (data) => {
        let flag = null
        this.monitorTypeLists.forEach((innerItem, $index) => {
          if (innerItem.chName === data.chName) {
            flag = $index
          }
        })
        if (flag === null) {
          this.monitorTypeLists.push(data)
        } else {
          this.monitorTypeLists.splice(flag, 1, data)
        }
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .scrollMaxH
    max-height 600px
    padding-right 15px

  .customType
    .s-input-small
      .s-input-inner
        height 36px

  .autoCheck
    padding-top 3px
    padding-left 10px

  .title
    color #2DB0FB
    margin-bottom 15px
    i
      vertical-align middle
    span
      font-weight 600
      margin-left 3px
</style>
