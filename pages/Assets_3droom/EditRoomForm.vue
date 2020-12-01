/**
* Created by dgunzi on 2019/07/29.
*/
<template>
  <s-form ref="roomForm" :model="roomForm" :rules="roomFormRule">
    <s-form-item label-width="120" label="机房名称" prop="roomName" tip="最大长度为20个字符">
      <s-input v-model="roomForm.roomName" style="width:280px"></s-input>
    </s-form-item>
  </s-form>
</template>

<script>
  import {checkRoomNameUnique, getThreeDAssetRoomByUuid} from './RoomRoomApi'

  export default {
        name: 'editForm',
        data() {
            let checkRepeatName = (rule, value, callback) => {
              if (value !== this.editRoom.roomName) {
                if (value) {
                  checkRoomNameUnique({roomName: value}).then((res) => {
                    if (!res.data.state) {
                      callback(new Error('该机房名称已经存在'));
                    } else {
                      callback()
                    }
                  })
                }
              }
            }
            return {
              roomForm: {
                roomName: ''
              },
              roomFormRule: {
                roomName: [
                  {required: true, message: '不能为空', trigger: 'blur'},
                  {max: 20, message: '最大长度为20', trigger: 'blur'},
                  {validator: checkRepeatName, trigger: 'blur'}
                ]
              },
              editRoomData: null
            }
        },
        props: {
          editRoom: {
            type: Object,
            required: true
          }
        },
        created() {
          getThreeDAssetRoomByUuid(this.editRoom.roomUuid).then(({data}) => {
            this.roomForm.roomName = this.editRoom.roomName;
            this.editRoomData = data;
          });
        },
        methods: {}
    }
</script>

<style scoped>

</style>
