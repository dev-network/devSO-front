import { getPosts } from "../api";
import PostGridPage from "./PostGridPage.jsx";

const RecentPostListPage = () => {
  return <PostGridPage title="최신 게시글" fetcher={getPosts} />;
};

export default RecentPostListPage;