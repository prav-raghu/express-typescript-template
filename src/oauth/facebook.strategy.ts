import passport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import { env } from "../config/env";
import { AuthService } from "../services/auth.service";

export class FacebookAuthStrategy {
    constructor(private readonly authService: AuthService) {
        passport.use(
            new FacebookStrategy(
                {
                    clientID: env.OAUTH_FB_CLIENT_ID!,
                    clientSecret: env.OAUTH_FB_SECRET!,
                    callbackURL: env.OAUTH_FB_CALLBACK_URL!,
                    profileFields: ["id", "emails", "name"],
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
