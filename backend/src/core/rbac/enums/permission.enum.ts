export enum PermissionEnum {
  // users
  User_Create = 'user_create',
  User_Read = 'user_read',
  User_Update = 'user_update',
  User_Delete = 'user_delete',

  // roles
  Role_Create = 'role_create',
  Role_Read = 'role_read',
  Role_Update = 'role_update',
  Role_Delete = 'role_delete',

  // permissions
  Permission_Create = 'permission_create',
  Permission_Read = 'permission_read',
  Permission_Update = 'permission_update',
  Permission_Delete = 'permission_delete',

  // categories
  Category_Read = 'category_read',

  // venues
  Venue_Read = 'venue_read',

  // events
  Event_Read = 'event_read',

  // user-category-preferences
  UserCategory_Preference_Toggle = 'user_category_preference_toggle',
}
