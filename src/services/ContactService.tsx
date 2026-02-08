const API_URL = "http://localhost:8080";

export const ContactService = {
  createContact: async (contactObj: { contact: string; nickname: string }) => {
    const res = await fetch(`${API_URL}/createContact`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(contactObj),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to create contact.");
    }

    const data = await res.json();
    return data;
  },

  deleteContact: async (contact: string) => {
    const res = await fetch(`${API_URL}/deleteContact`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ contact }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to delete contact.");
    }

    const data = await res.json();
    return data;
  },

  updateContact: async (contact: string, nickname: string) => {
    const res = await fetch(`${API_URL}/updateContact`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ contact: contact, nickname: nickname }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to update contact.");
    }

    const data = await res.json();
    return data;
  },

  fetchContacts: async () => {
    const res = await fetch(`${API_URL}/contacts`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to fetch contacts.");
    }

    const data = await res.json();
    return data;
  },

  // TODO: Implement search.
};
