import { useEffect, useState } from "react";
import TestService from "../../services/TestService";
import { Post } from "../../types/Post";
import Response from "../../types/Response";
import PostPreviewCard from "../PostPreviewCard/PostPreviewCard";

export default function PostsPreview() {
  const testService = new TestService();
  const [splashPosts, setSplashPosts] = useState<Post[]>([]);

  useEffect(() => {
    testService.getSplashPosts().then((res: Response<Post[]>) => {
      setSplashPosts(res.data ?? []);
    });
  }, []);

  return (
    <>
      <div id="post-wrap" className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row place-items-center gap-5 p-5">
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