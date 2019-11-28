import React from 'react';
import { Button, Divider } from 'antd'
import Dialog, { ExecProvider } from 'antd-dialog-exec'

const modules = [
  {
    name: 'Simple',
    dynamicComponent: ()=> import('./components/Simple'),
    wrappedProps: {},
    contentProps: {},
  },
  {
    name: 'SimpleStack',
    component: require('./components/SimpleStack').default,
  }
];

class App extends React.Component{

  public showModal = async ()=>{
    const instance = await Dialog.exec({ name: 'Simple', contentProps: {} })
    console.log(instance!.ref.current.display())
  }

  render(){
    return(
      <div style={{padding: 24}}>
        <ExecProvider modules={modules}>
          <Button type="primary" onClick={this.showModal}>
            Simple
          </Button>
          <Divider type='vertical' />
          <Button type="primary" onClick={()=> Dialog.exec({ name: 'SimpleStack' })}>
            Simple Stack
          </Button>
        </ExecProvider>
      </div>
    )
  }
}

export default App;
