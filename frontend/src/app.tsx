import { Route } from "wouter";
import Home from "@/components/Home/Home";
import NewPostForm from "@/components/NewPostForm/NewPostForm";
import { NavMenu } from "@/components/NavMeun/NavMenu";
import Post from "./components/Post/Post";

function App() {
  return (
    /*
    TODO:
      If user is not logged in, give them the generic homepage
      Else, if they are logged in, give them a more customized homepage

      Do so by utilizing props or auth context
    */
    <>
      <header className='sticky top-0 z-50 w-screen border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <NavMenu className='flex flex-1 items-center justify-between space-x-2 md:justify-end' />
        </div>
      </header>
      <Route path="/" component={Home} />
      <Route path="/create-post" component={NewPostForm} />
      <Route path="/post/:post_id" component={Post} />

    </>
  )
}

export default App