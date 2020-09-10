<template>
  <div>
    <el-card class="box-card" :body-style="{ padding: '0px 0.5px' }">
      <div slot="header" class="box-card-header">
        <span>系统日志</span>
      </div>
      <div id="log-container"
           style="width: 100%; height: 1100px; overflow-y: scroll; background: #0f1521; color: #aaaaaa; padding: 10px;">
        <div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>

  import SockJS from "sockjs-client";
  import Stomp from "stompjs";

  export default {
    name: "SystemLog",
    data() {
      return {
        stompClient: null,
      }
    }, methods: {
      openSocket() {
        if (this.stompClient == null) {
          const socket = new SockJS(this.$requestBaseURL + 'websocket');
          this.stompClient = Stomp.over(socket);
          this.stompClient.debug = null;
          this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/consoleLog', (event) => {
              const content = JSON.parse(event.body);
              const level = content.level;
              let levelStyle = '<span>' + level + '</span>';
              if (level === 'INFO') {
                levelStyle = '<span style="color: rgb(54,165,141);">' + level + '</span>';
              }
              if (level === 'WARN') {
                levelStyle = ' <span style="color: rgb(247,197,124);">' + level + '</span>';
              }
              if (level === 'ERROR') {
                levelStyle = '<span style="color: rgb(206,71,58);">' + level + '</span>';
              }
              $("#log-container div")
                .append(content.timestamp)
                .append('&nbsp;&nbsp;&nbsp;')
                .append(levelStyle)
                .append('&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;[')
                .append(content.threadName)
                .append(']&nbsp;&nbsp;')
                .append('<span style="color: rgb(57,111,140);">' + content.loggerName + '</span>')
                .append('&nbsp;&nbsp;：&nbsp;&nbsp;')
                .append('<span style="color: rgb(210,213,219);">' + content.body.toString().replace(/(\r\n|\n|\r)/gm, "<br />") + '</span>')
                .append('<br/>');
              console.log(content);
            });
          });
        }
      },
      closeSocket() {
        if (this.stompClient != null) {
          this.stompClient.disconnect();
          this.stompClient = null;
        }
      }
    }, mounted() {
      this.openSocket();
    },
    beforeDestroy() {
      this.closeSocket();
    }
  }
</script>

<style scoped>
  .box-card-header {
    margin-top: -20px;
    line-height: 46px;
    height: 24px;
  }
</style>
