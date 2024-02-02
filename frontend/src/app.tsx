import Home from "@/components/Home/Home";
import { NavMenu } from "@/components/NavMeun/NavMenu";
import NewPostForm from "@/components/NewPostForm/NewPostForm";
import { Route } from "wouter";
import Post from "./components/Post/Post";
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider";
import { ModeToggle } from "./components/ThemeToggle/ThemeToggle";

function App() {
  return (
    /*
    TODO:
      If user is not logged in, give them the generic homepage
      Else, if they are logged in, give them a more customized homepage

      Do so by utilizing props or auth context
    */
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <header className='sticky top-0 z-50 w-screen border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className="w-full flex h-14 max-w-screen-2xl items-center p-10 justify-between">
          <NavMenu />
          <ModeToggle />
        </div>
      </header>
      <section id="main-content" className="w-full max-w-screen-2xl flex place-content-center my-20">
        <Route path="/" component={Home} />
        <Route path="/create-post" component={NewPostForm} />
        <Route path="/post/:post_id" component={Post} />

      </section>
    </ThemeProvider>
  )
}

export default App