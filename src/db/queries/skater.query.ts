export const getSkaterById = (id: string) => ({
  query: "SELECT * FROM skater WHERE id=$1",
  args: [id],
});

export const getSkaterByName = (name: string) => ({
  query: "SELECT * FROM skater WHERE name=$1",
  args: [name],
});

export const getAllSkaters = "SELECT * FROM skater ORDER BY created_at DESC";
