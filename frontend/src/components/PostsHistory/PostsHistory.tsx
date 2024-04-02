import PostsPreview from '../PostsPreview/PostsPreview';

// TODO - i think this component may be unecessary
export default function PostsHistory({
  onlyCurrUser = false,
}: {
  onlyCurrUser?: boolean;
}) {
  return onlyCurrUser ? <UserPosts /> : <RandomPosts />;
}

function RandomPosts() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Random Posts
      </h1>
      <PostsPreview />
    </>
  );
}

function UserPosts() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Your Recent Posts
      </h1>
      <PostsPreview onlyCurrUser={true} />
    </>
  );
}
