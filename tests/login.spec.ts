import test from "@playwright/test";
import { loadJson } from "../utils/test-data-helper";
import { LoginCase } from "../types/login-case";
import { LoginApi } from "../api/login-api";

for (const loginCase of loadJson<LoginCase[]>("login-cases.json")) {
    test(`validate login with ${loginCase.name}`, async () => {
        const loginApi = await LoginApi.create();
        try {
            await loginApi.login(loginCase);
        } finally {
            await loginApi.dispose();
        }
    });
}