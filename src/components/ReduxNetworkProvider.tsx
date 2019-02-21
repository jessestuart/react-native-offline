import { connect } from 'react-redux'
import _ from 'lodash'
import * as React from 'react'

import {
  DEFAULT_HTTP_METHOD,
  DEFAULT_PING_SERVER_URL,
  DEFAULT_TIMEOUT,
} from 'utils/constants'
import { HTTPMethod, FluxAction, NetworkState } from 'types'
import { connectionChange } from 'redux/actionCreators'
import NetworkConnectivity from 'components/NetworkConnectivity'

interface Props {
  children: Node
  dispatch: (param0: FluxAction) => FluxAction
  httpMethod?: HTTPMethod
  isConnected: boolean
  pingInBackground?: boolean
  pingInterval?: number
  pingOnlyIfOffline?: boolean
  pingServerUrl?: string
  pingTimeout?: number
  shouldPing?: boolean
}

function mapStateToProps(state: {
  network: NetworkState
}): { isConnected: boolean } {
  return {
    isConnected: state.network.isConnected,
  }
}

class ReduxNetworkProvider extends React.Component<Props> {
  public static readonly defaultProps = {
    pingTimeout: DEFAULT_TIMEOUT,
    pingServerUrl: DEFAULT_PING_SERVER_URL,
    shouldPing: true,
    pingInterval: 0,
    pingOnlyIfOffline: false,
    pingInBackground: false,
    httpMethod: DEFAULT_HTTP_METHOD,
  }

  public readonly handleConnectivityChange = (isConnected: boolean) => {
    const { isConnected: wasConnected, dispatch } = this.props
    if (isConnected !== wasConnected) {
      dispatch(connectionChange(isConnected))
    }
  }

  public render() {
    const { children } = this.props
    return (
      <NetworkConnectivity
        {..._.without(this.props, 'children')}
        onConnectivityChange={this.handleConnectivityChange}
      >
        {() => children}
      </NetworkConnectivity>
    )
  }
}

const ConnectedReduxNetworkProvider = connect(mapStateToProps)(
  ReduxNetworkProvider,
)

export {
  ConnectedReduxNetworkProvider as default,
  ReduxNetworkProvider,
  mapStateToProps,
}
