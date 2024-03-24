import PostsPreview from '../PostsPreview/PostsPreview';

export default function UserPostsHistory() {
  return (
    <div className="w-3/4">
      <p>
        You've made X posts since creating you account and got a total of Y
        thumbs up!
      </p>
      <p>View Previous Posts:</p>
      <PostsPreview />
    </div>
  );
}
