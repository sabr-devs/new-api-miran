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

export interface SectionsSectionItems extends Struct.ComponentSchema {
  collectionName: 'components_sections_section_items';
  info: {
    displayName: 'section-items';
  };
  attributes: {
    authors: Schema.Attribute.String;
    page: Schema.Attribute.Integer;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'book-marks.user-book-marks-componenet': BookMarksUserBookMarksComponenet;
      'sections.section-items': SectionsSectionItems;
    }
  }
}
