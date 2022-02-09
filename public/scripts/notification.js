const socket = io();
      socket.on("notification",msg =>{
        $.notify("New Request \n"+msg.message+"\n\nFrom: "+msg.name,{
            autoHide:false,
            className:"success"
        })
      })