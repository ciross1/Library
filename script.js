//se puede hacer de esta manera el construcctor:

/*function Book() {
    // the constructor...
  }

// o asi: En las clases, los métodos definidos dentro de la clase se añaden automáticamente al prototipo,
/*es decir la unica diferencia es que la sintaxis de clase es mas sencilla porque no hay que defnir prototype */

const openTaskFormBtn = document.getElementById("button-open-task");
const form = document.getElementById("task-form");
const closeTaskForm = document.getElementById("close-task-form-btn");
const inputAddBook = document.getElementById("input-add-book");
const inputAddAuthor = document.getElementById("input-add-author");
const inputIsMissingAuthorTitle = document.querySelector(
  ".input-missing-author-title"
);
const addBookBtn = document.getElementById("addBookBtn");
const totalBooks = document.getElementById("totalBooks");
const numberOfBooks = document.querySelector(".number-of-books")
const year = document.getElementById("year")


// Clase para representar un libro
/*Orden de Definición: La definición de la clase Book ha sido movida antes de la línea donde se recuperan los libros de localStorage y se convierten en instancias de Book. Esto asegura que la clase esté completamente definida antes de que se intente usar.  */

class Book {
  constructor(author, title) {
    this.author = author;
    this.title = title;
  }

  getSummary() {
    return `${this.title} was written by ${this.author}`;
  }
}

// Mostrar/Ocultar formulario
openTaskFormBtn.addEventListener("click", () => {
  form.classList.toggle("hidden");
});

closeTaskForm.addEventListener("click", () => {
  form.classList.toggle("hidden");
});


// Recuperar libros de localStorage

/*Expliquemos un par de datos:

¿Qué hace?: La función JSON.parse() convierte esa cadena de texto JSON de vuelta a un objeto o un array de JavaScript. Por ejemplo, si antes guardamos algo como "[{\"author\":\"Author1\", \"title\":\"Title1\"}]", al usar JSON.parse(), lo convertimos en un array de objetos.
¿Por qué es importante?: Esto nos permite trabajar con los datos como objetos en JavaScript en lugar de como cadenas de texto.*/

/*|| []:

¿Qué hace?: Este es un operador lógico OR. Si localStorage.getItem("data") no devuelve nada (por ejemplo, si es la primera vez que se carga la página y no hay datos guardados), entonces usamos un array vacío []. */

/*.map(bookData => new Book(bookData.author, bookData.title)):
¿Qué hace?: La función map() toma cada objeto en el array resultante y lo transforma. Aquí, por cada bookData (que representa un libro), se crea una nueva instancia de la clase Book usando los datos del autor y el título de ese libro.
¿Por qué es importante?: Esto convierte todos los datos de los libros de simples objetos a instancias de la clase Book, lo que nos da acceso a los métodos de esa clase, como getSummary().
 */
const library = (JSON.parse(localStorage.getItem("data")) || [])
  .filter(bookData => bookData && bookData.author && bookData.title) // Filtra datos válidos
  .map(bookData => new Book(bookData.author, bookData.title));       // Crea instancias de Book



//actualizar el numero de libros en total 
const totalNumberOfBooks = () =>{
  
  const libraryCount = library.length
numberOfBooks.innerHTML = `Total Books: ${libraryCount}`


}
totalNumberOfBooks()



// Función para actualizar la lista de libros
/*para poder desplegarlo en html: .map recorre el array de library y transforma cada uno de sus 
elementos. Tiene un parametro que va a ser book que representa cada libro en la biblioteca, es decir cada instancia de la clase Book. Para cada libro (book), llama al método getSummary() de la clase Book y luego .join(para que no
aparezcan juntos ) */
const updateBookList = () => {
  // Limpiar el contenido existente para evitar duplicación
  totalBooks.innerHTML = "";

  //recorrer cada libro de la biblioteca
  library.forEach((book) => {
    /* // Agregar el resumen del libro y mostrar título y autor */

    totalBooks.innerHTML += `
    <div class="totalBooks">
     <p><strong>book: </strong>${book.getSummary()}</p>
     <p><strong>Title: </strong>${book.title}</p>
     <p><strong>Author: </strong>${book.author}</p>  

     <button class="btn" type="button" onclick="editTask(this)">Edit</button>
     <button class="btn" type="button" onclick="deleteTask(this)">Delete</button>
    </div>
    `;
  });

  localStorage.setItem("data", JSON.stringify(library)); // Guardar en localStorage
};

// Función para agregar un libro
const addingBookAndAuthor = () => {
  const bookTitle = inputAddBook.value.trim();
  const bookAuthor = inputAddAuthor.value.trim();
 
  // Verificar si ambos campos no están vacíos
  if (bookTitle !== "" && bookAuthor !== "") {
    //Aquí se está creando una nueva instancia de la clase Book.
    /*bookAuthor y bookTitle son los valores que se están pasando como argumentos al constructor de la clase Book. Estos valores representan el autor y el título del nuevo libro que estás agregando. */
    const newBook = new Book(bookAuthor, bookTitle);

    //lo agrgamos a library
    library.push(newBook);



    // Actualizar la lista de libros en esta funcion
    updateBookList();

    //actualizar el numero de libros en total 
    totalNumberOfBooks()

    // Limpiar campos de input
    inputAddBook.value = "";
    inputAddAuthor.value = "";
    inputIsMissingAuthorTitle.innerHTML = ""; // Limpiar mensajes de error
    form.classList.toggle("hidden") //cerramos el form para añadir libros

  } else {
    // Mostrar mensaje de error adecuado
    inputIsMissingAuthorTitle.innerHTML =
      bookTitle === ""
        ? "You forgot to type the title"
        : "You forgot to type the author";
  }
  
};


