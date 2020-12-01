<template>
  <div>
    <section class="reportTop noPrint">
      <s-row>
        <s-form class="search_form" style="margin: 10px 0;font-size:14px;opacity: 0.75;line-height: 20px;display: block;">
          <div style="text-indent: 30px;">
            本报告按照行业等级保护要求分别对《信息安全技术信息系统安全等级保护基本要求》和
            《信息安全技术数据库管理系统安全技术要求》两大部分全面分析数据库安全状况。本报告
            可以帮助管理人员、审计人员及时发现各种异常和违规行为，并对这些行为进行快速分析、
            定位和响应，为整体信息安全管理提供决策依据。
          </div>
          <div style="text-indent: 30px;margin: 20px 0;">本报告可供信息安全管理部门领导、安全审计员、数据库管理员使用。</div>
          <div style="text-indent: 30px;">本报告审计分析对象主要包括：</div>
          <ol style="list-style: decimal;padding-left: 75px;margin-top: 15px;">
            <li>用户审计记录数</li>
            <li>对敏感账号的统计</li>
            <li>系统资源的异常使用安全相关事件</li>
            <li>重要命令（危险指令）的使用</li>
            <li>对数据表的DML操作行为审计</li>
            <li>对数据表的DDL操作行为审计</li>
            <li>对账号和角色的操作行为，例如Grant、Revoke等命令的审计</li>
            <li>如需查看详情，请直接查看综合报表下的各分类报表</li>
          </ol>
        </s-form>
      </s-row>
      <s-row>
        <s-form ref="searchBox" :inline="true" style="margin: 10px 0;">
          <s-form-item label="范围：" label-width="82px">
            <s-select v-model="period" @change="showNext" style="width: 80px;">
              <s-option label="天" value="0"></s-option>
              <s-option label="周" value="1"></s-option>
              <s-option label="月" value="2"></s-option>
              <s-option label="自定义" value="3"></s-option>
            </s-select>
          </s-form-item>
          <s-form-item label="开始日期：" label-width="82px">
            <s-date-picker v-model="startTime" v-if="bloomDate" :clearable="false" value-format="yyyy-MM-dd 00:00:00" format="yyyy-MM-dd 00:00:00" type="date" @change="getStartTime">
            </s-date-picker>
            <s-date-picker v-model="startTime" v-if="bloomWeek" :clearable="false" type="week" format="yyyy-MM-dd 00:00:00" :picker-options="{firstDayOfWeek: 1}" @change="getStartWeek">
            </s-date-picker>
            <s-date-picker v-model="startTime" v-if="bloomMonth" :clearable="false" type="month" value-format="yyyy-MM-dd 00:00:00" format="yyyy-MM-dd 00:00:00" @change="getStartTime">
            </s-date-picker>
            <s-date-picker v-model="startTime" v-if="bloomAuto" :clearable="false" type="date" value-format="yyyy-MM-dd 00:00:00" format="yyyy-MM-dd 00:00:00" @change="getStartTime">
            </s-date-picker>
          </s-form-item>
          <s-form-item label="结束日期：" label-width="82px">
            <s-date-picker v-model="endTime" v-if="bloomDate" :clearable="false" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" type="date" @change="getEndTime">
            </s-date-picker>
            <s-date-picker v-model="endTime" v-if="bloomWeek" :clearable="false" type="week" format="yyyy-MM-dd 23:59:59" :picker-options="{firstDayOfWeek: 1}" @change="getEndWeek">
            </s-date-picker>
            <s-date-picker v-model="endTime" v-if="bloomMonth" :clearable="false" type="month" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" @change="getEndTime">
            </s-date-picker>
            <s-date-picker v-model="endTime" v-if="bloomAuto" :clearable="false" type="date" value-format="yyyy-MM-dd 23:59:59" format="yyyy-MM-dd 23:59:59" @change="getEndTime">
            </s-date-picker>
            <s-button title="EXCEL报表" icon="excel" @click="DownloadHandle()">导出</s-button>
          </s-form-item>
        </s-form>
      </s-row>
    </section>
  </div>
</template>

