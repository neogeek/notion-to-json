import { getPageSimple } from './index';

if (!process.env.NOTION_AUTH_TOKEN) {
    throw new Error('NOTION_AUTH_TOKEN env value missing!');
}

const sharedOptions = Object.freeze({
    api_key: process.env.NOTION_AUTH_TOKEN
});

describe('getPageSimple', () => {
    // https://developers.notion.com/reference/errors#rate-limits
    afterEach(async () => {
        return await new Promise(resolve => {
            console.log('Pausing before next test.');

            setTimeout(resolve, 1000);
        });
    });

    test('page title', async () => {
        const page = await getPageSimple(
            '1369c313d6af4ce29f01229595eaf50c',
            sharedOptions
        );

        expect(page.title).toBe('Page: Title');
    });
    describe('annotations', () => {
        test('combined', async () => {
            const page = await getPageSimple(
                'd63f62b86bcf41719e83e339e7f51aa2',
                sharedOptions
            );

            expect(page.blocks[0].contents).toBe(
                '<b>Lorem ipsum</b> dolor sit amet, <i>consectetur adipisicing elit</i>, sed do <u>eiusmod</u> tempor <strike>incididunt</strike> ut labore et dolore magna aliqua.'
            );
        });
        test('bold', async () => {
            const page = await getPageSimple(
                'f482cc83d67f42e4ae716119f0984a13',
                sharedOptions
            );

            expect(page.blocks[0].contents).toBe('<b>This text is bold.</b>');
        });
        test('italic', async () => {
            const page = await getPageSimple(
                'e0eedf4219c44736a326f3f4bf9b095d',
                sharedOptions
            );

            expect(page.blocks[0].contents).toBe('<i>This text is italic.</i>');
        });
        test('strikethrough', async () => {
            const page = await getPageSimple(
                '46aae5c4226447afacdb134dbedeab1d',
                sharedOptions
            );

            expect(page.blocks[0].contents).toBe(
                '<strike>This text is strikethrough.</strike>'
            );
        });
        test('underline', async () => {
            const page = await getPageSimple(
                '8c160a43dcac457da0c793954d0d783b',
                sharedOptions
            );

            expect(page.blocks[0].contents).toBe(
                '<u>This text is underlined.</u>'
            );
        });
        test('link', async () => {
            const page = await getPageSimple(
                '2318330d3a8f4cf799863a2a38691cf8',
                sharedOptions
            );

            expect(page.blocks[0].contents).toBe(
                '<a href="https://notion.so">https://notion.so</a>'
            );
        });
    });

    describe('blocks', () => {
        test('callout', async () => {
            const page = await getPageSimple(
                'ccbfde22967e4af5855bc4fa29ad470f',
                sharedOptions
            );

            expect(page.blocks[0].type).toBe('callout');
            expect(page.blocks[0].contents).toBe('Callout');
        });
        test('paragraph', async () => {
            const page = await getPageSimple(
                'b47f419b5f2e4ebc807d755a44ec7bb0',
                sharedOptions
            );

            expect(page.blocks[0].type).toBe('paragraph');
            expect(page.blocks[0].contents).toBe(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sapien pellentesque habitant morbi tristique senectus et. Enim nec dui nunc mattis enim. Vitae tortor condimentum lacinia quis vel. Integer vitae justo eget magna fermentum iaculis eu non diam. Lectus proin nibh nisl condimentum id venenatis. In est ante in nibh mauris cursus mattis. Diam ut venenatis tellus in metus vulputate eu scelerisque felis. Euismod lacinia at quis risus sed vulputate odio. Fermentum iaculis eu non diam phasellus vestibulum lorem. Vitae auctor eu augue ut lectus. Pellentesque sit amet porttitor eget dolor morbi. Nullam non nisi est sit amet facilisis magna etiam. Cursus in hac habitasse platea dictumst quisque. Pulvinar elementum integer enim neque volutpat.'
            );

            expect(page.blocks[4].type).toBe('paragraph');
            expect(page.blocks[4].contents).toBe(
                'Et malesuada fames ac turpis egestas maecenas pharetra convallis. Nisl suscipit adipiscing bibendum est ultricies integer. Dolor purus non enim praesent elementum facilisis. Non diam phasellus vestibulum lorem sed risus. Vulputate enim nulla aliquet porttitor lacus luctus accumsan. Dignissim convallis aenean et tortor at risus viverra adipiscing at. Blandit cursus risus at ultrices mi tempus imperdiet nulla. In ante metus dictum at tempor commodo. Dui sapien eget mi proin sed libero enim sed faucibus. Mi quis hendrerit dolor magna. Dui accumsan sit amet nulla facilisi morbi tempus. Tellus orci ac auctor augue mauris augue. Duis convallis convallis tellus id interdum velit. Pretium nibh ipsum consequat nisl vel pretium lectus quam id. Nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit. Nibh venenatis cras sed felis eget velit aliquet sagittis id. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur. Quisque egestas diam in arcu.'
            );
        });
        test('image', async () => {
            const page = await getPageSimple(
                '4602c2e456774750a16e71a561131d88',
                sharedOptions
            );

            expect(page.blocks[0].type).toBe('image');
            expect(page.blocks[0].contents).toContain('zim.jpg');

            expect(page.blocks[1].type).toBe('image');
            expect(page.blocks[1].contents).toBe(
                'https://duckduckgo.com/assets/about/hiker.svg'
            );
        });
        test('heading', async () => {
            const page = await getPageSimple(
                'b0614d6244ab4de19424cb509b5a2a09',
                sharedOptions
            );

            expect(page.blocks[0].type).toBe('heading_1');
            expect(page.blocks[0].contents).toBe('Heading 1');

            expect(page.blocks[1].type).toBe('heading_2');
            expect(page.blocks[1].contents).toBe('Heading 2');

            expect(page.blocks[2].type).toBe('heading_3');
            expect(page.blocks[2].contents).toBe('Heading 3');
        });
        test('quote', async () => {
            const page = await getPageSimple(
                '52f19fd2ba5643f8bf901a04e4da8174',
                sharedOptions
            );

            expect(page.blocks[0].type).toBe('quote');
            expect(page.blocks[0].contents).toBe('Quote');
        });
        test('lists', async () => {
            const page = await getPageSimple(
                'dbde2983c3b6471f813c26bd0dd3bf79',
                sharedOptions
            );

            expect(page.blocks[0].type).toBe('bulleted_list_item');

            if (!Array.isArray(page.blocks[0].contents)) {
                throw Error('Contents not array.');
            }

            expect(page.blocks[0].contents).toHaveLength(3);
            expect(page.blocks[0].contents[0]).toBe('Bulleted list item 1');
            expect(page.blocks[0].contents[1]).toBe('Bulleted list item 2');
            expect(page.blocks[0].contents[2]).toBe('Bulleted list item 3');

            expect(page.blocks[1].contents).toBe('');

            expect(page.blocks[2].type).toBe('numbered_list_item');

            if (!Array.isArray(page.blocks[2].contents)) {
                throw Error('Contents not array.');
            }

            expect(page.blocks[2].contents).toHaveLength(3);
            expect(page.blocks[2].contents[0]).toBe('Numbered list item 1');
            expect(page.blocks[2].contents[1]).toBe('Numbered list item 2');
            expect(page.blocks[2].contents[2]).toBe('Numbered list item 3');
        });
    });
});
