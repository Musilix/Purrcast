import PostsPreview from '../PostsPreview/PostsPreview';

// TODO - i think this component may be unecessary
export default function PostsHistory({
  onlyCurrUser = false,
  locationSpecific = false,
}: {
  onlyCurrUser?: boolean;
  locationSpecific?: boolean;
}) {
  return onlyCurrUser ? (
    <UserPosts />
  ) : locationSpecific ? (
    <NearbyPosts />
  ) : (
    <RandomPosts />
  );
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

function NearbyPosts() {
  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Nearby Posts
      </h1>
      <PostsPreview locationSpecific={true} />
    </>
  );
}
