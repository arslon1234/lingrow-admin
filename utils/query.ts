import type {Router, RouteLocationNormalizedLoaded} from '#vue-router'
type QueryValue = string | number | null | undefined;

interface SetQueriesOptions {
	clear?: boolean;
	saveHistory?: boolean;
}

export function useQueryParams(route: RouteLocationNormalizedLoaded, router: Router) {
	const setQueries = async (props: Record<string, QueryValue> = {}, { clear = false, saveHistory = false }: SetQueriesOptions = {}): Promise<void> => {
		const routeObject = {
			query: clear
				? props
				: {
						...route.query,
						...props
				  }
		};

		if (saveHistory) {
			await router.push(routeObject);
		} else {
			await router.replace(routeObject);
		}
	};

	const getQueryParams = <T = Record<string, any>>(prop?: keyof T) => {
		const queries: Record<string, any> = {
			...route.query,
			page: route.query.page ? Number(route.query.page) : 1,
			size: route.query.size ? Number(route.query.size) : 10
		};

		return prop ? queries[prop as string] : queries;
	};

	return {
		setQueries,
		getQueryParams
	};
}
