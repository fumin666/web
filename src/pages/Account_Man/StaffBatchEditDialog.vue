<template>
  <s-scrollbar wrap-style="max-height:450px;" id="batchEditMan">
    <s-collapse v-model="activeName" accordion>
        <s-collapse-item title="人员信息" name="1">
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm1" label-width="125px"  class="custom-form">
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.departUuid"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="所属机构" prop="departUuid">
                  <s-select :disabled="!chooseEditItem.departUuid" style="width: 100%" v-model="staffForm.departUuid" filterable placeholder="请选择所属机构">
                    <s-option v-for="depart in departOptions" :label="depart.departName" :value="depart.uuid" :key="depart.uuid"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <!--动态属性-->
            <div v-for="(item, $idx) in peopleAttributeData" :key="$idx">
              <!--内置属性-->
              <div v-if="item.internalFlag">
                <s-row type="flex" justify="start" align="middle">
                  <s-col span="1">
                    <s-checkbox v-model="chooseEditItem[item.propertyKey]" @change="changeRulesDynamic($event, item.propertyKey, item.requiredValueFlag)"></s-checkbox>
                  </s-col>
                  <s-col span="23">
                    <s-form-item
                      v-if="item.propertyType === 1"
                      :label="item.propertyName"
                      :title="item.propertyName"
                      :prop="item.propertyKey">
                      <s-input
                        :disabled="!chooseEditItem[item.propertyKey]"
                        placeholder="请输入内容"
                        v-model="staffForm[item.propertyKey]">
                      </s-input>
                    </s-form-item>
                    <s-form-item
                      :label="item.propertyName"
                      :title="item.propertyName"
                      :prop="item.propertyKey"
                      v-else>
                      <s-select
                        :disabled="!chooseEditItem[item.propertyKey]"
                        :clearable="true"
                        placeholder="请选择"
                        v-if="item.propertyType === 3"
                        v-model="staffForm[item.propertyKey]">
                        <s-option
                          v-for="(option, index) in item.dropDownOptionList"
                          :label="option.name"
                          :value="option.value"
                          :key="index"></s-option>
                      </s-select>
                      <s-date-picker
                        :disabled="!chooseEditItem[item.propertyKey]"
                        v-else-if="item.propertyType === 4"
                        v-model="staffForm[item.propertyKey]"
                        :editable="false"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        clearable
                        placeholder="选择日期">
                      </s-date-picker>
                      <s-input
                        v-else
                        :disabled="!chooseEditItem[item.propertyKey]"
                        placeholder="请输入数值"
                        v-model="staffForm[item.propertyKey]"></s-input>
                    </s-form-item>
                  </s-col>
                </s-row>
              </div>
              <!--自定义属性-->
              <div v-else>
                <s-row type="flex" justify="start" align="middle">
                  <s-col span="1">
                    <s-checkbox v-model="chooseEditItem[item.propertyKey]" @change="changeRulesDynamicCustom($event, item.propertyKey, item.requiredValueFlag)"></s-checkbox>
                  </s-col>
                  <s-col span="23">
                    <s-form-item
                      v-if="item.propertyType === 1"
                      :label="item.propertyName"
                      :title="item.propertyName"
                      :prop="`customProperty.${item.propertyKey}`">
                      <s-input
                        :disabled="!chooseEditItem[item.propertyKey]"
                        placeholder="请输入内容"
                        v-model="staffForm.customProperty[item.propertyKey]">
                      </s-input>
                    </s-form-item>
                    <s-form-item
                      :label="item.propertyName"
                      :title="item.propertyName"
                      :prop="`customProperty.${item.propertyKey}`"
                      v-else>
                      <s-select
                        :disabled="!chooseEditItem[item.propertyKey]"
                        :clearable="true"
                        placeholder="请选择"
                        v-if="item.propertyType === 3"
                        v-model="staffForm.customProperty[item.propertyKey]">
                        <s-option
                          v-for="(option, index) in item.dropDownOptionList"
                          :label="option.name"
                          :value="option.value"
                          :key="index"></s-option>
                      </s-select>
                      <s-date-picker
                        :disabled="!chooseEditItem[item.propertyKey]"
                        v-else-if="item.propertyType === 4"
                        v-model="staffForm.customProperty[item.propertyKey]"
                        :editable="false"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        type="date"
                        clearable
                        placeholder="选择日期">
                      </s-date-picker>
                      <s-input
                        v-else
                        :disabled="!chooseEditItem[item.propertyKey]"
                        placeholder="请输入数值"
                        v-model="staffForm.customProperty[item.propertyKey]"></s-input>
                    </s-form-item>
                  </s-col>
                </s-row>
              </div>
            </div>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="账号信息" name="2">
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm2" label-width="125px"  class="custom-form">
            <s-row v-if="loginTypeShow" type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.loginTypeUuid"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="登录方式" prop="loginTypeUuid">
                  <s-select :disabled="!chooseEditItem.loginTypeUuid" style="width: 250px" v-model="staffForm.loginTypeUuid" placeholder="请选择登录方式" @change="handlerChange">
                    <s-option v-for="item in loginTypeList" :label="item.loginType" :value="item.uuid" :key="item.uuid"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.validTime"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="口令使用期限" class="validTime">
                  <div style="float: left">
                    <s-input-number style="width: 250px" v-model="staffForm.validTime" :min="0" :max="1000000000" :disabled="staffForm.validTime===0 || !chooseEditItem.validTime"></s-input-number>
                  </div>
                  <div style="float: left;margin-left: 8px; line-height: 30px">
                    <span class="unit">天</span>
                    <s-checkbox :disabled="!chooseEditItem.validTime" v-model="staffForm.validTime" :true-label="0" :false-label="1">永久使用</s-checkbox>
                  </div>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.userExpiryDateStr"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="账号到期时间" prop="userExpiryDateStr" class="fl">
                  <s-date-picker :disabled="!chooseEditItem.userExpiryDateStr || neveCheckValue" style="width: 250px"
                                 type="datetime" :editable="false"
                                 value-format="yyyy-MM-dd 00:00:00"
                                 clearable
                                 format="yyyy-MM-dd" placeholder="选择日期"
                                 :picker-options="pickerOptions"
                                 v-model="staffForm.userExpiryDateStr"></s-date-picker>
                </s-form-item>
                <div style="float: left;margin-left: 8px; line-height: 36px">
                  <s-checkbox :disabled="!chooseEditItem.userExpiryDateStr" v-model="neveCheckValue" @change="neveCheck">永不过期</s-checkbox>
                </div>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.userChangePasswd"></s-checkbox>
              </s-col>
              <s-col>
                <s-form-item label="下次登录修改口令" label-width="140px" prop="userChangePasswd">
                  <s-radio-group :disabled="!chooseEditItem.userChangePasswd" v-model="staffForm.userChangePasswd">
                    <s-radio :label="1">是</s-radio>
                    <s-radio :label="0">否</s-radio>
                  </s-radio-group>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.sysRoleUuidList"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="角色" prop="sysRoleUuidList">
                  <s-select :disabled="!chooseEditItem.sysRoleUuidList" style="width: 250px" v-model="staffForm.sysRoleUuidList" filterable multiple placeholder="请选择角色">
                    <s-option v-for="role in roleOptions" :label="role.roleName" :value="role.uuid" :key="role.uuid"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.ipType"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="规则类型" prop="ipType" class="ip-rule-box">
                  <s-select style="width: 200px" :disabled="!chooseEditItem.ipType" v-model="staffForm.ipType" placeholder="请选择规则">
                    <s-option label="允许登录" :value="1"></s-option>
                    <s-option label="拒绝登录" :value="0"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1" style="margin-top: -70px;">
                <s-checkbox v-model="chooseEditItem.userIpRule"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="IP规则" prop="userIpRule">
                  <s-input :disabled="!chooseEditItem.userIpRule" v-model="staffForm.userIpRule"  type='textarea' :rows="3" style="width: 435px"></s-input>
                  <s-tooltip class="tip"
                             content="支持对IPV4和IPV6地址进行限制。多个IP(段)以英文逗号分割(例如: *, 192.168.1.*, 192.168.[2,3].[1-5,15,25,35,45],FF01::101, FF01::101-FF01::AC01); '*'或不填表示不对登录IP地址做限制"
                             placement="right">
                    <i class="iconfont icon-help"></i>
                  </s-tooltip>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.pointTimes"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="多点并发数" prop="pointTimes">
                  <s-input :disabled="!chooseEditItem.pointTimes" v-model="staffForm.pointTimes" style="width: 95%"></s-input>
                  <s-tooltip class="tip" content="该字段标识了同一账号在同一资产上可登录的浏览器个数;'*'表示不对多点并发数做限制" placement="right">
                    <i class="iconfont icon-help"></i>
                  </s-tooltip>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.manyTimes"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="多次并发数" prop="manyTimes">
                  <s-input :disabled="!chooseEditItem.manyTimes" v-model="staffForm.manyTimes" style="width: 95%"></s-input>
                  <s-tooltip class="tip" content="该字段标识了同一账号在不同资产上可登录的个数;'*'表示不对多次并发数做限制" placement="right">
                    <i class="iconfont icon-help"></i>
                  </s-tooltip>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.userStatus"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="状态">
                  <s-select :disabled="!chooseEditItem.userStatus" style="width: 250px" @change="changeStatus" v-model="staffForm.userStatus">
                    <s-option v-for="item in status" :label="item.name" :value="item.val" :key="item.id"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
          </s-form>
        </s-collapse-item>
        <s-collapse-item title="入职信息" name="3" v-if="showInductionMsg">
          <s-form :model="staffForm" :rules="staffRule" ref="staffForm3" label-width="125px"  class="custom-form">
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.lastEducation"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="最高学历" prop="lastEducation">
                  <s-select :disabled="!chooseEditItem.lastEducation" style="width: 30%" v-model="staffForm.lastEducation" filterable placeholder="请选择最高学历">
                    <s-option label="初中及以下" :value="1"></s-option>
                    <s-option label="中专/中技" :value="2"></s-option>
                    <s-option label="高中" :value="3"></s-option>
                    <s-option label="大专" :value="4"></s-option>
                    <s-option label="本科" :value="5"></s-option>
                    <s-option label="硕士" :value="6"></s-option>
                    <s-option label="博士" :value="7"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.lastSchool"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="最高学历学校名称" prop="lastSchool" title="最高学历学校名称">
                  <s-input :disabled="!chooseEditItem.lastSchool" v-model="staffForm.lastSchool"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.entryTime"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="入职日期" prop="entryTime">
                  <s-date-picker
                    :disabled="!chooseEditItem.entryTime"
                    :editable="false"
                    value-format="yyyy-MM-dd 00:00:00"
                    format="yyyy-MM-dd"
                    v-model="staffForm.entryTime"
                    type="date"
                    clearable
                    placeholder="选择日期">
                  </s-date-picker>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.position"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="岗位" prop="position">
                  <s-input v-model="staffForm.position" :disabled="!chooseEditItem.position"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.userClassify"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="人员类型" prop="userClassify">
                  <s-select :disabled="!chooseEditItem.userClassify" style="width: 100%" v-model="staffForm.userClassify">
                    <s-option label="内部人员" :value="1"></s-option>
                    <s-option label="内部临时" :value="2"></s-option>
                    <s-option label="职能人员" :value="3"></s-option>
                    <s-option label="应用人员" :value="4"></s-option>
                  </s-select>
                </s-form-item>
              </s-col>
            </s-row>
            <s-row type="flex" justify="start" align="middle">
              <s-col span="1">
                <s-checkbox v-model="chooseEditItem.workLocation"></s-checkbox>
              </s-col>
              <s-col span="23">
                <s-form-item label="工作地点" prop="workLocation">
                  <s-input :disabled="!chooseEditItem.workLocation" v-model="staffForm.workLocation"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
          </s-form>
        </s-collapse-item >
      </s-collapse>
  </s-scrollbar>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { parseNumAllTime, Validaters } from 'sunflower-common-utils';
  import {cloneDeep} from 'lodash'
  export default {
    data() {
      let validatorNum = function(rule, value, callback) {
        if (value.trim() === '*') {
          callback();
          return;
        };
        if (Validaters.isNum(value)) {
          callback();
        } else {
          callback(new Error(`只能填写数字`));
        }
      };
      let validatorSelectNotNull = function(rule, value, callback) {
        if (rule.required) {
          if (rule.field === 'userVisibleStrategyList' || rule.field === 'userGroupUuidList') {
            if (value.length) {
              callback();
            } else {
              callback(new Error('不能为空'));
            }
          } else {
            if (value !== '' && value !== null && value !== undefined) {
              callback();
            } else {
              callback(new Error('不能为空'));
            }
          }
        } else {
          callback();
        }
      };
      return {
        showInductionMsg: false,
        neveCheckValue: false, // 永不过期开关
        flag: 0,
        activeName: '1',
        loginTypeList: [],
        loginTypeShow: false,
        departOptions: [],
        roleOptions: [],
        status: [
          {name: '激活', val: 1},
          {name: '未激活', val: 0},
          {name: '锁定', val: 2},
          {name: '注销', val: 3},
          {name: '待开启', val: 5},
          {name: '离职', val: 7}
        ],
        staffForm: {
          departUuid: '', // 所属机构
          entryTime: null, // int型，精确到秒
          workLocation: '', // 工作地点
          position: '', // 岗位
          validTime: '',
          sysRoleUuidList: [],
          userExpiryDateStr: null,
          userIpRule: '*',
          pointTimes: '*',
          manyTimes: '*',
          userStatus: null,
          ipType: 1,
          userChangePasswd: 0,
          loginTypeUuid: '',
          userClassify: 1, // 人员类型 1:内部人员
          lastEducation: 5, // 最高学历 5：本科
          lastSchool: '', // 最高学历学校名称
          directLeader: '', // 直接汇报领导人
          customProperty: {} // 自定义属性值列表(input v-model的变量)
        },
        peopleAttributeData: [], // 人员属性集合
        textMax: [Validaters.Max(30)],
        selectRequire: [{ required: false, validator: validatorSelectNotNull, trigger: 'change' }],
        textRequire: [{ required: false, message: '不能为空', trigger: 'blur' }],
        staffRule: {
          departUuid: [{ required: false, validator: validatorSelectNotNull, trigger: 'change' }],
          userClassify: [{ required: false, validator: validatorSelectNotNull, trigger: 'change' }],
          loginTypeUuid: [{ required: false, validator: validatorSelectNotNull, trigger: 'change' }],
          ipType: [{ required: false, validator: validatorSelectNotNull, trigger: 'change' }],
          idCard: [
            {pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号码', trigger: 'blur'},
            {trigger: 'blur', message: '请输入数字'}
          ],
          userPhone: [
            Validaters.TelePhone
          ],
          workLocation: [{ required: false, validator: validatorSelectNotNull, trigger: 'blur' }, Validaters.Max(30)],
          lastEducation: [{ required: false, validator: validatorSelectNotNull, trigger: 'change' }],
          lastSchool: [{ required: false, validator: validatorSelectNotNull, trigger: 'blur' }, Validaters.Max(30)],
          position: [
            { required: false, validator: validatorSelectNotNull, trigger: 'blur' },
            Validaters.Max(30)
          ],
          directLeader: [],
          entryTime: [{ required: false, message: '请选择日期', trigger: 'change' }],
          remark: [Validaters.Max(120)],
          sysRoleUuidList: [{ type: 'array', required: false, message: '不能为空', trigger: 'change' }],
          userChangePasswd: [],
          userIpRule: [{ validator: Validaters.OMAIP, trigger: 'blur' }],
          pointTimes: [{ validator: validatorNum, trigger: 'blur' }],
          manyTimes: [{ validator: validatorNum, trigger: 'blur' }]
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
          }
        },
        chooseEditItem: {
          departUuid: false,
          position: false,
          userClassify: false,
          validTime: false,
          sysRoleUuidList: false,
          userChangePasswd: false,
          userExpiryDateStr: false,
          userIpRule: false,
          pointTimes: false,
          manyTimes: false,
          userStatus: false,
          ipType: false,
          loginTypeUuid: false,
          lastEducation: false,
          lastSchool: false,
          directLeader: false,
          entryTime: false,
          workLocation: false
        },
        staffList: []
      }
    },
    // props: {
    //   staffList: {
    //     type: Array
    //   }
    // },
    created() {
      this.getDynamicAttribute(); // 获取动态属性
      let registerModelList = this.$store.state.userData.registerModelList
      if (registerModelList.indexOf('IAM_EXTEND') !== -1) { // 注册模块是否含有IAM_EXTEND
        this.showInductionMsg = true
      }
      $axios.get('/iamUserInfo/getMixloginTypeList').then(response => {
        this.loginTypeList = response.data;
      });
      $axios.get('/sysLoginType/isMixloginType').then(response => {
        this.loginTypeShow = response.data;
      });
      this.init()
    },
    watch: {
      'staffForm.departUuid': function(val) {
        if (val) {
          let vm = this;
          $axios.get(`/iamUserInfo/getAllDepartLeaderByDepartUuid/${val}`).then(({data}) => {
            if (data instanceof Array) {
              if (vm.flag === 0) {
                vm.flag = 1
              } else {
                vm.staffForm.directLeader = '';
              }
              vm.$set(vm, 'staffList', data)
            }
          });
        }
      },
      'chooseEditItem.departUuid': function(val) {
        if (val) {
          this.$set(this.staffRule.departUuid[0], 'required', true);
        } else {
          this.$set(this.staffRule.departUuid[0], 'required', false);
          this.$refs.staffForm1.clearValidate('departUuid');
        }
      },
      'chooseEditItem.userClassify': function(val) {
        if (val) {
          this.$set(this.staffRule.userClassify[0], 'required', true);
        } else {
          this.$set(this.staffRule.userClassify[0], 'required', false);
          this.$refs.staffForm3.clearValidate('userClassify');
        }
      },
      'chooseEditItem.lastEducation': function(val) {
        if (val) {
          this.$set(this.staffRule.lastEducation[0], 'required', true);
        } else {
          this.$set(this.staffRule.lastEducation[0], 'required', false);
          this.$refs.staffForm3.clearValidate('lastEducation');
        }
      },
      'chooseEditItem.lastSchool': function(val) {
        if (val) {
          this.$set(this.staffRule.lastSchool[0], 'required', true);
        } else {
          this.$set(this.staffRule.lastSchool[0], 'required', false);
          this.$refs.staffForm3.clearValidate('lastSchool');
        }
      },
      'chooseEditItem.position': function(val) {
        if (val) {
          this.$set(this.staffRule.position[0], 'required', true);
        } else {
          this.$set(this.staffRule.position[0], 'required', false);
          this.$refs.staffForm3.clearValidate('position');
        }
      },
      'chooseEditItem.entryTime': function(val) {
        if (val) {
          this.$set(this.staffRule.entryTime[0], 'required', true);
        } else {
          this.$set(this.staffRule.entryTime[0], 'required', false);
          this.$refs.staffForm3.clearValidate('entryTime');
        }
      },
      'chooseEditItem.workLocation': function(val) {
        if (val) {
          this.$set(this.staffRule.workLocation[0], 'required', true);
        } else {
          this.$set(this.staffRule.workLocation[0], 'required', false);
          this.$refs.staffForm3.clearValidate('workLocation');
        }
      },
      'chooseEditItem.sysRoleUuidList': function(val) {
        if (val) {
          this.$set(this.staffRule.sysRoleUuidList[0], 'required', true);
        } else {
          this.$set(this.staffRule.sysRoleUuidList[0], 'required', false);
          this.$refs.staffForm2.clearValidate('sysRoleUuidList');
        }
      }
    },
    methods: {
      getDynamicAttribute() { // 获取动态属性
        let vm = this
        $axios.get(`/userProperties/getAll`).then(({data}) => {
          if (data) {
            data.forEach((v) => {
              if (v.editFlag && v.batchFlag && v.applyFlag) { // 过滤内置和加入弹窗的数据
                vm.peopleAttributeData.push(v)
                vm.$set(vm.chooseEditItem, v.propertyKey, false)
                if (v.internalFlag) { // 如果是内置属性
                  vm.$set(vm.staffForm, v.propertyKey, null)
                  if (v.requiredValueFlag) {
                    if (v.propertyType === 3) {
                      vm.$set(vm.staffRule, v.propertyKey, vm.staffRule[v.propertyKey] ? cloneDeep([...vm.selectRequire, ...vm.staffRule[v.propertyKey]]) : cloneDeep(vm.selectRequire))
                    } else {
                      vm.$set(vm.staffRule, v.propertyKey, vm.staffRule[v.propertyKey] ? cloneDeep([...vm.textRequire, ...vm.textMax, ...vm.staffRule[v.propertyKey]]) : cloneDeep([...vm.textRequire, ...vm.textMax]))
                    }
                  } else {
                    if (v.propertyType !== 3) {
                      vm.$set(vm.staffRule, v.propertyKey, vm.staffRule[v.propertyKey] ? cloneDeep([...vm.textMax, ...vm.staffRule[v.propertyKey]]) : cloneDeep(vm.textMax))
                    }
                  }
                } else {
                  vm.$set(vm.staffForm.customProperty, v.propertyKey, null)
                  if (v.requiredValueFlag) {
                    if (v.propertyType === 3) {
                      vm.$set(vm.staffRule, `customProperty.${v.propertyKey}`, vm.staffRule[v.propertyKey] ? cloneDeep([...vm.selectRequire, ...vm.staffRule[v.propertyKey]]) : cloneDeep(vm.selectRequire))
                    } else {
                      vm.$set(vm.staffRule, `customProperty.${v.propertyKey}`, vm.staffRule[v.propertyKey] ? cloneDeep([...vm.textRequire, ...vm.textMax, ...vm.staffRule[v.propertyKey]]) : cloneDeep([...vm.textRequire, ...vm.textMax]))
                    }
                  } else {
                    if (v.propertyType !== 3) {
                      vm.$set(vm.staffRule, `customProperty.${v.propertyKey}`, vm.staffRule[v.propertyKey] ? cloneDeep([...vm.textMax, ...vm.staffRule[v.propertyKey]]) : cloneDeep(vm.textMax))
                    }
                  }
                }
              }
            });
          }
          console.log(vm.staffRule);
          console.log(vm.staffForm);
        });
      },
      changeRulesDynamic(flag, val, require) {
        if (require) {
          if (flag) {
            this.staffRule[val][0].required = true
          } else {
            this.staffRule[val][0].required = false
            this.$refs.staffForm1.clearValidate(val);
          }
        }
      },
      changeRulesDynamicCustom(flag, val, require) {
        if (require) {
          if (flag) {
            this.staffRule[`customProperty.${val}`][0].required = true
          } else {
            this.staffRule[`customProperty.${val}`][0].required = false
            this.$refs.staffForm1.clearValidate(val);
          }
        }
      },
      changeStatus() {
        if (this.staffForm.userStatus === 6) {
          this.neveCheckValue = false
          this.chooseEditItem.userExpiryDateStr = true
          this.staffForm.userExpiryDateStr = parseNumAllTime(Date.parse(new Date()) / 1000)
        } else if (this.staffForm.userStatus === 1) {
          this.neveCheckValue = true
          this.chooseEditItem.userExpiryDateStr = true
          this.staffForm.userExpiryDateStr = 0
        } else {
          this.chooseEditItem.userExpiryDateStr = false
        }
      },
      // getDateRangeStart(val) {
      //   this.staffForm.entryTime = val ? new Date(this.staffForm.entryTime * 1000) : null;
      // },
      init() {
        $axios.get('/iamUserInfo/getRoleList').then(({data}) => {
          this.roleOptions = data
        });
        $axios.get(`/iamUserInfo/getDepartList`).then(({data}) => {
          this.departOptions = data;
        });
        $axios.get('/login/isGoogleAuthLoginType').then(({data}) => {
          if (data) {
            this.status = [
              {name: '待开启', val: 5},
              {name: '未激活', val: 0},
              {name: '锁定', val: 2},
              {name: '注销', val: 3},
              {name: '离职', val: 7}
            ];
            this.staffForm.userStatus = 5
          } else {
            if (this.staffForm.loginTypeUuid === 'tsyslogininit0000000000000000011') {
              this.status = [
                {name: '待开启', val: 5},
                {name: '未激活', val: 0},
                {name: '锁定', val: 2},
                {name: '注销', val: 3},
                {name: '离职', val: 7}
              ];
              this.staffForm.userStatus = 5
            } else {
              this.status = [
                {name: '激活', val: 1},
                {name: '未激活', val: 0},
                {name: '锁定', val: 2},
                {name: '注销', val: 3},
                {name: '离职', val: 7},
                {name: '过期', val: 6}
              ];
            }
          }
        });
      },
      neveCheck(val) { // 永不过期控制
        this.staffForm.userExpiryDateStr = val ? 0 : null
      },
      handlerChange(val) {
        $axios.post('/sysLoginType/getDoubleLoginType').then((res) => {
          let SysDoubleType = res.data.SysDoubleType
          if ((val === 'tsyslogininit0000000000000000008') || ((val === 'tsyslogininit0000000000000000002') && ((SysDoubleType.firstUuid === 'tsyslogininit0000000000000000008') || (SysDoubleType.secondUuid === 'tsyslogininit0000000000000000008')))) {
            this.needPhone = true
          } else {
            this.needPhone = false
          }
          if ((val === 'tsyslogininit0000000000000000011') || ((val === 'tsyslogininit0000000000000000002') && ((SysDoubleType.firstUuid === 'tsyslogininit0000000000000000011') || (SysDoubleType.secondUuid === 'tsyslogininit0000000000000000011')))) {
            this.status = [
              {name: '待开启', val: 5},
              {name: '未激活', val: 0},
              {name: '锁定', val: 2}
            ];
            this.staffForm.userStatus = 5
          } else {
            this.status = [
              {name: '激活', val: 1},
              {name: '未激活', val: 0},
              {name: '锁定', val: 2}
            ];
            this.staffForm.userStatus = 1
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
  #batchEditMan .s-col-1
    margin-top -23px
</style>
