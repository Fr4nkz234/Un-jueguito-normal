import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/login');
  return null; // redirect() is a server-side utility, this return is for completeness
}
