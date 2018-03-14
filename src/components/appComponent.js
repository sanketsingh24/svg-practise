import {Component} from "react";
import {ChordComponent} from "./chordComponent";
import d3 from "d3";
import $ from "jquery";
import { Sidebar, Segment, Dropdown, Button, Menu, Image, Icon, Header } from 'semantic-ui-react';
import FilteredMultiSelect from 'react-filtered-multiselect';
import jQuery from 'jquery';
window.jQuery = jQuery;

export class AppComponent extends Component{
  constructor(props){
    super(props);
    this.state = {
      master        : {},
      data_index    : 0,
      filters       : {},
      hasFilters    : false,
      tooltip       : {},
      pFormat       : d3.format(".1%"),
      qFormat       : d3.format(",.0f"),
      visible       : false,
      options       : [],
      labels        : [],
      chord_labels  : [],
      rank          : [],
      kcategory      : [],
      options_keywords: [],
      keywords      : [],
      visible_keywords : [],
      options_taxonomies : [],
      taxonomies    : [],
      visible_taxonomies : [],
      selectedOptions: [],
      options_dropdown: [{ key: 0, text: 'None', value: 0 },
                { key: 1, text: 'Chord Daigram', value: 1 },
                { key: 2, text: 'Pie Chart', value: 2 },
                { key: 3, text: 'Heat Map', value: 3 },
                { key: 4, text: 'Bar Chart', value: 4 }]
    };
    this.importJSON     = this.importJSON.bind(this);
    this.addFilter      = this.addFilter.bind(this);
    this.update         = this.update.bind(this);
    this.updateLabel    = this.updateLabel.bind(this);
    this.updateTooltip  = this.updateTooltip.bind(this);
    this.reset          = this.reset.bind(this);
    this.setFilters     = this.setFilters.bind(this);
    this.onRankSelect   = this.onRankSelect.bind(this);
    this.handleKeywordsAdd = this.handleKeywordsAdd.bind(this);
    this.handleKeywordsDelete = this.handleKeywordsDelete.bind(this);
    this.handleTaxonimiesAdd = this.handleTaxonimiesAdd.bind(this);
    this.handleTaxonimiesDelete = this.handleTaxonimiesDelete.bind(this);
    this.setChordParams   = this.setChordParams.bind(this);
  }

  // NO NEED FOR THIS, SEE importJSON()
  // componentDidMount(){
  //   axios.get("https://api.myjson.com/bins/1g8w3b")
  //    .then((response)=>{
  //     this.setState(()=>{
  //              return {
  //                selectedOptions: response.data.taxonomy,
  //                options: response.data.taxonomy
  //              }
  //     })
  //    })     
  // }

  addFilter = (name) => {
    let filters = this.state.filters;
    filters[name] = {
      name  : name,
      hide  : true
    };
    this.setState({
      hasFilters : true,
      filters : filters
    });
    this.update()
  };
 
  handleDeselect = (deselectedOptions) => {
    var selectedOptions = this.state.selectedOptions.slice()
    deselectedOptions.forEach(option => {
      selectedOptions.splice(selectedOptions.indexOf(option), 1)
    })
    this.setState({selectedOptions})
  };

  handleKeywordsAdd = (items) => {
    let keywords = [].concat(this.state.options_keywords);
     let visible_keywords = [].concat(this.state.visible_keywords);
     visible_keywords = visible_keywords.concat(items);
     visible_keywords.forEach(item => {
       keywords.splice(keywords.indexOf(item), 1);
     });
     this.setState({
       keywords        : keywords,
       visible_keywords: visible_keywords
     })
   };
 
  handleKeywordsDelete = (items) => {
    let keywords = [].concat(this.state.options_keywords);
    let visible_keywords = [].concat(this.state.visible_keywords);
    items.forEach(item => {
      visible_keywords.splice(visible_keywords.indexOf(item), 1);
    });
    visible_keywords.forEach(item => {
      keywords.splice(keywords.indexOf(item), 1);
    });
    this.setState({
      keywords        : keywords,
      visible_keywords: visible_keywords
    })
  };

