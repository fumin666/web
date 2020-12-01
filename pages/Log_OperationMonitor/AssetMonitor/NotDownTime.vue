<template>
  <section class="logNotDownTime">
    <s-scrollbar wrap-class="logWrapHeight">
      <!--资产信息-->
      <s-row>
        <s-col :span="24" class="title">资产信息</s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">资产名称</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light" v-if="assetMsg.itcompName === null"></div>
          <s-tooltip :content="assetMsg.itcompName" v-else>
            <div class="grid-content bg-purple-light overFlowTip">{{assetMsg.itcompName}}</div>
          </s-tooltip>
        </s-col>
        <s-col :span="5">
          <div class="grid-content bg-purple">IP地址</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light" v-if="assetMsg.address !== null">{{assetMsg.address}}</div>
          <div class="grid-content bg-purple-light" v-else></div>
        </s-col>
      </s-row>
      <s-row>
        <s-col :span="5">
          <div class="grid-content bg-purple">资产类别</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light" v-if="assetMsg.ciTypeName !== null">{{assetMsg.ciTypeName}}</div>
          <div class="grid-content bg-purple-light" v-else></div>
        </s-col>
        <s-col :span="5">
          <div class="grid-content bg-purple">监控分数</div>
        </s-col>
        <s-col :span="7">
          <div class="grid-content bg-purple-light monitorScore" v-if="assetMsg.score !== null">{{assetMsg.score}}</div>
          <div class="grid-content bg-purple-light monitorScore" v-else></div>
        </s-col>
      </s-row>
      <!--打分结果详情-->
      <s-row>
        <s-col :span="24" class="title">打分结果详情</s-col>
      </s-row>
        <s-row v-for="(minWeight, index) in minWeigthMsg" :key="index">
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">最小权重指标</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light" v-if="minWeight.miName !== null">{{minWeight.miName}}</div>
              </s-col>
            </s-row>
          </s-col>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">权重值</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light" v-if="minWeight.weigth !== null">{{minWeight.weigth}}</div>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
        <!--分值-->
        <s-row v-for="(minScore, index) in minScoreMsg" :key="'score'+index">
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">最小分值指标</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light" v-if="minScore.miName !== null">{{minScore.miName}}</div>
              </s-col>
            </s-row>
          </s-col>
          <s-col span="12">
            <s-row>
              <s-col :span="12">
                <div class="grid-content bg-purple">分值</div>
              </s-col>
              <s-col :span="12">
                <div class="grid-content bg-purple-light" v-if="minScore.score !== null">{{minScore.score}}</div>
              </s-col>
            </s-row>
          </s-col>
        </s-row>
      <s-table :data="importCmdbMsg" style="width: 100%;">
        <s-table-column type="expand">
          <template slot-scope="scope">
            <s-table :data="scope.row.list" style="width: 100%;">
              <s-table-column label="监控项名称" prop="miName" style="width: 40%;" show-overflow-tooltip></s-table-column>
              <s-table-column label="当前值/状态" prop="currentValue"></s-table-column>
              <s-table-column label="分值" prop="score"></s-table-column>
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
    </s-scrollbar>
  </section>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
      }
    },
    props: ['assetMsg', 'minWeigthMsg', 'minScoreMsg', 'importCmdbMsg'],
    methods: {
    },
    created() {
    }
  }
</script>
