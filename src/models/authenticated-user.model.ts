export interface AuthenticatedUser extends Express.User {
    userId: string;
    email: string;
    name: string;
}
