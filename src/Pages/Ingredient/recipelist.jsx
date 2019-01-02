import React from 'react';
import axios from 'axios';
import { LinkContainer } from "react-router-bootstrap";
import Card from 'react-bootstrap/lib/Card'
import CardDeck from 'react-bootstrap/lib/CardDeck'
import 'bootstrap/dist/css/bootstrap.min.css';
import Autosuggest from 'react-autosuggest';

const APILink = 'https://dinnertime-back.herokuapp.com/api/'
/* const APILink = 'http://127.0.0.1:8000/api/' */


export default class IngredientRecipeList extends React.Component {
  state = {
    recipes: [],
    recipesAll:[],
    suggestions:[],
    value:'',
    empty: false,
    loading: true,
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    axios.get(`${APILink}${id}/recipes/`)
      .then(res => {
        const recipes = res.data;
        if(recipes.length === 0){
          this.setState({ empty: true });
        }
        this.setState({ recipes: recipes, recipesAll:recipes, loading: false });
      });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };


whichCard(recipe){
  if (recipe.photo !== ""){
    return(<Card.Img variant="top" src={recipe.photo} />)
  }
}

getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : this.state.recipesAll.filter(recipe =>
    recipe.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputValue)
  );
};

getFilter = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? this.state.recipesAll: this.state.recipesAll.filter(recipe =>
    recipe.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(inputValue)
  );
};

onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
      recipes: this.getFilter(newValue)
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

  ifempty(){
    if(this.state.empty){
      console.log("JAJAJAJA")
      return(
        <img src="https://magictatersite.files.wordpress.com/2013/10/charizard_fsjal_by_shadowforce00-d6faej4.png" />
      );
    }
  }

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

    const recipes = this.state.recipes;
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
    {this.loading()}
          <div className = "center" >

          <CardDeck>
              {recipes.map((recipe) => {

                return(
                  <div>
                    <LinkContainer to={ "/recipe/"+recipe.id.toString() }>

                    <Card>

                      {this.whichCard(recipe)}
                        <Card.Body>
                          <Card.Title>{recipe.name}</Card.Title>
                          <Card.Text>
                            {recipe.author.nickName}
                          </Card.Text>
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
          <div>
            {this.ifempty()}
          </div>
      </div>
    )
  }
}
