import React from 'react';
import { Button } from 'antd'
import Dialog, { ExecProvider } from 'antd-dialog-exec'

const modules = [{
  name: 'Simple',
  // component: require('./components/Simple').default,
  dynamicComponent: ()=> import('./components/Simple'),
  wrappedProps: {},
}];

class App extends React.Component{

  public showModal = async ()=>{
    const instance = await Dialog.exec({ name: 'Simple', wrappedProps: { title: '99999' } })
  }

  render(){
    return(
      <ExecProvider modules={modules}>
        <Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button>
      </ExecProvider>
    )
  }
}

export default App;
