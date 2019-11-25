import React, { useEffect } from 'react';
import ReactDOM from 'react-dom'
import { Modal, Spin } from 'antd'

import { IModule, IModalProps, IExecOptions, IUpdateOptions, WithDialogProps, IComponent, IWrappedProps, IContentProps } from './types'
import Context, { IContext } from './context'

interface IProps{
  id: string
  mounted: (ref)=> void
  module: IModule
  options: IExecOptions
  destroyInstance: (id: string)=> string
}

interface IState{
  visible: boolean
  wrappedProps: IModalProps
  contentProps: any
  ContentComponent: IComponent
}

export default class extends React.Component<IProps, IState>{

  static contextType = Context

  public context: IContext

  public contentRef = React.createRef<any>()

  public dom: Element

  public isDynamic: boolean = false

  public ContentComponent: IComponent


  public state: IState = {
    visible: true,
    wrappedProps: {},
    contentProps: {},
    ContentComponent: null
  }

  public withDialogProps: WithDialogProps

  public constructor (props: IProps){
    super(props);
    const { module:{ component, dynamicComponent, wrappedProps={}, contentProps={} }, options } = props
    if( !component && dynamicComponent ){
      this.getDynamicComponent(dynamicComponent);
      this.isDynamic = true
    }else{
      this.state.ContentComponent = component
    }
    const { ContentComponent } = this.state
    const { isDynamic } = this
    
    const defaultWrappedProps = !isDynamic ? ContentComponent.defaultWrappedProps || {} : {}
    const defaultContentProps = !isDynamic ? ContentComponent.defaultProps || {} : {}

    this.state.wrappedProps = Object.assign({}, defaultWrappedProps, wrappedProps, options.wrappedProps || {})
    this.state.contentProps = Object.assign({}, defaultContentProps, contentProps, options.contentProps || {})
  }

  public componentWillMount(){
    const { id } = this.props
    this.withDialogProps = {
      dialog: { ...this.context, destroy: this.destroy, update: this.update, updateWrapped: this.updateWrapped, updateContent: this.updateContent, id }
    }
  }

  public componentDidMount(){
    const { mounted } = this.props;
    mounted(this);
  }

  public securityDidMount = () => {
    console.log(`.${this.props.id}`)
    const wdom = document.createElement('div')
    wdom.className=''
    wdom.style.position = 'absolute';
    wdom.style.width = '100%';
    wdom.style.height = '100%';
    wdom.style.left = '0';
    wdom.style.top = '0';
    wdom.style.backgroundColor = '#ffffff80';
    this.dom = document.querySelector(`.${this.props.id} .ant-modal-content`).appendChild( wdom )
    ReactDOM.render( <Spin style={{ position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }} spinning={true} />, this.dom)
  }

  public destroy = ()=>{
    const { id } = this.props
    this.setState({ visible: false })
    return id;
  }

  public update = ( options: IUpdateOptions )=>{
    const { instances } = this.context
    if( instances.find(instance=> instance.id === this.props.id ) ){
      Object.assign(this.state.wrappedProps, options.wrappedProps || {})
      Object.assign(this.state.contentProps, options.contentProps || {})
      this.setState({ ...this.state });
      return this.props.id
    }
  }

  public updateWrapped = (wrappedProps?: IWrappedProps)=>{
    const { instances } = this.context
    if( instances.find(instance=> instance.id === this.props.id ) ){
      Object.assign(this.state.wrappedProps, wrappedProps || {})
      this.setState({ ...this.state });
      return this.props.id
    }
  }

  public updateContent = (contentProps?: IContentProps)=>{
    const { instances } = this.context
    if( instances.find(instance=> instance.id === this.props.id ) ){
      Object.assign(this.state.contentProps, contentProps || {})
      this.setState({ ...this.state });
      return this.props.id
    }
  }

  private handleAfterClose = ()=>{
    const { id, destroyInstance } = this.props;
    const { wrappedProps: { afterClose } } = this.state
    destroyInstance(id)
    afterClose && afterClose()
  }

  private getDynamicComponent = ( dynamicComponent )=>{
    const state = this.state
    return dynamicComponent().then(({ default: ContentComponent })=>{
      const wrappedProps = Object.assign({}, ContentComponent.defaultWrappedProps || {}, state.wrappedProps)
      const contentProps = Object.assign({}, ContentComponent.defaultProps || {}, state.contentProps)
      this.setState({ ContentComponent, wrappedProps, contentProps }, ()=>{
        this.dom && this.dom.remove();
      })
    }).catch((err)=>{
      console.error(err)
    })
  }

  render(){
    const { state, props } = this

    const { visible, wrappedProps, contentProps, ContentComponent } = state
    const { id } = props
    const loading = !ContentComponent
   

    return(
        <Modal {...wrappedProps} wrapClassName={id} forceRender={false} visible={visible} afterClose={this.handleAfterClose} >
          { loading ? <Security moutend={this.securityDidMount} /> : null }
          { loading ? <div style={{height: 40}} /> : <ContentComponent {...contentProps} {...this.withDialogProps} ref={this.contentRef} /> }
        </Modal>
    )
  }
}

// 渲染页面
function Security({ moutend }){
  useEffect(()=>{ moutend() }, [])
  return null
}