import React from 'react';
import axios from 'axios';
import { LinkContainer } from "react-router-bootstrap";
import Card from 'react-bootstrap/lib/Card'
import CardDeck from 'react-bootstrap/lib/CardDeck'
import Button from 'react-bootstrap/lib/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import Autosuggest from 'react-autosuggest';




export default class RecipeList extends React.Component {
  state = {
    recipes: [],
    recipesAll:[],
    suggestions:[],
    value:'',
    loading: true,
  }

  componentDidMount() {
    axios.get(`https://dinnertime-back.herokuapp.com/api/recipes`)
      .then(res => {
        const recipes = res.data;
        this.setState({ recipes: recipes, recipesAll:recipes, loading:false });
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
    <br/>
    <div className='newButton'>
      <Button type="button" variant="dark" onClick={() => this.props.history.push('/recipe/new')} className="small" block> Crear Nueva Receta</Button>
    </div>
    {this.loading()}
          <div className = "center" >

          <CardDeck>
              {recipes.map((recipe) => {

                return(
                  <div>
                    <LinkContainer to={ "recipe/"+recipe.id.toString() }>

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
                    <br/>
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
