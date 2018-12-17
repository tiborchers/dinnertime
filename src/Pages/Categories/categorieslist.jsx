import React from 'react';
import axios from 'axios';
import { LinkContainer } from "react-router-bootstrap";
import Card from 'react-bootstrap/lib/Card'
import CardDeck from 'react-bootstrap/lib/CardDeck'
import 'bootstrap/dist/css/bootstrap.min.css';
import Autosuggest from 'react-autosuggest';
import Button from 'react-bootstrap/lib/Button'



export default class CategoriesList extends React.Component {
  state = {
    categories: [],
    categoriesAll:[],
    suggestions:[],
    value:'',
  }

  componentDidMount() {
    axios.get(`https://dinnertime-back.herokuapp.com/api/categories/`)
      .then(res => {
        const categories = res.data;
        this.setState({ categories: categories, categoriesAll:categories });
      });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };


whichCard(category){
  if (category.photo !== ""){
    return(<Card.Img variant="top" src={category.photo} />)
  }
}

getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : this.state.categoriesAll.filter(category =>
    category.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputValue)
  );
};

getFilter = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? this.state.categoriesAll: this.state.categoriesAll.filter(category =>
    category.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputValue)
  );
};

onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      categories: this.getFilter(newValue)
    });
  };

getSuggestionValue = suggestion => suggestion.name;

renderSuggestion = suggestion => (
  <span>
    {suggestion.name}
  </span>
);

onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  render() {

    const categories = this.state.categories;
    const value = this.state.value;
    const suggestions = this.state.suggestions;
    const inputProps = {
      placeholder: 'Busqueda',
      value,
      onChange: this.onChange
    };

    return (


        <div className = "main" >

          <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
      <br />
      <div className='newButton'>
        <Button type="button" variant="dark" onClick={() => this.props.history.push('/category/new')} className="small" block> Crear Nueva Categoria</Button>
      </div>
      <br />
          <div className = "center" >

          <CardDeck>
              {categories.map((category) => {

                return(
                  <div>
                    <LinkContainer to={ "/category/"+category.id.toString() }>

                    <Card>

                      {this.whichCard(category)}
                        <Card.Body>
                          <Card.Title>{category.name}</Card.Title>
                        </Card.Body>
                      </Card>

                    </LinkContainer>
                    <br />
                  </div>
                )
              }
            )
              }
          </CardDeck>
          </div>
      </div>
    )
  }
}
