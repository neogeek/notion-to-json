import fetch from 'node-fetch';

import { GetPageOptions } from './types';

const NOTION_VERSION = '2021-08-16';

const NOTION_API_URL = new URL('https://api.notion.com/v1/');

export const get = async <T>(
    path: string,
    options: GetPageOptions = { api_key: '' }
) =>
    (await (
        await fetch(new URL(path, NOTION_API_URL).href, {
            headers: {
                'Notion-Version': NOTION_VERSION,
                Authorization: `Bearer ${options.api_key}`
            }
        })
    ).json()) as T;
