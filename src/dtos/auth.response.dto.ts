import { z } from "zod";

export class AuthResponseDTO {
    public static readonly schema = z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        user: z.object({
            id: z.string(),
            email: z.email(),
            verified: z.boolean(),
        }),
    });
    public static readonly type = AuthResponseDTO.schema;
}
export type AuthResponse = z.infer<typeof AuthResponseDTO.schema>;
