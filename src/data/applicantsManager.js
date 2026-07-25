import { supabase, isSupabaseConfigured } from '../supabaseClient';

const RESUME_BUCKET = 'applicant-resumes';

// job_applications is protected by row-level security (see supabase_applicants.sql):
// reads/updates/deletes require a real Supabase session whose JWT carries
// app_metadata.role = 'admin'. PostgREST does not report a permission error for
// those policies — it silently returns an empty result / affects zero rows — so
// an empty response is only meaningful once we know the caller really is an admin.
const describeAccessProblem = async () => {
  if (!isSupabaseConfigured) {
    return 'This build has no Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the deployment environment and redeploy.';
  }

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return 'Not signed in to Supabase. You are using the offline fallback login, which has no Supabase session, and job applications are only readable by an authenticated admin. Sign in with your Supabase admin account.';
  }

  if (session.user?.app_metadata?.role !== 'admin') {
    return `The signed-in account (${session.user?.email || 'unknown'}) is not marked as an admin, so Supabase hides all job applications. Grant it the admin role in app_metadata.`;
  }

  return null;
};

export const getAllApplicants = async () => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  if (!data || data.length === 0) {
    const problem = await describeAccessProblem();
    if (problem) throw new Error(problem);
  }

  return data || [];
};

export const updateApplicantStatus = async (id, status) => {
  // .select() makes the response report which rows were actually updated;
  // without it an RLS-blocked update looks identical to a successful one.
  const { data, error } = await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');

  if (error) throw error;

  if (!data || data.length === 0) {
    const problem = await describeAccessProblem();
    throw new Error(problem || 'The application no longer exists.');
  }
};

export const deleteApplicant = async (applicant) => {
  const paths = [applicant.resume_path, applicant.cover_letter_path].filter(Boolean);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(RESUME_BUCKET).remove(paths);
    if (storageError) console.error('Failed to delete applicant files from storage:', storageError);
  }

  const { data, error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', applicant.id)
    .select('id');

  if (error) throw error;

  if (!data || data.length === 0) {
    const problem = await describeAccessProblem();
    throw new Error(problem || 'The application no longer exists.');
  }
};

// Resumes live in a private bucket, so files are accessed via short-lived signed URLs.
export const getApplicantFileUrl = async (path) => {
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).createSignedUrl(path, 600);
  if (error) {
    const problem = await describeAccessProblem();
    throw new Error(problem || error.message);
  }
  return data.signedUrl;
};
