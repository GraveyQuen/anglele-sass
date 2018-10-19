<template>
  <div class="page-box">
    <Form v-if="userInfo" ref="formModel" :model="dataApi" :rules="rule" :label-width="100" style="max-width: 400px;">
      <FormItem label="账号：">
        {{userInfo.phone}}
      </FormItem>
      <FormItem label="用户名：">
        {{userInfo.userName}}
      </FormItem>
      <FormItem label="新密码：" prop="newPassword">
        <Input v-model="dataApi.newPassword" type="password" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="确认新密码：" prop="newPasswordAgain">
        <Input v-model="dataApi.newPasswordAgain" type="password" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="reset('formModel')">修改密码</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import * as types from "@/store/types";
export default {
  data() {
    return {
      dataApi: {
        newPassword: "",
        newPasswordAgain: ""
      },
      rule: {
        newPassword: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur"
          }
        ],
        newPasswordAgain: [
          {
            required: true,
            message: "确认新密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.base.loginInfo;
    }
  },
  methods: {
    ...mapActions(["loginOut"]),
    reset(name) {
      let _this = this;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.dataApi.newPassword === this.dataApi.newPasswordAgain) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            params.newPassword = this.$md5(params.newPassword);
            params.newPasswordAgain = this.$md5(params.newPasswordAgain);
            this.$http.post(this.$api.changePass, params).then(res => {
              if (res.code === 1000) {
                this.$Modal.success({
                  title: "修改密码",
                  content: "密码修改成功，请重新登录",
                  onOk() {
                    _this.$store.commit(types.LOGOUT);
                    window.location.href = "/login";
                  }
                });
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            });
          } else {
            this.$Message.error("两次密码输入不一致");
          }
        } else {
          this.$Message.error("表单验证失败");
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.page-box {
  border: 1px solid #dae2e8;
  border-radius: 5px;
  background: #fff;
  position: relative;
  padding: 20px;
}
</style>