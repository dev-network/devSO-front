import { getTrending } from "../api";
import PostGridPage from "./PostGridPage.jsx";

const TrendingPage = () => {
  return <PostGridPage title="트렌딩" fetcher={getTrending} emptyText="트렌딩 게시글이 없습니다." />;
};

export default TrendingPage;


