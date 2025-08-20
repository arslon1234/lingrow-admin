export const dateRange = () => {
  const { query } = useRoute();

  return {
    fromDate: query.fromDate ? String(query.fromDate) : null,
    toDate: query.toDate ? String(query.toDate) : null
  };
};