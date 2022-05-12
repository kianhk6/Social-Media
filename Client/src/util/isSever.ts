export const isServer = () => typeof window === "undefined" // we are on a server or not
// if window active able to access in browser means we are already on server