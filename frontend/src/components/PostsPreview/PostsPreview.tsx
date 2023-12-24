import { useEffect, useState } from "react";
import TestService from "../../services/TestService";
import { Post } from "../../types/Post";
import Response from "../../types/Response";
import "./PostsPreview.css";

export default function PostsPreview() {
  const testService = new TestService();
  const [splashPosts, setSplashPosts] = useState<Post[]>([]);

  useEffect(() => {
    //get posts
    console.log("Mounting App. Getting posts...")
    testService.getSplashPosts().then((res: Response<Post[]>) => {
      console.log(res);
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
                  <img className="post-img" src={`${import.meta.env.VITE_CLOUDINARY_PUBLIC_URL}/${post.contentId}`} />
                  <p className="post-author">{`Posted by ${post.author.name}`}</p>
                  <p className="post-author-location">{post.author.location}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No Posts</p>
          )
        }
      </div>
    </>
  )
}