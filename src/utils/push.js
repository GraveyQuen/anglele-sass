export const MathRand = () => {
  let Num = "";
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num
}
export default {
  data() {
    return {
      isFocus: true,
      titleInit: document.title,
      stl: '',
      msg: '默认通知',
      isNotice: true
    }
  },
  methods: {
    initScoket() {
      let _this = this;
      let rand = localStorage._rand;
      if (rand == null) {
        rand = MathRand();
        localStorage._rand = rand;
      }
      let ws = new WebSocket(this.$api.ws);
      ws.onopen = function (evt) {
        // console.log("消息推送链接成功");
        let params = {
          userId: _this.$store.state.base.loginInfo.id,
          random: rand
        }
        params = JSON.stringify(params);
        ws.send(params);
      };

      ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data);
        _this.isNotice = false;
        _this.msg = data;
        _this.notify(data);
      };

      ws.onclose = function (evt) {
        console.log("Connection closed.");
        console.log("try to reConnection...")
        // 后台重启服务器，10秒后重连
        setTimeout(() => {
          if (_this.initScoket){
            _this.initScoket();
          }
        }, 10000)
      };

      if (window.Notification)
        Notification.requestPermission();

      //监听窗口关闭事件，窗口关闭前，主动关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
      // window.onbeforeunload = function () {
      //   ws.close();
      // };
    },
    notify(data) {
      let _this = this;
      let title = data.title;
      let body = data.body;
      let icon = `https://resource.anglele.com/saas/static/push_icon/${data.code}.png`
      if (window.Notification && Notification.permission == 'granted') {
        let notif = new Notification(title, {
          body: body, //通知的具体内容
          icon: icon,
          requireInteraction: true
        });
        notif.onclick = () => {
          // this.$router.push({
          //   name: code2Url(data.code)
          // })
          this.$router.push(JSON.parse(data.page));
          window.focus();
          notif.close();
        }
        this.isNotice = true;
      } else {
        if (this.isFocus) {
          this.$Notice.success({
            title: title,
            desc: body
          });
          this.isNotice = true;
        } else {
          this.stl = setInterval(function () {
            let title = document.title;
            if (/新/.test(title) == false) {
              document.title = '【你有新消息】' + _this.titleInit;
            } else {
              document.title = '【　　　　　】' + _this.titleInit;
            }
          }, 500);
        }
      }
    }
  }
}