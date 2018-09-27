<template>
  <div>交易汇总报表
  </div>
</template>

<script>
  export default {
    data() {
      return {
        
      }
    },
    methods: {
      getData(){
        this.$http.post(this.$api.summaryStatistics).then(res =>{
          if(res.code === 1000){
            console.log(res)
          }
        })
      }
    },
    created(){
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  
</style>