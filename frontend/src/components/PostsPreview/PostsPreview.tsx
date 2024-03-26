import { cn } from '@/lib/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Post } from '../../types/Post';
import PostPreviewCard from '../PostPreviewCard/PostPreviewCard';

interface UserSession {
  access_token: string;
}
// TODO: Set up reducer to handle different post previw cases
//   1. Splash Page Preview - only grab some X random posts where location is near vicinity of user
//   2. User Profile Preview - grab all posts by user
//   3. Grab Paginated Posts - grab all posts in a vicinity of user by page
// export default function PostsPreview({ className = "", type = "splash" | "profile" | "paginated"}) {
export default function PostsPreview({
  className = '',
  onlyCurrUser = false,
}: {
  className?: string;
  onlyCurrUser?: boolean;
}) {
  const [splashPosts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>('');
  const reqUrl = onlyCurrUser
    ? `${import.meta.env.VITE_API_HOST}/post/mine`
    : `${import.meta.env.VITE_API_HOST}/post`;

  const userSession = JSON.parse(
    localStorage.getItem('userSession') ?? '{}',
  ) as UserSession;

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      axios
        .get(reqUrl, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${userSession.access_token}`,
          },
        })
        .then((res) => {
          res ? setPosts(res.data) : setPosts([]);
        })
        .catch((e) => {
          // todo - start throwing errors for an error boundary to catch and show...
          setError((e as Error).message);

          console.error(error);
        });
    };

    fetchPosts();

    return () => controller.abort();
  }, []);

  return (
    <>
      <div id="post-wrap" className="flex justify-center align-middle">
        <ul
          className={cn(
            'w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6 grid-flow-row align-middle place-content-center place-items-center gap-5 p-5',
            className,
          )}
        >
          {splashPosts && splashPosts.length > 0 ? (
            <>
              {splashPosts.map((post) => (
                <li className="post-content w-full h-full" key={post.id}>
                  <PostPreviewCard author={post.author} post={post} />
                </li>
              ))}
            </>
          ) : (
            <>
              {/* <p>No Posts to Show. Try refreshing?</p> */}
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
            </>
          )}
        </ul>
      </div>
    </>
  );
}
