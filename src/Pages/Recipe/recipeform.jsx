import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




export default class RecipeForm extends React.Component {
  state = {
    recipe: {
      id:0,
      name: '',
      category:[],
      steps:[{text:'',photo:'', optional: false,order:1}],
      photo:'',
      video_url:'',
      ingredients:[{ingredient:{id:0, name:''},id:0, quantity: 0, measure:'',customMeasure: '',alternatives: []}],
      author:{id:0, name:'', nickname:''},
    },
    new: true,
    done: false,
    show: false,
    categories: [],
    authors:[{label: 'Borcho',
      value:{
            "id": 1,
            "email": "tiborchers@uc.cl",
            "name": "Tomás",
            "lastName": "Borchers",
            "nickName": "Borcho",
            "photo": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/11/11e22b61895c554eabda697ce0b703c5bbaeaf6b_full.jpg"
        }},
        {label: 'Flo', value: {
            "id": 2,
            "email": "fmluque@uc.cl",
            "name": "Florencia",
            "lastName": "Luque",
            "nickName": "Flo",
            "photo": null
        }}],
    ingredients:[],
    measure:[
      {value:"Gramos",label:"Gramos"},
      {value:"Kilogramos",label:"Kilogramos"},
      {value:"Tazas",label:"Tazas"},
      {value:"Cucharas",label:"Cucharas"},
      {value:"Cucharitas",label:"Cucharitas"},
      {value:"Litros",label:"Litros"},
      {value:"Partes",label:"Partes"},
      {value: "Unidades", label:"Unidades"},
      {value:"Al gusto",label:"Al gusto"},
      {value:"Otro",label:"Otro"} ]
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id){
    axios.get(`https://dinnertime-back.herokuapp.com/api/recipes/${ id }`)
      .then(res => {
        let recipe = res.data;
        recipe = this.cleanForEdit(recipe);

        this.setState({ 'recipe': recipe, 'new':false });
      });

    }
    axios.get(`https://dinnertime-back.herokuapp.com/api/categories/`)
      .then(res => {
        const categories = res.data;
        this.setState({ 'categories': categories,});
      });
    axios.get(`https://dinnertime-back.herokuapp.com/api/ingredients/`)
        .then(res => {
          const ingredients = res.data;
          this.setState({ 'ingredients': ingredients,});
        });
  }

  handleIngredientQuantityChange = (idx) => (evt) => {
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, quantity: evt.target.value };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleIngredientCustomMeasureChange = (idx) => (evt) => {
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, customMeasure: evt.target.value };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleIngredientMeasureChange = (idx, newMeasure) =>{
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, measure: newMeasure };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleIngredientChange = (idx, newIngredient) =>{
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, ingredient: newIngredient };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleAddIngredient = () => {
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: this.state.recipe.ingredients.concat([{ingredient:{id:0, name:''}, quantity: 0, measure:'',customMeasure: null,alternatives: []}]),
      }
    }));

  }

  handleRemoveIngredient = (idx) => () => {
    this.setState(prevState => ({
      recipe: { ...prevState.recipe,
        ingredients: this.state.recipe.ingredients.filter((s, sidx) => idx !== sidx)
      }
    }));
  }

  showCustomMeasureField(ingredient, i){
    if(ingredient.measure){
      if (ingredient.measure.label === 'Otro'){
        return(
          <div>
            <Form.Label htmlFor='measure'> Medida:  </Form.Label>
            <Form.Control
              type='text'
              value={ingredient.customMeasure}
              placeholder='Medida'
              onChange={this.handleIngredientMeasureChange(i)}
              />
          </div>
        );
      }
    }
  }

  ingredientRow(ingredient, i){
    return(
      <li key={i}>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Ingrediente:  </Form.Label>
            <Select
            value={ingredient.ingredient}
            onChange={e => this.handleIngredientChange(i,e)}
            options={this.transformOptions(this.state.ingredients)}
          />
      </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='photo'> Cantidad:  </Form.Label>
          <input
            type='number'
            step="0.01"
            value={ingredient.quantity}
            min="0"
            max="10000"
            placeholder='0'
            onChange={this.handleIngredientQuantityChange(i)}
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='Measures'> Medida:  </Form.Label>
            <Select
            value={ingredient.measure}
            onChange={e => this.handleIngredientMeasureChange(i,e)}
            options={this.state.measure}
          />
      </Form.Group>
        </div>
        <div>
          <Form.Group>
            <Form.Label htmlFor='Optional'> Opcional:  </Form.Label>
        <Form.Check
          inline
          type='checkbox'
          checked={ingredient.optional}
          onChange={this.handleIngredientOptionalChange(i)}
          />
        </Form.Group>
        </div>
        <div>
          {this.showCustomMeasureField(ingredient,i)}
        </div>
        <div>
          <ol>
            {ingredient.alternatives.map((alternative, j) => (

                this.alternativeIngredientRow(alternative,i,j)

            ))}
          </ol>
          <Button variant="outline-primary" type="button" onClick={this.handleAddAlternativeIngredient(i)} >Agregar Ingrediente Alternativo </Button>
        </div>
        <Button type="button" variant="outline-danger" onClick={this.handleRemoveIngredient(i)} >Quitar Ingrediente</Button>
      </li>
    )
  }

  handleAlternativeIngredientQuantityChange = (idx, jidx) => (evt) => {
    const newAlternatives = this.state.recipe.ingredients[idx].alternatives.map((alternative, sidx) => {
      if (jidx !== sidx) return alternative;
      return { ...alternative, quantity: evt.target.value };
    });
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, alternatives: newAlternatives };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleAlternativeIngredientCustomMeasureChange = (idx, jidx)  => (evt) => {
    const newAlternatives = this.state.recipe.ingredients[idx].alternatives.map((alternative, sidx) => {
      if (jidx !== sidx) return alternative;
      return { ...alternative, customMeasure: evt.target.value };
    });
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, alternatives: newAlternatives };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleAlternativeIngredientMeasureChange = (idx,jidx, newMeasure) => {
    const newAlternatives = this.state.recipe.ingredients[idx].alternatives.map((alternative, sidx) => {
      if (jidx !== sidx) return alternative;
      return { ...alternative, measure: newMeasure};
    });
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, alternatives: newAlternatives };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleAlternativeIngredientChange = (idx,jidx, newIngredient) =>{
    const newAlternatives = this.state.recipe.ingredients[idx].alternatives.map((alternative, sidx) => {
      if (jidx !== sidx) return alternative;
      return { ...alternative, ingredient: newIngredient};
    });
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, alternatives: newAlternatives };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleAddAlternativeIngredient = (idx) =>() => {;
    const newAlternatives = this.state.recipe.ingredients[idx].alternatives.concat([{id:0,originalIingredient: this.state.recipe.ingredients[idx].ingredient.id,ingredient:{id:0, name:''}, quantity: 0, measure:'',customMeasure: null,alternatives: []}]);
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, alternatives: newAlternatives };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));

  }

  handleRemoveAlternativeIngredient = (idx, jidx)=>() =>{
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, alternatives: this.state.recipe.ingredients[idx].alternatives.filter((s, sidx) => jidx !== sidx) };
    });
    this.setState(prevState => ({
      recipe: { ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  showAlternativeCustomMeasureField(ingredient, i,j){
    if(ingredient.measure){
      if (ingredient.measure.label === 'Otro'){
        return(
          <div>
            <label htmlFor='measure'> Medida:  </label>
            <input
              type='text'
              value={ingredient.customMeasure}
              placeholder='Medida'
              onChange={this.handleIngredientMeasureChange(i)}
              />
          </div>
        );
      }
    }
  }

  alternativeIngredientRow(ingredient, i, j){
    return(
      <li key={j}>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Ingrediente Alternativo:  </Form.Label>
            <Select
            value={ingredient.ingredient}
            onChange={e  => this.handleAlternativeIngredientChange(i,j,e)}
            options={this.transformOptions(this.state.ingredients)}
          />
          </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='photo'> Cantidad:  </Form.Label>
          <input
            type='number'
            step="0.01"
            value={ingredient.quantity}
            min="0"
            max="10000"
            placeholder='0'
            onChange={this.handleAlternativeIngredientQuantityChange(i,j)}
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='Measures'> Medida:  </Form.Label>
            <Select
            value={ingredient.measure}
            onChange={e => this.handleAlternativeIngredientMeasureChange(i,j,e)}
            options={this.state.measure}
          />
      </Form.Group>
        </div>
        <div>
          {this.showAlternativeCustomMeasureField(ingredient,i,j)}
        </div>

        <Button type="button" variant="outline-danger" onClick={this.handleRemoveAlternativeIngredient(i,j)} className="small">Quitar Ingrediente Alternativo</Button>
      </li>
    )
  }

  handleStepTextChange = (idx) =>  (evt) => {
    const newSteps = this.state.recipe.steps.map((step, sidx) => {
      if (idx !== sidx) return step;
      return { ...step, text: evt.target.value };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        steps: newSteps,
      }
    }));
  }

  handleStepPhotoChange = (idx) => (evt) => {
    const newSteps = this.state.recipe.steps.map((step, sidx) => {
      if (idx !== sidx) return step;
      return { ...step, photo: evt.target.value };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        steps: newSteps,
      }
    }));
  }

  handleStepOptionalChange = (idx) => (evt) => {
    const newSteps = this.state.recipe.steps.map((step, sidx) => {
      if (idx !== sidx) return step;
      return { ...step, optional: !step.optional };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        steps: newSteps,
      }
    }));
  }

  handleIngredientOptionalChange = (idx) => (evt) => {
    const newIngredients = this.state.recipe.ingredients.map((ingredient, sidx) => {
      if (idx !== sidx) return ingredient;
      return { ...ingredient, optional: !ingredient.optional };
    });
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        ingredients: newIngredients,
      }
    }));
  }

  handleAddStep = () => {
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        steps: this.state.recipe.steps.concat([{text:'',photo:'', optional: false,order:this.state.recipe.steps.length + 1}]),
      }
    }));

  }

  handleRemoveStep = (idx) => () => {
    this.setState(prevState => ({
      recipe: { ...prevState.recipe,
        steps: this.state.recipe.steps.filter((s, sidx) => idx !== sidx)
      }
    }));
  }



  stepRow(step, i){
    return(
      <li key={step.order}>

        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Instrucción:  </Form.Label>
          <Form.Control as="textarea" rows="5"
            defaultValue={step.text}
            placeholder='Ingrese Texto'
            onBlur={this.handleStepTextChange(i)}
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='photo'> Foto:  </Form.Label>
          <Form.Control
            type='text'
            defaultValue={step.photo}
            placeholder='solo una urls por ahora jeje'
            onBlur={this.handleStepPhotoChange(i)}
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='Optional'> Opcional:  </Form.Label>
          <Form.Check
            inline
            type='checkbox'
            checked={step.optional}
            onChange={this.handleStepOptionalChange(i)}
            />
          </Form.Group>

        </div>

        <Button type="button" variant="outline-danger" onClick={this.handleRemoveStep(i)} className="small">Quitar Paso</Button>
      </li>
      )
    }

  transformOptions(preOption){
    let newOptions = preOption.map(function(element){return {value: element, label:element.name}});
    return newOptions;

  }

  handleCategoryChange = (newCategory) =>{
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        category: newCategory,
      }
    }));
  }

  handleAuthorChange = (newAuthor) => {
    this.setState(prevState => ({
      recipe: {
        ...prevState.recipe,
        author: newAuthor,
      }
    }));
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

  cleanForSumbit(){

    let recipes = this.state.recipe;
      console.log(recipes);
    let newCategories = recipes.category.map((category) => {return category.value.id});
    let newIngredients = recipes.ingredients.map((ingredient) => {
      let newAlternatives = ingredient.alternatives.map((alternative) => {
        return{...alternative, ingredient: alternative.ingredient.value.id, measure:alternative.measure.value };

      });
      return{...ingredient, ingredient: ingredient.ingredient.value.id, measure:ingredient.measure.value, alternatives: newAlternatives };
    });
    recipes.category = newCategories;
    recipes.author = this.state.recipe.author.value.id;
    recipes.ingredients = newIngredients;
    console.log(newIngredients);
    return recipes;

  }

  cleanForEdit(recipe){

    let newRecipe = recipe;
    newRecipe.author = {label:newRecipe.author.nickName, value: newRecipe.author}
    newRecipe.category = this.transformOptions(newRecipe.category);
    let newIngredients = newRecipe.ingredients.map((ingredient) => {
      let newAlternatives = ingredient.alternatives.map((alternative) => {
        return{...alternative, ingredient:{value: alternative.ingredient, label:alternative.ingredient.name} , measure: {value: alternative.measure, label:alternative.measure} };

      });
      return{...ingredient, ingredient: {value: ingredient.ingredient, label:ingredient.ingredient.name}, measure: {value: ingredient.measure, label:ingredient.measure}, alternatives: newAlternatives };
    });

    newRecipe.ingredients = newIngredients;
    console.log(newRecipe);

    return newRecipe;


  }

  onSubmit=() => {

    let recipe = this.cleanForSumbit(this.state.recipe);
    axios.post(`https://dinnertime-back.herokuapp.com/api/recipes/`,recipe)
      .then(res => {
        this.props.history.push('/recipe/'+res.data.id)
      })
      .catch(error => {
    console.log(error)
});

  }

  onDelete=() => {
    const { id } = this.props.match.params;
    axios.delete(`https://dinnertime-back.herokuapp.com/api/recipes/${ id }`)
      .then(res => {
        return(
          this.props.history.push('/recipe')
        )
      })
      .catch(error => {
    console.log(error)
});

  }

  onEdit=() => {
    let recipe = this.cleanForSumbit(this.state.recipe);
    const { id } = this.props.match.params;
    axios.put(`https://dinnertime-back.herokuapp.com/api/recipes/${ id }/`, recipe)
      .then(res => {
        return(
          this.props.history.push('/recipe/'+res.data.id)
        )
      })
      .catch(error => {
    console.log(error)
});

  }

  render() {
    return (
      <div className = "main-form">
        <div className = 'title'>
         <h1> Nueva Receta  </h1>
       </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Titulo:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.recipe.name}
            placeholder='Titulo Receta'
            onBlur={e =>{
              var text = e.target.value;
              this.setState(prevState => (
                {
                  recipe: {
                    ...prevState.recipe,
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
          <Form.Label htmlFor='text'> Foto Principal:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.recipe.photo}
            placeholder='solo una urls por ahora jeje'
            onBlur={ (e) => {
              var text = e.target.value;
              this.setState(prevState => ({
              recipe: {
                ...prevState.recipe,
                photo: text,
              }
            }))} }
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> URL del video:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.recipe.video_url}
            placeholder='solo el codigo por ahora el que esta al final'
            onBlur={ (e) => {
              var text = e.target.value;
              this.setState(prevState => ({
              recipe: {
                ...prevState.recipe,
                video_url: text,
              }
            }))} }
            />
        </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='category'> Autor:  </Form.Label>
        <Select
        value={this.state.recipe.author}
        onChange={this.handleAuthorChange}
        options={this.state.authors}
      />
          </Form.Group>
        </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='category'> Categorias:  </Form.Label>
        <Select
        value={this.state.recipe.category}
        onChange={this.handleCategoryChange}
        isMulti
        options={this.transformOptions(this.state.categories)}
      />
        </Form.Group>
        <h1> Ingredientes </h1>
        </div>

        <div className="ingredientform">
          <ol>
        {this.state.recipe.ingredients.map((ingredient, i) => (
            this.ingredientRow(ingredient,i)
        ))}
        </ol>

        <Button type="button" variant='outline-primary' onClick={this.handleAddIngredient} className="small">Nuevo Ingrediente</Button>
        </div>

        <div className="stepform">
          <h1> Pasos </h1>
          <ol>
        {this.state.recipe.steps.map((step, i) => (

            this.stepRow(step,i)

        ))}
        </ol>

          <Button type="button" variant='outline-primary' onClick={this.handleAddStep} > Nuevo Paso</Button>
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
