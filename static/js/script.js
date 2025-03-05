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
// const getCSRFToken = () => {
//     return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
// };

// // Input validation function
// const validateTaskInput = (title, description) => {
//     if (!title.trim()) {
//         alert('Task title cannot be empty');
//         return false;
//     }
//     if (title.length > 100) {
//         alert('Task title must be less than 100 characters');
//         return false;
//     }
//     return true;
// };

// // Sanitize text to prevent XSS
// const sanitizeText = (text) => {
//     const div = document.createElement('div');
//     div.textContent = text;
//     return div.innerHTML;
// };

// // Handling form submission with Fetch API
// document.getElementById('task-form').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent default form submission

//     const title = document.getElementById('title').value;
//     const description = document.getElementById('description').value;
//     const due_date = document.getElementById('due_date').value;
    
//     // Validate input
//     if (!validateTaskInput(title, description)) {
//         return;
//     }
    
//     // Use Fetch API to send a POST request to add a task
//     fetch('/add', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCSRFToken() // Add CSRF token
//         },
//         body: JSON.stringify({
//             title: title,
//             description: description,
//             due_date: due_date,
//         }),
//         credentials: 'same-origin' // Include cookies in the request
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Server responded with an error');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Append the newly added task to the task list safely
//         const taskList = document.getElementById('task-list');
        
//         // If no tasks exist yet, create the list
//         if (!taskList) {
//             const newList = document.createElement('ul');
//             newList.id = 'task-list';
//             document.getElementById('task-list-section').appendChild(newList);
//             addTaskToUI(data, newList);
//         } else {
//             addTaskToUI(data, taskList);
//         }

//         // Clear form inputs
//         document.getElementById('title').value = '';
//         document.getElementById('description').value = '';
//         document.getElementById('due_date').value = '';
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Failed to add task. Please try again.');
//     });
// });

// function addTaskToUI(task, taskList) {
//     const newTask = document.createElement('li');
//     newTask.id = task.id;
    
//     // Create elements instead of using innerHTML to prevent XSS
//     const taskContent = document.createElement('span');
//     taskContent.className = `task-content ${task.completed ? 'completed' : ''}`;
//     taskContent.textContent = `${task.title} - ${task.description} (Due: ${task.due_date || 'None'})`;
    
//     const taskActions = document.createElement('div');
//     taskActions.className = 'task-actions';
    
//     const checkbox = document.createElement('input');
//     checkbox.type = 'checkbox';
//     checkbox.id = `checkbox-${task.id}`;
//     checkbox.checked = task.completed;
//     checkbox.addEventListener('change', function() {
//         toggleTaskStatus(task.id, this.checked);
//     });
    
//     const deleteButton = document.createElement('button');
//     deleteButton.textContent = 'Delete';
//     deleteButton.addEventListener('click', function() {
//         deleteTask(task.id);
//     });
    
//     taskActions.appendChild(checkbox);
//     taskActions.appendChild(deleteButton);
    
//     newTask.appendChild(taskContent);
//     newTask.appendChild(taskActions);
//     taskList.appendChild(newTask);
// }

// function toggleTaskStatus(taskId, isChecked) {
//     fetch(`/update_status/${taskId}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCSRFToken() // Add CSRF token
//         },
//         body: JSON.stringify({ completed: isChecked }),
//         credentials: 'same-origin' // Include cookies in the request
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to update task status');
//         }
        
//         // Find the specific span within the li
//         const taskElement = document.getElementById(`${taskId}`);
//         const taskContent = taskElement.querySelector('.task-content');
        
//         if (isChecked) {
//             taskContent.classList.add('completed');
//         } else {
//             taskContent.classList.remove('completed');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Failed to update task status. Please try again.');
//         // Revert checkbox state on error
//         const checkbox = document.getElementById(`checkbox-${taskId}`);
//         if (checkbox) {
//             checkbox.checked = !isChecked;
//         }
//     });
// }

// function deleteTask(taskId) {
//     if (!confirm('Are you sure you want to delete this task?')) {
//         return;
//     }
    
//     fetch(`/delete/${taskId}`, { 
//         method: 'DELETE',
//         headers: {
//             'X-CSRFToken': getCSRFToken() // Add CSRF token
//         },
//         credentials: 'same-origin' // Include cookies in the request
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to delete task');
//         }
//         // Remove the task from the UI after deletion
//         document.getElementById(taskId).remove();
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Failed to delete task. Please try again.');
//     });
// }

// Get CSRF token from meta tag
const getCSRFToken = () => {
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute('content') : '';
};

// Input validation function
const validateTaskInput = (title) => {
    if (!title.trim()) {
        showNotification('Task title cannot be empty', 'error');
        return false;
    }
    if (title.length > 100) {
        showNotification('Task title must be less than 100 characters', 'error');
        return false;
    }
    return true;
};

// Show notification instead of using alert
const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Create container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    container.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => notification.remove(), 3000);
};

// Check if the no-tasks message exists and handle it
const handleNoTasksMessage = () => {
    const noTasksMessage = document.querySelector('.no-tasks-message');
    const taskList = document.getElementById('task-list');
    
    if (!noTasksMessage) return;
    
    if (taskList && taskList.children.length > 0) {
        noTasksMessage.style.display = 'none';
    } else {
        noTasksMessage.style.display = 'block';
    }
};

