import React from 'react'

import { IModule, IInstance, IExec, IRegister } from './types'

export interface IContext {
  modules: IModule[]
  instances: IInstance[]
  register?: IRegister
  exec?: IExec
}

export const initializeContext = {
  modules: [],
  instances: [],
}

export default React.createContext<IContext>(initializeContext)
