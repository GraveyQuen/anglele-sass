<template>
  <div class="tables">
    <Table width="100%" ref="settledTable" :columns="tableHeader" :data="lists">
      <!-- 操作 -->
      <template slot="orders" slot-scope="props">
        <!-- {{props.row}} -->
      </template>
    </Table>
  </div>
</template>

<script>
  import {
    dateformat,
    settlementStatus
  } from '@/utils/filters'
  export default {
    props: {
      lists: {
        type: Array
      }
    },
    data() {
      return {
        tableHeader: [{
          title: '订单编号',
          key: 'orders',
          minWidth: 220,
          render: (h, params) => {
            return h(
              'div',
              this.$refs.settledTable.$scopedSlots.orders({
                row: params.row
              })
            )
          }
        }]
      }
    },
    methods: {
  
    }
  }
</script>

<style lang='less' scoped>
  
</style>