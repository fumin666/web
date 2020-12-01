<template>
  <s-dialog v-model="dialogFlag" :title="'查看SLA服务目标执行结果详情'" width="600px" class="serverTargeByWorkflowDialog">
    <s-scrollbar wrap-class="serverTargeByWorkflowScrollbar">
      <div class="form-row">
        <div class="form-row-key">单据单号</div>
        <div class="form-row-val">{{data.serialCode}}</div>
      </div>
      <div class="form-row">
        <div class="form-row-key">ID</div>
        <div class="form-row-val">{{data.slaCode}}
          <span v-if="data.slaStatus === 1" class="tag tag-warning">警告</span>
          <span v-else-if="data.slaStatus === 2" class="tag tag-sucess">满足</span>
          <span v-else-if="data.slaStatus === 3" class="tag tag-error">不满足</span>
          <span v-else-if="data.slaStatus === 4" class="tag tag-disabled">已废弃</span>
          <span v-else-if="data.slaStatus === 5" class="tag tag-ing">进行中</span>
        </div>
      </div>
      <s-table :data="data.itilSlaStageExcutionList" border style="width:100%;">
        <s-table-column label="阶段名称" prop="stageName">
          <template slot-scope="scope">
            <span>{{!scope.row.stageName?'无':`${parseFloat(scope.row.stageName)*100}%`}}</span>
          </template>
        </s-table-column>
        <s-table-column label="执行时间" prop="excuteTime">
          <template slot-scope="scope">
            <span>{{!scope.row.excuteTime?'无':dateFormat(scope.row.excuteTime)}}</span>
          </template>
        </s-table-column>
        <s-table-column label="状态" prop="excuteStatus">
          <template slot-scope="scope">
            <span v-if="scope.row['excuteStatus'] === 1">已执行</span>
            <span v-if="scope.row['excuteStatus'] === 0">未执行</span>
          </template>
        </s-table-column>
      </s-table>
    </s-scrollbar>
  </s-dialog>
</template>

<script>
import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      data: {
        serialCode: '',
        slaCode: '',
        slaStatus: 0,
        itilSlaStageExcutionList: []
      },
      dialogFlag: false
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object
    },
    parentUuid: {
      type: String
    }
  },
  created() {
    const params = {
      agreementUuid: this.row.uuid,
      orderUuid: this.parentUuid
    };
    $axios.post(`/itilSla/slaExecuteResultDetails`, params).then(({data}) => {
      for (let i in this.data) {
        this.data[i] = data[i]
      }
    })
  },
  methods: {
    dateFormat(timeStamp, format) {
      const date = new Date(parseInt(timeStamp) * 1000)
      let fmt = format || 'yyyy-MM-dd hh:mm:ss'
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)))
      }
      return fmt
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
  }
}
</script>

<style lang="stylus">
.serverTargeByWorkflowDialog {
  .serverTargeByWorkflowScrollbar {
    padding: 10px 0;
  }

  .form-row {
    font-size: 16px;
    line-height: 30px;
    margin-bottom: 20px;

    .form-row-key, .form-row-val {
      display: inline-block;
    }

    .form-row-key {
      width: 130px;
    }

    .tag {
      margin-left: 10px;
      display: inline-block;
      font-size: 12px;
      padding: 5px 8px;
      color: #fff;
      border-radius: 2px;
      line-height: 13px;
    }

    .tag-ing {
      background-color: #89ceff;
    }

    .tag-error {
      background-color: #ff6357;
    }

    .tag-sucess {
      background-color: #7fd071;
    }

    .tag-warning {
      background-color: #fecb19;
    }

    .tag-disabled {
      background-color: #bbbdc9;
    }
  }
}
</style>
