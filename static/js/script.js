// Handling form submission with Fetch API
document.getElementById('task-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const due_date = document.getElementById('due_date').value;
    
    // Use Fetch API to send a POST request to add a task
    fetch('/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            description: description,
            due_date: due_date,
        })
    })
    .then(response => response.json())
    .then(data => {
        // Append the newly added task to the task list
        const taskList = document.getElementById('task-list');
        const newTask = document.createElement('li');
        newTask.id = data.id;
        newTask.innerHTML = `
            <span class="task-content ${data.completed ? 'completed' : ''}">
                ${data.title} - ${data.description} (Due: ${data.due_date})
            </span>
            <div class="task-actions">
                <input
                    type="checkbox"
                    id="checkbox-${data.id}"
                    onchange="toggleTaskStatus(${data.id}, this.checked)"
                >
                <button onclick="deleteTask(${data.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(newTask);


        // Clear form inputs
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due_date').value = '';
    })
    .catch(error => console.error('Error:', error));
});

function toggleTaskStatus(taskId, isChecked) {
    fetch(`/update_status/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: isChecked })
    })
    .then(() => {
        // Find the specific span within the li
        const taskElement = document.getElementById(`${taskId}`); // Select the li element
        const taskContent = taskElement.querySelector('.task-content'); // Select the span inside li
        
        if (isChecked) {
            taskContent.classList.add('completed');
        } else {
            taskContent.classList.remove('completed');
        }
    })
    .catch(error => console.error('Error:', error));
}



// Handling task deletion using Fetch API
function deleteTask(taskId) {
    fetch(`/delete/${taskId}`, { 
        method: 'DELETE' 
    })
    .then(() => {
        // Remove the task from the UI after deletion
        document.getElementById(taskId).remove();
    })
    .catch(error => console.error('Error:', error));
}
