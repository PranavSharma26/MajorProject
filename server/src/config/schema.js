export const createTables = async (db) => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS User(
			id INT AUTO_INCREMENT PRIMARY KEY,
			firstName VARCHAR(20),
			lastName VARCHAR(20),
			age INT(3),
			phoneNo VARCHAR(15) UNIQUE,
			subscription VARCHAR(10),
			password VARCHAR(300) NOT NULL
    )    
  `)
}