#!/usr/bin/env node
import { Command } from "commander";
import { startServer, clearCache } from "../server.js";
const program = new Command();
program
    .option("--port <number>", "port to run the proxy on")
    .option("--origin <url>", "origin server URL")
    .option("--clear-cache", "clear the cache");
program.parse(process.argv);
const options = program.opts();
if (options.clearCache) {
    clearCache();
    process.exit(0);
}
if (!options.port || !options.origin) {
    console.error("--port and --origin are required");
    process.exit(1);
}
startServer({
    port: Number(options.port),
    origin: options.origin,
});
