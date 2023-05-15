import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
	uri: "https://graphql.anilist.co",
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "no-cache",
			errorPolicy: "ignore",
		},
		query: {
			fetchPolicy: "no-cache",
			errorPolicy: "all",
		},
	},
});

export { client };
