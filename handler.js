const { nanoid } = require('nanoid')
const books = require('./books')

const addNewBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400)
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400)
  }

  let finished = false
  if (pageCount === readPage) finished = true

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  }

  books.push(newBook)

  console.log('new book => ', newBook)

  const isSuccess = books.filter((book) => book.id === id).length > 0
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    })
    response.code(201)
    // response.header('Access-Control-Allow-Origin', '*')
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  })
  response.code(500)
  return response
}

const getBookHandler = (request, h) => {
  const { name, reading, finished } = request.query

  if (name) {
    console.log(name)
    const bookByName = books.filter((book) => {
      const bookName = name.toLowerCase()
      const bookInArray = book.name.toLowerCase()
      return bookInArray.includes(bookName)
    })

    if (bookByName === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      response.code(404)
      return response
    }

    const filter = bookByName.map(({ id, name, publisher }) => {
      return {
        id,
        name,
        publisher,
      }
    })

    return h
      .response({
        status: 'success',
        data: {
          books: filter,
        },
      })
      .code(200)
  } else if (reading) {
    console.log(reading)
    const readingBook = reading === 1 ? true : false

    const listReadingBook = books.filter((book) => {
      return book.reading === readingBook
    })
    // console.log('list reading book = ', listReadingBook)

    const filter = listReadingBook.map(({ id, name, publisher }) => {
      return {
        id,
        name,
        publisher,
      }
    })

    if (listReadingBook === undefined) {
      const response = h.response({
        status: 'success',
        data: books,
      })
      response.code(200)
      return response
    }
    return h
      .response({
        status: 'success',
        data: {
          books: filter,
        },
      })
      .code(200)
  } else if (finished) {
    console.log(finished)
    const finishedBook = finished == 1 ? true : false
    console.log(finishedBook)
    const listFinishedBook = books.filter((book) => {
      return book.finished === finishedBook
    })

    console.log('list finished book = ', listFinishedBook)

    const filter = listFinishedBook.map(({ id, name, publisher }) => {
      return {
        id,
        name,
        publisher,
      }
    })

    if (listFinishedBook === undefined) {
      const response = h.response({
        status: 'success',
        data: books,
      })
      response.code(200)
      return response
    }
    return h
      .response({
        status: 'success',
        data: {
          books: filter,
        },
      })
      .code(200)
    // else {
    //   const response = h.response({
    //     status: 'success',
    //     data: books,
    //   })
    //   response.code(200)
    //   return response
    // }
  }
  const filter = books.map(({ id, name, publisher }) => {
    return {
      id,
      name,
      publisher,
    }
  })
  const response = h.response({
    status: 'success',
    data: {
      books: filter,
    },
  })
  response.code(200)
  return response
}

// const getBookByNameHandler = (request, h) => {
//   const { name } = request.query

//   const bookByName = books.filter((book) => {
//     const bookName = name.toLowerCase()
//     return book.name === bookName
//   })

//   if (bookByName === undefined) {
//     const response = h.response({
//       status: 'fail',
//       message: 'Buku tidak ditemukan',
//     })
//     response.code(404)
//     return response
//   }

//   return h
//     .response({
//       status: 'success',
//       data: {
//         bookByName,
//       },
//     })
//     .code(200)
// }

// const getBookByReadingHandler = (request, h) => {
//   const { reading } = request.query

//   if (reading === 1) {
//     const listReadingBook = books.filter((book) => {
//       const readingBook = true
//       return book.reading === readingBook
//     })
//     if (listReadingBook === undefined) {
//       const response = h.response({
//         status: 'success',
//         data: books,
//       })
//       response.code(200)
//       return response
//     }
//     return h
//       .response({
//         status: 'success',
//         data: {
//           listReadingBook,
//         },
//       })
//       .code(200)
//   } else if (reading === 0) {
//     const listReadingBook = books.filter((book) => {
//       const readingBook = false
//       return book.reading === readingBook
//     })
//     if (listReadingBook === undefined) {
//       const response = h.response({
//         status: 'success',
//         data: books,
//       })
//       response.code(200)
//       return response
//     }
//     return h
//       .response({
//         status: 'success',
//         data: {
//           listReadingBook,
//         },
//       })
//       .code(200)
//   } else {
//     const response = h.response({
//       status: 'success',
//       data: books,
//     })
//     response.code(200)
//     return response
//   }
// }

// const getBookByFinishedHandler = (request, h) => {
//   const { finished } = request.query

//   if (finished === 1) {
//     const listFinishedBook = books.filter((book) => {
//       const finishedBook = true
//       return book.finished === finishedBook
//     })
//     if (listFinishedBook === undefined) {
//       const response = h.response({
//         status: 'success',
//         data: books,
//       })
//       response.code(200)
//       return response
//     }
//     return h
//       .response({
//         status: 'success',
//         data: {
//           listFinishedBook,
//         },
//       })
//       .code(200)
//   } else if (reading === 0) {
//     const listFinishedBook = books.filter((book) => {
//       const finishedBook = false
//       return book.finished === finishedBook
//     })
//     if (listReadingBook === undefined) {
//       const response = h.response({
//         status: 'success',
//         data: books,
//       })
//       response.code(200)
//       return response
//     }
//     return h
//       .response({
//         status: 'success',
//         data: {
//           listFinishedBook,
//         },
//       })
//       .code(200)
//   } else {
//     const response = h.response({
//       status: 'success',
//       data: books,
//     })
//     response.code(200)
//     return response
//   }
// }

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    response.code(404)
    return response
  }

  return h.response({
    status: 'success',
    data: {
      book,
    },
  })
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    })
    response.code(400)
    return response
  }

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    response.code(404)
    return response
  }

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  })
  response.code(200)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params
  const index = books.findIndex((book) => book.id === bookId)

  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    response.code(404)
    return response
  }

  books.splice(index, 1)
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  })
  response.code(200)
  return response
}

module.exports = {
  addNewBookHandler,
  getBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
}
