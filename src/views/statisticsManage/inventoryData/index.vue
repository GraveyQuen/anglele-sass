<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="库存货品报表">
      <Form :mode="pageApi" :label-width="0" inline>
        <FormItem>
          <Input v-model="pageApi.produtName" style="width: 200px;" placeholder="请输入产品名称"></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <Table width="100%" ref="productTable" border :columns="tableHeader" :data="list">
          <template slot="wareHouse" slot-scope="props">
          <div v-for="(item,index) in props.row.wareHouse" :key="index">
            <div :class="item.warn ? 'warn-active':''">{{item.wareHouse}}:{{item.num}}{{item.unit}}</div>
          </div>
          </template>
        </Table>
        <div class="paging">
          <Page class="page-count" size="small" @on-page-size-change="changeSize" show-sizer show-elevator :total="totalCount" show-total :current="pageApi.pageIndex" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal title="查看图表" width="900" v-model="show" :mask-closable="false">
      <wareHouseCharts v-if="show" :id="productId"></wareHouseCharts>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import wareHouseCharts from './parts/wareHouseCharts'
  export default {
    components: {
      wareHouseCharts
    },
    data() {
      return {
        pageApi: {
          produtName: '',
          pageIndex: 1,
          pageSize: 10
        },
        productId: '',
        list: [],
        totalCount: 0,
        show: false,
        tableHeader: [{
          title: '产品名称',
          key: 'productName'
        }, {
          title: '所属分类',
          key: 'categoryName'
        }, {
          title: '售价',
          key: 'price',
          render: (h, params) => {
            let str = `${params.row.price}/${params.row.unit}`;
            return h('span', str)
          }
        }, {
          title: '库存总数',
          key: 'total',
          render: (h, params) => {
            let str = `${params.row.total}${params.row.unit}`;
            return h('span', str)
          }
        }, {
          title: '仓库',
          key: 'wareHouse',
          render: (h, params) => {
            return h(
              'div',
              this.$refs.productTable.$scopedSlots.wareHouse({
                row: params.row
              })
            )
          }
        }, {
          title: '库存预警',
          key: 'warnNum',
          render: (h, params) => {
            let str = params.row.warnNum != '' ? `${params.row.warnNum}${params.row.unit}` : `0${params.row.unit}`;
            return h('span', str)
          }
        }, {
          title: '下单未确认数量',
          key: 'num',
          render: (h, params) => {
            let str = params.row.num!= '' ? `${params.row.num}${params.row.unit}` : `0${params.row.unit}`;
            return h('span', str)
          }
        }, {
          title: '预计补货量',
          key: 'preNum',
          render: (h, params) => {
            let str = `${params.row.preNum}${params.row.unit}`;
            return h('span', str)
          }
        }, {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.detail(params.row)
                  }
                }
              }, '查看图表'),
            ]);
          }
        }]
      }
    },
    computed: {
      pageFilter() {
        return {
          produtName: this.pageApi.produtName,
          pageIndex: this.pageApi.pageIndex,
          pageSize: this.pageApi.pageSize
        }
      }
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          this.getList(this.pageFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      changePage(page) {
        this.pageApi.pageIndex = page;
      },
      changeSize(size){
        this.pageApi.pageSize = size;
      },
      getList(params) {
        this.$http.post(this.$api.productWareHouse, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      resetFilter() {
        this.pageApi.produtName = '';
      },
      detail(item) {
        this.productId = item.productId;
        this.show = true;
      }
    },
    created() {
      this.getList(this.pageFilter)
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .warn-active{
    color: rgb(237, 64, 20);
  }
</style>