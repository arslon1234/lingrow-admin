export const clearObject = <T extends Record<string, any>>(obj: T, doNotKeys: Array<string> = []): void => {
  for (const key in obj) {
    if(doNotKeys.includes(key)) continue;
    if (typeof obj[key] === 'string') {
      obj[key] = null as T[typeof key]; // Clear strings
    } else if (Array.isArray(obj[key])) {
      obj[key] = [] as T[typeof key]; // Clear arrays
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      clearObject(obj[key]); // Recursively clear nested objects
    } else {
      obj[key] = null as T[typeof key]; // Clear other types
    }
  }
}

export const mergeObjectValues = <T extends Record<string, any>, U extends Partial<T>>(target: T, source: U): void => {
  for (const key in target) {
    if (key in source) {
      target[key] = source[key] as unknown as T[typeof key]; // Assign value if key exists in source
    }
  }
}

export const capitalizeKeys = <T extends Record<string, any>>(obj: T): Record<Capitalize<keyof T & string>, T[keyof T]> => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      (key.charAt(0).toUpperCase() + key.slice(1)) as Capitalize<typeof key>,
      value,
    ])
  ) as Record<Capitalize<keyof T & string>, T[keyof T]>;
}

