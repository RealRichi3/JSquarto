/**
 *  This file is responsible for parsing comments in code files. 
 * It extracts various pieces of information such as 
 * description, category, subcategory, link, parameters, return values,
 * and thrown errors from comments using regular expressions.
 */

import { Params, ReturnedValue } from "../interfaces";

export default class Parser {
    // Get the description from the comments block - Basically the text after @description
    static getDescription(comment: string): string {
        //  Search through the comments block to find @description then return the description
        //  The description should match all the text after @description until the next @ that is a jsdoc tag
        const descriptionRegex = /@description\s+([\s\S]*?)(?=@\w|$)/g;
        const descriptionMatch = descriptionRegex.exec(comment);
        return descriptionMatch ? descriptionMatch[1] : '';
    }

    // Get the category from the comments block - Basically the text after @category
    static getCategory(comment: string): string {
        // Search through the comments block to find @category then return the category
        const categoryRegex = /@category\s+(.*)/g;
        const categoryMatches = categoryRegex.exec(comment);
        return categoryMatches ? categoryMatches[1] : '';
    }

    // Get the subcategory from the comments block - Basically the text after @subcategory
    static getSubCategory(comment: string): string {
        const subCategoryRegex = /@subcategory\s+(.*)/g;
        const subCategoryMatches = subCategoryRegex.exec(comment);
        return subCategoryMatches ? subCategoryMatches[1] : '';
    }

    // Get the link from the comments block - Basically the text after @see
    static getLink(comment: string): string {
        const linkRegex = /@see\s+(.*)/g;
        const linkMatches = linkRegex.exec(comment);
        return linkMatches ? linkMatches[1] : '';
    }

    // Get all params from the comments block
    static getParams(comment: string): Params[] {
        const paramsRegex = /@param\s+{?([\w.]+)?}?\s*([\w.]+)\s*-\s*(.*)/g;
        const paramsMatches = comment.match(paramsRegex);

        if (!paramsMatches) {
            return [];
        }

        const params: Params[] = [];
        for (const match of paramsMatches) {
            const [, type, name, description] = paramsRegex.exec(match) || [];

            if (!type || !name || !description) {
                continue;
            }

            params.push({
                name,
                type,
                description,
            });
        };

        return params;
    }

    // Get the module name from the comments block - Basically the text after @module
    static getModuleName(comment: string): string {
        const moduleRegex = /@module\s+(.*)/g;
        const moduleMatch = moduleRegex.exec(comment);
        return moduleMatch ? moduleMatch[1] : '';
    }

    // Get the returns from the comments block - Basically the text after @returns
    static getReturnsValues(comment: string): ReturnedValue[] {
        // ReturnedValue values may be multiple
        const returnsRegex = /@returns\s+{?([\w.]+)?}?\s*-\s*(.*)/g;

        const returnsMatches = comment.match(returnsRegex);
        if (!returnsMatches) {
            return [];
        }

        const returns: ReturnedValue[] = [];
        for (const match of returnsMatches) {
            const [, type, description] = returnsRegex.exec(match) || [];

            if (!type || !description) {
                continue;
            }

            returns.push({
                type,
                description,
            });
        };

        return returns;
    }

    // Get the thrown errors from the comments block - Basically the text after @throws
    static getThrownErrors(comment: string): ReturnedValue[] {
        // ThrownError values may be multiple
        const throwsRegex = /@throws\s+{?([\w.]+)?}?\s*-\s*(.*)/g;

        const throwsMatches = comment.match(throwsRegex);
        if (!throwsMatches) {
            return [];
        }

        const thrownErrors: ReturnedValue[] = [];
        for (const match of throwsMatches) {
            const [, type, description] = throwsRegex.exec(match) || [];

            if (!type || !description) {
                continue;
            }

            thrownErrors.push({
                type,
                description,
            });
        };

        return thrownErrors;
    }

}