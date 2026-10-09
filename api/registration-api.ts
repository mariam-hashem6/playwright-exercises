import { APIRequestContext, expect, request } from "@playwright/test";
import { User } from "../types/user";
const BASE_URL = "https://rahulshettyacademy.com";

export class RegisterApi {
  private constructor(private readonly apiContext: APIRequestContext) {}

  static async create(): Promise<RegisterApi> {
    const apiContext = await request.newContext({baseURL: BASE_URL});
    return new RegisterApi(apiContext);
  }

  async register(user: User): Promise<void> {
    const registerResponse = await this.apiContext.post(
      "/api/ecom/auth/register",
      {
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          userEmail: user.email,
          userRole: "user",
          occupation: user.occupation,
          gender: user.gender,
          userMobile: user.phone,
          userPassword: user.password,
          confirmPassword: user.confirmPassword,
          required: true,
        },
      }
    );
    expect(registerResponse.ok(),).toBeTruthy();
  }

  async dispose(): Promise<void> {
    await this.apiContext.dispose();
  }
}