module.exports = {
    chatsocket : function (io,all_message,onlineuserar,totalsocket) {
        var chatroom = io.of('/chatserver').on('connection',function (socket) {
            console.log("Connection is establish on server side");
            totalsocket.push(socket)
            socket.emit('broadcast',JSON.stringify(all_message));

            socket.on('newmessage',function (data) {
                all_message.push(data)
                socket.broadcast.emit('broadcast',JSON.stringify(all_message));
                socket.emit('broadcast',JSON.stringify(all_message));
            });

            socket.on("newuserconnected",function (data) {
                var user = {
                            id: {'name':data.full_name,'pic':data.pic}
                           };
                onlineuserar.push(user);
                socket.broadcast.emit('onlineuser',JSON.stringify(onlineuserar))
                socket.emit('onlineuser',JSON.stringify(onlineuserar))
            })

            socket.on("disconnect",function () {
                var i = totalsocket.indexOf(socket);
                totalsocket.splice(i,1)
                // console.log(" index " + i);
                // console.log(" length " + onlineuserar.length);
                // console.log(onlineuserar)
                onlineuserar.splice(i,1)
                // console.log(onlineuserar)
                // console.log(onlineuserar.length);

            })

            socket.on("updatelist",function () {
                console.log("BROADCAST");
                console.log(onlineuserar)
                socket.broadcast.emit('onlineuser',JSON.stringify(onlineuserar))
                socket.emit('onlineuser',JSON.stringify(onlineuserar))
            })
        })



        
    }
}