# What is metronom?

Metronom is user friendly Redis ORM based on  [node-redis](https://github.com/redis/node-redis) 

You can  **save**,  **read**,  **update**,  **filter**,  **delete**  and  **bulk**  operations JavaScript objects in Redis  **without needing to know Redis commands**.

It is used effortlessly without installing any plugins like RedisJSON. The system works with Hashes. It shreds the objects and saves them as key strings in the hash, and while reading, they break it down again according to the given scheme and type conversion with TypeScript. ***Also you can use String Data type too.***

> Although currently only Hash and String types are processed, our [new version](https://github.com/anchovycation/metronom/milestone/2 "see v3.0.0 milestone") that will support [all core types](https://redis.io/docs/data-types/) is on the way.

[![npm version](https://badgen.net/npm/v/metronom)](https://www.npmjs.com/package/metronom)
[![download](https://badgen.net/npm/dt/metronom)](https://www.npmjs.com/package/metronom)
[![merged prs](https://badgen.net/github/merged-prs/anchovycation/metronom)](https://github.com/anchovycation/metronom)
[![last commit](https://badgen.net/github/last-commit/anchovycation/metronom/main)](https://github.com/anchovycation/metronom)
[![types](https://badgen.net/npm/types/metronom)](https://github.com/anchovycation/metronom)
[![license](https://badgen.net/npm/license/metronom)](https://www.npmjs.com/package/metronom)
