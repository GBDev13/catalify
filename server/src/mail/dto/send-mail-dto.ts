type MailDetails = {
  email: string;
  name: string;
};

export type SendMailDto = {
  from?: MailDetails;
  to: MailDetails[];
  subject: string;
  content?: string;
  template?: {
    name: string;
    context: Record<string, unknown>;
  };
};
