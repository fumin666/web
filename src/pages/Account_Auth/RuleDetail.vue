<template>
  <div class="user-details">
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">规则名称</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="data.ruleName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">规则类型</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="data.ipTypeStr"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">时间范围</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="data.date"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">每周</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light">
          <s-button
            v-for="week in data.weeks"
            :key="week">{{week}}</s-button>
        </div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">每天</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="`${data.starthour} - ${data.endhour}`"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">ip规则</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="data.ipRule"></div>
      </s-col>
    </s-row>
  </div>
</template>

<script>
  export default {
    props: {
      info: {
        required: true,
        type: Object
      }
    },
    data() {
      return {
        data: this.info,
        weeks: ['无', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      }
    },
    created() {
      if (this.data.isForever === 1) {
        this.data.endTime = '永不过期';
      }
      this.data.date = `${this.info.startTime} - ${this.info.endTime}`;
      this.data.weeks = this.weeks.filter((week) => {
        return this.info.weeks.split(',').some((_week) => {
          return Number(_week) === this.weeks.indexOf(week);
        });
      });
      this.data.starthour = this.data.starthour.substr(0, 2) + ':' + this.data.starthour.substr(2, 2);
      this.data.endhour = this.data.endhour.substr(0, 2) + ':' + this.data.endhour.substr(2, 2);
    }
  }
</script>
