import { INavData } from '@coreui/angular';

// ATTENTION : this values sync to navigation list & en.json|ru.json|lv.json
// TODO read i18n.json for regexp ?
export const navI18n: RegExp[] = [
  /Reports|Отчёты|Atskaites/g,
  /Debtors|Должники|Parādnieki/g,
  /\+Debtor|\+Должник|\+Parādnieku/g,
  /Calendar|Календарь|Kalendārs/g,
];

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
  },
  {
    name: 'Calendar',
    url: '/calendar',
    icon: 'icon-calendar',
  },
  {
    name: 'Debtors',
    url: '/debtors',
    icon: 'icon-people',
  },
  {
    name: '+Debtor',
    url: '/add/debtor',
    icon: 'icon-user-follow',
  },
  {
    divider: true,
  },
  {
    title: true,
    name: 'HELP',
  },
  {
    name: 'Help',
    url: '/help',
    icon: 'icon-support',
    // badge: {
    //   variant: 'info',
    //   text: 'NEW',
    // },
  },
];
