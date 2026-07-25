import { supabase } from './supabaseClient';

const SIGNED_URL_TTL_SECONDS = 60;

// pdf_technical either holds a legacy public URL (pre-private-bucket uploads,
// starts with "http") or a technical-docs storage path (new uploads) — the
// latter requires an authenticated signed URL since the bucket is private.
export const resolveTechnicalFileUrl = async (pathOrUrl: string): Promise<string | null> => {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;

  const { data, error } = await supabase.storage
    .from('technical-docs')
    .createSignedUrl(pathOrUrl, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error('Error creating signed URL for technical file:', error.message);
    return null;
  }
  return data.signedUrl;
};
