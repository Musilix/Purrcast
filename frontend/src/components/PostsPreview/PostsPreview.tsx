import { cn } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "../../types/Post";
import PostPreviewCard from "../PostPreviewCard/PostPreviewCard";

export interface PostResponse {
  payload: {
    message: string;
    content: Post[] | null;
    error: string | null;
    statusCode: number;
  };
}

// TODO: Set up reducer to handle different post previw cases
//   1. Splash Page Preview - only grab some X random posts where location is near vicinity of user
//   2. User Profile Preview - grab all posts by user
//   3. Grab Paginated Posts - grab all posts in a vicinity of user by page
// export default function PostsPreview({ className = "", type = "splash" | "profile" | "paginated"}) {
export default function PostsPreview({ className = "" }) {
  const [splashPosts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        const posts = await axios.get(`${import.meta.env.VITE_API_HOST}/post`, {
          headers: {
            Accept: "application/json",
          }
        });

        (posts.data.payload.content) ? setPosts(posts.data.payload.content) : setPosts([]);
      } catch (err) {
        setError((err as Error).message);

        console.error(error);
      }
    }

    fetchPosts();

    return () => controller.abort();
  }, []);

  return (
    <>
      <div id="post-wrap" className="flex justify-center align-middle">
        <ul className={cn("w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6 grid-flow-row align-middle place-content-center place-items-center gap-5 p-5", className)}>
          {
            splashPosts && splashPosts.length > 0 ? (
              <>
                {splashPosts.map((post) => (
                  <li className="post-content w-full h-full" key={post.id}>
                    <PostPreviewCard
                      author={post.author}
                      post={post}
                    />
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
            )
          }
        </ul>

      </div>
    </>
  )
}