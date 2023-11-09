const WebSocket = require('ws');

const clients = new Map(); // 存储客户端连接的Map

const wss = new WebSocket.Server({ port: 5566 }); // 指定WebSocket服務器監聽的端口號

wss.on('connection', (ws) => {
    console.log('新的WebSocket連接建立');

    // 監聽來自客戶端的訊息
    ws.on('message', (message) => {
        console.log(`收到訊息: ${message}`);
        // 在這裡可以對訊息進行處理

    });

    // 監聽WebSocket連接關閉事件
    ws.on('close', () => {
        console.log('WebSocket連接關閉');
        // clients.delete("123");
    });

    clients.set("123", ws);
    // console.log(clients);
    // 可以在這裡進行其他初始化的操作
});

// 將clients封裝在一個物件中，然後導出
const websocketUtil = {
    clients: clients,
    sendMessageToClient: function(clientId, message) {
        const client = this.clients.get(clientId);
        if (client) {
            client.send(message);
        } else {
            console.error('找不到指定的客户端');
        }
    },
    broadcast: function(message) {
        this.clients.forEach((client) => {
            client.send(message);
        });
    }
};

module.exports = websocketUtil;