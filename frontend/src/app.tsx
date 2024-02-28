import Home from "@/components/Home/Home";
import { NavMenu } from "@/components/NavMenu/NavMenu";
import NewPostForm from "@/components/NewPostForm/NewPostForm";
import { Route, Switch } from "wouter";
import Loader from "./components/Loader/Loader";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import Post from "./components/Post/Post";
import Profile from "./components/Profile/Profile";
import Test from "./components/Test/Test";
import { ThemeProvider } from "./components/ThemeProvider/ThemeProvider";
import { ModeToggle } from "./components/ThemeToggle/ThemeToggle";
import UserPostsHistory from "./components/UserPostsHistory/UserPostsHistory";
import faq from "./components/faq/faq";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* 
          TODO: It would probably be beneficial to abstract out a Loader into it's own generalized component that takes some children elements and a prop isLoading
                while leaving the specific of the context for said loading to a more dialed in component like PageLoader or <CardLoader>
        */}
        <Loader>
          <main className="flex flex-col flex-auto place-items-center w-full">
            <header className='w-full sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
              <div className="w-full flex h-14  items-center p-10 justify-between">
                <NavMenu />
                <ModeToggle />
              </div>
            </header>
            <section id="main-content" className="w-full max-w-screen-2xl flex flex-col flex-1 place-items-center justify-center p-5 my-5">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/faq" component={faq} />

                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />


                <Route path="/create-post" component={NewPostForm} />
                <Route path="/post/:post_id" component={Post} />

                <Route path="/profile" component={Profile} />
                <Route path="/profile/posts" component={UserPostsHistory} />

                <Route path="/testing" component={Test} />
                <Route component={() => <h1>404 - Not Found</h1>} />
              </Switch>
            </section>
          </main>
        </Loader>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App