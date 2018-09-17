<template>
  <div>
    <Cascader :data="list" v-model="currentVal" :clearable="false" @on-change="pick"></Cascader>
  </div>
</template>

<script>
  export default {
    props: {
      value: Array
    },
    data() {
      return {
        list: [],
        currentVal: []
      }
    },
    watch:{
      value(val){
        this.currentVal = [...val]
      }
    },
    methods: {
      getArea() {
        this.$http.post(this.$api.findAllArea).then(res => {
          this.list = res.data;
        })
      },
      pick(data, selectedData) {
        this.$emit("on-pick", {
          provinceId: selectedData[0].value,
          provinceName: selectedData[0].label,
          cityId: selectedData[1].value,
          cityName: selectedData[1].label,
          districtId: selectedData[2].value,
          districtName: selectedData[2].label
        });
      }
    },
    created() {
      this.getArea();
    }
  }
</script>

<style lang='less' scoped>
  
</style>