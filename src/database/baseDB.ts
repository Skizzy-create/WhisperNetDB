// /d:/Projects/WhisperNet/src/Database/baseDB.ts

interface Identifiable {
    [key: string]: any; // Flexible interface for any object
}

export class BaseDatabase<T extends Identifiable> {
    protected items: T[] = [];
    private dataPath: string;
    private uniqueKey: keyof T;

    constructor(dataPath: string, uniqueKey: keyof T) {
        this.dataPath = dataPath;
        this.uniqueKey = uniqueKey; // Specify the unique identifier property
        console.log(`Database initialized with path: ${dataPath}`);
    }

    // Other methods remain the same

    public findOne(criteria: Partial<T>): T | null {
        return this.items.find(item =>
            Object.entries(criteria).every(([key, value]) => item[key as keyof T] === value)
        ) || null;
    }

    public findById(id: string): T | null {
        return this.findOne({ [this.uniqueKey]: id } as Partial<T>);
    }

    public deleteById(id: string): boolean {
        return this.deleteItem({ [this.uniqueKey]: id } as Partial<T>);
    }

    // Rest of the class
}
