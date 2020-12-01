  import {Validaters} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax';
  export default {
  data() {
    let vm = this;
    let checkRepeatName = (rule, value, callback) => {  // 校验重复邮箱
      if (vm.isAdd === 'edit' && value === vm.editData.name) {
        callback()
      } else {
        if (value) {
          $axios.get(`/dbaCustomReport/checkTaskNameUnique/${value}`).then((res) => {
            if (res.data.state === false) {
              callback(new Error('该名称已存在！'));
            } else {
              callback()
            }
          })
        }
      }
    };
    return {
      baseForm: {// 基本信息
        name: null,
        type: 0,
        fileType: 0,
        isActive: 1,
        note: null
      },
      baseRules: {
        name: [
          Validaters.NotNull,
          Validaters.Max(50),
          {validator: checkRepeatName, trigger: 'blur'}
        ],
        type: [Validaters.SelectValNotNull],
        fileType: [Validaters.SelectValNotNull],
        isActive: [Validaters.SelectValNotNull],
        note: [
          {min: 1, max: 500, message: '长度为1-500的字符', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {

  },
  methods: {

  }
}
