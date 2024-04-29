document.addEventListener("DOMContentLoaded", function() {
    const confirmationMessage = document.getElementById('confirmation-message');
    const form = document.getElementById('personal-info-form');
    const photoUpload = document.getElementById("photo-upload");
    const photoError = document.getElementById('photo-error');
    const profilePhoto = document.getElementById("profile-photo");
    const countrySelect = document.getElementById("country");
    const citySelect = document.getElementById("city");
    const cityOptions = citySelect.querySelectorAll("option");
    const personalInfoForm = document.getElementById("personal-info-form");
    const displayInfo = document.getElementById("display-info");
    const patientSelect = document.getElementById("patient-select");
    const patients = []; // Array para almacenar los datos de los pacientes
    const addChildBtn = document.getElementById("add-child-btn");
    const childrenTableBody = document.getElementById("children-table");

    addChildBtn.addEventListener("click", function() {
        // Crear fila para un nuevo hijo
        const newRow = document.createElement("tr");

        const nameCell = document.createElement("td");
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "Nombre del hijo";
        nameInput.className = "form-control";
        nameCell.appendChild(nameInput);

        const birthdateCell = document.createElement("td");
        const birthdateInput = document.createElement("input");
        birthdateInput.type = "date";
        birthdateInput.className = "form-control";
        birthdateCell.appendChild(birthdateInput);

        const actionCell = document.createElement("td"); // Celda para el botón de eliminar
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Eliminar";
        deleteButton.className = "btn btn-danger";
        deleteButton.addEventListener("click", function() {
            newRow.remove(); // Eliminar la fila cuando se hace clic en el botón "Eliminar"
        });
        actionCell.appendChild(deleteButton);

        newRow.appendChild(nameCell);
        newRow.appendChild(birthdateCell);
        newRow.appendChild(actionCell); // Agregar la celda de acción a la fila

        childrenTableBody.appendChild(newRow);
    });

    personalInfoForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Obtener la referencia al campo de entrada de la foto
        const photoInput = document.getElementById("photo-upload");
        let photoUrl = ''; // Inicializar la URL de la foto como una cadena vacía

        // Verificar si se ha seleccionado una foto
        if (photoInput.files.length > 0) {
            // Crear una URL de objeto para la foto seleccionada
            photoUrl = URL.createObjectURL(photoInput.files[0]);
            photoError.style.display = 'none';

            // Obtener los valores de los campos del formulario
            const name = document.getElementById("name").value;
            const address = document.getElementById("address").value;
            const phone = document.getElementById("phone").value;
            const birthdate = document.getElementById("birthdate").value;
            const country = document.getElementById("country").options[document.getElementById("country").selectedIndex].text;
            const city = document.getElementById("city").options[document.getElementById("city").selectedIndex].text;

            // Obtener los hijos ingresados
            const children = [];
            const childRows = document.querySelectorAll("#children-table tr");
            childRows.forEach(function (row) {
                const nameInput = row.querySelector("input[type='text']");
                const birthdateInput = row.querySelector("input[type='date']");
                if (nameInput.value.trim() !== "" && birthdateInput.value.trim() !== "") {
                    children.push({
                        name: nameInput.value.trim(),
                        birthdate: birthdateInput.value.trim()
                    });
                }
            });

            // Calcular la edad
            const ageDetails = calculateAge(birthdate);

            const patientData = {
                photo: photoUrl,
                name: name,
                address: address,
                phone: phone,
                birthdate: birthdate,
                country: country,
                city: city,
                age: ageDetails,
                children: children
            };
            patients.push(patientData);

            // Actualizar el combobox de pacientes
            updatePatientSelect();

            confirmationMessage.style.display = 'block'; // Mostrar el mensaje de confirmación
            setTimeout(function () {
                confirmationMessage.style.display = 'none'; // Ocultar el mensaje después de un tiempo
            }, 3000);

            // Restablecer el formulario
            form.reset();

            // Restablecer la tabla de hijos
            const childrenTable = document.getElementById("children-table");
            childrenTable.innerHTML = ''; // Eliminar todas las filas de la tabla

            profilePhoto.src = 'img/foto.png'; // Restablecer la imagen por defecto
            photoUpload.value = '';
        } else {
            event.preventDefault(); // Evita que el formulario se envíe
            photoError.style.display = 'block'; // Muestra el mensaje de error
        }
    });

    // Función para actualizar el combobox de pacientes
    function updatePatientSelect() {
        // Limpiar el combobox
        patientSelect.innerHTML = '<option value="">Seleccionar paciente</option>';
        // Agregar opciones para cada paciente ingresado
        patients.forEach(function(patient, index) {
            const option = document.createElement("option");
            option.value = index.toString(); // Usar el índice como valor
            option.textContent = patient.name;
            patientSelect.appendChild(option);
        });
    }

    // Función para mostrar la información del paciente seleccionado
    patientSelect.addEventListener("change", function() {
        const selectedIndex = parseInt(patientSelect.value);
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < patients.length) {
            displayPatientInfo(patients[selectedIndex]);
        } else {
            displayInfo.innerHTML = ""; // Limpiar el contenido si no se selecciona ningún paciente
        }
    });

    // Función para generar una fecha aleatoria dentro de un rango específico
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    // Función para generar una hora aleatoria (en formato HH:MM)
    function randomTime() {
        const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0'); // Genera un número aleatorio entre 0 y 23
        const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0'); // Genera un número aleatorio entre 0 y 59
        return `${hours}:${minutes}`;
    }

    // Función para generar una fecha y hora aleatoria dentro de un rango específico
    function randomDateTime(start, end) {
        const randomDateTime = randomDate(start, end);
        const randomTimeString = randomTime();
        const formattedDate = randomDateTime.toISOString().split('T')[0]; // Obtiene la fecha en formato YYYY-MM-DD
        return `${formattedDate} ${randomTimeString}`;
    }

    // Función para generar la tabla de consultas con datos aleatorios
    function generateRandomConsultations() {
        let consultationsHTML = `<h3>Consultas</h3><table class="table table-bordered table-hover"><thead class="table-light"><tr><th>Fecha</th><th>Hora</th><th>Diagnóstico</th></tr></thead><tbody>`;
        const today = new Date(); // Fecha actual
        const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()); // Fecha de hace un año
        const endDate = today; // Fecha actual
        for (let i = 0; i < 5; i++) { // Genera 5 consultas aleatorias
            const randomDateTimeValue = randomDateTime(startDate, endDate);
            const diagnosis = ["Gripe", "Fiebre", "Dolor de cabeza", "Fatiga", "Resfriado"][Math.floor(Math.random() * 5)]; // Diagnóstico aleatorio
            consultationsHTML += `<tr><td>${randomDateTimeValue.split(' ')[0]}</td><td>${randomDateTimeValue.split(' ')[1]}</td><td>${diagnosis}</td></tr>`;
        }
        consultationsHTML += `</tbody></table>`;
        return consultationsHTML;
    }


    // Función para mostrar la información del paciente en una tabla, incluyendo la foto
    function displayPatientInfo(patient) {
        let childrenHTML = ""; // Variable para almacenar el HTML de los hijos

        // Construir el HTML de los hijos si hay hijos
        if (patient.children.length > 0) {
            childrenHTML += "<tr><th colspan='2'>Hijos</th></tr>";
            childrenHTML += "<tr><th>Nombre</th><th>Edad</th></tr>"; // Encabezado para la sección de hijos
            patient.children.forEach(child => {
                const age = calculateAge(child.birthdate);
                childrenHTML += `<tr><td>${child.name}</td><td>${age.years} años, ${age.months} meses, ${age.days} días y ${age.hours} horas</td></tr>`;
            });
        }

        // Construir el HTML de la tabla de consultas con datos aleatorios
        const consultationsHTML = generateRandomConsultations();

        // Construir el HTML completo de la tabla
        const tableHTML = `
        <h2>Datos del Paciente</h2>
        <table class="table">
            <tr>
                <th>Foto</th>
                <td><img src="${patient.photo}" alt="Foto del paciente" style="max-width: 100px;"></td>
            </tr>
            <tr>
                <th>Nombre</th>
                <td>${patient.name}</td>
            </tr>
            <tr>
                <th>Dirección</th>
                <td>${patient.address}</td>
            </tr>
            <tr>
                <th>Teléfono</th>
                <td>${patient.phone}</td>
            </tr>
            <tr>
                <th>Fecha de Nacimiento</th>
                <td>${patient.birthdate}</td>
            </tr>
            <tr>
                <th>Edad</th>
                <td>${patient.age.years} años, ${patient.age.months} meses, ${patient.age.days} días y ${patient.age.hours} horas</td>
            </tr>
            <tr>
                <th>País</th>
                <td>${patient.country}</td>
            </tr>
            <tr>
                <th>Ciudad de Nacimiento</th>
                <td>${patient.city}</td>
            </tr>
            ${childrenHTML} <!-- Aquí se añaden los hijos -->
        </table>
        ${consultationsHTML} <!-- Aquí se añade la tabla de consultas -->
    `;
        displayInfo.innerHTML = tableHTML;
    }

    // Función para calcular la edad
    function calculateAge(birthdate) {
        const birthDate = new Date(birthdate);
        const currentDate = new Date();
        const diff = currentDate - birthDate;

        let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        let months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        let days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return { years, months, days, hours };
    }

    // Función para manejar el cambio en la selección de país
    countrySelect.addEventListener("change", function() {
        const selectedCountry = countrySelect.value;

        // Ocultar todas las opciones de ciudad
        cityOptions.forEach(option => {
            option.style.display = "none";
        });

        // Mostrar las ciudades correspondientes al país seleccionado
        const selectedCities = citySelect.querySelectorAll(`.country${selectedCountry}`);
        selectedCities.forEach(cityOption => {
            cityOption.style.display = "block";
        });
    });

    // Función para mostrar la imagen seleccionada por el usuario
    photoUpload.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Disparar el evento change para cargar las ciudades iniciales
    countrySelect.dispatchEvent(new Event("change"));
});
