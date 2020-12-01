<template>
  <div class="event-rule-new">
    <!--监控项-->
    <s-scrollbar wrap-style="max-height: 600px;" v-if="this.data.length > 0">
      <div class="title">规则</div>
      <s-table :data="list">
        <s-table-column label="逻辑" width="100px">
          <template slot-scope="scope">
            <s-select v-model="scope.row.logic">
              <s-option label="且" value="且" key="且"></s-option>
              <s-option label="或" value="或" key="或"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="指标">
          <template slot-scope="scope">
            <s-select v-model="scope.row.cn" @change="changeCn(scope.$index, scope.row)">
              <s-option v-for="(item, index) in cnArr" :label="item.label" :value="index" :key="index"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="比较" width="110px">
          <template slot-scope="scope">
            <s-select v-model="scope.row.compare" @change="handleCompareChange($event, scope.$index, scope.row)">
              <s-option v-for="item in scope.row.compareArr" :label="item.label" :value="item.value"
                        :key="item.value"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="指标值">
          <template slot-scope="scope">
            <s-select v-if="scope.row.valueType === 'select'" v-model="scope.row.val">
              <s-option v-for="item in scope.row.valArr" :label="item.value" :value="item.name"
                        :key="item.name"></s-option>
            </s-select>
            <template v-else-if="scope.row.valueType === 'input'">
              <s-input v-model="scope.row.val" :maxlength="20" class="col-unit"></s-input>
              <span v-text="scope.row.valUnit" class="unit"></span>
            </template>
            <template v-else>
              <div class="double-input col-unit">
                <s-input v-model="scope.row.valA" :maxlength="10"></s-input>
                -
                <s-input v-model="scope.row.valB" :maxlength="10"></s-input>
              </div>
              <span v-text="scope.row.valUnit" class="unit"></span>
            </template>
          </template>
        </s-table-column>
        <s-table-column label="操作">
          <template slot-scope="scope">
            <i class="iconfont" :class="[scope.$index === 0 ? 'icon-add' : 'icon-cancel']"
               @click="action(scope.$index)"></i>
          </template>
        </s-table-column>
      </s-table>
      <s-button @click="exeExample" class="exe-example" icon="account-audit">生成事件格式</s-button>
      <s-tooltip content="{}：支持删除操作    []：为固定项，不支持编辑操作 An：表示对应指标的当前值 用户可在事件格式中的任何地方添加待完善内容">
        <i class="iconfont icon-help"></i>
      </s-tooltip>
      <s-input type="textarea" v-model="example" :maxlength="255" placeholder="不能超过255个字符"></s-input>
    </s-scrollbar>
    <!--PING-->
    <s-scrollbar wrap-style="max-height: 600px;" v-else>
      <div class="title">规则</div>
      <s-table :data="list">
        <s-table-column label="逻辑" width="100px"></s-table-column>
        <s-table-column label="指标" prop="zhibiao"></s-table-column>
        <s-table-column label="比较" prop="compare" width="110px"></s-table-column>
        <s-table-column label="指标值" v-if="currentType==2">
          <template slot-scope="scope">
            <s-select v-model="scope.row.val">
              <s-option label="ping不通" :value="0"></s-option>
              <s-option label="ping通" :value="1"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="指标值" v-if="currentType==3">
          <template slot-scope="scope">
            <s-select v-model="scope.row.val">
              <s-option label="凭证检测不通" :value="0"></s-option>
              <s-option label="凭证检测通" :value="1"></s-option>
            </s-select>
          </template>
        </s-table-column>
        <s-table-column label="指标值" v-if="currentType==4">
          <template slot-scope="scope">
            <s-input v-model="scope.row.val" :maxlength="20" class="col-unit"></s-input>
            分钟
          </template>
        </s-table-column>
      </s-table>
      <s-button @click="exePing" class="exe-example" icon="account-audit">生成事件格式</s-button>
      <s-tooltip content="{}：支持删除操作    []：为固定项，不支持编辑操作 An：表示对应指标的当前值 用户可在事件格式中的任何地方添加待完善内容">
        <i class="iconfont icon-help"></i>
      </s-tooltip>
      <s-input type="textarea" v-model="example" :maxlength="255" placeholder="不能超过255个字符"></s-input>
    </s-scrollbar>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {batchUuid} from 'sunflower-common-utils'

  export default {
    props: {
      data: String,     // mitype
      group: Object,    // 编辑的规则信息
      device: Array,    // 监控项-选择的资产
      currentType: Number,     // 监控项-类型
      currentRow: Object     // 当前行的信息
    },
    data() {
      return {
        list: [],           // 表格数据
        res: [],            // 存储返回的数据
        cnArr: [],           // 指标的option
        example: '',
        exampleDesc: '',
        ruleInfo: '',
        logicObj: {
          且: 1,
          或: 2
        },
        editInfo: this.group,
        deviceArr: this.device
      }
    },
    methods: {
      getInfo() {
        let _arr = batchUuid('compId', this.deviceArr);
        $axios.post(`/thresholdInfo/getThresholdByItcompUuidsAndMitype/${this.data}`, _arr).then((res) => {
          if (res.data && res.data instanceof Array) {
            this.res = res.data;
            this.resetRes();
          }
        });
      },
      // 组装指标可选值
      resetRes() {
        for (let i = 0; i < this.res.length; i++) {
          this.cnArr.push({
            label: this.res[i].cn,
            value: i
          });
        }
        if (this.editInfo) {
          let _arr = this.editInfo.ruleInfo.split('|');
          for (let i = 0; i < _arr.length; i++) {
            if (_arr[i]) {
              let __arr = _arr[i].split(',');
              let _tmp = {
                logic: __arr[0] === 1 ? '且' : '或',
                cn: this.getAliasIdx(__arr[1]),
                compare: __arr[2]
              }
              let _tmpArr = {
                '==': '==#==',
                '!=': '!=#!=',
                '<=': '<=#<=',
                '<': '<#<',
                '>=': '>=#>=',
                '>': '>#>',
                '[]': '范围#[]',
                'concat': '包含#concat',
                'notConcat': '不包含#notConcat'
              };
              _tmp.compare = _tmpArr[_tmp.compare];
              let currentCnInfo = this.res[_tmp.cn];
              if (currentCnInfo.stateList && currentCnInfo.stateList.length > 0) {
                _tmp.valueType = 'select';
                _tmp.compareArr = [
                  {label: '==', value: '==#=='},
                  {label: '!=', value: '!=#!='}
                ];
                _tmp.val = __arr[3];
                _tmp.valArr = currentCnInfo.stateList;
              } else {
                _tmp.compareArr = [
                  {label: '==', value: '==#=='},
                  {label: '!=', value: '!=#!='},
                  {label: '<=', value: '<=#<='},
                  {label: '<', value: '<#<'},
                  {label: '>=', value: '>=#>='},
                  {label: '>', value: '>#>'},
                  {label: '范围', value: '范围#[]'},
                  {label: '包含', value: '包含#concat'},
                  {label: '不包含', value: '不包含#notConcat'}
                ];
                if (_tmp.compare === '范围#[]') {
                  _tmp.valueType = 'doubleInput';
                  _tmp.valA = __arr[3].split('~')[0];
                  _tmp.valB = __arr[3].split('~')[1];
                } else {
                  _tmp.valueType = 'input';
                  _tmp.val = __arr[3];
                }
              }
              _tmp.valUnit = currentCnInfo.unit ? currentCnInfo.unit : '';
              this.list.push(_tmp);
            }
          }
          this.$nextTick(() => {
            this.example = this.editInfo.incidentTemplate;
          });
        } else {
          this.action(0);
        }
      },
      action(index) {
        if (index === 0) {
          this.list.push({
            logic: '且',
            cn: 0,
            compare: '=='
          });
          let len = this.list.length - 1;
          let tmp = this.list[len];
          if (this.res.length > 0 && this.res[0].stateList && this.res[0].stateList.length > 0) {
            tmp.compareArr = [
              {label: '==', value: '=='},
              {label: '!=', value: '!='}
            ];
            this.$set(tmp, 'val', this.res[0].stateList[0].value);
            this.$set(tmp, 'valueType', 'select');
            tmp.valArr = this.res[0].stateList;
            tmp.valUnit = '';
          } else {
            tmp.compareArr = [
              {label: '==', value: '==#=='},
              {label: '!=', value: '!=#!='},
              {label: '<=', value: '<=#<='},
              {label: '<', value: '<#<'},
              {label: '>=', value: '>=#>='},
              {label: '>', value: '>#>'},
              {label: '范围', value: '范围#[]'},
              {label: '包含', value: '包含#concat'},
              {label: '不包含', value: '不包含#notConcat'}
            ];
            this.$set(tmp, 'val', '');
            this.$set(tmp, 'valueType', 'input');
            this.$set(tmp, 'valUnit', this.res[0].unit);
          }
        } else {
          this.list.splice(index, 1);
        }
      },
      changeCn(idx, row) {
        row.valueType = (this.res[row.cn].stateList && this.res[row.cn].stateList.length > 0) ? 'select' : 'input';
        this.list[idx].compare = '==';
        if (row.valueType === 'select') {
          this.list[idx].compareArr = [
            {label: '==', value: '=='},
            {label: '!=', value: '!='}
          ];
          this.list[idx].val = this.res[row.cn].stateList[0].value;
          this.list[idx].valArr = this.res[row.cn].stateList;
        } else {
          this.list[idx].compareArr = [
            {label: '==', value: '==#=='},
            {label: '!=', value: '!=#!='},
            {label: '<=', value: '<=#<='},
            {label: '<', value: '<#<'},
            {label: '>=', value: '>=#>='},
            {label: '>', value: '>#>'},
            {label: '范围', value: '范围#[]'},
            {label: '包含', value: '包含#concat'},
            {label: '不包含', value: '不包含#notConcat'}
          ];
          this.list[idx].val = '';
        }
        this.list[idx].valUnit = this.res[row.cn].unit;
      },
      exeExample() {
        // 校验value不为空
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].valueType === 'doubleInput') {
            if (this.list[i].valA === undefined || this.list[i].valB === undefined || this.list[i].valA === '' || this.list[i].valB === '') {
              this.$message({type: 'error', message: '指标值不能为空'});
              return false;
            }
            if (this.list[i].valA === undefined || this.list[i].valB === undefined || this.list[i].valA === '' || this.list[i].valB === '') {
              this.$message({type: 'error', message: '指标值不能为空'});
              return false;
            }
          } else {
            if (this.list[i].val === undefined || this.list[i].val === '') {
              this.$message({type: 'error', message: '指标值不能为空'});
              return false;
            } else {
              if (this.list[i].compare === '<=#<=' || this.list[i].compare === '<#<' || this.list[i].compare === '>=#>=' || this.list[i].compare === '>#>' || this.list[i].valUnit === 'MB') {
                if (Number.isInteger(Number(this.list[i].val)) === false && (String(Number(this.list[i].val)).indexOf('.') !== -1) === false) {
                  this.$message({type: 'error', message: '指标值必须为整数或者小数'});
                  return false;
                } else if (Number(this.list[i].val) >= 100000) {
                  this.$message({type: 'error', message: '指标值必须在0~99999之间'});
                  return false;
                }
              }
              if (this.list[i].valUnit === '%') {
                if (Number.isInteger(Number(this.list[i].val)) === false && (String(Number(this.list[i].val)).indexOf('.') !== -1) === false || Number(this.list[i].val) > 100) {
                  this.$message({type: 'error', message: '单位为%的指标值必须在0~100之间'});
                  return false;
                }
              }
            }
          }
        }
        let ruleStr = '';
        let curStr = '';
        let ruleInfo = '';
        for (let i = 0; i < this.list.length; i++) {
          if (i > 0) {
            ruleStr += ' ' + this.list[i].logic + ' ';
            ruleInfo += this.logicObj[this.list[i].logic];
          } else {
            ruleInfo += '1';
          }
          ruleStr += this.cnArr[this.list[i].cn].label + this.list[i].compare.split('#')[0];
          // 修改bug45953
          if (this.list[i].compare.indexOf('#') > -1) {
            ruleInfo += (',' + this.res[this.list[i].cn].alias + ',' + this.list[i].compare.split('#')[1] + ',');
          } else {
            ruleInfo += (',' + this.res[this.list[i].cn].alias + ',' + this.list[i].compare + ',');
          }
          if (this.list[i].valueType === 'doubleInput') {
            ruleStr += '[' + this.list[i].valA + '~' + this.list[i].valB + ']';
            ruleInfo += (this.list[i].valA + '~' + this.list[i].valB);
          } else if (this.list[i].valueType === 'select') {
            let __arr = this.res[this.list[i].cn].stateList;
            for (let p = 0; p < __arr.length; p++) {
              if (__arr[p].name === this.list[i].val) {
                ruleStr += __arr[p].value;
                break;
              }
            }
            ruleInfo += this.list[i].val;
          } else {
            ruleStr += this.list[i].val;
            ruleInfo += this.list[i].val;
          }
          ruleInfo += (',' + (i + 1) + '|');
          if (this.list[i].valUnit) {
            ruleStr += this.list[i].valUnit;
          }
          curStr += this.cnArr[this.list[i].cn].label + ':' + '[A' + (i + 1) + ']';
          if (this.list[i].valUnit) {
            curStr += this.list[i].valUnit;
          }
          if (i !== this.list.length - 1) {
            curStr += ',';
          }
        }
        this.example = '{资产名}[IP地址]的[监控项]({监控项名称})异常，{规则:' + ruleStr + '}，{当前值:' + curStr + '}';
        this.exampleDesc = ruleStr;
        this.ruleInfo = ruleInfo;
      },
      exePing() {
        if (this.currentType === 2) {
          this.example = '{资产名}[IP地址]异常，{规则：ping结果==' + ['ping不通', 'ping通'][this.list[0].val] + '}，{当前值:ping结果:[A1]}';
          this.exampleDesc = ('ping结果==' + ['ping不通', 'ping通'][this.list[0].val]);
          this.ruleInfo = ('1,ping结果,==,' + this.list[0].val + ',1,|');
        } else if (this.currentType === 3) {
          this.example = '{资产名}[IP地址]异常，{规则：凭证检测==' + ['凭证检测不通', '凭证检测通'][this.list[0].val] + '}，{当前值:凭证检测==[A1]}';
          this.exampleDesc = ('凭证检测==' + ['凭证检测不通', '凭证检测通'][this.list[0].val]);
          this.ruleInfo = ('1,凭证检测,==,' + this.list[0].val + ',1,|');
        } else if (this.currentType === 4) {
          let reg = /^[1-9]\d*$/;
          if (!reg.test(this.list[0].val) || this.list[0].val < 0 || this.list[0].val > 99999) {
            this.$message({type: 'warning', message: '指标值必须是1~99999的正整数'});
            return
          }
          this.example = '{资产名}[IP地址]异常，{规则：运行时间检测<=' + [this.list[0].val] + '分钟' + '}，{当前值:运行时间检测==[A1]分钟}';
          this.exampleDesc = ('运行时间检测<=' + [this.list[0].val] + '分钟');
          this.ruleInfo = ('1,运行时间检测,<=,' + this.list[0].val + ',1,|');
        }
      },
      handleCompareChange(val, index, row) {
        if (val === '范围#[]') {
          this.list[index].valueType = 'doubleInput';
        } else {
          this.list[index].valueType = this.res[row.cn].stateList.length > 0 ? 'select' : 'input';
        }
      },
      getAliasIdx(alias) {
        for (let i = 0; i < this.res.length; i++) {
          if (this.res[i].alias === alias) {
            return i;
          }
        }
      }
    },
    watch: {
      list: {
        deep: true,
        handler: function () {
          this.example = '';
        }
      }
    },
    created() {
      if (this.editInfo) { // 编辑
        if (this.data.length > 0) { // 监控项
          this.getInfo();
        } else if (this.currentType === 2) {  // PING
          this.list = [{
            zhibiao: 'ping结果',
            compare: '==',
            val: this.group.desc.slice(8) === 'ping不通' ? 0 : 1
          }];
        } else if (this.currentType === 3) {  // 凭证检测
          this.list = [{
            zhibiao: '凭证检测',
            compare: '==',
            val: this.group.desc.slice(6) === '凭证检测不通' ? 0 : 1
          }];
        } else if (this.currentType === 4) {  // 运行时间检测
          this.list = [{
            zhibiao: '运行时间检测',
            compare: '<=',
            val: this.group.desc.slice(8).split('分钟')[0]
          }];
        }
        this.$nextTick(() => {
          if (this.data.length > 0) {
            this.exeExample()
          } else {
            this.exePing()
          }
          // this.example = this.group.incidentTemplate;
          this.exampleDesc = this.group.desc;
          this.ruleInfo = this.group.ruleInfo;
        });
      } else {
        // 添加
        if (this.data.length > 0) { // 监控项
          this.getInfo();
        } else if (this.currentType === 2) {  // PING
          this.list = [{
            zhibiao: 'ping结果',
            compare: '==',
            val: 0
          }];
        } else if (this.currentType === 3) {  // 凭证检测
          this.list = [{
            zhibiao: '凭证检测',
            compare: '==',
            val: 0
          }];
        } else if (this.currentType === 4) {  // 运行时间检测
          this.list = [{
            zhibiao: '运行时间检测',
            compare: '<=',
            val: 0
          }];
        }
      }
    }
  }
</script>

<style>
  .event-rule-new .cell .col-unit {
    width: calc(100% - 38px);
  }

  .event-rule-new .cell .unit {
    float: right;
    line-height: 36px;
    width: 28px;
    overflow: hidden;
    white-space: nowrap;
  }

  .event-rule-new .s-table-body .s-table-row:nth-child(1) td:nth-child(1) .s-select {
    display: none;
  }

  .event-rule-new .exe-example {
    margin: 10px 0;
  }

  .event-rule-new .double-input {
    display: inline-block;
  }

  .event-rule-new .double-input .s-input {
    width: calc(50% - 16px);
  }

  .event-rule-new .s-table .s-tooltip.cell {
    white-space: normal;
  }
</style>
