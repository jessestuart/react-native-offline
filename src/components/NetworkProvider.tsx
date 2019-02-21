import * as React from 'react'

import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from '../utils/constants'
import { HTTPMethod } from '../types'
import NetworkConnectivity from './NetworkConnectivity'
import NetworkContext from './NetworkContext'

interface ConnectivityState {
  isConnected: boolean
}

interface Props {
  pingTimeout?: number
  pingServerUrl?: string
  shouldPing?: boolean
  pingInterval?: number
  pingOnlyIfOffline?: boolean
  pingInBackground?: boolean
  httpMethod?: HTTPMethod
  children?: Element
}

NetworkProvider.defaultProps = {
  httpMethod: DEFAULT_HTTP_METHOD,
  pingInBackground: false,
  pingInterval: 0,
  pingOnlyIfOffline: false,
  pingServerUrl: DEFAULT_PING_SERVER_URL,
  pingTimeout: DEFAULT_TIMEOUT,
  shouldPing: true,
}

function NetworkProvider(props: Props) {
  const { children, ...rest } = props
  return (
    <NetworkConnectivity {...rest}>
      {(connectionState: ConnectivityState) => (
        <NetworkContext.Provider value={connectionState}>
          {children}
        </NetworkContext.Provider>
      )}
    </NetworkConnectivity>
  )
}

export default NetworkProvider
