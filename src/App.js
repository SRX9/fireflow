import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import MainPage from './Coponents/MainPage';
import 'tachyons';
import MediaQuery from 'react-responsive';
import { Route} from 'react-router-dom';
import Home from './Coponents/Home';
class App extends React.Component
{

  state={
    homeUser:""
  }

  setHomeUser=(val)=>{
    this.setState({homeUser:val});
  }

  render()
  {
    return(
      <MediaQuery minDeviceWidth={800} >
        {(matches) =>
          !matches
            ? <h1 style={{margin:0}}>You are retina</h1>
            : 
            <div className="" style={{overflowX:"hidden"}}>
              <Route path="/main" render={()=>{
                return <MainPage  homeUser={this.state.homeUser} />
              }}>
              </Route>
              <Route exact path="/" render={() => {
                return <Home getHomeUser={this.setHomeUser}/>
              }}>
              </Route>
            </div>}
      </MediaQuery>
    );
  }

}
  
export default App;
