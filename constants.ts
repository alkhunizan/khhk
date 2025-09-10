import type { Location } from './types';

export const GOOGLE_CLIENT_ID = '1080619407432-fl8p71nqcjtka20e04fnjlk3cn8p04au.apps.googleusercontent.com';

export const CORE_HOSTS_MEN: string[] = [
  'أبو سلطان', 'أبو عبد الله', 'أبو ثامر', 'العم عبد الرحمن', 
  'أبو فيصل', 'أبو عاصم', 'أبو أسامة', 'أبو فارس', 'أبو هشام', 'أبو محمد'
];

export const CORE_HOSTS_WOMEN: string[] = [
  'أم نايف', 'أم عبد الله', 'أم سهيل', 'أم تركي', 
  'أم ريان', 'أم الوليد', 'أم فهد'
];

export const ALL_CORE_HOSTS = [...CORE_HOSTS_MEN, ...CORE_HOSTS_WOMEN];

export const LOCATIONS: Location[] = [
  'مجالس أبو سلطان وأبو عبد الله',
  'استراحة الملقا'
];

export const MONTHS: string[] = [
  'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
  'رمضان المبارك', 'شوال', 'ذو القعدة', 'ذو الحجة', 'محرم', 'صفر', 'ربيع الأول'
];

// Hijri months in calendar order for date conversion
export const HIJRI_MONTHS_ORDER = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان المبارك', 'شوال', 'ذو القعدة', 'ذو الحجة'];


// Assuming school holidays are Shawwal, Dhu al-Qi'dah, Dhu al-Hijjah
export const UNAVAILABLE_MONTHS: string[] = ['رمضان المبارك', 'شوال', 'ذو القعدة', 'ذو الحجة'];
