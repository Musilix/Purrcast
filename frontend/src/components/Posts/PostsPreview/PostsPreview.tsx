import useGeo from '@/hooks/useGeo';
import useLocalStorage from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
  const [userSession] = useLocalStorage<UserSession>('userSession');
  const [, , reverseGeoCoords] = useGeo();
  const { toast } = useToast();
  const { reqUrl, reqOptions, noPostMessage } = getPostListParams(
    onlyCurrUser,
    locationSpecific,
    userSession,
  );

  const fetchPosts = async (): Promise<Post[]> => {
    try {
      return await axios.post(reqUrl, userLocation, reqOptions).then((res) => {
        return res.data;
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'There was an issue retrieving posts.',
          description: err.message,
          variant: 'destructive',
        });
      }

      return [];
    }
  };

  const { isLoading, isFetching, isError, data } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    initialData: [],
    refetchOnMount: true,
  });

  const userLocation =
    locationSpecific && reverseGeoCoords ? reverseGeoCoords : {};

  return (
    <>
      {((!isLoading && !isFetching && data.length <= 0) || isError) && (
        <NoPostsMessage
          noPostMessage={noPostMessage}
          onlyCurrUser={onlyCurrUser}
          locationSpecific={locationSpecific}
        />
      )}

      <div id="post-wrap" className="flex justify-center align-middle">
        <ul
          className={cn(
            'w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6 grid-flow-row align-middle place-content-center place-items-center gap-5 p-5',
            className,
          )}
        >
          {(isLoading || isFetching) && (
            <>
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
              <PostPreviewCard skeleton={true} />
            </>
          )}

          {!isFetching &&
            !isLoading &&
            data.map((post) => (
              <li className="post-content w-full h-full" key={post.id}>
                <PostPreviewCard author={post.author} post={post} />
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export function NoPostsMessage({
  noPostMessage,
  onlyCurrUser,
  locationSpecific,
}: {
  noPostMessage: string;
  onlyCurrUser: boolean;
  locationSpecific: boolean;
}) {
  return (
    <>
      <div className="col-span-2 flex flex-col items-left rounded-md border p-4 my-2.5 *:my-1">
        <div className="flex-1 space-y-1 ">
          <p className="text-sm font-medium leading-none">{noPostMessage}</p>

          {onlyCurrUser ? (
            <>
              <p className="text-sm text-muted-foreground">
                You haven't made any posts yet. You could do good for your
                community and{' '}
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
                currently. You could go down in history and be the first to{' '}
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
  );
}

// I feel like hiding this junk away in a helper function
function getPostListParams(
  onlyCurrUser: boolean,
  locationSpecific: boolean,
  userSession: UserSession,
) {
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
  const reqOptions =
    onlyCurrUser || locationSpecific
      ? {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${userSession.access_token}`,
          },
        }
      : {};

  return { reqUrl, reqOptions, noPostMessage };
}
