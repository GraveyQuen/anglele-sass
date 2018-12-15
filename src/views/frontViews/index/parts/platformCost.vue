<template>
  <div class="platform-cost">
    <div class="platform-cost-main">
      <div class="title">平台使用费用</div>
      <div class="price-main">
        <div class="price-main-item">
          <div class="price-main-item-title">基础版</div>
          <div class="price-main-item-main">
            <div class="price-main-item-main-cell">
              <div class="cell-title">使用费</div>
              <div class="cell-price green">19800元</div>
            </div>
            <div class="price-main-item-main-cell">
              <div class="cell-title">维护费</div>
              <div class="cell-price green">5800/年</div>
            </div>
          </div>
          <div class="price-main-item-btn">
            <router-link to="/pricing">服务功能</router-link>
          </div>
        </div>
        <div class="price-main-item">
          <div class="price-main-item-title">旗舰版</div>
          <div class="price-main-item-main">
            <div class="price-main-item-main-cell">
              <div class="cell-title">使用费</div>
              <div class="cell-price orange">158000元</div>
            </div>
            <div class="price-main-item-main-cell">
              <div class="cell-title">维护费</div>
              <div class="cell-price orange">12000/年</div>
            </div>
          </div>
          <div class="price-main-item-btn">
            <router-link to="/pricing" class="orange">服务功能</router-link>
          </div>
        </div>
      </div>
      <div class="btn">
        <a @click="showTest" href="javascript:;">免费体验</a>
      </div>
    </div>
    <Modal
      title="免费体验"
      width="500"
      v-model="show"
      @on-cancel="close('formModel')"
      :mask-closable="false"
    >
      <Form ref="formModel" :model="applyApi" :rules="rule" :label-width="100">
        <Alert type="success">提交后我们工作人员会尽快和您联系。</Alert>
        <FormItem label="姓名：" prop="userName">
          <Input v-model="applyApi.userName" placeholder="姓名"></Input>
        </FormItem>
        <FormItem label="联系方式：" prop="userContact">
          <Input v-model="applyApi.userContact" placeholder="联系方式"></Input>
        </FormItem>
        <FormItem label="留言内容：" prop="userRemark">
          <Input
            v-model="applyApi.userRemark"
            type="textarea"
            :rows="4"
            :maxlength="500"
            placeholder="请在此输入留言内容，我们会尽快与您联系。"
          ></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submit('formModel')" :loading="loading">提交</Button>
        <Button @click="close('formModel')">取消</Button>
      </div>
    </Modal>
    <quickNvigation @on-change="quickChange"></quickNvigation>
  </div>
</template>

<script>
import quickNvigation from "./quickNvigation";
export default {
  components: {
    quickNvigation
  },
  data() {
    return {
      show: false,
      applyApi: {
        userName: "",
        userContact: "",
        userRemark: ""
      },
      loading: false,
      rule: {
        userName: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        userContact: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ],
        userRemark: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    quickChange(data) {
      if (data) this.show = true;
    },
    showTest() {
      this.show = true;
    },
    submit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.loading = true;
          let params = this.$clearData(this.applyApi);
          this.$http.post(this.$api.applySaas, params).then(res => {
            if (res.code === 1000) {
              this.show = false;
              this.applyApi.userName = "";
              this.applyApi.userContact = "";
              this.$Modal.success({
                title: "提交成功",
                content: "我们工作人员会尽快和您联系"
              });
            } else {
              this.$Message.error(res.message);
            }
            this.loading = false;
          });
        } else {
          this.$Message.error("表单验证失败");
        }
      });
    },
    close(name) {
      this.applyApi.userName = "";
      this.applyApi.userContact = "";
      this.applyApi.userRemark = "";
      this.show = false;
      this.loading = false;
      this.$refs[name].resetFields();
    }
  }
};
</script>

<style lang='less' scoped>
.platform-cost {
  position: relative;
  height: 700px;
  background: url("https://resource.anglele.com/saas/static/platform-cost-bg.png");
  .platform-cost-main {
    position: absolute;
    top: 80px;
    left: calc(50% - 300px);
    width: 600px;
    .title {
      text-align: center;
      font-size: 36px;
      color: #fff;
    }
    .price-main {
      position: relative;
      margin: 36px 0 70px;
      background-color: rgba(0, 0, 0, 0.7);
      height: 300px;
      display: flex;
      &::after {
        content: "";
        position: absolute;
        top: 5px;
        left: calc(50% - 1px);
        width: 2px;
        height: 295px;
        background-color: rgba(255, 255, 255, 0.5);
      }
      .price-main-item {
        flex: 1;
        &:first-child {
          border-top: 5px solid #23d5c0;
        }
        &:last-child {
          border-top: 5px solid #ff743d;
        }
      }
      .price-main-item-title {
        font-size: 24px;
        color: #fff;
        text-align: center;
        padding: 40px 0 45px;
      }
      .price-main-item-main {
        display: flex;
        .price-main-item-main-cell {
          flex: 1;
          text-align: center;
          &:first-child {
            border-right: 1px solid rgba(255, 255, 255, 0.5);
          }
          .cell-title {
            font-size: 16px;
            color: #fff;
            margin-bottom: 20px;
          }
          .cell-price {
            font-size: 24px;
            &.green {
              color: #23d5c0;
            }
            &.orange {
              color: #ff6326;
            }
          }
        }
      }
    }
    .price-main-item-btn {
      text-align: center;
      padding-top: 30px;
      a {
        text-align: center;
        display: inline-block;
        width: 100px;
        height: 24px;
        color: #fff;
        text-align: center;
        line-height: 24px;
        font-size: 14px;
        background: linear-gradient(
          90deg,
          rgba(106, 225, 255, 1) 0%,
          rgba(22, 208, 255, 1) 100%
        );
        border-radius: 12px;
        &.orange {
          background: linear-gradient(
            90deg,
            rgba(255, 160, 123, 1) 0%,
            rgba(255, 111, 54, 1) 100%
          );
        }
      }
    }
    .btn {
      text-align: center;
      a {
        display: inline-block;
        width: 300px;
        height: 60px;
        color: #fff;
        line-height: 60px;
        text-align: center;
        font-size: 24px;
        background: linear-gradient(
          90deg,
          rgba(255, 99, 38, 1) 0%,
          rgba(240, 141, 103, 1) 100%
        );
        border-radius: 30px;
      }
    }
  }
}
</style>