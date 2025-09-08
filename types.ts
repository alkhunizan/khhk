export type DayOfWeek = 'الخميس' | 'الجمعة';
export type Location = 'مجالس أبو سلطان وأبو عبد الله' | 'استراحة الملقا';

export interface Booking {
  id: number;
  month: string;
  year: number;
  host: string;
  day: DayOfWeek;
  location: Location;
  bookedByEmail: string;
}

export interface User {
  name: string;
  email: string;
  picture: string;
}
