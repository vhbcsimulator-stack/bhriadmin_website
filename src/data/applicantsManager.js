import { supabase } from '../supabaseClient';

const RESUME_BUCKET = 'applicant-resumes';

export const getAllApplicants = async () => {
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateApplicantStatus = async (id, status) => {
  const { error } = await supabase
    .from('job_applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
};

export const deleteApplicant = async (applicant) => {
  const paths = [applicant.resume_path, applicant.cover_letter_path].filter(Boolean);
  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage.from(RESUME_BUCKET).remove(paths);
    if (storageError) console.error('Failed to delete applicant files from storage:', storageError);
  }

  const { error } = await supabase.from('job_applications').delete().eq('id', applicant.id);
  if (error) throw error;
};

// Resumes live in a private bucket, so files are accessed via short-lived signed URLs.
export const getApplicantFileUrl = async (path) => {
  const { data, error } = await supabase.storage.from(RESUME_BUCKET).createSignedUrl(path, 600);
  if (error) throw error;
  return data.signedUrl;
};
