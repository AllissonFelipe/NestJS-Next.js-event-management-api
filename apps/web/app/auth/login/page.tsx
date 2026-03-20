import LoginForm from './components/LoginForm';

export default function LoginPage() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoginForm url={url} />
      </div>
    </>
  );
}
