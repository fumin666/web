import $axios from 'sunflower-ajax';
import {Validaters} from 'sunflower-common-utils';

export default {
  data() {
    return {
      form: {
        serialCode: '',
        endUser: '',
        briefDesc: '',
        detailDesc: '',
        endUserName: '',
        categoryFirst: '',
        categorySecond: '',
        categoryThird: '',
        categoryFirstName: '',
        categorySecondName: '',
        categoryThirdName: '',
        incidentSource: '',
        criticality: '',
        effect: '',
        priority: '',
        assignGroup: '',
        assignUser: '',
        companyUuid: '',
        templateUuid: ''
      },
      rules: {
        briefDesc: [
          Validaters.NotNull
        ],
        categoryFirst: [ Validaters.NotNull ],
        categorySecond: [ Validaters.NotNull ],
        incidentSource: [ Validaters.NotNull ],
        criticality: [ Validaters.NotNull ],
        effect: [ Validaters.NotNull ],
        priority: [ Validaters.NotNull ],
        endUser: [ Validaters.NotNull ]
      },
      companyAndCategoryList: [],
      cascaderConfig: {
        label: 'name',
        value: 'uuid',
        children: 'childrenList'
      },
      companyCategoryValue: [],
      topCategory: [],
      secondary: [],
      thirdary: [],
      options: { // 来源、紧急性、影响度、优先级、处理组、状态下拉选项
        incidentSourceMap: {},
        criticalityMap: {},
        effectMap: {},
        priorityMap: {},
        // groupInfo: [],
        statusMap: {}
      },
      groupList: [],
      userList: [],
      endUserList: [],
      fileList: []
    }
  },
  computed: {
    endUser() {
      return this.endUserList.find(item => {
        return item.uuid === this.form.endUser;
      }) || {}
    },
    fromAdd() {
      if (this.$route.path.indexOf('eventDetail') !== -1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    axiosOptions(callback = () => {}) {
      $axios.get('/itilIncidentCenter/toCreateIncidentOrder').then(({data}) => {
        for (let i in this.options) {
          this.options[i] = data[i]
        }
        callback(data);
      })
    },
    axiosComCategory(defaultFirstUUid = true) {
      $axios.get('/ItilCommonWorkflow/getCompanyAndCategory/' + 0).then(({data}) => {
        this.companyAndCategoryList = data;
        if (data.length > 0) {
          this.companyCategoryValue = [data[0].uuid, data[0].childrenList[0].uuid];
          this.form.companyUuid = this.companyCategoryValue[0];
          this.form.categoryFirst = this.companyCategoryValue[1];
          let param = {
            ownerType: 0,
            companyUuid: this.form.companyUuid,
            categoryFirst: this.form.categoryFirst
          }
          $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
            this.secondary = data || [];
            defaultFirstUUid
              ? this.form.categorySecond = this.secondary[0].uuid
              : this.form.categorySecond = this.secondary[this.defaultData.type - 1].uuid;  // 分类二级默认为对应的事件类型
            this.axiosCategory(3);
            this.axiosGroup();
          })
        }
      })
    },
    axiosCategorySecond(msg) {
      let param = {};
      param.categoryFirst = msg.categoryFirst;
      param.ownerType = 0;
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
        this.secondary = data;
      })
    },
    axiosCategoryThird(msg) {
      let param = {};
      param.categoryFirst = msg.categoryFirst;
      param.categorySecond = msg.categorySecond;
      param.ownerType = 0;
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
        this.thirdary = data;
      })
    },
    axiosCategory(level = 1, callback = () => {}) { // 获取三级分类信息
      let param = {
        ownerType: 0
      }
      if (level === 2) {
        param.categoryFirst = this.form.categoryFirst;
        this.form.categorySecond = '';
        this.form.categoryThird = '';
      }
      if (level === 3) {
        param.categoryFirst = this.form.categoryFirst;
        param.categorySecond = this.form.categorySecond;
        this.form.categoryThird = '';
      }
      $axios.post('/ItilCommonWorkflow/getItilCategorySelect', param).then(({data}) => {
        switch (level) {
          case 1:
            this.topCategory = data || [];
            break;
          case 2:
            this.secondary = data || [];
            break;
          case 3:
            this.thirdary = data || [];
            break;
        }
        callback();
      })
    },
    axiosGroup() {
      $axios.get(`/itilIncidentCenter/getGroup/${this.form.companyUuid}`).then(({data}) => {
        this.groupList = data;
      })
    },
    changeGroup(val) {
      this.form.assignUser = '';
      $axios.get(`/itilIncidentCenter/getIncidentOrderUser/${val}`).then(({data}) => {
        this.userList = data;
      })
    },
    axiosUser() {
      $axios.get(`/itilIncidentCenter/getIncidentOrderUser/${this.form.assignGroup}`).then(({data}) => {
        this.userList = data;
      })
    },
    axiosEndUser(callback = () => {}) {
      $axios.get(`/itilIncidentCenter/getIamUserInfo`).then(({data}) => {
        this.endUserList = data;
        callback(data);
      })
    },
    beforeUpload(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.$message({type: 'error', message: '单个文件大小不能超过10M!'});
        return false;
      }
    },
    uploadSuccess(res, file, fileList) {
      this.fileList = fileList;
    },
    uploadError() {
      this.$message({type: 'error', message: '上传失败'});
    },
    uploadRemove(file, fileList) {
      this.fileList = fileList;
      this.axiosDelFile(file);
    },
    axiosDelFile(file) {
      $axios.post(`/ItilCommonWorkflow/itilOrderFileDelete`, [file.response.attachuuid]);
    },
    calcPriority() { // 优先级由紧急性和影响度决定
      switch (this.form.criticality) {
        case 1:
          if (this.form.effect === 1 || this.form.effect === 2) {
            this.form.priority = 1;
          } else {
            this.form.priority = 2;
          }
          break;
        case 2:
          if (this.form.effect === 1) {
            this.form.priority = 1;
          } else if (this.form.effect === 4) {
            this.form.priority = 3;
          } else {
            this.form.priority = 2;
          }
          break;
        case 3:
          this.form.priority = this.form.effect === 1 ? 2 : 3;
          break;
        case 4: this.form.priority = 4; break;
      }
    }
  },
  watch: {
    // 'form.categoryFirst': {
    //   deep: true,
    //   handler: function(newVal, oldVal) {
    //     if (newVal !== '') {
    //       this.axiosCategory(2);
    //     }
    //   }
    // },
    // 'form.categorySecond': {
    //   deep: true,
    //   handler: function(newVal, oldVal) {
    //     if (newVal !== '') {
    //       this.axiosCategory(3);
    //     }
    //   }
    // },
    'form.criticality': {
      immediately: true,
      handler() {
        this.calcPriority()
      }
    },
    'form.effect': {
      immediately: true,
      handler() {
        this.calcPriority()
      }
    }
  }
}
