<template>
  <s-form :model="form" ref="Form" :rules="rules" label-width="120px">
    <s-row>
      <s-col :span="14">
        <s-form-item prop="orderType" label="所属流程:">
          <s-select v-model="form.orderType" @change="changeOrderType">
            <s-option v-for="(value, key, index) in options.orderTypeMap" :label="value"
                      :value="index"  :key="index"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="orderStatus" label="流程状态:">
          <s-select v-model="form.orderStatus">
            <s-option v-for="item in options.orderStatus" :label="item.name"
                      :value="item.valueInt"  :key="item.valueInt"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="sendObjectUuid" label="发送对象:">
          <s-select v-model="form.sendObjectUuid" >
            <s-option v-for="item in options.sendObject" :label="item.roleName"
                      :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="status" label="规则状态:">
          <s-select v-model="form.status">
            <s-option v-for="item in options.statusMap" :label="item.value"
                      :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-form-item>
        <s-form-item prop="subject" label="邮件标题:">
          <s-input v-model="form.subject" :maxlength="80"></s-input>
        </s-form-item>
      </s-col>
    </s-row>
    <s-row>
      <s-col :span="16">
        <s-form-item prop="content" label="邮件内容:">
          <s-input type="textarea" :rows="5" class="s-input-inner" v-html='contentHtml' v-model="contentHtml"  style="height: 200px;overflow:auto; ">
          </s-input>
        </s-form-item>
      </s-col>
      <s-col :span="8" style="padding-left: 15px;">
        <s-row>
          <s-select v-model="mailSelect" @change="handleTypeChange">
            <s-option v-for="item in options.mailSelectMap" :label="item.name"
                      :value="item.uuid"  :key="item.uuid"></s-option>
          </s-select>
        </s-row>
        <s-row>
          <s-table :data="addDataName" :show-header="false">
            <s-table-column property="name" label="字段名称" show-overflow-tooltip></s-table-column>
            <s-table-column prop="value" label="操作" width="70">
              <template slot-scope="scope">
                <i class="iconfont icon-delete" title="删除" @click="delFieId(scope.row)"> </i>
              </template>
            </s-table-column>
          </s-table>
        </s-row>
      </s-col>
    </s-row>
  </s-form>
</template>

