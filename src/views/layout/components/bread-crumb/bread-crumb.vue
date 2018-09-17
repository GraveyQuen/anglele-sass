<template>
  <div class="custom-bread-crumb">
    <Breadcrumb>
      <BreadcrumbItem v-for="(item,index) in breadCrumbList" :to="item.to" :key="index">
        {{ item.meta.title}}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    computed: {
      breadCrumbList() {
        return this.$store.state.breadCrumbList
      }
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .custom-bread-crumb{
    margin-bottom: 20px;
  }
</style>