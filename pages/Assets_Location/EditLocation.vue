<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-05-07 11:30:24
 * @LastEditTime: 2019-08-23 16:26:51
 * @LastEditors: Please set LastEditors
 -->
<template>
  <section class="LocationForm">
    <s-form
      ref="addLocationForm"
      :model="locationForm"
      :rules="locationrules"
      label-width="120px"
      style="width: 90%"
    >
      <s-form-item label="位置名称" prop="name">
        <s-input v-model="locationForm.name"></s-input>
      </s-form-item>
      <s-form-item label="城市" prop="cityName">
        <s-cascader
          :options="cityData"
          :props="cityConfig"
          :value="cityDataValue"
          expand-trigger="hover"
          @change="changecityData"
          :show-all-levels="false"
          v-model="locationForm.city"
          style="width: 100%"
        ></s-cascader>
      </s-form-item>
      <s-form-item label="区域" prop="county">
        <s-select v-model="locationForm.county" @change="changecounty()" style="width: 100%">
          <s-option
            v-for="item in countyNameList"
            :label="item.name"
            :value="item.uuid"
            :key="item.uuid"
          ></s-option>
        </s-select>
      </s-form-item>
      <s-form-item label="建筑物" prop="building">
        <s-input v-model="locationForm.building"></s-input>
      </s-form-item>
      <s-form-item label="楼层" prop="floor">
        <s-input v-model="locationForm.floor"></s-input>
      </s-form-item>
      <s-form-item label="分区" prop="partition">
        <s-input v-model="locationForm.partition"></s-input>
      </s-form-item>
      <s-form-item label="位置" prop="locationSite">
        <s-input v-model="locationForm.locationSite"></s-input>
      </s-form-item>
    </s-form>
    <div style="display:none">{{locationSite}}</div>
  </section>
</template>

<script type="text/ecmascript-6">
import $axios from 'sunflower-ajax'
import {Validaters} from 'sunflower-common-utils'
import { cloneDeep } from 'lodash'
export default {
  data() {
    return {
      locationForm: {
        name: '',
        city: [],
        county: '',
        building: '',
        floor: '',
        partition: '',
        cabinet: '',
        locationSite: ''
      },
      locationrules: {
        name: [
          Validaters.NotNull,
          Validaters.Name,
          { max: 100, message: '最大输入长度为100', trigger: 'blur' }
        ],
        cityName: [],
        county: [],
        building: [
          Validaters.NotNull,
          Validaters.Name,
          { max: 100, message: '最大输入长度为100', trigger: 'blur' }
        ],
        floor: [
          Validaters.NotNull,
          Validaters.Name,
          { max: 100, message: '最大输入长度为100', trigger: 'blur' }
        ],
        partition: [
          Validaters.NotNull,
          Validaters.Name,
          { max: 100, message: '最大输入长度为100', trigger: 'blur' }
        ],
        cabinet: [
          Validaters.NotNull,
          Validaters.Name,
          { max: 100, message: '最大输入长度为100', trigger: 'blur' }
        ],
        locationSite: [
          Validaters.NotNull,
          Validaters.Name,
          { max: 600, message: '最大输入长度为600', trigger: 'blur' }
        ]
      },
      cityData: [],
      cityConfig: {
        label: 'name',
        value: 'uuid',
        children: 'childrenList'
      },
      cityDataValue: [],
      countyNameList: [],
      cityName: '',
      countyName: '',
      locationSite: '',
      isFirstLoad: false
    }
  },
  props: {
    editData: {
      type: Object
    }
  },
  watch: {
    'locationForm.name'(val) {
      this.locationForm.locationSite = this.editLocationSite(0, val)
    },
    'locationForm.city'(val) {
      if (this.isFirstLoad) {
        this.locationForm.locationSite = this.editLocationSite(1, this.cityName)
      } else {
        this.isFirstLoad = true
      }
    },
    'locationForm.county'(val) {
      this.countyNameList.forEach((item, i) => {
        if (item.uuid === val) {
          this.locationForm.locationSite = this.editLocationSite(2, item.name)
        }
      })
    },
    cityName(val) {
      if (this.editData === undefined) {
        this.locationForm.locationSite = this.editLocationSite(1, val)
      }
    },
    'locationForm.building'(val) {
      this.locationForm.locationSite = this.editLocationSite(3, val)
    },
    'locationForm.floor'(val) {
      this.locationForm.locationSite = this.editLocationSite(4, val)
    },
    'locationForm.partition'(val) {
      this.locationForm.locationSite = this.editLocationSite(5, val)
    },
    'locationForm.cabinet'(val) {
      this.locationForm.locationSite = this.editLocationSite(6, val)
    }
  },
  methods: {
    editLocationSite(index, item) {
      let arr = this.locationForm.locationSite.split('-') // 先用斜杠分割成字符串数组。
      arr[index] = item // 修改对应项
      let arrStr = arr.join('-')
      return arrStr
    },
    changecounty() {
      if (this.countyNameList.length !== 0) {
        let a = this.countyNameList.filter(item => {
          return item.uuid === this.locationForm.county
        })
        this.countyName = a[0].name
      }
    },
    getCityList() {
      function cycle(arr) {
        arr.forEach(item => {
          if (item.childrenList && item.childrenList.length === 0) {
            item.childrenList = null
          } else {
            cycle(item.childrenList)
          }
        })
      }
      $axios
        .get(
          '/resourcemanager/configurationmanage/location/getAllProvinceAndCityTree'
        )
        .then(res => {
          this.cityData = res.data
          cycle(this.cityData)
          if (this.editData === undefined) {
            this.locationForm.city[0] = this.cityData[0].uuid
            this.changecityData()
            this.locationForm.county =
              this.cityData[0].childrenList !== null
                ? this.cityData[0].childrenList[0].uuid
                : null
          }
        })
    },
    changecityData() {
      if (this.locationForm.city.length === 1) {
        let a = this.cityData.filter(item => {
          return item.uuid === this.locationForm.city[0]
        })
        this.cityName = a[0].name
      } else {
        let b = this.cityData.filter(item => {
          return item.uuid === this.locationForm.city[0]
        })
        let c = b[0].childrenList.filter(item => {
          return item.uuid === this.locationForm.city[1]
        })
        this.cityName = c[0].name
      }
      $axios
        .get(
          `resourcemanager/configurationmanage/location/getProvinceCityDistrictByParent/${
            this.locationForm.city.length === 1
              ? this.locationForm.city
              : this.locationForm.city[1]
          }`
        )
        .then(res => {
          this.countyNameList = res.data
          this.locationForm.county =
            this.countyNameList.length !== 0 ? this.countyNameList[0].uuid : ''
          this.changecounty()
        })
    }
  },
  created() {
    this.getCityList()
    if (this.editData !== undefined) {
      let cloneData = cloneDeep(this.editData)
      let city = []
      city[0] = cloneData.province
      city[1] = cloneData.city === null ? null : cloneData.city
      cloneData.city = city
      this.locationForm = cloneData
      $axios
        .get(
          `resourcemanager/configurationmanage/location/getProvinceCityDistrictByParent/${
            this.locationForm.city[1] === null
              ? this.locationForm.city[0]
              : this.locationForm.city[1]
          }`
        )
        .then(res => {
          this.countyNameList = res.data
        })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.LocationForm {
  min-height: 300px;
}
</style>
