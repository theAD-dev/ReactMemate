import axios from 'axios';

const CALENDLY_API_TOKEN = 'eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQ1MzM4NTI3LCJqdGkiOiJmOTM1NTVlOS0yOGJkLTRiOWItYThiZi1lN2FmNTkzZmYzNTkiLCJ1c2VyX3V1aWQiOiIwMmFmYzY2Mi1iYWQwLTQzZDMtYTFjMi1hNjM4NjRjYWU5NjkifQ.J7V1uKFxaHtXTSLnkVgmqiR6C1WP-96zrbkeK10ish12fGeyNOvMuRFMgBqmKaXaO0JCbQMXcP63uCQjODih2g';
const CALENDLY_API_URL = 'https://api.calendly.com';

// Configure axios with the Calendly API token
const calendlyAxios = axios.create({
  baseURL: CALENDLY_API_URL,
  headers: {
    'Authorization': `Bearer ${CALENDLY_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Get scheduled events for a user
 * @param {string} userURI - The Calendly user URI
 * @param {Object} params - Query parameters
 * @returns {Promise} - Promise with the scheduled events
 */
export const getScheduledEvents = async (userURI, params = {}) => {
  try {
    const response = await calendlyAxios.get('/scheduled_events', {
      params: {
        user: userURI,
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching scheduled events:', error);
    throw error;
  }
};

/**
 * Get event details by URI
 * @param {string} eventURI - The Calendly event URI
 * @returns {Promise} - Promise with the event details
 */
export const getEventDetails = async (eventURI) => {
  try {
    // Extract the event UUID from the URI
    const eventUUID = eventURI.split('/').pop();
    const response = await calendlyAxios.get(`/scheduled_events/${eventUUID}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

/**
 * Get user information
 * @returns {Promise} - Promise with the user information
 */
export const getUserInfo = async () => {
  try {
    const response = await calendlyAxios.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

/**
 * Format date from Calendly to desired format (DD-MM-YYYY)
 * @param {string} dateString - ISO date string from Calendly
 * @returns {string} - Formatted date string
 */
export const formatCalendlyDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

/**
 * Listen for Calendly events
 * @param {Function} callback - Callback function to handle events
 */
export const setupCalendlyEventListener = (callback) => {
  const handleCalendlyEvent = (e) => {
    if (e.data.event && e.data.event.indexOf('calendly') === 0) {
      // Calendly event detected
      if (e.data.event === 'calendly.event_scheduled') {
        // Event was scheduled
        const eventURI = e.data.payload.event.uri;
        callback(eventURI);
      }
    }
  };

  window.addEventListener('message', handleCalendlyEvent);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('message', handleCalendlyEvent);
  };
};
