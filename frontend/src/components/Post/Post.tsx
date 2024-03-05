import { Post } from "@/types/Post";
import { getUpVoteBarLength } from "@/utils/GetUpvoteBarLength";
import axios from "axios";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { Button } from "../ui/button";

export default function PostPage() {
  const params = useParams();

  const [postVotes, setPostVotes] = useState<number>(0);
  const [post, setPost] = useState<Post | null>(null);

  const postId = params.post_id;

  console.log("Post ID: ", postId);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_HOST}/post/${postId}`, {
        });
        console.log(res)
        setPost(res.data.payload.content);
      } catch (e) {
        console.error(`An error occured while trying to retrieve posts ${postId}`);
      }
    }

    fetchPost();
  }, []);

  const upVotePost = () => {
    setPostVotes(prevVotes => prevVotes + 1);
  }

  // TODO - I need to figure out a way to encapsulate the PostPreview card logic in order to reuse it for the loading state of this page
  return (
    <div className="flex flex-col w-full h-full place-content-center place-items-center">
      <article className="flex flex-col size-screen place-items-center">
        {(post) ?
          <>
            <PostContent post={post} />
            <PostVotes handleUpVote={upVotePost} postVotes={postVotes} />
          </>

          : ""}
      </article>
    </div >
  )

}

function PostContent({ post }: { post: Post }) {
  return (
    <>
      <section className="post-img w-3/4 p-4">
        {(post.contentId.includes("png")) ? <img src={post.contentId} alt={`A cat photo posted by ${post.author.username}`} className="w-full h-full object-cover rounded-md" /> : post.contentId}
        <p className="text-xs">{(post) ? post?.contentId : ""}</p>
      </section>
      <section className="post-details text-center p-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight place-item-end">
          Post by {(post.author.username) ? post.author.username : "Anonymous Purrcaster"}
        </h3>
        <p className="leading-7 [&:not(:first-child)]:mt-1 place-item-start">
          {(post) ? post?.author?.location : "Earth"}
        </p>
      </section>
    </>
  )
}

function PostVotes({ postVotes, handleUpVote }: { postVotes: number, handleUpVote: () => void }) {
  return (
    <>
      <section className=" flex flex-row justify-center post-metrics border-slate-400 border-solid border-[1px] rounded-full p-1 hover:border-slate-800 hover:bg-secondary transition-all">
        <div className={`${getUpVoteBarLength(postVotes)} grid grid-cols-2 divide-x text-center`}>
          <div>
            <Button onClick={handleUpVote} variant="ghost" className="p-2 m-0 rounded-full hover:bg-popover">
              <ThumbsUp className="size-5 " />
            </Button>
          </div>
          {/* <Separator orientation="vertical" className="h-full -mx-95" /> */}
          <div className="flex flex-col justify-center place-items-center">
            <p className="text-xl text-center font-semibold tracking-tight">
              {postVotes}
            </p>
          </div>
        </div>
      </section>
    </>
  )
}