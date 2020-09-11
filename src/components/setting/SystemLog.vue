<template>
  <div>

    <el-button type="primary" @click="location()" icon="el-icon-location-information" circle
               style="position: fixed;left: 10px;top: 20px;" :style="scroll?'':'background-color:#a9cffb;'"/>
    <el-button type="danger" @click="clearTerminal()" icon="el-icon-delete" circle style="position: fixed;top: 70px;"/>

    <div id="log-container"
         style="width: 100%; height: 1100px; overflow-y: scroll; background: #0f1521; color: #aaaaaa; padding: 10px;">
      <div>
      </div>
    </div>
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
        scroll: true
      }
    }, methods: {
      location() {
        this.scroll = !this.scroll;
        if (this.scroll) {
          let logContainer = $('#log-container');
          logContainer.scrollTop(logContainer[0].scrollHeight);
        }
      },
      clearTerminal() {
        $("#log-container div").html("");
      },
      openSocket() {
        if (this.stompClient == null) {
          const socket = new SockJS(this.$requestBaseURL + 'websocket');
          this.stompClient = Stomp.over(socket);
          this.stompClient.debug = null;
          this.stompClient.connect({}, () => {
            this.stompClient.subscribe('/consoleLog', (event)=> {
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
                .append('&nbsp;&nbsp;<span style="color: #cd00cd;">' + content.currentPID + '</span>')
                .append('&nbsp;&nbsp;---&nbsp;&nbsp;[')
                .append(content.threadName)
                .append(']&nbsp;&nbsp;')
                .append('<span style="color: rgb(57,111,140);">' + content.loggerName + '</span>')
                .append('&nbsp;&nbsp;：&nbsp;&nbsp;')
                .append('<span style="color: rgb(210,213,219);">' + content.body.toString().replace(/(\r\n|\n|\r)/gm, "<br />") + '</span>')
                .append('<br/>');
              if (this.scroll) {
                let logContainer = $('#log-container');
                logContainer.scrollTop(logContainer[0].scrollHeight);
              }
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
      // 检测滚动事件
      const scrollFunc = (e) => {
        e = e || window.event;
        if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件
          if (e.wheelDelta > 0) { //当滑轮向上滚动时
            this.scroll = false;
          }
          if (e.wheelDelta < 0) { //当滑轮向下滚动时

          }
        } else if (e.detail) { //Firefox滑轮事件
          if (e.detail > 0) { //当滑轮向上滚动时
            this.scroll = false;
          }
          if (e.detail < 0) { //当滑轮向下滚动时

          }
        }
        // 滚动条到最下面
        let logContainer = $('#log-container');
        if (logContainer.height() + logContainer[0].scrollTop + 20 >= logContainer[0].scrollHeight) {
          this.scroll = true;
        }
      };
      //给页面绑定滑轮滚动事件 firefox
      if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
      }
      //滚动滑轮触发scrollFunc方法 ie 谷歌
      window.onmousewheel = document.onmousewheel = scrollFunc;
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

  * {
    padding: 0;
    margin: 0;
  }

  .el-card {
    border: none;
  }
</style>