<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import {Download} from 'sunflower-common-utils'
  export default {
    data () {
      return {
        period: '0',
        startTime: `${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (1 + new Date().getMonth()) : 1 + new Date().getMonth()}-${new Date().getDate() < 10 ? '0' + (new Date().getDate()) : new Date().getDate()} 00:00:00`,
        endTime: `${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (1 + new Date().getMonth()) : 1 + new Date().getMonth()}-${new Date().getDate() < 10 ? '0' + (new Date().getDate()) : new Date().getDate()} 23:59:59`,
        bloomAuto: false,
        bloomWeek: false,
        bloomMonth: false,
        bloomDate: true
      }
    },
    mounted() {
    },
    methods: {
      getStartTime(val) {
        if (val == null) {
          val = ''
        }
        if (this.endTime == null) {
          this.endTime = '';
        }
        let beginVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let endValue = new Date(Date.parse(this.endTime.replace(/-/g, '/'))).getTime();
        if (beginVal >= endValue) {
          this.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          this.startTime = val;
        }
      },
      getStartWeek(val) {
        if (val == null) {
          val = ''
        }
        if (this.endTime == null) {
          this.endTime = '';
        }
        let beginVal = parseInt(new Date(val).getTime() / 1000)
        let endValue = parseInt(new Date(this.endTime).getTime() / 1000)
        if (beginVal >= endValue) {
          this.startTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          val = val.setDate(val.getDate() - val.getDay() + 1);
          let M = (val.getMonth() + 1) < 10 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1)
          let D = val.getDate() < 10 ? '0' + val.getDate() : val.getDate()
          this.startTime = val.getFullYear() + '-' + M + '-' + D + ' 00:00:00';
        }
      },
      getEndTime(val) {
        if (val == null) {
          val = ''
        }
        if (this.startTime == null) {
          this.startTime = '';
        }
        let endVal = new Date(Date.parse(val.replace(/-/g, '/'))).getTime();
        let beginValue = new Date(Date.parse(this.startTime.replace(/-/g, '/'))).getTime();
        if (endVal <= beginValue) {
          this.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          // 月
          if (this.period === '2') {
            let arr = val.split('-');
            let day = arr[2].split(' ');
            let day1 = new Date(arr[0], arr[1], 0).getDate();// 获取月的天数
            let day2 = day1 + ' ' + day[1];
            val = arr[0] + '-' + arr[1] + '-' + day2;// 返回此月的最后一天
          }
          this.endTime = val;
        }
      },
      getEndWeek(val) {
        if (val == null) {
          val = ''
        }
        if (this.startTime == null) {
          this.startTime = '';
        }
        let endVal = parseInt(new Date(val).getTime() / 1000)
        let beginValue = parseInt(new Date(this.startTime).getTime() / 1000)
        if (endVal <= beginValue) {
          this.endTime = '';
          this.$message('开始日期不能大于等于结束日期！');
          return false;
        } else {
          val = val.setDate(val.getDate() + 5);
          let M = (val.getMonth() + 1) < 10 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1)
          let D = val.getDate() < 10 ? '0' + val.getDate() : val.getDate()
          this.endTime = val.getFullYear() + '-' + M + '-' + D + ' 23:59:59';
        }
      },
      showNext(val) {
        this.startTime = '';
        this.endTime = '';
        switch (val) {
          case '0':
            this.bloomDate = true;
            this.bloomAuto = false;
            this.bloomWeek = false;
            this.bloomMonth = false;
            break;
          case '1':
            this.bloomWeek = true;
            this.bloomMonth = false;
            this.bloomDate = false;
            this.bloomAuto = false;
            break;
          case '2':
            this.bloomMonth = true;
            this.bloomDate = false;
            this.bloomAuto = false;
            this.bloomWeek = false;
            break;
          case '3':
            this.bloomAuto = true;
            this.bloomWeek = false;
            this.bloomDate = false;
            this.bloomMonth = false;
            break;
        }
      },
      DownloadHandle() {
        let params = {
          startTime: parseInt(new Date(this.startTime).getTime() / 1000),
          endTime: parseInt(new Date(this.endTime).getTime() / 1000)
        }
        if (this.startTime === '' || this.endTime === '') {
          this.$message.info('请选择开始日期和结束日期！')
          return;
        } else {
          $axios.post(`/hierarchyProtection/createAllDbaAuditLevelProtectFile`, params).then(res => {
            if (res.data === true) {
              Download(`/hierarchyProtection/exportAllDbaAuditLevelProtectFile`)
            }
          })
        }
      }
    }
  }
</script>
<style lang="stylus">
</style>
