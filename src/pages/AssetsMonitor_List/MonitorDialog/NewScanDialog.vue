<!--
 * @Author: 高建鹏
 * @Version: //Q4新扫描
 * @Description:
 * @Position:资产列表-》新扫描操作
 * @Date: 2019-11-06 13:54:10
 * @LastEditors: 高建鹏
 -->
<template>
  <div>
    <s-dialog v-model="dialogFlag" title="新扫描" width="800px" id="monitorNewScanDialog">
        <s-scrollbar wrap-style="max-height: 550px;">
          <s-row>
            <s-col :span="14">
              <s-row>
                <s-col>
                  <div class="table-block-title">SNMP共同体</div>
                  <span>凭证(版本号)：</span>
                  <li class="listblock" v-for="(item, index) in communityList" :key="index" @mouseenter="showUuid=item.uuid" @mouseleave="showUuid=null">
                    {{item.community || item.userName}}
                    (v{{item.version}})
                    <i class="iconfont icon-error" v-show="item.uuid===showUuid" @click="axiosDeleteVerify([item.uuid])"></i>
                  </li>
                  <i class="iconfont icon-plus handlerPlus" @click="handlerPlus"></i>
                </s-col>
              </s-row>
              <s-row>
                <s-col>
                  <div class="table-block-title" required><span style="color:red;">*</span>IP地址</div>
                  <s-form :model="compForm" :rules="compRules" ref="compForm1">
                    <s-form-item label="" prop="controlAdderss">
                      <s-input v-model="compForm.controlAdderss" @keyup.enter.native="autoRecognize" placeholder="请输入" style="width:250px;"></s-input>
                      <s-input style="display:none"></s-input>
                      <s-button @click="autoRecognize" icon="aim" style="margin-left: 15px;">自动识别</s-button>
                    </s-form-item>
                  </s-form>
                </s-col>
              </s-row>
            </s-col>
            <s-col :span="10" style="text-align:center;position: absolute; right: 0; top: calc(50% - 130px);">
              <img src="/static/images/assetpolling/newScan.svg" style="width:70%;margin-top:20px;">
            </s-col>
          </s-row>
          <s-row v-if="isshow">
            <s-form :model="compForm" :rules="compRules" ref="compForm2" label-width="90px" style="margin-right:50px;">
              <s-form-item label="资产名称" prop="itcompName">
                <s-input v-model="compForm.itcompName"></s-input>
              </s-form-item>
              <s-form-item label="资产类型" prop="citypeUuid">
                <s-cascader
                  style="width:100%;"
                  placeholder="请选择设备的三级分类"
                  :options="citypeOptions"
                  v-model="compForm.citypeUuid"
                  @change="selectTreeChange">
                </s-cascader>
                <!--<input-tree
                  v-model="compForm.citypeUuid"
                  name="uuid"
                  :data="citypeOptions"
                  :props="defaultProps"
                  @select-change="inputTreeChange">
                </input-tree>-->
              </s-form-item>
              <s-form-item label="资产型号" prop="modelNumber">
                <s-input v-model="compForm.modelNumber" readonly icon="plus" @click="showModelNumDialog" class="inputDialog" ref="modelInput"></s-input>
              </s-form-item>
              <s-form-item label="资产描述" prop="descr">
                <s-input type="textarea" v-model="compForm.descr" :rows="4"></s-input>
              </s-form-item>
          </s-form>
          </s-row>
        </s-scrollbar>
        <template slot="footer" class="dialog-footer">
          <s-button @click="dialogOkAndCon">确认并继续</s-button>
          <s-button @click="dialogOk">添加</s-button>
          <s-button @click="dialogFlag=false">取消</s-button>
        </template>
    </s-dialog>


    <!-- 添加SNMP共同体 -->
    <addCommonDialog v-if="SNMPDialogFlag" :SNMPDialogFlag.sync="SNMPDialogFlag" @reload="getCommunityList"></addCommonDialog>

    <model-number-dialog v-model="modelNumberDialogFlag" v-if="modelNumberDialogFlag" @select-model="selectModel">
    </model-number-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash';
  import {Validaters} from 'sunflower-common-utils';
  import addCommonDialog from './AddCommonDialog.vue';
  import modelNumberDialog from '@/pages/Assets_AssetList/AssetAddDialog/ModelNumberDialog'
  // import inputTree from '@/components/inputTree/InputTree';
  import Bus from '@/plugins/eventBus';

  export default {
    data() {
      return {
        showUuid: null,
        isshow: false,
        SNMPDialogFlag: false,
        dialogFlag: false,
        modelNumberDialogFlag: false,
        compForm: {
          controlAdderss: '',
          itcompName: '',
          citypeUuid: [],
          modelNumber: '',
          descr: ''
        },
        compRules: {
          controlAdderss: [
            Validaters.NotNull,
            Validaters.oneIP
          ],
          itcompName: [
            Validaters.NotNull,
            Validaters.Max(50)
          ],
          citypeUuid: [{type: 'array', required: true, message: '不能为空', trigger: 'blur'}],
          modelNumber: [Validaters.NotNull],
          descr: [Validaters.Max(999)]
        },
        communityList: [],
        credence: {}, // 新增时需要的参数
        citypeOptions: [], // 资产类型下拉树数据
        defaultProps: {
          children: 'childrenList',
          label: 'name'
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    created() {
      this.getCommunityList();
      this.axiosCitypeTree();
    },
    methods: {
      // 增加SNMP共同体
      handlerPlus() {
        this.SNMPDialogFlag = true;
      },
      // 获取共同体
      getCommunityList() {
        $axios.post('/resourcemanager/discovery/listCommunitys').then((response) => {
          let { status, msg, data } = response;
          if (status !== 200) {
            this.$message({
              title: '错误',
              message: msg,
              type: 'error'
            });
          } else {
            this.communityList = data;
          }
        })
      },
      // 删除共同体
      axiosDeleteVerify(params) {
        this.$confirm('确定删除当前凭证？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $axios.post('/resourcemanager/discovery/deleteCommunitys', params).then(response => {
            if (response.data === 'success') {
              this.$message({
                showClose: true,
                message: '删除成功！',
                type: 'success'
              });
              this.getCommunityList();
            } else {
              this.$message({
                showClose: true,
                message: '删除失败！',
                type: 'warnimg'
              });
            }
          });
        }).catch(() => {});
      },
      // 右侧表单相关
      axiosCitypeTree() {
        // 资产类型下拉树
        $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTree').then(({data}) => {
          this.citypeOptions = this.circleGetOptions(data).tree;
        });
      },
      /**
       * 递归修改设备三级分类树返回数据格式
       * childrenList --> children
       * 去除最后一级的childrenList:[] 为空数组引起的bug
       */
      circleGetOptions(arr) {
        return {
          tree: arr.map(item => {
            let obj = {
              value: item.uuid,
              label: item.name,
              node: {catogeryUuid: item.node.catogeryUuid}
            };
            if (item.childrenList && item.childrenList.length > 0) {
              obj.children = this.circleGetOptions(item.childrenList).tree
            }
            return obj;
          })
        }
      },
      selectTreeChange(nodeData) {
        // this.compForm.cateUuid = nodeData.node.catogeryUuid;
      },
      showModelNumDialog() {
        let uuidAry = cloneDeep(this.compForm.citypeUuid);
        if (!uuidAry[uuidAry.length - 1]) {
          this.$message({showClose: true, message: '请先选择资产类型', type: 'error'});
          return;
        }
        this.modelNumberDialogFlag = true;
      },
      selectModel(model) {
        this.compForm.defCompId = model.uuid;
        this.compForm.modelNumber = model.productName;
        this.compForm.itcompTemplate = model.template;
        this.compForm.manufactUuid = model.manufactUuid;
        this.compForm.productUuid = model.productUuid;
        // 下面的代码是为了修复验证
        let inputEl = this.$refs.modelInput.$el.children[0];
        inputEl.focus();
        inputEl.blur();
      },
      autoRecognize() {
        this.$refs.compForm1.validateField('controlAdderss', valid => {
          if (valid) return;
          if (this.communityList.length === 0) {
            this.$message({
              showClose: true,
              message: '请添加凭证',
              type: 'warning'
            });
            return;
          }
          let param = {
            ip: this.compForm.controlAdderss,
            community: this.communityList.map(item => {
              return item.uuid;
            })
          };
          let Loading = this.$loading({
            target: '#monitorNewScanDialog .s-dialog-main-content',
            text: '正在识别中...',
            customClass: 'loadingClass'
          });
          $axios.post(`/resourcemanager/discovery/autoScanItcomp`, param).then(({data}) => {
            Loading.close();
            if (data.pingStatus === 0) {
              this.$message({showClose: true, message: data.unknownCause, type: 'error'});
            } else {
              this.isshow = true;
              if (data.fristTypeUuid && data.secondTypeUuid) {
                if (data.threeTypeUuid) { // 一二三级都存在
                  data.citypeUuid = [data.fristTypeUuid, data.secondTypeUuid, data.threeTypeUuid]
                } else { // 只存在一二级
                  data.citypeUuid = [data.fristTypeUuid, data.secondTypeUuid]
                }
              }
              this.compForm = data;
              delete this.compForm.createTime;
              delete this.compForm.modifyTime;
              this.credence = data.credence;
              this.$nextTick(() => {
                this.$refs.compForm1.validate();
                this.$refs.compForm2.validate();
              })
            }
          });
        });
      },
      dialogOkAndCon() {
        this.dialogOk(() => {
          this.compForm = {
            controlAdderss: '',
            itcompName: '',
            citypeUuid: [],
            modelNumber: '',
            descr: ''
          };
          this.isshow = false;
        });
      },
      dialogOk(callback) {
        this.$refs.compForm1.validate(valid => {
          if (!valid) {
            return;
          }
          if (this.isshow) {
            this.$refs.compForm2.validate(valid => {
              if (!valid) {
                return;
              }
              if (this.communityList.length === 0) {
                this.$message({
                  showClose: true,
                  message: '请添加凭证',
                  type: 'warning'
                });
                return;
              }
              let param = {
                credenceList: this.credence ? [this.credence] : [],
                monitorItcomp: cloneDeep(this.compForm)
              };

              /* **设备三级分类，citypeUuid v-model的值为数组，上传时获取最后一级的uuid赋值给citypeUuid** */
              param.monitorItcomp.citypeUuid = param.monitorItcomp.citypeUuid.reverse()[0];

              let logParam = {
                data: [JSON.parse(JSON.stringify(this.compForm))],
                logTemplate: '新扫描|资产(#controlAdderss#)'
              };
              $axios.post('/resourcemanager/discovery/addScanSingleItcomp', param, logParam).then(({data}) => {
                this.$confirm(data, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  if (typeof callback === 'function') {
                    callback();
                  } else {
                    this.dialogFlag = false;
                  }
                  Bus.$emit('reloadPage');
                }).catch(() => {});
              });
            })
          } else {
            this.$message({showClose: true, message: '请先识别IP地址', type: 'warning'});
          }
        })
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          this.dialogFlag = val;
        }
      },
      dialogFlag(val) {
        this.$emit('input', val);
      }
    },
    components: {
      addCommonDialog,
      modelNumberDialog
      // inputTree
    }
  }
</script>
