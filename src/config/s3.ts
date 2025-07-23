export const s3Config = {
  region: process.env.S3_REGION || 'us-east-1',
  accessKeyId: process.env.S3_ACCESS_KEY_ID || 'demo-access-key',
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'demo-secret-key',
  bucket: process.env.S3_BUCKET || 'demo-bucket',
  endpoint: process.env.S3_ENDPOINT || '', // אופציונלי
  local: process.env.NODE_ENV === 'development',
};

export function getStorageConfig() {
  if (s3Config.local) {
    return { type: 'local' };
  }
  return { type: 's3', ...s3Config };
} 