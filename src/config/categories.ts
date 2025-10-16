export const CATEGORIES = {
  Body: [
    'Core Floor',
    'Gym Cardio',
    'Gym Lower',
    'Gym Upper',
    'Morning Stretch',
    'Flex Stretch',
    'OpenMyDay',
    'CloseMyDay',
  ],
  Home: [
    'Clean Floor',
    'Clean GBB',
    'Clean Kitchen Surfaces',
    'Clean MBB',
    'Do Laundry',
    'Clean Studio',
    'Trim Bushes Back Yard',
    'Trim Bushes Front Yard',
    'Vacumme Carpets',
    'Wash Tennis Shoes',
  ],
  Finances: [
    'Check Balances',
    'Pay Bills',
    'Update Records',
    'Other',
  ],
  Job: [
    'Website Editing',
    'Meeting',
    'Other',
  ],
  Projects: [
    'Moral Ambition',
    'Positive Institution',
  ],
  Music: [
    'I Still Have the Blues',
    'Fly Me to the Moon',
    'La Vikina',
    'Autumm Leaves',
  ],
} as const;

export type CategoryName = keyof typeof CATEGORIES;
export type ActivityOption = typeof CATEGORIES[CategoryName][number];
