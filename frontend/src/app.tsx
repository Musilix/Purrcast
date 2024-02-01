import axios from 'axios';
import { useState } from 'react';
import { NavMenu } from './components/NavMeun/NavMenu';
import PostsPreview from './components/PostsPreview/PostsPreview';
import { Separator } from './components/ui/separator';

function App() {
  const [uploadError, setUploadError] = useState<string>("");

  const [postImage, setPostImage] = useState<File | null>();

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting new post: ", postImage);

    // TODO - add proper validation and move implementation to service
    if (postImage) {
      const formData = new FormData();
      formData.append("file", postImage);

      // TODO - utilize service class for implementation details?
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_HOST}/post/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(res);
      } catch (err) {
        setUploadError((err as Error).message);
      }

      setPostImage(null);
    }
  }

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const extractedFile = e.target as HTMLInputElement & {

      files: FileList;
    }

    setPostImage(extractedFile.files[0]);
  }

  return (
    <>
      <header className='sticky top-0 z-50 w-screen border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <img src="/purrcast.gif" alt="Purrcast Logo" className="h-[50px] w-[50px] rotate-180" />
          </a>
          <NavMenu className='flex flex-1 items-center justify-between space-x-2 md:justify-end' />
        </div>

      </header>
      <main className="flex flex-col flex-auto flex-wrap justify-center w-1/2 md:w-3/5 max-w-screen-lg space-y-10 py-6 lg:py-8 ">
        {/* <img src="/purrcast.gif" alt="Purrcast Logo"/>*/}

        <section id="splash-intro" className="w-full">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl break-words">
            Welcome to {(import.meta.env.PROD) ? "Purrcast" : "Purrcast Test Feed"}!
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            An old shriveled soothsayer once said:
            <blockquote className="mt-6 border-l-2 pl-6 italic break-words">
              If your cat lays on it's head, there is rain up ahead.
            </blockquote>
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6 break-words">
            I took that very personally and so Purrcast was built to act as a centralized place for you to post and look at photos of peoples cats in your area to determine if it's going to rain soon or maybe just drizzle.
          </p>
        </section>
        <section id="splash-prev-posts" className="w-full">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Posts being made by other users
          </h2>
          <PostsPreview />
        </section>


        {/* 
      <div id="new-post-wrap">
        <h3>Make a New Post</h3>
        <p >Upload a photo of your cat!</p>
        <form id="new-post-form" onSubmit={handlePostSubmit} encType='multipart/form-data'>
          <input type="file" name="postImage" id="postImageFile" accept="image/*" onChange={(e) => handlePostChange(e)} />
          <button type="submit">Share</button>
        </form>
      </div> */
        }
      </main>
    </>
  )
}

export default App