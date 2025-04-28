export const getSkaterById = (id: string) => ({
  query: "SELECT * FROM skater WHERE id=$1",
  args: [id],
});

export const getSkaterByEmail = (email: string) => ({
  query: "SELECT * FROM skater WHERE email=$1",
  args: [email],
});

export const getFriendsByEmail = (email: string) => ({
  query:
    "SELECT * FROM friends WHERE (skaterA=$1 OR skaterB=$1) ORDER BY created_at DESC",
  args: [email],
});

export const getAllSkaters = "SELECT * FROM skater ORDER BY created_at DESC";
