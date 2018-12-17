import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from "react-router-dom";
import RecipeView from './Pages/Recipe/recipe';
import RecipeForm from './Pages/Recipe/recipeform';
import RecipeList from './Pages/Recipe/recipelist';
import NavBarPage from './Pages/navpage';
import IngredientList from './Pages/Ingredient/ingredientlist';
import CategoriesList from './Pages/Categories/categorieslist';
import IngredientRecipeList from './Pages/Ingredient/recipelist';
import IngredientForm from './Pages/Ingredient/ingredientform';
import CategoryRecipeList from './Pages/Categories/recipelist';
import CategoryForm from './Pages/Categories/categoryform';

ReactDOM.render(

  <div>

  <BrowserRouter>

  <div>
    <NavBarPage />
    <Route exact path="/" component={App} />
    <Route exact path="/recipe/" component={RecipeList} />
    <Route exact path="/recipe/new/" component={RecipeForm} />
    <Route exact path="/recipe/:id([0-9]+)/" component={RecipeView} />
    <Route exact path="/recipe/:id([0-9]+)/edit/" component={RecipeForm} />
    <Route exact path="/category/new" component={CategoryForm} />
    <Route exact path="/category/" component={CategoriesList} />
    <Route exact path="/category/:id([0-9]+)/" component={CategoryRecipeList} />
    <Route exact path="/category/:id([0-9]+)/edit/" component={CategoryForm} />
    <Route exact path="/ingredient/" component={IngredientList} />
    <Route exact path="/ingredient/new" component={IngredientForm} />
    <Route exact path="/ingredient/:id([0-9]+)/" component={IngredientRecipeList} />
    <Route exact path="/ingredient/:id([0-9]+)/edit/" component={IngredientForm} />

  </div>
 </BrowserRouter>
</div>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
