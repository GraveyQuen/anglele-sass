<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover :title="isEdit ? '编辑采购单':'新增采购单'">
      <Button type="primary" slot="extra" @click="save" class="extra-button" style="margin-right:15px;">保存</Button>
      <Button slot="extra" class="extra-button" @click="goBack">取消</Button>
      <Form :mode="dataApi" :label-width="100" inline>
        <FormItem label="采购员：">
          <Select v-model="dataApi.operatePerson" style="width: 200px;">
                      <Option v-for="(item,index) in pruMan" :value="item.name" :key="index">{{ item.name }}</Option>
                    </Select>
        </FormItem>
        <FormItem label="联系方式：">
          <Input v-model="dataApi.operatePersonPhone" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label="开单日期：">
          <DatePicker type="date" placeholder="选择日期" placement="bottom-end" v-model="dataApi.purchaseDate" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="dataApi.remark" placeholder="请输入" style="width: 200px;"></Input>
        </FormItem>
      </Form>
      <div class="order-main">
        <div class="order-main-header">今日订单明细
          <Button size="small" @click="refresh" style="margin-left: 20px;" class="extra-button">刷新今日订单</Button>
        </div>
        <Form :mode="orderApi" :label-width="100" inline>
          <FormItem label="订单编号：">
            <Input v-model="orderApi.id" placeholder="请输入" style="width: 200px;"></Input>
          </FormItem>
          <FormItem label="客户名称：">
            <Input v-model="orderApi.customerName" placeholder="请输入" style="width: 200px;"></Input>
          </FormItem>
        </Form>
        <Table border ref="selection" @on-selection-change="selectOrder" border :columns="tableHeader" :data="orderList"></Table>
      </div>
    </Card>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters'
  export default {
    props: {
      isEdit: {
        type: Boolean,
        defaule: false
      },
      itemId: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        dataApi: {
          operatePerson: "",
          operatePersonPhone: "",
          purchaseDate: "",
          remark: "",
          orderIds: []
        },
        pruMan: [],
        date: '',
        serverTime: '',
        detailItem: {},
        orderApi: {
          id: '',
          customerName: '',
          checkIds: '',
          purchaseOrderId: this.isEdit ? this.itemId : ''
        },
        orderList: [],
        tableHeader: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '订单编号',
          key: 'id'
        }, {
          title: '客户名称',
          key: 'customerName'
        }, {
          title: '下单时间',
          key: 'updateTime',
          render: (h, params) => {
            return h('div', dateformat(params.row.updateTime))
          },
          minWidth: 120
        }]
      };
    },
    watch: {
      'pageFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.pageIndex == oldVal.pageIndex)
            this.orderApi.pageIndex = 1;
          this.getOrder(this.pageFilter);
        }, 200),
        deep: true
      },
      'dataApi.purchaseDate' (val) {
        if (val != '') {
          this.date = dateformat(val.getTime(), 'yyyy-MM-dd')
        }
      },
      'detailItem' (val) {
        if (val) {
          this.dataApi.purchaseDate = new Date(Date.parse(val.purchaseOrder.purchaseDate.replace(/-/g, "/")));
          this.dataApi.operatePerson = val.purchaseOrder.operatePerson;
          this.dataApi.operatePersonPhone = val.purchaseOrder.operatePersonPhone;
          this.dataApi.remark = val.purchaseOrder.remark;
          val.orders.map(item => {
            this.dataApi.orderIds.push(item.id)
            this.orderList.map((el, index) => {
              if (item.id === el.id) {
                el._checked = true;
                this.$refs.selection.$refs.tbody.objData[index]._isChecked = true;
              }
            })
          })
        }
      }
    },
    computed: {
      pageFilter() {
        return {
          id: this.orderApi.id,
          customerName: this.orderApi.customerName,
          checkIds: this.orderApi.checkIds,
          purchaseOrderId: this.isEdit ? this.itemId : ''
        }
      }
    },
    methods: {
      //  获取当前服务器时间
      currentTime() {
        this.$http.post(this.$api.serverTime).then(res => {
          if (res.code === 1000) {
            this.serverTime = new Date(res.data);
            if (!this.isEdit) {
              this.dataApi.purchaseDate = new Date(res.data);
            }
          }
        })
      },
      //  采购人列表
      getpruMan() {
        this.$http
          .post(this.$api.findDeliveryManList, {
            pageIndex: 1,
            pageSize: 10,
            manType: 2
          })
          .then(res => {
            if (res.code === 1000) {
              this.pruMan = res.data.data;
              if (!this.isEdit) {
                this.dataApi.operatePerson = this.pruMan[0].name;
                this.dataApi.operatePersonPhone = this.pruMan[0].phone;
              }
            }
          });
      },
      getOrder(params, isFresh) {
        this.$http.post(this.$api.pageForPurchase, params).then(res => {
          if (res.code === 1000) {
            this.orderList = res.data;
            if (isFresh) {
              this.$Message.success('刷新成功')
            }
          }
        })
      },
      selectOrder(data) {
        let arr = [];
        data.map(el => {
          arr.push(el.id)
        })
        this.dataApi.orderIds = [...arr]
      },
      save() {
        let params = this.$clearData(this.dataApi);
        params.orderIds = params.orderIds.toString();
        params.purchaseDate = params.purchaseDate != '' ? this.date : '';
        if (this.isEdit) {
          params.id = this.detailItem.purchaseOrder.id;
        }
        let paramsUrl = this.isEdit ? this.$api.updatePurchaseOrder : this.$api.addPurchaseOrder;
        if (this.dataApi.orderIds.length) {
          this.$http.post(paramsUrl, params).then(res => {
            if (res.code === 1000) {
              this.$Message.success('采购单创建成功');
              this.$router.push({
                name: 'purchasingList'
              })
            } else {
              this.$Message.error(res.message);
            }
          })
        } else {
          this.$Message.error('请选择订单')
        }
      },
      refresh() {
        this.getOrder(this.pageFilter, true);
        this.details();
      },
      details() {
        this.$http.post(this.$api.findPurchaseOrder, {
          id: this.itemId
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
      },
      goBack() {
        this.$router.push({
          name: 'purchasingList'
        })
      }
    },
    created() {
      this.getpruMan();
      this.currentTime()
      this.getOrder(this.pageFilter);
      if (this.isEdit) this.details();
    }
  };
</script>

<style lang='less' scoped>
  @import url("../../../../assets/less/base.less");
  .order-main-header {
    height: 46px;
    line-height: 46px;
    background-color: #f8f8f9;
    padding: 0 15px;
    margin-bottom: 15px;
    font-weight: 700;
  }
</style>