import { ContentLoadingContext } from '@/context/ContentLoadingContext';
import useGeo from '@/hooks/useGeo';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Post } from '../../../types/Post';
import { useToast } from '../../ui/use-toast';
import PostPreviewCard from '../PostPreviewCard/PostPreviewCard';

interface UserSession {
  access_token: string;
}
// TODO: Set up reducer to handle different post previw cases
//   1. Splash Page Preview - only grab some X random posts where location is near vicinity of user (/post)
//   2. User Profile Preview - grab all posts by user (/post/mine)
//   3. Grab Paginated Posts - grab all posts in a vicinity of user by page (post/page=1&limit=10)
// export default function PostsPreview({ className = "", type = "splash" | "profile" | "paginated"}) {
export default function PostsPreview({
  className = '',
  onlyCurrUser = false,
  locationSpecific = false,
}: {
  className?: string;
  onlyCurrUser?: boolean;
  locationSpecific?: boolean;
}) {
  const [splashPosts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();
  const [, reverseGeoCoords] = useGeo();

  const reqUrl = onlyCurrUser
    ? `${import.meta.env.VITE_API_HOST}/post/mine`
    : locationSpecific
    ? `${import.meta.env.VITE_API_HOST}/post/nearby`
    : `${import.meta.env.VITE_API_HOST}/post`;
  const noPostMessage = onlyCurrUser
    ? 'You have no posts 😿'
    : locationSpecific
    ? 'No one has made a post near you yet. 😿'
    : 'No posts to show 😿';

  const userSession = JSON.parse(
    localStorage.getItem('userSession') ?? '{}',
  ) as UserSession;

  const userLocation =
    locationSpecific && reverseGeoCoords
      ? {
          userState: reverseGeoCoords.id_state,
          userCity: reverseGeoCoords.id_city,
        }
      : {};

  const { setIsContentLoading } = useContext(ContentLoadingContext);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      axios
        .post(
          reqUrl,
          { ...userLocation },
          {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${userSession.access_token}`,
            },
          },
        )
        .then((res) => {
          res ? setPosts(res.data) : setPosts([]);
        })
        .catch((e) => {
          toast({
            title: 'There was an issue retrieving posts.',
            description: e.response.data.message,
            variant: 'destructive',
          });
        });
    };
    setIsContentLoading(true);
    fetchPosts();
    setIsContentLoading(false);

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
          {!splashPosts && (
            <>
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
            </>
          )}

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
              <div className="col-span-2 flex flex-col items-left rounded-md border p-4 my-2.5 *:my-1">
                <div className="flex-1 space-y-1 ">
                  <p className="text-sm font-medium leading-none">
                    {noPostMessage}
                  </p>

                  {onlyCurrUser ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        You haven't made any posts yet. You could do good for
                        your community and{' '}
                        <Link
                          href="/create-post"
                          className="font-extrabold text-primary"
                        >
                          post your cat
                        </Link>{' '}
                        to help us make a forecast!
                      </p>
                    </>
                  ) : locationSpecific ? (
                    <>
                      <p className="text-sm text-muted-foreground">
                        There are currently no posts near you. You could be the
                        <i>
                          <b> Neil Armstrong</b>
                        </i>{' '}
                        of your community and be the first to{' '}
                        <Link
                          href="/create-post"
                          className="font-extrabold text-primary"
                        >
                          post your cat
                        </Link>{' '}
                        to help us make a forecast for your area!
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        There are no posts{' '}
                        <i>
                          <b> AT ALL</b>
                        </i>{' '}
                        currently. You could go down in history and be the first
                        to{' '}
                        <Link
                          href="/create-post"
                          className="font-extrabold text-primary"
                        >
                          post your cat
                        </Link>{' '}
                        to help us make a forecast!
                      </p>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
