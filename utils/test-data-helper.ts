import fs from "fs";
import { resolve } from "node:path";

export function loadJson<T>(fileName: string): T {
    const jsonPath = resolve( __dirname, `../test-data/${fileName}`);
    const fileContent = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(fileContent) as T;
}

export function createRegistrationUser<T extends { email: string }>(user: T): T {
    return {
        ...user,
        email: user.email.replace(
            "{timestamp}",
            Date.now().toString()
        ),
    };
}