// import { v } from "convex/values";
// import { mutation } from "./_generated/server";
import { httpAction } from './_generated/server';
// import { internal } from "./_generated/api";

export const generateUploadUrl = httpAction(async (ctx, request) => {
  console.log(`GENERATING URL`);
  const url = await ctx.storage.generateUploadUrl();

  return new Response(url, {
    status: 200,
    headers: new Headers({
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      'Access-Control-Allow-Origin': '*',
      Vary: 'origin',
    }),
  });
});

export const getFile = httpAction(async (ctx, request) => {
  const { searchParams } = new URL(request.url);
  // This storageId param should be an Id<"_storage">
  const storageId = searchParams.get('storageId')!;
  const blob = await ctx.storage.get(storageId);
  if (blob === null) {
    return new Response('Image not found', {
      status: 404,
    });
  }
  return new Response(blob, {
    status: 200,
    headers: new Headers({
      // e.g. https://mywebsite.com, configured on your Convex dashboard
      'Access-Control-Allow-Origin': '*',
      Vary: 'origin',
    }),
  });
});

// export const saveStorageId = mutation({
//   // You can customize these as you like
//   args: {
//     uploaded: v.object({
//       storageId: v.string(),
//     }),
//     // other args...
//   },
//   handler: async (ctx, args) => {
//     // use `args` and/or `ctx.auth` to authorize the user
//     // ...

//     // Save the storageId to the database using `insert`
//     // ctx.db.insert("someTable", {
//     //   storageId: args.uploaded.storageId,
//     //   // ...
//     // });
//     // // or `patch`/`replace`
//     // ctx.db.patch(someId, {
//     //   storageId: args.uploaded.storageId,
//     //   // ...
//     // });
//   },
// });
