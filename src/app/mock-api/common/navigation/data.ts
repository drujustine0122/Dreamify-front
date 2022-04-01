/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const customerNavigation: FuseNavigationItem[] = [
  {
    id: 'DreamFeeds',
    title: 'Home',
    type: 'basic',
    icon: 'heroicons_outline:newspaper',
    link: '/dreamfeeds'
  },
  {
    id: 'Inspirations',
    title: 'Discover',
    type: 'basic',
    icon: 'heroicons_outline:photograph',
    link: '/inspirations'
  },
  {
    id: 'Dreams',
    title: 'Dreams',
    type: 'basic',
    icon: 'heroicons_outline:lightning-bolt',
    link: '/ideas'
  },
];

export const superAdminNavigation: FuseNavigationItem[] = [
];

export const adminNavigation: FuseNavigationItem[] = [
];

export const merchantNavigation: FuseNavigationItem[] = [
];

export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: 'ideas',
    title: 'Ideas',
    type: 'basic',
    icon: 'heroicons_outline:lightning-bolt',
    link: '/ideas'
  },
];
