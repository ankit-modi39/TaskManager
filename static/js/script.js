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
            due_date: due_date
        })
    })
    .then(response => response.json())
    .then(data => {
        // Append the newly added task to the task list
        const taskList = document.getElementById('task-list');
        const newTask = document.createElement('li');
        newTask.id = data.id;
        newTask.innerHTML = `${data.title} - ${data.description} <button onclick="deleteTask(${data.id})">Delete</button>`;
        taskList.appendChild(newTask);

        // Clear form inputs
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('due_date').value = '';
    })
    .catch(error => console.error('Error:', error));
});

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
