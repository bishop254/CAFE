import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  icon: string;
  role: string;
}

const MENUITEMS = [
  { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
  {
    state: 'category',
    name: 'Manage Categories',
    icon: 'category',
    role: 'admin',
  },
  { state: 'product', name: 'Manage Products', icon: 'grass', role: 'admin' },
  { state: 'order', name: 'Manage Orders', icon: 'list_alt', role: '' },
];

@Injectable()
export class MenuItems {
  getMenuItems(): Menu[] {
    return MENUITEMS;
  }
}
