import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string): boolean => param.startsWith('url_');
