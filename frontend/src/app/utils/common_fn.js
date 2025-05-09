export function cleanEmptyValues(obj) {
  const cleaned = {};

  for (const [key, value] of Object.entries(obj)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0
    ) {
      const cleanedNested = cleanEmptyValues(value);
      if (Object.keys(cleanedNested).length > 0) {
        cleaned[key] = cleanedNested;
      }
    } else if (value !== "" && value !== undefined && value !== null) {
      cleaned[key] = value;
    } else if (Array.isArray(value)) {
      if (value.length > 0) {
        const cleanedArray = value.filter(
          (item) => item !== "" && item !== undefined && item !== null
        );

        if (cleanedArray.length > 0) {
          cleaned[key] = cleanedArray;
        }
      }
    }
  }

  return cleaned;
}

export default { cleanEmptyValues };
