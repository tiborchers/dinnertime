import React from 'react';
import YouTube from 'react-youtube';
import axios from 'axios';
import './recipe.css'
import Button from 'react-bootstrap/lib/Button'

const APILink = 'https://dinnertime-back.herokuapp.com/api/'
/* const APILink = 'http://127.0.0.1:8000/api/' */

export default class RecipeView extends React.Component {
  state = {
    recipe: {
      name:'',
      category:[],
      steps:[],
      photo:'',
      video_url:'',
      ingredients:[],
      author:{name:'', nickname:''},
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id){
    axios.get(`${APILink}recipes/${ id }/`)
      .then(res => {
        const recipe = res.data;
        this.setState({ recipe });
      })
    }
    console.log(this.props.recipe);
    if(this.props.recipe){
      const recipe =  this.props.recipe;
      this.setState({ recipe });
    }
  }


  showPhoto(recipe){
    if( recipe.photo){
        return(
          <div className = "main-photo">
           <img src={ recipe.photo } alt={recipe.name}/>
         </div>
      )
    }
  }

  parse(ingredient){
    if (ingredient.measure === 'Al gusto'){
      return ingredient.ingredient.name + ' ' + ingredient.measure
    }
    else if (ingredient.measure === 'Otro') {
      return ingredient.quantity + ' ' + ingredient.customMeasure + ' de ' + ingredient.ingredient.name
    }
    else{
      if(ingredient.quantity === 1){
        if(ingredient.measure === 'Unidades'){
          return ingredient.quantity + ' ' + ingredient.measure.substring(0, ingredient.measure.length -2) + ' de ' + ingredient.ingredient.name
        }
        else{
          return ingredient.quantity + ' ' + ingredient.measure.substring(0, ingredient.measure.length -1) + ' de ' + ingredient.ingredient.name
        }

      }
      else{
          return ingredient.quantity + ' ' + ingredient.measure + ' de ' + ingredient.ingredient.name
      }

    }
  }

  ingredientRow(ingredient){
    let tag ='';
    if (ingredient.optional){
      tag = '(Opcional)';
    }

    tag+= this.parse(ingredient);

    ingredient.alternatives.map( (alternative) => {
      return tag+= " o " + this.parse(alternative);
    })
    return(
      <li key={ingredient.id}>
        <p>
          {tag}
        </p>
      </li>
    )
  }

  video(recipe){
    if (!recipe.video_url){
      return;
    }
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    };
    return(
    <div className="video">
               <YouTube
            videoId={recipe.video_url}
            opts={opts}
            onReady={this._onReady}
          />
    </div>
  );
  }

  stepRow(step){

    let optional ='';
    if( step.optional){
      optional= '(Opcional)';
    }
    let photo = '';
    if( step.photo){
      photo = <img src={ step.photo } alt = ''/>;
    }
    return(
    <li key={step.id}>
      <h3> Paso {step.order}
        {optional}
      </h3>

      <p> { step.text} </p>
      {photo}
    </li>
  )
  }

  _onReady(event) {
   // access to player in all event handlers via event.target
   event.target.pauseVideo();
 }

  render() {

    const recipe = this.state.recipe;


    return (


        <div className = "main" >
          <div className = 'tags'>
            <ul>
              {recipe.category.map((category) => {

                return(
                  <li key={category.id}>
                    <a href = {"/category/"+category.id} className="tag">
                      { category.name }
                    </a>
                  </li>
                )
              }
            )
              }

            </ul>
          </div>
          {this.showPhoto(recipe)}

          <div className = 'title'>
           <h1> { recipe.name } </h1>
           <h3> por { recipe.author.nickName} </h3>
         </div>




           <div className="ingredients">
             <h2> Ingredientes </h2>

              <ul>
                {recipe.ingredients.map((ingredient)=> {return this.ingredientRow(ingredient)})}
              </ul>
            </div>


            <div className = "steps">
             <h2> Pasos </h2>

             <ol>
               {recipe.steps.map((step)=> { return this.stepRow(step)})}
             </ol>
           </div>


           {this.video(recipe)}


           <div>
             <br />
             <Button type="button" variant="info" onClick={() => this.props.history.push('/recipe/'+recipe.id+'/edit/')} className="small" block> Editar Receta</Button>
           </div>
      </div>

    )
  }
}
