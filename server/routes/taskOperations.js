const { jwtDecode } = require('jwt-decode');
const sql = require('mssql');
const { v4: uuidv4 } = require('uuid');

exports.taskInsert = async (req, res) => {
    const { token, task } = req.body;

    if (!token || !task) {
        return res.status(400).send({ message: 'Task are required' });
    }

    try {
        const decodedToken = jwtDecode(token);
        const personID = decodedToken.personID;
        const taskID = uuidv4();

        if (!personID) {
            return res.status(400).send({ message: 'Invalid token' });
        }

        const insertResult = await sql.query`
            INSERT INTO Tasks (taskID, taskName, taskCompleted, personID)
            VALUES (${taskID}, ${task}, 0, ${personID});
        `;

        res.status(200).send({ message: 'Task inserted successfully' });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).send({ message: 'Error inserting task' });
    }
};
