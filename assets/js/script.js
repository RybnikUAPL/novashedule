document.addEventListener('DOMContentLoaded', function() {
    const scheduleTableBody = document.querySelector('#schedule tbody');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton'); // Новая кнопка удаления
    const datePicker = document.getElementById('datePicker');

    const timeslots = [
        '07:00 - 08:00',
        '08:00 - 09:00',
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '12:00 - 13:00',
        '13:00 - 14:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 17:00',
        '17:00 - 18:00'

    ];

    // Устанавливаем текущую дату при загрузке страницы
    function setCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const currentDate = `${year}-${month}-${day}`;
        datePicker.value = currentDate;
        loadScheduleForDate(currentDate);
    }

    // Заполняем таблицу
    timeslots.forEach(timeslot => {
        const row = document.createElement('tr');

        // Временной слот (окрашен в светло-серый)
        const timeCell = document.createElement('td');
        timeCell.textContent = timeslot;
        timeCell.style.backgroundColor = 'lightgray'; // Светло-серый цвет
        row.appendChild(timeCell);

        // Ячейки для дней недели
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите задание';
            input.maxLength = 50; // Ограничение длины строки
            cell.appendChild(input);
            row.appendChild(cell);
        }

        scheduleTableBody.appendChild(row);
    });

    // Функция для изменения цвета ячеек
    function updateFieldColors() {
        scheduleTableBody.querySelectorAll('input').forEach(input => {
            if (input.value.trim() !== '') {
                input.style.backgroundColor = 'lightblue'; // Заполненные поля синие
            } else {
                input.style.backgroundColor = 'lightgreen'; // Пустые поля зелёные
            }
        });
    }

    // Функция для валидации данных
    function validateSchedule() {
        let isValid = true;

        scheduleTableBody.querySelectorAll('input').forEach(input => {
            if (input.value.trim() !== '' && input.value.trim().length > 50) {
                alert('Ошибка: Ввод не должен превышать 50 символов.');
                input.focus();
                isValid = false;
            }
        });

        return isValid;
    }

    // Функция для сохранения данных для выбранной даты
    function saveScheduleForDate(date) {
        if (!validateSchedule()) {
            return; // Прекратить сохранение, если валидация не пройдена
        }

        const schedule = [];

        scheduleTableBody.querySelectorAll('tr').forEach(row => {
            const timeSlot = row.children[0].textContent;
            const tasks = [];

            for (let i = 1; i < row.children.length; i++) {
                tasks.push(row.children[i].querySelector('input').value);
            }

            schedule.push({
                timeSlot,
                tasks
            });
        });

        localStorage.setItem(`weeklySchedule_${date}`, JSON.stringify(schedule));
        alert('Расписание сохранено для даты: ' + date);
        updateFieldColors(); // Обновляем цвета после сохранения
    }

    // Функция для загрузки данных для выбранной даты
    function loadScheduleForDate(date) {
        scheduleTableBody.querySelectorAll('input').forEach(input => input.value = '');

        const savedSchedule = JSON.parse(localStorage.getItem(`weeklySchedule_${date}`));

        if (savedSchedule) {
            savedSchedule.forEach((timeRow, index) => {
                const row = scheduleTableBody.children[index];
                timeRow.tasks.forEach((task, dayIndex) => {
                    row.children[dayIndex + 1].querySelector('input').value = task;
                });
            });
        }

        updateFieldColors(); // Обновляем цвета после загрузки
    }

    // Функция для удаления данных для выбранной даты
    function deleteScheduleForDate(date) {
        const confirmation = confirm('Вы уверены, что хотите удалить расписание для этой даты?');

        if (confirmation) {
            localStorage.removeItem(`weeklySchedule_${date}`);
            scheduleTableBody.querySelectorAll('input').forEach(input => input.value = '');
            alert('Расписание удалено для даты: ' + date);
            updateFieldColors(); // Обновляем цвета после удаления
        }
    }

    // Обработчик для изменения даты
    datePicker.addEventListener('change', function() {
        const selectedDate = datePicker.value;
        if (selectedDate) {
            loadScheduleForDate(selectedDate);
        }
    });

    // Сохранение расписания
    saveButton.addEventListener('click', function() {
        const selectedDate = datePicker.value;

        if (!selectedDate) {
            alert('Выберите дату!');
            return;
        }

        saveScheduleForDate(selectedDate);
    });

    // Удаление расписания
    deleteButton.addEventListener('click', function() {
        const selectedDate = datePicker.value;

        if (!selectedDate) {
            alert('Выберите дату!');
            return;
        }

        deleteScheduleForDate(selectedDate);
    });

    // Устанавливаем текущую дату при загрузке страницы
    setCurrentDate();
});

function updateDateTime() {
    const now = new Date();

    // Форматируем текущую дату с днем недели
    const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const monthsOfYear = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    
    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    const formattedDate = `${dayOfWeek}, ${day} ${month} ${year} года`;

    // Форматируем текущее время
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    // Обновляем элементы на странице
    document.getElementById('currentDate').textContent = `Сегодня: ${formattedDate}`;
    document.getElementById('currentTime').textContent = `Время: ${formattedTime}`;
}

// Обновляем дату и время при загрузке страницы
updateDateTime();

// Обновляем время каждую секунду
setInterval(updateDateTime, 1000);