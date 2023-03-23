const { nanoid } = require('nanoid');
const books = require('./books');


const addBooksHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if( name === undefined){
        const response = h.response ({
            status :'fail',
            message : 'input Book Name',
        });
        response.code(400);
        return response;
    }

    if(pageCount < readPage){
        const response = h.response ({
            status:'fail',
            message:'"Check the Pagecount again, it should not be less than ReadPage'


        });
    }


    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBook ={
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,

    };

    books.push (newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {

        const response =h.response({
            status: 'Succes',
            message: 'Succefuly',
            data:{

                bookId : id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({

        status:'fail',
        message: 'Failled add the book',
    });

    response.code(500);
    return response;

 
};
// ---KRITERIA 4--- //
const getAllBooksHandler = (request, h) => {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
  
    response.code(200)
    return response
}
  

// ---KRITERIA 5--- //
const getBooksByIdHandler = (request, h) => {
    const { bookId } = request.params
    const book = books.filter((b) => b.id === bookId)[0]
  
    // Bila buku dengan id yang dilampirkan ditemukan
    if (book) {
      const response = h.response({
        status: 'success',
        data: {
          book
        }
      })
      response.code(200)
      return response
    }
  
    // Bila buku dengan id yang dilampirkan oleh client tidak ditemukan
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
  }

  // ---KRITERIA 6--- //
const editBooksByIdHandler = (request, h) => {
    const { bookId } = request.params
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    } = request.payload
  
    const updatedAt = new Date().toISOString()
  
    const index = books.findIndex((book) => book.id === bookId)
  
    // Client tidak melampirkan properti namepada request body.
  
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku'
      })
      response.code(400)
      return response
    }
  
    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount.
  
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
      })
      response.code(400)
      return response
    }
  
    // Buku berhasil diperbarui
  
    if (index !== -1) {
      const finished = pageCount === readPage
  
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt
      }
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
        data: {
          book: books[index]
        }
      })
      response.code(200)
      return response
    }
  
    // Buku gagal diperbarui
  
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }


  
// ---KRITERIA 7--- //
const deleteBooksByIdHandler = (request, h) => {
    const { bookId } = request.params
  
    const index = books.findIndex((book) => book.id === bookId)
    if (index !== -1) {
      books.splice(index, 1)
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
      response.code(200)
      return response
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
  }
  


module.exports = { addBooksHandler, 
                    getAllBooksHandler,
                    getBooksByIdHandler,
                    editBooksByIdHandler, 
                    deleteBooksByIdHandler,     };