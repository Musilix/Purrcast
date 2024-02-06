import { useState } from "react";
import { Post } from "../../types/Post";
import PostPreviewCard from "../PostPreviewCard/PostPreviewCard";
import { cn } from "@/lib/utils";

// TODO: Set up reducer to handle different post previw cases
//   1. Splash Page Preview - only grab some X random posts where location is near vicinity of user
//   2. User Profile Preview - grab all posts by user
//   3. Grab Paginated Posts - grab all posts in a vicinity of user by page
export default function PostsPreview({ className = "" }) {
  const [splashPosts] = useState<Post[]>([]);

  return (
    <>
      <div id="post-wrap" className={cn("w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row place-content-center place-items-center gap-5 p-5", className)}>
        {
          splashPosts && splashPosts.length > 0 ? (
            <ul>
              {splashPosts.map((post) => (
                <li className="post-content" key={post.id}>
                  <PostPreviewCard />
                </li>
              ))}
            </ul>
          ) : (
            <>
              {/* <p>No Posts to Show. Try refreshing?</p> */}
              <PostPreviewCard skeleton={false} />
              <PostPreviewCard skeleton={false} />
              <PostPreviewCard skeleton={false} />
              <PostPreviewCard skeleton={false} />
              <PostPreviewCard />
            </>
          )
        }
      </div>
    </>
  )
}