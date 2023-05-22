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
	headers: {
		'Authorization': 'Bearer ' + process.env.ANILIST_SECRET,
	}
});

const clientAuth = (token: string) => {
	return new ApolloClient({
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
		headers: {
			'Authorization': 'Bearer ' + token,
		}
	})
}


export { client, clientAuth };
