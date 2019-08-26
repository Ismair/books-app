import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, FormGroup } from 'react-bootstrap'

class App extends Component {
  state = {

    book: [],
    
    newBookData: {
      title: '',
      rating: ''
    },
    modalVisivel: false,
    modalEditVisivel: false,

    editBookData: {
      id: '',
      title: '',
      rating: ''
    },
  }

  componentWillMount() {
    this._refreshBook();
  }

  handleClose = () => {this.setState({modalVisivel: false})};
  handleShow = () => {this.setState({modalVisivel: true})};

  handleEditModal = () => {this.setState({modalEditVisivel: ! this.state.modalEditVisivel})};

  addBook() {
    axios.post('http://localhost:3001/books', this.state.newBookData).then((response) => {
      
      let { book } = this.state;
      book.push(response.data);
      
      this.setState({ book, modalVisivel: false , newBookData: {
        title: '',
        rating: ''
      }})
    });
  }

  editBook(id, title, rating){
    this.handleEditModal();
    this.setState({
      editBookData: { id, title, rating }
    })
  }

  updateBook() {
    
    let { title, rating } = this.state.editBookData;

    axios.put("http://localhost:3001/books/" + this.state.editBookData.id, {
      title, rating
    }).then((response) => {
      
      this._refreshBook();

      this.handleEditModal();
    });
  }

  _refreshBook(){
    axios.get('http://localhost:3001/books').then((response) => {
      this.setState({
        book: response.data
      })
    });
  }

  deleteBook(id) {
    axios.delete('http://localhost:3001/books/' + id).then((response) => {
      this._refreshBook();
    });
  }

  render() {

    let book = this.state.book.map((book) => {
      return (
        <tr key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.rating}</td>
          <td>
            <Button variant="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, book.id, book.title, book.rating)}>Edit</Button>
            <Button variant="danger" size="sm" onClick={this.deleteBook.bind(this, book.id)}>Delete</Button>
          </td>
        </tr>
      )
    });


    return (
      <div className="App">
        <Button className="my-3" onClick={this.handleShow.bind(this)}>Add book</Button>

        <Modal show={this.state.modalVisivel} onHide={this.handleClose.bind(this)}> 
          <Modal.Header >
            <Modal.Title>Novo Livro</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <FormGroup>
              <Form.Label>Title</Form.Label>
              <Form.Control id="title" value={this.state.newBookData.title} onChange={(e) => {
                let { newBookData } = this.state;

                newBookData.title = e.target.value;

                this.setState({ newBookData })
              }}/>
            </FormGroup>

            <FormGroup>
              <Form.Label>Rating</Form.Label>
              <Form.Control id="rating" type="number" value={this.state.newBookData.rating} onChange={(e) => {
                let { newBookData } = this.state;

                newBookData.rating = e.target.value;

                this.setState({ newBookData })
              }}/>
            </FormGroup>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.addBook.bind(this)}>Save changes</Button>
            <Button variant="secondary" onClick={this.handleClose.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>

         
        <Modal show={this.state.modalEditVisivel} onHide={() => {return false}}> 
          <Modal.Header >
            <Modal.Title>Editar Livro</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <FormGroup>
              <Form.Label>Title</Form.Label>
              <Form.Control id="title" value={this.state.editBookData.title} onChange={(e) => {
                let { editBookData } = this.state;

                editBookData.title = e.target.value;

                this.setState({ editBookData })
              }}/>
            </FormGroup>

            <FormGroup>
              <Form.Label>Rating</Form.Label>
              <Form.Control id="rating" type="number" value={this.state.editBookData.rating} onChange={(e) => {
                let { editBookData } = this.state;

                editBookData.rating = e.target.value;

                this.setState({ editBookData })
              }}/>
            </FormGroup>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={this.updateBook.bind(this)}>Update book</Button>
            <Button variant="secondary" onClick={this.handleEditModal.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Tilte</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {book}

          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
