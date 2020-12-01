/**
* Created by alex on 2017/5/6.
 */

<template>
  <div class="userInfo">
    <s-row v-for="item in data" :key="item.id">
      <s-col :span="10">
        <div class="grid-content bg-purple" v-text="item.name"></div>
      </s-col>
      <s-col :span="14">
        <div v-if="(item.name === '手机号码' && item.content && item.content.length > 0)"
             class="grid-content bg-purple-light ellipsis" :title="item.content | capitalize(phoneClose)">
          {{item.content | capitalize(phoneClose)}}
          <i class="iconfont" :class="phoneClose?'icon-open-eye':'icon-close-eye'" @click="phoneClose=!phoneClose" style="position: absolute;right: 10px;"></i>
        </div>
        <div v-else-if="(item.name === '个人地址' && item.content && item.content.length > 0)"
             class="grid-content bg-purple-light ellipsis" :title="item.content | capitalizeUserAddress(userAddressClose)">
          {{item.content | capitalizeUserAddress(userAddressClose)}}
          <i class="iconfont" :class="userAddressClose?'icon-open-eye':'icon-close-eye'" @click="userAddressClose=!userAddressClose" style="position: absolute;right: 10px;"></i>
        </div>
        <div v-else-if="(item.name === '身份证号码' && item.content && item.content.length > 0)"
             class="grid-content bg-purple-light ellipsis" :title="item.content | capitalizeIdCard(idCardClose)">
          {{item.content | capitalizeIdCard(idCardClose)}}
        </div>
        <div v-else-if="(item.name === '微信号' && item.content && item.content.length > 0)"
             class="grid-content bg-purple-light ellipsis" :title="item.content | capitalizeWechat(weChatClose)">
          {{item.content | capitalizeWechat(weChatClose)}}
          <i class="iconfont" :class="weChatClose?'icon-open-eye':'icon-close-eye'" @click="weChatClose=!weChatClose" style="position: absolute;right: 10px;"></i>
        </div>
        <div v-else-if="(item.name === '选项及默认值' && item.flag && item.flag !== 'tree')"
             class="grid-content bg-purple-light ellipsis">
          <s-scrollbar wrap-style="max-height: 200px;">
            <li class="listyle" :title="i.listvalues" v-for="(i, idx) in item.content||[]" :key="idx">
              <span v-if="item.rowData === i.realValue">{{i.listvalues}}(默认值)</span>
              <span v-else>{{i.listvalues}}</span>
            </li>
          </s-scrollbar>
        </div>
        <div v-else-if="(item.name === '附件信息' && item.flag)"
             class="grid-content bg-purple-light ellipsis">
          <s-scrollbar wrap-style="max-height: 200px;">
            <li class="listyle" :title="i.fileName" v-for="(i, idx) in item.content" :key="idx">
              <span v-if="!item.download">{{i.fileName}}</span>
              <span v-if="item.download">{{(i.fileName.length>13?i.fileName.substr(0,13)+'...':i.fileName)+'('+(parseFloat(i.fileSize/1000).toFixed(1))+'KB)'}}</span>
              <i v-if="item.download" @click="down(i.uuid)" class="iconfont icon-download theme_iconcolor" style="cursor:pointer;position:absolute;right:5px;"></i>
            </li>
          </s-scrollbar>
        </div>
        <div v-else-if="(item.name === '选项及默认值' && item.flag && item.flag === 'tree')"
             class="grid-content bg-purple-light ellipsis">
          <s-scrollbar wrap-style="max-height: 200px;">
            <s-tree
              :data="item.content"
              default-expand-all
              node-key="uuid"
              ref="tree"
              :props="defaultProps"></s-tree>
          </s-scrollbar>
        </div>
        <div v-else class="grid-content bg-purple-light ellipsis" :title="item.content"> {{item.content}} </div>
      </s-col>
    </s-row>
  </div>
</template>

<script type="text/babel">
  // import $axios from 'sunflower-ajax';
  import {Download} from 'sunflower-common-utils'
  export default {
    data() {
      return {
        defaultProps: {
          label: 'name',
          children: 'childrenList',
          uuid: 'uuid'
        },
        phoneClose: false,
        userAddressClose: false,
        idCardClose: false,
        weChatClose: false
      }
    },
    filters: {
      capitalize: (value, flag) => {
        if (!value) return ''
        if (value.length > 3 && !flag) {
          return value.substring(0, 3) + '****' + value.substring((value.length - 4), value.length)
        } else {
          return value
        }
      },
      capitalizeUserAddress: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      },
      capitalizeIdCard: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '****************' + value.substring(17, 18)
        } else {
          return value
        }
      },
      capitalizeWechat: (value, flag) => {
        if (!value) return ''
        if (value.length > 0 && !flag) {
          return value.substring(0, 1) + '******'
        } else {
          return value
        }
      }
    },
    props: {
      data: {
        type: Array
      },
      isHtml: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      watchUserInfo(val) {
        for (let i in val) {
          if (val[i].name === '手机号码' && val[i].content.length > 0) {
            val[i].content = val[i].content.substring(0, 3) + '****' + val[i].content.substring(7, 11)
          } else if (val[i].name === '个人地址' && val[i].content.length > 0) {
            val[i].content = val[i].content.substring(0, 1) + '******'
          } else if (val[i].name === '身份证号码' && val[i].content.length > 0) {
            val[i].content = val[i].content.substring(0, 1) + '****************' + val[i].content.substring(17, 18)
          } else if (val[i].name === '微信号' && val[i].content.length > 0) {
            val[i].content = val[i].content.substring(0, 1) + '******'
          }
        }
      },
      down(uuid) {
        Download(`/safetyPlatform/fileUpload/downloadKnowledgeFile/${uuid}`)
      }
    }
  }
</script>

