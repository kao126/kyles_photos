export const deviceTokens = new Set(process.env.ALLOWED_DEVICE_TOKENS?.split(',') ?? []);