// Format date for display
const formatDate = (dateString) => {
    if (!dateString) return 'None';
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

// Handling form submission with Fetch API
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    if (!taskForm) return;
    
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value || '';
        const due_date = document.getElementById('due_date').value;
        
        // Validate input
        if (!validateTaskInput(title)) {
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
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Handle the no-tasks message
            const noTasksMessage = document.querySelector('.no-tasks-message');
            if (noTasksMessage) {
                noTasksMessage.style.display = 'none';
            }
            
            // Get or create task list container
            let taskList = document.getElementById('task-list');
            const taskListSection = document.getElementById('task-list-section');
            
            if (!taskList && taskListSection) {
                taskList = document.createElement('ul');
                taskList.id = 'task-list';
                taskListSection.appendChild(taskList);
            }
            
            if (taskList) {
                addTaskToUI(data, taskList);
                showNotification('Task added successfully!', 'success');
            }

            // Clear form inputs
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to add task: ' + error.message, 'error');
        });
    });

    // Add event listeners for existing tasks
    setupExistingTaskListeners();
});

function setupExistingTaskListeners() {
    // Set up event listeners for existing checkboxes
    document.querySelectorAll('input[type="checkbox"][id^="checkbox-"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskId = this.id.replace('checkbox-', '');
            toggleTaskStatus(taskId, this.checked);
        });
    });
    
    // Set up event listeners for existing delete buttons
    document.querySelectorAll('.delete-task-btn, button[onclick^="deleteTask"]').forEach(button => {
        // Remove any existing click handlers to prevent duplicates
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new click handler
        newButton.addEventListener('click', function() {
            // Try different ways to get the task ID
            let taskId = this.getAttribute('data-task-id');
            if (!taskId) {
                // Try to get it from the parent li element
                const taskItem = this.closest('li');
                if (taskItem) taskId = taskItem.id;
            }
            if (taskId) deleteTask(taskId);
        });
    });
}

function addTaskToUI(task, taskList) {
    // Check if task already exists
    if (document.getElementById(task.id)) {
        // Update existing task instead of creating a new one
        const existingTask = document.getElementById(task.id);
        existingTask.innerHTML = ''; // Clear existing content
        
        // Create task content
        const taskContent = createTaskContent(task);
        const taskActions = createTaskActions(task);
        
        existingTask.appendChild(taskContent);
        existingTask.appendChild(taskActions);
    } else {
        // Create new task element
        const newTask = document.createElement('li');
        newTask.id = task.id;
        newTask.className = 'task-item';
        
        // Create task content and actions
        const taskContent = createTaskContent(task);
        const taskActions = createTaskActions(task);
        
        newTask.appendChild(taskContent);
        newTask.appendChild(taskActions);
        taskList.appendChild(newTask);
    }
    
    // Update the no-tasks message visibility
    handleNoTasksMessage();
}

function createTaskContent(task) {
    const taskContent = document.createElement('div');
    taskContent.className = `task-content ${task.completed ? 'completed' : ''}`;
    
    const taskTitle = document.createElement('h3');
    taskTitle.textContent = task.title;
    taskContent.appendChild(taskTitle);
    
    if (task.description) {
        const taskDesc = document.createElement('p');
        taskDesc.textContent = task.description;
        taskContent.appendChild(taskDesc);
    }
    
    const taskDate = document.createElement('span');
    taskDate.className = 'task-date';
    taskDate.textContent = `Due: ${formatDate(task.due_date)}`;
    taskContent.appendChild(taskDate);
    
    return taskContent;
}

function createTaskActions(task) {
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${task.id}`;
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function() {
        toggleTaskStatus(task.id, this.checked);
    });
    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-task-btn';
    deleteButton.setAttribute('data-task-id', task.id);
    deleteButton.addEventListener('click', function() {
        deleteTask(task.id);
    });
    
    taskActions.appendChild(checkbox);
    taskActions.appendChild(deleteButton);
    
    return taskActions;
}

function toggleTaskStatus(taskId, isChecked) {
    console.log(`Toggling task ${taskId} to ${isChecked}`);
    
    fetch(`/update_status/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({ completed: isChecked }),
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        //return response.json();

    // Check if there's content to parse
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json') && response.status !== 204) {
            return response.json();
        } else {
            // For 204 No Content, just return an empty object
            return {};
        }
    })
    .then(data => {
        console.log('Update response:', data);
        
        // Find the specific task element
        const taskElement = document.getElementById(taskId);
        if (!taskElement) {
            showNotification(`Task element with ID ${taskId} not found`);
            return;
        }
        
        const taskContent = taskElement.querySelector('.task-content');
        if (taskContent) {
            if (isChecked) {
                taskContent.classList.add('completed');
            } else {
                taskContent.classList.remove('completed');
            }
            showNotification('Task status updated', 'success');
        } else {
            showNotification('Task content element not found');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to update task status', 'error');
        
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
    
    console.log(`Deleting task ${taskId}`);
    
    fetch(`/delete/${taskId}`, { 
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        credentials: 'same-origin'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        // Try to parse JSON, but don't fail if it's not JSON
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                return { success: true };
            }
        });
    })
    .then(data => {
        console.log('Delete response:', data);
        
        // Remove the task from the UI
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.remove();
            showNotification('Task deleted successfully', 'success');
            
            // Check if we need to show the no-tasks message
            const taskList = document.getElementById('task-list');
            if (!taskList || taskList.children.length === 0) {
                const noTasksMessage = document.querySelector('.no-tasks-message');
                if (noTasksMessage) {
                    noTasksMessage.style.display = 'block';
                } else {
                    // Create no-tasks message if it doesn't exist
                    const message = document.createElement('div');
                    message.className = 'no-tasks-message';
                    message.textContent = 'No tasks available. Add a new task above!';
                    
                    const taskListSection = document.getElementById('task-list-section');
                    if (taskListSection) {
                        taskListSection.appendChild(message);
                    }
                }
            }
        } else {
            showNotification(`Task element with ID ${taskId} not found`);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to delete task: ' + error.message, 'error');
    });
}
