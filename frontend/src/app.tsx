import axios from 'axios';
import { useState } from 'react';
import PostsPreview from './components/PostsPreview/PostsPreview';
import { Separator } from './components/ui/separator';
import { NavMenu } from './components/NavMeun/NavMenu';

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
      <main className="flex flex-col flex-auto flex-wrap justify-around w-1/2 md:w-3/5 max-w-screen-lg space-y-10 py-6 lg:py-8 ">
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

        {/* <Separator className="my-full" /> */}

        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Posts being made by other users
        </h2>
        <PostsPreview />

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

// <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
//                             <li className="row-span-3">
//                                 <NavigationMenuLink asChild>
//                                     <a
//                                         className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
//                                         href="/"
//                                     >
//                                         {/* <Icons.logo className="h-6 w-6" /> */}
//                                         <div className="mb-2 mt-4 text-lg font-medium">
//                                             shadcn/ui
//                                         </div>
//                                         <p className="text-sm leading-tight text-muted-foreground">
//                                             Beautifully designed components built with Radix UI and
//                                             Tailwind CSS.
//                                         </p>
//                                     </a>
//                                 </NavigationMenuLink>
//                             </li>
//                             <ListItem href="/docs" title="Introduction">
//                                 Re-usable components built using Radix UI and Tailwind CSS.
//                             </ListItem>
//                             <ListItem href="/docs/installation" title="Installation">
//                                 How to install dependencies and structure your app.
//                             </ListItem>
//                             <ListItem href="/docs/primitives/typography" title="Typography">
//                                 Styles for headings, paragraphs, lists...etc
//                             </ListItem>
//                         </ul><ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
//                             <li className="row-span-3">
//                                 <NavigationMenuLink asChild>
//                                     <a
//                                         className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
//                                         href="/"
//                                     >
//                                         {/* <Icons.logo className="h-6 w-6" /> */}
//                                         <div className="mb-2 mt-4 text-lg font-medium">
//                                             shadcn/ui
//                                         </div>
//                                         <p className="text-sm leading-tight text-muted-foreground">
//                                             Beautifully designed components built with Radix UI and
//                                             Tailwind CSS.
//                                         </p>
//                                     </a>
//                                 </NavigationMenuLink>
//                             </li>
//                             <ListItem href="/docs" title="Introduction">
//                                 Re-usable components built using Radix UI and Tailwind CSS.
//                             </ListItem>
//                             <ListItem href="/docs/installation" title="Installation">
//                                 How to install dependencies and structure your app.
//                             </ListItem>
//                             <ListItem href="/docs/primitives/typography" title="Typography">
//                                 Styles for headings, paragraphs, lists...etc
//                             </ListItem>
//                         </ul>