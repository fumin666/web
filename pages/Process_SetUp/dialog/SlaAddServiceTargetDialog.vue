<template>
  <s-dialog v-model="dialogFlag" :title="isSee ? '查看服务目标' :(isEdit ? '编辑服务目标' : '新建服务目标')" width="850px" class="serviceTargetAddDialog">
    <s-scrollbar wrap-class="slaAddScrollbar">
      <s-form :model="serviceTargetForm" :rules="serviceTargetRule" ref="serviceTargetForm" label-width="100px">
        <s-collapse v-model="activeNames">
          <s-collapse-item name="baseinfo">
            <template slot="title">
              <span class="slaAddDialog-title">基础信息</span>
            </template>
            <s-row>
              <s-col :span="12" style="padding-right:10px">
                <s-form-item label="ID" v-if="isEdit">
                  <s-input :disabled="true" v-model="serviceTargetForm.slaCode"></s-input>
                </s-form-item>
                <s-form-item label="文件夹名称" prop="slaCategory">
                  <input-tree :disabled="isSee" v-model="serviceTargetForm.slaCategory" name="uuid" :hasDelIcon="true" :data="leftTree" :props="defaultProps" style="width:100%;"></input-tree>
                </s-form-item>
                <s-form-item label="所属流程" prop="itilType">
                  <s-select :disabled="isSee" v-model="serviceTargetForm.itilType" clearable placeholder="请选择" style="width:100%;">
                    <s-option :label="'事件'" :value="0"></s-option>
                    <s-option :label="'服务请求'" :value="6"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="目标类型" prop="slaTargetType">
                  <s-select :disabled="isSee" v-model="serviceTargetForm.slaTargetType" clearable placeholder="请选择" style="width:100%;">
                    <s-option :label="'事件响应'" :value="1" v-if="serviceTargetForm.itilType === 0"></s-option>
                    <s-option :label="'事件解决'" :value="2" v-if="serviceTargetForm.itilType === 0"></s-option>
                    <s-option :label="'服务请求响应'" :value="3" v-if="serviceTargetForm.itilType === 6"></s-option>
                    <s-option :label="'服务请求解决'" :value="4" v-if="serviceTargetForm.itilType === 6"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="标题" prop="slaTitle">
                  <s-input :disabled="isSee" v-model="serviceTargetForm.slaTitle"></s-input>
                </s-form-item>
              </s-col>
              <s-col :span="12" style="padding-left:10px">
                <s-form-item label="描述" prop="slaDesc">
                  <s-input :disabled="isSee" v-model="serviceTargetForm.slaDesc" type="textarea"></s-input>
                </s-form-item>
                <s-form-item label="状态" prop="slaStatus">
                  <s-select :disabled="isSee" v-model="serviceTargetForm.slaStatus" placeholder="请选择" style="width:100%;">
                    <s-option :label="'启用'" :value="1"></s-option>
                    <s-option :label="'禁用'" :value="0"></s-option>
                  </s-select>
                </s-form-item>
                <s-form-item v-if="isEdit" label="提交时间" prop="commitTime">
                  <s-date-picker :disabled="true" v-model="serviceTargetForm.commitTime" type="datetime" placeholder="选择提交时间" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss" style="width:100%;"></s-date-picker>
                </s-form-item>
                <s-form-item v-if="isEdit" label="提交人" prop="slacommitUsername">
                  <s-input v-model="serviceTargetForm.slacommitUsername" :disabled="true" style="width:100%;"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
          </s-collapse-item>
          <s-collapse-item name="timeinfo">
            <template slot="title">
              <span class="slaAddDialog-title">时间信息</span>
            </template>
            <s-row>
              <s-col :span="12" style="padding-right:10px">
                <s-form-item label="服务时间名称" prop="slaServicetime">
                  <s-select :disabled="isSee" v-model="serviceTargetForm.slaServicetime" clearable placeholder="请选择">
                    <s-option v-for="(item, index) in serviceTimeList" :key="index" :label="item.servicetimeTitle" :value="item.uuid">
                      <div @mouseover="slaServicetimeHover(item,true)" @mouseout="slaServicetimeHover(item,false)">
                        <p>{{item.servicetimeTitle}}</p>
                      </div>
                    </s-option>
                  </s-select>
                </s-form-item>
                <s-form-item label="小时" prop="targetHour">
                  <s-input-number :disabled="isSee" v-model="serviceTargetForm.targetHour" :step="1" :min="0"></s-input-number>
                </s-form-item>
                <s-form-item label="分钟" prop="targetMininute">
                  <s-input-number :disabled="isSee" v-model="serviceTargetForm.targetMininute" :step="1" :min="0" :max="60"></s-input-number>
                </s-form-item>
              </s-col>
              <s-col :span="12" style="padding-left:10px">
                <s-form-item label="上班时间">
                  <s-input v-model="setviceTime.startTime" :disabled="true"></s-input>
                </s-form-item>
                <s-form-item label="下班时间">
                  <s-input v-model="setviceTime.endTime" :disabled="true"></s-input>
                </s-form-item>
                <s-form-item label="午休时间">
                  <s-input v-model="setviceTime.restTime" :disabled="true"></s-input>
                </s-form-item>
              </s-col>
            </s-row>
          </s-collapse-item>
          <s-collapse-item name="measurement">
            <template slot="title">
              <span class="slaAddDialog-title">测量准则</span>
            </template>
            <s-row>
              <s-col :span="24">
                <s-form-item label="匹配" prop="slaMatchType">
                  <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.slaMatchType" :label="1">匹配优先级</s-radio>
                  <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.slaMatchType" :label="2">匹配分类</s-radio>
                </s-form-item>
                <template v-if="serviceTargetForm.slaMatchType === 1">
                  <s-form-item label="优先级" prop="slaPriority">
                    <s-select :disabled="isSee" v-model="serviceTargetForm.slaPriority" clearable placeholder="请选择">
                      <s-option :label="'重大'" :value="1"></s-option>
                      <s-option :label="'高'" :value="2"></s-option>
                      <s-option :label="'中'" :value="3"></s-option>
                      <s-option :label="'低'" :value="4"></s-option>
                    </s-select>
                  </s-form-item>
                </template>
                <template v-if="serviceTargetForm.slaMatchType === 2">
                  <s-form-item label="分类一级" prop="slaFirstcategory">
                    <s-cascader :disabled="isSee" :options="slaFirstcategoryList" :props="cascaderConfig" :value="slaFirstcategoryValue" expand-trigger="hover" @change="changeCompanyAndCategory" :show-all-levels="false" style="width:90%">
                    </s-cascader>
                  </s-form-item>
                  <s-form-item label="分类二级" prop="slaSecondcategory">
                    <s-select :disabled="isSee" v-model="serviceTargetForm.slaSecondcategory" clearable placeholder="请选择" style="width:90%">
                      <s-option v-for="(item, index) in slaSecondcategoryList" :key="index" :label="item.categoryName" :value="item.uuid"></s-option>
                    </s-select>
                  </s-form-item>
                  <s-form-item label="分类三级" prop="slaThirdcategory">
                    <s-select :disabled="isSee" v-model="serviceTargetForm.slaThirdcategory" clearable placeholder="请选择" style="width:90%">
                      <s-option v-for="(item, index) in slaThirdcategoryList" :key="index" :label="item.categoryName" :value="item.uuid"></s-option>
                    </s-select>
                  </s-form-item>
                </template>
                <template v-if="serviceTargetForm.slaTargetType === 1||serviceTargetForm.slaTargetType === 3">
                  <s-form-item label="响应满足的条件" prop="responseEnd">
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.responseEnd" :label="1">接单</s-radio>
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.responseEnd" :label="2">指派给他人</s-radio>
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.responseEnd" :label="3">待决</s-radio>
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.responseEnd" :label="4">取消</s-radio>
                  </s-form-item>
                </template>
                <template v-if="serviceTargetForm.slaTargetType === 2||serviceTargetForm.slaTargetType === 4">
                  <s-form-item label="解决满足的条件" prop="solveEnd">
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.solveEnd" :label="1">已解决</s-radio>
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.solveEnd" :label="2">指派给他人</s-radio>
                    <s-radio :disabled="isSee" class="radio" v-model="serviceTargetForm.solveEnd" :label="3">已关闭</s-radio>
                  </s-form-item>
                </template>
              </s-col>
            </s-row>
            <s-row>
              <s-col :span="24">
                <p>备注说明：</p>
                <p>响应的计时，以单子的创建时间为开始</p>
                <p>解决的计时，以单子第一次已指派状态的时间为开始</p>
              </s-col>
            </s-row>
          </s-collapse-item>
          <s-collapse-item name="notification">
            <template slot="title">
              <span class="slaAddDialog-title">阶段和通知</span>
            </template>
            <s-row>
              <s-col :span="8" style="padding-right:7px">
                <fieldset>
                  <legend>阶段</legend>
                  <template v-if="!serviceTargetForm.slaStageList || !!serviceTargetForm.slaStageList&&serviceTargetForm.slaStageList.length ===0">
                    <div class="s-table-empty-block"><span class="s-table-empty-text">暂无数据</span></div>
                  </template>
                  <template v-else>
                    <ul class="s-upload-list s-upload-list--text">
                      <li v-for="(item, index) in serviceTargetForm.slaStageList" :key="index" :tabindex="index" :class="['s-upload-list__item','is-ready', stageListActive ===index ? 'active' : '']" style="outline: none; cursor:pointer">
                        <div :class="['s-upload-list__item-name']" @click="setStageListActive(item,index)">
                          <i class="iconfont icon-file"></i>
                          {{`${parseFloat(item.stage)*100}%`}}
                        </div>
                      </li>
                    </ul>
                  </template>
                </fieldset>
              </s-col>
              <s-col :span="16" style="padding-left:7px">
                <fieldset>
                  <legend>通知</legend>
                  <template v-if="stageListActive === null">
                    <div class="s-table-empty-block"><span class="s-table-empty-text">暂无数据</span></div>
                  </template>
                  <template v-else>
                    <!-- <s-button @click="openNotificationSelect" icon="plus">添加通知</s-button> -->
                    <ul v-for="(item,index) in serviceTargetForm.slaStageList" :key="index" v-if="stageListActive === index" class="s-upload-list s-upload-list--text" style="height: 105px;">
                      <s-form-item label="选择通知">
                        <s-radio class="radio" v-model="slaStageSelect[index]" :label="1">邮箱</s-radio>
                        <s-radio class="radio" v-model="slaStageSelect[index]" :label="2">支持组</s-radio>
                        <s-radio class="radio" v-model="slaStageSelect[index]" :label="3">角色</s-radio>
                      </s-form-item>
                      <li class="s-upload-list__item is-ready" style="outline: none; cursor:pointer" v-if="slaStageSelect[index] === 1">
                        <template v-if="item.emailIsEdit">
                          <div :class="['s-upload-list__item-name']" @click="openEditNotification(item,stageListActive, 'email')">
                            <i class="iconfont icon-email"></i>
                            <s-input v-model="item.email" placeholder="添加邮箱，多个邮箱用分号隔开" @keyup.enter.native="editNotificationOK(item,index,'email')" @blur="editNotificationOK(item,index,'email')" style="width:calc(100% - 30px)"></s-input>
                          </div>
                        </template>
                        <template v-else>
                          <div :class="['s-upload-list__item-name']" @click="openEditNotification(item,stageListActive, 'email')">
                            <i class="iconfont icon-email"></i>
                            <div style="display:inline-block;width:calc(100% - 30px);overflow:auto;vertical-align: middle;margin-top: -3px;">
                              <span>{{!item.email ? (!!isSee?'没有邮箱':'点击添加邮箱，多个邮箱用分号隔开'):item.email}}</span>
                            </div>
                          </div>
                        </template>
                      </li>
                      <li class="s-upload-list__item is-ready" style="outline: none; cursor:pointer" v-if="slaStageSelect[index] === 2">
                        <div :class="['s-upload-list__item-name']">
                          <i class="iconfont icon-organ"></i>
                          <s-select :disabled="isSee" v-model="item.groupuuid" clearable placeholder="请选择支持组" style="width:calc(100% - 30px);">
                            <s-option v-for="(group) in groupList" :key="group.uuid" :label="group.groupName" :value="group.uuid"></s-option>
                          </s-select>
                        </div>
                      </li>
                      <li class="s-upload-list__item is-ready" style="outline: none; cursor:pointer" v-if="slaStageSelect[index] === 3">
                        <div :class="['s-upload-list__item-name']">
                          <i class="iconfont icon-user"></i>
                          <s-select :disabled="isSee" v-model="item.roleuuid" clearable placeholder="请选择角色" style="width:calc(100% - 30px)">
                            <s-option v-for="(role) in roleList" :key="role.uuid" :label="role.roleName" :value="role.uuid"></s-option>
                          </s-select>
                        </div>
                      </li>
                    </ul>
                  </template>
                </fieldset>
              </s-col>
            </s-row>
          </s-collapse-item>
        </s-collapse>
      </s-form>
    </s-scrollbar>
    <template slot="footer" class="dialog-footer" v-if="!isSee">
      <s-button :disabled="dialogDisabled" @click="dialogOk">确定</s-button>
      <s-button type="cancel" @click="dialogFlag=false">取消</s-button>
    </template>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';
