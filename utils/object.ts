// export const deepClone = (obj: any): any => {
//     if (Array.isArray(obj)) {
//         if (obj.length == 0) return [];
//         return obj.map(x => deepClone(x));
//     } else if (typeof obj === "object" && obj !== null) {
//         return Object.fromEntries(
//             Object.entries(obj).map(([key, value]) => [key, ])
//         );
//     } else {
//         return obj;
//     }
// }
export const deepClone = (obj: any): any => {
    return JSON.parse(JSON.stringify(obj));
}

export function unproxify<T>(val: T): T {
  if (Array.isArray(val)) {
    return val.map(unproxify) as T
  }

  if (val !== null && typeof val === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(val)) {
      result[key] = unproxify(value)
    }
    return result
  }

  return val
}