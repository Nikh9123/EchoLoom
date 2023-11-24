import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs"; 

const f = createUploadthing();

const handleAuth = () => {
  const {userId} = auth() ;
  if (!userId) throw new Error("Unauthorized");
  return {userId : userId} ;
}

 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage : f({image:{maxFileSize: "4MB", maxFileCount:1}})
  .middleware(()=> handleAuth())
  .onUploadComplete(()=>{console.log("server image upload complete")}),
  
  messageFile : f(["image", "pdf","audio","video"])
  .middleware(()=> handleAuth())
  .onUploadComplete(()=>{console.log("message upload complete")})
  
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;