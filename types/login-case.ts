export type LoginCase = {
    name: string;
    email: string;
    password: string;
    expectedResult:
        | 'success'
        | 'invalidEmail'
        | 'incorrectCredentials'
        | 'requiredFields';
};