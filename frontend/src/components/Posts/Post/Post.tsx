import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Post } from '@/types/Post';
import { UserSession } from '@/types/UserSession';
import formatVotes from '@/utils/FormatVotes';
import { getUpVoteBarLength } from '@/utils/GetUpvoteBarLength';
import {
  QueryClientContext,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FileX, Loader2, ThumbsUp } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useParams } from 'wouter';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/use-toast';

export default function PostPage() {
  const params = useParams();
  const postId = params?.post_id ?? '';
  const [userSession] = useLocalStorage<UserSession>('userSession');
  const { toast } = useToast();

  // React Query Section
  const queryClient = useContext(QueryClientContext);

  const fetchPost = async () => {
    try {
      return await axios
        .get(`${import.meta.env.VITE_API_HOST}/post/${postId}`, {})
        .then((res) => {
          return res.data;
          // return {userLocation: {state: res.data.id_state.state_code, city: res.data.id_city.city, post: res.data, postVotes: res.data.upvotes.length}};
        });
    } catch (err) {
      if (err instanceof AxiosError) {
        err.message = err.response?.data.message;
      }

      toast({
        title: 'There was an issue with your request',
        description: err.message,
        variant: 'destructive',
      });

      return {};
    }
  };

  const upvotePost = async (currVotes: number) => {
    try {
      return await axios.put(
        `${import.meta.env.VITE_API_HOST}/post/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userSession?.access_token}`,
          },
        },
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        err.message = err.response?.data.message;
      }

      toast({
        title: 'Unable to Upvote Post',
        description: err.message,
        variant: 'destructive',
      });

      return currVotes;
    }
  };

  // FIXME - onSuccess will be deprecated soon
  const { mutate: handleUpvote, isPending: upvotePending } = useMutation({
    mutationFn: upvotePost,
    onSuccess: () => {
      queryClient?.invalidateQueries({
        queryKey: [`post-${postId}`],
      });
    },
  });

  const {
    data: post,
    isLoading,
    isFetching,
  } = useQuery<Post, AxiosError>({
    queryKey: [`post-${postId}`],
    queryFn: fetchPost,
    initialData: {} as Post,
    refetchOnMount: true, // I think I will leave this true so that upon refresh of the page, new data like upvotes can be grabbed
    refetchOnWindowFocus: true,
    // refetchOnReconnect: true,
  });

  // TODO - there is probably a boat load of stuff to refactor here out into seperate file, possibly hooks, and better conditional logic.
  return (
    <div className="flex flex-col w-full h-full place-content-center place-items-center">
      <article className="flex flex-col size-screen place-items-center">
        {!isLoading && post && (
          <>
            <PostContent post={post} />
            <PostVotes
              initialUpVotes={post?.upvotes?.length ?? 0}
              isFetching={isFetching}
              isPending={upvotePending}
              handleUpvote={() => {
                handleUpvote(post?.upvotes?.length ?? 0);
              }}
            />
          </>
        )}
      </article>
    </div>
  );
}

