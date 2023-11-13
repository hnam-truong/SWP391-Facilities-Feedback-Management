const responseData = [
  {
    "date": "Tuesday",
    "amount": 0
  },
  {
    "date": "Wednesday",
    "amount": 0
  },
  {
    "date": "Thursday",
    "amount": 0
  },
  {
    "date": "Friday",
    "amount": 9
  },
  {
    "date": "Saturday",
    "amount": 9
  },
  {
    "date": "Sunday",
    "amount": 11
  },
  {
    "date": "Monday",
    "amount": 2
  }
];

// Map the data to the desired format
const labels = responseData.map(item => item.date.substring(0, 3)); // Extract the first letter from each day
const data = responseData.map(item => item.amount);

// Create the final object
const result = {
  labels,
  datasets: { label: "Report", data }
};

export default result;
