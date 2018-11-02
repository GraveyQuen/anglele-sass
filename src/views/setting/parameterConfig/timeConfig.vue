<template>
  <div class="page-inner">
    <Card :bordered="true" dis-hover title="接单时间配置">
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">开始时间</Col>
            <Col class-name="col" span="6">结束时间</Col>
            <Col class-name="col" span="6">状态</Col>
            <Col class-name="col" span="6">操作</Col>
          </Row>
          <Row>
            <Col class-name="col" span="6">{{item.openTime}}</Col>
            <Col class-name="col" span="6">{{item.closeTime}}</Col>
            <Col class-name="col" span="6">{{item.status === 0 ? '禁用':'启用'}}</Col>
            <Col class-name="col" span="6">
            <Button type="warning" size="small" @click="openPanel">编辑</Button>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
    <Modal title="编辑接单时间" @on-cancel="reset('formModel')" width="500" v-model="show" :mask-closable="false">
      <Form ref="formModel" :model="dataApi" :rules="rule" :label-width="100">
        <FormItem label="时间：">
          <TimePicker type="time" v-model="timeValue[0]" confirm placeholder="开始时间" style="width: 148px;display:inline-block"></TimePicker>
          <span class="split"></span>
          <TimePicker type="time" v-model="timeValue[1]" confirm placeholder="结束时间" style="width: 148px;display:inline-block"></TimePicker>
        </FormItem>
        <FormItem label="状态：">
          <RadioGroup v-model="dataApi.status">
            <Radio v-for="(st,index) in [{id:0,name:'禁用'},{id: 1,name: '启用'}]" :key="index" :label="st.id">
              <span>{{st.name}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit" :loading="loading">保存</Button>
        <Button @click="reset('formModel')">取消</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateFormat
  } from '@/utils/filters'
  export default {
    data() {
      return {
        item: {},
        dataApi: {
          openTime: '',
          closeTime: '',
          status: 0
        },
        timeValue: ['', ''],
        show: false,
        loading: false,
        rule: {}
      }
    },
    methods: {
      getData() {
        this.$http.post(this.$api.findShopTime).then(res => {
          if (res.code === 1000) {
            this.item = Object.assign({}, res.data)
          }
        })
      },
      clearApi() {
        this.dataApi = {
          openTime: '',
          closeTime: '',
          status: 0
        }
        this.timeValue = ['', '']
        this.show = false;
      },
      openPanel() {
        this.show = true;
        this.dataApi.status = this.item.status;
        this.timeValue[0] = this.item.openTime;
        this.timeValue[1] = this.item.closeTime;
      },
      submit(name) {
        let params = this.$clearData(this.dataApi);
        params.openTime = this.timeValue[0];
        params.closeTime = this.timeValue[1];
        this.$http.post(this.$api.modifyShopTime, params).then(res => {
          if (res.code === 1000) {
            this.clearApi()
            this.getData();
            this.$Message.success('修改成功');
          } else {
            this.$Message.error(res.message)
          }
        })
      },
      reset(name) {
        this.clearApi()
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .split{
    display: inline-block;
    height: 1px;
    width: 6px;
    background-color: #e6e6e6;
    margin: 0 5px;
    vertical-align: middle;
  }
</style>