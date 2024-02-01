import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import { Post } from "@/types/Post";
import SkeletonPreviewCard from "../SkeletonPreviewCard/SkeletonPreviewCard";

interface PostPreviewCardProps {
    post?: Post;
    skeleton?: boolean;
}

function RealCard() {
    return (
        <>
            <CardContent className="p-5">
                <img loading="lazy" src="https://source.unsplash.com/random/350x350" alt="Random Image" className="w-full h-full object-cover rounded-sm" />
            </CardContent>

            <CardFooter className="flex flex-col flex-auto text-left pb-5">
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
        <a href={`/post/${post.id}`} className="w-full h-full">
            <Card className="hover:bg-muted cursor-pointer transition-colors h-full">
                {
                    (!skeleton) ? (
                        <RealCard />
                    ) : (
                        <SkeletonPreviewCard />
                    )
                }
            </Card>
        </a >

    );
}