<script>
  import $axios from 'sunflower-ajax';
  import { intersectObj, Validaters } from 'sunflower-common-utils'
  export default{
    data() {
      return {
        form: {
          orderType: '',
          orderStatus: '',
          sendObjectUuid: '',
          subject: '',
          content: '',
          status: ''
        },
        rules: {
          orderType: [Validaters.NotNull],
          orderStatus: [Validaters.NotNull],
          sendObjectUuid: [Validaters.NotNull],
          status: [Validaters.NotNull],
          subject: [Validaters.NotNull],
          content: [Validaters.NotNull]
        },
        options: {
          orderTypeMap: {},
          orderStatus: {},
          sendObject: [],
          mailSelectMap: [],
          statusMap: [
            {
              value: '开启',
              uuid: 1
            },
            {
              value: '未开启',
              uuid: 0
            }
          ]
        },
        mailSelect: '',
        orderTypeName: '',
        orderTypeNameStr: '',
        addDataName: [],
        sendObjectName: '',
        orderStatusName: '',
        fileNames: [
          { name: '简要描述' },
          { name: '分类一级' },
          { name: '分类二级' },
          { name: '分类三级' },
          { name: '提交时间' },
          { name: '提交人' }
        ],
        dataSort: 0,
        addStrHtml: '',
        strIndex: ''
      }
    },
    props: {
      editData: {
        type: Object
      }
    },
    computed: {
      contentHtml() {
        let dataArr = this.addDataName.map(item => {
          return `<p class='mailRulesContent'><span class='addDataName'>${item.name}</span>：$${item.name}</p>`
        })
        let dataStr = dataArr.join('');
        this.form.content = `<div style="margin-top: 5px;" id="mailContent">尊敬的用户$处理人, 您好：
                   <p class="mailRulesContent">ITSM ${this.orderTypeNameStr} ($工单号)状态变为${this.orderStatusName}，您是该工单的${this.sendObjectName}，请您处理。</p>
                   <p class="mailRulesContent">简要描述：$简要描述</p>
                   <p class="mailRulesContent">分类一级：$分类一级</p>
                   <p class="mailRulesContent">分类二级：$分类二级</p>
                   <p class="mailRulesContent">分类三级：$分类三级</p>
                   <p class="mailRulesContent">提交时间：$提交时间</p>
                   <p class="mailRulesContent">提交人：$提交人</p>
                   ${dataStr}
                 </div>
                 <div style="margin-top: 10px;">如有任何问题，请及时反馈。</div>`;
        return this.form.content;
      }
    },
    methods: {
      getOrderStatusAndSendObject(val) {
        $axios.get('/itilSendRule/getOrderStatusAndSendObject/' + val).then((res) => {
          this.options.orderStatus = res.data.orderStatus;
          this.options.sendObject = res.data.sendObject;
        })
      },
      getDefaultStatusAndSendObject(val) {
        $axios.get('/itilSendRule/getOrderStatusAndSendObject/' + val).then((res) => {
          this.options.orderStatus = res.data.orderStatus;
          this.options.sendObject = res.data.sendObject;
          this.form.sendObjectUuid = this.options.sendObject[0].uuid;
          this.form.orderStatus = this.options.orderStatus[0].valueInt;
        })
      },
      getOrderType() {
        $axios.get('ItilCommonWorkflow/getOrderType').then((res) => {
          this.options.orderTypeMap = res.data;
        })
      },
      getMailSelect(val) {
        $axios.get('/itilSendRule/getMailSelectByOrderType/' + val).then((res) => {
          this.options.mailSelectMap = res.data;
        })
      },
      handleTypeChange(val) {
        for (let i in this.options.mailSelectMap) {
          if (this.options.mailSelectMap[i].uuid === val) {
            this.mailSelect = this.options.mailSelectMap[i].name;
          }
        }
        this.dataSort += 1;
        let param = {
          name: this.mailSelect,
          uuid: val,
          sort: this.dataSort
        };
        if (this.fileNames.length > 0) {
          for (let i in this.fileNames) {
            if (this.fileNames[i].name === param.name) {
              this.$message({
                type: 'error',
                message: '不能选择重复字段'
              })
              return;
            }
          }
          if (this.addDataName.length > 0) {
            for (let i in this.addDataName) {
              if (this.addDataName[i].name === param.name) {
                this.$message({
                  type: 'error',
                  message: '不能选择重复字段'
                })
                return;
              }
            }
          }
          this.addDataName.push(param);
        }
      },
      handlerAddData(val) {
        this.dataSort += 1;
        for (let i in val) {
          let param = {
            name: val[i].name,
            uuid: val[i].uuid,
            sort: this.dataSort
          };
          this.addDataName.push(param);
        }
      },
      delFieId(row) {
        for (let i in this.addDataName) {
          if (this.addDataName[i].sort === row.sort) {
            this.addDataName.splice(i, 1);
            this.strIndex = i;
          }
        }
      },
      changeOrderType(val) {
        if (val !== '') {
          this.mailSelect = '';
          this.orderTypeName = val;
          this.addDataName = [];
          this.form.sendObjectUuid = '';
          this.form.orderStatus = '';
          this.options.orderStatus = [];
          this.options.sendObject = [];
          this.getDefaultStatusAndSendObject(val);
          this.getMailSelect(val);
          this.form.content = this.contentHtml;
        }
      }
    },
    created() {
      if (this.editData !== undefined) {
        this.form.uuid = '';
        this.form = intersectObj(this.form, this.editData);
        this.orderStatusName = this.editData.orderStatusName;
        this.sendObjectName = this.editData.sendObjectName;
        this.handlerAddData(this.editData.sendMailConfList);
        this.getOrderStatusAndSendObject(this.form.orderType);
        this.getOrderType();
        this.getMailSelect(this.form.orderType);
      } else {
        this.getOrderType();
        this.form.content = `<div style="margin-top: 5px;" id="mailContent">尊敬的用户$处理人, 您好：
                   <p class="mailRulesContent">ITSM ${this.orderTypeNameStr} ($工单号)状态变为${this.orderStatusName}，您是该工单的${this.sendObjectName}，，请您处理。</p>
                   <p class="mailRulesContent">简要描述：$简要描述</p>
                   <p class="mailRulesContent">分类一级：$分类一级</p>
                   <p class="mailRulesContent">分类二级：$分类二级</p>
                   <p class="mailRulesContent">分类三级：$分类三级</p>
                   <p class="mailRulesContent">提交时间：$提交时间</p>
                   <p class="mailRulesContent">提交人：$提交人</p>
                 </div>
                 <div style="margin-top: 10px;">如有任何问题，请及时反馈。</div>`;
        this.form.orderType = 0;
        this.form.status = 1;
        this.getMailSelect(0);
        this.getDefaultStatusAndSendObject(0);
      }
    },
    watch: {
      'form.orderStatus': {
        handler: function (val) {
          if (this.options.orderStatus.length > 0) {
            this.options.orderStatus.map(item => {
              if (item.valueInt === val) {
                this.orderStatusName = item.name;
              }
            })
          }
        },
        deep: true
      },
      'form.sendObjectUuid': {
        handler: function (val) {
          if (val !== '') {
            this.options.sendObject.map(item => {
              if (item.uuid === val) {
                this.sendObjectName = item.roleName;
                this.form.subject = `【ITSM】${this.orderTypeNameStr}单($工单号)已指派给您，请您处理。 您是该工单的${this.sendObjectName}角色。`
              }
            })
          }
        },
        deep: true
      },
      'form.orderType': {
        handler: function (val) {
          if (val !== '') {
            switch (val) {
              case 0:
                this.orderTypeNameStr = '事件';
                break;
              case 1:
                this.orderTypeNameStr = '问题';
                break;
              case 2:
                this.orderTypeNameStr = '变更';
                break;
              case 3:
                this.orderTypeNameStr = '任务';
                break;
              case 4:
                this.orderTypeNameStr = '知识';
                break;
              case 5:
                this.orderTypeNameStr = '发布';
                break;
              case 6:
                this.orderTypeNameStr = '服务请求';
                break;
            }
          }
        },
        deep: true
      }
    },
    filters: {
      filterOrderType(val) {
        switch (val) {
          case 0:
            return '事件';
          case 1:
            return '问题';
          case 2:
            return '变更';
          case 3:
            return '任务';
          case 4:
            this.orderTypeNameStr = '知识';
            break;
          case 5:
            this.orderTypeNameStr = '发布';
            break;
          case 6:
            this.orderTypeNameStr = '服务请求';
            break;
        }
      }
    }
  }
</script>

<style lang="stylus">
.mailRulesContent
  text-indent 20px
  line-height 16px
  margin-top 5px
</style>
