// // Handling form submission with Fetch API
// document.getElementById('task-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission

//     const title = document.getElementById('title').value;
//     const description = document.getElementById('description').value;
//     const due_date = document.getElementById('due_date').value;
    
//     // Use Fetch API to send a POST request to add a task
//     fetch('/add', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             title: title,
//             description: description,
//             due_date: due_date,
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Append the newly added task to the task list
//         const taskList = document.getElementById('task-list');
//         const newTask = document.createElement('li');
//         newTask.id = data.id;
//         newTask.innerHTML = `
//             <span class="task-content ${data.completed ? 'completed' : ''}">
//                 ${data.title} - ${data.description} (Due: ${data.due_date})
//             </span>
//             <div class="task-actions">
//                 <input
//                     type="checkbox"
//                     id="checkbox-${data.id}"
//                     onchange="toggleTaskStatus(${data.id}, this.checked)"
//                 >
//                 <button onclick="deleteTask(${data.id})">Delete</button>
//             </div>
//         `;
//         taskList.appendChild(newTask);


//         // Clear form inputs
//         document.getElementById('title').value = '';
//         document.getElementById('description').value = '';
//         document.getElementById('due_date').value = '';
//     })
//     .catch(error => console.error('Error:', error));
// });

// function toggleTaskStatus(taskId, isChecked) {
//     fetch(`/update_status/${taskId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ completed: isChecked })
//     })
//     .then(() => {
//         // Find the specific span within the li
//         const taskElement = document.getElementById(`${taskId}`); // Select the li element
//         const taskContent = taskElement.querySelector('.task-content'); // Select the span inside li
        
//         if (isChecked) {
//             taskContent.classList.add('completed');
//         } else {
//             taskContent.classList.remove('completed');
//         }
//     })
//     .catch(error => console.error('Error:', error));
// }



// // Handling task deletion using Fetch API
// function deleteTask(taskId) {
//     fetch(`/delete/${taskId}`, { 
//         method: 'DELETE' 
//     })
//     .then(() => {
//         // Remove the task from the UI after deletion
//         document.getElementById(taskId).remove();
//     })
//     .catch(error => console.error('Error:', error));
// }


// Get CSRF token from meta tag
const getCSRFToken = () => {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
};

// Input validation function
const validateTaskInput = (title, description) => {
    if (!title.trim()) {
        alert('Task title cannot be empty');
        return false;
    }
    if (title.length > 100) {
        alert('Task title must be less than 100 characters');
        return false;
    }
    return true;
};

// Sanitize text to prevent XSS
const sanitizeText = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Handling form submission with Fetch API
document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const due_date = document.getElementById('due_date').value;
    
    // Validate input
    if (!validateTaskInput(title, description)) {
        return;
    }
    
    // Use Fetch API to send a POST request to add a task
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken() // Add CSRF token
        },
        body: JSON.stringify({
            title: title,
            description: description,
            due_date: due_date,
        }),
        credentials: 'same-origin' // Include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Server responded with an error');
        }
        return response.json();
    })
    .then(data => {
        // Append the newly added task to the task list safely
        const taskList = document.getElementById('task-list');
        
        // If no tasks exist yet, create the list
        if (!taskList) {
            const newList = document.createElement('ul');
            newList.id = 'task-list';
            document.getElementById('task-list-section').appendChild(newList);
            addTaskToUI(data, newList);
        } else {
            addTaskToUI(data, taskList);
        }

        // Clear form inputs
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due_date').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add task. Please try again.');
    });
});

function addTaskToUI(task, taskList) {
    const newTask = document.createElement('li');
    newTask.id = task.id;
    
    // Create elements instead of using innerHTML to prevent XSS
    const taskContent = document.createElement('span');
    taskContent.className = `task-content ${task.completed ? 'completed' : ''}`;
    taskContent.textContent = `${task.title} - ${task.description} (Due: ${task.due_date || 'None'})`;
    
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${task.id}`;
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function() {
        toggleTaskStatus(task.id, this.checked);
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        deleteTask(task.id);
    });
    
    taskActions.appendChild(checkbox);
    taskActions.appendChild(deleteButton);
    
    newTask.appendChild(taskContent);
    newTask.appendChild(taskActions);
    taskList.appendChild(newTask);
}

function toggleTaskStatus(taskId, isChecked) {
    fetch(`/update_status/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken() // Add CSRF token
        },
        body: JSON.stringify({ completed: isChecked }),
        credentials: 'same-origin' // Include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update task status');
        }
        
        // Find the specific span within the li
        const taskElement = document.getElementById(`${taskId}`);
        const taskContent = taskElement.querySelector('.task-content');
        
        if (isChecked) {
            taskContent.classList.add('completed');
        } else {
            taskContent.classList.remove('completed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update task status. Please try again.');
        // Revert checkbox state on error
        const checkbox = document.getElementById(`checkbox-${taskId}`);
        if (checkbox) {
            checkbox.checked = !isChecked;
        }
    });
}

function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    fetch(`/delete/${taskId}`, { 
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCSRFToken() // Add CSRF token
        },
        credentials: 'same-origin' // Include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        // Remove the task from the UI after deletion
        document.getElementById(taskId).remove();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete task. Please try again.');
    });
}
