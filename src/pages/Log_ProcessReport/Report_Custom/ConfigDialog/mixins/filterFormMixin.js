  import {Validaters} from 'sunflower-common-utils'
import $axios from 'sunflower-ajax';
export default {
  data() {
    let check = (rule, value, callback) => {
      if (value.length) {
        callback()
      } else {
        callback(new Error('不能为空！'));
      }
    };
    let checkx = (rule, value, callback) => {
      if (value.length) {
        callback()
      } else {
        callback(new Error('至少选择一条信息！'));
      }
    };
    return {
      commandData: {},
      selectCommandDialog: false,
      filterDbData: [], // 数据库data
      filterForm: {
        operationTypeList: [1, 2, 3, 4, 5],
        dboIdListStr: null,
        cycleTime: 1,
        clientTools: null,
        loginName: null,
        clientIp: null,
        clientMac: null,
        dbiUuid: []
      },
      filterRules: {
        operationTypeList: [
          Validaters.NotNull,
          {validator: check, trigger: 'change'}],
        // dboIdListStr: [Validaters.NotNull],
        dbiUuid: [Validaters.NotNull,
          {validator: checkx, trigger: 'change'}]
      }
    }
  },
  computed: {

  },
  methods: {
    getFilterDbData() {
      let condition = {confition: { search: '' }};
      return $axios.post('/sysDbauditObject/getAll', condition)
    },
    openCommand() {
      if (this.isAdd === 'eye') {
        return;
      }
      if (this.filterForm.operationTypeList.length) {
        this.selectCommandDialog = true;
      } else {
        this.$message({
          message: '请先选择操作类型',
          type: 'warning'
        });
      }
    },
    commandReload(obj) {
      this.commandData = obj;
      let arr = Object.keys(obj).reduce((m, val) => {
        m.push(...(obj[val].map(item => item.split('-')[1])))
        return m
      }, [])
      this.filterForm.dboIdListStr = arr.join(',');
      this.$refs.filterForm.validateField('dboIdListStr')
    },
    getFilterHeaderSearch() {
      return {
        width: 10,
        offset: 20,
        placeholder: '请输入关键字',
        searchProps: ['dbiName', 'dbiIp', 'protocolName']
      }
    },
    filterSelection(arr) {
      if (!arr.length) {
        this.$refs.filterForm.validateField('dbiUuid')
      } else {
        this.$refs.filterForm.clearValidate('dbiUuid')
        this.filterForm.dbiUuid = arr;
      }
    }
  }
}
