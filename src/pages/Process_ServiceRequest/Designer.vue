<template>
  <section id="designer">
    <s-row class="title-bar">
      <s-col :span="4">
        <h2 class="designer-title">
          <div class="title-img">
            <img src="/static/images/processServiceRequest/serviceDesign.png"/>
            <div style="margin-top: 10px;">
              服务请求设计器
            </div>
          </div>
        </h2>
      </s-col>
      <s-col :span="20">
        <h4 class="producer">
          <img src="/static/images/processServiceRequest/designWarn.png" style="width:14px; height: 14px"/>
          服务请求设计器将会指导您完成服务请求流程的创建到部署的全部过程。你可以点击【上一步】或【下一步】进行不同的操作设置。
        </h4>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="4" style="margin-top: 40px">
        <s-steps :current="currentMenuIdx" direction="vertical" finish-status="success" style="height: 550px;padding-left: 19%;box-sizing: border-box">
          <s-step v-for="(list,idx) in menuList" :title="list" :key="idx"></s-step>
        </s-steps>
      </s-col>
      <s-col :span="19">
        <section class="right-content-ctn">
          <keep-alive>
            <component :is="currentMenu" :currentIndex="currentMenuIdx" ref="currentMenu"></component>
          </keep-alive>
          <s-row class="bottom-tool-bar" v-if="currentMenuIdx!==0">
            <s-button @click="preStep" type="cancel">上一步</s-button>
            <s-button
              :disabled="saveDisabled && currentMenuIdx===7"
              @click="nextStep">{{currentMenuIdx===7?'保存':'下一步'}}</s-button>
            <!--<s-button
              icon="eye" title="预览"
              v-if="currentMenuIdx===7"
              @click="nextStep(true)">预览服务请求</s-button>
            <s-button @click="cancelDesigner">取消</s-button>-->
          </s-row>
        </section>
      </s-col>
    </s-row>
  </section>
</template>

