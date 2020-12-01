  // import {Validaters} from 'sunflower-common-utils'
  import $axios from 'sunflower-ajax';
  import {cloneDeep} from 'lodash'
  export default {
  data() {
    return {
      tableData: [],
      selectTableRow: [],
      tableForm: {
        selectedTableData: [],
        column1: null,
        column2: null,
        sort1: null,
        sort2: null
      },
      tableRules: {
      }
    }
  },
  computed: {
    sortData() {
      let arr = [];
      this.tableForm.selectedTableData.forEach(fieldName => {
        this.tableData.forEach(obj => {
          if (obj.fieldName === fieldName) {
            arr.push(obj)
          }
        })
      })
      return arr
    }
  },
  methods: {
    typeChange(n) {
      this.getTableData(n).then(res => {
        this.tableData = res.data || []
        this.tableForm = {
          selectedTableData: [],
          column1: null,
          column2: null,
          sort1: null,
          sort2: null
        }
      })
    },
    getTableData(taskType) {
      return $axios.get(`/dbaCustomReport/getFieldBaseByTaskType/${taskType}`)
    },
    checkChange(arr, type, moveArr) {
      if (type === 'left') {
        this.selectTableRow = [];
        for (let v of moveArr) {
          if (this.tableForm.column1 === v) {
            this.tableForm.column1 = null;
            this.tableForm.sort1 = null;
          }
          if (this.tableForm.column2 === v) {
            this.tableForm.column2 = null;
            this.tableForm.sort2 = null;
          }
        }
      }
    },
    rightCheckChange(arr) {
      this.selectTableRow = arr;
    },
    upMove() {
      let select = this.selectTableRow;
      if (select.length < 1) return;
      if (select.length === 1) {
        let index = this.tableForm.selectedTableData.indexOf(select[0]);
        if (index === 0) return;
        this.tableForm.selectedTableData.splice(index, 1);
        this.tableForm.selectedTableData.splice(index - 1, 0, select[0]);
      } else {
        let rightData = cloneDeep(this.tableForm.selectedTableData);
        for (let i = 0; i < select.length; i++) {
          let index = rightData.indexOf(select[i]);
          rightData.splice(index, 1);
        }
        this.tableForm.selectedTableData = select.concat(rightData);
      }
    },
    downMove() {
      let select = this.selectTableRow;
      if (select.length < 1) return;
      if (select.length === 1) {
        let index = this.tableForm.selectedTableData.indexOf(select[0]);
        if (index === this.tableForm.selectedTableData.length - 1) return;
        this.tableForm.selectedTableData.splice(index, 1);
        this.tableForm.selectedTableData.splice(index + 1, 0, select[0]);
      } else {
        let rightData = cloneDeep(this.tableForm.selectedTableData);
        for (let i = 0; i < select.length; i++) {
          let index = rightData.indexOf(select[i]);
          rightData.splice(index, 1);
        }
        this.tableForm.selectedTableData = rightData.concat(select);
      }
    }
  },
  watch: {
    'tableForm.selectedTableData'(newVal, oldVal) {
      if (!newVal.length) {
        this.tableForm.column1 = null;
        this.tableForm.sort1 = null;
        this.tableForm.column2 = null;
        this.tableForm.sort2 = null;
      }
    }
  }
}
