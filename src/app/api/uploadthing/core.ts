import * as z from "zod";

import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        
        .input(z.object({ 
            configId: z.string().optional(),
        }))

        .middleware(async ({ req, res, input }) => {        
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { input: input };
        })

        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete configId:", metadata.input);
            console.log("file url", file.url);
        
            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            const { configId } = metadata.input
            
            return { configId }
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;