  handleTaxonimiesAdd = (items) => {
    let taxonomies = [].concat(this.state.options_taxonomies);
    let visible_taxonomies = [].concat(this.state.visible_taxonomies);
    visible_taxonomies = visible_taxonomies.concat(items);
    visible_taxonomies.forEach(item => {
      taxonomies.splice(taxonomies.indexOf(item), 1);
    });
    this.setState({
      taxonomies        : taxonomies,
      visible_taxonomies: visible_taxonomies
    })
  };
 
  handleTaxonimiesDelete = (items) => {
    let taxonomies = [].concat(this.state.options_taxonomies);
    let visible_taxonomies = [].concat(this.state.visible_taxonomies);
    items.forEach(item => {
      visible_taxonomies.splice(visible_taxonomies.indexOf(item), 1);
    });
    visible_taxonomies.forEach(item => {
      taxonomies.splice(taxonomies.indexOf(item), 1);
    });
    this.setState({
      taxonomies        : taxonomies,
      visible_taxonomies: visible_taxonomies
    })
  };

  handleSelect = (selectedOptions) => {
    selectedOptions.sort((a, b) => a.taxId - b.taxId)
    this.setState({selectedOptions})
  };

  // FETCH API HERE 
  //https://api.myjson.com/bins/sn97t
  //../../assets/trade.json
  importJSON() {
    let state = this.state;
    let _this = this;
    let keywords_import = [];
    let taxonomies_import = [];
    let label =[];
    let taxRank =[];
    let categoryy=[];
    d3.json('../../assets/chord.json', function (err, data) {
      data.fulldata.forEach(function (d) {
        let isKeyHere = false;
        let isTaxHere = false;
        d.taxId  = +d.taxId;
        d.spectCount = +d.spectCount;

        let keywords_obj = { keywordId: d.keywordId,  keywordName: d.keywordName }
        let taxonomy_obj = { taxId: d.taxId, taxonomyName: d.taxonomyName }

        keywords_import.forEach( function(keyword) {
          if(keyword.keywordId == keywords_obj.keywordId) {
            isKeyHere = true;
        }})

        if(!isKeyHere) {
          keywords_import.push(keywords_obj)
        }

        taxonomies_import.forEach( function(taxonomy) {
          if(taxonomy.taxId == taxonomy_obj.taxId) {
            isTaxHere = true;
        }})

        if(!isTaxHere) {
          taxonomies_import.push(taxonomy_obj)
        }
        if(!taxRank.includes(d.taxonomyRank)) {
          taxRank.push(d.taxonomyRank)
        }   
        if(!categoryy.includes(d.keywordCategory)) {
          categoryy.push(d.keywordCategory)
        }
        if (!state.master[0]) {
          state.master[0] = []; 
        }

        state.master[0].push(d);
      });

      keywords_import.forEach( function(keyword) {
        label.push(keyword.keywordName);
      })

      taxonomies_import.forEach( function(taxonomy) {
        label.push(taxonomy.taxonomyName);
      })

      _this.setState({
        master: state.master,
        keywords: keywords_import,
        taxonomies:taxonomies_import,
        options_keywords : keywords_import,
        options_taxonomies : taxonomies_import,
        labels:label,
        chord_labels:label,
        rank: taxRank,
        kcategory: categoryy
      });
      _this.update(state);
    });
  };

  onRankSelect = () => {
    let rank = document.getElementById('rank').value;
    let selectedTax = [];
    let state = this.state;
    let _this = this;
    if(rank == 'Select') {
      return _this.reset();
    }
    this.state.master[state.data_index].map((d)=>{
      if(d.taxonomyRank == rank && !selectedTax.includes(d.taxonomyName)) {
        selectedTax.push(d.taxonomyName);
      }
    })
    
    let labels = [].concat(this.state.labels);
    
    for(let tax in selectedTax){
      let taxIndex = labels.indexOf(selectedTax[tax]);
      if( taxIndex !== -1){
        labels.splice(taxIndex, 1);
      };
    };
    this.setState({
      chord_labels:labels,
    });
    this.updateLabel(labels);
  } 

