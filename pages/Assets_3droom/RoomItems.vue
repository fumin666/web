/**
* Created by dgunzi on 2019/07/23.
* 房间列表
*/
<template>
  <div class="roomItemList">
    <div class="search"><s-input
      placeholder="请输入机房名称"
      prefix-icon="magnifier"
      v-model="inputValue">
    </s-input></div>
    <s-scrollbar wrap-style="height: calc(100vh - 223px);">
    <div class="sceneItem" v-if="filterRoomList.length > 0">
      <div v-for="item in filterRoomList">
        <div :key="item.roomUuid" @click="changeRoom(item)" :class="{currentRoom: item.roomUuid === currentRoom.roomUuid}" class="roomItem" style="">
          <s-row v-if="!isView">
            <s-col span="16" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap; word-break: keep-all;" :title="'切换到' + item.roomName">
              {{ item.roomName }}
            </s-col>
            <s-col span="8" style="text-align: right;">
              <s-button icon="edit" size="mini" title="修改" @click.stop="editRoom(item)"></s-button>
              <s-button icon="delete" size="mini" title="删除" @click.stop="deleteRoom(item)" v-if="item.roomUuid !== defaultRoomUuid"></s-button>
            </s-col>
          </s-row>
          <s-row v-if="isView">
            <s-col span="24" style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap; word-break: keep-all;" :title="'切换到' + item.roomName">
              {{ item.roomName }}
            </s-col>
          </s-row>
        </div>
      </div>
    </div>
    <div v-if="filterRoomList.length == 0" style="text-align: center; line-height: 35px;height: 35px;">
      暂无数据
    </div>
    </s-scrollbar>
  </div>
</template>

<script>
  import {debounce} from 'lodash';

  export default {
        name: 'roomItems',
        data() {
            return {
              filterRoomList: [],
              inputValue: null,
              defaultRoomUuid: 'db02c679e3384cd4b6dc0722468b1f1b'
            }
        },
        props: {
          roomList: {
            required: true
          },
          currentRoom: {
            required: true
          },
          isView: {
            required: true,
            default: false
          }
        },
        created() {
          this.inputValue = '';
        },
        watch: {
          inputValue: debounce(function() {
            this.filterRoomList = this.roomList.filter((room) => {
              if (this.inputValue === '') {
                return true;
              } else if (room.roomName.indexOf(this.inputValue) !== -1) {
                return true;
              } else {
                return false;
              }
            });
          }, 500),
          roomList: {
            immediate: true,
            handler(val) {
              this.filterRoomList = this.roomList;
              this.inputValue = '';
            }
          }
        },
        methods: {
          deleteRoom(item) {
            this.$confirm('确定删除该机房？', '提示', {
              confirmButonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('deleteRoom', item);
            }).catch(() => {});
          },
          editRoom(item) {
            this.$emit('editRoom', item);
          },
          changeRoom(item) {
            this.$emit('changeRoom', item);
          }
        }
    }
</script>

