import React from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';




export default class CategoryForm extends React.Component {
  state = {
    category: {
      id:0,
      name: '',
      logo:'',
    },
    new: true,
    done: false,
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id){
    axios.get(`https://dinnertime-back.herokuapp.com/api/categories/${ id }`)
      .then(res => {
        let category = res.data;

        this.setState({ 'category': category, 'new':false });
      });

    }
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

    let category = this.state.category;
    axios.post(`https://dinnertime-back.herokuapp.com/api/categories/`,category)
      .then(res => {
        console.log(res.data);
        this.props.history.push('/category/'+res.data.id)
      })
      .catch(error => {
    console.log(error)
});

  }

  onDelete=() => {
    const { id } = this.props.match.params;
    axios.delete(`https://dinnertime-back.herokuapp.com/api/categories/${ id }`)
      .then(res => {
        return(
          this.props.history.push('/category')
        )
      })
      .catch(error => {
    console.log(error)
});

  }

  onEdit=() => {
    let category = this.state.category;
    const { id } = this.props.match.params;
    axios.put(`https://dinnertime-back.herokuapp.com/api/categories/${ id }/`, category)
      .then(res => {
        return(
          this.props.history.push('/category/'+res.data.id)
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
         <h1> Nueva Categoria  </h1>
       </div>
        <div>
          <Form.Group>
          <Form.Label htmlFor='text'> Nombre:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.category.name}
            placeholder='Nombre Categoria'
            onBlur={e =>{
              var text = e.target.value;
              this.setState(prevState => (
                {
                  category: {
                    ...prevState.category,
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
          <Form.Label htmlFor='text'> Logo:  </Form.Label>
          <Form.Control
            type="text"
            defaultValue={this.state.category.logo}
            placeholder='solo una urls por ahora jeje'
            onBlur={ (e) => {
              var text = e.target.value;
              this.setState(prevState => ({
              category: {
                ...prevState.category,
                logo: text,
              }
            }))} }
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
