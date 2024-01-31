import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/Post";
import { Skeleton } from "../ui/skeleton";

interface PostPreviewCardProps {
    post?: Post;
    skeleton?: boolean;
}

function SkeletonCard() {
    return (
        <>
            <CardContent className="p-5">
                <Skeleton className="w-[100px] h-[100px] object-cover rounded-sm" />
            </CardContent>

            <CardFooter className="flex justify-between flex-col pb-5">

                <Skeleton className="h-5 p-2 w-11/12" />
                <Skeleton className="h-3 p-2 w-3/5" />

            </CardFooter>
        </>
    )
}

function RealCard() {
    return (
        <>
            <CardContent className="p-5">
                <img loading="lazy" src="https://source.unsplash.com/random/350x350" alt="Random Image" className="w-full h-full object-cover rounded-sm" />
            </CardContent>

            <CardFooter className="flex justify-between flex-col pb-5">
                <CardTitle>Posted by Jaja</CardTitle>
                <CardDescription>Corvallis, OR</CardDescription>

                {/* <CardTitle>{`Posted by ${post.author}`}</CardTitle>
                        <CardDescription>{post.author.location}</CardDescription> */}
            </CardFooter>
        </>
    )
}

export default function PostPreviewCard({ post = {} as Post, skeleton = true }: PostPreviewCardProps) {
    return (
        <a href={`/post/${post.id}`}>
            <Card className="hover:bg-muted cursor-pointer transition-colors">
                {
                    (!skeleton) ? (
                        <RealCard />
                    ) : (
                        <SkeletonCard />
                    )
                }
            </Card>
        </a >

    );
}