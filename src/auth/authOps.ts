import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(200);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log("Error while hashing password");
        console.error(error);
        return "";
    };
};

export {
    hashPassword
}