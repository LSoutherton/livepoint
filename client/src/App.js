import { useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Api from './apis/Api';

function App() {

  const [productID, setProductId] = useState('');
  const [list, setList] = useState([]);
  const [taskDetails, setTaskDetails] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const click = (e) => {
    e.preventDefault();
    
    if (!productID) {
      alert('Error: Please enter the Product Status ID.')
    } else {
      if (!/^\d+$/.test(productID)) {
        alert('Error: The provided Product Service ID is invalid as it is not an integer.');
      } else {
        submitID();
      }
    }
  }

  const submitID = () => {
    const fetchTasks = async () => {
      try {
        // Fetch task IDs
        const res = await fetch(`https://demonstration.swiftcase.co.uk/api/v2/ee8ca67d4cbc79091382a3900502b613/status/${productID}`);
        const data = await res.json();
        setList(data.task_ids);
  
        // Fetch task details in parallel
        const tempDetailsList = [];
        let tempCost = 0;
  
        // Create an array of fetch promises for all tasks
        const taskPromises = data.task_ids.map(async (task) => {
          try {
            const taskRes = await fetch(`https://demonstration.swiftcase.co.uk/api/v2/ee8ca67d4cbc79091382a3900502b613/task/${task.id}`);
            const taskData = await taskRes.json();
  
            // Sum the cost if the task is not cancelled
            if (taskData.data[2].value === 'No') {
              tempCost += parseInt(taskData.data[0].value, 10);
            }
  
            // Modify the date format
            taskData.data[1].value = String(Math.floor(new Date(taskData.data[1].value).getTime() / 1000));
            tempDetailsList.push(taskData);
          } catch (err) {
            console.log(err);
          }
        });
  
        // Wait for all tasks to be fetched
        await Promise.all(taskPromises);
  
        // Set total cost and task details after all promises resolve
        const formattedTotalCost = '£' + (Math.round(tempCost * 100) / 100).toFixed(2);
        setTotalCost(formattedTotalCost);
        setTaskDetails(tempDetailsList);
  
        // Pass the latest details and total cost to the getFile function directly
        if (tempDetailsList.length) {
          await getFile(tempDetailsList, formattedTotalCost);
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };
  
    fetchTasks();
  };

  const getFile = async (details, cost) => {
    try {
      const response = await Api.post("/saveFile", {
        content: JSON.stringify(details),
        totalCost: cost,
      });
      console.log('File saved:', response);
    } catch (err) {
      console.log('Error saving file:', err);
    }
  
    // Proceed with uploading the file after saving, outside try/catch to ensure it's always called
    await uploadFile(details, cost);
  };
  
  const uploadFile = async (details, cost) => {
    try {
      // Prepare the file details
      const fileName = 'test.txt'; // FILE_NAME
      const mimeType = 'text/plain'; // MIME_FILE_TYPE
    
      // Combine details and cost into the file content
      const fileContent = JSON.stringify(details, null, 2) + '\nTotal Cost: ' + cost;
  
      // Convert the file content to a Base64-encoded string
      const base64FileContents = btoa(unescape(encodeURIComponent(fileContent))); // Ensure proper encoding for special characters
  
      // Prepare the API endpoint
      // Couldn't get the API url to work. The file will never be uploaded and always result in an error
      const apiUrl = 'https://demonstration.swiftcase.co.uk/api/v2/ee8ca67d4cbc79091382a3900502b613/task/364/file';
  
      // Create the request body as JSON
      const bodyData = {
        FILE_NAME: fileName,
        MIME_FILE_TYPE: mimeType,
        BASE64_ENCODED_FILE_CONTENTS: base64FileContents,
      };
  
      // Perform the POST request
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure JSON is used for the request body
        },
        body: JSON.stringify(bodyData), // Send the body data as JSON
      });
  
      // Handle the response
      if (res.ok) {
        const result = await res.json(); // Parse the response
        console.log('File uploaded successfully:', result);
        alert('File uploaded successfully:', result);
      } else {
        console.error('Failed to upload the file:', res.statusText);
        alert('Failed to upload the file:', res.statusText);
      }
    } catch (err) {
      console.error('Error during file upload:', err);
      alert('Error during file upload:', err);
    }
  };

  return (
    <div className="main">
      <Navbar />
      <form onSubmit={click} className='form'>

        <label>Product ID </label>
        <input onChange={(e) => setProductId(e.target.value)} type='text' id='product-id'></input>

        <button type='submit'>Submit</button>

      </form>
      <div>
        <img className='image' src='./images/hired.webp' />
      </div>
    </div>
  );
}

export default App;
