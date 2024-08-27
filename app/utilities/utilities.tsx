const whitelist = /[a-z_]+/gi;
const suffix = /_([a-z]+)/gi;

export const extractNameFromId = (id: string): string => {
  let string = id
    .toLowerCase()
    .match(whitelist)[0]
    ?.match(suffix)[0]
    ?.replace("_", "");
  return string.length > 0 ? string : id;
};
