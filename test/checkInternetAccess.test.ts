import checkInternetAccess from '../src/utils/checkInternetAccess';
import makeHttpRequest from '../src/utils/makeHttpRequest';
import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from '../src/utils/constants';

jest.mock('../src/utils/makeHttpRequest', () =>
  jest.fn(params => {
    if (params.method === 'FAIL') {
      return Promise.reject(false);
    }
    return Promise.resolve(true);
  }),
);

describe('checkInternetAccess', () => {
  it('uses defaults parameters if no args are passed', async () => {
    await checkInternetAccess();
    expect(makeHttpRequest).toHaveBeenCalledWith({
      timeout: DEFAULT_TIMEOUT,
      url: DEFAULT_PING_SERVER_URL,
      method: DEFAULT_HTTP_METHOD,
    });
  });

  it('resolves to true if there is Internet access', async () => {
    const timeout = 2000;
    const url = 'foo.com';
    const method = 'HEAD';
    const hasInternetAccess = await checkInternetAccess({
      url,
      timeout,
      method,
    });

    expect(makeHttpRequest).toHaveBeenCalledWith({
      url,
      timeout,
      method,
    });

    expect(hasInternetAccess).toBe(true);
  });

  it('resolves to false if there is NOT Internet access', async () => {
    const timeout = 2000;
    const url = 'foo.com';
    const method = 'FAIL';
    const hasInternetAccess = await checkInternetAccess({
      timeout,
      url,
      method,
    });

    expect(makeHttpRequest).toHaveBeenCalledWith({
      timeout,
      url,
      method,
    });

    expect(hasInternetAccess).toBe(false);
  });
});
