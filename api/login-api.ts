import { APIRequestContext, APIResponse, expect, request } from "@playwright/test";
import type { LoginCase } from "../types/login-case";

const BASE_URL = "https://rahulshettyacademy.com";

export class LoginApi {
    private constructor(private readonly apiContext: APIRequestContext) { }

    static async create(): Promise<LoginApi> {
        const apiContext = await request.newContext({ baseURL: BASE_URL });
        return new LoginApi(apiContext);
    }

    async login({ userEmail, userPassword, expectedResult }: LoginCase): Promise<string> {
        const loginResponse = await this.apiContext.post("/api/ecom/auth/login", {
            data: { userEmail, userPassword },
        });

        switch (expectedResult) {
            case "success":
                return this.assertLoginSuccess(loginResponse, userEmail);
            case "invalidEmail":
                return this.assertInvalidEmail(loginResponse, userEmail);
            case "incorrectCredentials":
                return this.assertIncorrectCredentials(loginResponse, userEmail);
            case "requiredFields":
                return this.assertRequiredFields(loginResponse);
            default:
                throw new Error(`Unsupported login result: ${expectedResult}`);
        }
    }

    private async assertLoginSuccess(response: APIResponse, userEmail: string): Promise<string> {
        expect(response.ok(), `Login failed for ${userEmail}`).toBeTruthy();
        const responseBody = await response.json();
        expect(responseBody.token, "Login response missing token").toBeTruthy();
        expect(responseBody.message).toBe("Login Successfully");
        return responseBody.token as string;
    }

    private async assertInvalidEmail(response: APIResponse, userEmail: string): Promise<string> {
        expect(response.ok(), `Login should have failed for invalid email ${userEmail}`).toBeFalsy();
        const responseBody = await response.json();
        expect(responseBody.message).toBe("Incorrect email or password.");
        return "login failed";
    }

    private async assertIncorrectCredentials(response: APIResponse, userEmail: string): Promise<string> {
        expect(response.ok(), `Login should have failed for ${userEmail}`).toBeFalsy();
        const responseBody = await response.json();
        expect(responseBody.message).toBe("Incorrect email or password.");
        return "login failed";
    }

    private async assertRequiredFields(response: APIResponse): Promise<string> {
        expect(response.ok(), "Login should have failed for missing credentials").toBeFalsy();
        const responseBody = await response.json();
        expect(responseBody.message).toBe("Email is required");
        return "empty credentials";
    }

    async dispose(): Promise<void> {
        await this.apiContext.dispose();
    }

}
