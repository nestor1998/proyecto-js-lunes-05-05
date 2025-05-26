const students = [];
let editIndex = -1; // Guardará el índice del estudiante en edición

const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
const form = document.getElementById("studentForm");
const submitButton = form.querySelector("button[type='submit']");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const grade = parseFloat(document.getElementById("grade").value.trim());
    const date = document.getElementById("date").value.trim();

    if (grade < 1 || grade > 7 || !name || !lastName || isNaN(grade)) {
        alert("Error: Datos incorrectos");
        return;
    }

    if (editIndex === -1) {
        // Modo Agregar
        const student = { name, lastName, grade, date };
        students.push(student);
        addStudentToTable(student);
    } else {
        // Modo Editar
        students[editIndex] = { name, lastName, grade, date };
        actualizarTabla();
        submitButton.textContent = "Agregar Estudiante";
        editIndex = -1;
    }

    calcularPromedio();
    form.reset();
});

function addStudentToTable(student) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.lastName}</td>
        <td>${student.grade}</td>
        <td>${student.date}</td>
        <td>
        <div class="Desplazar"> 
            <button class="modify">Editar</button>
            <button class="delete">Eliminar</button>
        </div>
        </td>
    `;

    row.querySelector(".delete").addEventListener("click", function () {
        deleteEstudiante(student, row);
    });

    row.querySelector(".modify").addEventListener("click", function () {
        modificarEstudiante(student);
    });

    tableBody.appendChild(row);
}

function modificarEstudiante(student) {
    editIndex = students.indexOf(student);

    document.getElementById("name").value = student.name;
    document.getElementById("lastname").value = student.lastName;
    document.getElementById("grade").value = student.grade;
    document.getElementById("date").value = student.date;

    submitButton.textContent = "Guardar Cambios";
}

function deleteEstudiante(student, row) {
    const index = students.indexOf(student);
    if (index > -1) {
        students.splice(index, 1);
        row.remove();
        calcularPromedio();
        // Si se está editando y justo se elimina el que se edita, reinicia el modo
        if (index === editIndex) {
            editIndex = -1;
            form.reset();
            submitButton.textContent = "Agregar Estudiante";
        }
    }
}

function calcularPromedio() {
    if (students.length === 0) {
        averageDiv.textContent = "Promedio de Calificaciones: No Disponible";
        return;
    }



    const suma = students.reduce((acc, alumno) => acc + parseFloat(alumno.grade), 0);
    const promedio = suma / students.length;

    const totalAprobados = students.filter(a => parseFloat(a.grade) >= 4).length;
    const totalReprobados = students.filter(a => parseFloat(a.grade) < 4).length;


    averageDiv.textContent = `Promedio de Calificaciones: ${promedio.toFixed(2)} | Total estudiantes: ${students.length}   Aprobados: ${totalAprobados} |  Reprobados: ${totalReprobados}`;
}

function actualizarTabla() {
    tableBody.innerHTML = ""; // Borra la tabla actual
    students.forEach(student => {
        addStudentToTable(student);
    });
}