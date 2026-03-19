import ResetPasswordForm from './ResetPasswordForm';

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordFormPage({ params }: PageProps) {
  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}
