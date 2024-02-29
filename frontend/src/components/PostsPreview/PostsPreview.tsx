import { cn } from "@/lib/utils";
import axios from "axios";
import { useEffect, useState } from "react";
import { Post } from "../../types/Post";
import PostPreviewCard from "../PostPreviewCard/PostPreviewCard";

// TODO: Set up reducer to handle different post previw cases
//   1. Splash Page Preview - only grab some X random posts where location is near vicinity of user
//   2. User Profile Preview - grab all posts by user
//   3. Grab Paginated Posts - grab all posts in a vicinity of user by page
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
        console.log(posts.data);
        setPosts(posts.data)
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchPosts();

    return () => controller.abort();
  }, []);

  return (
    <>
      <div id="post-wrap">
        {
          splashPosts && splashPosts.length > 0 ? (
            <ul className={cn("w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 grid-flow-row place-content-center place-items-center gap-5 p-5", className)}>
              {splashPosts.map((post) => (
                <li className="post-content" key={post.id}>
                  <PostPreviewCard
                    author={post.author}
                    post={post}
                  />
                </li>
              ))}
            </ul>
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
      </div>
    </>
  )
}