
import React, { Component } from 'react';
import {Container, Sidebar, Dropdown,  Segment, Button, Menu, Icon } from 'semantic-ui-react';
import './styles/app.css';
import './styles/bootstrap.min.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      keywords: [],
      taxonomies: [],
      visible: false,
      options: [{ key: 0, text: 'None', value: 0 },
        { key: 1, text: 'Chord Daigram', value: 1 },
        { key: 2, text: 'Pie Chart', value: 2 },
        { key: 3, text: 'Heat Map', value: 3 },
        { key: 4, text: 'Bar Chart', value: 4 }]
    };

    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  };

  

  componentWillMount(){
    return fetch("https://api.myjson.com/bins/im1a5")
    // https://api.myjson.com/bins/hpbqh
      .then((response)=> response.json())
      .then((responseJson)=>{
        this.setState({
          keywords: responseJson.data.keywords,
          taxonomies: responseJson.data.taxonomies
        })})
  }

  render() {
    this.state;
    return(
      <div>
        <Sidebar.Pushable as={Segment}>
          <div className="ui icon Button">
            <Button basic floated='right' icon onClick={this.toggleVisibility}><Icon name='align justify'/></Button>
          </div>
          <Sidebar
            as={Menu}
            animation='overlay'
            width='very wide'
            direction='right'
            visible={this.state.visible}
            icon='labeled'
            vertical
          >
            <Segment>
              <div>
                <Container textAlign='right'>
                  <Icon onClick={this.toggleVisibility} floated='right' >
                    <Icon name='close'
                          size='large'/>
                  </Icon>
                </Container>
              </div>
              <br/>
              <div>
                <Dropdown  placeholder='Select Visualization' selection  options={this.state.options}  />
              </div>
              
            </Segment>
          </Sidebar>
          <Sidebar.Pusher>
            <AppComponent/>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
 )
  }
};

export default App;








/*
//first selection from slidebar
              <div className="row mt-20">
                <div className="col-sm-6">
                  <input type="text" placeholder="Select Keywords" />
                  <div id="select_key">
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                  </div>
                  <button id="select_add">
                    Add
                  </button>
                </div>
                <div className="col-sm-6">
                  <input type="text" placeholder="Visible Keywords" />
                  <div id="visible_key">
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                    <div>ASD</div>
                  </div>
                  <button id="visible_del">
                    Dekete
                  </button>
                </div>
              </div>
*/



/*
//second row in side bar
              <div className="row mt-20">
                <div className="col-sm-6">
                  <input type="text" placeholder="Select Taxonomy" />
                  <div id="select_key">
                    <div>ASD</div>
                  </div>
                  <button id="tax_add">
                    Add
                  </button>
                </div>
                <div className="col-sm-6">
                  <input type="text" placeholder="Visible Taxonomy" />
                  <div id="visible_key">
                    <div>ASD</div>
                  </div>
                  <button id="tax_del">
                    Dekete
                  </button>
                </div>
              </div>
*/



/*
//last row for reset and submit
              <div className="row mt-20">
                <div className="col-sm-12 text-left">
                  <button id="submit" onClick={this.reset}>
                    Submit
                  </button>
                  <button id="reset">
                    Reset
                  </button>
                </div>
              </div> 
*/









/*

                      <button className="button tiny right" onClick={this.reset}> Reset </button>

*/