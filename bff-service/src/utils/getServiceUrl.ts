export const getServiceUrl = (url: string): string | undefined  => {
  return process.env[url.split("/")[1]];
};