function PostContent({ post }: { post: Post }) {
  const [postImageLoaded, setPostImageLoaded] = useState<boolean>(false);
  const state = post?.id_state?.state_code ?? 'Earth';
  const city = post?.id_city?.city ?? '';
  const postLocation: { state: string; city: string } = { state, city };

  // PostContent SHOULD only render when isFetching and isLoading is done in the parent component, but just to be careful, I'm adding
  // question mark notation wherever I reference a post's properties... I'm noided out my mind
  return (
    <>
      <section
        className={`post-img relative w-3/4 min-w-[200px] max-w-[800px] min-h-[200px] p-1 flex flex-col justify-center items-center align-middle bg-primary-glow border-dotted border border-black transition-all duration-500 ease-in-out rounded-md`}
      >
        <PostBadge post={post} />

        {/* Wait until the posts data is populated/fetched by useQuery
              Once it is, check that it includes the png extension (kinda bad practice)
                Show the image if the contentId includes PNG
                Otherwise, show a broken file icon
              If the post data is not populated, show a loading spinner
          */}
        {Object.entries(post).length ? (
          post.contentId.includes('png') ? (
            <>
              <img
                src={post.contentId}
                alt={`A cat photo posted by ${post.author!.username}`}
                className={`${
                  postImageLoaded ? 'opacity-1' : 'opacity-0'
                } w-full h-full object-cover rounded-md transition-all ease-in-out duration-500`}
                loading="lazy"
                onLoad={() => {
                  setPostImageLoaded(true);
                }}
              />
            </>
          ) : (
            <FileX size="50px" color="black" />
          )
        ) : (
          <Loader2
            color="hsl(var(--secondary))"
            className={`${
              postImageLoaded ? 'opacity-0' : 'opacity-1'
            } animate-spin absolute transition-all ease-in-out duration-500 `}
          />
        )}
      </section>
      <section className="post-details text-center p-4">
        {post?.author?.username && postLocation.city && postLocation.state ? (
          <>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight place-item-end">
              Posted by {post.author?.username}
            </h3>
            <p className="leading-5 [&:not(:first-child)]:mt-1 place-item-start">
              {postLocation.city && postLocation.state
                ? `${postLocation.city}, ${postLocation.state}`
                : 'Unknown Location'}
            </p>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center space-y-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-6 w-[150px]" />
          </div>
        )}
      </section>
    </>
  );
}

function PostVotes({
  initialUpVotes,
  isFetching,
  isPending,
  handleUpvote,
}: {
  initialUpVotes: number;
  isFetching: boolean;
  isPending: boolean;
  handleUpvote;
}) {
  return (
    <>
      {!isFetching && !isPending ? (
        <section className=" flex flex-row justify-center post-metrics border-slate-400 border-solid border-[1px] rounded-full p-1 hover:border-slate-800 hover:bg-secondary transition-all">
          <div
            className={`${getUpVoteBarLength(
              1111,
            )} grid grid-cols-2 divide-x text-center`}
          >
            <div>
              <Button
                onClick={() => handleUpvote()}
                variant="ghost"
                className="p-2 m-0 rounded-full hover:bg-popover"
              >
                <ThumbsUp className="size-5 " />
              </Button>
            </div>
            {/* <Separator orientation="vertical" className="h-full -mx-95" /> */}
            <div className="flex flex-col justify-center place-items-center">
              <p className="text-xl text-center font-semibold tracking-tight">
                {formatVotes(initialUpVotes)}
              </p>
            </div>
          </div>
        </section>
      ) : (
        <PostVotesSkeleton votesToHold={initialUpVotes} />
      )}
    </>
  );
}

function PostBadge({ post }: { post: Post }) {
  const isCatOnHead = post?.isCatOnHead ?? null;
  return (
    <Badge
      className={`outline-text absolute top-0 rounded-b-full py-1 px-6 text-md font-bold font-mono bg-primary-glow shadow-md transition-all ${
        isCatOnHead !== null
          ? isCatOnHead
            ? 'text-blue-200'
            : 'text-red-200'
          : 'text-yellow-200'
      }`}
    >
      <Link href="/faq#how-do-we-make-predictions">
        {isCatOnHead !== null
          ? isCatOnHead
            ? 'ON HEAD'
            : 'NOT ON HEAD'
          : 'STATUS PENDING'}
      </Link>
    </Badge>
  );
}

function PostVotesSkeleton({ votesToHold }: { votesToHold: number }) {
  return (
    <section className=" flex flex-row justify-center post-metrics border-slate-600 border-solid border-[1px] rounded-full p-1  transition-all">
      <div
        className={`${getUpVoteBarLength(
          1111,
        )} grid grid-cols-2 divide-x text-center`}
      >
        <div>
          <Button
            disabled
            variant="ghost"
            className="p-2 m-0 rounded-full hover:bg-popover"
          >
            <ThumbsUp className="size-5 " />
          </Button>
        </div>
        {/* <Separator orientation="vertical" className="h-full -mx-95" /> */}
        <div className="flex flex-col justify-center place-items-center">
          <p className="text-xl text-center font-semibold tracking-tight">
            {formatVotes(votesToHold)}
          </p>
        </div>
      </div>
    </section>
  );
}
