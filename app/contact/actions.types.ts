export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors shown next to each input. */
  fieldErrors?: {
    name?: string;
    email?: string;
    message?: string;
  };
};

export const initialContactState: ContactFormState = {
  status: "idle",
  message: "",
};