<script type="text/babel">
  import Bus from '@/plugins/eventBus';
  import $axios from 'sunflower-ajax';
  import {step0, step1, step2, step3, step4, step5, step6, step7} from './DesignerSteps/index';

  export default {
    data() {
      return {
        menuList: ['设计器概述', '服务目录', '设计属性', '定义表单', '定义流程', '访问权限', '审批映射', '部署生效'],
        currentMenuIdx: 0,
        saveDisabled: false,  // 保存按钮是否禁灰不可用
        mixinData: {
          step1: null,
          step2: null,
          step3: null,
          step4: null,
          step5: null,
          step6: null,
          step7: null
        }
      }
    },
    computed: {
      currentMenu() {
        return `step${this.currentMenuIdx}`;
      },
      SRC() {
        let theme = localStorage.getItem('theme');
        return {
          bg: theme === 'dark' ? 'dark-bg' : 'topbg',
          icon: theme || 'fanta'  // fanta为默认主题
        }
      }
    },
    methods: {
      // 左侧菜单栏点击事件
      changeMenu(name, idx) {
        this.getStepData();
        // 阻止直接从step1/step2跳转至后面的step
        if (this.currentMenuIdx <= 1 && idx > 1) {
          if (!this.mixinData.step1 || this.mixinData.step1.length === 0) {
            this.$message.warning('请在“服务目录中”选择/创建要配置的服务请求！');
            return;
          }
          this.validateStep1();
        } else {
          this.currentMenuIdx = idx;
        }
      },
      // 取消创建/编辑设计器
      cancelDesigner() {
        this.$store.commit('setEditDesigner', null);
        this.$router.push('serviceRequest');
      },
      // 返回上一步
      preStep() {
        this.getStepData();
        if (this.currentMenuIdx > 0) this.currentMenuIdx -= 1;
      },
      // 下一步/保存
      nextStep() {
        this.getStepData();
        if (this.currentMenuIdx < 7) { // 下一步
          // step1-服务目录操作判断
          if (this.currentMenuIdx === 1) {
            this.validateStep1();
          } else if (this.currentMenuIdx === 2) {
            // step2-设计属性表单验证
            this.$refs.currentMenu.$refs.setPropertyForm.validate(valid => {
              if (valid) this.currentMenuIdx += 1;
              else this.$message.warning('请按要求填写信息！');
            });
          } else if (this.currentMenuIdx === 3) {
            if (this.$refs.currentMenu.$refs.dragForm.dropLists.length > 0) {
              this.currentMenuIdx += 1;
            } else {
              this.$message.warning('请定义服务请求提交表单字段！');
            }
          } else if (this.currentMenuIdx === 5) {
            // step5-访问权限验证
            let accessAuthForm = this.$refs.currentMenu.accessAuthForm;
            if (accessAuthForm.power !== 0 && accessAuthForm.authList.length === 0) {
              this.$message.warning('请选择添加访问权限列表！');
            } else {
              this.currentMenuIdx += 1;
            }
          } else if (this.currentMenuIdx === 6) {
            // step6-审批映射验证
            let approvalMapForm = this.$refs.currentMenu.approvalMapForm;
            if (approvalMapForm.approveRules !== 0 && approvalMapForm.approvalList.length === 0) {
              this.$message.warning('请选择添加审批映射列表！');
            } else {
              if (this.$store.state.serviceRequest.editDesigner && this.$store.state.serviceRequest.editDesigner.uuid === '5c350009600748dfacaffd8a5734d255') { // 当前是调岗设计器
                if (approvalMapForm.approvalList.length < 2) {
                  this.$message.warning('审批映射列表至少选择两项！');
                } else {
                  this.currentMenuIdx += 1;
                }
              } else {
                this.currentMenuIdx += 1;
              }
            }
          } else {
            this.currentMenuIdx += 1;
          }
        } else { // 保存
          /* *****服务请求终极保存***** */
          this.$refs.currentMenu.$refs.deployAffectForm.validate(valid => {
            if (valid) {
              // 先将保存按钮置灰，防止多次保存
              this.saveDisabled = true;
              // console.log('---mixinData End---', this.mixinData);
              // 用来判断是否是在编辑当前设计器
              let state = this.$store.state.serviceRequest;
              // 接口上传数据初始化
              let saveData = {
                itilRequestDesigners: [],
                itilRequestProperties: {},
                attrbute: {},
                itilpowers: [],
                itilApproveResult: []
              };
              /* **step1-服务目录** */
              if (state.editDesigner) {
                // 编辑某个设计器，step1中上传数据构造
                let currentNode = null;
                // 在目录树中找到当前编辑的设计器对应的节点，设置为当前节点
                this.mixinData.step1.forEach(item => {
                  item.childrenList.forEach(list => {
                    if (state.editDesigner.uuid === list.uuid) {
                      currentNode = list;
                    }
                  });
                });
                this.mixinData.step1.forEach(item => {
                  if (currentNode.parent === item.uuid) {
                    let data = {...this.createCatalogMap(item, 'first')};    // 构造一级目录
                    data.uuid = item.uuid;
                    data.itilRequestDesignerOne = [{                // 一级目录下的二级目录字段
                      uuid: currentNode.uuid,
                      ...this.createCatalogMap(currentNode, 'second')
                    }];
                    saveData.itilRequestDesigners.push(data);       // 存入上传对象
                  }
                });
              } else {
                // 新增设计器，step1中上传数据构造
                this.mixinData.step1.forEach(item => {
                  let data = {...this.createCatalogMap(item, 'first')};    // 构造一级目录
                  if (item.uuid) data.uuid = item.uuid;
                  data.itilRequestDesignerOne = [];               // 一级目录下的二级目录字段
                  item.childrenList.forEach(list => {
                    // 当在已有设计器保存入库后再添加设计器时，只提交当前新增的设计器
                    if (!list.uuid && list.nodeId) {
                      data.itilRequestDesignerOne.push(this.createCatalogMap(list, 'second'));    // 一级目录下要保存的新增的二级目录;
                    }
                  });
                  saveData.itilRequestDesigners.push(data);   // 存入上传对象
                });
                // 删除无新增设计器的一级节点目录
                saveData.itilRequestDesigners = saveData.itilRequestDesigners.filter(designer => {
                  if (designer.itilRequestDesignerOne.length > 0) return designer
                });
              }
              /* **step2-设计属性** */
              saveData.itilRequestProperties = this.mixinData.step2;
              /* **step3-定义表单** */
              saveData.attrbute.typeAttributeList = this.mixinData.step3.map(item => {
                let data = {
                  colnumName: item.colnumName,
                  attributeDesc: item.attributeDesc,
                  htmlType: item.htmlType,
                  isSyetemAttribute: item.isSyetemAttribute,
                  uuid: item.uuid,
                  isInherent: item.isInherent,
                  isSelected: item.isSelected,
                  isRequired: item.isRequired,
                  defaultValue: item.defaultValue
                }
                if (item.htmlType === 'udf_long') {
                  data.defaultValue = item.attrValueNum
                }
                if (item.htmlType === 'udf_char_list') {
                  data.listvalues = item.listvalues.map(list => {
                    return {listvalues: list.listvalues}
                  })
                }
                return data
              });
              /* **step5-访问权限** */
              if (this.mixinData.step5.power === 1) {
                saveData.itilpowers = this.mixinData.step5.authList.map(item => {
                  return {companyUuid: item.uuid, orgUuid: null}
                })
              } else if (this.mixinData.step5.power === 2) {
                saveData.itilpowers = this.mixinData.step5.authList.map(item => {
                  return {companyUuid: null, orgUuid: item.uuid}
                })
              }
              /* **step6-审批映射** */
              saveData.itilApproveResult = this.mixinData.step6.approvalList.map(item => {
                return {approveUuid: item.uuid}
              })
              // console.log('---saveData---', saveData);
              // 编辑已有设计器
              if (state.editDesigner) {
                $axios.post('/itilServiceRequest/update', saveData, {
                  data: [],
                  logTemplate: `修改|设计器(${this.$store.state.serviceRequest.requestName})`
                }).then(({data}) => {
                  if (data === true) {
                    this.$store.commit('setEditDesigner', null);
                    this.$message.success('保存成功！');
                    this.saveDisabled = false;
                    this.$router.push('serviceRequest');
                  } else {
                    this.$message.error('保存失败，请重试！');
                    this.saveDisabled = false;
                  }
                });
              } else {
                // 新增设计器
                $axios.post('/itilServiceRequest/save/1', saveData, {
                  data: [],
                  logTemplate: `创建|设计器(${this.$store.state.serviceRequest.requestName})`
                }).then(({data}) => {
                  if (data === true) {
                    this.$message.success('保存成功！');
                    this.saveDisabled = false;
                    this.$router.push('serviceRequest');
                  } else {
                    this.$message.error('保存失败，请重试！');
                    this.saveDisabled = false;
                  }
                });
              }
            } else {
              this.$message.warning('请按要求填写信息！');
              return;
            }
          });
        }
      },
      // 切换菜单时，获取即将离开菜单中的数据
      getStepData() {
        switch (this.currentMenuIdx) {
          case 1: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.serviceCatalogTree; break;
          case 2: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.setPropertyForm; break;
          case 3: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.$refs.dragForm.dropLists; break;
          case 4: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.defineProcess; break;
          case 5: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.accessAuthForm; break;
          case 6: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.approvalMapForm; break;
          case 7: this.mixinData[`step${this.currentMenuIdx}`] = this.$refs.currentMenu.deployAffectForm; break;
        }
      },
      // 构造服务目录树中二级目录包含一级目录的数据格式的函数
      createCatalogMap(catalog, catalogLevel) {
        let state = this.$store.state.serviceRequest;
        let [firstCatalogId, secondCatalogId] = [state.firstCatalogId, state.secondCatalogId];
        let p = catalog.nodeId === firstCatalogId || catalog.nodeId === secondCatalogId;
        let q = catalog.uuid === firstCatalogId || catalog.uuid === secondCatalogId;
        let res = {
          istalk: (p || q) ? 1 : 0,
          orgUuid: this.$store.state.serviceRequest.companyUuid,
          name: catalog.name,
          requestName: catalog.requestName,
          desc: catalog.desc,
          itilType: this.mixinData.step4.itilType,
          deployTime: new Date(this.mixinData.step7.deployTime).getTime() / 1000,
          validateTime: new Date(this.mixinData.step7.validateTime) / 1000,
          power: this.mixinData.step5.power,
          // noticeRules: this.mixinData.step7.noticeRules.join(','),
          approveRules: this.mixinData.step6.approveRules
        };
        // 新增时，一二级目录都需要status。编辑时，只有二级目录需要status
        (!this.$store.state.serviceRequest.editDesigner || catalogLevel === 'second') && (res.status = this.mixinData.step7.status);
        return res;
      },
      /**
       * 检测step1-服务目录数据是否合法，是否已选择要配置的"服务请求"
       * 从而判断是否阻止跳转
       */
      validateStep1() {
        /* **是否存在一级目录不包含二级目录** */
        let noChildrenFlag = this.mixinData.step1.find(item => {
          return item.childrenList.length === 0;
        });
        if (noChildrenFlag) {
          this.$message.warning('请为新增的一级目录创建一个二级目录！');
        } else {
          /* **是否未选择以后step要配置的二级目录的服务请求** */
          let currentNode = this.$refs.currentMenu.$refs.serviceCatalogTree.getCurrentNode();
          // 未选择节点或者选择了节点但非二级节点（即：不是具体服务请求的节点）
          if (currentNode && ((currentNode.parentId && currentNode.parentId !== null) || (currentNode.parent && currentNode.parent !== 'thetopuuid0000000000000000000000'))) {
            this.$store.commit('setRequestData', {
              firstCatalogId: currentNode.parentId || currentNode.parent,
              secondCatalogId: currentNode.nodeId || currentNode.uuid,
              secondCatalogName: currentNode.name,
              requestName: currentNode.requestName || currentNode.node.requestName
            });
            this.currentMenuIdx += 1;
          } else {
            let editDesigner = this.$store.state.serviceRequest.editDesigner;
            if (!editDesigner) {
              if (this.$refs.currentMenu.addSecondCounter === 0) {
                this.$message.warning('请创建一个服务请求设计器！');
              } else {
                this.$message.warning('请选择新添加的设计器！');
              }
            } else {
              this.$message.warning('请先选择一项服务请求设计器！');
            }
          }
        }
      }
    },
    /**
     * 路由离开当前页面丢失数据信息提示
     */
    beforeRouteLeave(to, from, next) {
      if (from.path.indexOf('/designer') !== -1 && to.path.indexOf('/diy') !== -1) {
        next();
      } else if (from.path.indexOf('/designer') !== -1 && to.path.indexOf('/serviceRequest') === -1) {
        this.$confirm('离开本页面将导致所有已填数据丢失，确定离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          next();
        }).catch(() => {});
      } else {
        next();
      }
    },
    created() {
      // 获取所有的内置设计器的uuid数组
      let self = this;
      $axios.get(`/itilServiceRequest/getRequestDesignerIsInternalList`).then((res) => {
        if (res.status === 200) {
          self.$store.commit('setInlayarr', res.data);
        }
      })
      /**
       * 监听键盘/浏览器刷新按钮刷新页面事件，给出提示
       */
      let _this = this;
      window.onbeforeunload = (e) => {
        // 判断路由，防止从当前页跳出至其他路由时，第一次依旧有系统弹框提示。
        if (_this.$route.path.indexOf('/designer') !== -1) {
          e = e || window.event;
          let returnTxt = '离开本页面将导致所有已填数据丢失，确定离开？';
          // 兼容IE8和Firefox 4之前的版本
          if (e) e.returnValue = returnTxt;
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return returnTxt;
        }
      };
      /**
       * 监听step0中"创建"/"编辑弹框下一步"事件
       */
      Bus.$on('goToStep1', () => {
        this.currentMenuIdx = 1;
      });
    },
    components: {
      step0,
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      step7
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #designer
    .title-bar
      height: 130px;
      margin-top: 10px;
      margin-bottom: -30px;
      .designer-title
        font-size 18px
        font-weight bold
        height 100px
        .title-img
          padding-top 30px
          text-align center
          img
            vertical-align middle
      .producer
        font-size 15px
        line-height 60px
        .icon-help
          font-size 18px
    ul.designer-menu
      li
        height 38px
        line-height 38px
        font-size 15px
        border-left 3px solid transparent
        padding-left 30px
    .right-content-ctn
      margin-top -45px
      min-height calc(100vh - 230px)
      padding 20px 40px
      margin-right 15px
      .step-title
        font-size 15px
        font-weight bold
        margin-bottom 30px
      .bottom-tool-bar
        margin-top 60px
</style>
