<template>
    <div class="page-inner">
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">订单编号</Col>
            <Col class-name="col" span="4">客户名称</Col>
            <Col class-name="col" span="4">下单日期</Col>
            <Col class-name="col" span="3">下单金额</Col>
            <Col class-name="col" span="3">实单金额	</Col>
            <Col class-name="col" span="3">状态	</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <div v-for="(items ,idx) in list" :key="idx">
          <div class="settle-info">
            <Button type="warning" class="okSettled" style="margin-left:10px;" size="small" @click="print(items)">打印</Button>
            <span class="pointer cell" @click="toggleItem(items,idx)"><Icon :type="items.isShow ? 'ios-arrow-down':'ios-arrow-forward'" /></span>
            <span class="cell">结算单号：{{items.id}}</span>
            <span class="cell">结算日期：{{items.createTime | dateformat}}</span>
            <span class="cell">结算金额：￥{{items.totalPrice}}</span>
          </div>
          <Row class="row-body" v-for="(item,index) in items.orders" :key="index">
            <div v-show="items.isShow">
            <Col class-name="col" span="4">{{item.id}}</Col>
            <Col class-name="col" span="4">{{item.customerName}}</Col>
            <Col class-name="col" span="4">{{item.newOrderDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col class-name="col" span="3">￥{{item.amount}}</Col>
            <Col class-name="col" span="3">￥{{item.realAmount}}</Col>
            <Col class-name="col" span="3">{{item.settlementStatus | settlementStatus}}</Col>
            <Col class-name="col" span="3">
              <Button type="success" size="small" style="margin-right:8px;" @click="detail(item)">查看</Button>
              <Button type="warning" size="small"  @click="updateId(item)">更新结算单号</Button>
            </Col>
            </div>
          </Row>
          </div>
        </div>
      </div>
      <Modal title="订单详情" width="1000" v-model="show" :mask-closable="false">
      <detailPage :order="detailItem" :logList="logList"></detailPage>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
    </div>
    </Modal>
    <Modal title="更新结算单号" width="500" v-model="updateShow" :mask-closable="false">
      <Form ref="formCancel" :model="updateApi" :rules="updateRule" :label-width="100">
        <FormItem label="结算单号：" prop="settlementId">
          <Input v-model="updateApi.settlementId" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="updateSubmit('formCancel')" :loading="loading">确认</Button>
        <Button @click="updateReset('formCancel')">取消</Button>
      </div>
    </Modal>
    </div>
</template>

<script>
  import {
    dateformat,
    settlementStatus
  } from '@/utils/filters'
  import detailPage from './detailPage.vue'
  export default {
    components: {
      detailPage
    },
    props: {
      lists: {
        type: Array
      }
    },
    data() {
      return {
        isCancel: false,
        updateApi: {
          orderId: '',
          settlementId: ''
        },
        updateRule: {
          settlementId: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        loading: false,
        show: false,
        detailItem: {},
        updateShow: false,
        logList: [],
        list: []
      }
    },
    watch:{
      lists(val){
        this.list = [...val]
      }
    },
    // computed: {
    //   listData() {
    //     let arr = [];
    //     if (this.lists) {
    //       this.lists.map(el => {
    //         el._expanded = true;
    //         arr.push(el)
    //       })
    //     }
    //     return arr;
    //   }
    // },
    methods: {
      /// 展开收起
      toggleItem(item,idx){
        this.list[idx].isShow = !this.list[idx].isShow;
      },
      detail(item) {
        this.show = true;
        this.$http.post(this.$api.findOneOrder, {
          id: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = Object.assign({}, res.data)
          }
        })
        this.getLog(item)
      },
      getLog(item) {
        this.$http.post(this.$api.orderFeeHistory, {
          orderId: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.logList = res.data;
          }
        })
      },
      // 更新结算
      updateId(item) {
        this.updateShow = true;
        this.updateApi.orderId = item.id;
      },
      updateSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.updateApi);
            this.$http.post(this.$api.changeSettlementId, params).then(res => {
              if (res.code === 1000) {
                this.$emit('on-cancel', !this.isCancel)
                this.updateShow = false;
                this.$Message.success('更新成功');
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
          } else {
            this.$Message.error('结算单号不能为空')
          }
        })
      },
      updateReset(name) {
        Object.keys(this.updateApi).forEach(key => {
          this.updateApi[key] = '';
        })
        this.loading = false;
        this.updateShow = false;
        this.$refs[name].resetFields();
      },
      // 打印
      print(item) {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 18
                }
              }),
              h('div', '正在生成打印结算单...')
            ])
          }
        });
        this.$http.post(this.$api.settlementPrint, {
          settlementId: item.id
        }).then(res => {
          if (res.code === 1000) {
            window.open(res.data, '_blank')
            this.$Spin.hide();
          }
        })
      },
    }
  }
</script>

<style lang='less'>
  @import url('../../../../assets/less/base.less');
  .settle-info {
    border-bottom: 1px solid #e8eaec;
    text-align: left;
    .pointer{
      cursor: pointer;
    }
    span {
      &.cell{
      display: inline-block;
      margin-left: 20px;
      }
    }
  }
  .row-body{
    background-color: #f8f8f9;
  }
</style>