export interface Annotations {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
}

export interface Text {
    content: string;
    link: unknown;
}

export interface TextBlock {
    type: string;
    text: Text;
    annotations: Annotations;
    plain_text: string;
    href: unknown;
}

export interface Page {
    object: string;
    id: string;
    created_time: string;
    last_edited_time: string;
    cover: unknown;
    icon: unknown;
    parent: {
        type: string;
        page_id: string;
    };
    archived: boolean;
    properties: {
        title: {
            id: string;
            type: string;
            title: TextBlock[];
        };
    };
    url: string;
}

export interface Block {
    object: string;
    id: string;
    created_time: string;
    last_edited_time: string;
    has_children: boolean;
    archived: boolean;
    type: string;
    child_page: { title: string };
}

export interface SimpleBlock {
    type: string;
    contents: string | string[] | undefined;
}

export interface Children {
    object: string;
    results: Block[];
}

export interface BulletedListItem {
    bulleted_list_item: {
        text: TextBlock[];
    };
}

export interface NumberedListItem {
    numbered_list_item: {
        text: TextBlock[];
    };
}

export interface Heading1 {
    heading_1: {
        text: TextBlock[];
    };
}

export interface Heading2 {
    heading_2: {
        text: TextBlock[];
    };
}

export interface Heading3 {
    heading_3: {
        text: TextBlock[];
    };
}

export interface Image {
    image: {
        caption: unknown;
        type: string;
        file?: {
            url: string;
            expiry_time: string;
        };
        external?: {
            url: string;
        };
    };
}

export interface Paragraph {
    paragraph: {
        text: TextBlock[];
    };
}

export interface Quote {
    quote: {
        text: TextBlock[];
    };
}

export interface GetPageOptions {
    api_key: string;
}

export const SupportedBlockTypes = Object.freeze({
    paragraph: 'paragraph',
    heading_1: 'heading_1',
    heading_2: 'heading_2',
    heading_3: 'heading_3',
    quote: 'quote',
    callout: 'callout',
    bulleted_list_item: 'bulleted_list_item',
    numbered_list_item: 'numbered_list_item',
    image: 'image'
});
