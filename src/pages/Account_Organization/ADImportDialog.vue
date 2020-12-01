<template>
  <s-dialog
    v-model="dialogFlag"
    v-if="dialogFlag"
    width="700px"
    title="添加">
    <div class="stepContainer">
      <s-steps :current="currentStep" type="arrow" step-width="28%">
        <s-step title="添加策略"></s-step>
        <s-step title="同步策略配置"></s-step>
        <s-step title="组织机构、人员属性映射"></s-step>
      </s-steps>
      <div class="stepContent" v-if="currentStep == 0">
        <s-row class="title">
          <i class="icon iconfont icon-tag"></i>
          添加策略
        </s-row>
        <s-form ref="stepForm0" :model="stepForm0" :rules="stepRules0" label-width="120px">
          <s-form-item label="策略名称" prop="taskName">
            <s-col span="20">
              <s-input v-model="stepForm0.taskName"></s-input>
            </s-col>
            <s-col span="2" class="tipIcon">
              <s-tooltip class="tip" content="最大长度为30,由中文、字母、数字、符号[_-.]组成." placement="top-end">
                <i class="iconfont icon-help"></i>
              </s-tooltip>
            </s-col>
          </s-form-item>
          <s-form-item label="同步模式">
            <s-col span="10" >
              <s-select v-model="stepForm0.taskModel">
                <s-option label="AD域组织机构" :value="0"></s-option>
                <s-option label="AD域安全组" :value="1"></s-option>
              </s-select>
            </s-col>
          </s-form-item>
        </s-form>
      </div>
      <div class="stepContent" key="1" v-else-if="currentStep == 1">
        <s-scrollbar wrap-class="scrollheight">
          <s-row class="title">
            <i class="icon iconfont icon-plus"></i>添加同步策略
          </s-row>
          <s-form ref="stepForm1" :model="stepForm1" :rules="stepRules1" label-width="150px">
            <s-form-item label="策略名称">{{stepForm0.taskName}}</s-form-item>
            <s-form-item label="同步模式">{{stepForm0.taskModel | taskModel}}</s-form-item>
            <s-form-item label="同步方式">
              <s-col span="10" >
                <s-select v-model="stepForm1.taskType">
                  <s-option label="手动" :value="0"></s-option>
                  <s-option label="自动" :value="1"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item label="导入到本地组织机构">
              <s-col span="10" >
                <s-select v-model="stepForm1.importDepartId">
                  <s-option
                    v-for="list in localDepartLists"
                    :label="list.departName"
                    :value="list.departId"
                    :key="list.departId"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item>
              <s-col span="10" >
                <s-checkbox v-model="stepForm1.allowAdRelation" :true-label="1" :false-label="0">按域中分组关系导入</s-checkbox>
              </s-col>
              <s-col span="10" >
                <s-checkbox v-model="stepForm1.holdTopName" :true-label="1" :false-label="0">保留顶级OU</s-checkbox>
              </s-col>
            </s-form-item>
            <s-form-item label="要导入的远程目标" prop="remoteDn">
              <s-col span="20">
                <s-input v-model="stepForm1.remoteDn"></s-input>
              </s-col>
              <s-col span="2" class="tipIcon">
                <s-tooltip class="tip" content="请填写远程目标的DN 例如：ou=group,dc=2016OMA,dc=com" placement="top-end">
                  <i class="iconfont icon-help"></i>
                </s-tooltip>
              </s-col>
            </s-form-item>
            <s-form-item label="过滤参数" prop="filter">
              <s-col span="20">
                <s-input v-model="stepForm1.filter"></s-input>
              </s-col>
              <s-col span="2" class="tipIcon">
                <s-tooltip class="tip" content="例如：objectClass=top" placement="top-end">
                  <i class="iconfont icon-help"></i>
                </s-tooltip>
              </s-col>
            </s-form-item>
            <s-form-item label="导入OU的最深深度">
              <s-col span="20">
                <s-input-number v-model.number="stepForm1.maxOuDeep" :min="0"></s-input-number>
              </s-col>
              <s-col span="2" class="tipIcon">
                <s-tooltip class="tip" content="该深度以下的用户,也将被同步到该组,而忽略该组下面的子组" placement="top-end">
                  <i class="iconfont icon-help"></i>
                </s-tooltip>
              </s-col>
            </s-form-item>
            <s-form-item label="备注" prop="remark">
              <s-col span="20">
                <s-input type="textarea" v-model="stepForm1.remark" :autosize="{minRows:4,maxRows:5}"></s-input>
              </s-col>
            </s-form-item>
          </s-form>
        </s-scrollbar>
      </div>
      <div class="stepContent" key="2" v-else-if="currentStep == 2">
        <s-scrollbar wrap-class="scrollheight">
          <s-form ref="stepForm2" :model="stepForm2" :rules="stepRules2" label-width="120px">
            <s-row class="title">
              <i class="icon iconfont icon-organ"></i>组织机构映射属性
            </s-row>
            <s-form-item label="组织机构属性">AD域属性</s-form-item>
            <s-form-item label="组织机构名称" prop="adDepartPro">
              <s-col span="20">
                <s-input v-model="stepForm2.adDepartPro"></s-input>
              </s-col>
              <s-col span="2" class="tipIcon">
                <s-tooltip class="tip" content="由中文、字母、数字、符号[_-.]组成" placement="top-end">
                  <i class="iconfont icon-help"></i>
                </s-tooltip>
              </s-col>
            </s-form-item>
            <s-form-item label="组织机构编号">
              <s-col span="20">
                <s-input v-model="stepForm2.adDepartnumPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="组织机构地址">
              <s-col span="20">
                <s-input v-model="stepForm2.adDepartaddsPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="组织机构联系方式">
              <s-col span="20">
                <s-input v-model="stepForm2.adDeparttelPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="备注" prop="adDepartremarkPro">
              <s-col span="20">
                <s-input type="textarea" v-model="stepForm2.adDepartremarkPro" :autosize="{minRows:4,maxRows:5}"></s-input>
              </s-col>
            </s-form-item>
            <s-row class="title">
              <i class="icon iconfont icon-user"></i>人员映射属性
            </s-row>
            <s-form-item label="人员属性">AD域属性</s-form-item>
            <s-form-item label="登录名" prop="adLoginnamePro">
              <s-col span="20">
                <s-input v-model="stepForm2.adLoginnamePro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="姓名" prop="adUsernamePro">
              <s-col span="20">
                <s-input v-model="stepForm2.adUsernamePro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="邮件地址" prop="adUseremailPro">
              <s-col span="20">
                <s-input v-model="stepForm2.adUseremailPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="手机号码" prop="adUserphonePro">
              <s-col span="20">
                <s-input v-model="stepForm2.adUserphonePro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="座机号码" prop="adUsertelPro">
              <s-col span="20">
                <s-input v-model="stepForm2.adUsertelPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="短号号码">
              <s-col span="20">
                <s-input v-model="stepForm2.adUsershortPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="工位">
              <s-col span="20">
                <s-input v-model="stepForm2.adUserposPro"></s-input>
              </s-col>
            </s-form-item>
            <s-form-item label="到期时间" prop="adExpirydatePro">
              <s-col span="20">
                <s-input v-model="stepForm2.adExpirydatePro"></s-input>
                <!--<s-date-picker
                  v-model="stepForm2.adExpirydatePro"
                  type="date"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  :picker-options="pickerOptions"
                  :editable="false"></s-date-picker>-->
              </s-col>
            </s-form-item>
            <s-form-item label="备注" prop="adUserremarkPro">
              <s-col span="20">
                <s-input type="textarea" v-model="stepForm2.adUserremarkPro" :autosize="{minRows:4,maxRows:5}"></s-input>
              </s-col>
            </s-form-item>
            <s-row class="title">
              <i class="icon iconfont icon-tag"></i>人员默认属性设置
            </s-row>
            <s-form-item label="人员性别">
              <s-col span="10">
                <s-select v-model="stepForm2.defUserGender">
                  <s-option label="保密" :value="0"></s-option>
                  <s-option label="男" :value="1"></s-option>
                  <s-option label="女" :value="2"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item label="人员角色" prop="defUserRole">
              <s-col span="10">
                <s-select v-model="stepForm2.defUserRole">
                  <s-option
                    v-for="list in roleLists"
                    :label="list.roleName"
                    :value="list.id"
                    :key="list.id"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item label="IP规则*" prop="defUserIp">
              <s-col span="20">
                <s-input v-model="stepForm2.defUserIp"></s-input>
              </s-col>
              <s-col span="2" class="tipIcon">
                <s-tooltip class="tip" content="多个IP(段)以英文逗号分割(例如: 192.168.1.*,192.168.[2,3].[1-5,15,25,35,45]);'*'表示不对登录IP地址做限制" placement="right">
                  <i class="iconfont icon-help"></i>
                </s-tooltip>
              </s-col>
            </s-form-item>
            <s-form-item label="规则类型">
              <s-col span="10">
                <s-select v-model="stepForm2.defIpType">
                  <s-option label="拒绝登录" :value="0"></s-option>
                  <s-option label="允许登录" :value="1"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
            <s-form-item label="人员状态">
              <s-col span="10">
                <s-select v-model="stepForm2.defUserStatus">
                  <s-option label="未激活" :value="0"></s-option>
                  <s-option label="正常" :value="1"></s-option>
                </s-select>
              </s-col>
            </s-form-item>
          </s-form>
        </s-scrollbar>
      </div>
    </div>
    <template slot="footer" class="dialog-footer">
      <s-button type="cancel" @click="dialogClose">取消</s-button>
      <s-button @click="next">{{okBtn}}</s-button>
    </template>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {intersectObj} from 'sunflower-common-utils'
  // import {Validaters} from 'sunflower-common-utils';

  export default {
    data() {
      let checkUserIp = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else {
          if (value === '*') {
            callback()
          } else {
            let regIpv4 = /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/;
            var regIpv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
            if (value.indexOf(',') !== -1) {
              let arr = value.split(',');
              for (let i = 0; i < arr.length; i++) {
                if (!regIpv4.test(arr[i]) && !regIpv6.test(arr[i])) {
                  callback(new Error(`第${i + 1}个ip格式不正确`));
                }
              }
            } else {
              if (!regIpv4.test(value) && !regIpv6.test(value)) {
                callback(new Error('ip格式不正确'));
              }
            }
            callback();
          }
        }
      }
      return {
        currentStep: this.transData.initStep,
        dialogFlag: false,
        localDepartLists: [],           // 本地组织机构列表
        roleLists: [],                   // 人员角色列表
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        stepForm0: {
          taskName: '',
          taskModel: 0
        },
        stepRules0: {
          taskName: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 30, message: '最大长度为30', trigger: 'blur'},
            {pattern: /[\u4e00-\u9fa5|\w|\-|\.]+/, message: '由中文、字母、数字、符号[_-.]组成', trigger: 'blur'}
          ]
        },
        stepForm1: {
          taskType: 0,
          importDepartId: '',
          allowAdRelation: 0,
          holdTopName: 0,
          remoteDn: '',
          filter: '',
          maxOuDeep: '',
          remark: ''
        },
        stepRules1: {
          remoteDn: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {pattern: /\w+=\w+/, message: '格式不正确', trigger: 'blur'}
          ],
          filter: [{pattern: /\w+=\w+/, message: '格式不正确', trigger: 'blur'}],
          remark: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        },
        stepForm2: {
          adDepartPro: '',
          adDepartnumPro: '',
          adDepartaddsPro: '',
          adDeparttelPro: '',
          adDepartremarkPro: '',
          adLoginnamePro: '',
          adUsernamePro: '',
          adUseremailPro: '',
          adUserphonePro: '',
          adUsertelPro: '',
          adUsershortPro: '',
          adUserposPro: '',
          adExpirydatePro: '',
          adUserremarkPro: '',
          defUserGender: 0,
          defUserRole: '',
          defUserIp: '*',
          defIpType: 0,
          defUserStatus: 0
        },
        stepRules2: {
          adDepartPro: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {max: 30, message: '最大长度为30', trigger: 'blur'},
            {pattern: /[\u4e00-\u9fa5|\w|\-|\.]+/, message: '由中文、字母、数字、符号[_-.]组成', trigger: 'blur'}
          ],
          adDepartremarkPro: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}],
          adLoginnamePro: [{required: true, message: '不能为空', trigger: 'blur'}],
          adUsernamePro: [{required: true, message: '不能为空', trigger: 'blur'}],
          defUserRole: [{type: 'number', required: true, message: '不能为空', trigger: 'change'}],
          defUserIp: [{validator: checkUserIp, message: 'IP规则不合法', trigger: 'blur'}],
          // adExpirydatePro: [{required: true, message: '不能为空', trigger: 'blur'}],
          adUserremarkPro: [{max: 120, message: '不能超过120个字符', trigger: 'blur'}]
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      transData: {
        type: Object,
        default() {
          return {
            initStep: 0,
            rowData: {}
          }
        }
      }
    },
    computed: {
      okBtn() {
        if (this.currentStep < 2) {
          return '下一步';
        } else {
          return '保存';
        }
      }
    },
    methods: {
      next() {
        let form = this.$refs[`stepForm${this.currentStep}`];
        form.validate((valid) => {
          if (!valid) {
            return false;
          }
          this.currentStep ++;
          if (this.currentStep > 2) {
            this.currentStep = 2;
            let sendData = Object.assign({}, this.stepForm0, this.stepForm1, this.stepForm2)
            let postUrl = ''
            let logTemplateTxt = ''
            if (this.transData.initStep === 0) {
              postUrl = '/sysLdapSync/saveStrategy'
              logTemplateTxt = '添加'
            } else {
              postUrl = '/sysLdapSync/editStrategy'
              logTemplateTxt = '编辑'
              this.$set(sendData, 'uuid', this.transData.rowData.uuid)
            }
            $axios.post(postUrl, sendData, {
              data: [{taskName: this.stepForm0.taskName}],
              logTemplate: `${logTemplateTxt}|人员管理>AD域导入(#taskName#)`
            }).then(res => {
              let resData = res.data
              if (resData === 'true') {
                this.$message({
                  type: 'success',
                  message: '保存成功！'
                })
                this.$emit('adImportSuccess')
                this.dialogFlag = false
              } else {
                this.$message({
                  type: 'error',
                  message: '保存失败，请重试！'
                })
              }
            })
          }
        });
      },
      dialogClose() {
        this.dialogFlag = false;
      },
      // 获取"本地组织机构列表"
      getDepartList() {
        return new Promise((resolve, reject) => {
          $axios.post('/iamUserInfo/getDepartList').then(res => {
            let resData = res.data
            if (resData && resData instanceof Array) {
              this.localDepartLists = resData
              this.stepForm1.importDepartId = this.localDepartLists[0].departId
              resolve(0)
            } else {
              reject(1)
            }
          })
        })
      },
      // 获取"人员角色列表"
      getIamRoleList() {
        return new Promise((resolve, reject) => {
          $axios.post('/iamRoleInfo/list').then(res => {
            let resData = res.data
            if (resData && resData instanceof Array) {
              this.roleLists = resData
              resolve(0)
            } else {
              reject(1)
            }
          })
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
    filters: {
      taskModel(val) {
        if (val === 0) return 'AD域组织结构同步';
        if (val === 1) return 'AD域安全组';
        return '';
      }
    },
    created() {
      Promise.all([this.getDepartList(), this.getIamRoleList()]).then(() => {
        // 编辑数据初始化
        if (this.transData.initStep === 1) {
          if (this.transData.rowData !== {}) {
            this.stepForm0 = intersectObj(this.stepForm0, this.transData.rowData)
            this.stepForm1 = intersectObj(this.stepForm1, this.transData.rowData)
            if (this.transData.rowData.defUserRole) {
              this.transData.rowData.defUserRole = Number.parseInt(this.transData.rowData.defUserRole)
            }
            this.stepForm2 = intersectObj(this.stepForm2, this.transData.rowData);
          }
        }
      })
    }
  }
</script>
