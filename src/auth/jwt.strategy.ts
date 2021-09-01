import { Strategy, ExtractJwt } from "passport-jwt";
import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {jwtConstants} from "./constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        });
    }

    public async validate(payload: any) {
        console.log(payload)
        return { login: payload.login, id: payload.userId }
    }
}
