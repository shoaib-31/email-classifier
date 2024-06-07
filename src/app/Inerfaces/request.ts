import { NextApiRequest } from "next";

export interface CustomNextRequest extends NextApiRequest {
    user?: {
        sub: string;
        email: string;
        name: string;
        picture: string;
    };
}