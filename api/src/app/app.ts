import fastify, { type FastifyInstance } from "fastify";
import jwt from "@fastify/jwt"
import limit from "@fastify/rate-limit"
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"



const BuildApp = async (aplic: FastifyInstance) => {

    await aplic.register(jwt);
    await aplic.register(limit)


    return BuildApp

}