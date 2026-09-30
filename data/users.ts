import type { RegistrationUser } from '../types/registration-user';

export function createRegistrationUser(): RegistrationUser {
    return {
        firstName: 'Maryam',
        lastName: 'Hashem',
        email: `maryam.${Date.now()}@example.com`,
        phone: '1234567890',
        occupation: 'Student',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        gender: 'Female',
    };
}
