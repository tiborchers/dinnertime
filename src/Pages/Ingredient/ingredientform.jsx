import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const APILink = 'https://dinnertime-back.herokuapp.com/api/'
/* const APILink = 'http://127.0.0.1:8000/api/' */

export default class IngredientForm extends React.Component {
  state = {
    ingredient: {
      id:0,
      photo: '',
      generalIngredient:null,
    },
    ingredients: [],
    new: true,
    done: false,
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id){
    axios.get(`${APILink}ingredients/${ id }`)
      .then(res => {

        let ingredient = this.cleanForEdit(res.data);
        console.log(res.data);
        this.setState({ 'ingredient': ingredient, 'new':false });
      });
    }
    axios.get(`${APILink}ingredients/`)
        .then(res => {
          const ingredients = res.data;
          this.setState({ 'ingredients': ingredients,});
        });
  }


  showDeleteButton(){
    if(!this.state.new){
        return(
          <div>
            <Button type="button" variant="danger" onClick={this.onDelete} className="small"> Borrar!</Button>
          </div>
        );
    }
  }

  showCreateOrEdit(){
    if(!this.state.new){
        return(
          <div>
            <Button type="button" variant="success" onClick={this.onEdit} className="small" block> Editar!</Button>
          </div>
        );
    }
    else{
      return(
        <div>
          <Button type="button" variant="success" onClick={this.onSubmit} className="small" block> Listo!</Button>
        </div>
      );

    }
  }


  onSubmit=() => {

    let ingredient = this.state.ingredient;
    ingredient = this.cleanForSumbit(ingredient);
    console.log(ingredient);
    axios.post(`${APILink}ingredients/`,ingredient)
      .then(res => {
        this.props.history.push('/ingredient/'+res.data.id)
      })
      .catch(error => {
    console.log(error)
});

  }

  onDelete=() => {
    const { id } = this.props.match.params;
    axios.delete(`${APILink}ingredients/${ id }`)
      .then(res => {
        return(
          this.props.history.push('/ingredient')
        )
      })
      .catch(error => {
    console.log(error)
});

  }

  onEdit=() => {
    let ingredient = this.state.ingredient;
    ingredient = this.cleanForSumbit(ingredient);
    const { id } = this.props.match.params;
    axios.put(`${APILink}ingredients/${ id }/`, ingredient)
      .then(res => {
        return(
          this.props.history.push('/ingredient/'+res.data.id)
        )
      })
      .catch(error => {
    console.log(error)
});

  }

  handleIngredientChange = (newIngredient) =>{
    console.log(newIngredient);
    this.setState(prevState => ({
      ingredient: {
        ...prevState.ingredient,
        generalIngredient: newIngredient,
      }
    }));
  }

  transformOptions(preOption){
    let newOptions = preOption.map(function(element){return {value: element, label:element.name}});
    return newOptions;

  }

  cleanForSumbit(){

    let ingredient = this.state.ingredient;
    console.log(ingredient);
    if( ingredient.generalIngredient ){
      ingredient.generalIngredient = this.state.ingredient.generalIngredient.value.id;
    }
    return ingredient;

  }

  cleanForEdit(ingredient){

    let newIngredient = ingredient;
    if(newIngredient.generalIngredient){
      newIngredient.generalIngredient = {label:newIngredient.generalIngredient.name, value: newIngredient.generalIngredient}
    }

    return newIngredient;


  }

  render() {
    return (
      <div className = "main-form">
        <div className = 'title'>
         <h1> Nuevo Ingrediente  </h1>
       </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Nombre:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.ingredient.name}
            placeholder='Nombre Ingrediente'
            onBlur={e =>{
              var text = e.target.value;
              this.setState(prevState => (
                {
                  ingredient: {
                    ...prevState.ingredient,
                    name: text,
                  }
                }
              )
            )
          }
        }
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Foto:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.ingredient.photo}
            placeholder='solo una urls por ahora jeje'
            onBlur={ (e) => {
              var text = e.target.value;
              this.setState(prevState => ({
              ingredient: {
                ...prevState.ingredient,
                photo: text,
              }
            }))} }
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Ingrediente:  </Form.Label>
            <Select
            value={this.state.ingredient.generalIngredient}
            onChange={e => this.handleIngredientChange(e)}
            options={this.transformOptions(this.state.ingredients)}
          />
      </Form.Group>
        </div>

        <div>
        {this.showDeleteButton()}
        </div>
        <div>
          {this.showCreateOrEdit()}
        </div>
      </div>
    )
  }
}
