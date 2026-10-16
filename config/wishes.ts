// Wedding Wishes backend: a Google Form (write) + its linked, view-only Google Sheet (read).
// No secrets here: the form accepts anonymous responses and the sheet is "anyone with the link can view".
// To remove a wish from the site, delete its row in the sheet's "Form Responses 1" tab.
export const WISHES = {
  formResponseUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLScm8rPHCqJVuEJADODcc9YcX-mp_KXP89HoymcHmGVRyv6zhg/formResponse",
  nameEntry: "entry.715789519",
  wishEntry: "entry.1362436595",
  sheetId: "1AwZ1GaM8hOJCCITEsbYWl6xRXZYYTl2Z6G9dv5sA764",
  sheetTab: "Form Responses 1",
  maxWish: 500,
  maxName: 60,
} as const;
