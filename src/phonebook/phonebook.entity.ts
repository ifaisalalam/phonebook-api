import { Entity, Column, ObjectIdColumn, ObjectID, Index } from 'typeorm';

@Entity('phonebook')
export class Phonebook {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  @Index()
  name: string;

  @Column()
  phone?: string;

  @Column({ unique: true })
  email: string;

  constructor(phonebook?: Partial<Phonebook>) {
    Object.assign(this, phonebook);
  }
}
