<script type="text/ecmascript-6">
  export default{
    data () {
      return {
        currentDate0: '',
        currentDate1: ''
      }
    },
    render(h) {
      let _this = this;
      let firstOption = {
        ref: 'first',
        attrs: {
          id: 'first',
          value: _this.currentDate0,
          type: 'datetime',
          placeholder: '请选择开始时间',
          editable: false
        },
        on: {
          input: function (value) {
            _this.currentDate0 = value;
            _this.$emit('input', [_this.currentDate0, _this.currentDate1])
          },
          change: _this.firstChange
        }
      };
      let lastOption = {
        ref: 'last',
        attrs: {
          id: 'last',
          value: _this.currentDate1,
          type: 'datetime',
          placeholder: '请选择结束时间',
          editable: false
        },
        on: {
          input: function (value) {
            _this.currentDate1 = value;
            _this.$emit('input', [_this.currentDate0, _this.currentDate1])
          },
          change: _this.lastChange
        }
      };
      if (_this.valueFormatFlag) {
        firstOption.attrs['value-format'] = 'yyyy-MM-dd HH:mm:ss';
        lastOption.attrs['value-format'] = 'yyyy-MM-dd HH:mm:ss';
      }
      let firstItem = h('sDatePicker', firstOption);
      let lastItem = h('sDatePicker', lastOption);
      return h('div', {}, [
        firstItem,
        '~',
        lastItem
      ]);
    },
    mounted() {
      this.currentDate0 = this.value[0] ? this.value[0] : ''
      this.currentDate1 = this.value[1] ? this.value[1] : ''
    },
    methods: {
      firstChange (value) {
        let start = this.currentDate0 ? new Date(this.currentDate0).getTime() : 0
        let end = this.currentDate1 ? new Date(this.currentDate1).getTime() : 0
        if (end) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '开始时间必须小于结束时间！'
            })
            this.currentDate0 = '';
          }
        }
      },
      lastChange (value) {
        let start = this.currentDate0 ? new Date(this.currentDate0).getTime() : 0
        let end = this.currentDate1 ? new Date(this.currentDate1).getTime() : 0
        if (start) {
          if (start >= end) {
            this.$message({
              type: 'warning',
              message: '结束时间必须大于开始时间！'
            })
            this.currentDate1 = '';
          }
        }
      }
    },
    props: {
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      valueFormatFlag: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