  onCataSelect = () => {
    let cata = document.getElementById('cata').value;
    let state = this.state;
    let _this = this;
    if(cata == 'Select') {
      return _this.reset();
    }

    let selectedKey = [];
    this.state.master[state.data_index].map((d)=>{
      if(d.keywordCategory == cata && !selectedKey.includes(d.keywordName)) {
        selectedKey.push(d.keywordName);
      }
    })
    
    let labels = [].concat(this.state.labels);
    
    for(let key in selectedKey){
      let keyIndex = labels.indexOf(selectedKey[key]);
      if( keyIndex !== -1){
        labels.splice(keyIndex, 1);
      };
    };
    this.setState({
      chord_labels:labels,
    });
    this.updateLabel(labels);
  }

  setChordParams = (keywords , taxonomies) => {
    let labels = [].concat(this.state.labels);
    for(let key in keywords){
      let keyIndex = labels.indexOf(keywords[key].keywordName);
      if( keyIndex !== -1){
        labels.splice(keyIndex, 1);
      }
    }
    for(let tax in taxonomies){
      let taxIndex = labels.indexOf(taxonomies[tax].taxonomyName);
      if( taxIndex !== -1){
        labels.splice(taxIndex, 1);
      };
    };
    this.setState({
      chord_labels:labels,
    });
    this.updateLabel(labels);
  };

