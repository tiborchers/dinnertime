import React from 'react';
import axios from 'axios';
import { LinkContainer } from "react-router-bootstrap";
import Card from 'react-bootstrap/lib/Card'
import CardDeck from 'react-bootstrap/lib/CardDeck'
import 'bootstrap/dist/css/bootstrap.min.css';
import Autosuggest from 'react-autosuggest';
import Button from 'react-bootstrap/lib/Button'

const APILink = 'https://dinnertime-back.herokuapp.com/api/'
/* const APILink = 'http://127.0.0.1:8000/api/' */

export default class IngredientList extends React.Component {
  state = {
    ingredients: [],
    ingredientsAll:[],
    suggestions:[],
    value:'',
    loading: true,
  }

  componentDidMount() {
    axios.get(`${APILink}ingredients/`)
      .then(res => {
        const ingredients = res.data;
        this.setState({ ingredients: ingredients, ingredientsAll:ingredients, loading: false });
      });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };


whichCard(ingredient){
  if (ingredient.photo !== ""){
    return(<Card.Img variant="top" src={ingredient.photo} />)
  }
}

getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : this.state.ingredientsAll.filter(ingredient =>
    ingredient.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputValue)
  );
};

getFilter = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? this.state.ingredientsAll: this.state.ingredientsAll.filter(ingredient =>
    ingredient.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputValue)
  );
};

onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      ingredients: this.getFilter(newValue)
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

  loading(){
    if(this.state.loading){
      return(
        <div class="spinner">
  <div class="double-bounce1"></div>
  <div class="double-bounce2"></div>
</div>


      );

    }
  }

  render() {

    const ingredients = this.state.ingredients;
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
        <Button type="button" variant="dark" onClick={() => this.props.history.push('/ingredient/new')} className="small" block> Crear Nuevo Ingrediente</Button>
      </div>
      <br />
      {this.loading()}
    <div className = "ing-center" >

          <CardDeck>
              {ingredients.map((ingredient) => {

                return(
                  <div>
                    <LinkContainer to={ "ingredient/"+ingredient.id.toString() }>

                    <Card bg="light" >

                      {this.whichCard(ingredient)}
                        <Card.Body>
                          <Card.Title>{ingredient.name}</Card.Title>
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
