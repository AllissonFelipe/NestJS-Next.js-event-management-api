import ResendActivationEmailForm from './ResendActivationEmailForm';

export default function ResendActivationEmailPage() {
  return (
    <main className="min-h-screen flex justify-center items-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Criar Conta</h1>
        <ResendActivationEmailForm />
      </div>
    </main>
  );
}
