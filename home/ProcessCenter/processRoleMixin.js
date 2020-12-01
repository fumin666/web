import $axios from 'sunflower-ajax'

export default {
  created() {
    // 获取角色，防止刷新的时候丢失角色
    this.axiosProRole();
  },
  methods: {
    axiosProRole() {
      let rolesMap = this.$store.state.processCenter.rolesMap;
      $axios.get(`/itilWorkflowConfig/getItilRoleByUserUuid/${this.$store.state.userData.uuid}`).then(({data}) => {
        let proMap = { // 默认
        // 角色权限权限修改
          incidentArr: [-1],
          problemArr: [-1],
          changeArr: [-1],
          publishArr: [-1],
          serviceArr: [-1],
          knowledgeArr: [-1]
        };
        if (data.length === 0) {
         let rolePro = {
           incident: null,
           problem: null,
           change: null,
           publish: null,
           service: null,
           knowledge: null,
           serviceArr: []
         };
          this.$store.commit('setRolePro', rolePro);
        } else {
          data.forEach(item => {
            let roleType = item.roleKey.split('_')[0];
            proMap[roleType + 'Arr'].push(rolesMap[item.roleKey] === undefined ? -1 : rolesMap[item.roleKey]);
          });
          let rolePro = {
            incident: Math.max(...proMap.incidentArr),
            problem: Math.max(...proMap.problemArr),
            problemArr: proMap.problemArr,
            change: Math.max(...proMap.changeArr),
            knowledge: Math.max(...proMap.knowledgeArr),
            publish: Math.max(...proMap.publishArr),
            service: Math.max(...proMap.serviceArr),
            serviceArr: proMap.serviceArr
          }
          this.$store.commit('setRolePro', rolePro);
        }
      })
    }
  }
}
