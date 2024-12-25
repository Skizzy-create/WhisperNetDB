import bcrypt from 'bcrypt';

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
    }
    return null;
};

export {
    hashPassword,
    comparePassword
}