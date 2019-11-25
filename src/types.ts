import { ReactElement, ComponentType, ComponentPropsWithRef } from 'react'
import { ModalProps } from 'antd/es/modal'
import { IContext } from './context'

// public
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U


type IDestroy = ()=> string
type IUpdate = (options: IUpdateOptions)=> string
type IAsyncComponent = ()=> Promise<{ default: IComponent}>

export type IWrappedProps = IModalProps
export type IContentProps = any

export type IUpdateOptions = {
  wrappedProps?: IWrappedProps
  contentProps?: IContentProps
}
export type IComponent = ComponentType<ComponentPropsWithRef<any>> & {
  defaultWrappedProps?: ModalProps
}

export type IExecOptions = {
  name: string
  // component?: IComponent
  // dynamicComponent?: IAsyncComponent
} & IUpdateOptions

export type IExec = (options?: IExecOptions)=> Promise<IInstance> | null
export type IRegister = ()=> void

export type IModalProps = ModalProps;

export type IModule = {
  name: string
}
& XOR<{ component?: IComponent }, { dynamicComponent?: IAsyncComponent }>
& IUpdateOptions

export interface IInstance {
  id: string
  render: ReactElement
  module: IModule
  ref: any
  destroy?: IDestroy
  update?: IUpdate
}

export interface WithDialogProps{
  dialog: {
    id: string
    destroy: IDestroy
    update: IUpdate
    updateWrapped: (options: IWrappedProps)=> string
    updateContent: (options: IContentProps)=> string
  } & IContext
}
