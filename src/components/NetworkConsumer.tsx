import React, { Context } from 'react'
import NetworkContext from './NetworkContext'

type TNetworkContext =
  | {
      isConnected: boolean
    }
  | undefined

export default function NetworkConsumer({ children }: any): JSX.Element {
  return (
    <NetworkContext.Consumer>
      {(context: TNetworkContext): Context<unknown> => {
        if (!context) {
          throw new Error(
            'NetworkConsumer components should be rendered within NetworkProvider. ' +
              'Make sure you are rendering a NetworkProvider at the top of your component hierarchy',
          )
        }
        return children({ isConnected: context.isConnected })
      }}
    </NetworkContext.Consumer>
  )
}
