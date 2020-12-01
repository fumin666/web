<template>
  <s-dialog v-model="dialogFlag" title="查看结果详情" width="700px" class="scoreDetailDialog">
    <s-scrollbar wrap-class="scoreDetailScrollbar">
      <s-row class="title">资产信息</s-row>
      <div class="assetInfo">
        <s-row>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">资产名称</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{assetInfo.itcompName}}</div>
              </s-col>
            </s-row>
          </s-col>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">IP地址</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{assetInfo.address}}</div>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
        <s-row>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">资产类别</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{assetInfo.ciTypeName}}</div>
              </s-col>
            </s-row>
          </s-col>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">监控分数</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{assetInfo.score}}</div>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
      </div>
      <s-row class="title">打分结果详情</s-row>
      <div class="scoreInfo" v-if="assetInfo.isPingSuccess === 1">
        <!--权重-->
        <s-row v-for="(minWeight, index) in scoreInfo.minWeightList" :key="index">
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">最小权重指标</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{minWeight.miName}}</div>
              </s-col>
            </s-row>
          </s-col>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">权重值</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{minWeight.weigth}}</div>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
        <!--分值-->
        <s-row v-for="(minScore, index) in scoreInfo.minScoreList" :key="index">
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">最小分值指标</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{minScore.miName}}</div>
              </s-col>
            </s-row>
          </s-col>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">分值</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light">{{minScore.score}}</div>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
        <s-table :data="scoreInfo.indicator" style="width: 100%;">
          <s-table-column type="expand">
            <template slot-scope="scope">
              <s-table :data="scope.row.list" style="width: 100%;">
                <s-table-column label="监控项名称" prop="miName"></s-table-column>
                <s-table-column label="当前值/状态" prop="currentValue"></s-table-column>
                <s-table-column label="分值" prop="score">
                  <template slot-scope="scope">
                    {{ scope.row.score.toFixed(2) }}
                  </template>
                </s-table-column>
              </s-table>
            </template>
          </s-table-column>
          <s-table-column label="指标名称" prop="miName"></s-table-column>
          <s-table-column label="当前得分" prop="score"></s-table-column>
          <s-table-column label="权重" prop="weigth"></s-table-column>
          <s-table-column label="最终得分">
            <template slot-scope="scope">
              {{(scope.row.score * scope.row.weigth).toFixed(2)}}
            </template>
          </s-table-column>
        </s-table>
      </div>
      <div class="noScoreResult" v-else>
        <span class="result">该资产处于宕机状态，故监控分数为0！</span>
      </div>
    </s-scrollbar>
  </s-dialog>
</template>

<script>
  import $axios from 'sunflower-ajax';

  export default {
    data() {
      return {
        dialogFlag: false,
        assetInfo: {
          isPingSuccess: 1
        },
        scoreInfo: {
          minWeight: {},
          minScore: {},
          indicator: [],
          minWeightList: [],
          minScoreList: []
        }
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      curScore: {
        type: Object
      }
    },
    created() {
      $axios.get(`/kpi/getCurrentScoreByItcompUuid/${this.curScore.itcompUuid}`).then(({data}) => {
        this.assetInfo = data;
        if (data && data.isPingSuccess === 1) {
          $axios.get(`/kpi/getMinWeigthMiByKpiScoreItcompUuid/${this.assetInfo.uuid}`).then(({data}) => {
            this.scoreInfo.minWeightList = data;
          });
          $axios.get(`/kpi/getMinScoreMiByKpiScoreItcompUuid/${this.assetInfo.uuid}`).then(({data}) => {
            this.scoreInfo.minScoreList = data;
          });
          $axios.get(`/kpi/getKpiScoreMiByKpiScoreItcompUuid/${this.assetInfo.uuid}`).then(({data}) => {
            this.scoreInfo.indicator = data;
          });
        } else {
          this.assetInfo.score = 0;
        }
      });
    },
    methods: {
      toFixed(val) {
        val += '';
        return (val.split('.').length > 1 && val.split('.')[1].length > 2) ? (val - 0).toFixed(2) : val;
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
