<template>
  <div>
    <s-card v-for="item in scoreList" :key="item.uuid" class="setScore-box-card" style="border:none">
      <div slot="header" class="clearfix">
          <span class="card-title">
              <div style="height: 30px; line-height: 40px" span="20">
                <span class="grade-title">{{ item.cmdbTypeName }}</span>
                <span class="grade-title">( {{item.productName.replace(/-(\S*)/,'')}} ) </span>
              </div>
          </span>
      </div>
      <div style="margin: 10px 0;line-height: 30px">
        <s-row>
          <s-col span="20">
            总分 = ( <span v-for="(innerItem, index) in item.controlList" :key="index">
                  <s-button size="mini" @click="showIndiDetail(innerItem)">{{ innerItem.controlname }}</s-button>*
                  <span style="background: rgba(255,255,255,0.3);vertical-align: middle">{{ innerItem.kpiWeight }}</span>
                  <span v-if="index !== item.controlList.length - 1">+</span>
                </span>)
          </s-col>
          <s-col span="4">
            <i style="float: right;font-size: 18px;cursor: pointer;" class="iconfont icon-edit" @click="weightSet(item)"></i>
          </s-col>
        </s-row>
      </div>
    </s-card>
    <weight-set-dialog v-if="weightSetDialogFlag" v-model="weightSetDialogFlag"
                       :score.sync="curScore" @reload="axiosPollingList"></weight-set-dialog>
    <indi-detail-dialog :indi="curIndi" v-if="indiDialogFlag" v-model="indiDialogFlag"></indi-detail-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  import {cloneDeep} from 'lodash'
  import weightSetDialog from './WeightSetDialog.vue'
  import IndiDetailDialog from './IndiDetailDialog.vue'

  export default {
    data() {
      return {
        weightSetDialogFlag: false,
        indiDialogFlag: false,
        scoreList: [],
        curScore: {},
        curIndi: {}
      }
    },
    created() {
      this.axiosPollingList();
    },
    methods: {
      axiosPollingList() {
        $axios.get('/kpi/getKpiAssetinspectCmdbTypeList').then(({data}) => {
          console.log(data);
          this.scoreList = data;
        })
      },
      weightSet(item) {
        this.curScore = cloneDeep(item);
        this.weightSetDialogFlag = true;
      },
      showIndiDetail(innerItem) {
        this.curIndi = innerItem;
        this.indiDialogFlag = true;
      }
    },
    components: {
      weightSetDialog,
      IndiDetailDialog
    }
  }
</script>