// Agregar el evento al botón para añadir libro
addBookBtn.addEventListener("click", addingBookAndAuthor);

// Mostrar la lista de libros al cargar la página
updateBookList();

//para ver la teoría de este codigo.

//visita la siguiente página para ver la teoría de este proyecto

const deleteTask = (buttonEl) => {
  //Obtener el contenedor del libro (padre del botón)
  /*Esto selecciona el elemento padre del botón que se hace clic (el contenedor del libro). En tu caso, es el <div> que contiene el título, el autor, y los botones de "Edit" y "Delete". */
  const bookElement = buttonEl.parentElement;

  /*Para eliminar un libro del array library, necesitamos encontrar la posición (índice) del libro en ese array. Para hacerlo, comparo el título y el autor del libro (almacenados en el HTML) con los del array. El primer párrafo (getSummary()) no es necesario para esta comparación porque no es lo que usamos para identificar el libro en el array; el título y el autor ya nos proporcionan la información suficiente para encontrar el libro correcto en la lista y eliminarlo. */

  //eliminamos el texto literal de Title y Author para solo comparar el nombre del libro y autor
  const bookTitle = bookElement
    .querySelector("p:nth-of-type(2)")
    .textContent.replace("Title: ", "")
    .trim();

  const bookAuthor = bookElement
    .querySelector("p:nth-of-type(3)")
    .textContent.replace("Author: ", "")
    .trim();

  //siguiente paso es  Buscar el índice del libro en el array que coincida con el título y el autor

  const dataToBeDeleted = library.findIndex(
    (book) => book.title === bookTitle && book.author === bookAuthor
  );

  //para comprobar si existe en el array,
  //findIndex() devuelve el índice del libro si lo encuentra, o -1 si no lo encuentra.

  if (dataToBeDeleted !== -1) {
    //si existe eliminarlo:

    buttonEl.parentElement.remove();

    ////tambien lo eliminamos del   array. dataArrIndex es el index por el que se empieza (es decir el primero que copincida)y 1 es el numero de items que quremos eliminar:

    library.splice(dataToBeDeleted, 1);

    //actualoizamos cantidad de de libros que hay 
    totalNumberOfBooks()


    localStorage.setItem("data", JSON.stringify(library)); // Guardar en localStorage
  } else {
    console.log("book not found");
  }
};



const editTask = (buttonEl) =>{
   
  //quitamos el elemento de title y author para solo obtener el nombre del autor y libro
  const buttonElement = buttonEl.parentElement

  const bookTitle =  buttonElement.querySelector("p:nth-of-type(2)").textContent.replace("Title: ", "").trim()
  const bookAuthor =  buttonElement.querySelector("p:nth-of-type(3)").textContent.replace("Author: ", "").trim()

  //buscamos el index del libro y que coincida con el index de library
  const bookToBeEditedIndex = library.findIndex((book) => {
    return book.title === bookTitle && book.author === bookAuthor; // Asegúrate de usar return
  });

  //si esta en el array la coincidencia: 
  if (bookToBeEditedIndex !== -1){
    
    //creamos variable que muestra el autor y libro segun index para ponerlo en el valor del input
    const BookToBeEdited = library[bookToBeEditedIndex]


   
    
     //lo representamos en html e introducimos inputs 
      totalBooks.innerHTML = `
      <div>
       
       <p><strong>Title: </strong><input class="inputSaveTitle" value ="${BookToBeEdited.title}"></p>
       <p><strong>Author: </strong><input class="inputSaveAuthor" value="${BookToBeEdited.author}"></p>  
  
       <button class="btn" type="button" onclick="saveTask(this, ${bookToBeEditedIndex})">Save</button>
       
      </div>
      `;
    };

    
  }


 //creamos la funcion de save para poder guardar lo que hemos introducido en input

const saveTask = (ButtonEl, index) =>{

 //obtenemos los valores de los inputs:
/*buttonEl.parentElement accede al elemento padre del botón, que en este caso es el <div> que contiene todos los detalles del libro (el resumen, el título, y el autor). */

/*buttonElement.querySelector(".inputSaveSummary") busca dentro del div (el elemento padre) el elemento <input> con la clase inputSaveSummary.
.value obtiene el valor actual que el usuario escribió en ese input.
.trim() elimina cualquier espacio en blanco al principio o al final del texto. Esto es útil para evitar errores si el usuario solo introduce espacios. */
  const buttonElement = ButtonEl.parentElement
  
  
 
  const newTitle = buttonElement.querySelector(".inputSaveTitle").value.trim()
  const newAuthor = buttonElement.querySelector(".inputSaveAuthor").value.trim()

  if (newTitle === "" || newAuthor === ""){
    console.log("Title and author cannot be empty");
    return; 
  }

/*library[index] se refiere al objeto Book que se encuentra en esa posición específica del array. En otras palabras, estás accediendo al libro que quieres actualizar.
new Book(newAuthor, newTitle):

new Book(...) crea una nueva instancia de la clase Book.
newAuthor y newTitle son las nuevas propiedades (valores) que el usuario ha ingresado en el formulario después de editar el libro. */

 /*En otras palabras, estás actualizando el libro en la posición index del array library con los nuevos valores que el usuario ha proporcionado. */


 library[index] = new Book(newAuthor, newTitle);

  //guardamos en localStorage: 

  localStorage.setItem("data", JSON.stringify(library));


  //actualizamos lista de libros: 

  updateBookList()

 






   
}



//updated year: 

year.textContent = new Date().getFullYear()