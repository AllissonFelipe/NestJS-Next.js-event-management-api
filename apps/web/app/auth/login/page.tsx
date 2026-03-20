import LoginForm from './components/LoginForm';
import useLogin from './hooks/use-login';

export default function LoginPage() {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
  const loginHook = useLogin(url);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
