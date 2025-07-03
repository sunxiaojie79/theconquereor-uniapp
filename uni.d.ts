declare const uni: any

declare global {
  interface Window {
    uni: any
  }
}

export = uni
export as namespace uni 