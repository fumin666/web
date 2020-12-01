<template>
  <s-form ref="addForm" :model="ruleAddForm" :rules="rules" label-width="120px" class="auth-rule-add">
    <s-form-item label="规则名称" prop="ruleName">
      <s-input v-model="ruleAddForm.ruleName" placeholder="请输入规则名称"></s-input>
    </s-form-item>
    <s-form-item label="规则类型" prop="ipType">
      <s-select v-model="ruleAddForm.ipType">
        <s-option label="允许" :value="1"></s-option>
        <s-option label="禁止" :value="0"></s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="时间范围" required style="margin-bottom: 0">
      <s-col :span="11">
        <s-form-item prop="startTimeStr">
          <s-date-picker
            v-model="ruleAddForm.startTimeStr"
            format
            type="datetime"
            placeholder="请选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </s-date-picker>
        </s-form-item>
      </s-col>
      <s-col :span="2">-</s-col>
      <s-col :span="11">
        <s-form-item prop="endTimeStr">
          <s-date-picker
            :disabled="ruleAddForm.isForever === 1"
            v-model="ruleAddForm.endTimeStr"
            type="datetime"
            placeholder="请选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions0">
          </s-date-picker>
        </s-form-item>
      </s-col>
    </s-form-item>
    <s-form-item label="">
      <s-col span="11" offset="13">
        <s-checkbox
          v-model="ruleAddForm.isForever"
          :true-label="1"
          :false-label="0">永不结束</s-checkbox>
      </s-col>
    </s-form-item>
    <s-form-item label="每周" prop="_weeks">
      <s-select v-model="ruleAddForm._weeks" multiple placeholder="请选择" @change="getWeeks">
        <s-option
          v-for="item in weeks"
          :label="item.label"
          :value="item.val"
          :key="item.val">
        </s-option>
      </s-select>
    </s-form-item>
    <s-form-item label="每天" required>
      <s-col :span="11">
        <s-form-item prop="_starthour">
          <s-time-picker
            v-model="ruleAddForm._starthour"
            format="HH:mm"
            @change="getStartHour">
          </s-time-picker>
        </s-form-item>
      </s-col>
      <s-col :span="2">-</s-col>
      <s-col :span="11">
        <s-form-item prop="_endhour">
          <s-time-picker
            v-model="ruleAddForm._endhour"
            format="HH:mm"
            @change="getEndHour"
            :picker-options="{selectableRange: startHour + ':00 - 23:59:59'}">
          </s-time-picker>
        </s-form-item>
      </s-col>
    </s-form-item>
    <s-form-item label="IP规则" prop="ipRule" tip="多个IP(段)以英文逗号分割(例如:192.168.1.*,192.168.[2,3].[1-5,15,25,35,45]);'*'表示所有登录IP地址.">
      <s-input v-model="ruleAddForm.ipRule"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  export default {
    props: {
      data: Object
    },
    data() {
      let checkName = (rule, value, callback) => {
        if (value) {
          let res = value.search(/[^-|\w|\u4e00-\u9fa5]/g);
          if (res > -1) {
            callback(new Error('由中文、字母、数字、-、_组成'));
          } else {
            callback();
          }
        }
      };
      let validateEndTime = (rule, value, callback) => {
        if (this.ruleAddForm.isForever === 0) {
          if (value.length === 0) {
            return callback(new Error('请选择结束时间'));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
      return {
        weeks: [
          {label: '星期一', val: '1'},
          {label: '星期二', val: '2'},
          {label: '星期三', val: '3'},
          {label: '星期四', val: '4'},
          {label: '星期五', val: '5'},
          {label: '星期六', val: '6'},
          {label: '星期日', val: '7'}
        ],
        ruleAddForm: {
          ruleName: '',
          ipType: 1,
          startTimeStr: '',
          endTimeStr: '',
          weeks: '',
          _weeks: [],
          starthour: '',
          _starthour: '',
          endhour: '',
          _endhour: '',
          ipRule: '*',
          isForever: 0
        },
        rules: {
          ruleName: [
            {required: true, message: '请输入访问规则名称', trigger: 'blur'},
            {max: 30, message: '最大长度为30', tirgger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          ipType: [
            {type: 'number', required: true, message: '请选择规则类型', trigger: 'change'}
          ],
          startTimeStr: [
            {required: true, message: '请选择开始时间', trigger: 'change'}
          ],
          endTimeStr: [
            { validator: validateEndTime, trigger: 'change' }
            // {required: true, message: '请选择结束时间', trigger: 'change'}
          ],
          _weeks: [
            {type: 'array', required: true, message: '请选择每周时间', trigger: 'change'}
          ],
          _starthour: [
            {type: 'date', required: true, message: '请选择开始时间', trigger: 'change'}
          ],
          _endhour: [
            {type: 'date', required: true, message: '请选择结束时间', trigger: 'change'}
          ],
          ipRule: [
            {required: true, message: '请输入ip规则', trigger: 'blur'}
          ]
        },
        startHour: ''
      }
    },
    computed: {
      pickerOptions0() {
        let vm = this;
        return {
          disabledDate(time) {
            return time.getTime() < Date.parse(vm.ruleAddForm.startTimeStr) - 8.64e7;
          }
        }
      }
    },
    methods: {
      getWeeks(val) {
        this.ruleAddForm.weeks = val.toString();
      },
      getStartHour(val) {
        this.ruleAddForm.starthour = this.parseHHmm(val);
        this.startHour = this.ruleAddForm.starthour.substr(0, 2) + ':' + this.ruleAddForm.starthour.substr(2, 2);
      },
      getEndHour(val) {
        this.ruleAddForm.endhour = this.parseHHmm(val);
      },
      Format (strTime, fmt) {
        let newTime = strTime * 1000;
        let date = new Date(newTime);
        let o = {
          'M+': date.getMonth() + 1, // 月份
          'd+': date.getDate(), // 日
          'h+': date.getHours(), // 小时
          'm+': date.getMinutes(), // 分
          's+': date.getSeconds(), // 秒
          'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
          'S': date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        for (var k in o) {
          if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
        return fmt;
      },
      parseHHmm(val) {
        let HH = val.getHours() < 10 ? '0' + val.getHours() : val.getHours();
        let mm = val.getMinutes() < 10 ? '0' + val.getMinutes() : val.getMinutes();
        return HH + '' + mm;
      }
    },
    mounted() {
      if (this.data) {
        this.ruleAddForm.ruleName = this.data.ruleName;
        this.ruleAddForm.ipType = this.data.ipType;
        this.ruleAddForm.startTimeStr = this.data.startTime;
        this.ruleAddForm._weeks = this.data.weeks.split(',');
        this.ruleAddForm.weeks = this.data.weeks;
        this.ruleAddForm.starthour = this.data.starthour;
        this.ruleAddForm.endhour = this.data.endhour;
        this.ruleAddForm._starthour = new Date(2017, 1, 1, this.data.starthour.substr(0, 2), this.data.starthour.substr(2, 2));
        this.ruleAddForm._endhour = new Date(2017, 1, 1, this.data.endhour.substr(0, 2), this.data.endhour.substr(2, 2));
        this.ruleAddForm.ipRule = this.data.ipRule;
        this.ruleAddForm.uuid = this.data.uuid;
        this.startHour = this.ruleAddForm.starthour.substr(0, 2) + ':' + this.ruleAddForm.starthour.substr(2, 2);
        this.ruleAddForm.isForever = this.data.isForever;
        // 结束日期若为永不结束，则删掉结束日期
        if (this.ruleAddForm.isForever === 1) {
          this.ruleAddForm.endTimeStr = '';
        } else {
          this.ruleAddForm.endTimeStr = this.data.endTime;
        }
      }
    }
  }
</script>

<style>
  .auth-rule-add .s-col-2 {
    text-align: center;
  }
  .auth-rule-add .s-date-editor.s-input {
    width: 100%;
  }
</style>
