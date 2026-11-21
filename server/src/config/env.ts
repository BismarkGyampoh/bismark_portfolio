import 'dotenv/config';
import { z } from 'zod';

/**
 * Validates environment configuration at startup.
 * No real credentials are hardcoded. Provide values via .env (not committed).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().optional(),
  DATABASE_URL: z.string().min(1).optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SUPABASE_STORAGE_BUCKET: z.string().regex(/^[a-z0-9][a-z0-9._-]{1,61}[a-z0-9]$/).default('portfolio-assets'),
  COOKIE_SECURE: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  TRUSTED_ORIGINS: z.string().optional(),
}).superRefine((config, context) => {
  if (config.SUPABASE_URL) {
    const storageUrl = new URL(config.SUPABASE_URL);
    if (
      !['http:', 'https:'].includes(storageUrl.protocol) ||
      storageUrl.username ||
      storageUrl.password ||
      storageUrl.pathname !== "/" ||
      storageUrl.search ||
      storageUrl.hash
    ) {
      context.addIssue({
        code: 'custom',
        path: ['SUPABASE_URL'],
        message: 'Must be the Supabase project HTTP(S) URL, without credentials or a path; do not use DATABASE_URL.',
      });
    }
  }

  if (config.NODE_ENV !== 'production') return;

  if (!config.CLIENT_URL) {
    context.addIssue({ code: 'custom', path: ['CLIENT_URL'], message: 'Required in production' });
  }
  if (!config.DATABASE_URL) {
    context.addIssue({ code: 'custom', path: ['DATABASE_URL'], message: 'Required in production' });
  }
  if (Boolean(config.SUPABASE_URL) !== Boolean(config.SUPABASE_SERVICE_ROLE_KEY)) {
    context.addIssue({
      code: 'custom',
      path: ['SUPABASE_SERVICE_ROLE_KEY'],
      message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured together',
    });
  }
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  console.error(`[env] Invalid environment configuration: ${issues}`);
  process.exit(1);
}

const clientUrl = parsed.data.CLIENT_URL ?? 'http://localhost:5173';
const trustedOrigins = (parsed.data.TRUSTED_ORIGINS ?? clientUrl)
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT,
  clientUrl,
  databaseUrl: parsed.data.DATABASE_URL ?? '',
  supabaseUrl: parsed.data.SUPABASE_URL ? new URL(parsed.data.SUPABASE_URL).origin : '',
  supabaseServiceRoleKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY ?? '',
  supabaseStorageBucket: parsed.data.SUPABASE_STORAGE_BUCKET,
  isProduction: parsed.data.NODE_ENV === 'production',
  cookieSecure: parsed.data.COOKIE_SECURE || parsed.data.NODE_ENV === 'production',
  trustedOrigins,
};
