import pool from '@maria-db';
import { DBErrorWrapper } from '@utils/db';
import type { RowDataPacket } from 'mysql2';

class SqlBuilder {
    #selectStatement = '';
    #conditions: Array<string> = [];
    #limitClause = '';

    constructor(selectStatement: string) {
        this.#selectStatement = selectStatement;
    }

    /**
     * `WHERE`절에 조건을 추가한다.
     * @param condition `WHERE`절에 추가될 조건 (예: `"books"."category_id" = :categoryId`)
     */
    addCondition(condition: string): void {
        this.#conditions.push(condition);
    }
    /**
     * `LIMIT` 절을 지정한다.
     * @param limitClause `LIMIT`절 (예: `LIMIT :limit OFFSET :offset`)
     */
    setLimitClause(limitClause: string): void {
        this.#limitClause = limitClause;
    }

    build(): string {
        const sqls = [];

        sqls.push(this.#selectStatement);

        if (this.#conditions.length >= 1) {
            const whereClause = `WHERE ${this.#conditions.join(' AND ')}`;
            sqls.push(whereClause);
        }

        sqls.push(this.#limitClause);

        return sqls.join(' ');
    }
}

const findMany = DBErrorWrapper(
    async (
        pagination: Pagination,
        isNew: boolean,
        categoryId?: number
    ): Promise<Array<SimpleBook>> => {
        const sqlBuilder = new SqlBuilder(`
            SELECT "id", "title", "author", "price", "summary", "image_url" AS "imageUrl" 
            FROM "books"
        `);

        if (categoryId !== undefined) {
            sqlBuilder.addCondition(`"books"."category_id" = :categoryId`);
        }
        if (isNew) {
            sqlBuilder.addCondition(
                `"books"."publication_date" BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()`
            );
        }
        sqlBuilder.setLimitClause(`LIMIT :limit OFFSET :offset`);

        const sql = sqlBuilder.build();
        const values = {
            categoryId,
            isNew,
            offset: pagination.offset,
            limit: pagination.limit,
        };

        const [books] = await pool.execute<Array<SimpleBook>>(sql, values);

        return books;
    }
);

const findOne = DBErrorWrapper(
    async (id: number): Promise<DetailedBook | undefined> => {
        const sql = `
            SELECT 
                "books"."id", 
                "categories"."name" AS "category", 
                "formats"."name" AS "format", 
                "books"."isbn", 
                "books"."title", 
                "books"."author", 
                "books"."pages", 
                "books"."price", 
                "books"."publication_date" AS "publicationDate", 
                "books"."summary", 
                "books"."description", 
                "books"."table_of_contents" AS "tableOfContents", 
                "books"."image_url" AS "imageUrl", 
                (SELECT COUNT(*) FROM "likes" WHERE "book_id" = 1) AS "likes" 
            FROM "books" 
            LEFT JOIN "categories" 
                ON "categories"."id" = "books"."category_id" 
            LEFT JOIN "formats" 
                ON "formats"."id" = "books"."format_id" 
            WHERE "books"."id" = :id
            `;
        const values = { id };

        const [books] = await pool.execute<Array<DetailedBook>>(sql, values);

        return books[0];
    }
);

const count = DBErrorWrapper(async (): Promise<number> => {
    const sql = 'SELECT COUNT(*) AS "count" FROM "books"';

    const [counts] = await pool.execute<Array<Count>>(sql);

    if (counts[0] === undefined)
        throw Error('카운트 조회의 결과가 잘못되었습니다.');
    return counts[0].count;
});

interface SimpleBook extends RowDataPacket {
    id: number;
    title: string;
    author: string;
    price: number;
    summary: string | null;
    imageUrl: string | null;
}

interface DetailedBook extends SimpleBook {
    category: string;
    format: string;
    isbn: string;
    pages: number;
    publicationDate: string;
    description: string | null;
    tableOfContents: string | null;
    likes: number;
}

interface Count extends RowDataPacket {
    count: number;
}

interface Pagination {
    offset: number;
    limit: number;
}

export { count, findMany, findOne };
export type { Pagination };
