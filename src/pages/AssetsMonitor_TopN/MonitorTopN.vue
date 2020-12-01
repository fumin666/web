<template>
  <div class="monitorTopN">
    <!--<s-row class="title">资产监控打分</s-row>-->
    <s-form :inline="true" :model="filterForm" class="filterForm"  >
      <s-form-item label="资产类别">
        <select-tree style="width: 350px;" :url="'/monitorcitype/getCitypeTree'" :muti="true" :returnEmpty="true" @selectMutiTreeChange="_selectMutiTreeChange"></select-tree>
      </s-form-item>
      <s-form-item label="资产名称">
        <s-input v-model="itcompName" readonly icon="plus" @click="assetDialogFlag=true"></s-input>
      </s-form-item>
      <s-form-item label="排序方式">
        <s-select v-model="filterForm.order">
          <s-option label="顺序" value="asc"></s-option>
          <s-option label="逆序" value="desc"></s-option>
        </s-select>
      </s-form-item>
     <!-- <s-form-item label="TOP N">
        <s-input v-model="filterForm.topn"></s-input>
      </s-form-item>-->
      <s-form-item label="TOP N">
        <s-select v-model="filterForm.topn" placeholder="N">
          <s-option label="5" :value="5"></s-option>
          <s-option label="10" :value="10"></s-option>
          <s-option label="15" :value="15"></s-option>
          <s-option label="20" :value="20"></s-option>
          <s-option label="50" :value="50"></s-option>
        </s-select>
      </s-form-item>
      <s-form-item class="right">
        <s-button @click="count">统计</s-button>
      </s-form-item>
    </s-form>
    <s-table :data="topNList" style="width: 100%;">
      <s-table-column label="资产名称" prop="itcompName"></s-table-column>
      <s-table-column label="IP地址" prop="address"></s-table-column>
      <s-table-column label="资产类别" prop="ciTypeName"></s-table-column>
      <s-table-column label="分值">
        <template slot-scope="scope">
          <span @click="showDetail(scope.row)" class="score">
            {{scope.row.score === null ? '-' : scope.row.score}}
          </span>
        </template>
      </s-table-column>
    </s-table>

    <select-asset-dialog v-if="assetDialogFlag" v-model="assetDialogFlag" :citypeUuid="filterForm.citypeUuid"
             :select-asset="filterForm.itcompUuid" @select="selectItcompName">
    </select-asset-dialog>
    <score-detail-dialog v-model="scoreDetailDialogFlag" v-if="scoreDetailDialogFlag" :cur-score="curScoreObj">
    </score-detail-dialog>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import selectTree from '@/components/selectTree/SelectTree';
  import selectAssetDialog from './SelectAssetDialog';
  import scoreDetailDialog from './ScoreDetailDialog';

  export default {
    data() {
      return {
        assetDialogFlag: false,
        scoreDetailDialogFlag: false,
        itcompName: '',
        filterForm: {
          citypeUuid: [],
          itcompUuid: [],
          order: 'desc',
          topn: 5
        },
        topNList: [],
        curScoreObj: {}
      }
    },
    created() {
      this.axiosList();
    },
    methods: {
      axiosList() {
        let param = Object.assign({}, this.filterForm);
        $axios.post(`/kpi/getTopnByMap`, param).then(({data}) => {
          this.topNList = data;
        });
      },
      count() {
        this.axiosList();
      },
      selectItcompName(selectedArr) {
        this.itcompName = selectedArr.map(item => item.itcompName).join(',');
        this.filterForm.itcompUuid = selectedArr.map(item => item.uuid);
      },
      _selectMutiTreeChange(val) {
        this.filterForm.citypeUuid = val.map(item => item.uuid)
      },
      showDetail(row) {
        this.curScoreObj = row;
        this.scoreDetailDialogFlag = true;
      }
    },
    components: {
      selectTree,
      selectAssetDialog,
      scoreDetailDialog
    }
  }
</script>
