export const pagination = (getPartial: boolean | undefined = true, defaultPageSize: number = 10): PaginationRequest => {
  if (!getPartial) return { pageNumber: null, pageSize: null }

  const { query } = useRoute();

  return {
    pageNumber: parseInt(query.pageNumber as string) || 1,
    pageSize: parseInt(query.pageSize as string) || defaultPageSize,
  };
};