import bcrypt from 'bcrypt';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET || "defaultTokenSecretsdknfkjsdnfsnflwenfeofnewwlcfnoweifnweolnfwloernsdfikwebfcs";

const hashPassword = async (password: string): Promise<string> => {
    try {
        console.log("Hashing password...");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log("Error while hashing password");
        console.error(error);
        return "";
    };
};

const comparePassword = async (hashPassword: string, password: string): Promise<boolean | null> => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (error) {
        console.log("Error while comparing password");
        console.error(error);
        return null;
    };
};

const generateToken = (USERNAME: string, UID: string): string | null => {
    try {
        console.log("Generating token...");
        const payload = {
            USERNAME,
            UID
        };
        const token = jsonwebtoken.sign(payload, TOKEN_SECRET, {
            expiresIn: '10h'
        });

        return token;

    } catch (error) {
        console.log("Error while generating token");
        console.error(error);
        return null;
    };
};

const verifyToken = (token: string): string | null | JwtPayload => {
    try {
        const decoded = jsonwebtoken.verify(token, TOKEN_SECRET);
        return decoded;
    } catch (error) {
        console.log("Error while decoding token");
        console.error(error);
        return null;
    };
};

export {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken
};