import inputTree from '@/components/inputTree/InputTree';

export default {
  data() {
    const that = this;
    return {
      data: {},
      dialogFlag: false,
      dialogDisabled: false,
      activeNames: ['baseinfo', 'timeinfo', 'measurement', 'notification'],
      allowAdd: true,
      authOptions: [],
      serviceTargetForm: {
        slaCode: null,
        slaCategory: null,
        itilType: null,
        slaTargetType: null,
        slaTitle: null,
        slaDesc: null,
        slaStatus: 1,
        commitTime: that.isEdit ? '' : null,
        commitUser: that.isEdit ? '' : null,
        slaServicetime: null,
        targetHour: 0,
        targetMininute: 0,
        slaMatchType: 1,
        slaPriority: null,
        slaFirstcategory: null,
        slaSecondcategory: null,
        slaThirdcategory: null,
        responseEnd: 1,
        solveEnd: 1,
        slacommitUsername: null,
        slaStageList: [{
          stage: 0.5,
          email: '',
          roleuuid: '',
          groupuuid: ''
        },
        {
          stage: 0.7,
          email: '',
          roleuuid: '',
          groupuuid: ''
        },
        {
          stage: 1,
          email: '',
          roleuuid: '',
          groupuuid: ''
        }]
      },
      serviceTargetRule: {},
      rules1: {
        slaCategory: [
          Validaters.NotNull
        ],
        itilType: [
          Validaters.NotNull
        ],
        slaTargetType: [
          Validaters.NotNull
        ],
        slaTitle: [
          Validaters.NotNull,
          Validaters.Max(30)
        ],
        slaDesc: [
          Validaters.Max(120)
        ],
        slaStatus: [
          Validaters.NotNull
        ],
        slaServicetime: [
          Validaters.NotNull
        ],
        targetHour: [
          Validaters.NotNull
        ],
        targetMininute: [
          Validaters.NotNull
        ],
        slaMatchType: [
          Validaters.NotNull
        ],
        slaPriority: [
          Validaters.NotNull
        ]
      },
      rules2: {
        slaCategory: [
          Validaters.NotNull
        ],
        itilType: [
          Validaters.NotNull
        ],
        slaTargetType: [
          Validaters.NotNull
        ],
        slaTitle: [
          Validaters.NotNull,
          Validaters.Max(30)
        ],
        slaDesc: [
          Validaters.Max(120)
        ],
        slaStatus: [
          Validaters.NotNull
        ],
        slaServicetime: [
          Validaters.NotNull
        ],
        targetHour: [
          Validaters.NotNull
        ],
        targetMininute: [
          Validaters.NotNull
        ],
        slaMatchType: [
          Validaters.NotNull
        ],
        slaFirstcategory: [
          Validaters.NotNull
        ],
        slaSecondcategory: [
          Validaters.NotNull
        ]
      },
      assetList: [],
      currentListCache: [],
      selectedData: [],
      radio: '0',
      stageList: [],
      stageListActive: null,
      stageListActiveRow: null,
      // 服务时间列表
      serviceTimeList: [],
      setviceTime: {
        startTime: '',
        endTime: '',
        restTime: ''
      },
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      // 三级分类列表
      cascaderConfig: {
        label: 'name',
        value: 'uuid',
        children: 'childrenList'
      },
      slaFirstcategoryValue: [],
      slaCategory: {},
      slaFirstcategoryList: [],
      slaSecondcategoryList: [],
      slaThirdcategoryList: [],
      // 支持组和角色列表
      groupList: [],
      roleList: [],
      prevSlaStageSelect: [0, 0, 0],
      slaStageSelect: [0, 0, 0]
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object
    },
    list: {
      type: Array
    },
    isSee: {
      type: Boolean,
      default: false
    },
    leftTree: {
      type: Array
    }
  },
  computed: {
    isEdit() {
      return Object.keys(this.row).length > 0;
    }
  },
  created() {
    this.axiosServiceTimeList(() => {
      this.axiosGroupName();
      this.axiosRoleName();
      if (this.isEdit) {
        $axios.get(`/itilSla/getItilSlaAgreement/${this.row.uuid}`).then(({data}) => {
          for (let i in this.serviceTargetForm) {
            if (i === 'commitTime') {
              this.serviceTargetForm[i] = this.dateFormat(parseInt(data[i]) * 1000);
            } else if (i === 'slaStageList') {
              this.serviceTargetForm[i] = data[i];
              this.serviceTargetForm[i].forEach((item, j) => {
                if (item['email']) {
                  this.stageListActive = j;
                  this.slaStageSelect[j] = 1
                } else if (item['groupuuid']) {
                  this.stageListActive = j;
                  this.slaStageSelect[j] = 2
                } else if (item['roleuuid']) {
                  this.stageListActive = j;
                  this.slaStageSelect[j] = 3
                }
              });
            } else {
              this.serviceTargetForm[i] = data[i];
            }
          }
        });
        this.serviceTimeList.forEach((item) => {
          if (item.servicetimeName === this.serviceTargetForm.slaServicetime) {
            for (let i in this.serviceTime) {
              this.serviceTime[i] = item[i]
            }
          }
        });
      }
    });
  },
  methods: {
    // 保存
    getStage(int) {
      let str = '';
      switch (int) {
        case 0:
          str = '50%'
          break;
        case 1:
          str = '70%'
          break;
        case 2:
          str = '100%'
          break;
        default:
          break;
      }
      return str;
    },
    dialogOk() {
      if (this.isSee) {
        this.dialogFlag = false;
        return
      }
      let form = this.$refs['serviceTargetForm'];
      form.validate((valid) => {
        if (!valid) return false;
        let params = {...this.serviceTargetForm};
        // 解决后端需要传递时间戳，而前端是一个字符串的问题
        if (params.commitTime) {
          params.commitTime = this.timeStamp(params.commitTime);
        }
        let isAllNull = false;
        let isNull = [false, false, false];
        for (let row = 0; row < this.slaStageSelect.length; row++) {
          // 拿到矩阵的行（row） 和 行内的项（item）
          let item = this.slaStageSelect[row];
          if (!this.serviceTargetForm.slaStageList[row]['email'] && !this.serviceTargetForm.slaStageList[row]['groupuuid'] && !this.serviceTargetForm.slaStageList[row]['roleuuid']) {
            isNull[row] = true;
          }
          if (item === 1) {
            // 邮箱
            if (!this.serviceTargetForm.slaStageList[row]['email']) {
              const msg = `请检查${this.getStage(row)}阶段的${'邮箱'}是否为空`;
              return this.$message({showClose: true, message: msg, type: 'error'});
            } else {
              const reg = /^((([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6}\;))*(([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})))$/;
              if (!reg.test(this.serviceTargetForm.slaStageList[row]['email'].toLowerCase())) {
                return this.$message({showClose: true, message: '请规范邮箱格式，多组邮箱请用英文半角分号隔开', type: 'error'});
              }
            }
          } else if (item === 2) {
            // 支持组
            if (!this.serviceTargetForm.slaStageList[row]['groupuuid']) {
              const msg = `请检查${this.getStage(row)}阶段的${'支持组'}是否为空`;
              return this.$message({showClose: true, message: msg, type: 'error'});
            }
          } else if (item === 3) {
            // 角色
            if (!this.serviceTargetForm.slaStageList[row]['roleuuid']) {
              const msg = `请检查${this.getStage(row)}阶段的${'角色'}是否为空`;
              return this.$message({showClose: true, message: msg, type: 'error'});
            }
          }
        }
        if (isNull.indexOf(false) === -1) {
          isAllNull = true;
        }
        if (isAllNull) {
          const msg = `必须要填写一个阶段的一项`;
          return this.$message({showClose: true, message: msg, type: 'error'});
        }
        this.dialogDisabled = true;
        if (this.isEdit) {
          params['uuid'] = this.row.uuid;
          params['deleteStatus'] = 1;
          $axios.post('/itilSla/updateItilSlaAgreement', params, {
            data: [params],
            logTemplate: '编辑|文件夹(#slaCategory#)'
          }).then((res) => {
            this.dialogDisabled = false;
            if (res.data.state === true) {
              this.$message({showClose: true, message: '更新成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        } else {
          $axios.post('/itilSla/saveItilSlaAgreement', params, {
            data: [params],
            logTemplate: '添加|文件夹(#slaCategory#)'
          }).then((res) => {
            this.dialogDisabled = false;
            if (res.data.state === true) {
              this.$message({showClose: true, message: '保存成功!', type: 'success'});
              this.$emit('reload');
              this.dialogFlag = false;
            } else {
              this.$message({showClose: true, message: res.data.errormsg, type: 'error'});
            }
          })
        }
      })
    },
    setStageListActive(item, index) {
      this.stageListActive = index
      this.stageListActiveRow = item
    },
    // 添加通知四个函数 开始
    changeCompanyAndCategory(val) {
      if (val.length > 0) {
        this.slaCategory['companyUuid'] = val[0];
        this.serviceTargetForm.slaFirstcategory = val[1];
        if (!val[1]) {
          this.slaSecondcategoryList = []
          this.slaThirdcategoryList = []
          return null
        }
        this.slaFirstcategoryList.forEach((item1) => {
          if (item1.uuid === val[0]) {
            if (!item1.childrenList) {
              return;
            }
            item1.childrenList.forEach((item2) => {
              if (item2.uuid === val[1]) {
                this.slaCategory['categoryFirst'] = item2.uuid;
                this.serviceTargetForm.slaSecondcategory = null;
                this.serviceTargetForm.slaThirdcategory = null;
                if (this.slaCategory.categorySecond) {
                  delete this.slaCategory.categorySecond
                }
                this.axiosItilList(this.slaCategory, 2)
              }
            })
          }
        })
      }
    },
    addNotification() {
      let arr = [...this.notificationList];
      arr.push({
        isEdit: true,
        notification: null
      })
      this.notificationList = arr;
    },
    deleteNotification(item, index) {
      this.notificationList.splice(parseInt(index), 1)
    },
    openEditNotification(item, index, type) {
      if (this.isSee) return null;
      let arr = [...this.serviceTargetForm.slaStageList];
      arr[index][`${type}IsEdit`] = true
      this.serviceTargetForm.slaStageList = arr;
    },
    editNotificationOK(item, index, type) {
      let arr = [...this.serviceTargetForm.slaStageList];
      delete arr[index][`${type}IsEdit`];
      if (type) {
        arr[index][type] = item[type]
      }
      // console.log(arr[index])
      this.serviceTargetForm.slaStageList = arr;
    },
    // 添加通知四个函数 完成
    // 分类列表开始
    axiosFirstList(type) {
      $axios.get(`/ItilCommonWorkflow/getCompanyAndCategory/${type}`).then(res => {
        this.slaFirstcategoryList = res.data;
        if (this.slaFirstcategoryList.length > 0) {
          this.slaCategory['companyUuid'] = this.slaFirstcategoryList[0].uuid;
          if (this.isEdit) {
            this.slaFirstcategoryValue[0] = this.slaFirstcategoryList[0].uuid;
            this.slaFirstcategoryValue[1] = this.serviceTargetForm.slaFirstcategory;
            this.slaCategory['categoryFirst'] = this.serviceTargetForm.slaFirstcategory;
            this.axiosItilList(this.slaCategory, 2)
          }
        }
      })
    },
    axiosItilList(params, index) {
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', params).then((res) => {
        if (index === 1) {
          this.slaFirstcategoryList = res.data
        } else if (index === 2) {
          this.slaSecondcategoryList = res.data
          if (this.isEdit) {
            this.slaSecondcategoryList.forEach((item) => {
              if (item.uuid === this.serviceTargetForm.slaSecondcategory) {
                this.slaCategory['categorySecond'] = item.uuid;
                this.axiosItilList(this.slaCategory, 3)
              }
            })
          }
        } else if (index === 3) {
          this.slaThirdcategoryList = res.data
        }
      })
    },
    // 获取服务时间
    axiosServiceTimeList(callback) {
      $axios.get(`/itilSla/getItilSlaServicetimeList`).then(({data}) => {
        if (Array.isArray(data)) {
          this.serviceTimeList = [...(data.filter(item => item.isEnable === 1))];
        }
        callback()
      })
    },
    // 获取支持组
    axiosGroupName() {
      $axios.get('/itilWorkflowConfig/getItilSupportGroupList').then((res) => {
        this.groupList = res.data;
      })
    },
    // 获取角色
    axiosRoleName() {
      $axios.get('/itilWorkflowConfig/getItilRoleList').then((res) => {
        this.roleList = res.data.filter((item) => {
          return item.ownerType === 0 || item.ownerType === 6
        });
      })
    },
    newDate(timeStamp) {
      return new Date(parseInt(timeStamp) * 1000)
    },
    timeStamp(dateString) {
      const dateParams = dateString.split(/[\s-:]/);
      dateParams[1] = (parseInt(dateParams[1], 10) - 1).toString();
      let newDate = new Date(Date.UTC(...dateParams));
      return Math.round(newDate.getTime() / 1000);
    },
    dateFormat(dateTime, format) {
      const date = new Date(dateTime)
      let fmt = format || 'yyyy-MM-dd hh:mm:ss'
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
      }
      return fmt
    },
    slaServicetimeHover(item, flag) {
      if (!flag) {
        if (!this.serviceTargetForm.slaServicetime) {
          this.setviceTime = {
            startTime: '',
            endTime: '',
            restTime: ''
          }
        } else {
          if (item.uuid !== this.serviceTargetForm.slaServicetime) {
            this.serviceTimeList.forEach((row) => {
              if (row.uuid === this.serviceTargetForm.slaServicetime) {
                for (let i in this.setviceTime) {
                  if (i === 'restTime') {
                    this.setviceTime[i] = `${row.restStartTime} - ${row.restEndTime}`
                  } else {
                    this.setviceTime[i] = row[i]
                  }
                }
              }
            })
          }
        }
      } else {
        this.serviceTimeList.forEach((row) => {
          if (row.uuid === item.uuid) {
            for (let i in this.setviceTime) {
              if (i === 'restTime') {
                this.setviceTime[i] = `${row.restStartTime} - ${row.restEndTime}`
              } else {
                this.setviceTime[i] = row[i]
              }
            }
          }
        })
      }
    }
  },
  watch: {
    'serviceTargetForm.slaServicetime'(val) {
      if (!val) {
        this.setviceTime = {
          startTime: '',
          endTime: '',
          restTime: ''
        }
      } else {
        this.serviceTimeList.forEach((item) => {
          if (item.uuid === val) {
            for (let i in this.setviceTime) {
              if (i === 'restTime') {
                this.setviceTime[i] = `${item.restStartTime} - ${item.restEndTime}`
              } else {
                this.setviceTime[i] = item[i]
              }
            }
          }
        })
      }
    },
    'serviceTargetForm.slaMatchType': {
      immediate: true,
      handler(val) {
        if (val === 1) {
          this.serviceTargetRule = this.rules1
          this.serviceTargetForm.slaFirstcategory = null;
          this.serviceTargetForm.slaSecondcategory = null;
          this.serviceTargetForm.slaThirdcategory = null;
        } else if (val === 2) {
          this.serviceTargetRule = this.rules2
          this.serviceTargetForm.slaPriority = null;
        }
      }
    },
    'serviceTargetForm.itilType': {
      immediate: true,
      handler(val) {
        if (val === null) return;
        if (val === 0) {
          this.slaCategory['ownerType'] = 0;
          this.axiosFirstList(0);
        } else if (val === 6) {
          this.slaCategory['ownerType'] = 6;
          this.axiosFirstList(6);
        } else {
          this.slaFirstcategoryList = []
          this.slaSecondcategoryList = []
          this.slaThirdcategoryList = []
        }
      }
    },
    'serviceTargetForm.slaSecondcategory'(val) {
      if (!val) {
        this.slaThirdcategoryList = []
        return null
      }
      this.slaSecondcategoryList.forEach((item) => {
        if (item.uuid === val) {
          this.serviceTargetForm.slaThirdcategory = null;
          this.slaCategory['categorySecond'] = item.uuid;
          this.axiosItilList(this.slaCategory, 3)
        }
      })
    },
    slaStageSelect(val) {
      if (JSON.stringify(val) !== JSON.stringify(this.prevSlaStageSelect)) {
        // 将变化后数组循环
        val.forEach((item, i) => {
          // 判断变化后数组每项与变化之前每项是否相等
          if (item !== this.prevSlaStageSelect[i]) {
            // 如果不相等,拿到矩阵的行（i） 和 行内的项（item）
            // console.log(item, i)
            if (item === 1) {
              // 如果变化的是邮箱
              this.serviceTargetForm.slaStageList[i]['roleuuid'] = ''
              this.serviceTargetForm.slaStageList[i]['groupuuid'] = ''
            } else if (item === 2) {
              // 如果变化的是支持组
              this.serviceTargetForm.slaStageList[i]['email'] = ''
              this.serviceTargetForm.slaStageList[i]['roleuuid'] = ''
            } else if (item === 3) {
              // 如果变化的是角色
              this.serviceTargetForm.slaStageList[i]['email'] = ''
              this.serviceTargetForm.slaStageList[i]['groupuuid'] = ''
            }
          }
        });
        this.prevSlaStageSelect = [...val]
      }
    },
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
    inputTree
  }
}
</script>

<style lang="stylus">
.slaAddScrollbar {
  height: 450px;

  .s-table-empty-block {
    min-height: 105px;
  }
}

.slaAddDialog-title {
  color: #9c9796;
  font-size: 14px;
  font-weight: 600;
}

.slaAddDialog legend {
  font-weight: 600;
  padding: 6px;
}

.operationRespAddDialog-checkbox {
  float: left;

  .operationRespAddDialog-checkbox-wrap {
    padding-top: 5px;
  }
}
</style>