  setFilters(item, input){
    let state = this.state;
    state.filters[item.name] = {
        name: item.name,
        hide: input.target.checked
    }
    this.setState({
      filters : state.filters
    });
    this.update(state);
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible });

  reset = () => {
    let state = this.state;
    this.setState({
      keywords: state.options_keywords,
      visible_keywords : [],
      taxonomies : state.options_taxonomies,
      visible_taxonomies : [],
      chord_labels: state.labels
    });
    let data  = state.master[state.data_index];
    let groupLabels = [];
    this.child.modifyChords(data, groupLabels);
  };

  update = (state) => {
    state = state ? state : this.state;
    let data  = state.master[state.data_index];

    this.child.drawChords(data, state.chord_labels);
  };

  updateLabel = (groupLabels) => {
    let state = this.state;
    let data  = state.master[state.data_index];
    this.child.modifyChords(data, groupLabels);
  };

  updateTooltip = (data) => {
    this.setState({
      tooltip: data
    });
  };

  componentDidMount(){
    this.setState({
      isComponentMount: true
    });
    this.importJSON();
    $("#year_2005").trigger("click");
  };

  render(){
    let state = this.state;
    const { visible } = this.state

    return(
        <div>       
          <Sidebar.Pushable as={Segment}>
            <Sidebar
              as={Menu}
              animation='overlay'
              width='thin'
              direction='right'
              visible={visible}
              icon='labeled'
              vertical
              inverted>              
             <div className="close" onClick={this.toggleVisibility}></div>       
              <div className="row mt-50">
                <div className="col-sm-offset-3 col-sm-6">
                 <Dropdown  placeholder='Select Visualization' selection  options={this.state.options_dropdown}  />
                </div>
              </div>
              <br />
              <div>
                <div className="row">  
                  <div className="col-md-6">
                  <FilteredMultiSelect
                    placeholder="Select Keywords"
                    buttonText="Add"
                    classNames={{
                      filter: 'form-control',            
                      select: 'form-control',            
                      button: 'btn btn btn-block btn-default',            
                      buttonActive: 'btn btn btn-block btn-danger'          
                    }}
                    onChange={this.handleKeywordsAdd}
                    options={state.keywords}
                    textProp="keywordName"
                    valueProp="keywordId"
                  />    
                  </div> 
                  <div className="col-md-6">     
                  <FilteredMultiSelect
                    placeholder="Visible Keywords"
                    buttonText="Delete"
                    classNames={{
                      filter: 'form-control',            
                      select: 'form-control',
                      button: 'btn btn btn-block btn-default',           
                      buttonActive: 'btn btn btn-block btn-primary'
                    }}
                    onChange={this.handleKeywordsDelete}
                    options={state.visible_keywords}
                    textProp="keywordName"
                    valueProp="keywordId"
                  />
                  </div>   
                </div>
                <br/>
                <div className="row">  

                  <div className="col-md-6">
                  <FilteredMultiSelect
                    placeholder="Select Taxonomy"
                    buttonText="Add"         
                    classNames={{
                      filter: 'form-control',            
                      select: 'form-control',            
                      button: 'btn btn btn-block btn-default',            
                      buttonActive: 'btn btn btn-block btn-danger'
                    }}
                    onChange={this.handleTaxonimiesAdd}
                    options={state.taxonomies}
                    textProp="taxonomyName"
                    valueProp="taxId"
                  />
                  </div> 
                  <div className="col-md-6">
                  <FilteredMultiSelect
                    placeholder="Visible Taxonomy"
                    buttonText="Delete"
                    classNames={{
                      filter: 'form-control',            
                      select: 'form-control',
                      button: 'btn btn btn-block btn-default',           
                      buttonActive: 'btn btn btn-block btn-primary'
                    }}
                    onChange={this.handleTaxonimiesDelete}
                    options={state.visible_taxonomies}
                    textProp="taxonomyName"
                    valueProp="taxId"
                  />
                  </div>  
                </div><br/>
                <div className="row mt-20">
                <div className="col-sm-6">
                  <select id="rank" onChange={() => this.onRankSelect()}>
                    <option value="Select">Select Rank</option>
                    { state.isComponentMount ?
                      state.rank.map((r,i) =>
                      <option key={i} value={r} >{r}</option>
                    ): null}
                  </select>
                </div>
                <div className="col-sm-6">
                  <select id="cata" onChange={() => this.onCataSelect()}>
                    <option value="Select">Select Category</option>
                    { state.isComponentMount ?
                      state.kcategory.map((r,i) =>
                      <option key={i} value={r} >{r}</option>
                    ): null}
                  </select>
                </div>
              </div>
              <br />
                <Button primary floated='left' size='small' onClick={() => this.setChordParams(state.visible_keywords, state.visible_taxonomies)}>Submit </Button>
                <Button positive floated='left' size='small'  onClick={this.reset} >Reset</Button>
                <br/>
              </div> 
            </Sidebar>
          <Sidebar.Pusher>
          <Segment basic>
            <Button onClick={this.toggleVisibility} className="navbar-toggle">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </Button>
            <div className="row" style={{position:"relative"}}>
              <div className="large-8 small-6" role="content">
               <article id="chord">
                 {
                  state.isComponentMount ?
                <ChordComponent updateTooltip={this.updateTooltip}
                  addFilter={this.addFilter} onRef={ref => (this.child = ref)}
                  filters={state.filters}>
                </ChordComponent>
                          : null
                      }
               </article>
              </div>
                <fieldset id="tooltip" placement = "top" className="row" >
                  <div className="small-6 small-12 ">
                    <h6> Taxonomy Name: {state.tooltip.tname} <br/> Taxonomy ID: {state.tooltip.tid} <br/> Keyword Name: {state.tooltip.kname} <br/> Keyword ID: {state.tooltip.kid} <br/> Spect Count: {state.tooltip.tvalue} </h6> 
                  </div>
                 </fieldset>
            </div>
          </Segment>
          </Sidebar.Pusher>
          </Sidebar.Pushable> 
        </div>
);}}