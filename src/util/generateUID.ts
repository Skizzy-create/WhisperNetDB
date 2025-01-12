// ../WhisperNet/src/util/generateUID.ts

import bcrypt from "bcrypt";

// creates UID for users & guest, based on the type of user,
// USERNAME, doj using hash function

const generateUID = async (USERNAME: string, PASSWORD: string, TYPE: "USER" = "USER"): Promise<string> => {
    console.log("Generating UID...");
    const type = TYPE.toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const finalString = `${type}-${USERNAME.toLowerCase()}-${PASSWORD.toLowerCase()}`;
    const hashedUID = await bcrypt.hash(finalString, salt);
    console.log("hashed UID = ", hashedUID);
    return hashedUID;
}

// comparing the hash inputs with hash to look for a match
const compareUID = async (UID: string, USERNAME: string, PASSWORD: string, TYPE: "USER" = "USER"): Promise<boolean> => {
    console.log("Comparing UID...");
    const type = TYPE.toLowerCase();
    const finalString = `${type}-${USERNAME.toLowerCase()}-${PASSWORD.toLowerCase()}`;
    const result = await bcrypt.compare(finalString, UID);
    console.log("UID Matched: ", result);
    return result;
}

export default generateUID;