<!--
 * @Author: songyf
 * @Date: 2020-1-19
 * @LastEditors: songyf
 * @Description: 安全通报-通报类型设置-查看通报类型
 -->
<template>
  <section class="view-bulletin">
    <div class="item-box" style="margin-top: 20px">
      <p class="title spanText">通报类型</p>
      <s-row class="type-box search_form" >
        <s-col :span="6">通报类型名称： {{safeType.bulletinName}}</s-col>
        <s-col :span="4">是否需要走流程： {{safeType.needItil | filterRequired}}</s-col>
        <s-col :span="14">备注： {{safeType.remark}} </s-col>
      </s-row>
    </div>
    <div class="item-box">
      <p class="title spanText">表单属性</p>
      <s-table-page
        :data="safeTypeAttrList"
        :hasActionCol='false'>
        <s-table-column label="属性名称" prop="attrName"></s-table-column>
        <s-table-column label="属性类型" prop="attrType">
          <template slot-scope="scope">
            {{scope.row.attrType | filterType}}
          </template>
        </s-table-column>
        <s-table-column label="是否必填项" prop="isRequired">
          <template slot-scope="scope">
            {{scope.row.isRequired | filterRequired}}
          </template>
        </s-table-column>
        <s-table-column label="默认值" prop="attrValue">
          <template slot-scope="scope" >
            <span>{{scope.row.attrValue}}</span>
          </template>
        </s-table-column>
      </s-table-page>
    </div>
    <div class="item-box" v-if="safeType.needItil">
      <p class="title spanText">流程图</p>
      <div class="process-box bgGray">
        <div id="graphContainer" :style="'padding-left:' + paddWidth + 'px'"></div>
      </div>
    </div>

  </section>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import BulletinGraphMixin from '@/pages/Safety_BulletinTypeSet/BulletinGraphMixin';
  const formType = ['文本', '多行文本', '列表', '数值', '日期', '附件']  // 1-文本,2-多行文本,3-列表,4-数值,5-日期,6-附件

  export default {
    mixins: [BulletinGraphMixin],
    components: {},
    data() {
      return {
        tbUuid: '',
        safeType: {},  // 通报类型
        safeTypeAttrList: [], // 表单属性
        safeTypeItilList: [], // 流程设计
        paddWidth: 0
      }
    },
    props: {
    },
    watch: {
    },
    filters: {
      filterRequired(val) {
        switch (val) {
          case 0:
            return '否';
          case 1:
            return '是'
        }
      },
      filterType(val) { // 表单属性
        return formType[val - 1]
      }
    },
    mounted() {
      this.tbUuid = this.$route.params.tbUuid
      $axios.get(`/safetyPlatform/safetyBulletin/getTbDetail/${this.tbUuid}`).then(({data}) => {
        this.safeType = data.safeType;
        this.safeTypeAttrList = data.safeTypeAttrList;
        this.safeTypeItilList = data.safeTypeItilList;
        if (this.safeType.needItil) {
          this.getProcessData()
        }
      });
    },
    methods: {
      getProcessData() { // 获取流程图数据
        $axios.get(`/safetyPlatform/safetyBulletin/generateFlowChart/${this.tbUuid}`).then(({data}) => {
          if (!data.state) {
            this.$message({type: 'warning', message: data.errormsg})
            return
          } else {
            // this.$message({type: 'success', message: data.errormsg})
            this.processData = data.data;
            this.container = document.getElementById('graphContainer');
            this.initGraph()
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  .view-bulletin
    font-size 14px
    .item-box
      margin-bottom 30px
      .title
        font-weight 600
        line-height 14px
        opacity 0.85
        margin-bottom 10px
      .type-box
        line-height 20px
        padding 22px 12px
        background #F5F7FA
        border 1px solid #DCDEE2
        box-sizing border-box
        border-radius 3px
      .process-box
        width 100%
        min-height 150px
        padding 20px
        border 1px solid #DCDEE2;
        box-sizing border-box;
        border-radius 2px;
</style>
