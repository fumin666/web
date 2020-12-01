<template>
  <div id="oper-custom-add">
    <s-steps :current="current" type="arrow" step-width="177px">
      <s-step title="新建业务服务"></s-step>
      <s-step title="添加业务系统"></s-step>
      <s-step title="添加服务器"></s-step>
      <s-step title="添加其他资源"></s-step>
    </s-steps>
    <div class="step-content">
        <add-form v-show="current === 0" ref="addForm" :editData="editForm"></add-form>
        <base-table v-show="current === 1" :needSelect="needSelect1" key="table1" ref="topTable" :tableData="businessSys"  :searchStyle="getSearchStyle" @dropSelect="onBusinessChange"></base-table>
        <base-table v-show="current === 2" :needSelect="needSelect2" key="table2" ref="topTable" :tableData="monitorSys" :getListActionsDef="{}" @dropSelect="onMonitorChange"></base-table>
        <base-table v-show="current === 3" :needSelect="needSelect3" key="table3" ref="topTable" :tableData="otherItcomp" :getListActionsDef="{}" @dropSelect="onOtherChange"></base-table>
    </div>
  </div>
</template>

<script>
  import addForm from './EditForm'
  import baseTable from '../components/AddBaseTable.vue'
  // import editIndicator from './Indicator'
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        businessSys: [],
        businessSelection: [],
        monitorSelection: [],
        otherSelection: [],
        editForm: {}
      }
    },
    components: {
      // editIndicator,
      addForm,
      baseTable
    },
    created() {
      if (this.editData !== undefined && this.editData !== null) {
        this.editForm = this.editData
      }
      this.getList()
    },
    props: {
      current: {
        type: Number,
        default: 0
      },
      monitorSys: {
        type: Array
      },
      otherItcomp: {
        type: Array
      },
      editData: {
        type: Object
      },
      needSelect1: {
        type: Array
      },
      needSelect2: {
        type: Array
      },
      needSelect3: {
        type: Array
      }
    },
    computed: {
      getSearchStyle() {
        return {width: 6, offset: 18, placeholder: '请输入搜索条件'}
      },
      getListActionsDef() {
        // let _this = this
        // return {
        //   width: 6,
        //   actions: [{
        //     name: '添加',
        //     click() {
        //       window.open('#/AssetsAll/assets_list/assetAdd?addType=fdc689052311432f8efa5cb7416d5f10&addType=be167b91edb6480cac9ba546611553f3&addType=e69bee3dd4d9452dbc98b7128d21846d')
        //     },
        //     icon: 'plus'
        //   }, {
        //       name: '刷新',
        //       click() {
        //         _this.getList()
        //       },
        //       icon: 'reboot'
        //     }]
        // }
      }
    },
    methods: {
      getList() {
        $axios.get(`/businessservice/getAllBusinessSystem`).then((res) => {
          if (res.data) {
            this.businessSys = res.data
          }
        });
      },
      onBusinessChange (selection) {
        this.businessSelection = selection
      },
      onMonitorChange (selection) {
        this.monitorSelection = selection
      },
      onOtherChange (selection) {
        this.otherSelection = selection
      }
    }
  }
</script>
