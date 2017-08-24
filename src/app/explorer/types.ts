export class Explorer {
  id: number;
  username: string;
  password: string;
  email: string;
}

export class Session {
  id: string;
  ttl: number;
  created: Date;
  userId: string;
}
