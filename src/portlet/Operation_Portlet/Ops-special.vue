/**
* Created by alex on 2018/12/4.
*/
<template>
  <div class="oper-box">
    <s-card-diy :title="'特殊运维'" :more-click="goto" class="right-scroll">
      <!-- 运维人员 -->
      <s-card class="box-card  card-line right-card sper-card" v-if='teamflag'>
        <div slot="header" class="clearfix">
          <span class="card-title">
          </span>
        </div>
        <s-row type="flex" :gutter="6" >
          <s-col span="24" class="tc">
            <span class="oper-title" style="cursor:pointer" @click="teamPlease = true" >待我审批</span>
            <span class="orangeWord" style="cursor:pointer" @click="teamPlease = true" > {{BatchExeNum.myApproveOrder}}</span>
          </s-col>
        </s-row>
      </s-card>
      <s-card class="box-card  card-line right-card sper-card" v-if='operflag'>
        <div slot="header" class="clearfix">
          <span class="card-title">
          </span>
        </div>
        <s-row type="flex" :gutter="6" >
          <s-col span="12" class="tc">
            <span class="oper-title" style="cursor:pointer" @click="teamApply = true" >我申请</span>
            <span class="orangeWord" style="cursor:pointer" @click="teamApply = true" > {{ApplyNum.mySubOrder}}</span>
          </s-col>
          <s-col span="12" class="tc">
            <span class="oper-title" style="cursor:pointer" @click="teamother = true" >他人已审批</span>
            <span class="orangeWord" style="cursor:pointer" @click="teamother = true" > {{ApplyNum.approvedOrder}}</span>
          </s-col>
        </s-row>
      </s-card>
    </s-card-diy>
    <!-- 运维人员-特殊运维 -->
    <Apply-Me v-model="teamApply" v-if="teamApply"></Apply-Me>
    <Others v-model="teamother" v-if="teamother"></Others>
    <!-- 运维人员-批量执行 -->
    <!-- 团队主管 -->
    <approved v-model="teamPlease" v-if="teamPlease"></approved>
  </div>
</template>
<script type="text/babel">
  import $axios from 'sunflower-ajax'
  import roleCheckMixin from '@/common/mixins/roleCheckMixin'
  import approved from '../../pages/Recommended_HomePage/Dialog/approved ';
  // import approvedother from '../../pages/Recommended_HomePage/Dialog/approvedother';
  import ApplyMe from '../../pages/Recommended_HomePage/Dialog/ApplyMe';
  import Others from '../../pages/Recommended_HomePage/Dialog/Others';
  // import batchMe from '../../pages/Recommended_HomePage/Dialog/batchMe';
  // import batchOther from '../../pages/Recommended_HomePage/Dialog/batchOther';
  export default {
    components: {
        // batchOther,
        // approvedother,
        ApplyMe,
        Others,
        // batchMe,
        approved
    },
    mixins: [roleCheckMixin],
    data() {
      return {
        ApplyNum: {},
        BatchExeNum: {},
        operflag: false,
        teamflag: false,
        teamPlease: false,
        teamother: false,
        teamApply: false

      }
    },
    created() {
      $axios.get('/omaIndex/getOrderAndTaskCount').then((res) => {
        this.ApplyNum = res.data
      });
      $axios.get('/omaIndex/getMyApproveCount').then((res) => {
        this.BatchExeNum = res.data
      });
      if (this.isOperation === true) {
        this.operflag = true
      } else if (this.isOMATeamLeader === true) {
        this.teamflag = true
      } else if (this.isOperation === true && this.isOMATeamLeader === true) {
        this.operflag = true
      }
    },
    methods: {
      goto() {
        this.$router.push('/OperationCenter/oper_special')
      }
    }
  }
</script>
