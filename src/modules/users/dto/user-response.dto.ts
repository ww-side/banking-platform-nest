import { Exclude, Expose } from 'class-transformer';

export class UserResponseDTO {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDTO>) {
    Object.assign(this, partial);
  }
}
