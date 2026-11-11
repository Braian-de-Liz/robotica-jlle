import type { FastifyInstance } from 'fastify'

const start = async (Fastify: FastifyInstance) => {

    Fastify.listen({ port: 3333, host: "0.0.0.0" });
}


start();