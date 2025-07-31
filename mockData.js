// mockData.js - Sample data for development

export const mockOrganizations = [
  {
    id: 1,
    name: "Youth Center Ferizaj",
    shortname: "YCF",
    type: "Institution",
    picture: "https://via.placeholder.com/150",
    description: "Youth center providing activities for young people"
  },
  {
    id: 2,
    name: "NGO Voice",
    shortname: "Voice",
    type: "NGO",
    picture: "https://via.placeholder.com/150",
    description: "Non-governmental organization working with youth"
  },
  {
    id: 3,
    name: "Community Center",
    shortname: "CC",
    type: "Institution",
    picture: "https://via.placeholder.com/150",
    description: "Community center for local activities"
  },
  {
    id: 4,
    name: "Youth Initiative",
    shortname: "YI",
    type: "NGO",
    picture: "https://via.placeholder.com/150",
    description: "Youth initiative organization"
  }
];

export const mockEvents = [
  {
    id: 1,
    title: "Youth Workshop",
    description: "Workshop for young people about leadership",
    date: "2024-02-15",
    time: "14:00",
    location: "Youth Center Ferizaj",
    organizationId: 1,
    approved: true,
    picture: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    title: "Community Meeting",
    description: "Monthly community meeting",
    date: "2024-02-20",
    time: "18:00",
    location: "Community Center",
    organizationId: 3,
    approved: true,
    picture: "https://via.placeholder.com/300x200"
  },
  {
    id: 3,
    title: "Volunteer Training",
    description: "Training session for new volunteers",
    date: "2024-02-25",
    time: "10:00",
    location: "NGO Voice Office",
    organizationId: 2,
    approved: true,
    picture: "https://via.placeholder.com/300x200"
  },
  {
    id: 4,
    title: "Youth Conference",
    description: "Annual youth conference",
    date: "2024-03-01",
    time: "09:00",
    location: "City Hall",
    organizationId: 4,
    approved: true,
    picture: "https://via.placeholder.com/300x200"
  }
];

export const mockVolunteers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+383 44 123 456",
    picture: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+383 44 789 012",
    picture: "https://via.placeholder.com/150"
  }
];

// Mock API functions
export const mockAPI = {
  getAllOrganizations: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockOrganizations);
      }, 500);
    });
  },

  getApprovedEvents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockEvents.filter(event => event.approved),
          total: mockEvents.filter(event => event.approved).length
        });
      }, 500);
    });
  },

  getOrganizationById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const org = mockOrganizations.find(org => org.id === parseInt(id));
        resolve(org || null);
      }, 300);
    });
  },

  getEventById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const event = mockEvents.find(event => event.id === parseInt(id));
        resolve(event || null);
      }, 300);
    });
  },

  getAllEvents: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockEvents,
          total: mockEvents.length
        });
      }, 500);
    });
  }
}; 