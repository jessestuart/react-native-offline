export interface State {
  isConnected: boolean
}

export interface FluxAction {
  type: string
  payload: any
  meta?: {
    retry?: boolean
    dismiss?: string[]
  }
}

export interface FluxActionWithPreviousIntent {
  type: string
  payload: {
    prevAction?: FluxAction
    prevThunk?: Function
  }

  meta: {
    retry?: boolean
    dismiss?: string[]
  }
}

export interface FluxActionForRemoval {
  type: string
  payload: FluxAction | Function
}

export interface FluxActionForDismissal {
  type: string
  payload: string
}

export interface NetworkState {
  isConnected: boolean
  actionQueue: any[]
}

export type HTTPMethod = 'HEAD' | 'OPTIONS' | 'FAIL'
