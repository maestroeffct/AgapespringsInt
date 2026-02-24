export function getHeaderConfig(routeName: string) {
  switch (routeName) {
    case 'Home':
      return {
        leftType: 'menu',
        rightType: 'notification',
      };

    case 'Devotional':
      return {
        leftType: 'back',
        rightType: 'none',
        title: 'Devotional',
        showLogo: false,
      };

    case 'Notifications':
      return {
        leftType: 'back',
        rightType: 'none',
        title: 'Notifications',
        showLogo: false,
      };

    default:
      return {
        leftType: 'back',
        rightType: 'none',
      };
  }
}
