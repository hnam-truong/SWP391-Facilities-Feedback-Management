export const fetchDataFromAPI = async () => {
    try {
      const response = await fetch('https://localhost:7157/api/Feedbacks/CountLastWeek');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  