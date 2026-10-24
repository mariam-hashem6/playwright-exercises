export type LoginCase = {
    name: string;
    userEmail: string;
    userPassword: string;
    expectedResult:
        | 'success'
        | 'invalidEmail'
        | 'incorrectCredentials'
        | 'requiredFields';
};