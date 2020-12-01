<template>
  <section id="setProperty">
    <s-scrollbar>
      <s-row class="step-title">
        设计器使用引导
        <span class="title-tip">--{{$store.state.serviceRequest.requestName}}</span>
      </s-row>
      <s-form
        :model="setPropertyForm" :rules="setPropertyFormRules"
        ref="setPropertyForm" label-width="120px">
        <s-form-item label="关键字:" prop="keyword" class="keyword">
          <s-input v-model="setPropertyForm.keyword" :maxlength="120" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1"></s-input>
        </s-form-item>
        <s-form-item label="成本:" class="custom-prepend" prop="cost">
          <s-input v-model.number="setPropertyForm.cost" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">
            <s-select v-model="setPropertyForm.costType" slot="prepend" placeholder="请选择货币单位" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">
              <s-option label="人民币(CNY)" :value="1"></s-option>
              <s-option label="美元(USD)" :value="2"></s-option>
            </s-select>
          </s-input>
        </s-form-item>
        <s-form-item label="价格:" class="custom-prepend" prop="price">
          <s-input v-model.number="setPropertyForm.price" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">
            <s-select v-model="setPropertyForm.priceType" slot="prepend" placeholder="请选择货币单位" :disabled="designeruuid&&inlayarr.indexOf(designeruuid)!=-1">
              <s-option label="人民币(CNY)" :value="1"></s-option>
              <s-option label="美元(USD)" :value="2"></s-option>
            </s-select>
          </s-input>
        </s-form-item>
        <s-form-item label="服务时间:" prop="service">
          <s-select v-model="setPropertyForm.service">
            <s-option
              v-for="list in serviceTimeLists"
              :label="list.servicetimeTitle"
              :value="list.uuid"
              :key="list.uuid">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="紧急性:" prop="criticality">
          <s-select v-model="setPropertyForm.criticality">
            <s-option
              v-for="(list, idx) in criticalityLists"
              :label="list.name"
              :value="list.value"
              :key="idx">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="影响度:" prop="effect">
          <s-select v-model="setPropertyForm.effect">
            <s-option
              v-for="(list, idx) in effectLists"
              :label="list.name"
              :value="list.value"
              :key="idx">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="优先级:" prop="priority">
          <s-select v-model="setPropertyForm.priority" :disabled="true">
            <s-option
              v-for="(value, key) in priorityLists"
              :label="value"
              :value="parseInt(key)"
              :key="key">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="服务提供者:" prop="provideUuid">
          <s-select v-model="setPropertyForm.provideUuid">
            <s-option
              v-for="list in provideLists"
              :label="list.groupName"
              :value="list.uuid"
              :key="list.uuid">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="请求管理员组:" prop="requestOrgUuid">
          <s-select v-model="setPropertyForm.requestOrgUuid">
            <s-option
              v-for="list in adminGroupLists"
              :label="list.groupName"
              :value="list.uuid"
              :key="list.uuid">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="请求管理员:" prop="requestUuid">
          <s-select v-model="setPropertyForm.requestUuid">
            <s-option
              v-for="list in adminLists"
              :label="list.userRealName"
              :value="list.uuid"
              :key="list.uuid">
            </s-option>
          </s-select>
        </s-form-item>
        <s-form-item label="图标:" prop="image">
          <s-row>
            <s-col :span="2">
              <div class="icon-show">
                <i v-if="!!setPropertyForm.image" class="icon iconfont" :class="setPropertyForm.image" style="font-size: 32px"></i>
                <i v-else class="iconfont icon-help" style="font-size: 32px"></i>
              </div>
            </s-col>
            <s-col :span="22">
              <s-button @click="chooseIconPic">选择</s-button>
            </s-col>
          </s-row>
        </s-form-item>
      </s-form>
    </s-scrollbar>

    <!--预览已选图片-->
    <s-dialog
      v-model="chooseIconPicDialog"
      v-if="chooseIconPicDialog"
      title="选择图标"
      ref="chooseIconPicDialog">
      <s-scrollbar wrap-style="max-height:450px;">
        <s-row class="icon-row">
          <s-col
            :span="4"
            class="icon-col"
            v-for="(img, idx) in iconImgSrcs"
            :key="idx">
            <div class="icon-ctn" :class="{current: setPropertyForm.image === img}">
              <i class="icon iconfont" :class="img" @click="chooseIconOver(img)" style="font-size: 32px;"></i>
            </div>
          </s-col>
        </s-row>
      </s-scrollbar>
      <template slot="footer">
        <s-button @click="chooseIconPicDialog=false">确定</s-button>
        <s-button type="cancel" @click="chooseIconPicDialog=false">取消</s-button>
      </template>
    </s-dialog>
  </section>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax';
  import { intersectObj, Validaters } from 'sunflower-common-utils';

  export default {
    data() {
      return {
        serviceTimeLists: [],     // 服务时间下拉选项列表
        priorityLists: {},        // 优先级下拉选项列表
        // 紧急性下拉选项列表
        criticalityLists: [
          {name: '严重', value: 1},
          {name: '高', value: 2},
          {name: '中等', value: 3},
          {name: '低', value: 4}
        ],
        // 影响度下拉选项列表
        effectLists: [
          {name: '广泛/普遍', value: 1},
          {name: '极大/大型', value: 2},
          {name: '适度/受限', value: 3},
          {name: '次要/本地', value: 4}
        ],
        provideLists: [],         // 服务提供者下拉选项列表
        adminGroupLists: [],      // 请求管理员组下拉选项列表
        adminLists: [],           // 请求管理员下拉选项列表
        setPropertyForm: {
          keyword: '',
          cost: '',
          costType: 1,
          price: '',
          priceType: 1,
          service: '',
          priority: '',
          criticality: '',
          effect: '',
          provideUuid: '',
          requestOrgUuid: '',
          requestUuid: '',
          image: null,           // 当前选中的图标路径
          uuid: null
        },
        setPropertyFormRules: {
          keyword: [{required: true, message: '不能为空', trigger: 'blur'}],
          cost: [Validaters.Number],
          price: [Validaters.Number],
          service: [],
          priority: [{type: 'number', required: true, message: '不能为空', trigger: 'change'}],
          criticality: [{type: 'number', required: true, message: '不能为空', trigger: 'change'}],
          effect: [{type: 'number', required: true, message: '不能为空', trigger: 'change'}],
          provideUuid: [{required: true, message: '不能为空', trigger: 'change'}],
          requestOrgUuid: [{required: true, message: '不能为空', trigger: 'change'}],
          requestUuid: [{required: true, message: '不能为空', trigger: 'change'}],
          image: [{required: true, message: '请选择图标', trigger: 'change'}]           // 当前选中的图标路径
        },
        chooseIconPicDialog: false,     // 选择图标弹框
        iconImgSrcs: []
      }
    },
    watch: {
      // 请求管理员组改变-->获取请求管理员下拉选项列表
      'setPropertyForm.requestOrgUuid'(val) {
        if (val) this.getAdminList(val);
      },
      // 计算得出的优先级变化，赋值给表单对应priority字段
      priority(val) {
        this.setPropertyForm.priority = val;
      }
    },
    computed: {
      // 根据紧急性和影响度计算得出优先级
      priority() {
        let criticality = this.setPropertyForm.criticality; // 紧急性
        let effect = this.setPropertyForm.effect;   // 影响度
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
      inlayarr() {
        return this.$store.state.serviceRequest.inlayarr
      },
      designeruuid() {
        if (this.$store.state.serviceRequest.editDesigner) {
          return this.$store.state.serviceRequest.editDesigner.uuid
        } else {
          return null;
        }
      }
    },
    methods: {
      // 获取服务时间下拉选项列表
      getServiceTimeLists() {
        $axios.get('/itilSla/getItilSlaServicetimeList').then(({data}) => {
          if (data && data instanceof Array) {
            this.serviceTimeLists = data;
          }
        });
      },
      // 获取优先级下拉选项列表
      getPriorityLists() {
        $axios.get('/itilServiceRequest/getItilPriority').then(({data}) => {
          if (data && data instanceof Object) {
            this.priorityLists = data;
          }
        });
      },
      // 获取服务提供者下拉选项列表
      getProvideLists() {
        let companyUuid = this.$store.state.serviceRequest.companyUuid;
        $axios.get(`/itilWorkflowConfig/getAllSupportGroupByCompanyUuid/${companyUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.provideLists = data;
          }
        });
      },
      // 获取请求管理员组下拉选项列表
      getAdminGroupLists() {
        let companyUuid = this.$store.state.serviceRequest.companyUuid;
        $axios.get(`/itilServiceRequest/getRequestManagerList/${companyUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.adminGroupLists = data;
          }
        });
      },
      // 获取请求管理员下拉选项列表
      getAdminList(groupUuid) {
        $axios.get(`/itilServiceRequest/getIamUserInfoListByGroupUuidAndRole/${groupUuid}`).then(({data}) => {
          if (data && data instanceof Array) {
            this.adminLists = data;
          }
        });
      },
      // 获取设计器图标列表
      getDesignerIconList() {
        let ary = ['icon-fwqq-router', 'icon-fwqq-leaving', 'icon-fwqq-transfer', 'icon-fwqq-diskarray', 'icon-fwqq-documents',
          'icon-fwqq-rehired', 'icon-fwqq-crm', 'icon-fwqq-onboarding', 'icon-fwqq-ip', 'icon-fwqq-bsd', 'icon-fwqq-permission', 'icon-fwqq-ips',
          'icon-fwqq-geleiMIS', 'icon-fwqq-email', 'icon-layout-custom', 'icon-fwqq-virtualization', 'icon-fwqq-web', 'icon-fwqq-dhcp',
          'icon-fwqq-dns', 'icon-fwqq-OA', 'icon-fwqq-hpux', 'icon-fwqq-ids', 'icon-fwqq-firewall', 'icon-fwqq-ad', 'icon-fwqq-middleware',
          'icon-fwqq-websever', 'icon-fwqq-windows', 'icon-fwqq-linux', 'icon-fwqq-solaris', 'icon-fwqq-fiber', 'icon-fwqq-aix', 'icon-fwqq-database',
          'icon-proof', 'icon-star-full', 'icon-in-column', 'icon-nav-oper-auto']
        this.iconImgSrcs = ary;
      },
      // 打开选择图标弹框
      chooseIconPic() {
        this.chooseIconPicDialog = true;
      },
      // 选中图标
      chooseIconOver(img) {
        this.setPropertyForm.image = img;
      }
    },
    created() {
      this.getServiceTimeLists();     // 获取服务时间下拉选项列表
      this.getPriorityLists();        // 获取优先级下拉选项列表
      this.getProvideLists();         // 获取服务提供者下拉选项列表
      this.getAdminGroupLists();      // 获取请求管理员组下拉选项列表
      this.getDesignerIconList();     // 获取设计器图标列表
      // 获取服务请求流程sla是否开启
      $axios.get(`/itilSla/getItilSlaCommonsettingList`).then((res) => {
        if (res.status === 200) {
          if (res.data[1].isEnable === 1) {
            this.setPropertyFormRules.service.push({
              required: true,
              message: '不能为空',
              trigger: 'change'
            })
          } else {
            this.setPropertyFormRules.service = []
          }
        } else {
          this.$message({showClose: true, message: '获取状态失败!', type: 'error'});
        }
      })
    },
    // <keep-alive>切换到当前组件触发该钩子
    activated() {
      let state = this.$store.state.serviceRequest;
      // 编辑设计器时，获取编辑回显数据
      if (state.editDesigner) {
        this.setPropertyForm = intersectObj(this.setPropertyForm, state.editDesigner.editData.itilRequestProperties);
        this.$nextTick(() => {
          this.$refs.setPropertyForm.validate(valid => {
            console.log(valid);
          });
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #setProperty
    .s-form .s-form-item
      &.keyword
        .s-input
          width 40%
      &.custom-prepend
        .s-form-item-content .s-input
          &.s-input-group.s-input-group-prepend
            width 40%
          .s-input-group_prepend
            width 90px
            .s-select
              margin-left -10px
              .s-input.s-input-suffix
                left -1px
                .s-input-inner:focus
                  border-color transparent
      &:not(.custom-prepend)
        .s-form-item-content
          .s-select
            width 40%
    .icon-show
      width 50px
      height 50px
      line-height 50px
      text-align center
      display inline-block
      border-radius 3px
      > img
        width 50px
        width 50px
    .icon-row
      padding 15px 0
      .icon-col .icon-ctn
        width 60px
        height 60px
        margin 0 auto
        line-height 60px
        text-align center
        cursor pointer
        .icon-img
          width 50px
          height 50px
          vertical-align middle
</style>
