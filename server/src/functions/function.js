export const isPhoneNoExist = async (phoneNo, db)=>{
    const query=`
        SELECT *
        FROM User
        WHERE phoneNo = ?
    `
    const [rows] = await db.query(query,[phoneNo])
    if(rows.length>0) return true
    return false
}

export const insertUser = async (credentials, db)=>{
    const {firstName,lastName,age,phoneNo,subscription,hashedPassword}=credentials
    const query=`
        INSERT INTO User (firstName, lastName, age, phoneNo, subscription, password)
        VALUES (?,?,?,?,?,?)
    `
    await db.query(query,[firstName,lastName,age,phoneNo,subscription,hashedPassword])
    return true
}
