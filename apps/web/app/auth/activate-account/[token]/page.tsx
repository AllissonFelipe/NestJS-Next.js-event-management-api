import ActivateAccountForm from "./ActivateAccountForm";

interface PageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ActivateAccountPage({ params }: PageProps) {
  const { token } = await params;

  return <ActivateAccountForm token={token} />;
}
