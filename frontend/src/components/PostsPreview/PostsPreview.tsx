import { useEffect, useState } from "react";
import TestService from "../../services/TestService";
import { Post } from "../../types/Post";
import Response from "../../types/Response";
import PostPreviewCard from "../PostPreviewCard/PostPreviewCard";

export default function PostsPreview() {
  const testService = new TestService();
  const [splashPosts, setSplashPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log("Mounting App. Getting preview posts...")
    testService.getSplashPosts().then((res: Response<Post[]>) => {
      setSplashPosts(res.data ?? []);
    });
  }, []);

  return (
    <>
      <div id="post-wrap">
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
              <p>No Posts to Show. Try refreshing?</p>

              <PostPreviewCard />
            </>

          )
        }
      </div>
    </>
  )
}