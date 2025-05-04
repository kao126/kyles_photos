'use clients';
import { auth, signIn, signOut } from '@/auth';

export default async function Login() {
  const session = await auth();

  // console.log(session?.idToken);
  return (
    <div>
      <h1>Login</h1>
      <p>ログイン画面</p>
      {!session && (
        <form
          action={async () => {
            'use server';
            await signIn('google');
          }}
        >
          <button type='submit'>Signin with Google</button>
        </form>
      )}
      {session && (
        <div>
          <p>success!!! welcome kyle's photos</p>
          <form
            action={async () => {
              'use server';
              await signOut();
            }}
          >
            <button type='submit'>SignOut</button>
          </form>
        </div>
      )}
    </div>
  );
}
