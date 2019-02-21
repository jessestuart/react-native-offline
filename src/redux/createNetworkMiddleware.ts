import { find, get } from 'lodash'

import {
  fetchOfflineMode,
  removeActionFromQueue,
  dismissActionsFromQueue,
} from './actionCreators'
import { NetworkState } from '../types'
import networkActionTypes from './actionTypes'
import wait from 'utils/wait'

interface MiddlewareAPI<S> {
  dispatch: (action: any) => void
  getState(): S
}

interface State {
  network: NetworkState
}

interface Arguments {
  regexActionType?: RegExp
  actionTypes?: string[]
  queueReleaseThrottle?: number
}

const DefaultNetworkMiddleware: Arguments = Object.freeze({
  regexActionType: /FETCH.*REQUEST/,
  actionTypes: [],
  queueReleaseThrottle: 50,
})

function validateParams(regexActionType, actionTypes): void | never {
  if ({}.toString.call(regexActionType) !== '[object RegExp]')
    throw new Error('You should pass a regex as regexActionType param')

  if ({}.toString.call(actionTypes) !== '[object Array]')
    throw new Error('You should pass an array as actionTypes param')
}

function findActionToBeDismissed(action, actionQueue) {
  return find(actionQueue, (a: any) => {
    const actionsToDismiss = get(a, 'meta.dismiss', [])
    return actionsToDismiss.includes(action.type)
  })
}

function isObjectAndShouldBeIntercepted(
  action: { type: string },
  regexActionType: RegExp,
  actionTypes: string[],
): boolean {
  validateParams(regexActionType, actionTypes)

  // if (!regexActionType) {
  //   throw new Error(
  //     '[ERROR] isObjectAndShouldBeIntercepted: `regexActionType` must be defined.',
  //   )
  // }

  return (
    typeof action === 'object' &&
    (regexActionType.test(action.type) || actionTypes.includes(action.type))
  )
}

function isThunkAndShouldBeIntercepted(action): boolean {
  return typeof action === 'function' && action.interceptInOffline === true
}

function checkIfActionShouldBeIntercepted(
  action,
  regexActionType,
  actionTypes,
): boolean {
  return (
    isObjectAndShouldBeIntercepted(action, regexActionType, actionTypes) ||
    isThunkAndShouldBeIntercepted(action)
  )
}

function didComeBackOnline(action, wasConnected): boolean {
  return (
    action.type === networkActionTypes.CONNECTION_CHANGE &&
    !wasConnected &&
    action.payload === true
  )
}

export const createReleaseQueue = (getState, next, delay) => async queue => {
  // eslint-disable-next-line
  for (const action of queue) {
    const { isConnected } = getState().network
    if (isConnected) {
      next(removeActionFromQueue(action))
      next(action)
      // eslint-disable-next-line
      await wait(delay)
    } else {
      break
    }
  }
}

function createNetworkMiddleware({
  regexActionType = /FETCH.*REQUEST/,
  actionTypes = [],
  queueReleaseThrottle = 50,
}: Arguments = DefaultNetworkMiddleware): unknown {
  return ({ getState }: MiddlewareAPI<State>) => (
    next: (action: any) => void,
  ) => (action: any) => {
    const { isConnected, actionQueue } = getState().network
    const releaseQueue = createReleaseQueue(
      getState,
      next,
      queueReleaseThrottle,
    )

    validateParams(regexActionType, actionTypes)

    const shouldInterceptAction = checkIfActionShouldBeIntercepted(
      action,
      regexActionType,
      actionTypes,
    )

    if (shouldInterceptAction && isConnected === false) {
      // Offline, preventing the original action from being dispatched.
      // Dispatching an internal action instead.
      return next(fetchOfflineMode(action))
    }

    const isBackOnline = didComeBackOnline(action, isConnected)
    if (isBackOnline) {
      // Dispatching queued actions in order of arrival (if we have any)
      next(action)
      return releaseQueue(actionQueue)
    }

    // Checking if we have a dismissal case
    const isAnyActionToBeDismissed = findActionToBeDismissed(
      action,
      actionQueue,
    )

    if (isAnyActionToBeDismissed && !isConnected) {
      next(dismissActionsFromQueue(action.type))
    }

    // Proxy the original action to the next middleware on the chain or final dispatch
    return next(action)
  }
}

export const NetworkMiddlewareCreator = { createNetworkMiddleware }

export default createNetworkMiddleware
