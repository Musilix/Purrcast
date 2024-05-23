import { AuthContext } from '@/context/AuthContext';
import { Session } from '@supabase/supabase-js';
import { useContext } from 'react';
import SplineRenderer from '../SplineRenderer/SplineRenderer';
import NonUserHome from './NonUserHome';
import UserHome from './UserHome';

export default function Home() {
  const { session } = useContext(AuthContext);

  if (session && session.user) {
    return (
      <>
        <UserHome session={session as Session} />
      </>
    );
  } else {
    return (
      <>
        <SplineRenderer />
        <NonUserHome />
      </>
    );
  }
}
