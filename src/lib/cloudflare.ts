// FILE: src/lib/cloudflare.ts
export interface CloudflareConfig {
  accountId: string;
  r2BucketName: string;
  r2AccessKeyId: string;
  r2SecretAccessKey: string;
  r2PublicUrl: string;
}

export class CloudflareR2 {
  private config: CloudflareConfig;

  constructor(config: CloudflareConfig) {
    this.config = config;
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url;
  }

  getPublicUrl(key: string): string {
    return `${this.config.r2PublicUrl}/${key}`;
  }
}

export const cloudflareConfig: CloudflareConfig = {
  accountId: import.meta.env.CLOUDFLARE_ACCOUNT_ID || '',
  r2BucketName: import.meta.env.R2_BUCKET_NAME || '',
  r2AccessKeyId: import.meta.env.R2_ACCESS_KEY_ID || '',
  r2SecretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY || '',
  r2PublicUrl: import.meta.env.R2_PUBLIC_URL || ''
};