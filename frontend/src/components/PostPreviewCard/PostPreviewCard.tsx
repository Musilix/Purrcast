import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Post } from '@/types/Post';
import { User } from '@/types/User';
import { formatAMPM } from '@/utils/ConvertDateToTime';
import { Link } from 'wouter';
import { Skeleton } from '../ui/skeleton';

// TODO - super bloated in here at the moment. Shift this around to be more modular
interface PostPreviewCardProps {
  author?: User;
  post?: Post;
  skeleton?: boolean;
}

interface PostProps {
  author: User;
  postedAt: Date;
  content: string;
}

function RealCard({ author, postedAt, content }: PostProps) {
  return (
    <>
      <CardContent className="p-5">
        <div className="w-full max-w-1/2 min-w-1/2 aspect-square object-cover overflow-hidden rounded-md flex justify-center align-middle text-center text-xs sm:text-lg break-all bg-secondary p-2">
          {content.includes('png') ? (
            <img
              src={content}
              alt="Post Image"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            content
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col flex-auto  pb-5">
        <CardTitle>Posted by {author.username}</CardTitle>
        <CardDescription>{author.location}</CardDescription>
        <CardDescription>
          {postedAt
            ? `${new Date(postedAt).toLocaleString('en-US', { month: 'long', day: 'numeric' })}, ${formatAMPM(new Date(postedAt))}`
            : 'Aug 12th, 12:56pm'}
        </CardDescription>
      </CardFooter>
    </>
  );
}

function SkeletonPreviewCard() {
  return (
    <div className="flex flex-col justify-around space-y-3 w-full h-full p-5">
      <Skeleton className="w-full rounded-xl aspect-square" />
      <div className="space-y-2 w-full flex flex-col justify-center">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default function PostPreviewCard({
  author = {} as User,
  post = {} as Post,
  skeleton = false,
}: PostPreviewCardProps) {
  return (
    <Link href={`/post/${post.id}`} className="w-full h-full">
      <a className="w-full h-full flex justify-center align-middle">
        <Card className="hover:bg-muted cursor-pointer transition-colors w-full h-full text-center place-items-center place-content-center">
          {!skeleton ? (
            <RealCard
              author={author}
              postedAt={post.createdAt}
              content={post.contentId}
            />
          ) : (
            <SkeletonPreviewCard />
          )}
        </Card>
      </a>
    </Link>
  );
}
