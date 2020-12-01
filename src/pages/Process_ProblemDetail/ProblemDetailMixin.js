import DetailUploadDialog from './DetailDialog/DetailUploadDialog.vue';
import AssignToMeDialog from './DetailDialog/AssignToMeDialog.vue';
import AssignToOtherDialog from './DetailDialog/AssignToOtherDialog.vue';
import CancelDialog from './DetailDialog/CancelDialog.vue';
import RemindDialog from './DetailDialog/BackDialog.vue';
import UndeterminedDialog from './DetailDialog/UndeterminedDialog.vue';
import CloseDialog from './DetailDialog/CloseDialog.vue';
import FinishDialog from './DetailDialog/FinishDialog.vue';

import $axios from 'sunflower-ajax';

export default {
  data() {
    return {
      uploadDialogFlag: false,
      AssignToMeDialog: false,
      AssignToOtherDialog: false,
      CancelDialog: false,
      RemindDialog: false,
      UndeterminedDialog: false,
      CloseDialog: false,
      FinishDialog: false
    }
  },
  methods: {
    attention() {
      if (!this.form.concernUuid) {
        $axios.get(`/ItilCommonWorkflow/concernIncidentOrder/${this.uuid}/1`).then(({data}) => {
          if (data) {
            this.form.concernUuid = data;
            this.$message({type: 'success', message: '关注成功!'});
          } else {
            this.$message({type: 'error', message: '关注失败!'});
          }
        })
      } else {
        $axios.get(`/ItilCommonWorkflow/cancelIncidentOrder/${this.form.concernUuid}`).then(({data}) => {
          if (data.state) {
            this.form.concernUuid = '';
          }
          this.$message({type: data.state ? 'success' : 'error', message: data.errormsg});
        })
      }
    },
    showUploadDialog() {
      this.uploadDialogFlag = true;
    },
    showAssignToMeDialog() {
      this.AssignToMeDialog = true;
    },
    showAssignToOtherDialog() {
      this.AssignToOtherDialog = true;
    },
    showCancelDialog() {
      this.CancelDialog = true;
    },
    showRemindDialog() {
      this.RemindDialog = true;
    },
    showUndeterminedDialog() {
      this.UndeterminedDialog = true;
    },
    showCloseDialog() {
      this.CloseDialog = true;
    },
    showFinishDialog() {
      this.FinishDialog = true;
    }
  },
  components: {
    DetailUploadDialog,
    AssignToMeDialog,
    AssignToOtherDialog,
    CancelDialog,
    RemindDialog,
    UndeterminedDialog,
    CloseDialog,
    FinishDialog
  }
}
