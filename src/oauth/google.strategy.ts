import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";

export class GoogleOAuthStrategy {
    constructor(private readonly authService: AuthService) {
        this.init();
    }

    private init() {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: env.OAUTH_GOOGLE_CLIENT_ID!,
                    clientSecret: env.OAUTH_GOOGLE_SECRET!,
                    callbackURL: env.OAUTH_GOOGLE_CALLBACK_URL!,
                },
                this.verify.bind(this),
            ),
        );
    }

    public async verify(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: Error | null, user?: Express.User | false) => void,
    ) {
        try {
            const email = profile.emails?.[0]?.value;
            const name = profile.displayName;
            if (!email) return done(new Error("No email found"), false);
            const user = await this.authService.findOrCreateOAuthUser(email, name);
            return done(null, user);
        } catch (exception) {
            return done(exception instanceof Error ? exception : new Error(String(exception)), false);
        }
    }
}
