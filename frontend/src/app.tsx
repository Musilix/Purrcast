import Home from "@/components/Home/Home";
import { NavMenu } from "@/components/NavMeun/NavMenu";
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
    /*
    TODO:
      If user is not logged in, give them the generic homepage
      Else, if they are logged in, give them a more customized homepage

      Do so by utilizing props or auth context
    */
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* TODO: do something with this? */}
        <Loader>
          <header className='w-full sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className="w-full flex h-14  items-center p-10 justify-between">
              <NavMenu />
              <ModeToggle />
            </div>
          </header>
          <section id="main-content" className="w-full h-full max-w-screen-2xl flex relative flex-grow place-items-center justify-center my-10 p-5">
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
        </Loader>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App