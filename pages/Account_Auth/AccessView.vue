<template>
  <div class="rule-cfg">
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">规则名称</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="rowData.ruleName"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">规则类型</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="rowData.ipType ? '允许' : '禁止'"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">时间范围</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light">
          {{rowData.startTime}} — {{rowData.endTime ? rowData.endTime : '永不结束'}}
        </div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">每周</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light">
          {{rowData.weeks | filtersWeek}}
        </div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">每天</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light">
          {{rowData.starthour.substr(0,2)}} : {{rowData.starthour.substr(2,2)}} — {{rowData.endhour.substr(0,2)}} : {{rowData.endhour.substr(2,2)}}
        </div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">IP规则</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light" v-text="rowData.ipRule"></div>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="6">
        <div class="grid-content bg-purple">关联授权清单</div>
      </s-col>
      <s-col :span="18">
        <div class="grid-content bg-purple-light">
          {{rowData.authInfoList | filtersAuthList}}
        </div>
      </s-col>
    </s-row>
  </div>
</template>

<script>

  export default {
    components: {
    },
    props: {
      rowData: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
      }
    },
    filters: {
      filtersWeek(val) {
        let week = []
        let newWeek = []
        week = val.split(',');
        week.forEach(v => {
          if (v === '1') {
            newWeek.push('星期一')
          } else if (v === '2') {
            newWeek.push('星期二')
          } else if (v === '3') {
            newWeek.push('星期三')
          } else if (v === '4') {
            newWeek.push('星期四')
          } else if (v === '5') {
            newWeek.push('星期五')
          } else if (v === '6') {
            newWeek.push('星期六')
          } else if (v === '7') {
            newWeek.push('星期日')
          }
        })
        newWeek = newWeek.join('、 ')
        return newWeek
      },
      filtersAuthList(data) {
        let authList = []
        data.forEach(v => {
          authList.push(v.authName)
        })
        authList = authList.join('、 ')
        return authList
      }
    },
    methods: {
    },
    created() {
      // this.getAllAuth();
    }
  }
</script>
<style lang="stylus">
  .rule-cfg
    .bg-purple
      font-weight 600
</style>
