import NewPostForm from '@/components/CreatePost/NewPostForm/NewPostForm';
import Home from '@/components/Home/Home';
import { NavMenu } from '@/components/NavMenu/NavMenu';
import { Route, Switch } from 'wouter';
import Login from './components/Auth/Login/Login';
import Logout from './components/Auth/Logout/Logout';
import Post from './components/Posts/Post/Post';
import PostsHistory from './components/Posts/PostsHistory/PostsHistory';
import Profile from './components/Profile/Profile';
import Test from './components/Test/Test';
import { ThemeProvider } from './components/ThemeProvider/ThemeProvider';
import { ModeToggle } from './components/ThemeToggle/ThemeToggle';
import Loader from './components/Utility/Loader/Loader';
import faq from './components/faq/faq';
import AuthProvider from './context/AuthContext';
// import { ErrorBoundary } from "react-error-boundary";
// import RequestResponse from './components/RequestResponse/RequestResponse';
import FormWithMessage from './components/CreatePost/FormWithMessage/FormWithMessage';
// import SplineRenderer from './components/SplineRenderer/SplineRenderer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CenterThis from './components/Utility/CenterThis/CenterThis';
import { Toaster } from './components/ui/toaster';
import ContentLoadingProvider from './context/ContentLoadingContext';
function App() {
  const queryClient = new QueryClient();

  return (
    <>
      {/* <SplineRenderer /> */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* 
          TODO: It would probably be beneficial to abstract out a Loader into it's own generalized component that takes some children elements and a prop isLoading
                while leaving the specific of the context for said loading to a more dialed in component like PageLoader or <CardLoader>
        */}
            <Loader>
              <main className="relative w-full h-full flex flex-col flex-1 place-items-center">
                <header className="w-full sticky z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="w-full flex h-14  items-center p-10 justify-between">
                    <NavMenu />
                    <ModeToggle />
                  </div>
                </header>

                {/* <ErrorBoundary FallbackComponent={RequestResponse} onReset={() => console.log('reset')}> */}
                <div className="my-3 grow"></div>
                <section
                  id="main-content"
                  className="relative w-full h-vh sm:w-5/6 md:w-4/5 max-w-screen-md flex flex-col flex-none px-8 *:my-7"
                >
                  <ContentLoadingProvider>
                    <Switch>
                      <Route path="/">
                        <CenterThis>
                          <Home />
                        </CenterThis>
                      </Route>
                      <Route path="/faq" component={faq} />

                      <Route path="/login">
                        <CenterThis>
                          <Login />
                        </CenterThis>
                      </Route>
                      <Route path="/logout">
                        <CenterThis>
                          <Logout />
                        </CenterThis>
                      </Route>

                      <Route path="/create-post">
                        <CenterThis>
                          <FormWithMessage<FormData>
                            FormComponent={NewPostForm}
                          />
                        </CenterThis>
                      </Route>
                      <Route path="/post/:post_id">
                        <CenterThis>
                          <Post />
                        </CenterThis>
                      </Route>

                      <Route path="/profile" component={Profile} />
                      <Route path="/profile/posts">
                        <PostsHistory onlyCurrUser={true} />
                      </Route>
                      <Route path="/posts/nearby">
                        <PostsHistory locationSpecific={true} />
                      </Route>
                      <Route path="/posts">
                        <PostsHistory onlyCurrUser={false} />
                      </Route>

                      <Route path="/testing" component={Test} />
                      <Route component={() => <h1>404 - Not Found</h1>} />
                    </Switch>
                  </ContentLoadingProvider>
                  <Toaster />
                </section>
                <div className="my-3 grow"></div>
                {/* </ErrorBoundary> */}
              </main>
            </Loader>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
