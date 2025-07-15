import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
export function getCloudFrontSignedUrl(key: string) {
  const privateKey = Buffer.from(process.env.CLOUDFRONT_PRIVATE_KEY_BASE64!, 'base64').toString('utf8');
  const signedUrl = getSignedUrl({
    url: `https://${process.env.CLOUDFRONT_DOMAIN}/${key}`,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
    privateKey: privateKey,
    dateLessThan: new Date(Date.now() + 60 * 60 * 1000), // 1時間有効
  });
  return signedUrl;
}
