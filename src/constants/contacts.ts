export const CONTACT_CONSTANTS = {
  QUERY: {
    DEFAULT_LIMIT: 50,
    MAX_LIMIT: 100,
    DEFAULT_OFFSET: 0,
    DEFAULT_SEARCH: undefined,
  },
  FORM: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    COMPANY_MIN_LENGTH: 2,
    COMPANY_MAX_LENGTH: 100,
  },
  MESSAGES: {
    SUCCESS: {
      CREATED: (firstName: string, lastName: string) =>
        `Contact ${firstName} ${lastName} created successfully!`,
      UPDATED: (firstName: string, lastName: string) =>
        `Contact ${firstName} ${lastName} updated successfully!`,
      DELETED: "Contact deleted successfully!",
      REFRESHED: "Contacts refreshed successfully!",
    },
    ERRORS: {
      CREATE_FAILED: "Failed to create contact",
      UPDATE_FAILED: "Failed to update contact",
      DELETE_FAILED: "Failed to delete contact",
      FETCH_FAILED: "Failed to load contacts",
      REFRESH_FAILED: "Failed to refresh contacts",
      EMAIL_EXISTS: "A contact with this email already exists",
      CONTACT_NOT_FOUND: "Contact not found",
    },
    VALIDATION: {
      FIRST_NAME_MIN: "First name must be at least 2 characters",
      LAST_NAME_MIN: "Last name must be at least 2 characters",
      EMAIL_INVALID: "Invalid email address",
      PHONE_INVALID: "Invalid phone number format",
      COMPANY_MIN: "Company name must be at least 2 characters",
    },
  },
  PLACEHOLDERS: {
    SEARCH: "Search contacts...",
    FIRST_NAME: "John",
    LAST_NAME: "Doe",
    EMAIL: "john.doe@example.com",
    PHONE: "+1 (555) 123-4567",
    COMPANY: "Acme Corp",
  },
  LABELS: {
    SEARCH: "Search contacts",
    REFRESH: "Refresh contacts",
    ADD_CONTACT: "Add Contact",
    EDIT_CONTACT: "Edit Contact",
    DELETE_CONTACT: "Delete Contact",
    FIRST_NAME: "First name",
    LAST_NAME: "Last name",
    EMAIL: "Email",
    PHONE: "Phone",
    COMPANY: "Company",
    ACTIONS: "Actions",
    CREATED: "Created",
    NAME: "Name",
  },
  TITLES: {
    PAGE: "My Contacts",
    CREATE_DIALOG: "Create New Contact",
    EDIT_DIALOG: "Edit Contact",
    DELETE_DIALOG: "Delete Contact",
  },
  DESCRIPTIONS: {
    PAGE: "Manage your contacts efficiently",
    PAGE_WITH_COUNT: (count: number) =>
      `Manage your ${count} contacts efficiently`,
    CREATE_DIALOG:
      "Add a new contact to your directory. Fill in the required fields and any optional information.",
    EDIT_DIALOG: (firstName: string, lastName: string) =>
      `Update the contact information for ${firstName} ${lastName}.`,
    DELETE_DIALOG: (firstName: string, lastName: string) =>
      `Are you sure you want to delete ${firstName} ${lastName}? This action cannot be undone.`,
    EMPTY_STATE: "Get started by creating your first contact.",
    EMPTY_SEARCH: (search: string) =>
      `No contacts match "${search}". Try a different search term.`,
    NO_CONTACTS: "No contacts yet",
    NO_CONTACTS_FOUND: "No contacts found",
    NO_PHONE: "No phone",
    NO_COMPANY: "No company",
  },
  BUTTONS: {
    CREATE: "Create Contact",
    UPDATE: "Update Contact",
    DELETE: "Delete",
    CANCEL: "Cancel",
    SAVE: "Save",
    RETRY: "Retry",
    CREATING: "Creating...",
    UPDATING: "Updating...",
    DELETING: "Deleting...",
  },
} as const;

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
};

export type ContactQueryParams = {
  search?: string;
  limit: number;
  offset: number;
};

export const DEFAULT_CONTACT_QUERY: ContactQueryParams = {
  search: CONTACT_CONSTANTS.QUERY.DEFAULT_SEARCH,
  limit: CONTACT_CONSTANTS.QUERY.DEFAULT_LIMIT,
  offset: CONTACT_CONSTANTS.QUERY.DEFAULT_OFFSET,
};
