import makeHttpRequest from './makeHttpRequest';
import { HTTPMethod } from 'types';
import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from './constants';

interface Arguments {
  url: string;
  timeout: number;
  method: HTTPMethod;
}

export default function checkInternetAccess({
  method = DEFAULT_HTTP_METHOD,
  timeout = DEFAULT_TIMEOUT,
  url = DEFAULT_PING_SERVER_URL,
}: Arguments): Promise<boolean> {
  return new Promise(async (resolve: (value: boolean) => void) => {
    try {
      await makeHttpRequest({
        method,
        url,
        timeout,
      });

      resolve(true);
    } catch (e) {
      resolve(false);
    }
  });
}
