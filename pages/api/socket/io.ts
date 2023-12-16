import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
	api: {
		bodyParser: false,
	},
};

//^ Socket.IO server instance is attached to the HTTP server
//^ and listens for incoming requests on the /api/socket/io path.
//^ The server instance is then attached to the res.socket.server.io property
//^ so that it can be accessed in the route handler.

//1. The HTTP server is created and attached to the Next.js server instance.
//2. The Socket.IO server is created and attached to the HTTP server.
//3. The Socket.IO server is attached to the res.socket.server.io property.
//4. The Socket.IO server listens for incoming requests on the /api/socket/io path.
//5. The Socket.IO server is attached to the HTTP server.
//6. The HTTP server is attached to the Next.js server instance.

/**
 * 
This is the main handler function for the Socket.IO server. It ensures that the Socket.IO server instance is attached to the HTTP server, and it handles incoming requests to the /api/socket/io route.
if (!res.socket.server.io) checks whether the Socket.IO server instance is already attached to the HTTP server. If not, it proceeds to set it up.
const path = "/api/socket/io"; defines the route at which the Socket.IO server will be available.
const httpServer: NetServer = res.socket.server as any; retrieves the HTTP server instance from the response socket.
const io = new ServerIO(httpServer, { path: path, addTrailingSlash: false }); creates a new instance of the Socket.IO server and configures it with the specified path and options.
res.socket.server.io = io; attaches the Socket.IO server instance to the HTTP server for future requests.
res.end(); ends the response. This route doesn't send any data in the response body, so it's sufficient to end the response here.
 */
const ioHandler = (req:NextApiRequest, res:NextApiResponseServerIo) => {
  
  if(!res.socket.server.io)
  {
    const path = "/api/socket/io";
    const httpServer : NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer,{
      path : path,
      addTrailingSlash : false
    })
    res.socket.server.io = io ;
  }

  res.end();
}

export default ioHandler;