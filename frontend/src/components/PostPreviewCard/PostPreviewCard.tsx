import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/Post";
import { User } from "@/types/User";
import { Link } from "wouter";
import SkeletonPreviewCard from "../SkeletonPreviewCard/SkeletonPreviewCard";

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
                {/* <img loading="lazy" src="https://source.unsplash.com/random/350x350" alt="Random Image" className="w-full h-full object-cover rounded-sm" /> */}
                <div className="w-full h-full max-w-1/2 min-w-1/2 aspect-square object-cover rounded-md flex justify-center align-middle text-center text-xs sm:text-lg break-all bg-secondary p-2">{content}</div>
            </CardContent>
            <CardFooter className="flex flex-col flex-auto text-left pb-5">
                <CardTitle>Posted by {author.name}</CardTitle>
                <CardDescription>{author.location}</CardDescription>
                <CardDescription className="text-center">{postedAt}</CardDescription>
            </CardFooter>
        </>
    )
}

export default function PostPreviewCard({ author = {} as User, post = {} as Post, skeleton = false }: PostPreviewCardProps) {
    return (
        <Link href={`/ post / ${post.id}`}>
            <a className="w-full h-full">
                <Card className="hover:bg-muted cursor-pointer transition-colors h-full">
                    {
                        (!skeleton) ? (
                            <RealCard author={author} postedAt={post.createdAt} content={post.contentId} />
                        ) : (
                            <SkeletonPreviewCard />
                        )
                    }
                </Card>
            </a>
        </Link>
    );
}