import { ChakraProvider, InputGroup } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql'
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache'; //for custom updates 
import { LoginMutation, MeDocument, MeQuery, RegisterMutation } from '../generated/graphql';

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, data => fn(result, data as any) as any);
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: "include", //actually sends the cookie 
  },
  // @ts-ignore
  // this is for caching when we logged in as a middleware 
  // (we login as the actual acc that just logged in)
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        login: (_result, args, cache, info) => {
          //update the query of what we are getting which is a login query that returns user
          //if successfull (second else)
          betterUpdateQuery<LoginMutation, MeQuery>(
            cache,
            { query: MeDocument },
            _result, 
            //updating query after mutation happens
            (result, query) => {
              if (result.login.errors) {
                return query; //if there was a error through our result of query
              }
              else {
                return {
                  me: result.login.user, //if there was none there must be user so return it
                }
              }


            }
          );
        },
        register: (_result, args, cache, info) => {
          betterUpdateQuery<RegisterMutation, MeQuery>(cache,
            { query: MeDocument },
            _result,
            (result, query) => {
              if (result.register.errors) {
                return query;
              }
              else {
                return {
                  me: result.register.user,
                }
              }
            }
          );
        },
      },
    },
  }), fetchExchange],
  // exchanges: [dedupExchange, cacheExchange({}), fetchExchange]
});
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
