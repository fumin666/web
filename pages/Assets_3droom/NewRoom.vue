/**
* Created by dgunzi on 2019/07/25.
*/
<template>
  <div>
    <s-form ref="roomForm" :model="roomForm" :rules="roomFormRule">
      <s-form-item label-width="120" label="机房名称" prop="roomName" tip="最大长度为20个字符">
        <s-input v-model="roomForm.roomName" style="width:275px"></s-input>
      </s-form-item>
      <s-form-item label-width="120" label="初始宽度" prop="roomWidth">
        <s-input-number v-model.number="roomForm.roomWidth" style="width:120px" :min="1" :max="1000"></s-input-number> m
      </s-form-item>
      <s-form-item label-width="120" label="初始高度" prop="roomHeight">
        <s-input-number v-model.number="roomForm.roomHeight" style="width:120px" :min="1" :max="1000"></s-input-number> m
      </s-form-item>
    </s-form>
  </div>
</template>

<script>
  import {Validaters} from 'sunflower-common-utils';
  import {checkRoomNameUnique} from './RoomRoomApi'

  export default {
        name: 'newRoom',
        data() {
            let checkRepeatName = (rule, value, callback) => {
              if (value) {
                checkRoomNameUnique({roomName: value}).then((res) => {
                  if (!res.data.state) {
                    callback(new Error('该机房名称已经存在'));
                  } else {
                    callback()
                  }
                })
              }
            };
            return {
              roomForm: {
                roomName: '',
                roomWidth: 10,
                roomHeight: 10
              },
              roomFormRule: {
                roomName: [
                  {required: true, message: '不能为空', trigger: 'blur'},
                  {max: 20, message: '最大长度为20', trigger: 'blur'},
                  {validator: checkRepeatName, trigger: 'blur'}
                ],
                roomWidth: [
                  Validaters.NotNull
                ],
                roomHeight: [
                  Validaters.NotNull
                ]
              }
            }
        },
        created() {
        },
        methods: {}
    }
</script>

<style scoped>

</style>
