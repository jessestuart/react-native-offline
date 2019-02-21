type MaybeNumber = number | null

let interval: MaybeNumber = null

// @Deprecated
export function getInterval(): MaybeNumber {
  return interval
}

// @Deprecated
export function setup(checkFn: Function, t: number): void {
  if (t > 0 && !interval) {
    interval = setInterval(checkFn, t)
  }
}

// @Deprecated
export function clear(): void {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

export default {
  getInterval,
  setup,
  clear,
}

// export default class ConnectivityIntervalChecker {
//   private static interval: MaybeNumber = null

//   public static getInterval(): MaybeNumber {
//     return this.interval
//   }

//   public static setup(checkFn: Function, t: number) {
//     if (t > 0 && !this.interval) {
//       this.interval = setInterval(checkFn, t)
//     }
//   }

//   public static clear(): void {
//     if (this.interval) {
//       clearInterval(this.interval)
//       this.interval = null
//     }
//   }
// }
