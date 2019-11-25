import React from 'react';
import Render from './Render'
import { uuid, invariant, defer } from './utils'
import { IModule, IInstance, IExec, IRegister, IExecOptions } from './types'

import Context, { initializeContext, IContext } from './context'

export * from './types'

interface IProps {
  modules: IModule[]
}

interface IState {
  context: IContext
}

interface IDialog {
  initialize: boolean,
  register: IRegister
  exec: IExec
}

const invariantInitialize = invariant('Place wating `CommandProvider` initialize, will you want to use this function. ');

const Dialog: IDialog = {
  initialize: false,
  register: ()=> invariantInitialize(!Dialog.initialize),
  exec: ()=> invariantInitialize(!Dialog.initialize),
}


export class CommandProvider extends React.Component<IProps, IState>{

  static defaultProps = {
    modules: []
  }

  public state: IState = {
    context: initializeContext
  }

  constructor(props: IProps){
    super(props)

    // 初始化context
    const { context } = this.state
    context.modules = props.modules
    Dialog.register = context.register = this.register
    Dialog.exec = context.exec = this.exec

    // 完成对象暴露
    Dialog.initialize = true
  }

  // 注册模块
  public register = ()=>{

  }

  // 执行模块
  public exec: IExec = async (options = { name:'' })=>{
    const { name } = options
    if( !name ) return invariant(`You should config name.`)(true);
    const { context } = this.state
    const { modules } = context
    const module = modules.find(modules=> modules.name === name);
    if( !module ) return invariant(`Dont fond \`${name}\` module.`)(true);
    const instance = await this.createInstance(module, options)
    return instance;
  }

  // 创建实例
  private createInstance = (module: IModule, options: IExecOptions)=>{
    const deferred = defer()
    const id = uuid();
    const render = <Render key={id} id={id} mounted={mounted} destroyInstance={this.destroyInstance} module={module} options={options} />;
    const instance: any = { render, id, module }

    // 挂在后
    function mounted(ref){
      instance.destroy = ref.destroy;
      instance.update = ref.update;
      instance.ref = ref.contentRef || {};
      deferred.resolve( instance as IInstance );
    }

    // 更新状态
    const { context } = this.state
    context.instances.push( instance )
    this.setState({ context: { ...context } })

    // 返回 Promise
    return deferred.promise;
  }

  // 销毁实例
  private destroyInstance = (id: string)=>{
    const { context } = this.state
    const index = context.instances.findIndex((instance)=> instance.id === id )
    if( index < 0 ) return
    context.instances.splice(index, 1)
    this.setState({ context: { ...context } })
    return id
  }

  render(){
    const { context } = this.state
    const { children } = this.props
    return (
      <Context.Provider value={context}>
        {children}
        {context.instances.map(instance => instance.render)}
      </Context.Provider>
    )
  }
}

export default Dialog;
