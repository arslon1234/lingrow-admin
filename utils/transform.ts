export default function transformResponse(response: Object | Array<any>): Object | Array<any> {
  // Recursively remove `$id`, `$values`, and `$ref`
  if (Array.isArray(response)) {
    return response.map(transformResponse);
  } else if (response && typeof response === 'object') {
    const result: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(response)) {
      if (key === '$id' || key === '$ref') continue;
      result[key === '$values' ? 'VALUES' : key] = transformResponse(value);
    }
    return result;
  }
  return response;
}

export function transformToTimeString(
  dateObject: Ref<TimeObject> | TimeObject
): string {
  const time = isRef(dateObject) ? dateObject.value : dateObject;

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
}