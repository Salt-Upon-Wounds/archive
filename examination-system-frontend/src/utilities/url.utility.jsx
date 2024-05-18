export const getParams = ({ url, except = [] }) => {
  const parts = url.split("?");
  if (parts.length === 1) {
    return {};
  }
  const queryParts = parts[1].split("&");
  const output = {};
  for (const current of queryParts) {
    const [key, value] = current.split("=");
    if (except.includes(decodeURIComponent(key))) {
      continue;
    }
    output[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return output;
};

export const createSearch = ({ params }) => {
  const output = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return output;
};

export const createPath = ({ pathName, params }) => {
  if (pathName.includes("?")) {
    throw new Error("invalid input in createPath in url utility");
  }
  const output = `${pathName}${
    Object.keys(params).length > 0 ? "?" : ""
  }${createSearch({ params })}`;
  return output;
};
