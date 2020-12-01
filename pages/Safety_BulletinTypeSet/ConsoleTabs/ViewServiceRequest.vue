<template>
  <section id="viewServiceRequest" v-loading="fullscreenLoading">
    <s-scrollbar
      wrap-class="no-data-ctn"
      v-nodata="serviceRequestList.length===0">
      <ul
        class="serviceRequestLists"
        v-for="(list, index) in serviceRequestList"
        :key="index">
        <li style="font-size: 14px;font-weight: 600;">{{list.node.name}}</li>
        <li
          class="image-asset"
          v-for="(item, key) in list.childrenList"
          :key="key"
          @click="showDrawer(item.node)">
          <s-row type="flex" justify="center" align="middle" style="width:100%;height: 100%">
            <s-col align="center">
              <div style="height:68px; width: 68px;border-radius: 50%; line-height: 68px" :style="`background-color: ${ iconColorAry[key % 5]}`">
                <i class="icon iconfont" :class="item.node.image" style="font-size: 36px;color:#ffffff"></i>
              </div>
              <p class="request-name" :title="item.node.requestName">{{item.node.requestName}}</p>
            </s-col>
          </s-row>
        </li>
        <li style="clear:both;"></li>
      </ul>
    </s-scrollbar>

    <s-drawer
      v-model="drawValue"
      width="468"
      :title="drawerTitle"
      :mask-closable="true"
      :closable="true">
      <s-scrollbar wrap-class="max-drawer-height">
        <s-form
          :validate-on-rule-change="false"
          ref="serviceRequestForm"
          :model="serviceRequestForm"
          :rules="serviceRequestFormRules"
          label-width="100px">
          <s-form-item
            v-for="(item,index) in serviceRequestDetail"
            :prop="`${item.uuid}`"
            :label="item.colnumName" :key="index">
            <!--文本-->
            <s-input
              v-if="item.htmlType==='udf_char_single_line'"
              :type="item.type?item.type:'text'"
              :disabled="!item.isSelected"
              :placeholder="item.placeholder?item.placeholder:''"
              v-model="serviceRequestForm[item.uuid]">
            </s-input>
            <!--数值-->
            <s-input
              v-if="item.htmlType==='udf_long'"
              :disabled="!item.isSelected"
              v-model="serviceRequestForm[item.uuid]">
            </s-input>
            <!--下拉选项-->
            <s-select
              v-if="item.htmlType==='udf_char_list' && $store.state.serviceRequest.inlayarr.indexOf(serviceRequestUuid) === -1"
              placeholder="请选择" style="width:100%;"
              v-model="serviceRequestForm[item.uuid]"
              :disabled="!item.isSelected">
              <s-option
                v-for="(option, idx) in item.listvalues"
                :label="option.listvalues" :value="option.listvalues" :key="idx"></s-option>
            </s-select>
            <s-select
              v-if="item.htmlType==='udf_char_list'&&item.colnumName==='当前人员角色' && $store.state.serviceRequest.inlayarr.indexOf(serviceRequestUuid) !== -1"
              placeholder="请选择" style="width:100%;"
              v-model="serviceRequestForm[item.uuid]"
              :disabled="!item.isSelected"
              :multiple="true">
              <s-option
                v-for="(option, idx) in item.listvalues"
                :label="option.listvalues" :value="option.listvalues" :key="idx"></s-option>
            </s-select>
            <s-select
              v-if="item.htmlType==='udf_char_list'&&item.colnumName!=='当前人员角色' && $store.state.serviceRequest.inlayarr.indexOf(serviceRequestUuid) !== -1"
              placeholder="请选择" style="width:100%;"
              :clearable="serviceRequestUuid === '1c350009600748dfacaffd8a5734d211' && item.colnumName=='性别'"
              v-model="serviceRequestForm[item.uuid]"
              :disabled="!item.isSelected"
              @change="selectChange($event,item)">
              <s-option
                v-for="(option, idx) in item.listvalues"
                :label="option.listvalues" :value="option.listvalues" :key="idx"></s-option>
            </s-select>
            <!--时间日期-->
            <!-- 外置 -->
            <s-date-picker
              v-if="item.htmlType==='udf_date' && $store.state.serviceRequest.inlayarr.indexOf(serviceRequestUuid) === -1"
              :disabled="!item.isSelected"
              type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%;"
              v-model="serviceRequestForm[item.uuid]"></s-date-picker>
              <!-- 内置 -->
            <s-date-picker
              v-if="item.htmlType==='udf_date' && $store.state.serviceRequest.inlayarr.indexOf(serviceRequestUuid) !== -1"
              :disabled="!item.isSelected"
              :picker-options="pickeroptions(item.colnumName)"
              :type="timeFormat(item.colnumName)==='yyyy-MM-dd'?'date':'datetime'" placeholder="选择日期时间"
              :value-format="timeFormatx(item.colnumName)"
              :format="timeFormat(item.colnumName)"
              style="width: 100%;"
              :editable="false"
              @change='timechange(item)'
              v-model="serviceRequestForm[item.uuid]"></s-date-picker>
          </s-form-item>
          <s-form-item>
            <s-button
              :disabled="serviceRequestAccess"
              @click="saveServiceRequestForm('0')">保存</s-button>
            <s-button
              :disabled="serviceRequestAccess"
              @click="saveServiceRequestForm('1')">提交</s-button>
            <s-button
              @click="drawValue=false">取消</s-button>
          </s-form-item>
        </s-form>
      </s-scrollbar>
    </s-drawer>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      let checkRepeatName = (rule, value, callback) => {  // 校验重复邮箱
        if (value) {
          $axios.post(`/iamUserInfo/checkEmail`, {name: value}).then((res) => {
            if (res.data.state === false) {
              callback(new Error('该邮箱已经存在！'));
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      };
      let checkWorkPosition = (rule, value, callback) => { // 校验重复工号
        if (value) {
          $axios.get(`/iamUserInfo/checkWorkPosition/${value}`).then((res) => {
            if (res.data.state === false) {
              callback(new Error('该工号已经存在！'));
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      };
      // let validatorLargerDate = (rule, value, callback) => {
      //   if (value && new Date(value) - new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)).getTime() < 0) {
      //     callback(new Error('请选择明天的日期时间'));
      //   } else {
      //     callback();
      //   }
      // }
      return {
        userWorkPosition: [Validaters.Max(18), {validator: checkWorkPosition, trigger: 'blur'}],
        // usedate: [{validator: validatorLargerDate, trigger: 'blur'}], // 大于当前日期
        userMail: [
          Validaters.Email,
          Validaters.Max(50),
          {validator: checkRepeatName, trigger: 'blur'}
        ],
        multiple: false,
        fullscreenLoading: false,
        nowUserData: {},
        // userarr: [], // 人员下拉框数据
        // oranginazearr: [], // 组织机构
        // rolearr: [], // 角色
        serviceRequestList: [],     // 服务请求条目列表
        serviceRequestUuid: '',     // 当前设计器的uuid
        drawerTitle: '',            // 抽屉标题(服务请求名称)
        drawValue: false,           // 左侧抽屉显示/隐藏
        serviceRequestDetail: [],   // 当前服务请求的定义详情
        serviceRequestForm: {},     // 当前服务请求设计器生成的表单数据
        serviceRequestFormRules: {}, // 当前服务请求设计器生成的表单验证规则
        iconColorAry: ['#60acfc', '#9287e7', '#5bc49f', '#60acfc', '#36cec8']
      }
    },
    computed: {
      serviceRequestAccess() {
        let serviceRequest = this.$store.state.processCenter.rolePro.service;
        return serviceRequest < 0 || serviceRequest === null;
      },
      userarr() {
        return this.$store.state.serviceRequest.userList; // 人员下拉框数据
      },
      oranginazearr() {
        return this.$store.state.serviceRequest.departList; // 机构下拉框数据
      },
      rolearr() {
        return this.$store.state.serviceRequest.roleList; // 角色下拉框数据
      },
      dimissionarr() {
        return this.$store.state.serviceRequest.dimissionList; // 离职人员下拉框数据
      }
    },
    watch: {
      drawValue(val) {
        this.$nextTick(function() {
          this.$refs.serviceRequestForm.clearValidate();
        })
      },
      // 监视props接收的数据，为true代表人员机构角色下拉框数据请求完成
      res: function(val, oldval) {
        if (val) {
          this.getServiceRequestList();     // 获取已保存(不包含预览状态)服务请求设计器条目列表
        }
      }
    },
    methods: {
      // 给内置设计器日期做限制
      timechange(item) {
        // 权限申请
        if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002' && item.colnumName === '开始时间') {
          let start = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee290'] ? new Date(this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee290']).getTime() : 0
          let end = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee291'] ? new Date(this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee291']).getTime() : 0
          if (end) {
            if (start >= end) {
              this.$message({
                type: 'warning',
                message: '开始时间必须小于结束时间！'
              })
              this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee290'] = null;
            }
          }
        } else if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002' && item.colnumName === '结束时间') {
          let start = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee290'] ? new Date(this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee290']).getTime() : 0
          let end = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee291'] ? new Date(this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee291']).getTime() : 0
          if (start) {
            if (start >= end) {
              this.$message({
                type: 'warning',
                message: '结束时间必须大于开始时间！'
              })
              this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee291'] = null;
            }
          }
        }
      },
      timeFormat(name) {
        if (this.serviceRequestUuid === '1c350009600748dfacaffd8a5734d211' && name === '入职日期') { // 入职
          return 'yyyy-MM-dd';
        } else if (this.serviceRequestUuid === '2c350009600748dfacaffd8a5734d222' && name === '最后工作日期') { // 离职
          return 'yyyy-MM-dd';
        } else if (this.serviceRequestUuid === '2c350009600748dfacaffd8a5734d222' && name === '入职日期') { // 离职
          return 'yyyy-MM-dd';
        } else if (this.serviceRequestUuid === '3c350009600748dfacaffd8a5734d233' && name === '最后工作日期') { // 工作移交
          return 'yyyy-MM-dd';
        } else if (this.serviceRequestUuid === '4c350009600748dfacaffd8a5734d244' && name === '入职日期') { // 返聘
          return 'yyyy-MM-dd';
        } else if (this.serviceRequestUuid === '5c350009600748dfacaffd8a5734d255' && name === '生效日期') { // 调岗
          return 'yyyy-MM-dd';
        } else if (this.serviceRequestUuid === '5c350009600748dfacaffd8a5734d255' && name === '入职日期') { // 调岗
          return 'yyyy-MM-dd';
        } else {
          if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002' && name === '开始时间') {
            return 'yyyy-MM-dd HH:mm:ss';
          } else if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002' && name === '结束时间') {
            return 'yyyy-MM-dd HH:mm:ss';
          } else {
            return 'yyyy-MM-dd';
          }
          // return 'yyyy-MM-dd HH:mm:ss';
        }
      },
      timeFormatx(name) {
        if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002' && name === '开始时间') {
          return 'yyyy-MM-dd HH:mm:ss';
        } else if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002' && name === '结束时间') {
          return 'yyyy-MM-dd HH:mm:ss';
        } else {
          return 'yyyy-MM-dd 00:00:00';
        }
      },
      pickeroptions(name) {
        if (name === '生效日期') {
          return {
            disabledDate(time) {
              return time.getTime() < new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0, 0, 0, 0)).getTime()
            }
          }
        } else if (this.serviceRequestUuid === '2c350009600748dfacaffd8a5734d222' && name === '最后工作日期') { // 离职
          return {
            disabledDate(time) {
              return time.getTime() < new Date(new Date(new Date().setDate(new Date().getDate())).setHours(0, 0, 0, 0)).getTime()
            }
          }
        } else {
          return ''
        }
      },
      // 获取所有(已保存/预览状态)服务请求设计器条目列表
      getAllServiceRequestList() {
        $axios.get('/itilServiceRequest/getDesignerPreview').then(({data}) => {
          if (data && data instanceof Array) {
            this.serviceRequestList = data;
          }
        });
      },
      // 获取已保存(不包含预览状态)服务请求设计器条目列表
      getServiceRequestList() {
        $axios.get('/itilServiceRequest/getDesigner').then(({data}) => {
          this.fullscreenLoading = false;
          if (data && data instanceof Array) {
            this.serviceRequestList = data;
          }
        });
      },
      // 打开右侧抽屉(服务请求设计器表单详情)
      showDrawer(node) {
        this.serviceRequestUuid = node.uuid;
        this.drawerTitle = node.requestName;   // 标题(请求名称)
        let inlayarr = this.$store.state.serviceRequest.inlayarr;// 所有内置设计器uuid数组
        // 判断服务请求设计器是否内置
        if (inlayarr.indexOf(node.uuid) !== -1) { // 是内置设计器
          // 查看服务请求设计器配置是否完整
          $axios.get(`/itilServiceRequest/viewRequestPropertiesFullOrNot/${node.uuid}`).then((res) => {
            if (res.status === 200) {
              if (res.data.state === true) { // 完整
                // 获取当前点击的服务请求条目的详情
                this.getServiceRequestAttr().then(() => {
                  // this.drawValue = true;
                });
              } else {
                this.$message.warning(res.data.errormsg);
                return;
              }
            }
          })
        } else {
          // 获取当前点击的服务请求条目的详情
            this.getServiceRequestAttr().then(() => {
              // this.drawValue = true;
            });
        }
      },
      // 获服当前服务请求设计器的表单详情
      getServiceRequestAttr() {
        let _this = this;
        return new Promise((resolve, reject) => {
          $axios.get(`/itilServiceRequest/getAttr/${this.serviceRequestUuid}`).then(({data}) => {
            if (data && data instanceof Array) {
            // 构造表单绑定的数据对象
              _this.serviceRequestForm = {};
              _this.serviceRequestFormRules = {};
              data.forEach(item => {
                this.$set(this.serviceRequestForm, item.uuid, null);
                this.$set(this.serviceRequestFormRules, item.uuid, []);
                /* 构建form验证规则 */
                /* 根据表单字段isRequired判断是否必选 */
                if (item.isRequired) {
                  if (item.colnumName === '当前人员角色') {
                    this.$set(this.serviceRequestFormRules, item.uuid, [Validaters.SelectArrNotNull]);
                  } else {
                    this.$set(this.serviceRequestFormRules, item.uuid, [Validaters.NotNull]);
                  }
                }
                /* 根据表单字段htmlType判断是否数值 */
                if (item.htmlType === 'udf_long') {
                  this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Max(30));
                } else if (item.htmlType === 'udf_char_single_line') {
                  this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Max(30));
                }

                /* 给内置设计器设置校验规则和默认值 */
                if (_this.$store.state.serviceRequest.inlayarr.indexOf(_this.serviceRequestUuid) !== -1) {
                  // 给内置设计器设置规则
                  if (item.colnumName === 'Email') {
                    _this.serviceRequestFormRules[item.uuid] = _this.serviceRequestFormRules[item.uuid].concat(_this.userMail)
                    // _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Email);
                  } else if (item.colnumName === '身份证号码') {
                    _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.IdCard);
                  } else if (item.colnumName === '手机号码') {
                    _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Max(20), Validaters.MobilePhone);
                    // this.$set(this.serviceRequestFormRules, item.uuid, arr);
                  } else if (item.colnumName === '微信号') {
                    _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Max(30));
                    // this.$set(this.serviceRequestFormRules, item.uuid, arr);
                  } else if (item.colnumName === '备注') {
                    _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Max(120));
                    // this.$set(this.serviceRequestFormRules, item.uuid, arr);
                  } else if (item.colnumName === '个人地址') {
                    _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Max(30));
                    // this.$set(this.serviceRequestFormRules, item.uuid, arr);
                  } else if (item.colnumName === '工号') {
                    _this.serviceRequestFormRules[item.uuid] = _this.serviceRequestFormRules[item.uuid].concat(_this.userWorkPosition)
                  } else if (item.colnumName === '所属机构') {
                    _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.SelectValNotNull);
                  }
                  /* 设置下拉框初始值 */
                  if (item.colnumName === '所属机构' || item.colnumName === '原组织机构' || item.colnumName === '转入部门') {
                    this.$set(item, 'listvalues', _this.oranginazearr);
                  } else if (item.colnumName === '实际离职人' || item.colnumName === '实际申请人' || item.colnumName === '实际调岗人' || item.colnumName === '申请人姓名' || item.colnumName === '工作移交人') {
                    this.$set(item, 'listvalues', _this.userarr);
                  } else if (item.colnumName === '当前人员角色') {
                    this.$set(this.serviceRequestForm, item.uuid, []);
                    this.$set(item, 'listvalues', _this.rolearr);
                  }

                  if (item.colnumName === '备注') {
                    item.type = 'textarea';
                  }

                  // 设置默认数据
                  if (_this.serviceRequestUuid === '1c350009600748dfacaffd8a5734d211') { // 入职申请
                    if (item.colnumName === '真实姓名') {
                      _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.Name, Validaters.Max(30));
                    }
                    if (item.colnumName === '入职日期') {
                      // _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.LargerNowDate);
                    } else if (item.colnumName === '人员类型') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, '内部人员');
                      })
                    } else if (item.colnumName === '是否VIP') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, '否');
                      })
                    } else if (item.colnumName === '性别') {
                      // this.$nextTick(function() {
                      //   this.$set(this.serviceRequestForm, item.uuid, '保密');
                      // })
                    }
                  } else if (_this.serviceRequestUuid === '2c350009600748dfacaffd8a5734d222') { // 离职申请
                    if (item.colnumName === '实际离职人') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.realNameAndEmail);
                      })
                    } else if (item.colnumName === '所属机构') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.departName);
                      })
                    } else if (item.colnumName === '岗位') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.position);
                      })
                    } else if (item.colnumName === '入职日期') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.entryTimeStr);
                      })
                    } else if (item.colnumName === '最后工作日期') {
                      // _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.LargerNowDate);
                    }
                  } else if (_this.serviceRequestUuid === '3c350009600748dfacaffd8a5734d233') { // 工作移交申请
                    if (item.colnumName === '实际申请人') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.realNameAndEmail);
                      })
                    } else if (item.colnumName === '最后工作日期') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.leaveTimeStr);
                      })
                      // _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.LargerNowDate);
                    } else if (item.colnumName === '工作移交事项') {
                      item.type = 'textarea';
                    }
                  } else if (_this.serviceRequestUuid === '4c350009600748dfacaffd8a5734d244') { // 返聘申请
                    if (item.colnumName === '真实姓名') {
                      this.$set(item, 'listvalues', _this.dimissionarr);
                    }
                    // else if (item.colnumName === '工号') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userWorkPosition);
                    //   })
                    // } else if (item.colnumName === '所属机构') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.departName);
                    //   })
                    // } else if (item.colnumName === '岗位') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.position);
                    //   })
                    // } else if (item.colnumName === '人员类型') {
                    //   this.$nextTick(function() {
                    //     let type = '';
                    //     if (_this.nowUserData.userClassify === 1) {
                    //       type = '内部人员'
                    //     } else if (_this.nowUserData.userClassify === 2) {
                    //       type = '内部临时'
                    //     } else if (_this.nowUserData.userClassify === 3) {
                    //       type = '职能人员'
                    //     } else if (_this.nowUserData.userClassify === 4) {
                    //       type = '应用人员'
                    //     }
                    //     this.$set(this.serviceRequestForm, item.uuid, type);
                    //   })
                    // } else if (item.colnumName === '是否VIP') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.isVIP ? '是' : '否');
                    //   })
                    // } else if (item.colnumName === '性别') {
                    //   this.$nextTick(function() {
                    //     let type = '';
                    //     if (_this.nowUserData.userGender === 0) {
                    //       type = '保密'
                    //     } else if (_this.nowUserData.userGender === 1) {
                    //       type = '男'
                    //     } else if (_this.nowUserData.userGender === 2) {
                    //       type = '女'
                    //     }
                    //     this.$set(this.serviceRequestForm, item.uuid, type);
                    //   })
                    // } else if (item.colnumName === '身份证号码') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.idCard);
                    //   })
                    // } else if (item.colnumName === 'Email') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userMail);
                    //   })
                    // } else if (item.colnumName === '最高学历') {
                    //   this.$nextTick(function() {
                    //     let type = '';
                    //     if (_this.nowUserData.lastEducation === 1) {
                    //       type = '初中及以下'
                    //     } else if (_this.nowUserData.lastEducation === 2) {
                    //       type = '中专/中技'
                    //     } else if (_this.nowUserData.lastEducation === 3) {
                    //       type = '高中'
                    //     } else if (_this.nowUserData.lastEducation === 4) {
                    //       type = '大专'
                    //     } else if (_this.nowUserData.lastEducation === 5) {
                    //       type = '本科'
                    //     } else if (_this.nowUserData.lastEducation === 6) {
                    //       type = '硕士'
                    //     } else if (_this.nowUserData.lastEducation === 7) {
                    //       type = '博士'
                    //     }
                    //     this.$set(this.serviceRequestForm, item.uuid, type);
                    //   })
                    // } else if (item.colnumName === '最高学历学校') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.lastSchool);
                    //   })
                    // } else if (item.colnumName === '工作地点') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.workLocation);
                    //   })
                    // } else if (item.colnumName === '直接汇报领导') {
                    //   this.$nextTick(function() {
                    //     // this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.directLeaderName);
                    //     $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${_this.nowUserData.departUuid}`).then(({data}) => {
                    //       if (data instanceof Array) {
                    //         let arr = data.map(function(item) {
                    //           item.listvalues = item.realNameAndEmail
                    //           return item
                    //         })
                    //         _this.$set(_this.serviceRequestForm, item.uuid, _this.nowUserData.directLeaderName);
                    //         _this.$set(item, 'listvalues', arr)
                    //       }
                    //     });
                    //   })
                    // } else if (item.colnumName === '备注') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.remark);
                    //   })
                    // } else if (item.colnumName === '手机号码') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userCellphone);
                    //   })
                    // } else if (item.colnumName === '微信号') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userWechat);
                    //   })
                    // } else if (item.colnumName === '个人地址') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userAddress);
                    //   })
                    // } else if (item.colnumName === '办公号码') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userPhone);
                    //   })
                    // } else if (item.colnumName === '短号号码') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userShortNumber);
                    //   })
                    // } else if (item.colnumName === '工位') {
                    //   this.$nextTick(function() {
                    //     this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.userWorkStation);
                    //   })
                    // }
                  } else if (_this.serviceRequestUuid === '5c350009600748dfacaffd8a5734d255') { // 调岗申请
                    if (item.colnumName === '实际调岗人') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.realNameAndEmail);
                      })
                    } else if (item.colnumName === '原组织机构') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.departName);
                      })
                    } else if (item.colnumName === '原岗位') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.position);
                      })
                    } else if (item.colnumName === '入职日期') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.entryTimeStr);
                      })
                    } else if (item.colnumName === '生效日期') {
                      // _this.serviceRequestFormRules[item.uuid] = _this.serviceRequestFormRules[item.uuid].concat(_this.usedate)
                    }
                  } else if (_this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002') { // 权限申请
                    if (item.colnumName === '人员类型') {
                      this.$nextTick(function() {
                        let type = '';
                        if (_this.nowUserData.userClassify === 1) {
                          type = '内部人员'
                        } else if (_this.nowUserData.userClassify === 2) {
                          type = '内部临时'
                        } else if (_this.nowUserData.userClassify === 3) {
                          type = '职能人员'
                        } else if (_this.nowUserData.userClassify === 4) {
                          type = '应用人员'
                        }
                        this.$set(this.serviceRequestForm, item.uuid, type);
                      })
                    } else if (item.colnumName === '实际申请人') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.realNameAndEmail);
                      })
                    } else if (item.colnumName === '所属机构') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.departName);
                      })
                    } else if (item.colnumName === '岗位') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.position);
                      })
                    } else if (item.colnumName === '当前人员角色') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.roleName.split(','));
                      })
                    } else if (item.colnumName === '开始时间') {
                      _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.LargerNowDate);
                    } else if (item.colnumName === '结束时间') {
                      _this.serviceRequestFormRules[item.uuid].splice(0, 0, Validaters.LargerNowDate);
                    } else if (item.colnumName === '权限申请详述') {
                      item.type = 'textarea';
                    }
                  } else if (_this.serviceRequestUuid === 'f61be2aad5714309a9cab251eab9a175') { // IP地址请求
                    if (item.colnumName === '申请人姓名') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.realNameAndEmail);
                      })
                    } else if (item.colnumName === '所属机构') {
                      this.$nextTick(function() {
                        this.$set(this.serviceRequestForm, item.uuid, _this.nowUserData.departName);
                      })
                    } else if (item.colnumName === '请求资产') {
                      item.type = 'textarea';
                      item.placeholder = '输入格式: 资产名称:资产第三级分类”,多个资产用英文逗号隔开'
                    }
                  }
                }
              });
              if (_this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002') { // 权限申请表单排序
                let obj = data.find(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee283' });
                let index = data.findIndex(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee283' });
                if (obj && index) {
                  data.splice(index, 1);
                  data.splice(0, 0, obj);
                }
                let objtype = data.find(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee225' });
                let indextype = data.findIndex(function(item) { return item.uuid === 'a0e7d489bc0246e69d38c0d51e3ee225' });
                if (indextype && objtype) {
                  data.splice(indextype, 1);
                  data.splice(3, 0, objtype);
                }
              }
              this.serviceRequestDetail = data;
              this.drawValue = true;
              resolve();
            } else reject();
          });
        });
      },
      /* 当人员下拉框变动时其他字段做相应变化 */
      selectChange(event, item) {
        let _this = this;
        let detail = _this.serviceRequestDetail // 当前服务请求的定义详情
        // let form = _this.serviceRequestForm // 当前表单数据
        let userData = {};
        for (let i in this.userarr) {
          if (this.userarr[i].realNameAndEmail === event) {
            userData = this.userarr[i];
          }
        }
        if (_this.serviceRequestUuid === '1c350009600748dfacaffd8a5734d211') { // 入职申请
          if (item.colnumName === '所属机构') {
            let departuuid = '';
            item.listvalues.forEach(function(list) {
              if (list.listvalues === _this.serviceRequestForm[item.uuid]) {
                departuuid = list.uuid
              }
            })
            detail.forEach((obj, index) => {
              if (obj.colnumName === '直接汇报领导') {
                $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${departuuid}`).then(({data}) => {
                  if (data instanceof Array) {
                    let arr = data.map(function(item) {
                      item.listvalues = item.realNameAndEmail
                      return item
                    })
                    _this.$set(_this.serviceRequestForm, obj.uuid, null);
                    _this.$set(detail[index], 'listvalues', arr)
                  }
                });
              }
            })
          }
        } else if (_this.serviceRequestUuid === '2c350009600748dfacaffd8a5734d222') { // 离职申请
          if (item.colnumName === '实际离职人') {
            detail.forEach((obj) => {
              if (obj.colnumName === '所属机构') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.departName);
              } else if (obj.colnumName === '岗位') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.position);
              } else if (obj.colnumName === '入职日期') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.entryTimeStr);
              }
            })
          }
        } else if (_this.serviceRequestUuid === '3c350009600748dfacaffd8a5734d233') { // 工作移交申请
          if (item.colnumName === '实际申请人') {
            detail.forEach((obj) => {
              if (obj.colnumName === '最后工作日期') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.leaveTimeStr);
              }
            })
          }
        } else if (_this.serviceRequestUuid === '4c350009600748dfacaffd8a5734d244') { // 返聘申请
          if (item.colnumName === '所属机构') {
            let departuuid = '';
            item.listvalues.forEach(function(list) {
              if (list.listvalues === _this.serviceRequestForm[item.uuid]) {
                departuuid = list.uuid
              }
            })
            detail.forEach((obj, index) => {
              if (obj.colnumName === '直接汇报领导') {
                $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${departuuid}`).then(({data}) => {
                  if (data instanceof Array) {
                    let arr = data.map(function(item) {
                      item.listvalues = item.realNameAndEmail
                      return item
                    })
                    _this.$set(_this.serviceRequestForm, obj.uuid, null);
                    _this.$set(detail[index], 'listvalues', arr)
                  }
                });
              }
            })
          }
          if (item.colnumName === '真实姓名') {
            let permission = {};
            for (let i in this.dimissionarr) {
              if (this.dimissionarr[i].realNameAndEmail === event) {
                permission = this.dimissionarr[i];
              }
            }
            detail.forEach((obj, index) => {
                if (obj.colnumName === '工号') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userWorkPosition);
                } else if (obj.colnumName === '所属机构') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.departName);
                } else if (obj.colnumName === '岗位') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.position);
                } else if (obj.colnumName === '人员类型') {
                    let type = '';
                    if (permission.userClassify === 1) {
                      type = '内部人员'
                    } else if (permission.userClassify === 2) {
                      type = '内部临时'
                    } else if (permission.userClassify === 3) {
                      type = '职能人员'
                    } else if (permission.userClassify === 4) {
                      type = '应用人员'
                    }
                    _this.$set(_this.serviceRequestForm, obj.uuid, type);
                } else if (obj.colnumName === '是否VIP') {
                    _this.$set(_this.serviceRequestForm, obj.uuid, permission.isVIP ? '是' : '否');
                } else if (obj.colnumName === '性别') {
                    let type = '';
                    if (permission.userGender === 0) {
                      type = '保密'
                    } else if (permission.userGender === 1) {
                      type = '男'
                    } else if (permission.userGender === 2) {
                      type = '女'
                    }
                    _this.$set(_this.serviceRequestForm, obj.uuid, type);
                } else if (obj.colnumName === '身份证号码') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.idCard);
                } else if (obj.colnumName === 'Email') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userMail);
                } else if (obj.colnumName === '最高学历') {
                    let type = '';
                    if (permission.lastEducation === 1) {
                      type = '初中及以下'
                    } else if (permission.lastEducation === 2) {
                      type = '中专/中技'
                    } else if (permission.lastEducation === 3) {
                      type = '高中'
                    } else if (permission.lastEducation === 4) {
                      type = '大专'
                    } else if (permission.lastEducation === 5) {
                      type = '本科'
                    } else if (permission.lastEducation === 6) {
                      type = '硕士'
                    } else if (permission.lastEducation === 7) {
                      type = '博士'
                    }
                    _this.$set(_this.serviceRequestForm, obj.uuid, type);
                } else if (obj.colnumName === '最高学历学校') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.lastSchool);
                } else if (obj.colnumName === '工作地点') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.workLocation);
                } else if (obj.colnumName === '直接汇报领导') {
                  if (permission.departUuid) {
                    $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${permission.departUuid}`).then(({data}) => {
                      if (data instanceof Array) {
                        let arr = data.map(function(item) {
                          item.listvalues = item.realNameAndEmail
                          return item
                        })
                        _this.$set(_this.serviceRequestForm, obj.uuid, permission.directLeaderName);
                        _this.$set(detail[index], 'listvalues', arr)
                      }
                    });
                  } else {
                    _this.$set(_this.serviceRequestForm, obj.uuid, null);
                    _this.$set(detail[index], 'listvalues', [])
                  }
                } else if (obj.colnumName === '备注') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.remark);
                } else if (obj.colnumName === '手机号码') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userCellphone);
                } else if (obj.colnumName === '微信号') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userWechat);
                } else if (obj.colnumName === '个人地址') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userAddress);
                } else if (obj.colnumName === '办公号码') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userPhone);
                } else if (obj.colnumName === '短号号码') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userShortNumber);
                } else if (obj.colnumName === '工位') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.userWorkStation);
                } else if (obj.colnumName === '入职日期') {
                  _this.$set(_this.serviceRequestForm, obj.uuid, permission.entryTimeStr);
                }
            })
          }
        } else if (_this.serviceRequestUuid === '5c350009600748dfacaffd8a5734d255') { // 调岗申请
          if (item.colnumName === '实际调岗人') {
            detail.forEach((obj) => {
              if (obj.colnumName === '原组织机构') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.departName);
              } else if (obj.colnumName === '原岗位') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.position);
              } else if (obj.colnumName === '入职日期') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.entryTimeStr);
              }
            })
          }
        } else if (_this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002') { // 权限申请
          if (item.colnumName === '实际申请人') {
            detail.forEach((obj) => {
              if (obj.colnumName === '所属机构') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.departName);
              } else if (obj.colnumName === '岗位') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.position);
              } else if (obj.colnumName === '人员类型') {
                let type = '';
                if (userData.userClassify === 1) {
                  type = '内部人员'
                } else if (userData.userClassify === 2) {
                  type = '内部临时'
                } else if (userData.userClassify === 3) {
                  type = '职能人员'
                } else if (userData.userClassify === 4) {
                  type = '应用人员'
                }
                _this.$set(_this.serviceRequestForm, obj.uuid, type);
              } else if (obj.colnumName === '当前人员角色') {
                let arr = userData.roleName ? userData.roleName.split(',') : [];
                _this.$set(_this.serviceRequestForm, obj.uuid, arr);
              }
            })
          }
        } else if (_this.serviceRequestUuid === 'f61be2aad5714309a9cab251eab9a175') { // IP地址请求
          if (item.colnumName === '申请人姓名') {
            detail.forEach((obj) => {
              if (obj.colnumName === '所属机构') {
                _this.$set(_this.serviceRequestForm, obj.uuid, userData.departName);
              }
            })
          }
        }
      },
      // 保存/提交设计器表单  0-保存，1-提交
      saveServiceRequestForm(saveType) {
        let _this = this;
        // 离职、调岗、工作移交、权限、IP//判断申请人是否可以重复提交申请接口
        if (this.serviceRequestUuid === '2c350009600748dfacaffd8a5734d222') { // 离职
            let username = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee242'];
            let userUuid = '';
            for (let i in this.userarr) {
              if (this.userarr[i].listvalues === username) {
                userUuid = this.userarr[i].uuid;
              }
            }
          $axios.get(`/itilServiceRequest/checkRepeatCommitByIamItil/${this.serviceRequestUuid}/${userUuid}`).then(res => {
            if (res.status === 200) {
              if (res.data.state === true) {
                save();
              } else {
                this.$message({type: 'error', message: res.data.errormsg})
              }
            }
          })
        } else if (this.serviceRequestUuid === '3c350009600748dfacaffd8a5734d233') { // 工作移交 检查实际申请人是否可以申请工作移交接口
            let username = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee249'];
            let userUuid = '';
            for (let i in this.userarr) {
              if (this.userarr[i].listvalues === username) {
                userUuid = this.userarr[i].uuid;
              }
            }
            $axios.get(`/itilServiceRequest/checkRepeatCommitByIamItil/${this.serviceRequestUuid}/${userUuid}`).then(resp => {
              if (resp.status === 200) {
                if (resp.data.state === true) {
                  $axios.get(`/itilServiceRequest/checkWhetherOrNotCanWorkHandover/${userUuid}`).then(res => {
                    if (res.status === 200) {
                      if (res.data.state === true) {
                        save();
                      } else {
                        this.$message({type: 'error', message: res.data.errormsg})
                      }
                    }
                  })
                } else {
                  this.$message({type: 'error', message: resp.data.errormsg})
                }
              }
            })
        } else if (this.serviceRequestUuid === '5c350009600748dfacaffd8a5734d255') { // 调岗
            let username = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee274'];
            let userUuid = '';
            for (let i in this.userarr) {
              if (this.userarr[i].listvalues === username) {
                userUuid = this.userarr[i].uuid;
              }
            }
          $axios.get(`/itilServiceRequest/checkRepeatCommitByIamItil/${this.serviceRequestUuid}/${userUuid}`).then(res => {
            if (res.status === 200) {
              if (res.data.state === true) {
                save();
              } else {
                this.$message({type: 'error', message: res.data.errormsg})
              }
            }
          })
        } else if (this.serviceRequestUuid === 'bc350009600748dfacaffd8a5734d002') { // 权限申请
            let username = this.serviceRequestForm['a0e7d489bc0246e69d38c0d51e3ee283'];
            let userUuid = '';
            for (let i in this.userarr) {
              if (this.userarr[i].listvalues === username) {
                userUuid = this.userarr[i].uuid;
              }
            }
          $axios.get(`/itilServiceRequest/checkRepeatCommitByIamItil/${this.serviceRequestUuid}/${userUuid}`).then(res => {
            if (res.status === 200) {
              if (res.data.state === true) {
                save();
              } else {
                this.$message({type: 'error', message: res.data.errormsg})
              }
            }
          })
        } else if (this.serviceRequestUuid === 'f61be2aad5714309a9cab251eab9a175') { // IP申请
            let username = this.serviceRequestForm['8f4a1dc904294b7989fda9dadc5d00df'];
            let userUuid = '';
            for (let i in this.userarr) {
              if (this.userarr[i].listvalues === username) {
                userUuid = this.userarr[i].uuid;
              }
            }
          $axios.get(`/itilServiceRequest/checkRepeatCommitByIamItil/${this.serviceRequestUuid}/${userUuid}`).then(res => {
            if (res.status === 200) {
              if (res.data.state === true) {
                save();
              } else {
                this.$message({type: 'error', message: res.data.errormsg})
              }
            }
          })
        } else {
          save();
        }
        function save() {
          _this.$refs.serviceRequestForm.validate(valid => {
            if (valid) {
              let uuid = _this.serviceRequestUuid;  // 设计器uuid
              let values = [];   // 表单数据
              for (let key in _this.serviceRequestForm) {
                if (_this.serviceRequestForm[key] && _this.serviceRequestForm[key] instanceof Array) {
                  values.push({attributeUuid: key, attributeValue: _this.serviceRequestForm[key].join(',')});
                } else {
                  values.push({attributeUuid: key, attributeValue: _this.serviceRequestForm[key]});
                }
              }
              // 0-保存，1-提交
              $axios.post(`/itilServiceRequest/saveApproveMapping/${uuid}/${saveType}`, values).then(({data}) => {
                if (typeof data === 'string' && data.includes('success')) {
                  // 提交成功时，继续调用接单接口
                  if (saveType === '1') {
                    let orderUuid = data.split('|').reverse()[0];   // 获取返回的工单uuid
                    $axios.get(`/itilServiceRequest/orderTakling/${orderUuid}`).then(({data}) => {
                      if (data.state === true) console.info('success');
                      else console.error('error');
                    });
                  }
                  _this.getServiceRequestList();     // 刷新服务请求设计器目录列表
                  _this.$message.success(`${saveType === '0' ? '保存' : '提交'}成功！`);
                  _this.drawValue = false;
                } else {
                  _this.$message.error(`${saveType === '0' ? '保存' : '提交'}失败，请重试！`);
                }
              });
            } else {
              return false;
            }
          });
        }
      }
    },
    props: ['res'],
    created() {
      this.fullscreenLoading = true;
      this.nowUserData = this.$store.state.userData;
      // 用户机构角色三个接口都请求完成才关闭遮罩层
      if (this.res) {
        this.getServiceRequestList();     // 获取已保存(不包含预览状态)服务请求设计器条目列表
      }
    //   let self = this;
    //   // 人员下拉框数据
    //   let getuser = function() {
    //     return $axios.get('/itilServiceRequest/userListForItil').then(res => {
    //       let arr = res.data;
    //       let userarr = arr.map(function(item) {
    //         item.listvalues = item.realNameAndEmail
    //         return item
    //       })
    //       self.$store.commit('setUserList', userarr);
    //     })
    //   }
    //   // 组织机构下拉框数据
    //   let oranginaze = function() {
    //     return $axios.get('/iamUserInfo/getDepartList').then(res => {
    //       let arr = res.data;
    //       let oranginazearr = arr.map(function(item) {
    //         return {uuid: item.uuid, listvalues: item.departName}
    //       })
    //       self.$store.commit('setDepartList', oranginazearr);
    //     })
    //   }
    //   // 角色下拉框数据
    //   let role = function() {
    //     return $axios.get('/iamUserInfo/getRoleList').then(res => {
    //       let arr = res.data;
    //       let rolearr = arr.map(function(item) {
    //         return {uuid: item.uuid, listvalues: item.roleName}
    //       })
    //       self.$store.commit('setRoleList', rolearr);
    //     })
    //   }
    //   Promise.all([getuser(), oranginaze(), role()]).then(function () {
    //     // 3个请求现在都执行完成
    //     self.getServiceRequestList();     // 获取已保存(不包含预览状态)服务请求设计器条目列表
    //   });
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #viewServiceRequest
    padding 5px 10px 10px
    .no-data-ctn
      height calc(100vh - 190px) !important
    .serviceRequestLists
      width 100%
      min-height 200px
      & .image-asset
        cursor pointer
        width 150px
        height 150px
        padding 0 5px
        margin 5px 10px 5px 0
        float left
        p.request-name
          font-size 14px
          width 150px
          margin-top 10px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
    .max-drawer-height
      max-height calc(100vh - 100px)
</style>
