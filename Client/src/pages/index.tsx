import { NavBar } from "../components/NavBar"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "../util/createUrqlClient"
import { usePostsQuery } from "../generated/graphql"

const Index = () => {
  const [{ data }] = usePostsQuery(); //getting all the posts from psql through generated query
  return (
    <>
      <NavBar />
      <div>Hello World</div>
      <br/>
      {!data ? <div> loading ... </div> : data.posts.map((p) => <div key={p.id}>{p.title}</div>)} 
    </>
  );
}
//by default no server side rendering {ssr: true} --> for server side rendering
export default withUrqlClient(createUrqlClient, {ssr:true})(Index);