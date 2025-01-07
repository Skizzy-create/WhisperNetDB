import z from 'zod';

const createRoomSchema = z.object({
    roomName: z.string().max(256).nonempty(),
});

export { createRoomSchema };