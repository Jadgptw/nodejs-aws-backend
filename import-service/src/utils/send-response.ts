import { OK } from 'http-status-codes';

export const sendResponse = (data: any, statusCode: number = OK) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data)
  }
};
