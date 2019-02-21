import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from 'utils/constants'
import API from 'utils/makeHttpRequest'
import InternetAccessCheck from 'utils/checkInternetAccess'

API.makeHttpRequest = jest.fn().mockImplementation(params => {
  if (params.method === 'FAIL') {
    return Promise.reject(false)
  }
  return Promise.resolve(true)
})

describe('checkInternetAccess', () => {
  afterEach(() => {
    API.makeHttpRequest.mockClear()
  })

  it('uses defaults parameters if no args are passed', async () => {
    // console.error('make http request', { makeHttpRequest })
    await InternetAccessCheck.checkInternetAccess()
    expect(API.makeHttpRequest).toHaveBeenCalledWith({
      timeout: DEFAULT_TIMEOUT,
      url: DEFAULT_PING_SERVER_URL,
      method: DEFAULT_HTTP_METHOD,
    })
  })

  it('resolves to true if there is Internet access', async () => {
    const timeout = 2000
    const url = 'foo.com'
    const method = 'HEAD'
    const hasInternetAccess = await InternetAccessCheck.checkInternetAccess({
      url,
      timeout,
      method,
    })

    expect(API.makeHttpRequest).toHaveBeenCalledWith({
      url,
      timeout,
      method,
    })

    expect(hasInternetAccess).toBe(true)
  })

  it('resolves to false if there is NOT Internet access', async () => {
    const timeout = 2000
    const url = 'foo.com'
    const method = 'FAIL'
    const hasInternetAccess = await InternetAccessCheck.checkInternetAccess({
      timeout,
      url,
      method,
    })

    API.makeHttpRequest.mockReturnValue()

    expect(API.makeHttpRequest).toHaveBeenCalledWith({
      timeout,
      url,
      method,
    })

    expect(hasInternetAccess).toBe(false)
  })
})
