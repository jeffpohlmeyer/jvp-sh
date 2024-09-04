import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string): boolean => param.startsWith('token_');
