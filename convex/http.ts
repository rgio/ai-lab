import { httpRouter } from 'convex/server';
import { handleReplicateWebhook } from './music';
import { generateUploadUrl, getFile } from './files';

const http = httpRouter();
http.route({
  path: '/replicate_webhook',
  method: 'POST',
  handler: handleReplicateWebhook,
});

http.route({
  path: '/generate_upload_url',
  method: 'GET',
  handler: generateUploadUrl,
});

http.route({
  path: '/get_file',
  method: 'GET',
  handler: getFile,
});

export default http;
