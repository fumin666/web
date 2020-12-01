/**
* Created by liushupeng on 2019/1/24.
*/
<template>
  <div class="diy-dba-audit-target">
    <s-card-diy
      title="审计对象"
      :show-more="false"
    >
      <div style="width: 100%; height: 100%;padding: 10px;">
        <s-carousel :interval="5000" arrow="never" :autoplay="false" style="height: 100%">
          <s-carousel-item v-for="(i, idx) in carouselLength" :key="idx">
            <div  class="diyContent">
              <div style="padding: 5px; width: 49%;height: 49%;" v-for="(m, index) in 4" :key="index">
                <div  class="diy-audit-target-card" v-if="4 * (i - 1) + m -1 < list.length">
                  <div class="card-number-box">
                    <span class="audit-target-card-number">{{ 4 * (i - 1) + m }}</span>
                  </div>
                  <div class="card-content">
                    <div class="diy-audit-target-content content-left">
                      <h3 class="content-title" style="color:#392C28;">{{ list[4 * (i - 1) + m - 1].dbi_name }}</h3>
                      <a @click="goto(list[4 * (i - 1) + m - 1])" style="font-size: 12px;color: #FF8441;cursor: pointer;">详情</a>
                    </div>
                    <div class="diy-audit-target-content">
                      <p class="content-title" style="color: #5272FF;">当前<span class="content-title-right">(个)</span></p>
                      <p class="content-text">总会话 {{ list[4 * (i - 1) + m - 1].totalSessionCount }}</p>
                      <p class="content-text">活跃会话 {{ list[4 * (i - 1) + m - 1].activeSessionCount }}</p>
                    </div>
                    <div class="line-box">
                      <div class="dividing-line"></div>
                    </div>
                    <div class="diy-audit-target-content">
                      <p class="content-title" style="color: #41C53E;">今天<span class="content-title-right">(条)</span></p>
                      <p class="content-text">SQL总量 {{ list[4 * (i - 1) + m - 1].todayTotalSqlCount }}</p>
                      <p class="content-text">告警总量 <span style="font-size: 12px;color: #FE4541">{{ list[4 * (i - 1) + m - 1].todayTotalAlarmCount }}</span></p>
                    </div>
                    <div class="line-box">
                      <div class="dividing-line"></div>
                    </div>
                    <div class="diy-audit-target-content">
                      <p class="content-title" style="color: #392c28;">全部<span class="content-title-right">(条)</span></p>
                      <p class="content-text">SQL总量 {{ list[4 * (i - 1) + m - 1].allTotalSqlCount }}</p>
                      <p class="content-text">告警总量 <span style="font-size: 12px;color: #FE4541">{{ list[4 * (i - 1) + m - 1].allTotalAlarmCount }}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </s-carousel-item>
        </s-carousel>
      </div>
    </s-card-diy>
  </div>
</template>

<script>
  import $axios from 'sunflower-ajax'
  export default {
    data() {
      return {
        list: []
      }
    },
    created() {
      this.getData();
    },
    computed: {
      carouselLength() {
        return Math.ceil(this.list.length / 4);
      }
    },
    methods: {
      goto(row) {
        this.$router.push({path: 'LogCenter/log_operationdata', query: {dbiUuid: row.dbi_uuid}})
      },
      getData() {
        $axios.get('/dbOperation/getAllDbauditInstanceCountDetail').then(res => {
          this.list = res.data;
        })
      }
    }
  }
</script>

<style>
  .diy-dba-audit-target{
    width: 100%;
    height:100%;
  }
  .diyContent {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap:wrap;
  }
  .diy-audit-target-card{
    width: 100%;
    height: 100%;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    background-color: #f2f3f5
  }
  .line-box{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .dividing-line{
    width: 2px;
    height: 33%;
    background-color: #e4e7ed;
    padding-top: 33%;
  }
  .diy-audit-target-content{
    width: 24%;
    height: 100%;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .card-number-box{
    width: 60px;
    height:60px;
    border-radius: 50%;
    background-color: #e4e7ed;
    position: absolute;
    left: -25px;
    top:-25px;
  }
  .audit-target-card-number{
    position: absolute;
    right: 13px;
    bottom: 8px;
    color: #ABB0BB;
    font-size:14px;
  }
  .card-content{
    height: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }
  .content-left{
    padding: 30px 0;
  }
  .content-title{
    font-size: 16px;
    font-weight: bold
  }
  .content-title-right{
    font-size: 10px;
    margin-left: 5px;
    color: #ABB0BB;
    font-weight: 100
  }
  .content-text{
    font-size: 12px;
    color: #392C28
  }
</style>
