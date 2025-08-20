function constructParamString(params: Record<string, string | number | boolean | null | undefined>) {
  const paramString = Object.entries(params).map(([key, value]) => {
    return value ? `${key}=${value}` : '';
  }).filter(param => param !== '').join(';');
  return paramString;
}

export { constructParamString };
