<template>
  <section class="">
    <s-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <s-form-item label="名称" prop="rankingName">
        <s-input v-model="ruleForm.rankingName"></s-input>
      </s-form-item>
      <s-form-item label="设备类别" prop="citypeUuid">
        <s-cascader
          :options="addOptions"
          v-model="citypeUuid"
          style="width: 100%">
        </s-cascader>
        <!--<s-select v-model="ruleForm.citypeUuid" style="width: 100%">-->
          <!--<s-option v-for="item in deviceList" :label="item.citypeName" :value="item.uuid" :key="item.uuid"></s-option>-->
        <!--</s-select>-->
      </s-form-item>
      <s-form-item label="排序指标" prop="index">
        <s-select v-model="ruleForm.index" style="width: 100%">
          <s-option v-for="item in sortList" :label="item.name" :value="item.value" :key="item.value"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="时间范围" prop="timeArea">
        <s-select v-model="ruleForm.timeArea" style="width: 100%">
          <s-option v-for="item in timeList" :label="item.name" :value="item.value" :key="item.value"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="topN" prop="topN">
        <s-select v-model="ruleForm.topN" style="width: 100%">
          <s-option v-for="item in topNList" :label="item.name" :value="item.value" :key="item.value"></s-option>
        </s-select>
      </s-form-item>
    </s-form>
  </section>
</template>

<script type="text/babel">
  // import navs from '@/components/navButton/NavButton.vue';
  import $axios from 'sunflower-ajax';
  export default {
    components: {
    },
    data() {
      return {
        ruleForm: {},
        rules: {
          rankingName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 200, message: '请填入长度为200以内的字符串', trigger: 'blur' }]
        },
        citypeUuid: [],
        deviceList: [],
        sortList: [],
        timeList: [
          {name: '最近1个小时', value: 1},
          {name: '最近6个小时', value: 6},
          {name: '最近12个小时', value: 12},
          {name: '最近24个小时', value: 24}
        ],
        topNList: [
          {name: 5, value: 5},
          {name: 10, value: 10},
          {name: 15, value: 15},
          {name: 20, value: 20}
        ],
        searchOptions: []
      }
    },
    computed: {
      addOptions() {
        return this.circleGetOptions(this.searchOptions);
      }
    },
    props: {
      type: {
        type: String,
        required: true
      }
    },
    created() {
      // 获取搜索栏资产类型选项
      $axios.get('/resourcemanager/configurationmanage/citype/getCitypeTree').then(({data}) => {
        this.searchOptions = data;
      });
      $axios.get(`/monitorRanking/getCitypeList`).then(({data}) => {
        if (data instanceof Array && data.length > 0) {
          this.deviceList = data
        }
      })
      $axios.get(`/monitorRanking/getRankingSetting/${this.type}`).then(({data}) => {
        this.ruleForm = data
        // 设备三级分类数据处理
        if (data.fristTypeUuid && data.secondTypeUuid) {
          if (data.threeTypeUuid) {
            // 一二三级都存在
            this.citypeUuid = [data.fristTypeUuid, data.secondTypeUuid, data.threeTypeUuid]
          } else {
            // 只存在一二级
            this.citypeUuid = [data.fristTypeUuid, data.secondTypeUuid]
          }
        }
      })
      this.setSortList()
    },
    methods: {
      circleGetOptions(arr) {
        return arr.map(item => {
          let obj = {
            value: item.uuid,
            label: item.name
          };
          if (item.childrenList && item.childrenList.length > 0) {
            obj.children = this.circleGetOptions(item.childrenList)
          }
          return obj;
        })
      },
      setSortList() {
        switch (this.type) {
          case 'cpu':
            this.sortList.push({name: 'cpu使用率', value: 0});
            break;
          case 'memory':
            this.sortList.push({name: '内存使用率', value: 1});
            break;
          case 'disk':
            this.sortList.push({name: '磁盘使用率', value: 2});
            break;
          case 'interface':
            this.sortList.push(
              {name: '接收速率', value: 3},
              {name: '发送速率', value: 4},
              {name: '接收丢包率', value: 5},
              {name: '发送丢包率', value: 6});
            break;
        }
      }
    },
    mounted() {
    }
  }
</script>
