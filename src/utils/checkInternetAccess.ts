import API from './makeHttpRequest'
import { HTTPMethod } from 'types'
import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from './constants'

interface Arguments {
  url: string
  timeout: number
  method: HTTPMethod
}

export const DefaultHTTPRequestArguments: Arguments = Object.freeze({
  method: DEFAULT_HTTP_METHOD,
  timeout: DEFAULT_TIMEOUT,
  url: DEFAULT_PING_SERVER_URL,
})

export function checkInternetAccess({
  method = DEFAULT_HTTP_METHOD,
  timeout = DEFAULT_TIMEOUT,
  url = DEFAULT_PING_SERVER_URL,
}: Arguments = DefaultHTTPRequestArguments): Promise<boolean> {
  return new Promise(async (resolve: (value: boolean) => void) => {
    try {
      await API.makeHttpRequest({
        method,
        url,
        timeout,
      })

      resolve(true)
    } catch (e) {
      resolve(false)
    }
  })
}

export default { checkInternetAccess }
