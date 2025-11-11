import type { Schema, Struct } from '@strapi/strapi';

export interface BookMarksUserBookMarksComponenet
  extends Struct.ComponentSchema {
  collectionName: 'components_book_marks_user_book_marks_componenets';
  info: {
    displayName: 'User BookMarksComponenet';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'book-marks.user-book-marks-componenet': BookMarksUserBookMarksComponenet;
    }
  }
}
