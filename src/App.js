import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import MainPage from './Coponents/MainPage';
import 'tachyons';
import MediaQuery from 'react-responsive';
import { Route} from 'react-router-dom';
import Home from './Coponents/Home';
import mobile from ".././src/bb.png";
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
            ? <div className="h-100" 
              style={{ width:"100vw",height:"100vh",
              backgroundImage:"url("+mobile+")",
              backgroundSize:"cover",
              backgroundPosition:"center" }}>
            </div>
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
