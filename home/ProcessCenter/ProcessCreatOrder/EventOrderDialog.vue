<template>
    <section>
      <h3 class="orderTitle">创建事件单</h3>
      <s-scrollbar wrap-style="height: 400px;">
        <s-form class="eventOrderDiolog" :model="form" :rules="rules" ref="Form" label-width="120px">
          <s-form-item label="事件编号:">
            <span>{{form.serialCode}}</span>
          </s-form-item>
          <s-form-item label="简要描述:" prop="briefDesc">
            <s-input v-model="form.briefDesc" :maxlength="100"></s-input>
          </s-form-item>
          <s-form-item label="详细描述:" prop="detailDesc">
            <s-input type="textarea" :maxlength="300" v-model="form.detailDesc" :rows="3" placeholder="请输入内容"></s-input>
          </s-form-item>
          <s-form-item label="事件模板:">
            <s-input disabled v-model="template.templateName"></s-input>
            <i class="iconfont icon-enlarge" style="margin-left: 8px;" @click="showTemplateDialog"></i>
          </s-form-item>
          <s-form-item label="分类一级:" prop="categoryFirst">
            <s-cascader
              :options="companyAndCategoryList"
              :props="cascaderConfig"
              v-model="companyCategoryValue"
              expand-trigger="hover"
              :show-all-levels= "false"
              @change="changeCompanyAndCategory"
              style="width: calc(100% - 49px);"
            >
            </s-cascader>
          </s-form-item>
          <s-form-item label="分类二级:" prop="categorySecond">
            <s-select v-model="form.categorySecond" @change="axiosCategory(3)">
              <s-option v-for="opt in secondary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="分类三级:">
            <s-select v-model="form.categoryThird" clearable>
              <s-option v-for="opt in thirdary" :label="opt.categoryName" :value="opt.uuid" :key="opt.uuid"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="事件来源:" prop="incidentSource">
            <s-select v-model="form.incidentSource">
              <s-option v-for="(value, key, index) in options.incidentSourceMap" :label="value"
                        :value="key - 0"  :key="'incidentSourceMap' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="紧急性:" prop="criticality">
            <s-select v-model="form.criticality">
              <s-option v-for="(value, key, index) in options.criticalityMap" :label="value"
                        :value="key - 0"  :key="'criticalityMap' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="影响度:" prop="effect">
            <s-select v-model="form.effect">
              <s-option v-for="(value, key, index) in options.effectMap" :label="value"
                        :value="key - 0" :key="'effect' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="优先级:" prop="priority">
            <s-select v-model="form.priority" disabled>
              <s-option v-for="(value, key, index) in options.priorityMap" :label="value"
                        :value="key - 0" :key="'priority' + index"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="处理组:" prop="assignGroup">
            <s-select v-model="form.assignGroup" clearable @change="axiosUser">
              <s-option v-for="(item, index) in groupList" :key="'group' + index"
                :label="item.groupName" :value="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="处理人:" prop="assignUser">
            <s-select v-model="form.assignUser" clearable>
              <s-option v-for="(item, index) in userList" :key="'user' + index"
                        :label="item.userRealName" :value="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="最终用户姓名:" prop="endUser">
            <s-select v-model="form.endUser" filterable placeholder="请选择">
              <s-option v-for="(item, index) in endUserList" :label="item.userRealName"
                        :key="'endUser' + index" :value="item.uuid">
              </s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="最终用户电话:">
            <s-input v-model="endUser.userCellphone" disabled></s-input>
          </s-form-item>
          <s-form-item label="最终用户邮箱:">
            <s-input v-model="endUser.userMail" disabled></s-input>
          </s-form-item>
          <s-form-item label="目标完成时间:">
            <s-date-picker v-model="form.expectTimeStr" type="datetime" clearable
                           placeholder="请选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"
                           :picker-options="disableAfterToday1"
            >
            </s-date-picker>
          </s-form-item>
          <s-form-item label="附件信息:">
            <s-upload class="upload"
                      :action="baseUrl + '/fileUpload/uploadItilattach'"
                      multiple
                      :before-upload="beforeUpload"
                      :on-success="uploadSuccess"
                      :on-error="uploadError"
                      :on-remove="uploadRemove"
                      :with-credentials="true"
                      :file-list="fileList">
              <s-button slot="trigger" icon="export">上传</s-button>
            </s-upload>
          </s-form-item>
        </s-form>
      </s-scrollbar>
    </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import detailMixin from '@/pages/Process_EventDetail/EventDetailMixin';
  import Bus from '@/plugins/eventBus';

  export default {
    mixins: [ detailMixin ],
    data() {
      return {
        baseUrl: $axios.basePath(),
        template: {},
        disableAfterToday1: {
          disabledDate(time) {
            return time.getTime() <= Date.now();
          }
        }
      }
    },
    props: {
      defaultData: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      // 计算非监控事件紧急性默认值
      calCriticalityDefault(levelStr) {
        switch (levelStr) {
          case '严重': return {key: 1, str: '严重'};
          case '主要': return {key: 2, str: '高'};
          case '次要': return {key: 3, str: '中等'};
          case '警告': return {key: 4, str: '低'};
          default: return {key: 4, str: '低'};
        }
      },
      // 根据紧急性和影响度计算得出优先级
      calPriority() {
        let criticality = this.form.criticality; // 紧急性
        let effect = this.form.effect;   // 影响度
        if (criticality === 1) {
          switch (effect) {
            case 1: return 1;
            case 2: return 1;
            case 3: return 2;
            case 4: return 2;
          }
        } else if (criticality === 2) {
          switch (effect) {
            case 1: return 1;
            case 2: return 2;
            case 3: return 2;
            case 4: return 3;
          }
        } else if (criticality === 3) {
          switch (effect) {
            case 1: return 2;
            case 2: return 3;
            case 3: return 3;
            case 4: return 3;
          }
        } else if (criticality === 4) {
          switch (effect) {
            case 1: return 4;
            case 2: return 4;
            case 3: return 4;
            case 4: return 4;
          }
        }
      },
      initSelOption(field) { // 下拉框默认选中第一项
        // 如果事件中心首页创建事件单，根据事件类型，给下拉选项框赋默认值
        if (Object.keys(this.defaultData).length > 0) {
          // 所有类型的事件-"事件来源"默认"自助"
          this.form.incidentSource = 0;       // 0 - 自助

          if (this.defaultData.type === 1) {  // 监控事件默认值
            // 紧急性
            this.form.criticality = 1;        // 1 - 严重
            // 影响度
            this.form.effect = 2;             // 2 - 极大/大型
            // 优先级
            this.form.priority = 1;           // 1 - 重大
          } else {  // 非监控事件默认值
            this.form.criticality = this.calCriticalityDefault(this.defaultData.levelStr).key;    // 根据事件等级，严重、主要、次要、警告依次对应严重、高、中、低，其余也对应低
            this.form.effect = 3;             // 3 - 适度/受限
            this.form.priority = this.calPriority();
          }
        } else {
          let formField = field.slice(0, field.indexOf('Map'));
          if (Object.keys(this.options[field]).length > 0) {
            let key = Object.keys(this.options[field])[0];
            if (formField === 'criticality' || formField === 'effect') {
              key = Object.keys(this.options[field]).length;
            }
            this.form[formField] = key - 0;
          }
        }
      },
      changeCompanyAndCategory(val) {
        if (val.length > 0) {
          this.form.companyUuid = val[0];
          this.form.categoryFirst = val[1];
          let param = {
            ownerType: 0,
            companyUuid: this.form.companyUuid,
            categoryFirst: this.form.categoryFirst
          }
          this.form.categorySecond = '';
          this.form.categoryThird = '';
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
            this.secondary = data || [];
          })
        }
      },
      showTemplateDialog() {
        this.$emit('show-template', this.template);
      },
      temDialogCB(selTemplate) {
        this.template = selTemplate;
        this.companyCategoryValue = [selTemplate.companyUuid, selTemplate.categoryFirst];
        for (let i in selTemplate) {
          if (this.form.hasOwnProperty(i) && i !== 'serialCode') {
            this.form[i] = selTemplate[i];
          }
        }
        this.form.templateUuid = selTemplate.uuid;
        var categoryFirst = this.form.categoryFirst;
        // 判断一级分类是否还存在
        $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 0).then(({data}) => {
            if (data.length > 0) {
              let uuidArr = [];
              for (let item in data) {
                for (let j in data[item].childrenList) {
                  uuidArr.push(data[item].childrenList[j].uuid);
                }
              }
              if (uuidArr.indexOf(categoryFirst) === -1) {
                this.form.categoryFirst = '';
                this.form.categorySecond = '';
                this.form.categoryThird = '';
              } else {
                this.axiosCategorySecond(this.form);
                this.axiosCategoryThird(this.form);
              }
            } else {
              this.form.categoryFirst = '';
              this.form.categorySecond = '';
              this.form.categoryThird = '';
            }
        })
        // 判断处理组是否还存在
        $axios.get(`/itilIncidentCenter/getGroup/${this.form.companyUuid}`).then(({data}) => {
          if (data.length > 0) {
            let groupUuidArr = [];
            for (let i in data) {
              groupUuidArr.push(data[i].uuid);
            }
            // 判断处理人是否还存在
            if (this.form.assignGroup) {
              $axios.get(`/itilIncidentCenter/getIncidentOrderUser/${this.form.assignGroup}`).then(({data}) => {
                let userUuidArr = [];
                if (data.length > 0) {
                  for (let i in data) {
                    userUuidArr.push(data[i].uuid);
                  }
                  this.userList = data;
                  if (userUuidArr.indexOf(this.form.assignUser) === -1) {
                    this.form.assignUser = '';
                    this.form.assignGroup = '';
                  }
                } else {
                  this.form.assignUser = '';
                  this.form.assignGroup = '';
                }
              })
            }
            if (groupUuidArr.indexOf(this.form.assignGroup) === -1) {
              this.form.assignGroup = '';
            }
          } else {
            this.form.assignUser = '';
            this.form.assignGroup = '';
          }
        })
      }
    },
    created() {
      this.$set(this.form, 'expectTimeStr', '');
      this.axiosOptions(data => {
        this.form.serialCode = data.serialCode
        for (let i in this.options) {
          this.initSelOption(i);
        }
      });
      // 判断请求来源，如果是直接新建传入true，否则为false
      if (Object.keys(this.defaultData).length > 0) {
        this.axiosComCategory(false);
      } else {
        this.axiosComCategory(true);
      }
      this.axiosEndUser(data => {
        // 如果事件中心首页创建事件单，且是监控事件，给最终用户姓名字段赋默认值为系统账号
        if (Object.keys(this.defaultData).length > 0 && this.defaultData.type === 1) {
          // this.form.endUser = this.$store.state.userData.uuid;
          this.form.endUser = '';
        } else {
          this.form.endUser = data[0].uuid;
        }
      });
      // 如果事件中心首页创建事件单，给"简要/详细描述"字段赋默认值
      if (Object.keys(this.defaultData).length > 0) {
        let item = this.defaultData;
        switch (item.type) {
          case 1: // 监控事件
            // 获取当前值(数字字符串格式)
            $axios.get(`/incidentCount/incidentCountByUuid/${item.uuid}`).then(({data}) => {
              if (data && data.currentValue) {
                let sendData = [data.currentValue.replace('[', '').replace(']', '')];
                let detailCurrentValue = '';
                // 获取当前值数字字符串对应的文字
                $axios.post('/incidentCount/getCurrentValueChina', sendData).then((res) => {
                  if (res.data && typeof res.data === 'string') {
                    if (data.type === 2) {
                      detailCurrentValue = ['ping不通', 'ping通'][res.data];
                    } else if (this.detailData.type === 3) {
                      this.detailCurrentValue = this.detailData.currentValue === '0' ? '凭证检测不通' : '凭证检测通'
                    } else {
                      detailCurrentValue = `[${res.data}]`;
                    }
                    // 简要/详细描述默认值
                    this.form.briefDesc = `{资产名称:${item.itcompName}，IP:${item.controlAdderss}}异常，触发规则:{${data.groupDesc}}，当前值:{${detailCurrentValue}}`;
                    this.form.detailDesc = `${item.createTimeStr}，{资产名称:${item.itcompName}，IP:${item.controlAdderss}}异常，触发规则:{${data.groupDesc}}，当前值:{${detailCurrentValue}}`;
                  }
                });
              }
            });
            break;
          case 2: // 运维审计事件
            let uuid = this.defaultData.sessionUuid || this.defaultData.monitorItemUuid;
            // 获取运维审计事件命令告警/命令阻断/会话阻断数量
            $axios.get(`/sessionCmd/getSessionDetailBySessionUuid/${uuid}`).then(({data}) => {
              if (data.sessionList) {
                let {i, j, k} = {i: data.i, j: data.j, k: data.k};
                // 简要描述默认值
                this.form.briefDesc = `{目标资产IP:${item.controlAdderss}}异常，{命令告警:${i}}{命令阻断:${j}}{会话阻断:${k}}`;
              }
            });
            break;
          case 3: // 数据库审计事件
            this.form.briefDesc = `{数据库:${item.itcompName}，数据库IP:${item.controlAdderss}}异常，触发规则{${item.thresholdName}}`;
            break;
          case 4: // 业务审计事件
            this.form.briefDesc = `{中间件系统:${item.itcompName}，IP:${item.controlAdderss}”}异常，触发规则{${item.thresholdName}}`;
            break;
          case 5: // 日志审计时间
            this.form.briefDesc = `{日志源:，IP:}触发规则{${item.thresholdName}}`;
            break;
        }
      }
      // 事件中心首页创建事件单，简要描述/详细描述默认值
      Bus.$on('finish', this.temDialogCB); // 事件模板选择的回调
    }
  }
</script>
