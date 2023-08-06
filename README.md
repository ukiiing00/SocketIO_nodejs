# Zoom

Zoom Clone

### app.listen() vs server.listen()
Express 모듈을 사용하여 app.listen()을 실행하게 되면, Express는 자체적으로 http.createServer() 기능을 수행합니다. 다만, 최종적으로 반환되는 인스턴스는 http 객체 자체가 아닌 그 일부(컴포넌트?)입니다. 반면, http.createServer()는 http 인스턴스 자체를 반환합니다, Websocket처럼 Socket을 이용하고자 할 때는 이 http(또는 https) 인스턴스 자체가 필요하므로, 여기서는 Express가 아닌 내장 api인 http를 사용한 것 같습니다.

### WebSocket
client : https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

server : https://www.npmjs.com/package/ws

