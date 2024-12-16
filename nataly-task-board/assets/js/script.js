// created get items for local storage
let taskList = JSON.parse(localStorage.getItem('tasks'));
let nextId = JSON.parse(localStorage.getItem('id'));


// created variables for task items
const taskTitle = $('#task-title');
const taskDate = $('#task-date');
const taskDescription = $('#task-desc');
const taskForm = $('#task-form');
const taskDisplay = $('#task-display');
const dialogForm = $('#dialog-form');





function generateTaskId(nextId = []) {
    let id = '';    
    // Generate a unique ID using timestamp and Math.random().
    id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    // Check if the generated ID already exists in the nextId array
    while (nextId.includes(id)) {
        // If the ID already exists, regenerate it
        id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    }
    // Add the new ID to the nextId array
    nextId.push(id);
    // Update localStorage with the updated nextId array
    localStorage.setItem('id', JSON.stringify(nextId));
    return id;
}



function createTaskCard(task) {

    // Create task card element
    const taskCard = $('<div>').addClass('card task-card draggable my-3').attr('data-task-id', task.id);

    // Create card header with task name
    const cardHeaderEl = $('<div>').addClass('card-header h4').text(task.name);

    // Create card body element
    const cardBodyEl = $('<div>').addClass('card-body');

    // Create paragraph for task description
    const cardDescriptionEl = $('<p>').addClass('card-text').text(task.description);

    // Create paragraph for task due date
    const cardDateEl = $('<p>').addClass('card-text').text(task.dueDate);

    // Create delete button
    const cardDeleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);

    // Apply background color based on due date and task status
    if (task.dueDate && task.status !== 'complete') {
        const now = dayjs();
        const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
        const isDueToday = now.isSame(taskDueDate, 'day');
        const isOverdue = now.isAfter(taskDueDate);
    
        if (isDueToday) {
            taskCard.addClass('bg-warning text-white');
        } else if (isOverdue) {
            taskCard.addClass('bg-danger text-white');
            cardDeleteBtn.addClass('border-light');
        }
    }


    // Append elements to card body
    cardDescriptionEl.appendTo(cardBodyEl);
    cardDateEl.appendTo(cardBodyEl);
    cardDeleteBtn.appendTo(cardBodyEl);

    // Append card header and body to task card
    cardHeaderEl.appendTo(taskCard);
    cardBodyEl.appendTo(taskCard);

    return taskCard;
}


function renderTaskList() {
    if (!taskList) {
        // Initialize an empty array if taskList is null
        taskList = [];
    }

    // Clear existing task cards from the lanes
    const todoList = $('#nys-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#complete-cards');
    doneList.empty();

    // Iterate through stored tasks and create task cards for each status
    taskList.forEach(function(task) {
        switch (task.status) {
            case 'not-yet-started':
                todoList.append(createTaskCard(task));
                break;
            case 'in-progress':
                inProgressList.append(createTaskCard(task));
                break;
            case 'complete':
                doneList.append(createTaskCard(task));
                break;
            default:
                console.error('Invalid task status:', task.status);
        }
    });


    // Make task cards draggable using jQuery UI.
    $('.draggable').draggable({
        // Set opacity of the cloned task card being dragged
        opacity: 0.5,
        // Ensure the cloned card is positioned above other elements during drag
        zIndex: 1,
        // Create a clone of the card being dragged
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}


function handleAddTask(event) {
    // Prevent page from refreshing when form is submitted
    event.preventDefault(); 
    // Check if all input fields are filled
    const fieldCheck = $({}).add(taskTitle).add(taskDate).add(taskDescription),
    tips = $('.validateTips');
 
    function checkInput(input) {
        if(input.val() === '') {
            input.addClass('ui-state-error');
            tips
            .text('Please ensure all inputs are filled.')
            .addClass('ui-state-highlight');
            setTimeout(function() {
                tips.removeClass( 'ui-state-highlight', 1500 );
            }, 500 );
            return false;
        } else {
            return true;
        }
    }


    let valid = true;
    fieldCheck.removeClass("ui-state-error");
    valid = valid && checkInput(taskTitle);
    valid = valid && checkInput(taskDate);
    valid = valid && checkInput(taskDescription);

    // If all fields are filled, add the task
    if (valid) {
        // Create a task object with form data
        const newTask = {
            id: generateTaskId(),
            name: taskTitle.val(),
            dueDate: taskDate.val(),
            description: taskDescription.val(),
            status: 'not-yet-started',
        }
        // Add new task to task list
        taskList.push(newTask);
        // Save updated tasks array to localStorage
        localStorage.setItem('tasks', JSON.stringify(taskList));

        // Clear form inputs and close dialog box
        taskTitle.val('');
        taskDate.val('');
        taskDescription.val('');
        dialogForm.dialog('close');

        // Render updated task list
        renderTaskList();
    }
}


function handleDeleteTask() {
    // Retrieve task id from data-task-id attribute
    const taskId = $(this).data('task-id');

    // Filter out task with matching id from taskList array
    taskList = taskList.filter(task => task.id !== taskId);

    // Filter out id from nextId array
    nextId = nextId.filter(id => id !== taskId);

    // Update task list and nextId array in localStorage
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('id', JSON.stringify(nextId));

    // Render updated task list
    renderTaskList();
}


function handleDrop(event, ui) {
    // Retrieve task id from draggable element's data attribute
    const taskId = ui.draggable.data('task-id');

    // Retrieve id of the lane where the card was dropped
    const newStatus = $(event.target).attr('id');

    // Update task status in taskList array
    const updatedTaskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });

    // Save updated task list to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTaskList));

    // Render updated task list
    renderTaskList();
}


// Function to bind event listeners
function bindEventListeners() {
    // Event listener for task form submission
    taskForm.on('submit', handleAddTask);

    // Event listener for delete button clicks
    $(document).on('click', '.delete', handleDeleteTask);

    // Event listener for opening dialog box
    $('#opener').on('click', () => dialogForm.dialog('open'));
}


// Function to initialize date picker
function initializeDatePicker() {
    taskDate.datepicker({
        changeMonth: true,
        changeYear: true,
    });
}


// Function to make lanes droppable
function makeLanesDroppable() {
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
}


// Function to handle page load tasks
$(document).ready(function () {
    // Render task list
    renderTaskList();
    dialogForm.dialog({
        autoOpen: false,
        minWidth: 400,
        width: 400,
    });
    $('button.ui-dialog-titlebar-close').addClass('btn ui-icon ui-icon-closethick');


    bindEventListeners();

    initializeDatePicker();

    makeLanesDroppable();
});