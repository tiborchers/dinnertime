import React from 'react';
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import { LinkContainer } from "react-router-bootstrap";

export default class NavBarPage extends React.Component {

  state = {
    recipes: []
  }

  render() {

    return (
    <div>
      <Navbar  bg="dark" variant="dark">
        <LinkContainer to="/">
          <Navbar.Brand>
             DinnerTime
          </Navbar.Brand>
        </LinkContainer>
        <Nav className="mr-auto">
          <LinkContainer to="/recipe">
            <Nav.Link>
              Recetas
            </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/ingredient">
              <Nav.Link>
                Ingredientes
              </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/category">
                <Nav.Link>
                  Categorias
                </Nav.Link>
                </LinkContainer>
        </Nav>
      </Navbar>
    </div>
    )
  }
}
