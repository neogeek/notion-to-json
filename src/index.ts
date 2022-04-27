import { get } from './api';

import {
    Block,
    Children,
    GetPageOptions,
    Image,
    Page,
    SimpleBlock,
    SupportedBlockTypes,
    TextBlock
} from './types';

const getPageRaw = async (
    pageId: string,
    options: GetPageOptions = { api_key: '' }
): Promise<{ parent: Page; children: Children }> => {
    return {
        parent: await get<Page>(`pages/${pageId}`, options),
        children: await get<Children>(`blocks/${pageId}/children`, options)
    };
};

const getPage = async (
    pageId: string,
    options: GetPageOptions = { api_key: '' }
): Promise<{ title: string; blocks: Block[] }> => {
    const page = await getPageRaw(pageId, options);

    return {
        title: page.parent.properties.title.title[0].plain_text,
        blocks: page.children.results.reduce(
            (blocks: Block[], block: Block) => {
                if (Object.keys(SupportedBlockTypes).includes(block.type)) {
                    return [...blocks, block];
                } else {
                    console.log(`Unsupported block type: ${block.type}`);
                }
                return blocks;
            },
            []
        )
    };
};

const getPageSimple = async (
    pageId: string,
    options: GetPageOptions = { api_key: '' }
): Promise<{
    title: string;
    blocks: SimpleBlock[];
}> => {
    const page = await getPage(pageId, options);

    return {
        title: page.title,
        blocks: page.blocks.reduce<SimpleBlock[]>(
            (blocks: SimpleBlock[], currentBlock: Block) => {
                if (
                    [
                        SupportedBlockTypes.paragraph,
                        SupportedBlockTypes.heading_1,
                        SupportedBlockTypes.heading_2,
                        SupportedBlockTypes.heading_3,
                        SupportedBlockTypes.quote,
                        SupportedBlockTypes.callout
                    ].includes(currentBlock.type)
                ) {
                    return [
                        ...blocks,
                        {
                            type: currentBlock.type,
                            contents: (
                                (currentBlock as any)[currentBlock.type]
                                    .text as TextBlock[]
                            )
                                .map(renderAnnotationsAsHTML)
                                .join('')
                        }
                    ];
                } else if (
                    [
                        SupportedBlockTypes.bulleted_list_item,
                        SupportedBlockTypes.numbered_list_item
                    ].includes(currentBlock.type)
                ) {
                    const previousBlock = blocks[blocks.length - 1];

                    if (
                        previousBlock &&
                        previousBlock.type === currentBlock.type
                    ) {
                        (previousBlock.contents as string[]).push(
                            (
                                (currentBlock as any)[currentBlock.type]
                                    .text as TextBlock[]
                            )
                                .map(textBlock =>
                                    renderAnnotationsAsHTML(textBlock)
                                )
                                .join('')
                        );

                        return blocks;
                    }

                    return [
                        ...blocks,
                        {
                            type: currentBlock.type,
                            contents: [
                                (
                                    (currentBlock as any)[currentBlock.type]
                                        .text as TextBlock[]
                                )
                                    .map(textBlock =>
                                        renderAnnotationsAsHTML(textBlock)
                                    )
                                    .join('')
                            ]
                        }
                    ];
                } else if (currentBlock.type === SupportedBlockTypes.image) {
                    const { image } = currentBlock as Block & Image;

                    return [
                        ...blocks,
                        {
                            type: currentBlock.type,
                            contents: image.external?.url || image.file?.url
                        }
                    ];
                }

                return blocks;
            },
            []
        )
    };
};

const renderAnnotationsAsHTML = ({
    text,
    annotations,
    href
}: TextBlock): string => {
    const startAnnotions = [];
    const endAnnotions = [];

    if (annotations.bold) {
        startAnnotions.unshift('<b>');
        endAnnotions.push(`</b>`);
    }

    if (annotations.italic) {
        startAnnotions.unshift('<i>');
        endAnnotions.push(`</i>`);
    }

    if (annotations.underline) {
        startAnnotions.unshift('<u>');
        endAnnotions.push(`</u>`);
    }

    if (annotations.strikethrough) {
        startAnnotions.unshift('<strike>');
        endAnnotions.push(`</strike>`);
    }

    if (href) {
        startAnnotions.unshift(`<a href="${href}">`);
        endAnnotions.push('</a>');
    }

    return `${startAnnotions.join('')}${text.content}${endAnnotions.join('')}`;
};

export { getPageRaw, getPage, getPageSimple };
