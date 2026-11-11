import * as schema from './schema';
import fp from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/bun-sql';
import { sql } from 'bun';
import { eq, and, or, gt, lt, ne, inArray, desc, asc, defineRelations } from 'drizzle-orm';


const createDb = () => drizzle({ client: sql, relations: defineRelations(schema) });

export type DrizzleDB = ReturnType<typeof createDb>;

declare module 'fastify' {
    interface FastifyInstance {
        drizzle_plugin: DrizzleDB;
        tables: typeof schema;
        op: {
            eq: typeof eq;
            and: typeof and;
            or: typeof or;
            gt: typeof gt;
            lt: typeof lt;
            ne: typeof ne;
            inArray: typeof inArray;
            desc: typeof desc;
            asc: typeof asc;
        };
    }
}

const op = { eq, and, or, gt, lt, ne, inArray, desc, asc };



export default fp(async (ComandLiz) => {
    const drizzle_plugin = createDb();

    ComandLiz.decorate("drizzle_plugin", drizzle_plugin);
    ComandLiz.decorate("op", op);
    ComandLiz.decorate("tables", schema);

    ComandLiz.addHook('onClose', async () => {
        sql.close();
    });
}, { name: 'drizzle' });