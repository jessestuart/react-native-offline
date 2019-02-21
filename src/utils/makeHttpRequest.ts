import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from './constants'
import { DefaultHTTPRequestArguments } from './checkInternetAccess'
import { HTTPMethod } from '../types'

interface Options {
  method?: HTTPMethod
  url: string
  timeout?: number
  testMethod?:
    | 'onload/2xx'
    | 'onload/3xx'
    | 'onload/4xx'
    | 'onload/5xx'
    | 'onerror'
    | 'ontimeout'
}

interface ResolvedValue {
  status: number
}

export const headers = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: 0,
}

const DefaultHTTPRequestOptions = Object.freeze({
  ...DefaultHTTPRequestArguments,
})

/**
 * Utility that promisifies XMLHttpRequest in order to have a nice API that supports cancellation.
 * @param method
 * @param url
 * @param timeout -> Timeout for rejecting the promise and aborting the API request
 * @param testMethod: for testing purposes
 * @returns {Promise}
 */
export function makeHttpRequest({
  method = DEFAULT_HTTP_METHOD,
  url = DEFAULT_PING_SERVER_URL,
  timeout = DEFAULT_TIMEOUT,
  testMethod,
}: Options = DefaultHTTPRequestOptions): Promise<any> {
  return new Promise(
    (
      resolve: (param0: ResolvedValue) => void,
      reject: (param0: ResolvedValue) => void,
    ) => {
      // $FlowFixMe
      const xhr = new XMLHttpRequest(testMethod)
      xhr.open(method, url)
      xhr.timeout = timeout
      xhr.onload = function onLoad() {
        // 3xx is a valid response for us, since the server was reachable
        if (this.status >= 200 && this.status < 400) {
          resolve({
            status: this.status,
          })
        } else {
          reject({
            status: this.status,
          })
        }
      }
      xhr.onerror = function onError() {
        reject({
          status: this.status,
        })
      }
      xhr.ontimeout = function onTimeOut() {
        reject({
          status: this.status,
        })
      }
      Object.keys(headers).forEach((key: string) => {
        xhr.setRequestHeader(key, headers[key])
      })
      xhr.send(null)
    },
  )
}

export default { makeHttpRequest }
